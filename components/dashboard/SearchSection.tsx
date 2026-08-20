"use client";

import React, { useState, useMemo } from "react";
import { Search as SearchIcon, Filter, Layers, LayoutGrid, AppWindow } from "lucide-react";
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
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [browsing, setBrowsing] = useState(false);

  // Extract all unique categories present in the catalog
  const categories = useMemo(() => {
    const unique = Array.from(new Set(catalog.map((item) => item.category)));
    return ["All", ...unique];
  }, [catalog]);

  const isEligible = (item: AccessCatalogItem) => {
    try {
      const groups: string[] = JSON.parse(item.eligibleGroups);
      return groups.includes(currentUserGroup);
    } catch {
      return item.group === currentUserGroup;
    }
  };

  const isFilterActive = searchQuery.trim().length > 0 || browsing || selectedCategory !== "All";

  const results = catalog.filter((a) => {
    // Category filter
    if (selectedCategory !== "All" && a.category !== selectedCategory) {
      return false;
    }
    // Text search query filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.tool.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.group.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      (a.accessId && a.accessId.toLowerCase().includes(q)) ||
      a.approverName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="card">
      <div className="section-head mb-4">
        <div>
          <h2 className="section-title text-[16px] font-extrabold text-[#E5EAF3]">
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
            className="search-input w-full h-[var(--ctrl-h)] pl-[42px] pr-4 rounded-[var(--radius-control)] border border-white/12 bg-white/[0.05] text-[14px] text-[var(--text)] placeholder:text-[#64748B] outline-none transition focus:bg-white/[0.08] focus:border-[var(--accent)]"
            placeholder="Search for an application, tool, account or board..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => setBrowsing(!browsing)}
          className="browse-btn h-[var(--ctrl-h)] px-4 rounded-[var(--radius-control)] border border-white/15 bg-white/[0.06] text-[#CBD5E1] text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition hover:bg-white/10 hover:border-white/25"
        >
          {browsing && !searchQuery && selectedCategory === "All" ? "Hide directory" : "Browse directory"}
        </button>
      </div>

      {/* Category Filter Pills (Part of spec) */}
      <div className="category-pills flex items-center gap-2 mt-3.5 flex-wrap">
        <span className="text-[11.5px] font-bold text-[var(--muted-2)] uppercase tracking-wider mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Filter:
        </span>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-[12px] font-semibold transition flex items-center gap-1.5 ${
                isSelected
                  ? "bg-gradient-to-r from-[#2F6FED] to-[#1E4FC7] text-white shadow-[0_0_14px_rgba(47,111,237,0.35)]"
                  : "bg-white/[0.06] text-[#94A3B8] border border-white/12 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat === "All" && <Layers className="w-3 h-3" />}
              {cat === "Board" && <LayoutGrid className="w-3 h-3" />}
              {cat === "Application" && <AppWindow className="w-3 h-3" />}
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? "bg-white/20 text-white" : "bg-white/10 text-slate-400"
                }`}
              >
                {cat === "All"
                  ? catalog.length
                  : catalog.filter((c) => c.category === cat).length}
              </span>
            </button>
          );
        })}
      </div>

      {isFilterActive && (
        <div className="mt-4 flex flex-col gap-2.5 animate-fadeIn">
          <div className="text-[12px] text-[#9CA3AF] flex items-center justify-between">
            <span>
              {results.length} result{results.length !== 1 ? "s" : ""}{" "}
              {searchQuery ? `for "${searchQuery}"` : "in directory"}{" "}
              {selectedCategory !== "All" ? `· Category: ${selectedCategory}` : ""}
            </span>
            {(searchQuery || selectedCategory !== "All") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="text-[11.5px] text-[var(--accent)] font-semibold hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>

          {results.length === 0 ? (
            <div className="empty-state text-center py-9 px-5">
              <div className="circle w-[46px] h-[46px] rounded-full bg-white/[0.06] flex items-center justify-center mx-auto mb-3 text-[#64748B]">
                <SearchIcon className="w-5 h-5" />
              </div>
              <div className="title text-[13.5px] font-bold text-[#CBD5E1]">
                No matching access found
              </div>
              <div className="sub text-[12px] text-[#64748B] mt-1 max-w-[340px] mx-auto">
                Try selecting a different category or adjusting your search keywords.
              </div>
            </div>
          ) : (
            results.map((item) => {
              const eligible = isEligible(item);
              return (
                <div
                  key={item.id}
                  onClick={() => onOpenAccessDetails(item.id)}
                  className="result-row border border-white/10 rounded-[11px] p-4 cursor-pointer transition flex items-start justify-between gap-4 bg-white/[0.04] hover:border-[#60A5FA]/50 hover:shadow-[0_8px_24px_rgba(47,111,237,0.18)]"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="result-title text-[14px] font-bold text-[#E5EAF3]">
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
                        <strong className="text-slate-200 font-semibold">
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
