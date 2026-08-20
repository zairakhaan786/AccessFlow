"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { closeRequestAction } from "@/app/actions/requests";
import { showToast } from "@/components/ui/Toast";

interface CloseRequestModalProps {
  requestId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CloseRequestModal({
  requestId,
  onClose,
  onSuccess,
}: CloseRequestModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  if (!requestId) return null;

  const handleConfirm = async () => {
    setIsClosing(true);
    try {
      await closeRequestAction({ requestId });
      showToast(`Request ${requestId} closed`, "success");
      onSuccess();
    } catch (err: any) {
      showToast(err?.message || "Failed to close request", "error");
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <div className="modal-overlay fixed inset-0 bg-[#0F172A]/45 backdrop-blur-xs z-60 flex items-center justify-center p-4 animate-fadeIn">
      <div className="modal-box bg-white rounded-[var(--radius-container)] w-full max-w-[440px] shadow-2xl overflow-hidden animate-modalIn border border-[var(--border)]">
        <div className="modal-head flex items-center justify-between p-4.5 px-5.5 border-b border-[var(--border)]">
          <h3 className="text-[15px] font-bold text-[#111827]">Close request</h3>
          <button
            onClick={onClose}
            className="drawer-close text-[#9CA3AF] hover:text-[#4B5563] p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body p-5">
          <p className="text-[13.5px] text-[#4B5563] leading-relaxed">
            Access has been successfully provisioned. Are you sure you want to close this
            request?
          </p>

          <div className="btn-row flex items-center gap-2.5 mt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isClosing}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isClosing}
              className="btn btn-primary flex-1"
            >
              {isClosing ? "Closing..." : "Confirm Closure"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
