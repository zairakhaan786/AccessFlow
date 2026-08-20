"use client";

import React from "react";
import DrawerShell from "./DrawerShell";
import { Timeline, TimelineStepItem } from "@/components/ui/Timeline";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { RequestItem } from "../dashboard/MyRequestsSection";

interface RequestDetailDrawerProps {
  request: RequestItem | null;
  currentUserName: string;
  onClose: () => void;
  onOpenCloseModal: (requestId: string) => void;
}

export default function RequestDetailDrawer({
  request,
  currentUserName,
  onClose,
  onOpenCloseModal,
}: RequestDetailDrawerProps) {
  if (!request) return null;

  const canClose =
    request.onBehalf &&
    request.status === "Access Provisioned" &&
    request.requesterName.toLowerCase() === currentUserName.toLowerCase();

  let parsedTimeline: TimelineStepItem[] = [];
  try {
    parsedTimeline = JSON.parse(request.timeline);
  } catch {
    parsedTimeline = [];
  }

  const submittedDate = new Date(request.submittedAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const updatedDate = new Date(request.updatedAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <DrawerShell
      isOpen={!!request}
      onClose={onClose}
      title={request.accessLabel}
      subtitle={request.id}
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
          <div className="f-value text-[13.5px] font-semibold text-[#1F2937]">
            {request.requesterName}
          </div>
        </div>

        <div className="field">
          <label className="f-label block text-[11.5px] text-[var(--muted-2)] mb-1">
            Beneficiary
          </label>
          <div className="f-value text-[13.5px] font-semibold text-[#1F2937]">
            {request.beneficiaryName}
          </div>
        </div>

        <div className="field">
          <label className="f-label block text-[11.5px] text-[var(--muted-2)] mb-1">
            Approver
          </label>
          <div className="f-value text-[13.5px] font-semibold text-[#1F2937]">
            {request.approverName}
          </div>
        </div>

        <div className="field">
          <label className="f-label block text-[11.5px] text-[var(--muted-2)] mb-1">
            Access provider
          </label>
          <div className="f-value text-[13.5px] font-semibold text-[#1F2937]">
            {request.providerName}
          </div>
        </div>

        <div className="field">
          <label className="f-label block text-[11.5px] text-[var(--muted-2)] mb-1">
            Submitted
          </label>
          <div className="f-value text-[13.5px] font-semibold text-[#1F2937]">
            {submittedDate}
          </div>
        </div>

        <div className="field">
          <label className="f-label block text-[11.5px] text-[var(--muted-2)] mb-1">
            Last updated
          </label>
          <div className="f-value text-[13.5px] font-semibold text-[#1F2937]">
            {updatedDate}
          </div>
        </div>
      </div>

      {request.isException && (
        <div className="field-grid grid grid-cols-3 gap-4 mt-4.5 pt-4 border-t border-[var(--border)]">
          <div className="field">
            <label className="f-label block text-[11.5px] text-[var(--muted-2)] mb-1">
              Reason
            </label>
            <div className="f-value text-[13.5px] font-semibold text-[#1F2937]">
              {request.reason || "—"}
            </div>
          </div>
          <div className="field">
            <label className="f-label block text-[11.5px] text-[var(--muted-2)] mb-1">
              Required until
            </label>
            <div className="f-value text-[13.5px] font-semibold text-[#1F2937]">
              {request.requiredUntil || "—"}
            </div>
          </div>
          <div className="field">
            <label className="f-label block text-[11.5px] text-[var(--muted-2)] mb-1">
              Urgency
            </label>
            <div className="f-value text-[13.5px] font-semibold text-[#1F2937]">
              {request.urgency || "—"}
            </div>
          </div>
        </div>
      )}

      {request.justification && (
        <div className="mt-6 pt-5 border-t border-[var(--border)]">
          <div className="divider-label text-[11.5px] font-bold uppercase tracking-wider text-[var(--muted-2)] mb-2">
            Business Justification
          </div>
          <div className="text-[13.5px] text-[#374151] leading-relaxed">
            {request.justification}
          </div>
        </div>
      )}

      <div className="mt-6 pt-5 border-t border-[var(--border)]">
        <div className="divider-label text-[11.5px] font-bold uppercase tracking-wider text-[var(--muted-2)] mb-3">
          Timeline
        </div>
        <Timeline steps={parsedTimeline} />
      </div>

      {request.status === "Access Provisioned" && (
        <div className="mt-6 bg-[#F0FDFA] border border-[#99F6E4] rounded-[9px] p-4">
          <div className="text-[13.5px] font-bold text-[#0F766E]">Access Provisioned</div>
          <div className="text-[12px] text-[#0D6E68] mt-1">
            {request.onBehalf
              ? `${request.beneficiaryName} has been granted access. Since this was raised on their behalf, you can close it without waiting on them.`
              : "Access has been granted."}
          </div>
          {canClose && (
            <button
              onClick={() => onOpenCloseModal(request.id)}
              className="btn btn-primary mt-3"
            >
              Close Request
            </button>
          )}
        </div>
      )}
    </DrawerShell>
  );
}
