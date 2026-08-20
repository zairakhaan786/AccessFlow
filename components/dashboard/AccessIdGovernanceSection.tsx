"use client";

import React, { useState } from "react";
import { Key, CheckCircle2, Check } from "lucide-react";
import { approveAccessIdAction } from "@/app/actions/requests";
import { showToast } from "@/components/ui/Toast";

export interface AccessIdQueueItemData {
  id: string;
  accessItemId: string;
  status: string;
  requestedBy: string;
  requestedTs: string;
  accessItem: {
    tool: string;
    name: string;
  };
}

interface AccessIdGovernanceSectionProps {
  queueItems: AccessIdQueueItemData[];
}

export default function AccessIdGovernanceSection({
  queueItems,
}: AccessIdGovernanceSectionProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const pending = queueItems.filter(
    (q) => q.status === "Pending Governance Review"
  );

  if (pending.length === 0) return null;

  const handleApprove = async (queueId: string) => {
    setLoadingId(queueId);
    try {
      await approveAccessIdAction({ queueId });
      showToast("Access ID created successfully", "success");
    } catch (err: any) {
      showToast(err?.message || "Failed to approve Access ID", "error");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="card card-tinted-violet border-[#E4DBFB] bg-[#FBFAFF]">
      <div className="section-head mb-4">
        <div className="section-head-left flex items-center gap-2.5">
          <div className="section-icon w-[34px] h-[34px] rounded-[9px] bg-[#EAF1FF] text-[var(--accent)] flex items-center justify-center flex-shrink-0">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <h2 className="section-title text-[16px] font-extrabold text-[#111827]">
              Access ID Requests
            </h2>
            <p className="section-sub text-[12px] text-[var(--muted-2)] mt-0.5">
              New-board Access ID creation is governed — review before it&apos;s issued.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {pending.map((q) => (
          <div
            key={q.id}
            className="bg-white border border-[var(--border)] rounded-[11px] p-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="result-title text-[14px] font-bold text-[#111827]">
                  {q.accessItem.tool} – {q.accessItem.name}
                </div>
                <div className="text-[11.5px] text-[#9CA3AF] mt-1">
                  Requested by {q.requestedBy} · {q.requestedTs}
                </div>
              </div>
              <span className="badge badge-amber">Pending Review</span>
            </div>

            <div className="flex items-center gap-1.5 mt-3 text-[11.5px] text-[#15803D] bg-[#F0FDF4] border border-[#BBF7D0] rounded-[8px] px-3 py-2 w-fit">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              Duplicate check passed — no existing Access ID found.
            </div>

            <button
              onClick={() => handleApprove(q.id)}
              disabled={loadingId === q.id}
              className="btn btn-primary mt-3.5 flex items-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              {loadingId === q.id ? "Creating Access ID..." : "Approve & Create Access ID"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
