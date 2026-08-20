"use client";

import React, { useState } from "react";
import DrawerShell from "./DrawerShell";
import { CheckCircle2, Lock, AlertTriangle, Key, Clock } from "lucide-react";
import { AccessCatalogItem } from "../dashboard/SearchSection";
import { requestAccessIdAction } from "@/app/actions/requests";
import { showToast } from "@/components/ui/Toast";

interface AccessDetailsDrawerProps {
  accessItem: AccessCatalogItem | null;
  currentUserGroup: string;
  isGovernancePending: boolean;
  onClose: () => void;
  onRequestAccess: (accessId: string) => void;
  onRequestException: (accessId: string) => void;
  onViewAccessIdStatus: (accessId: string) => void;
}

export default function AccessDetailsDrawer({
  accessItem,
  currentUserGroup,
  isGovernancePending,
  onClose,
  onRequestAccess,
  onRequestException,
  onViewAccessIdStatus,
}: AccessDetailsDrawerProps) {
  const [loadingGov, setLoadingGov] = useState(false);

  if (!accessItem) return null;

  let eligible = false;
  try {
    const groups: string[] = JSON.parse(accessItem.eligibleGroups);
    eligible = groups.includes(currentUserGroup);
  } catch {
    eligible = accessItem.group === currentUserGroup;
  }

  const handleRequestAccessId = async () => {
    setLoadingGov(true);
    try {
      await requestAccessIdAction({ accessItemId: accessItem.id });
      showToast("Access ID creation requested", "success");
      onViewAccessIdStatus(accessItem.id);
    } catch (err: any) {
      showToast(err?.message || "Failed to request Access ID", "error");
    } finally {
      setLoadingGov(false);
    }
  };

  return (
    <DrawerShell
      isOpen={!!accessItem}
      onClose={onClose}
      title={accessItem.name}
      subtitle={`${accessItem.tool} · ${accessItem.category}`}
    >
      <p className="text-[13.5px] text-[#6B7280] leading-relaxed">
        {accessItem.description}
      </p>

      <div className="mt-6 pt-5 border-t border-[var(--border)]">
        <div className="divider-label text-[11.5px] font-bold uppercase tracking-wider text-[var(--muted-2)] mb-3">
          Access Details
        </div>

        <div className="field-grid grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="field">
            <label className="f-label block text-[11.5px] text-[var(--muted-2)] mb-1">
              Access ID
            </label>
            <div className="f-value text-[13.5px] font-semibold text-[#1F2937]">
              {accessItem.accessId ? (
                <span className="font-mono">{accessItem.accessId}</span>
              ) : (
                <span className="text-[#D97706]">Not available</span>
              )}
            </div>
          </div>

          <div className="field">
            <label className="f-label block text-[11.5px] text-[var(--muted-2)] mb-1">
              Request type
            </label>
            <div className="f-value text-[13.5px] font-semibold text-[#1F2937]">
              {accessItem.requestType}
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
              Provisioning
            </label>
            <div className="f-value text-[13.5px] font-semibold text-[#1F2937]">
              {accessItem.automation
                ? "Automated on approval"
                : "Manual, by access provider"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-[var(--border)]">
        {eligible ? (
          <div>
            <div className="success-box flex items-center gap-2 text-[13px] font-semibold text-[#15803D] bg-[#F0FDF4] border border-[#BBF7D0] rounded-[9px] p-3.5">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              You&apos;re eligible for this access.
            </div>

            {accessItem.accessId ? (
              <button
                onClick={() => onRequestAccess(accessItem.id)}
                className="btn btn-primary btn-block mt-4.5 w-full"
              >
                Request Access
              </button>
            ) : (
              <div className="mt-4.5 space-y-2.5">
                <button className="btn btn-primary btn-block w-full" disabled>
                  Access ID required first
                </button>
                {isGovernancePending ? (
                  <button
                    onClick={() => onViewAccessIdStatus(accessItem.id)}
                    className="btn btn-secondary btn-block w-full flex items-center justify-center gap-2"
                  >
                    <Clock className="w-4 h-4" /> Access ID Creation Pending — View Status
                  </button>
                ) : (
                  <button
                    onClick={handleRequestAccessId}
                    disabled={loadingGov}
                    className="btn btn-secondary btn-block w-full flex items-center justify-center gap-2"
                  >
                    <Key className="w-4 h-4" />{" "}
                    {loadingGov
                      ? "Requesting Access ID..."
                      : "Request Access ID Creation"}
                  </button>
                )}
                <p className="text-[11.5px] text-[#9CA3AF] mt-2.5 text-center">
                  This board doesn&apos;t have an Access ID yet. We&apos;ll route a governed
                  request to the Board Admin to create one.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="warn-box flex items-start gap-2 text-[13px] text-[#374151] bg-[#F9FAFB] border border-[var(--border)] rounded-[9px] p-3.5">
              <Lock className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-bold text-[#374151]">
                  You&apos;re not currently eligible for this access
                </div>
                <div className="text-[#6B7280] mt-0.5">
                  This access is normally restricted to the {accessItem.group}.
                </div>
              </div>
            </div>

            <div className="exception-box bg-[#FFFBEB] border border-[#FDE68A] rounded-[11px] p-4 mt-3.5">
              <div className="t1 text-[13.5px] font-bold text-[#92400E]">
                Need this access for your project?
              </div>
              <div className="t2 text-[12px] text-[#78350F] mt-1">
                You can submit an exception request for review by the designated approver.
              </div>
              <button
                onClick={() => onRequestException(accessItem.id)}
                className="btn btn-primary btn-block w-full mt-3.5 bg-[#B45309] hover:bg-[#92400E] flex items-center justify-center gap-2 text-white"
              >
                <AlertTriangle className="w-4 h-4" /> Request Access Exception
              </button>
            </div>
          </div>
        )}
      </div>
    </DrawerShell>
  );
}
