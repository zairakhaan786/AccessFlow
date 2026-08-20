"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  CreateRequestSchema,
  CreateExceptionRequestSchema,
  ApproveRequestSchema,
  RejectRequestSchema,
  ProvisionRequestSchema,
  CloseRequestSchema,
  RequestAccessIdSchema,
  ApproveAccessIdSchema,
  ToggleAutomationSchema,
  UpdateBoardConfigSchema,
} from "@/lib/validations/request";
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
} from "@/lib/services/workflow";

async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized. Please log in.");
  }
  return session.user;
}

export async function submitRequestAction(formData: {
  accessItemId: string;
  beneficiaryName: string;
  onBehalf: boolean;
  justification: string;
}) {
  const user = await getAuthenticatedUser();
  const parsed = CreateRequestSchema.parse(formData);

  const result = await submitRequestWorkflow({
    accessItemId: parsed.accessItemId,
    beneficiaryName: parsed.beneficiaryName,
    onBehalf: parsed.onBehalf,
    justification: parsed.justification,
    actorUser: user as any,
  });

  revalidatePath("/");
  return { success: true, requestId: result.id };
}

export async function submitExceptionRequestAction(formData: {
  accessItemId: string;
  reason: string;
  justification: string;
  requiredUntil?: string;
  urgency?: "Low" | "Medium" | "High" | "Urgent";
}) {
  const user = await getAuthenticatedUser();
  const parsed = CreateExceptionRequestSchema.parse(formData);

  const result = await submitExceptionRequestWorkflow({
    accessItemId: parsed.accessItemId,
    reason: parsed.reason,
    justification: parsed.justification,
    requiredUntil: parsed.requiredUntil,
    urgency: parsed.urgency,
    actorUser: user as any,
  });

  revalidatePath("/");
  return { success: true, requestId: result.id };
}

export async function approveRequestAction(formData: { requestId: string }) {
  const user = await getAuthenticatedUser();
  const parsed = ApproveRequestSchema.parse(formData);

  const result = await approveRequestWorkflow({
    requestId: parsed.requestId,
    actorUser: user as any,
  });

  revalidatePath("/");
  return { success: true, requestId: result.id };
}

export async function rejectRequestAction(formData: {
  requestId: string;
  reason: string;
}) {
  const user = await getAuthenticatedUser();
  const parsed = RejectRequestSchema.parse(formData);

  const result = await rejectRequestWorkflow({
    requestId: parsed.requestId,
    reason: parsed.reason,
    actorUser: user as any,
  });

  revalidatePath("/");
  return { success: true, requestId: result.id };
}

export async function provisionManuallyAction(formData: { requestId: string }) {
  const user = await getAuthenticatedUser();
  const parsed = ProvisionRequestSchema.parse(formData);

  const result = await provisionManuallyWorkflow({
    requestId: parsed.requestId,
    actorUser: user as any,
  });

  revalidatePath("/");
  return { success: true, requestId: result.id };
}

export async function closeRequestAction(formData: { requestId: string }) {
  const user = await getAuthenticatedUser();
  const parsed = CloseRequestSchema.parse(formData);

  const result = await closeRequestWorkflow({
    requestId: parsed.requestId,
    actorUser: user as any,
  });

  revalidatePath("/");
  return { success: true, requestId: result.id };
}

export async function requestAccessIdAction(formData: { accessItemId: string }) {
  const user = await getAuthenticatedUser();
  const parsed = RequestAccessIdSchema.parse(formData);

  const result = await requestAccessIdWorkflow({
    accessItemId: parsed.accessItemId,
    actorUser: user as any,
  });

  revalidatePath("/");
  return { success: true, queueId: result.id };
}

export async function approveAccessIdAction(formData: { queueId: string }) {
  const user = await getAuthenticatedUser();
  const parsed = ApproveAccessIdSchema.parse(formData);

  const result = await approveAccessIdWorkflow({
    queueId: parsed.queueId,
    actorUser: user as any,
  });

  revalidatePath("/");
  return { success: true, queueId: result.id };
}

export async function toggleAutomationAction(formData: { accessItemId: string }) {
  const user = await getAuthenticatedUser();
  const parsed = ToggleAutomationSchema.parse(formData);

  const result = await toggleAutomationWorkflow({
    accessItemId: parsed.accessItemId,
    actorUser: user as any,
  });

  revalidatePath("/");
  return { success: true, automation: result.automation };
}

export async function updateBoardConfigAction(formData: {
  accessItemId: string;
  approverName: string;
  backupApproverName: string;
  providerName: string;
}) {
  const user = await getAuthenticatedUser();
  const parsed = UpdateBoardConfigSchema.parse(formData);

  const result = await updateBoardConfigWorkflow({
    accessItemId: parsed.accessItemId,
    approverName: parsed.approverName,
    backupApproverName: parsed.backupApproverName,
    providerName: parsed.providerName,
    actorUser: user as any,
  });

  revalidatePath("/");
  return { success: true };
}

export async function deleteAuditLogAction(formData: { logId: string }) {
  await getAuthenticatedUser();
  await prisma.auditLog.delete({
    where: { id: formData.logId },
  });

  revalidatePath("/");
  return { success: true };
}

export async function markNotificationsAsReadAction(role: string) {
  const user = await getAuthenticatedUser();
  await prisma.notification.updateMany({
    where: {
      OR: [
        { userId: user.id },
        { role: role.toLowerCase() },
      ],
      read: false,
    },
    data: { read: true },
  });

  revalidatePath("/");
  return { success: true };
}
