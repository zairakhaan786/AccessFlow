"use client";

import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { rejectRequestAction } from "@/app/actions/requests";
import { showToast } from "@/components/ui/Toast";

interface RejectModalProps {
  requestId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RejectModal({
  requestId,
  onClose,
  onSuccess,
}: RejectModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);

  if (!requestId) return null;

  const handleConfirm = async () => {
    setError(null);
    if (!reason.trim()) {
      setError("Please provide a rejection reason.");
      return;
    }

    setIsRejecting(true);
    try {
      await rejectRequestAction({ requestId, reason: reason.trim() });
      showToast(`Request ${requestId} rejected`, "error");
      onSuccess();
    } catch (err: any) {
      showToast(err?.message || "Failed to reject request", "error");
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="modal-overlay fixed inset-0 bg-[#02040A]/70 backdrop-blur-sm z-60 flex items-center justify-center p-4 animate-fadeIn">
      <div className="modal-box bg-[#0D1526]/95 backdrop-blur-xl rounded-[var(--radius-container)] w-full max-w-[440px] shadow-2xl overflow-hidden animate-modalIn border border-white/10">
        <div className="modal-head flex items-center justify-between p-4.5 px-5.5 border-b border-white/[0.08]">
          <h3 className="text-[15px] font-bold text-[#E5EAF3]">Reject request</h3>
          <button
            onClick={onClose}
            className="drawer-close text-[#64748B] hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body p-5">
          <p className="text-[13px] text-[#94A3B8] mb-2.5">
            Please provide a reason. This will be shared with the requester.
          </p>

          <textarea
            rows={3}
            className={`text-input ${error ? "input-error" : ""}`}
            placeholder="Reason for rejection..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError(null);
            }}
          />

          {error && (
            <div className="field-error text-[11.5px] text-red-400 mt-1.5 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {error}
            </div>
          )}

          <div className="btn-row flex items-center gap-2.5 mt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isRejecting}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isRejecting}
              className="btn btn-danger flex-1"
            >
              {isRejecting ? "Rejecting..." : "Confirm Rejection"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
