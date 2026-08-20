"use client";
import { formatClientDate } from "@/lib/utils";

import React, { useState } from "react";
import DrawerShell from "./DrawerShell";
import { Timeline, TimelineStepItem } from "@/components/ui/Timeline";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Check, XCircle } from "lucide-react";
import { RequestItem } from "../dashboard/MyRequestsSection";
import { approveRequestAction } from "@/app/actions/requests";
import { showToast } from "@/components/ui/Toast";

interface ApprovalDetailDrawerProps {
  request: RequestItem | null;
  currentUserName: string;
  onClose: () => void;
  onOpenRejectModal: (requestId: string) => void;
}

export default function ApprovalDetailDrawer({
  request,
  currentUserName,
  onClose,
  onOpenRejectModal,
}: ApprovalDetailDrawerProps) {
  const [isApproving, setIsApproving] = useState(false);

  if (!request) return null;

  let parsedTimeline: TimelineStepItem[] = [];
  try {
    parsedTimeline = JSON.parse(request.timeline);
  } catch {
    parsedTimeline = [];
  }

  const submittedDate = formatClientDate(request.submittedAt);

  const isPendingApproval =
    request.status === "Pending Approval" ||
    request.status === "Pending Exception Approval";

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await approveRequestAction({ requestId: request.id });
      showToast(`Request ${request.id} approved`, "success");
      onClose();
    } catch (err: any) {
      showToast(err?.message || "Failed to approve request", "error");
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <DrawerShell
      isOpen={!!request}
      onClose={onClose}
      title={request.accessLabel}
      subtitle={`${request.id} · Awaiting your approval`}
      badge={<StatusBadge status={request.status} />}
    >
      <div className="divider-label text-[11.5px] font-bold uppercase tracking-wider text-[var(--muted-2)] mb-3">
        Request Details
      </div>

      <div className="field-grid grid grid-cols-2 gap-x-6 gap-y-4">
        <div className="field">
          <label className="f-label block text-[11.5px] text-[var(--muted-2)] mb-1">
            Requester
          </label>
          <div className="f-value text-[13.5px] font-semibold text-[#E2E8F0]">
            {request.requesterName}
          </div>
        </div>

        <div className="field">
          <label className="f-label block text-[11.5px] text-[var(--muted-2)] mb-1">
            Beneficiary
          </label>
          <div className="f-value text-[13.5px] font-semibold text-[#E2E8F0]">
            {request.beneficiaryName}
          </div>
        </div>

        <div className="field">
          <label className="f-label block text-[11.5px] text-[var(--muted-2)] mb-1">
            Beneficiary eligible?
          </label>
          <div className="f-value text-[13.5px] font-semibold">
            {request.isException ? (
              <span className="text-[#F59E0B] font-bold">
                Exception — outside normal eligibility
              </span>
            ) : (
              <span className="text-[#86EFAC] font-bold">Confirmed eligible</span>
            )}
          </div>
        </div>

        <div className="field">
          <label className="f-label block text-[11.5px] text-[var(--muted-2)] mb-1">
            Access provider
          </label>
          <div className="f-value text-[13.5px] font-semibold text-[#E2E8F0]">
            {request.providerName}
          </div>
        </div>

        <div className="field">
          <label className="f-label block text-[11.5px] text-[var(--muted-2)] mb-1">
            Provisioning
          </label>
          <div className="f-value text-[13.5px] font-semibold text-[#E2E8F0]">
            {request.automation ? "Automatic on approval" : "Manual, by provider"}
          </div>
        </div>

        <div className="field">
          <label className="f-label block text-[11.5px] text-[var(--muted-2)] mb-1">
            Requested
          </label>
          <div className="f-value text-[13.5px] font-semibold text-[#E2E8F0]">
            {submittedDate}
          </div>
        </div>
      </div>

      {request.isException && (
        <div className="field-grid grid grid-cols-3 gap-4 mt-4.5 pt-4 border-t border-white/10">
          <div className="field">
            <label className="f-label block text-[11.5px] text-[var(--muted-2)] mb-1">
              Reason
            </label>
            <div className="f-value text-[13.5px] font-semibold text-[#E2E8F0]">
              {request.reason || "—"}
            </div>
          </div>
          <div className="field">
            <label className="f-label block text-[11.5px] text-[var(--muted-2)] mb-1">
              Required until
            </label>
            <div className="f-value text-[13.5px] font-semibold text-[#E2E8F0]">
              {request.requiredUntil || "—"}
            </div>
          </div>
          <div className="field">
            <label className="f-label block text-[11.5px] text-[var(--muted-2)] mb-1">
              Urgency
            </label>
            <div className="f-value text-[13.5px] font-semibold text-[#E2E8F0]">
              {request.urgency || "—"}
            </div>
          </div>
        </div>
      )}

      {request.justification && (
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="divider-label text-[11.5px] font-bold uppercase tracking-wider text-[var(--muted-2)] mb-2">
            Business Justification
          </div>
          <div className="text-[13.5px] text-[#CBD5E1] leading-relaxed">
            {request.justification}
          </div>
        </div>
      )}

      <div className="mt-6 pt-5 border-t border-white/10">
        <div className="divider-label text-[11.5px] font-bold uppercase tracking-wider text-[var(--muted-2)] mb-3">
          Timeline
        </div>
        <Timeline steps={parsedTimeline} />
      </div>

      {isPendingApproval && (
        <div className="btn-row flex items-center gap-2.5 mt-6 pt-6 border-t border-white/10">
          <button
            onClick={handleApprove}
            disabled={isApproving}
            className="btn btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            {isApproving ? "Approving..." : "Approve"}
          </button>
          <button
            onClick={() => onOpenRejectModal(request.id)}
            disabled={isApproving}
            className="btn btn-danger flex-1 flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" /> Reject
          </button>
        </div>
      )}
    </DrawerShell>
  );
}
