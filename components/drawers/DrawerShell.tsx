"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface DrawerShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string | null;
  badge?: React.ReactNode;
  children: React.ReactNode;
}

export default function DrawerShell({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
}: DrawerShellProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="overlay fixed inset-0 bg-[#02040A]/60 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      />
      <div className="drawer fixed top-0 right-0 h-full w-[clamp(420px,38vw,640px)] max-w-full bg-[#0D1526]/95 backdrop-blur-xl shadow-2xl z-[51] overflow-y-auto animate-drawerIn flex flex-col border-l border-white/10">
        <div className="drawer-head sticky top-0 bg-[#0D1526]/90 backdrop-blur-md z-10 flex items-start justify-between p-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[18px] font-extrabold text-[#E5EAF3]">{title}</h3>
              {badge}
            </div>
            {subtitle && (
              <div className="text-[12px] text-[var(--muted-2)] mt-1">{subtitle}</div>
            )}
          </div>
          <button
            onClick={onClose}
            className="drawer-close p-1 text-[#64748B] hover:text-white hover:bg-white/10 rounded-md transition"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="drawer-body p-6 pb-12 flex-1">{children}</div>
      </div>
    </>
  );
}
