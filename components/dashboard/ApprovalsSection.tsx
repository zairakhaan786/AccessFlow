"use client";
import { formatClientDate } from "@/lib/utils";

import React, { useState } from "react";
import { ClipboardCheck, ChevronRight, Check, X } from "lucide-react";
import { RequestItem } from "./MyRequestsSection";
import { approveRequestAction } from "@/app/actions/requests";

interface ApprovalsSectionProps {
  requests: RequestItem[];
  currentUserName: string;
  onOpenApprovalDetail: (requestId: string) => void;
  onOpenRejectModal: (requestId: string) => void;
}

export default function ApprovalsSection({
  requests,
  currentUserName,
  onOpenApprovalDetail,
  onOpenRejectModal,
}: ApprovalsSectionProps) {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const pendingApprovals = requests.filter(
    (r) =>
      r.approverName.toLowerCase() === currentUserName.toLowerCase() &&
      (r.status === "Pending Approval" || r.status === "Pending Exception Approval")
  );

  const handleQuickApprove = async (e: React.MouseEvent, requestId: string) => {
    e.stopPropagation();
    setIsProcessing(requestId);
    try {
      await approveRequestAction({ requestId });
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleQuickReject = (e: React.MouseEvent, requestId: string) => {
    e.stopPropagation();
    // Rejections strictly require an explanatory reason, so route through the
    // RejectModal instead of auto-rejecting with a canned reason.
    onOpenRejectModal(requestId);
  };

  if (pendingApprovals.length === 0) return null;

  return (
    <div className="card card-tinted-amber">
      <div className="section-head flex items-start justify-between mb-4 gap-3">
        <div className="section-head-left flex items-center gap-2.5">
          <div className="section-icon w-[34px] h-[34px] rounded-[9px] bg-[#2F6FED]/15 text-[var(--accent)] flex items-center justify-center flex-shrink-0">
            <ClipboardCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="section-title text-[16px] font-extrabold text-[#E5EAF3]">
              Approvals Requiring My Action
            </h2>
            <p className="section-sub text-[12px] text-[var(--muted-2)] mt-0.5">
              You&apos;re the configured approver (or backup) for these requests.
            </p>
          </div>
        </div>

        <span className="badge badge-amber">
          {pendingApprovals.length} pending
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {pendingApprovals.map((r) => {
          const submittedDate = formatClientDate(r.submittedAt);

          const initials = r.requesterName
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("");

          return (
            <div
              key={r.id}
              onClick={() => onOpenApprovalDetail(r.id)}
              className="list-row border border-white/10 rounded-[11px] p-4 cursor-pointer transition flex items-center justify-between gap-3 bg-white/[0.04] border-l-[3px] border-l-[#F59E0B] hover:border-[#F59E0B]/60 hover:shadow-[0_8px_24px_rgba(245,158,11,0.15)]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#475569] to-[#1E293B] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 ring-1 ring-white/15">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="result-title text-[14px] font-bold text-[#E5EAF3]">
                      {r.accessLabel}
                    </span>
                    {r.isException && (
                      <span className="badge badge-amber">Exception request</span>
                    )}
                  </div>
                  <div className="text-[11.5px] text-[#64748B] mt-0.5">
                    {r.id} · {r.requesterName}
                    {r.onBehalf ? ` for ${r.beneficiaryName}` : ""} · {submittedDate}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  disabled={isProcessing === r.id}
                  onClick={(e) => handleQuickReject(e, r.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors disabled:opacity-50"
                  title="Quick Reject"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  disabled={isProcessing === r.id}
                  onClick={(e) => handleQuickApprove(e, r.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-[#2F6FED] to-[#1E4FC7] hover:shadow-[0_0_14px_rgba(47,111,237,0.5)] transition-all disabled:opacity-50"
                  title="Quick Approve"
                >
                  {isProcessing === r.id ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                </button>
                <ChevronRight className="w-4 h-4 text-[#475569] ml-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
