import { prisma } from "@/lib/prisma";

export interface TimelineStep {
  label: string;
  actor: string;
  ts: string;
  state: "done" | "current" | "pending";
}

export function formatCurrentTimestamp(): string {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleDateString("en-US", options);
}

export async function generateNextNarId(): Promise<string> {
  const allRequests = await prisma.accessRequest.findMany({
    select: { id: true },
  });

  let maxNum = 10480;
  for (const r of allRequests) {
    if (r.id.startsWith("NAR-")) {
      const num = parseInt(r.id.replace("NAR-", ""), 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }

  return `NAR-${maxNum + 1}`;
}

export async function submitRequestWorkflow({
  accessItemId,
  beneficiaryName,
  onBehalf,
  justification,
  actorUser,
}: {
  accessItemId: string;
  beneficiaryName: string;
  onBehalf: boolean;
  justification: string;
  actorUser: { id: string; name: string; email: string; role: string; group: string };
}) {
  const access = await prisma.accessItem.findUnique({
    where: { id: accessItemId },
  });

  if (!access) {
    throw new Error("Access item not found");
  }

  // Validate Access ID presence
  if (!access.accessId) {
    throw new Error("This board requires an Access ID before requests can be submitted.");
  }

  const id = await generateNextNarId();
  const nowTs = formatCurrentTimestamp();

  const timeline: TimelineStep[] = [
    { label: "Request Submitted", actor: actorUser.name, ts: nowTs, state: "done" },
    { label: "Pending Approval", actor: access.approverName, ts: "—", state: "current" },
    {
      label: access.automation ? "Provisioning" : "Pending Manual Provisioning",
      actor: "",
      ts: "",
      state: "pending",
    },
    {
      label: onBehalf ? "Access Provisioned" : "Completed",
      actor: "",
      ts: "",
      state: "pending",
    },
  ];

  const accessLabel = `${access.tool} – ${access.name}`;

  const request = await prisma.accessRequest.create({
    data: {
      id,
      accessItemId: access.id,
      accessLabel,
      requesterId: actorUser.id,
      requesterName: actorUser.name,
      beneficiaryName,
      onBehalf,
      isException: false,
      approverName: access.approverName,
      providerName: access.providerName,
      automation: access.automation,
      justification,
      status: "Pending Approval",
      timeline: JSON.stringify(timeline),
    },
  });

  // Append Audit Log
  await prisma.auditLog.create({
    data: {
      actorId: actorUser.id,
      actorName: actorUser.name,
      action: "Request created",
      detail: `${id} — ${accessLabel}`,
      requestId: id,
    },
  });

  // Dispatch Notification to approver
  if (access.approverName !== actorUser.name) {
    const approverUser = await prisma.user.findFirst({
      where: { name: access.approverName },
    });

    await prisma.notification.create({
      data: {
        userId: approverUser?.id || null,
        role: approverUser?.role === "BOARD_ADMIN" ? "admin" : "employee",
        text: `New access request from ${actorUser.name} awaiting approval for ${accessLabel}.`,
        channel: "slack",
        read: false,
      },
    });
  }

  return request;
}

export async function submitExceptionRequestWorkflow({
  accessItemId,
  reason,
  justification,
  requiredUntil,
  urgency = "Medium",
  actorUser,
}: {
  accessItemId: string;
  reason: string;
  justification: string;
  requiredUntil?: string;
  urgency?: string;
  actorUser: { id: string; name: string; email: string; role: string; group: string };
}) {
  const access = await prisma.accessItem.findUnique({
    where: { id: accessItemId },
  });

  if (!access) {
    throw new Error("Access item not found");
  }

  const id = await generateNextNarId();
  const nowTs = formatCurrentTimestamp();

  const timeline: TimelineStep[] = [
    { label: "Exception Request Submitted", actor: actorUser.name, ts: nowTs, state: "done" },
    { label: "Pending Exception Approval", actor: access.approverName, ts: "—", state: "current" },
    {
      label: access.automation ? "Provisioning" : "Pending Manual Provisioning",
      actor: "",
      ts: "",
      state: "pending",
    },
    { label: "Completed", actor: "", ts: "", state: "pending" },
  ];

  const accessLabel = `${access.tool} – ${access.name}`;

  const request = await prisma.accessRequest.create({
    data: {
      id,
      accessItemId: access.id,
      accessLabel,
      requesterId: actorUser.id,
      requesterName: actorUser.name,
      beneficiaryName: actorUser.name,
      onBehalf: false,
      isException: true,
      reason,
      requiredUntil,
      urgency,
      approverName: access.approverName,
      providerName: access.providerName,
      automation: access.automation,
      justification,
      status: "Pending Exception Approval",
      timeline: JSON.stringify(timeline),
    },
  });

  // Append Audit Log
  await prisma.auditLog.create({
    data: {
      actorId: actorUser.id,
      actorName: actorUser.name,
      action: "Exception request created",
      detail: `${id} — ${accessLabel} (outside ${access.group})`,
      requestId: id,
    },
  });

  // Dispatch Notification
  const approverUser = await prisma.user.findFirst({
    where: { name: access.approverName },
  });

  await prisma.notification.create({
    data: {
      userId: approverUser?.id || null,
      role: approverUser?.role === "BOARD_ADMIN" ? "admin" : "employee",
      text: `Access exception request from ${actorUser.name} awaiting your review for ${accessLabel}.`,
      channel: "slack",
      read: false,
    },
  });

  return request;
}

export async function approveRequestWorkflow({
  requestId,
  actorUser,
}: {
  requestId: string;
  actorUser: { id: string; name: string; email: string; role: string };
}) {
  const request = await prisma.accessRequest.findUnique({
    where: { id: requestId },
    include: { accessItem: true },
  });

  if (!request) {
    throw new Error("Request not found");
  }

  if (
    request.status !== "Pending Approval" &&
    request.status !== "Pending Exception Approval"
  ) {
    throw new Error(`Cannot approve request in status: ${request.status}`);
  }

  // Permission check: approver, backup approver, or board admin
  const isApprover =
    request.approverName === actorUser.name ||
    request.accessItem.backupApproverName === actorUser.name ||
    actorUser.role === "BOARD_ADMIN";

  if (!isApprover) {
    throw new Error("You do not have permission to approve this request.");
  }

  const nowTs = formatCurrentTimestamp();
  const existingTimeline: TimelineStep[] = JSON.parse(request.timeline);
  const approvedStep: TimelineStep = {
    label: "Approved",
    actor: actorUser.name,
    ts: nowTs,
    state: "done",
  };

  let newStatus = "";
  let updatedTimeline: TimelineStep[] = [];

  if (request.automation) {
    // Automated provisioning
    newStatus = request.onBehalf ? "Access Provisioned" : "Completed";
    updatedTimeline = [
      existingTimeline[0],
      approvedStep,
      {
        label: "Access Automatically Provisioned",
        actor: "Automated Provisioning",
        ts: nowTs,
        state: "done",
      },
      request.onBehalf
        ? {
            label: "Access Provisioned — awaiting closure",
            actor: "",
            ts: "",
            state: "current",
          }
        : { label: "Completed", actor: "System", ts: nowTs, state: "done" },
    ];
  } else {
    // Manual provisioning
    newStatus = "Pending Manual Provisioning";
    updatedTimeline = [
      existingTimeline[0],
      approvedStep,
      {
        label: "Pending Manual Provisioning",
        actor: request.providerName,
        ts: "—",
        state: "current",
      },
      {
        label: request.onBehalf ? "Access Provisioned" : "Completed",
        actor: "",
        ts: "",
        state: "pending",
      },
    ];
  }

  const updatedRequest = await prisma.accessRequest.update({
    where: { id: requestId },
    data: {
      status: newStatus,
      timeline: JSON.stringify(updatedTimeline),
    },
  });

  // Audit Log
  await prisma.auditLog.create({
    data: {
      actorId: actorUser.id,
      actorName: actorUser.name,
      action: "Request approved",
      detail: `${requestId} — ${request.accessLabel}`,
      requestId: requestId,
    },
  });

  // Notifications
  await prisma.notification.create({
    data: {
      userId: request.requesterId,
      role: "employee",
      text: `Your request ${requestId} was approved by ${actorUser.name}.`,
      channel: "portal",
      read: false,
    },
  });

  if (request.automation) {
    await prisma.notification.create({
      data: {
        userId: request.requesterId,
        role: "employee",
        text: `Access provisioned for ${requestId} — ${request.accessLabel}.`,
        channel: "portal",
        read: false,
      },
    });
  } else {
    const providerUser = await prisma.user.findFirst({
      where: { name: request.providerName },
    });
    await prisma.notification.create({
      data: {
        userId: providerUser?.id || null,
        role: "admin",
        text: `${requestId} (${request.accessLabel}) is ready for manual provisioning.`,
        channel: "portal",
        read: false,
      },
    });
  }

  return updatedRequest;
}

export async function rejectRequestWorkflow({
  requestId,
  reason,
  actorUser,
}: {
  requestId: string;
  reason: string;
  actorUser: { id: string; name: string; email: string; role: string };
}) {
  const request = await prisma.accessRequest.findUnique({
    where: { id: requestId },
    include: { accessItem: true },
  });

  if (!request) {
    throw new Error("Request not found");
  }

  if (
    request.status !== "Pending Approval" &&
    request.status !== "Pending Exception Approval"
  ) {
    throw new Error(`Cannot reject request in status: ${request.status}`);
  }

  const isApprover =
    request.approverName === actorUser.name ||
    request.accessItem.backupApproverName === actorUser.name ||
    actorUser.role === "BOARD_ADMIN";

  if (!isApprover) {
    throw new Error("You do not have permission to reject this request.");
  }

  const nowTs = formatCurrentTimestamp();
  const existingTimeline: TimelineStep[] = JSON.parse(request.timeline);

  const updatedTimeline: TimelineStep[] = [
    existingTimeline[0],
    {
      label: "Rejected",
      actor: actorUser.name,
      ts: nowTs,
      state: "done",
    },
  ];

  const updatedRequest = await prisma.accessRequest.update({
    where: { id: requestId },
    data: {
      status: "Rejected",
      timeline: JSON.stringify(updatedTimeline),
    },
  });

  // Audit Log
  await prisma.auditLog.create({
    data: {
      actorId: actorUser.id,
      actorName: actorUser.name,
      action: "Request rejected",
      detail: `${requestId} — Reason: ${reason}`,
      requestId: requestId,
    },
  });

  // Notification
  await prisma.notification.create({
    data: {
      userId: request.requesterId,
      role: "employee",
      text: `Your request ${requestId} was rejected by ${actorUser.name}. Reason: ${reason}`,
      channel: "portal",
      read: false,
    },
  });

  return updatedRequest;
}

export async function provisionManuallyWorkflow({
  requestId,
  actorUser,
}: {
  requestId: string;
  actorUser: { id: string; name: string; email: string; role: string };
}) {
  return await prisma.$transaction(async (tx) => {
    // 1. Fetch request inside transaction with status check
    const request = await tx.accessRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new Error("Request not found");
    }

    if (request.status !== "Pending Manual Provisioning") {
      throw new Error(
        `Concurrency Conflict: Request ${requestId} is in status '${request.status}' and cannot be provisioned. It may have already been provisioned by another administrator.`
      );
    }

    if (request.providerName !== actorUser.name && actorUser.role !== "BOARD_ADMIN") {
      throw new Error("Only the assigned access provider or admin can provision this request.");
    }

    const nowTs = formatCurrentTimestamp();
    const existingTimeline: TimelineStep[] = JSON.parse(request.timeline);
    const finalStatus = request.onBehalf ? "Access Provisioned" : "Completed";

    const updatedTimeline = existingTimeline.map((s, i) => {
      if (i === 2) {
        return {
          label: "Access Provisioned",
          actor: actorUser.name,
          ts: nowTs,
          state: "done" as const,
        };
      }
      if (i === 3) {
        return request.onBehalf
          ? {
              label: "Access Provisioned — awaiting closure",
              actor: "",
              ts: "",
              state: "current" as const,
            }
          : { label: "Completed", actor: "System", ts: nowTs, state: "done" as const };
      }
      return s;
    });

    // 2. Perform conditional update with status guard
    // Using updateMany or find + update inside transaction guarantees atomic state transition
    const updateResult = await tx.accessRequest.updateMany({
      where: {
        id: requestId,
        status: "Pending Manual Provisioning",
      },
      data: {
        status: finalStatus,
        timeline: JSON.stringify(updatedTimeline),
        updatedAt: new Date(),
      },
    });

    if (updateResult.count === 0) {
      throw new Error(
        `Race condition prevented: Request ${requestId} was already provisioned concurrently by another administrator.`
      );
    }

    // 3. Append Audit Log atomically
    await tx.auditLog.create({
      data: {
        actorId: actorUser.id,
        actorName: actorUser.name,
        action: "Access provisioned (manual)",
        detail: `${requestId} — ${request.accessLabel}`,
        requestId: requestId,
      },
    });

    // 4. Dispatch Notification atomically
    await tx.notification.create({
      data: {
        userId: request.requesterId,
        role: "employee",
        text: `Access has been provisioned for ${requestId}.`,
        channel: "portal",
        read: false,
      },
    });

    return await tx.accessRequest.findUniqueOrThrow({
      where: { id: requestId },
    });
  });
}

export async function closeRequestWorkflow({
  requestId,
  actorUser,
}: {
  requestId: string;
  actorUser: { id: string; name: string; email: string; role: string };
}) {
  const request = await prisma.accessRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new Error("Request not found");
  }

  if (request.status !== "Access Provisioned") {
    throw new Error("Only requests in 'Access Provisioned' status can be closed.");
  }

  if (request.requesterName !== actorUser.name && actorUser.role !== "BOARD_ADMIN") {
    throw new Error("Only the requester or admin can close this request.");
  }

  const nowTs = formatCurrentTimestamp();
  const existingTimeline: TimelineStep[] = JSON.parse(request.timeline);

  const updatedTimeline = existingTimeline.slice(0, -1).map((s) => {
    return s.state === "current"
      ? { ...s, label: "Access Provisioned", state: "done" as const }
      : s;
  });

  updatedTimeline.push({
    label: "Request Closed",
    actor: actorUser.name,
    ts: nowTs,
    state: "done",
  });

  const updatedRequest = await prisma.accessRequest.update({
    where: { id: requestId },
    data: {
      status: "Completed",
      timeline: JSON.stringify(updatedTimeline),
    },
  });

  // Audit Log
  await prisma.auditLog.create({
    data: {
      actorId: actorUser.id,
      actorName: actorUser.name,
      action: "Request closed",
      detail: `${requestId} — closed on behalf of ${request.beneficiaryName}`,
      requestId: requestId,
    },
  });

  return updatedRequest;
}

