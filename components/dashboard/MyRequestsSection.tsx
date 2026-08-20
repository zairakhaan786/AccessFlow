"use client";
import { formatClientDate } from "@/lib/utils";

import React from "react";
import { ClipboardList, Inbox } from "lucide-react";
import { StatusBadge, CategoryBadge } from "@/components/ui/StatusBadge";

export interface RequestItem {
  id: string;
  accessItemId: string;
  accessLabel: string;
  requesterName: string;
  beneficiaryName: string;
  onBehalf: boolean;
  isException: boolean;
  reason?: string | null;
  requiredUntil?: string | null;
  urgency?: string | null;
  approverName: string;
  providerName: string;
  automation: boolean;
  justification: string;
  status: string;
  timeline: string;
  submittedAt: string | Date;
  updatedAt: string | Date;
  category?: string;
}

interface MyRequestsSectionProps {
  requests: RequestItem[];
  currentUserName: string;
  compact?: boolean;
  onOpenRequestDetail: (requestId: string) => void;
}

export default function MyRequestsSection({
  requests,
  currentUserName,
  compact = false,
  onOpenRequestDetail,
}: MyRequestsSectionProps) {
  const myRequests = requests.filter(
    (r) => r.requesterName.toLowerCase() === currentUserName.toLowerCase()
  );

  return (
    <div className={`card ${compact ? "card-compact" : ""}`}>
      <div className={`section-head ${compact ? "mb-3" : "mb-4"}`}>
        <div className="section-head-left flex items-center gap-2.5">
          <div className="section-icon w-[34px] h-[34px] rounded-[9px] bg-[#EAF1FF] text-[var(--accent)] flex items-center justify-center flex-shrink-0">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div>
            <h2 className="section-title text-[16px] font-extrabold text-[#111827]">
              My Requests
            </h2>
            {!compact && (
              <p className="section-sub text-[12px] text-[var(--muted-2)] mt-0.5">
                Requests you&apos;ve raised, for yourself or on behalf of other employees.
              </p>
            )}
          </div>
        </div>
      </div>

      {myRequests.length === 0 ? (
        <div className="empty-state text-center py-9 px-5">
          <div className="circle w-[46px] h-[46px] rounded-full bg-[#F3F4F6] flex items-center justify-center mx-auto mb-3 text-[#9CA3AF]">
            <Inbox className="w-5 h-5" />
          </div>
          <div className="title text-[13.5px] font-bold text-[#374151]">
            No requests yet
          </div>
          <div className="sub text-[12px] text-[#9CA3AF] mt-1 max-w-[340px] mx-auto">
            Search for access above to raise your first request.
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {myRequests.map((r) => {
            const updatedDate = formatClientDate(r.updatedAt);

            return (
              <div
                key={r.id}
                onClick={() => onOpenRequestDetail(r.id)}
                className="list-row border border-[var(--border)] rounded-[11px] p-4 cursor-pointer transition flex items-start justify-between gap-4 bg-white hover:border-[#CBD5E1] hover:shadow-xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="result-title text-[14px] font-bold text-[#111827]">
                      {r.accessLabel}
                    </span>
                    {r.category && <CategoryBadge category={r.category} />}
                    {r.onBehalf && (
                      <span className="badge badge-amber">
                        On behalf of {r.beneficiaryName}
                      </span>
                    )}
                    {r.isException && (
                      <span className="badge badge-amber">Exception</span>
                    )}
                  </div>
                  <div className="text-[11.5px] text-[#9CA3AF] mt-1 font-mono">
                    {r.id} · Updated {updatedDate}
                  </div>
                </div>

                <StatusBadge status={r.status} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
