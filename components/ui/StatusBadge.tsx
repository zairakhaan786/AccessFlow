import React from "react";
import { CheckCircle2, Circle, Clock, Check, Lock, AlertTriangle, Shield } from "lucide-react";

export const STATUS_CLASSES: Record<string, string> = {
  "Pending Approval": "badge-amber",
  "Pending Exception Approval": "badge-amber",
  "Pending Manual Provisioning": "badge-amber",
  "Pending Governance Review": "badge-amber",
  "Approved": "badge-green",
  "Provisioning": "badge-teal",
  "Access Provisioned": "badge-teal",
  "Completed": "badge-green",
  "Rejected": "badge-red",
};

export function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_CLASSES[status] || "badge-gray";
  return <span className={`badge ${cls}`}>{status}</span>;
}

export function CategoryBadge({ category }: { category: string }) {
  return <span className="badge badge-gray">{category}</span>;
}

export function EligibilityBadge({ eligible }: { eligible: boolean }) {
  if (eligible) {
    return (
      <span className="badge badge-green flex items-center gap-1">
        <Check className="w-3 h-3 stroke-[2.5]" />
        Eligible
      </span>
    );
  }
  return (
    <span className="badge badge-gray flex items-center gap-1">
      <Lock className="w-3 h-3" />
      Not eligible
    </span>
  );
}

export interface TimelineStepItem {
  label: string;
  actor?: string;
  ts?: string;
  state: "done" | "current" | "pending";
}

export function Timeline({ steps }: { steps: TimelineStepItem[] }) {
  return (
    <div className="timeline pl-1">
      {steps.map((s, i) => {
        const isLast = i === steps.length - 1;
        return (
          <div key={i} className="t-row flex gap-3 relative pb-[22px] last:pb-0">
            {!isLast && (
              <div
                className="t-line absolute left-[9px] top-[20px] bottom-0 w-[1px]"
                style={{ background: s.state === "done" ? "#22C55E" : "#E5E7EB" }}
              />
            )}

            <div className="t-dot w-5 h-5 flex-shrink-0 mt-[1px] z-10">
              {s.state === "done" && (
                <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
              )}
              {s.state === "current" && (
                <div className="w-5 h-5 rounded-full border-2 border-[var(--accent)] flex items-center justify-center bg-white">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                </div>
              )}
              {s.state === "pending" && (
                <Circle className="w-5 h-5 text-[#D1D5DB]" />
              )}
            </div>

            <div>
              <div
                className={`t-label text-[13.5px] font-bold ${
                  s.state === "pending" ? "text-[#9CA3AF]" : "text-[#111827]"
                }`}
              >
                {s.label}
              </div>
              {(s.actor || s.ts) && (
                <div className="t-meta text-[11.5px] text-[#6B7280] mt-0.5">
                  {s.actor} {s.actor && s.ts ? "·" : ""} {s.ts}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
