"use client";
import { formatClientDate } from "@/lib/utils";

import React from "react";
import { ClipboardCheck, ChevronRight } from "lucide-react";
import { RequestItem } from "./MyRequestsSection";

interface ApprovalsSectionProps {
  requests: RequestItem[];
  currentUserName: string;
  onOpenApprovalDetail: (requestId: string) => void;
}

export default function ApprovalsSection({
  requests,
  currentUserName,
  onOpenApprovalDetail,
}: ApprovalsSectionProps) {
  const pendingApprovals = requests.filter(
    (r) =>
      r.approverName.toLowerCase() === currentUserName.toLowerCase() &&
      (r.status === "Pending Approval" || r.status === "Pending Exception Approval")
  );

  if (pendingApprovals.length === 0) return null;

  return (
    <div className="card card-tinted-amber border-[#FDE7B8] bg-[#FFFCF5]">
      <div className="section-head flex items-start justify-between mb-4 gap-3">
        <div className="section-head-left flex items-center gap-2.5">
          <div className="section-icon w-[34px] h-[34px] rounded-[9px] bg-[#EAF1FF] text-[var(--accent)] flex items-center justify-center flex-shrink-0">
            <ClipboardCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="section-title text-[16px] font-extrabold text-[#111827]">
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
              className="list-row border border-[var(--border)] rounded-[11px] p-4 cursor-pointer transition flex items-center justify-between gap-3 bg-white border-l-[3px] border-l-[#F59E0B] hover:border-[#CBD5E1] hover:shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#475569] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="result-title text-[14px] font-bold text-[#111827]">
                      {r.accessLabel}
                    </span>
                    {r.isException && (
                      <span className="badge badge-amber">Exception request</span>
                    )}
                  </div>
                  <div className="text-[11.5px] text-[#9CA3AF] mt-0.5">
                    {r.id} · {r.requesterName}
                    {r.onBehalf ? ` for ${r.beneficiaryName}` : ""} · {submittedDate}
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-[#D1D5DB] flex-shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