export async function requestAccessIdWorkflow({
  accessItemId,
  actorUser,
}: {
  accessItemId: string;
  actorUser: { id: string; name: string; email: string; role: string };
}) {
  const access = await prisma.accessItem.findUnique({
    where: { id: accessItemId },
  });

  if (!access) {
    throw new Error("Access item not found");
  }

  const existingQueueItem = await prisma.accessIdQueueItem.findFirst({
    where: {
      accessItemId,
      status: "Pending Governance Review",
    },
  });

  if (existingQueueItem) {
    return existingQueueItem;
  }

  const nowTs = formatCurrentTimestamp();
  const qItem = await prisma.accessIdQueueItem.create({
    data: {
      accessItemId,
      status: "Pending Governance Review",
      requestedBy: actorUser.name,
      requestedTs: nowTs,
    },
  });

  // Audit Log
  await prisma.auditLog.create({
    data: {
      actorId: actorUser.id,
      actorName: actorUser.name,
      action: "Access ID creation requested",
      detail: `${access.tool} – ${access.name}`,
    },
  });

  // Notify Admins
  const adminUsers = await prisma.user.findMany({
    where: { role: "BOARD_ADMIN" },
  });

  for (const admin of adminUsers) {
    await prisma.notification.create({
      data: {
        userId: admin.id,
        role: "admin",
        text: `Access ID creation requested for ${access.tool} – ${access.name}.`,
        channel: "portal",
        read: false,
      },
    });
  }

  return qItem;
}

