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
    <div className="modal-overlay fixed inset-0 bg-[#0F172A]/45 backdrop-blur-xs z-60 flex items-center justify-center p-4 animate-fadeIn">
      <div className="modal-box bg-white rounded-[var(--radius-container)] w-full max-w-[440px] shadow-2xl overflow-hidden animate-modalIn border border-[var(--border)]">
        <div className="modal-head flex items-center justify-between p-4.5 px-5.5 border-b border-[var(--border)]">
          <h3 className="text-[15px] font-bold text-[#111827]">
            Exception request submitted
          </h3>
          <button
            onClick={onClose}
            className="drawer-close text-[#9CA3AF] hover:text-[#4B5563] p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body p-5">
          <div className="success-box flex items-center gap-2 text-[13px] font-semibold text-[#15803D] bg-[#F0FDF4] border border-[#BBF7D0] rounded-[9px] p-3">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            Your request has been sent for review.
          </div>

          <div className="kv-list mt-4 border border-[var(--border)] rounded-[10px] overflow-hidden text-[13px]">
            <div className="kv-row flex items-center justify-between p-2.5 px-3.5 border-b border-[#F3F4F6]">
              <span className="text-[var(--muted-2)]">Request ID</span>
              <span className="font-semibold text-[#1F2937] font-mono">{data.id}</span>
            </div>
            <div className="kv-row flex items-center justify-between p-2.5 px-3.5 border-b border-[#F3F4F6]">
              <span className="text-[var(--muted-2)]">Status</span>
              <StatusBadge status="Pending Exception Approval" />
            </div>
            <div className="kv-row flex items-center justify-between p-2.5 px-3.5 border-b border-[#F3F4F6]">
              <span className="text-[var(--muted-2)]">Access</span>
              <span className="font-semibold text-[#1F2937]">{data.accessLabel}</span>
            </div>
            <div className="kv-row flex items-center justify-between p-2.5 px-3.5">
              <span className="text-[var(--muted-2)]">Reviewer</span>
              <span className="font-semibold text-[#1F2937]">{data.approver}</span>
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
