"use client";

import React, { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { CategoryBadge, EligibilityBadge } from "@/components/ui/StatusBadge";

export interface AccessCatalogItem {
  id: string;
  tool: string;
  name: string;
  category: string;
  description: string;
  accessId?: string | null;
  creator: string;
  group: string;
  eligibleGroups: string; // JSON string
  approverName: string;
  backupApproverName: string;
  providerName: string;
  automation: boolean;
  requestType: string;
}

interface SearchSectionProps {
  catalog: AccessCatalogItem[];
  currentUserGroup: string;
  onOpenAccessDetails: (accessId: string) => void;
}

export default function SearchSection({
  catalog,
  currentUserGroup,
  onOpenAccessDetails,
}: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [browsing, setBrowsing] = useState(false);

  const isEligible = (item: AccessCatalogItem) => {
    try {
      const groups: string[] = JSON.parse(item.eligibleGroups);
      return groups.includes(currentUserGroup);
    } catch {
      return item.group === currentUserGroup;
    }
  };

  const active = searchQuery.trim().length > 0 || browsing;

  const results = catalog.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.tool.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.group.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="card">
      <div className="section-head mb-4">
        <div>
          <h2 className="section-title text-[16px] font-extrabold text-[#111827]">
            Find access
          </h2>
          <p className="section-sub text-[12px] text-[var(--muted-2)] mt-0.5">
            Search by tool, board, or team — you don&apos;t need to know the exact internal name.
          </p>
        </div>
      </div>

      <div className="search-row flex items-stretch gap-2.5">
        <div className="search-input-wrap relative flex-1 min-w-0">
          <span className="search-ico absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none flex z-10">
            <SearchIcon className="w-4 h-4" />
          </span>
          <input
            id="search-input"
            className="search-input w-full h-[var(--ctrl-h)] pl-[42px] pr-4 rounded-[var(--radius-control)] border border-[var(--border)] bg-[#F8FAFC] text-[14px] outline-none transition focus:bg-white focus:border-[var(--accent)]"
            placeholder="Search for an application, tool, account or board..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => setBrowsing(!browsing)}
          className="browse-btn h-[var(--ctrl-h)] px-4 rounded-[var(--radius-control)] border border-[var(--border)] bg-white text-[#374151] text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition hover:bg-[#F9FAFB] hover:border-[#CBD5E1]"
        >
          {browsing && !searchQuery ? "Hide directory" : "Browse directory"}
        </button>
      </div>

      {active && (
        <div className="mt-4 flex flex-col gap-2.5 animate-fadeIn">
          <div className="text-[12px] text-[#9CA3AF]">
            {results.length} result{results.length !== 1 ? "s" : ""}{" "}
            {searchQuery ? `for "${searchQuery}"` : "in the directory"}
          </div>

          {results.length === 0 ? (
            <div className="empty-state text-center py-9 px-5">
              <div className="circle w-[46px] h-[46px] rounded-full bg-[#F3F4F6] flex items-center justify-center mx-auto mb-3 text-[#9CA3AF]">
                <SearchIcon className="w-5 h-5" />
              </div>
              <div className="title text-[13.5px] font-bold text-[#374151]">
                No matching access found
              </div>
              <div className="sub text-[12px] text-[#9CA3AF] mt-1 max-w-[340px] mx-auto">
                Try a different keyword.
              </div>
            </div>
          ) : (
            results.map((item) => {
              const eligible = isEligible(item);
              return (
                <div
                  key={item.id}
                  onClick={() => onOpenAccessDetails(item.id)}
                  className="result-row border border-[var(--border)] rounded-[11px] p-4 cursor-pointer transition flex items-start justify-between gap-4 bg-white hover:border-[#CBD5E1] hover:shadow-xs"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="result-title text-[14px] font-bold text-[#111827]">
                        {item.tool} – {item.name}
                      </span>
                      <CategoryBadge category={item.category} />
                    </div>
                    <div className="result-desc text-[13px] text-[var(--muted)] mt-1.5 leading-relaxed">
                      {item.description}
                    </div>
                    <div className="result-meta flex flex-wrap gap-4 mt-2.5 text-[12px] text-[var(--muted)]">
                      <span className="mono font-mono">
                        {item.accessId
                          ? `Access ID: ${item.accessId}`
                          : "Access ID: not yet created"}
                      </span>
                      <span>
                        Approver:{" "}
                        <strong className="text-[#374151] font-semibold">
                          {item.approverName}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <EligibilityBadge eligible={eligible} />
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
