"use client";

import React from "react";
import { X, CheckCircle2 } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface ExceptionConfirmModalProps {
  data: {
    id: string;
    accessLabel: string;
    approver: string;
  } | null;
  onClose: () => void;
}

export default function ExceptionConfirmModal({
  data,
  onClose,
}: ExceptionConfirmModalProps) {
  if (!data) return null;

  return (
    <div className="modal-overlay fixed inset-0 bg-[#02040A]/70 backdrop-blur-sm z-60 flex items-center justify-center p-4 animate-fadeIn">
      <div className="modal-box bg-[#0D1526]/95 backdrop-blur-xl rounded-[var(--radius-container)] w-full max-w-[440px] shadow-2xl overflow-hidden animate-modalIn border border-white/10">
        <div className="modal-head flex items-center justify-between p-4.5 px-5.5 border-b border-white/[0.08]">
          <h3 className="text-[15px] font-bold text-[#E5EAF3]">
            Exception request submitted
          </h3>
          <button
            onClick={onClose}
            className="drawer-close text-[#64748B] hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body p-5">
          <div className="success-box flex items-center gap-2 text-[13px] font-semibold text-[#86EFAC] bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-[9px] p-3">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            Your request has been sent for review.
          </div>

          <div className="kv-list mt-4 border border-white/10 rounded-[10px] overflow-hidden text-[13px]">
            <div className="kv-row flex items-center justify-between p-2.5 px-3.5 border-b border-white/[0.07]">
              <span className="text-[var(--muted-2)]">Request ID</span>
              <span className="font-semibold text-[#E2E8F0] font-mono">{data.id}</span>
            </div>
            <div className="kv-row flex items-center justify-between p-2.5 px-3.5 border-b border-white/[0.07]">
              <span className="text-[var(--muted-2)]">Status</span>
              <StatusBadge status="Pending Exception Approval" />
            </div>
            <div className="kv-row flex items-center justify-between p-2.5 px-3.5 border-b border-white/[0.07]">
              <span className="text-[var(--muted-2)]">Access</span>
              <span className="font-semibold text-[#E2E8F0]">{data.accessLabel}</span>
            </div>
            <div className="kv-row flex items-center justify-between p-2.5 px-3.5">
              <span className="text-[var(--muted-2)]">Reviewer</span>
              <span className="font-semibold text-[#E2E8F0]">{data.approver}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary btn-block w-full mt-5"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
