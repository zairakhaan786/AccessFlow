"use client";

import React from "react";
import { Building2, Pencil } from "lucide-react";
import { AccessCatalogItem } from "./SearchSection";

interface MyBoardsSectionProps {
  catalog: AccessCatalogItem[];
  currentUserName: string;
  onOpenBoardConfig: (accessId: string) => void;
}

export default function MyBoardsSection({
  catalog,
  currentUserName,
  onOpenBoardConfig,
}: MyBoardsSectionProps) {
  const myBoards = catalog.filter(
    (a) => a.providerName.toLowerCase() === currentUserName.toLowerCase()
  );

  return (
    <div className="card">
      <div className="section-head mb-4">
        <div className="section-head-left flex items-center gap-2.5">
          <div className="section-icon w-[34px] h-[34px] rounded-[9px] bg-[#EAF1FF] text-[var(--accent)] flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="section-title text-[16px] font-extrabold text-[#111827]">
              My Boards / Access
            </h2>
            <p className="section-sub text-[12px] text-[var(--muted-2)] mt-0.5">
              Boards and accounts you administer as the access provider.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myBoards.map((a) => (
          <div
            key={a.id}
            onClick={() => onOpenBoardConfig(a.id)}
            className="board-card border border-[var(--border)] rounded-[var(--radius-container)] p-4 cursor-pointer bg-white transition flex flex-col hover:border-[#CBD5E1] hover:shadow-xs"
          >
            <div className="board-card-body flex-1">
              <div className="row1 flex items-start justify-between gap-2">
                <span className="t text-[13.5px] font-bold text-[#111827] leading-snug">
                  {a.tool} – {a.name}
                </span>
                {a.automation ? (
                  <span className="badge badge-teal">Automated</span>
                ) : (
                  <span className="badge badge-gray">Manual</span>
                )}
              </div>
              <div className="text-[11.5px] text-[#9CA3AF] mt-2 font-mono">
                {a.accessId ? `Access ID: ${a.accessId}` : "Access ID not yet created"}
              </div>
              <div className="text-[12px] text-[#6B7280] mt-2">
                Approver:{" "}
                <strong className="text-[#374151] font-semibold">{a.approverName}</strong>
              </div>
            </div>

            <div className="manage-link flex items-center gap-1.5 text-[12px] text-[var(--accent)] font-bold mt-3.5 pt-3 border-t border-[#F3F4F6]">
              <Pencil className="w-3.5 h-3.5" /> Manage configuration
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
