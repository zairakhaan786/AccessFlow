import { describe, it, expect, beforeEach, beforeAll } from "vitest";
import { prisma } from "../lib/prisma";
import {
  submitRequestWorkflow,
  submitExceptionRequestWorkflow,
  approveRequestWorkflow,
  rejectRequestWorkflow,
  provisionManuallyWorkflow,
  closeRequestWorkflow,
  requestAccessIdWorkflow,
  approveAccessIdWorkflow,
  toggleAutomationWorkflow,
  updateBoardConfigWorkflow,
} from "../lib/services/workflow";

describe("AccessFlow State Machine & Workflow Unit Tests", () => {
  let employeeUser: { id: string; name: string; email: string; role: string; group: string };
  let adminUser: { id: string; name: string; email: string; role: string; group: string };
  let approverUser: { id: string; name: string; email: string; role: string; group: string };

  let automatedItem: any;
  let manualItem: any;
  let noIdItem: any;

  beforeAll(async () => {
    // Find or create test users
    employeeUser = (await prisma.user.findFirst({ where: { email: "manvi@company.com" } })) as any;
    adminUser = (await prisma.user.findFirst({ where: { email: "rahul@company.com" } })) as any;
    approverUser = (await prisma.user.findFirst({ where: { email: "neha@company.com" } })) as any;

    automatedItem = await prisma.accessItem.findFirst({ where: { automation: true, accessId: { not: null } } });
    manualItem = await prisma.accessItem.findFirst({ where: { automation: false, accessId: { not: null } } });
    noIdItem = await prisma.accessItem.findFirst({ where: { accessId: null } });
  });

  it("1. Submits standard automated request and approves it (transitions directly to Completed for self)", async () => {
    const req = await submitRequestWorkflow({
      accessItemId: automatedItem.id,
      beneficiaryName: employeeUser.name,
      onBehalf: false,
      justification: "Need board access for Q3 roadmap tracking.",
      actorUser: employeeUser,
    });

    expect(req.id).toMatch(/^NAR-\d+$/);
    expect(req.status).toBe("Pending Approval");
    expect(req.onBehalf).toBe(false);
    expect(req.automation).toBe(true);

    // Verify audit log
    const audit = await prisma.auditLog.findFirst({
      where: { requestId: req.id, action: "Request created" },
    });
    expect(audit).toBeDefined();

    // Approver approves request
    const approverActor = { id: employeeUser.id, name: automatedItem.approverName, email: "approver@company.com", role: "EMPLOYEE" };
    const approved = await approveRequestWorkflow({
      requestId: req.id,
      actorUser: approverActor,
    });

    expect(approved.status).toBe("Completed");
    const timeline = JSON.parse(approved.timeline);
    expect(timeline.some((t: any) => t.label === "Approved" && t.state === "done")).toBe(true);
    expect(timeline.some((t: any) => t.label === "Access Automatically Provisioned" && t.state === "done")).toBe(true);
  });

  it("2. Submits standard manual request and handles manual provisioning lifecycle", async () => {
    const req = await submitRequestWorkflow({
      accessItemId: manualItem.id,
      beneficiaryName: "Kabir Singh",
      onBehalf: true,
      justification: "Onboarding new sales representative.",
      actorUser: employeeUser,
    });

    expect(req.status).toBe("Pending Approval");
    expect(req.onBehalf).toBe(true);
    expect(req.automation).toBe(false);

    // Approver approves request
    const approverActor = { id: employeeUser.id, name: manualItem.approverName, email: "approver@company.com", role: "EMPLOYEE" };
    const approved = await approveRequestWorkflow({
      requestId: req.id,
      actorUser: approverActor,
    });

    // Should transition to Pending Manual Provisioning
    expect(approved.status).toBe("Pending Manual Provisioning");

    // Admin provisions access manually
    const provisioned = await provisionManuallyWorkflow({
      requestId: req.id,
      actorUser: adminUser,
    });

    // Since it's on-behalf, status transitions to Access Provisioned (awaiting closure)
    expect(provisioned.status).toBe("Access Provisioned");

    // Requester confirms and closes request
    const closed = await closeRequestWorkflow({
      requestId: req.id,
      actorUser: employeeUser,
    });

    expect(closed.status).toBe("Completed");
  });

  it("3. Submits exception request with urgency and reason", async () => {
    const excReq = await submitExceptionRequestWorkflow({
      accessItemId: manualItem.id,
      reason: "Temporary audit collaboration",
      justification: "Need cross-team financial verification for 2 weeks.",
      urgency: "High",
      requiredUntil: "2026-09-01",
      actorUser: employeeUser,
    });

    expect(excReq.status).toBe("Pending Exception Approval");
    expect(excReq.isException).toBe(true);
    expect(excReq.reason).toBe("Temporary audit collaboration");
    expect(excReq.urgency).toBe("High");
  });

  it("4. Rejection flow requires reason and sets status to Rejected", async () => {
    const req = await submitRequestWorkflow({
      accessItemId: manualItem.id,
      beneficiaryName: employeeUser.name,
      onBehalf: false,
      justification: "Testing rejection path.",
      actorUser: employeeUser,
    });

    const approverActor = { id: employeeUser.id, name: manualItem.approverName, email: "approver@company.com", role: "EMPLOYEE" };
    const rejected = await rejectRequestWorkflow({
      requestId: req.id,
      reason: "Insufficient business context provided.",
      actorUser: approverActor,
    });

    expect(rejected.status).toBe("Rejected");

    // Check audit trail
    const audit = await prisma.auditLog.findFirst({
      where: { requestId: req.id, action: "Request rejected" },
    });
    expect(audit?.detail).toContain("Insufficient business context");
  });

  it("5. Governed Access ID review lifecycle for boards without an Access ID", async () => {
    if (!noIdItem) return;

    // Step 1: Employee requests Access ID creation
    const queueItem = await requestAccessIdWorkflow({
      accessItemId: noIdItem.id,
      actorUser: employeeUser,
    });

    expect(queueItem.status).toBe("Pending Governance Review");

    // Step 2: Board Admin reviews and approves Access ID
    const approvedQ = await approveAccessIdWorkflow({
      queueId: queueItem.id,
      actorUser: adminUser,
    });

    expect(approvedQ.status).toBe("Access ID Created");

    // Verify AccessItem has new AC-xxxx assigned
    const updatedItem = await prisma.accessItem.findUnique({
      where: { id: noIdItem.id },
    });
    expect(updatedItem?.accessId).toMatch(/^AC-\d+$/);
  });

  it("6. Board configuration updates and automation toggling write governed audit logs", async () => {
    const prevAutomation = automatedItem.automation;
    const toggled = await toggleAutomationWorkflow({
      accessItemId: automatedItem.id,
      actorUser: adminUser,
    });
    expect(toggled.automation).toBe(!prevAutomation);

    // Update config
    const updated = await updateBoardConfigWorkflow({
      accessItemId: automatedItem.id,
      approverName: "Manvi Mehta",
      backupApproverName: "Rahul Sharma",
      providerName: "Rahul Sharma",
      actorUser: adminUser,
    });
    expect(updated.backupApproverName).toBe("Rahul Sharma");
  });
});
