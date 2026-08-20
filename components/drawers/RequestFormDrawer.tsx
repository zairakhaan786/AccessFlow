"use client";

import React, { useState, useMemo } from "react";
import DrawerShell from "./DrawerShell";
import { Users, Info, Check, CheckCircle2, AlertTriangle } from "lucide-react";
import { AccessCatalogItem } from "../dashboard/SearchSection";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { submitRequestAction } from "@/app/actions/requests";
import { showToast } from "@/components/ui/Toast";

interface AvailableUser {
  id: string;
  name: string;
  email: string;
  group?: string;
  title?: string | null;
}

interface RequestFormDrawerProps {
  accessItem: AccessCatalogItem | null;
  currentUserName: string;
  availableUsers?: AvailableUser[];
  onClose: () => void;
}

export default function RequestFormDrawer({
  accessItem,
  currentUserName,
  availableUsers = [],
  onClose,
}: RequestFormDrawerProps) {
  const [beneficiaryType, setBeneficiaryType] = useState<"self" | "other">("self");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("");
  const [justification, setJustification] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const [errorField, setErrorField] = useState<{ field: string; msg: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Dynamically compute employee beneficiary choices from real DB users, excluding logged-in user
  const employeeList = useMemo(() => {
    if (availableUsers && availableUsers.length > 0) {
      const filtered = availableUsers
        .filter((u) => u.name !== currentUserName)
        .map((u) => ({
          name: u.name,
          group: u.group || "Team Member",
          email: u.email,
        }));
      if (filtered.length > 0) return filtered;
    }
    return [
      { name: "Vanshika Sharma", group: "Product Team", email: "vanshika@company.com" },
      { name: "Rohit Malhotra", group: "Engineering Team", email: "rohit@company.com" },
      { name: "Ananya Rao", group: "Support Team", email: "ananya@company.com" },
      { name: "Kabir Singh", group: "Sales Team", email: "kabir@company.com" },
      { name: "Priya Menon", group: "Marketing Team", email: "priya@company.com" },
    ];
  }, [availableUsers, currentUserName]);

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

  const handleReset = () => {
    setSubmittedId(null);
    setBeneficiaryType("self");
    setSelectedBeneficiary("");
    setJustification("");
    setErrorField(null);
    onClose();
  };

  return (
    <DrawerShell
      isOpen={!!accessItem}
      onClose={handleReset}
      title={accessItem.tool}
      subtitle={accessItem.name}
      badge={<StatusBadge status="Request" />}
    >
      {submittedId ? (
        <div className="py-6 text-center animate-fadeIn">
          <div className="w-12 h-12 rounded-full bg-[#22C55E]/15 text-[#86EFAC] flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#E5EAF3]">
            Access Request Submitted
          </h3>
          <p className="text-sm text-[var(--muted)] mt-1 max-w-sm mx-auto">
            Your request <span className="font-mono font-bold text-[#E5EAF3]">{submittedId}</span> has been routed to{" "}
            <strong>{accessItem.approverName}</strong> for review.
          </p>

          <div className="mt-6 pt-6 border-t border-[var(--border)] flex gap-3">
            <button
              onClick={handleReset}
              className="btn btn-primary btn-block flex-1"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {/* Who is this for */}
          <div className="mb-6">
            <span className="form-label text-[11.5px] font-bold uppercase tracking-wider text-[var(--muted-2)] mb-2.5 block">
              Who is this request for?
            </span>

            {/* Choice: Myself */}
            <button
              type="button"
              onClick={() => {
                setBeneficiaryType("self");
                setSelectedBeneficiary("");
                setErrorField(null);
              }}
              className={`choice-card w-full text-left p-3.5 rounded-[10px] border-2 transition flex items-center gap-3 mb-2 ${
                beneficiaryType === "self"
                  ? "border-[var(--accent)] bg-[#2F6FED]/14 shadow-[0_0_0_1px_var(--accent)]"
                  : "border-white/12 bg-white/[0.04] hover:bg-white/[0.07]"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  beneficiaryType === "self"
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                    : "border-[#475569] bg-transparent"
                }`}
              >
                {beneficiaryType === "self" && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <div>
                <div className="t text-[13.5px] font-bold text-[#E5EAF3]">
                  Myself ({currentUserName})
                </div>
                <div className="d text-[11.5px] text-[var(--muted-2)]">
                  Access will be provisioned directly to your account
                </div>
              </div>
            </button>

            {/* Choice: Someone else */}
            <button
              type="button"
              onClick={() => {
                setBeneficiaryType("other");
                setErrorField(null);
              }}
              className={`choice-card w-full text-left p-3.5 rounded-[10px] border-2 transition flex items-center gap-3 ${
                beneficiaryType === "other"
                  ? "border-[var(--accent)] bg-[#2F6FED]/14 shadow-[0_0_0_1px_var(--accent)]"
                  : "border-white/12 bg-white/[0.04] hover:bg-white/[0.07]"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  beneficiaryType === "other"
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                    : "border-[#475569] bg-transparent"
                }`}
              >
                {beneficiaryType === "other" && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <div>
                <div className="t text-[13.5px] font-bold text-[#E5EAF3]">Someone else</div>
                <div className="d text-[11.5px] text-[var(--muted-2)]">
                  Raise this on behalf of another employee
                </div>
              </div>
            </button>

            {beneficiaryType === "other" && (
              <div className="mt-3 animate-fadeIn">
                <label className="form-label text-[11px] font-semibold text-[var(--muted-2)] mb-1 block">
                  Select Employee (from database)
                </label>
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
                  {employeeList.map((emp) => (
                    <option key={emp.name} value={emp.name}>
                      {emp.name} — {emp.group} ({emp.email})
                    </option>
                  ))}
                </select>
                {errorField?.field === "beneficiary" && (
                  <div className="field-error text-[11.5px] text-red-400 mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {errorField.msg}
                  </div>
                )}
                <div className="note-box flex gap-2 text-[11.5px] text-[#94A3B8] bg-white/[0.04] border border-white/10 rounded-[9px] p-2.5 mt-2.5">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--accent)]" />
                  <span>
                    You&apos;ll remain the requester of record and can close this request once
                    access is provisioned, even if the beneficiary is unavailable.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Access summary */}
          <div className="mb-6">
            <span className="form-label text-[11.5px] font-bold uppercase tracking-wider text-[var(--muted-2)] mb-2 block">
              Access summary
            </span>
            <div className="kv-list border border-white/10 rounded-[10px] overflow-hidden text-[13px] bg-white/[0.04]">
              <div className="kv-row flex items-center justify-between p-2.5 px-3.5 border-b border-white/[0.07]">
                <span className="text-[var(--muted-2)]">Request type</span>
                <span className="font-semibold text-[#E2E8F0]">{accessItem.requestType}</span>
              </div>
              <div className="kv-row flex items-center justify-between p-2.5 px-3.5 border-b border-white/[0.07]">
                <span className="text-[var(--muted-2)]">Access ID</span>
                <span className="font-mono font-semibold text-[#E2E8F0]">
                  {accessItem.accessId || "—"}
                </span>
              </div>
              <div className="kv-row flex items-center justify-between p-2.5 px-3.5 border-b border-white/[0.07]">
                <span className="text-[var(--muted-2)]">Routing approver</span>
                <span className="font-semibold text-[#E2E8F0]">{accessItem.approverName}</span>
              </div>
              <div className="kv-row flex items-center justify-between p-2.5 px-3.5">
                <span className="text-[var(--muted-2)]">Provisioning method</span>
                <span className="font-semibold text-[#E2E8F0]">
                  {accessItem.automation ? "Automated" : "Manual Queue"}
                </span>
              </div>
            </div>
          </div>

          {/* Justification */}
          <div className="mb-6">
            <label className="form-label text-[11.5px] font-bold uppercase tracking-wider text-[var(--muted-2)] mb-2 block">
              Business Justification <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              className={`text-input ${
                errorField?.field === "justification" ? "input-error" : ""
              }`}
              placeholder="Explain why you or the beneficiary require access to this board..."
              value={justification}
              onChange={(e) => {
                setJustification(e.target.value);
                setErrorField(null);
              }}
              disabled={isLoading}
            />
            {errorField?.field === "justification" && (
              <div className="field-error text-[11.5px] text-red-400 mt-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {errorField.msg}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-5 border-t border-white/10 flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary flex-1"
            >
              {isLoading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      )}
    </DrawerShell>
  );
}
