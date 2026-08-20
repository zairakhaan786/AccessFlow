"use client";

import React, { useState } from "react";
import DrawerShell from "./DrawerShell";
import { AlertTriangle } from "lucide-react";
import { AccessCatalogItem } from "../dashboard/SearchSection";
import { submitExceptionRequestAction } from "@/app/actions/requests";
import { showToast } from "@/components/ui/Toast";

interface ExceptionFormDrawerProps {
  accessItem: AccessCatalogItem | null;
  onClose: () => void;
  onSubmittedSuccess: (id: string, accessLabel: string, approver: string) => void;
}

export default function ExceptionFormDrawer({
  accessItem,
  onClose,
  onSubmittedSuccess,
}: ExceptionFormDrawerProps) {
  const [reason, setReason] = useState("");
  const [justification, setJustification] = useState("");
  const [requiredUntil, setRequiredUntil] = useState("");
  const [urgency, setUrgency] = useState<"Low" | "Medium" | "High" | "Urgent">("Medium");

  const [errorField, setErrorField] = useState<{ field: string; msg: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!accessItem) return null;

  const handleSubmit = async () => {
    setErrorField(null);

    if (!reason.trim()) {
      setErrorField({ field: "reason", msg: "Please provide a reason for this access." });
      return;
    }

    if (!justification.trim()) {
      setErrorField({
        field: "justification",
        msg: "Please provide a project or business justification.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await submitExceptionRequestAction({
        accessItemId: accessItem.id,
        reason: reason.trim(),
        justification: justification.trim(),
        requiredUntil: requiredUntil || undefined,
        urgency,
      });

      showToast(`Exception request ${res.requestId} submitted`, "success");
      onClose();
      onSubmittedSuccess(
        res.requestId,
        `${accessItem.tool} – ${accessItem.name}`,
        accessItem.approverName
      );
    } catch (err: any) {
      showToast(err?.message || "Failed to submit exception request", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DrawerShell
      isOpen={true}
      onClose={onClose}
      title="Request Access Exception"
      subtitle={`${accessItem.tool} – ${accessItem.name}`}
    >
      <div className="warn-box flex items-start gap-2 text-[13px] text-[#CBD5E1] bg-white/[0.04] border border-white/10 rounded-[9px] p-3.5 mb-5">
        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
        <div>
          You&apos;re requesting access outside your normal eligibility group (
          <strong>{accessItem.group}</strong>). This is submitted as an exception for
          review.
        </div>
      </div>

      <div>
        <span className="form-label text-[11.5px] font-bold uppercase tracking-wider text-[var(--muted-2)] mb-2 block">
          Access
        </span>
        <div className="kv-list border border-white/10 rounded-[10px] overflow-hidden text-[13px]">
          <div className="kv-row flex items-center justify-between p-2.5 px-3.5">
            <span className="text-[var(--muted-2)]">
              {accessItem.tool} – {accessItem.name}
            </span>
            <span className="font-semibold text-[#E2E8F0]">{accessItem.category}</span>
          </div>
        </div>
      </div>

      <div className="mt-4.5">
        <span className="form-label text-[11.5px] font-bold uppercase tracking-wider text-[var(--muted-2)] mb-2 block">
          Reason for access
        </span>
        <input
          className={`text-input ${errorField?.field === "reason" ? "input-error" : ""}`}
          placeholder="e.g. Cross-functional project support"
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setErrorField(null);
          }}
        />
        {errorField?.field === "reason" && (
          <div className="field-error text-[11.5px] text-red-400 mt-1.5 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            {errorField.msg}
          </div>
        )}
      </div>

      <div className="mt-4.5">
        <span className="form-label text-[11.5px] font-bold uppercase tracking-wider text-[var(--muted-2)] mb-2 block">
          Project / business justification
        </span>
        <textarea
          rows={4}
          className={`text-input ${
            errorField?.field === "justification" ? "input-error" : ""
          }`}
          placeholder="Explain the project or business need driving this request..."
          value={justification}
          onChange={(e) => {
            setJustification(e.target.value);
            setErrorField(null);
          }}
        />
        {errorField?.field === "justification" && (
          <div className="field-error text-[11.5px] text-red-400 mt-1.5 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            {errorField.msg}
          </div>
        )}
      </div>

      <div className="field-grid grid grid-cols-2 gap-4 mt-4.5">
        <div>
          <span className="form-label text-[11.5px] font-bold uppercase tracking-wider text-[var(--muted-2)] mb-2 block">
            Required until
          </span>
          <input
            type="date"
            className="text-input"
            value={requiredUntil}
            onChange={(e) => setRequiredUntil(e.target.value)}
          />
        </div>

        <div>
          <span className="form-label text-[11.5px] font-bold uppercase tracking-wider text-[var(--muted-2)] mb-2 block">
            Urgency
          </span>
          <select
            className="text-input"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value as any)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div className="mt-5">
        <span className="form-label text-[11.5px] font-bold uppercase tracking-wider text-[var(--muted-2)] mb-2 block">
          Review
        </span>
        <div className="kv-list border border-white/10 rounded-[10px] overflow-hidden text-[13px]">
          <div className="kv-row flex items-center justify-between p-2.5 px-3.5 border-b border-white/[0.07]">
            <span className="text-[var(--muted-2)]">Will be reviewed by</span>
            <span className="font-semibold text-[#E2E8F0]">
              {accessItem.approverName}
            </span>
          </div>
          <div className="kv-row flex items-center justify-between p-2.5 px-3.5">
            <span className="text-[var(--muted-2)]">Backup approver</span>
            <span className="font-semibold text-[#E2E8F0]">
              {accessItem.backupApproverName}
            </span>
          </div>
        </div>
      </div>

      <div className="btn-row flex items-center gap-2.5 mt-6">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="btn btn-secondary flex-1"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="btn btn-primary flex-1 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(245,158,11,0.35)]"
        >
          {isLoading ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </DrawerShell>
  );
}
