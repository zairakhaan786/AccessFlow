"use client";
import { formatClientDate } from "@/lib/utils";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { History, Trash2, CalendarRange } from "lucide-react";
import { deleteAuditLogAction } from "@/app/actions/requests";

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

type RangeKey = "all" | "7d" | "21d" | "custom";

const DAY_MS = 24 * 60 * 60 * 1000;

export default function RecentActivitySection({ logs }: RecentActivitySectionProps) {
  const router = useRouter();
  const [range, setRange] = useState<RangeKey>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = logs.filter((a) => {
    const t = new Date(a.timestamp);
    if (range === "7d") {
      return t.getTime() >= Date.now() - 7 * DAY_MS;
    }
    if (range === "21d") {
      return t.getTime() >= Date.now() - 21 * DAY_MS;
    }
    if (range === "custom") {
      const from = fromDate ? new Date(fromDate + "T00:00:00").getTime() : null;
      const to = toDate ? new Date(toDate + "T23:59:59.999").getTime() : null;
      if (from !== null && t.getTime() < from) return false;
      if (to !== null && t.getTime() > to) return false;
      return true;
    }
    return true;
  });

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this activity entry? This cannot be undone.")) return;
    setDeletingId(id);
    await deleteAuditLogAction({ logId: id });
    router.refresh();
  };

  const chips: { key: RangeKey; label: string }[] = [
    { key: "all", label: "All activity" },
    { key: "7d", label: "Last 7 days" },
    { key: "21d", label: "Last 21 days" },
    { key: "custom", label: "Custom range" },
  ];

  return (
    <div className="card">
      <div className="section-head mb-4">
        <div className="section-head-left flex items-center gap-2.5">
          <div className="section-icon w-[34px] h-[34px] rounded-[9px] bg-[#2F6FED]/15 text-[var(--accent)] flex items-center justify-center flex-shrink-0">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="section-title text-[16px] font-extrabold text-[#E5EAF3]">
              Recent Activity
            </h2>
            <p className="section-sub text-[12px] text-[var(--muted-2)] mt-0.5">
              A traceable record of governed access-management actions.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-2.5">
        {chips.map((chip) => (
          <button
            key={chip.key}
            onClick={() => setRange(chip.key)}
            className={`px-3 py-1.5 rounded-[7px] text-[12px] font-semibold transition border ${
              range === chip.key
                ? "bg-gradient-to-r from-[#2F6FED] to-[#1E4FC7] text-white border-transparent shadow-[0_0_12px_rgba(47,111,237,0.35)]"
                : "bg-white/[0.04] text-[#94A3B8] border-white/[0.08] hover:bg-white/[0.08] hover:text-white"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Custom Date Range */}
      {range === "custom" && (
        <div className="flex flex-wrap items-center gap-2 mb-3 p-2.5 rounded-[9px] bg-white/[0.04] border border-white/[0.08]">
          <CalendarRange className="w-3.5 h-3.5 text-[#60A5FA] flex-shrink-0" />
          <label className="text-[11px] font-bold text-slate-400">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="bg-[#0D1526] border border-white/10 rounded-[7px] px-2 py-1.5 text-[12px] text-slate-200 [color-scheme:dark] focus:border-[#2F6FED] focus:outline-none"
          />
          <label className="text-[11px] font-bold text-slate-400">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="bg-[#0D1526] border border-white/10 rounded-[7px] px-2 py-1.5 text-[12px] text-slate-200 [color-scheme:dark] focus:border-[#2F6FED] focus:outline-none"
          />
          <button
            onClick={() => {
              setFromDate("");
              setToDate("");
            }}
            className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition"
          >
            Clear
          </button>
        </div>
      )}

      <div>
        {filtered.length === 0 ? (
          <div className="text-center py-6 text-xs text-[#64748B]">
            {logs.length === 0
              ? "No recent activity recorded yet."
              : "No activity found in this date range."}
          </div>
        ) : (
          <>
            <div className="text-[11px] text-[#64748B] mb-1.5">
              Showing {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
            </div>
            {filtered.map((a) => {
              const formattedDate =
                typeof a.timestamp === "string"
                  ? a.timestamp
                  : formatClientDate(a.timestamp);

              return (
                <div
                  key={a.id}
                  className="group activity-row py-3 border-t border-white/[0.07] first:border-t-0 flex items-start gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="activity-action text-[13px] font-bold text-slate-200">
                      {a.action}
                    </div>
                    <div className="activity-resource text-[12px] text-[#94A3B8] mt-0.5">
                      {a.detail}
                    </div>
                    <div className="activity-meta text-[11.5px] text-[#64748B] mt-1">
                      {a.actorName} · {formattedDate}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(a.id)}
                    disabled={deletingId === a.id}
                    title="Delete entry"
                    className="flex-shrink-0 mt-1 w-7 h-7 rounded-[6px] flex items-center justify-center text-[#64748B] hover:text-red-400 hover:bg-red-500/10 transition opacity-100 md:opacity-0 md:group-hover:opacity-100 disabled:opacity-40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}