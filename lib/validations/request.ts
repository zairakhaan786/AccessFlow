import { z } from "zod";

export const CreateRequestSchema = z.object({
  accessItemId: z.string().min(1, "Access item ID is required"),
  beneficiaryName: z.string().min(1, "Beneficiary is required"),
  onBehalf: z.boolean().default(false),
  justification: z.string().min(3, "Please add a short business justification"),
});

export const CreateExceptionRequestSchema = z.object({
  accessItemId: z.string().min(1, "Access item ID is required"),
  reason: z.string().min(2, "Please provide a reason for this access"),
  justification: z.string().min(3, "Please provide a project or business justification"),
  requiredUntil: z.string().optional(),
  urgency: z.enum(["Low", "Medium", "High", "Urgent"]).default("Medium"),
});

export const ApproveRequestSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
});

export const RejectRequestSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  reason: z.string().min(2, "Please provide a reason for rejection"),
});

export const ProvisionRequestSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
});

export const CloseRequestSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
});

export const RequestAccessIdSchema = z.object({
  accessItemId: z.string().min(1, "Access item ID is required"),
});

export const ApproveAccessIdSchema = z.object({
  queueId: z.string().min(1, "Queue ID is required"),
});

export const ToggleAutomationSchema = z.object({
  accessItemId: z.string().min(1, "Access item ID is required"),
});

export const UpdateBoardConfigSchema = z.object({
  accessItemId: z.string().min(1, "Access item ID is required"),
  approverName: z.string().min(1, "Approver name is required"),
  backupApproverName: z.string().min(1, "Backup approver name is required"),
  providerName: z.string().min(1, "Provider name is required"),
});
