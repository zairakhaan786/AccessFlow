"use client";

import React, { useState } from "react";
import DrawerShell from "./DrawerShell";
import { Users, Info, Check, CheckCircle2, AlertTriangle } from "lucide-react";
import { AccessCatalogItem } from "../dashboard/SearchSection";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { submitRequestAction } from "@/app/actions/requests";
import { showToast } from "@/components/ui/Toast";

const EMPLOYEES = [
  "Vanshika Sharma",
  "Rohit Malhotra",
  "Ananya Rao",
  "Kabir Singh",
  "Priya Menon",
];

interface RequestFormDrawerProps {
  accessItem: AccessCatalogItem | null;
  currentUserName: string;
  onClose: () => void;
}

export default function RequestFormDrawer({
  accessItem,
  currentUserName,
  onClose,
}: RequestFormDrawerProps) {
  const [beneficiaryType, setBeneficiaryType] = useState<"self" | "other">("self");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("");
  const [justification, setJustification] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const [errorField, setErrorField] = useState<{ field: string; msg: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!accessItem) return null;

  const handleSubmit = async () => {
    setErrorField(null);

    let beneficiary = currentUserName;
    let onBehalf = false;

    if (beneficiaryType === "other") {
      if (!selectedBeneficiary) {
        setErrorField({ field: "beneficiary", msg: "Please select an employee." });
        return;
      }
      beneficiary = selectedBeneficiary;
      onBehalf = true;
    }

    if (!justification.trim()) {
      setErrorField({
        field: "justification",
        msg: "Please add a short business justification.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await submitRequestAction({
        accessItemId: accessItem.id,
        beneficiaryName: beneficiary,
        onBehalf,
        justification: justification.trim(),
      });

      setSubmittedId(res.requestId);
      showToast(`Access request ${res.requestId} submitted`, "success");
    } catch (err: any) {
      showToast(err?.message || "Failed to submit request", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDone = () => {
    setSubmittedId(null);
    setJustification("");
    setSelectedBeneficiary("");
    setBeneficiaryType("self");
    onClose();
  };

  if (submittedId) {
    return (
      <DrawerShell isOpen={true} onClose={handleDone} title="Request submitted">
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full bg-[#F0FDF4] text-[#22C55E] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-[17px] font-extrabold text-[#111827]">
            Access request submitted
          </h3>
          <p className="text-[13px] text-[#6B7280] mt-1">
            We&apos;ll notify you as it moves through approval.
          </p>

          <div className="kv-list mt-6 text-left border border-[var(--border)] rounded-[10px] overflow-hidden">
            <div className="kv-row flex items-center justify-between p-3 px-4 text-[13px] border-b border-[#F3F4F6]">
              <span className="text-[var(--muted-2)]">Request ID</span>
              <span className="font-semibold text-[#1F2937] font-mono">{submittedId}</span>
            </div>
            <div className="kv-row flex items-center justify-between p-3 px-4 text-[13px] border-b border-[#F3F4F6]">
              <span className="text-[var(--muted-2)]">Status</span>
              <StatusBadge status="Pending Approval" />
            </div>
            <div className="kv-row flex items-center justify-between p-3 px-4 text-[13px] border-b border-[#F3F4F6]">
              <span className="text-[var(--muted-2)]">Approver</span>
              <span className="font-semibold text-[#1F2937]">{accessItem.approverName}</span>
            </div>
            <div className="kv-row flex items-center justify-between p-3 px-4 text-[13px]">
              <span className="text-[var(--muted-2)]">Requested access</span>
              <span className="font-semibold text-[#1F2937]">
                {accessItem.tool} – {accessItem.name}
              </span>
            </div>
          </div>

          <button onClick={handleDone} className="btn btn-primary btn-block w-full mt-6">
            Done
          </button>
        </div>
      </DrawerShell>
    );
  }

  return (
    <DrawerShell
      isOpen={true}
      onClose={onClose}
      title="Request Access"
      subtitle={`${accessItem.tool} – ${accessItem.name}`}
    >
      <div>
        <span className="form-label text-[11.5px] font-bold uppercase tracking-wider text-[var(--muted-2)] mb-2 block">
          Who is this for?
        </span>

        {/* Self Option */}
        <button
          type="button"
          onClick={() => {
            setBeneficiaryType("self");
            setErrorField(null);
          }}
          className={`choice-card w-full text-left p-3.5 rounded-[10px] border-2 bg-white flex items-center gap-3 mb-2 transition ${
            beneficiaryType === "self"
              ? "border-[var(--accent)] bg-[#F5F8FF]"
              : "border-[var(--border)] hover:border-gray-300"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
            {currentUserName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div>
            <div className="t text-[13.5px] font-bold text-[#111827]">
              Myself — {currentUserName}
            </div>
            <div className="d text-[11.5px] text-[var(--muted-2)]">
              Request access for your own account
            </div>
          </div>
        </button>

        {/* Other Option */}
        <button
          type="button"
          onClick={() => {
            setBeneficiaryType("other");
            setErrorField(null);
          }}
          className={`choice-card w-full text-left p-3.5 rounded-[10px] border-2 bg-white flex items-center gap-3 mb-2 transition ${
            beneficiaryType === "other"
              ? "border-[var(--accent)] bg-[#F5F8FF]"
              : "border-[var(--border)] hover:border-gray-300"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-[#E5E7EB] text-[#6B7280] flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="t text-[13.5px] font-bold text-[#111827]">Someone else</div>
            <div className="d text-[11.5px] text-[var(--muted-2)]">
              Raise this on behalf of another employee
            </div>
          </div>
        </button>

        {beneficiaryType === "other" && (
          <div className="mt-2 animate-fadeIn">
            <select
              className={`text-input ${
                errorField?.field === "beneficiary" ? "input-error" : ""
              }`}
              value={selectedBeneficiary}
              onChange={(e) => {
                setSelectedBeneficiary(e.target.value);
                setErrorField(null);
              }}
            >
              <option value="">Select employee…</option>
              {EMPLOYEES.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
            {errorField?.field === "beneficiary" && (
              <div className="field-error text-[11.5px] text-red-600 mt-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {errorField.msg}
              </div>
            )}
            <div className="note-box flex gap-2 text-[11.5px] text-[#6B7280] bg-[#F9FAFB] border border-gray-200/60 rounded-[9px] p-2.5 mt-2.5">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                You&apos;ll remain the requester of record and can close this request once
                access is provisioned, even if the beneficiary is unavailable.
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <span className="form-label text-[11.5px] font-bold uppercase tracking-wider text-[var(--muted-2)] mb-2 block">
          Access summary
        </span>
        <div className="kv-list border border-[var(--border)] rounded-[10px] overflow-hidden text-[13px]">
          <div className="kv-row flex items-center justify-between p-2.5 px-3.5 border-b border-[#F3F4F6]">
            <span className="text-[var(--muted-2)]">Request type</span>
            <span className="font-semibold text-[#1F2937]">{accessItem.requestType}</span>
          </div>
          <div className="kv-row flex items-center justify-between p-2.5 px-3.5 border-b border-[#F3F4F6]">
            <span className="text-[var(--muted-2)]">Approver</span>
            <span className="font-semibold text-[#1F2937]">{accessItem.approverName}</span>
          </div>
          <div className="kv-row flex items-center justify-between p-2.5 px-3.5 border-b border-[#F3F4F6]">
            <span className="text-[var(--muted-2)]">Backup approver</span>
            <span className="font-semibold text-[#1F2937]">
              {accessItem.backupApproverName}
            </span>
          </div>
          <div className="kv-row flex items-center justify-between p-2.5 px-3.5">
            <span className="text-[var(--muted-2)]">Provisioning</span>
            <span className="font-semibold text-[#1F2937]">
              {accessItem.automation
                ? "Automatic on approval"
                : `Manual, by ${accessItem.providerName}`}
            </span>
          </div>
        </div>
        <p className="text-[11.5px] text-[#9CA3AF] mt-2">
          Request type and approver are determined automatically.
        </p>
      </div>

      <div className="mt-6">
        <span className="form-label text-[11.5px] font-bold uppercase tracking-wider text-[var(--muted-2)] mb-2 block">
          Business justification
        </span>
        <textarea
          rows={4}
          className={`text-input ${
            errorField?.field === "justification" ? "input-error" : ""
          }`}
          placeholder="Briefly explain why this access is needed..."
          value={justification}
          onChange={(e) => {
            setJustification(e.target.value);
            setErrorField(null);
          }}
        />
        {errorField?.field === "justification" && (
          <div className="field-error text-[11.5px] text-red-600 mt-1.5 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            {errorField.msg}
          </div>
        )}
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
          className="btn btn-primary flex-1 flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          {isLoading ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </DrawerShell>
  );
}
