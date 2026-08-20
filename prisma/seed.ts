import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clean existing tables in order
  await prisma.notification.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.accessIdQueueItem.deleteMany({});
  await prisma.accessRequest.deleteMany({});
  await prisma.accessItem.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPassword = await bcrypt.hash("password123", 10);
  const adminPassword = await bcrypt.hash("admin123", 10);
  const empPassword = await bcrypt.hash("emp123", 10);

  // 1. Create Users
  const manvi = await prisma.user.create({
    data: {
      name: "Manvi Mehta",
      email: "manvi@company.com",
      passwordHash: empPassword,
      role: "EMPLOYEE",
      group: "Product Team",
      title: "Project Manager",
      initials: "MM",
      tone: "#2563EB",
    },
  });

  const rahul = await prisma.user.create({
    data: {
      name: "Rahul Sharma",
      email: "rahul@company.com",
      passwordHash: adminPassword,
      role: "BOARD_ADMIN",
      group: "IT Support",
      title: "IT Support · Access Provider / Board Admin",
      initials: "RS",
      tone: "#334155",
    },
  });

  const ananya = await prisma.user.create({
    data: {
      name: "Ananya Rao",
      email: "ananya@company.com",
      passwordHash: empPassword,
      role: "EMPLOYEE",
      group: "Support Team",
      title: "Customer Support Associate",
      initials: "AR",
      tone: "#7C3AED",
    },
  });

  const neha = await prisma.user.create({
    data: {
      name: "Neha Kapoor",
      email: "neha@company.com",
      passwordHash: defaultPassword,
      role: "EMPLOYEE",
      group: "Sales Team",
      title: "Sales Lead",
      initials: "NK",
      tone: "#059669",
    },
  });

  const muskan = await prisma.user.create({
    data: {
      name: "Muskan Kohli",
      email: "muskan@company.com",
      passwordHash: defaultPassword,
      role: "EMPLOYEE",
      group: "Finance Team",
      title: "Finance Manager",
      initials: "MK",
      tone: "#D97706",
    },
  });

  console.log(`✅ Created ${5} users.`);

  // 2. Create Access Items (Catalog)
  const acc1 = await prisma.accessItem.create({
    data: {
      id: "acc-1",
      tool: "Monday.com",
      name: "Marketing Operations Board",
      category: "Board",
      description: "Campaign timelines, content calendar, and creative sign-off tracking for the Marketing team.",
      accessId: "AC-1042",
      creator: "Sarah Thomas",
      group: "Marketing Team",
      eligibleGroups: JSON.stringify(["Marketing Team", "Product Team"]),
      approverName: "Manvi Mehta",
      backupApproverName: "Sarah Thomas",
      providerName: "Rahul Sharma",
      automation: true,
      requestType: "Board Access Request",
    },
  });

  const acc2 = await prisma.accessItem.create({
    data: {
      id: "acc-2",
      tool: "Salesforce",
      name: "Sales Operations",
      category: "Application",
      description: "Pipeline, opportunity, and account data for the Sales Operations team.",
      accessId: "AC-2077",
      creator: "Neha Kapoor",
      group: "Sales Team",
      eligibleGroups: JSON.stringify(["Sales Team", "Product Team"]),
      approverName: "Neha Kapoor",
      backupApproverName: "Arjun Mehta",
      providerName: "Rahul Sharma",
      automation: false,
      requestType: "Application Access Request",
    },
  });

  const acc3 = await prisma.accessItem.create({
    data: {
      id: "acc-3",
      tool: "Monday.com",
      name: "Product Roadmap Board",
      category: "Board",
      description: "Quarterly roadmap planning and feature prioritization board for the Product team.",
      accessId: null,
      creator: "Apoorva Singh",
      group: "Product Team",
      eligibleGroups: JSON.stringify(["Product Team"]),
      approverName: "Sandeep Verma",
      backupApproverName: "Apoorva Singh",
      providerName: "Rahul Sharma",
      automation: false,
      requestType: "Board Access Request",
    },
  });

  const acc4 = await prisma.accessItem.create({
    data: {
      id: "acc-4",
      tool: "Zendesk",
      name: "Customer Support Queue",
      category: "Application",
      description: "Live customer ticket queue for the Support team.",
      accessId: "AC-3311",
      creator: "Varsha Nair",
      group: "Support Team",
      eligibleGroups: JSON.stringify(["Support Team"]),
      approverName: "Manvi Mehta",
      backupApproverName: "Christian Fernandes",
      providerName: "Varsha Nair",
      automation: false,
      requestType: "Application Access Request",
    },
  });

  const acc5 = await prisma.accessItem.create({
    data: {
      id: "acc-5",
      tool: "Monday.com",
      name: "Finance Tracker",
      category: "Board",
      description: "Vendor invoices, budget tracking, and expense approvals board for Finance.",
      accessId: "AC-1590",
      creator: "Nivi Rao",
      group: "Finance Team",
      eligibleGroups: JSON.stringify(["Finance Team"]),
      approverName: "Muskan Kohli",
      backupApproverName: "Nivi Rao",
      providerName: "Nivi Rao",
      automation: true,
      requestType: "Board Access Request",
    },
  });

  const acc6 = await prisma.accessItem.create({
    data: {
      id: "acc-6",
      tool: "GitHub",
      name: "Engineering Core Repos",
      category: "Application",
      description: "Source code repositories, pull request review access, and CI/CD pipelines.",
      accessId: "AC-4091",
      creator: "Alex Chen",
      group: "Engineering Team",
      eligibleGroups: JSON.stringify(["Engineering Team", "Product Team"]),
      approverName: "Rahul Sharma",
      backupApproverName: "Alex Chen",
      providerName: "Rahul Sharma",
      automation: true,
      requestType: "Application Access Request",
    },
  });

  console.log(`✅ Created 6 access catalog items.`);

  // 3. Create Seed Access Requests
  await prisma.accessRequest.create({
    data: {
      id: "NAR-10469",
      accessItemId: acc4.id,
      accessLabel: "Zendesk – Customer Support Queue",
      requesterId: rahul.id,
      requesterName: "Rahul Sharma",
      beneficiaryId: rahul.id,
      beneficiaryName: "Rahul Sharma",
      onBehalf: false,
      isException: false,
      approverName: "Manvi Mehta",
      providerName: "Varsha Nair",
      automation: false,
      justification: "Need ticket visibility to debug a provisioning issue reported by Support.",
      status: "Completed",
      submittedAt: new Date("2026-08-02T09:40:00Z"),
      updatedAt: new Date("2026-08-03T10:05:00Z"),
      timeline: JSON.stringify([
        { label: "Request Submitted", actor: "Rahul Sharma", ts: "2 Aug 2026, 9:40 AM", state: "done" },
        { label: "Approved", actor: "Manvi Mehta", ts: "2 Aug 2026, 1:15 PM", state: "done" },
        { label: "Access Provisioned", actor: "Varsha Nair", ts: "3 Aug 2026, 10:05 AM", state: "done" },
        { label: "Completed", actor: "System", ts: "3 Aug 2026, 10:05 AM", state: "done" },
      ]),
    },
  });

  await prisma.accessRequest.create({
    data: {
      id: "NAR-10471",
      accessItemId: acc4.id,
      accessLabel: "Zendesk – Customer Support Queue",
      requesterId: ananya.id,
      requesterName: "Ananya Rao",
      beneficiaryId: ananya.id,
      beneficiaryName: "Ananya Rao",
      onBehalf: false,
      isException: false,
      approverName: "Manvi Mehta",
      providerName: "Varsha Nair",
      automation: false,
      justification: "Joining the Support rotation next week and need queue access.",
      status: "Pending Approval",
      submittedAt: new Date("2026-08-16T11:20:00Z"),
      updatedAt: new Date("2026-08-16T11:20:00Z"),
      timeline: JSON.stringify([
        { label: "Request Submitted", actor: "Ananya Rao", ts: "16 Aug 2026, 11:20 AM", state: "done" },
        { label: "Pending Approval", actor: "Manvi Mehta", ts: "—", state: "current" },
        { label: "Pending Manual Provisioning", actor: "", ts: "", state: "pending" },
        { label: "Completed", actor: "", ts: "", state: "pending" },
      ]),
    },
  });

  await prisma.accessRequest.create({
    data: {
      id: "NAR-10475",
      accessItemId: acc5.id,
      accessLabel: "Monday.com – Finance Tracker",
      requesterId: manvi.id,
      requesterName: "Manvi Mehta",
      beneficiaryId: manvi.id,
      beneficiaryName: "Manvi Mehta",
      onBehalf: false,
      isException: false,
      approverName: "Muskan Kohli",
      providerName: "Nivi Rao",
      automation: true,
      justification: "Tracking marketing budget spend against the Q3 vendor invoices.",
      status: "Completed",
      submittedAt: new Date("2026-08-10T09:12:00Z"),
      updatedAt: new Date("2026-08-10T11:41:00Z"),
      timeline: JSON.stringify([
        { label: "Request Submitted", actor: "Manvi Mehta", ts: "10 Aug 2026, 9:12 AM", state: "done" },
        { label: "Approved", actor: "Muskan Kohli", ts: "10 Aug 2026, 11:40 AM", state: "done" },
        { label: "Access Provisioned", actor: "Automated Provisioning", ts: "10 Aug 2026, 11:41 AM", state: "done" },
        { label: "Completed", actor: "System", ts: "10 Aug 2026, 11:41 AM", state: "done" },
      ]),
    },
  });

  await prisma.accessRequest.create({
    data: {
      id: "NAR-10478",
      accessItemId: acc2.id,
      accessLabel: "Salesforce – Sales Operations",
      requesterId: manvi.id,
      requesterName: "Manvi Mehta",
      beneficiaryId: manvi.id,
      beneficiaryName: "Manvi Mehta",
      onBehalf: false,
      isException: false,
      approverName: "Neha Kapoor",
      providerName: "Rahul Sharma",
      automation: false,
      justification: "Reviewing pipeline coverage for the New Age Portal launch account list.",
      status: "Pending Manual Provisioning",
      submittedAt: new Date("2026-08-15T14:05:00Z"),
      updatedAt: new Date("2026-08-16T10:20:00Z"),
      timeline: JSON.stringify([
        { label: "Request Submitted", actor: "Manvi Mehta", ts: "15 Aug 2026, 2:05 PM", state: "done" },
        { label: "Approved", actor: "Neha Kapoor", ts: "16 Aug 2026, 10:20 AM", state: "done" },
        { label: "Pending Manual Provisioning", actor: "Rahul Sharma", ts: "—", state: "current" },
        { label: "Completed", actor: "", ts: "", state: "pending" },
      ]),
    },
  });

  console.log(`✅ Created 4 requests.`);

  // 4. Create Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        actorName: "Rahul Sharma",
        action: "Access ID created — AC-1042",
        detail: "Monday.com – Marketing Operations Board",
        timestamp: new Date("2026-06-20T16:10:00Z"),
      },
      {
        actorName: "Rahul Sharma",
        action: "Backup approver changed",
        detail: "Monday.com – Marketing Operations Board",
        timestamp: new Date("2026-07-05T11:02:00Z"),
      },
      {
        actorName: "Rahul Sharma",
        action: "Automation enabled",
        detail: "Monday.com – Marketing Operations Board",
        timestamp: new Date("2026-07-28T15:45:00Z"),
      },
      {
        actorName: "Rahul Sharma",
        action: "Automation enabled",
        detail: "Monday.com – Finance Tracker",
        timestamp: new Date("2026-08-02T13:15:00Z"),
      },
    ],
  });

  console.log(`✅ Created initial audit logs.`);

  // 5. Create Initial Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: manvi.id,
        role: "employee",
        text: "Your request NAR-10478 was approved by Neha Kapoor.",
        channel: "portal",
        read: true,
        createdAt: new Date("2026-08-16T10:20:00Z"),
      },
      {
        userId: manvi.id,
        role: "employee",
        text: "Ananya Rao raised a request for Zendesk – Customer Support Queue awaiting your approval.",
        channel: "slack",
        read: false,
        createdAt: new Date("2026-08-16T11:20:00Z"),
      },
      {
        userId: rahul.id,
        role: "admin",
        text: "NAR-10478 (Salesforce – Sales Operations) is ready for manual provisioning.",
        channel: "portal",
        read: false,
        createdAt: new Date("2026-08-16T10:20:00Z"),
      },
    ],
  });

  console.log(`✅ Created notifications.`);
  console.log("🚀 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
