"use client";
import { formatClientDate } from "@/lib/utils";

import React, { useState, useMemo } from "react";
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

type FilterType = "Recent" | "Past Week" | "Past Month";

export default function RecentActivitySection({ logs }: RecentActivitySectionProps) {
  const [filter, setFilter] = useState<FilterType>("Recent");

  const filteredLogs = useMemo(() => {
    if (filter === "Recent") return logs.slice(0, 8);

    const now = new Date();
    const cutoff = new Date();

    if (filter === "Past Week") {
      cutoff.setDate(now.getDate() - 7);
    } else if (filter === "Past Month") {
      cutoff.setDate(now.getDate() - 30);
    }

    return logs.filter((log) => {
      const logDate =
        typeof log.timestamp === "string" ? new Date(log.timestamp) : log.timestamp;
      return logDate >= cutoff;
    }).slice(0, 50); // limit to 50 for UI performance
  }, [logs, filter]);

  const tabs: FilterType[] = ["Recent", "Past Week", "Past Month"];

  return (
    <div className="card">
      <div className="section-head mb-4 flex justify-between items-start">
        <div className="section-head-left flex items-center gap-2.5">
          <div className="section-icon w-[34px] h-[34px] rounded-[9px] bg-[#EAF1FF] text-[var(--accent)] flex items-center justify-center flex-shrink-0">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="section-title text-[16px] font-extrabold text-[#111827]">
              Activity History
            </h2>
            <p className="section-sub text-[12px] text-[var(--muted-2)] mt-0.5">
              A traceable record of governed access-management actions.
            </p>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex bg-[#F5F6F8] p-1 rounded-lg border border-[#E5E7EB]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${
                filter === tab
                  ? "bg-white text-[var(--accent)] shadow-sm border border-[#E5E7EB]"
                  : "text-[var(--muted)] hover:text-[#111827]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-6 text-xs text-gray-400">
            No activity recorded for this period.
          </div>
        ) : (
          filteredLogs.map((a) => {
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
