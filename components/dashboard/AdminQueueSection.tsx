"use client";

import React from "react";
import { Package, Inbox } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { RequestItem } from "./MyRequestsSection";

interface AdminQueueSectionProps {
  requests: RequestItem[];
  currentUserName: string;
  onOpenAdminRequestDetail: (requestId: string) => void;
}

export default function AdminQueueSection({
  requests,
  currentUserName,
  onOpenAdminRequestDetail,
}: AdminQueueSectionProps) {
  const queue = requests.filter(
    (r) =>
      r.status === "Pending Manual Provisioning" &&
      (r.providerName.toLowerCase() === currentUserName.toLowerCase() || true)
  );

  return (
    <div className="card card-tinted-orange border-[#FBD9B8] bg-[#FFFAF5]">
      <div className="section-head flex items-start justify-between mb-4 gap-3">
        <div className="section-head-left flex items-center gap-2.5">
          <div className="section-icon w-[34px] h-[34px] rounded-[9px] bg-[#FFF1E0] text-[#C2410C] flex items-center justify-center flex-shrink-0">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h2 className="section-title text-[16px] font-extrabold text-[#111827]">
              Requests Requiring Admin Action
            </h2>
            <p className="section-sub text-[12px] text-[var(--muted-2)] mt-0.5">
              Approved requests that need manual provisioning.
            </p>
          </div>
        </div>

        {queue.length > 0 && (
          <span className="badge badge-orange">{queue.length} pending</span>
        )}
      </div>

      {queue.length === 0 ? (
        <div className="empty-state text-center py-9 px-5">
          <div className="circle w-[46px] h-[46px] rounded-full bg-[#F3F4F6] flex items-center justify-center mx-auto mb-3 text-[#9CA3AF]">
            <Package className="w-5 h-5" />
          </div>
          <div className="title text-[13.5px] font-bold text-[#374151]">
            Nothing pending
          </div>
          <div className="sub text-[12px] text-[#9CA3AF] mt-1 max-w-[340px] mx-auto">
            Approved requests needing manual provisioning will appear here.
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {queue.map((r) => (
            <div
              key={r.id}
              onClick={() => onOpenAdminRequestDetail(r.id)}
              className="list-row border border-[var(--border)] rounded-[11px] p-4 cursor-pointer transition flex items-start justify-between gap-4 bg-white border-l-[3px] border-l-[#F97316] hover:border-[#CBD5E1] hover:shadow-xs"
            >
              <div className="min-w-0">
                <div className="result-title text-[14px] font-bold text-[#111827]">
                  {r.accessLabel}
                </div>
                <div className="text-[11.5px] text-[#9CA3AF] mt-1 font-mono">
                  {r.id} · Requester: {r.requesterName} · Approved by {r.approverName}
                </div>
              </div>

              <StatusBadge status={r.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
