"use client";

import React from "react";
import { Package } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { RequestItem } from "./MyRequestsSection";

interface AdminQueueSectionProps {
  requests: RequestItem[];
  onOpenAdminRequestDetail: (requestId: string) => void;
}

export default function AdminQueueSection({
  requests,
  onOpenAdminRequestDetail,
}: AdminQueueSectionProps) {
  const queue = requests.filter(
    (r) => r.status === "Pending Manual Provisioning"
  );

  return (
    <div className="card card-tinted-orange">
      <div className="section-head flex items-start justify-between mb-4 gap-3">
        <div className="section-head-left flex items-center gap-2.5">
          <div className="section-icon w-[34px] h-[34px] rounded-[9px] bg-[#F97316]/15 text-[#FDBA74] flex items-center justify-center flex-shrink-0">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h2 className="section-title text-[16px] font-extrabold text-[#E5EAF3]">
              Requests Requiring Admin Action
            </h2>
            <p className="section-sub text-[12px] text-[var(--muted-2)] mt-0.5">
              Approved requests that need manual provisioning.
            </p>
          </div>
        </div>

        {queue.length > 0 && (
          <span className="badge badge-amber">{queue.length} pending</span>
        )}
      </div>

      {queue.length === 0 ? (
        <div className="empty-state text-center py-9 px-5">
          <div className="circle w-[46px] h-[46px] rounded-full bg-white/[0.06] flex items-center justify-center mx-auto mb-3 text-[#64748B]">
            <Package className="w-5 h-5" />
          </div>
          <div className="title text-[13.5px] font-bold text-[#CBD5E1]">
            Nothing pending
          </div>
          <div className="sub text-[12px] text-[#64748B] mt-1 max-w-[340px] mx-auto">
            Approved requests needing manual provisioning will appear here.
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {queue.map((r) => (
            <div
              key={r.id}
              onClick={() => onOpenAdminRequestDetail(r.id)}
              className="list-row border border-white/10 rounded-[11px] p-4 cursor-pointer transition flex items-start justify-between gap-4 bg-white/[0.04] border-l-[3px] border-l-[#F97316] hover:border-[#F97316]/60 hover:shadow-[0_8px_24px_rgba(249,115,22,0.15)]"
            >
              <div className="min-w-0">
                <div className="result-title text-[14px] font-bold text-[#E5EAF3]">
                  {r.accessLabel}
                </div>
                <div className="text-[11.5px] text-[#64748B] mt-1 font-mono">
                  {r.id} · Requester: {r.requesterName} · Approved by {r.approverName} · Assigned provider: {r.providerName}
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
