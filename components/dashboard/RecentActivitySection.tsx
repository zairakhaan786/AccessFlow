"use client";
import { formatClientDate } from "@/lib/utils";

import React from "react";
import { History } from "lucide-react";

export interface AuditLogItem {
  id: string;
  actorName: string;
  action: string;
  detail: string;
  timestamp: string | Date;
}

interface RecentActivitySectionProps {
  logs: AuditLogItem[];
}

export default function RecentActivitySection({ logs }: RecentActivitySectionProps) {
  const items = logs.slice(0, 8);

  return (
    <div className="card">
      <div className="section-head mb-4">
        <div className="section-head-left flex items-center gap-2.5">
          <div className="section-icon w-[34px] h-[34px] rounded-[9px] bg-[#EAF1FF] text-[var(--accent)] flex items-center justify-center flex-shrink-0">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="section-title text-[16px] font-extrabold text-[#111827]">
              Recent Activity
            </h2>
            <p className="section-sub text-[12px] text-[var(--muted-2)] mt-0.5">
              A traceable record of governed access-management actions.
            </p>
          </div>
        </div>
      </div>

      <div>
        {items.length === 0 ? (
          <div className="text-center py-6 text-xs text-gray-400">
            No recent activity recorded yet.
          </div>
        ) : (
          items.map((a) => {
            const formattedDate =
              typeof a.timestamp === "string"
                ? a.timestamp
                : formatClientDate(a.timestamp);

            return (
              <div
                key={a.id}
                className="activity-row py-3 border-t border-[#F3F4F6] first:border-t-0"
              >
                <div className="activity-action text-[13px] font-bold text-[#1F2937]">
                  {a.action}
                </div>
                <div className="activity-resource text-[12px] text-[#6B7280] mt-0.5">
                  {a.detail}
                </div>
                <div className="activity-meta text-[11.5px] text-[#9CA3AF] mt-1">
                  {a.actorName} · {formattedDate}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