export async function approveAccessIdWorkflow({
  queueId,
  actorUser,
}: {
  queueId: string;
  actorUser: { id: string; name: string; email: string; role: string };
}) {
  if (actorUser.role !== "BOARD_ADMIN") {
    throw new Error("Only Board Admins can review and issue Access IDs.");
  }

  const queueItem = await prisma.accessIdQueueItem.findUnique({
    where: { id: queueId },
    include: { accessItem: true },
  });

  if (!queueItem) {
    throw new Error("Governance queue item not found");
  }

  const nowTs = formatCurrentTimestamp();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newAccessId = `AC-${randomSuffix}`;

  // Update AccessItem with generated Access ID
  await prisma.accessItem.update({
    where: { id: queueItem.accessItemId },
    data: { accessId: newAccessId },
  });

  // Update Queue Item status
  const updatedQ = await prisma.accessIdQueueItem.update({
    where: { id: queueId },
    data: {
      status: "Access ID Created",
      approvedTs: nowTs,
    },
  });

  // Audit Log
  await prisma.auditLog.create({
    data: {
      actorId: actorUser.id,
      actorName: actorUser.name,
      action: "Access ID created",
      detail: `${queueItem.accessItem.tool} – ${queueItem.accessItem.name} — ${newAccessId}`,
    },
  });

  // Notify requester
  const requesterUser = await prisma.user.findFirst({
    where: { name: queueItem.requestedBy },
  });

  await prisma.notification.create({
    data: {
      userId: requesterUser?.id || null,
      role: "employee",
      text: `Access ID (${newAccessId}) created for ${queueItem.accessItem.tool} – ${queueItem.accessItem.name}. You can now submit your request.`,
      channel: "portal",
      read: false,
    },
  });

  return updatedQ;
}

