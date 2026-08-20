"use client";

import React, { useState } from "react";
import DrawerShell from "./DrawerShell";
import { Shield, Pencil } from "lucide-react";
import { AccessCatalogItem } from "../dashboard/SearchSection";
import {
  toggleAutomationAction,
  updateBoardConfigAction,
} from "@/app/actions/requests";
import { showToast } from "@/components/ui/Toast";

interface BoardConfigDrawerProps {
  accessItem: AccessCatalogItem | null;
  onClose: () => void;
}

export default function BoardConfigDrawer({
  accessItem,
  onClose,
}: BoardConfigDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [approver, setApprover] = useState("");
  const [backupApprover, setBackupApprover] = useState("");
  const [provider, setProvider] = useState("");

  const [isToggling, setIsToggling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!accessItem) return null;

  const handleStartEdit = () => {
    setApprover(accessItem.approverName);
    setBackupApprover(accessItem.backupApproverName);
    setProvider(accessItem.providerName);
    setIsEditing(true);
  };

  const handleToggleAutomation = async () => {
    setIsToggling(true);
    try {
      const res = await toggleAutomationAction({ accessItemId: accessItem.id });
      showToast(
        res.automation ? "Automation enabled" : "Automation disabled",
        "success"
      );
    } catch (err: any) {
      showToast(err?.message || "Failed to toggle automation", "error");
    } finally {
      setIsToggling(false);
    }
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      await updateBoardConfigAction({
        accessItemId: accessItem.id,
        approverName: approver.trim(),
        backupApproverName: backupApprover.trim(),
        providerName: provider.trim(),
      });

      showToast("Configuration updated", "success");
      setIsEditing(false);
    } catch (err: any) {
      showToast(err?.message || "Failed to update configuration", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DrawerShell
      isOpen={!!accessItem}
      onClose={onClose}
      title={accessItem.name}
      subtitle={`${accessItem.tool} · Access configuration`}
    >
      <div className="note-box flex items-center gap-2 text-[11.5px] text-[#6B7280] bg-[#F9FAFB] border border-gray-200/70 rounded-[9px] p-2.5 mb-5">
        <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span>Changes here are governed and recorded in the audit trail.</span>
      </div>

      {!isEditing ? (
        <div id="board-config-view">
          <div className="field-grid grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="field">
              <label className="f-label block text-[11.5px] text-[var(--muted-2)] mb-1">
                Access ID
              </label>
              <div className="f-value text-[13.5px] font-semibold text-[#1F2937]">
                {accessItem.accessId ? (
                  <span className="font-mono">{accessItem.accessId}</span>
                ) : (
                  <span className="text-[#D97706]">Not created</span>
                )}
              </div>
            </div>

            <div className="field">
              <label className="f-label block text-[11.5px] text-[var(--muted-2)] mb-1">
                Board / account creator
              </label>
              <div className="f-value text-[13.5px] font-semibold text-[#1F2937]">
                {accessItem.creator}
              </div>
            </div>

            <div className="field">
              <label className="f-label block text-[11.5px] text-[var(--muted-2)] mb-1">
                Approver
              </label>
              <div className="f-value text-[13.5px] font-semibold text-[#1F2937]">
                {accessItem.approverName}
              </div>
            </div>

            <div className="field">
              <label className="f-label block text-[11.5px] text-[var(--muted-2)] mb-1">
                Backup approver
              </label>
              <div className="f-value text-[13.5px] font-semibold text-[#1F2937]">
                {accessItem.backupApproverName}
              </div>
            </div>

            <div className="field">
              <label className="f-label block text-[11.5px] text-[var(--muted-2)] mb-1">
                Access provider / admin
              </label>
              <div className="f-value text-[13.5px] font-semibold text-[#1F2937]">
                {accessItem.providerName}
              </div>
            </div>

            <div className="field">
              <label className="f-label block text-[11.5px] text-[var(--muted-2)] mb-1">
                Eligibility group
              </label>
              <div className="f-value text-[13.5px] font-semibold text-[#1F2937]">
                {accessItem.group}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[var(--border)] flex items-center justify-between">
            <div>
              <div className="text-[13.5px] font-bold text-[#1F2937]">
                Automated provisioning
              </div>
              <div className="text-[11.5px] text-[#9CA3AF] mt-0.5">
                {accessItem.automation
                  ? "Enabled — access is granted automatically on approval."
                  : "Disabled — requests route to manual provisioning."}
              </div>
            </div>

            <button
              onClick={handleToggleAutomation}
              disabled={isToggling}
              className="toggle-switch relative w-[42px] h-[24px] rounded-full border-none flex-shrink-0 transition"
              style={{
                backgroundColor: accessItem.automation
                  ? "var(--accent)"
                  : "#D1D5DB",
              }}
            >
              <span
                className="toggle-knob absolute top-[2px] w-[20px] h-[20px] rounded-full bg-white transition-all shadow-xs"
                style={{ left: accessItem.automation ? "20px" : "2px" }}
              />
            </button>
          </div>

          <button
            onClick={handleStartEdit}
            className="btn btn-secondary btn-block w-full mt-6 flex items-center justify-center gap-2"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit Approver / Provider
          </button>
        </div>
      ) : (
        <div id="board-config-edit" className="space-y-4 animate-fadeIn">
          <div>
            <span className="form-label text-[11.5px] font-bold uppercase tracking-wider text-[var(--muted-2)] mb-1.5 block">
              Approver
            </span>
            <input
              className="text-input"
              value={approver}
              onChange={(e) => setApprover(e.target.value)}
            />
          </div>

          <div>
            <span className="form-label text-[11.5px] font-bold uppercase tracking-wider text-[var(--muted-2)] mb-1.5 block">
              Backup approver
            </span>
            <input
              className="text-input"
              value={backupApprover}
              onChange={(e) => setBackupApprover(e.target.value)}
            />
          </div>

          <div>
            <span className="form-label text-[11.5px] font-bold uppercase tracking-wider text-[var(--muted-2)] mb-1.5 block">
              Access provider / admin
            </span>
            <input
              className="text-input"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
            />
          </div>

          <div className="btn-row flex items-center gap-2.5 mt-6 pt-2">
            <button
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveConfig}
              disabled={isSaving}
              className="btn btn-primary flex-1"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </DrawerShell>
  );
}
