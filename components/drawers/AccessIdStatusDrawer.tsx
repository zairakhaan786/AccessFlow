"use client";

import React from "react";
import DrawerShell from "./DrawerShell";
import { Timeline } from "@/components/ui/Timeline";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Clock } from "lucide-react";
import { AccessCatalogItem } from "../dashboard/SearchSection";
import { AccessIdQueueItemData } from "../dashboard/AccessIdGovernanceSection";

interface AccessIdStatusDrawerProps {
  accessItem: AccessCatalogItem | null;
  queueItem: AccessIdQueueItemData | null;
  currentUserName: string;
  onClose: () => void;
  onContinueRequest: (accessId: string) => void;
}

export default function AccessIdStatusDrawer({
  accessItem,
  queueItem,
  currentUserName,
  onClose,
  onContinueRequest,
}: AccessIdStatusDrawerProps) {
  if (!accessItem || !queueItem) return null;

  const isCreated = queueItem.status === "Access ID Created";

  const steps = [
    {
      label: "Access ID Creation Requested",
      actor: queueItem.requestedBy,
      ts: queueItem.requestedTs,
      state: "done" as const,
    },
    {
      label: "Board Admin Review (governed)",
      actor: isCreated ? "Rahul Sharma" : "Pending review",
      ts: isCreated ? "17 Aug 2026, 4:00 PM" : "—",
      state: isCreated ? ("done" as const) : ("current" as const),
    },
    {
      label: "Access ID Created",
      actor: isCreated ? "System" : "",
      ts: isCreated ? "17 Aug 2026, 4:00 PM" : "",
      state: isCreated ? ("done" as const) : ("pending" as const),
    },
    {
      label: "Continue Access Request",
      actor: "",
      ts: "",
      state: isCreated ? ("current" as const) : ("pending" as const),
    },
  ];

  return (
    <DrawerShell
      isOpen={!!accessItem && !!queueItem}
      onClose={onClose}
      title={`${accessItem.tool} – ${accessItem.name}`}
      subtitle="Access ID status"
      badge={<StatusBadge status={isCreated ? "Completed" : "Pending Governance Review"} />}
    >
      <p className="text-[13.5px] text-[#6B7280]">
        Access ID creation is a governed step reviewed by the Board Admin before it&apos;s issued.
      </p>

      <div className="mt-6 pt-5 border-t border-[var(--border)]">
        <Timeline steps={steps} />
      </div>

      {isCreated ? (
        <div className="mt-6 flex items-center justify-between gap-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-[9px] p-3.5">
          <div className="text-[13px] font-semibold text-[#15803D]">
            Access ID {accessItem.accessId} created.
          </div>
          <button
            onClick={() => onContinueRequest(accessItem.id)}
            className="btn btn-primary"
          >
            Continue
          </button>
        </div>
      ) : (
        <div className="mt-6 text-[13px] text-[#9CA3AF] flex items-center gap-2">
          <Clock className="w-4 h-4" /> Waiting on the Board Admin. You&apos;ll be notified
          once it&apos;s created.
        </div>
      )}
    </DrawerShell>
  );
}