export async function toggleAutomationWorkflow({
  accessItemId,
  actorUser,
}: {
  accessItemId: string;
  actorUser: { id: string; name: string; email: string; role: string };
}) {
  const access = await prisma.accessItem.findUnique({
    where: { id: accessItemId },
  });

  if (!access) {
    throw new Error("Access item not found");
  }

  const newAutomation = !access.automation;

  const updated = await prisma.accessItem.update({
    where: { id: accessItemId },
    data: { automation: newAutomation },
  });

  await prisma.auditLog.create({
    data: {
      actorId: actorUser.id,
      actorName: actorUser.name,
      action: newAutomation ? "Automation enabled" : "Automation disabled",
      detail: `${access.tool} – ${access.name}`,
    },
  });

  return updated;
}

export async function updateBoardConfigWorkflow({
  accessItemId,
  approverName,
  backupApproverName,
  providerName,
  actorUser,
}: {
  accessItemId: string;
  approverName: string;
  backupApproverName: string;
  providerName: string;
  actorUser: { id: string; name: string; email: string; role: string };
}) {
  const access = await prisma.accessItem.findUnique({
    where: { id: accessItemId },
  });

  if (!access) {
    throw new Error("Access item not found");
  }

  const diffs: string[] = [];
  if (access.approverName !== approverName) {
    diffs.push(`Approver: ${access.approverName} → ${approverName}`);
  }
  if (access.backupApproverName !== backupApproverName) {
    diffs.push(`Backup approver: ${access.backupApproverName} → ${backupApproverName}`);
  }
  if (access.providerName !== providerName) {
    diffs.push(`Access provider: ${access.providerName} → ${providerName}`);
  }

  const updated = await prisma.accessItem.update({
    where: { id: accessItemId },
    data: {
      approverName,
      backupApproverName,
      providerName,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: actorUser.id,
      actorName: actorUser.name,
      action: "Access configuration updated",
      detail: `${access.tool} – ${access.name}${diffs.length ? " — " + diffs.join(", ") : ""}`,
    },
  });

  return updated;
}
