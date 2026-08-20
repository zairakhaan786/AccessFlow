"use client";
import { formatClientDate } from "@/lib/utils";

import React, { useState } from "react";
import DrawerShell from "./DrawerShell";
import { Timeline, TimelineStepItem } from "@/components/ui/Timeline";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Check } from "lucide-react";
import { RequestItem } from "../dashboard/MyRequestsSection";
import { provisionManuallyAction } from "@/app/actions/requests";
import { showToast } from "@/components/ui/Toast";

interface AdminRequestDetailDrawerProps {
  request: RequestItem | null;
  onClose: () => void;
}

export default function AdminRequestDetailDrawer({
  request,
  onClose,
}: AdminRequestDetailDrawerProps) {
  const [isProvisioning, setIsProvisioning] = useState(false);

  if (!request) return null;

  let parsedTimeline: TimelineStepItem[] = [];
  try {
    parsedTimeline = JSON.parse(request.timeline);
  } catch {
    parsedTimeline = [];
  }

  const submittedDate = formatClientDate(request.submittedAt);

  const handleProvision = async () => {
    setIsProvisioning(true);
    try {
      await provisionManuallyAction({ requestId: request.id });
      showToast(`Access provisioned for ${request.id}`, "success");
      onClose();
    } catch (err: any) {
      showToast(err?.message || "Failed to provision access", "error");
    } finally {
      setIsProvisioning(false);
    }
  };

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
            Approved by
          </label>
          <div className="f-value text-[13.5px] font-semibold text-[#1F2937]">
            {request.approverName}
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
      </div>

      {request.justification && (
        <div className="mt-6 pt-5 border-t border-[var(--border)]">
          <div className="divider-label text-[11.5px] font-bold uppercase tracking-wider text-[var(--muted-2)] mb-2">
            Reason / Details
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

      {request.status === "Pending Manual Provisioning" && (
        <div className="mt-6 pt-6 border-t border-[var(--border)]">
          <button
            onClick={handleProvision}
            disabled={isProvisioning}
            className="btn btn-primary btn-block w-full flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            {isProvisioning ? "Provisioning..." : "Provision Access"}
          </button>
          <p className="text-[11.5px] text-[#9CA3AF] mt-2.5 text-center">
            This marks the request Completed and notifies the requester.
          </p>
        </div>
      )}
    </DrawerShell>
  );
}
