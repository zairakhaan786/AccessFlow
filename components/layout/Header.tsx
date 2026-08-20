"use client";
import { formatClientDate } from "@/lib/utils";

import React, { useState, useRef, useEffect } from "react";
import { signOut, signIn } from "next-auth/react";
import { Bell, MessageSquare, LogOut, ChevronDown, Check, UserCheck } from "lucide-react";
import { markNotificationsAsReadAction } from "@/app/actions/requests";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  group: string;
  title?: string | null;
  initials?: string | null;
  tone?: string | null;
}

interface NotificationItem {
  id: string;
  role: string;
  text: string;
  channel: string;
  read: boolean;
  createdAt: string | Date;
}

interface HeaderProps {
  currentUser: UserInfo;
  notifications: NotificationItem[];
  allDemoUsers?: UserInfo[];
}

export default function Header({
  currentUser,
  notifications,
  allDemoUsers = [],
}: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const roleKey = currentUser.role === "BOARD_ADMIN" ? "admin" : "employee";
  const myNotifications = notifications.filter(
    (n) => n.role.toLowerCase() === roleKey.toLowerCase()
  );
  const unreadCount = myNotifications.filter((n) => !n.read).length;

  const handleToggleNotif = async () => {
    const nextState = !notifOpen;
    setNotifOpen(nextState);
    if (nextState && unreadCount > 0) {
      await markNotificationsAsReadAction(roleKey);
    }
  };

  const handleSwitchUser = async (email: string) => {
    setUserMenuOpen(false);
    const password = email.startsWith("rahul")
      ? "admin123"
      : email.startsWith("manvi") || email.startsWith("ananya")
      ? "emp123"
      : "password123";

    await signIn("credentials", {
      redirect: true,
      callbackUrl: "/dashboard",
      email,
      password,
    });
  };

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDemoSwitcher = true;

  return (
    <header className="sticky top-0 z-30 bg-[#0B1220]/80 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="w-[92%] max-w-[1800px] mx-auto h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-[#2F6FED] to-[#1E4FC7] text-white font-bold text-[13px] flex items-center justify-center shadow-[0_0_18px_rgba(47,111,237,0.45)]">
            NA
          </div>
          <div>
            <div className="text-[14px] font-bold text-[var(--text)] leading-tight">
              Access Management
            </div>
            <div className="text-[11px] text-[var(--muted-2)] leading-tight">
              New Age Portal
            </div>
          </div>
        </div>

        {/* Header Right */}
        <div className="flex items-center gap-3.5">
          {/* Persona Switcher Buttons (gated in production) */}
          {showDemoSwitcher ? (
            <div className="flex items-center border border-white/12 bg-white/[0.06] rounded-[9px] p-[3px] backdrop-blur-md">
              <button
                onClick={() => handleSwitchUser("manvi@company.com")}
                className={`px-3.5 py-1.5 rounded-[6px] text-[12.5px] font-semibold transition ${
                  currentUser.role !== "BOARD_ADMIN"
                    ? "bg-gradient-to-r from-[#2F6FED] to-[#1E4FC7] text-white shadow-[0_0_14px_rgba(47,111,237,0.4)]"
                    : "text-[#94A3B8] hover:bg-white/10 hover:text-white"
                }`}
              >
                Employee View
              </button>
              <button
                onClick={() => handleSwitchUser("rahul@company.com")}
                className={`px-3.5 py-1.5 rounded-[6px] text-[12.5px] font-semibold transition ${
                  currentUser.role === "BOARD_ADMIN"
                    ? "bg-gradient-to-r from-[#2F6FED] to-[#1E4FC7] text-white shadow-[0_0_14px_rgba(47,111,237,0.4)]"
                    : "text-[#94A3B8] hover:bg-white/10 hover:text-white"
                }`}
              >
                Board Admin View
              </button>
            </div>
          ) : (
            <div className="text-xs font-semibold px-3 py-1 bg-white/[0.08] text-slate-300 rounded-md backdrop-blur-md">
              {currentUser.role === "BOARD_ADMIN" ? "Board Admin" : "Employee"}
            </div>
          )}

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={handleToggleNotif}
              className="relative w-[38px] h-[38px] rounded-[9px] flex items-center justify-center text-[#94A3B8] hover:bg-white/10 hover:text-white transition border border-transparent hover:border-white/15"
              aria-label="Notifications"
            >
              <Bell className="w-[18px] h-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute top-[5px] right-[5px] min-w-[16px] h-[16px] rounded-[8px] bg-gradient-to-r from-[#EF4444] to-[#F97316] text-white text-[10px] font-bold flex items-center justify-center px-1 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-[46px] w-[340px] bg-[#0F172A]/95 backdrop-blur-xl border border-white/10 rounded-[12px] shadow-2xl z-40 overflow-hidden animate-modalIn">
                <div className="px-4 py-3 text-[13.5px] font-bold border-b border-white/[0.08] text-slate-100 flex items-center justify-between">
                  <span>Notifications</span>
                  <span className="text-[11px] font-normal text-slate-400">
                    {roleKey === "admin" ? "Admin channel" : "Employee channel"}
                  </span>
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {myNotifications.length === 0 ? (
                    <div className="py-7 px-4 text-center text-[12.5px] text-[#64748B]">
                      You&apos;re all caught up.
                    </div>
                  ) : (
                    myNotifications
                      .slice()
                      .reverse()
                      .map((n) => (
                        <div
                          key={n.id}
                          className="px-4 py-3 border-b border-white/[0.05] last:border-b-0 flex gap-2.5 items-start hover:bg-white/[0.04] transition"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                              n.read ? "bg-transparent" : "bg-[#60A5FA] shadow-[0_0_8px_rgba(96,165,250,0.8)]"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-[12.5px] text-slate-200 leading-snug">
                              {n.text}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10.5px] text-[#64748B]">
                                {typeof n.createdAt === "string"
                                  ? n.createdAt
                                  : formatClientDate(n.createdAt)}
                              </span>
                              <span className="text-[9.5px] font-bold text-[#64748B] flex items-center gap-1">
                                {n.channel === "slack" ? (
                                  <>
                                    <MessageSquare className="w-2.5 h-2.5" /> Slack
                                  </>
                                ) : (
                                  "Portal"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Chip & Account Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 pl-3.5 border-l border-white/10 hover:opacity-90 transition text-left"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ring-2 ring-white/15"
                style={{
                  backgroundColor: currentUser.tone || "#2563EB",
                  boxShadow: `0 0 14px ${(currentUser.tone || "#2563EB")}66`,
                }}
              >
                {currentUser.initials ||
                  currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
              </div>
              <div className="hidden sm:block">
                <div className="text-[12.5px] font-bold text-slate-100 leading-tight flex items-center gap-1">
                  <span>{currentUser.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </div>
                <div className="text-[10.5px] text-[var(--muted-2)] leading-tight truncate max-w-[170px]">
                  {currentUser.title || currentUser.group}
                </div>
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-[46px] w-[260px] bg-[#0F172A]/95 backdrop-blur-xl border border-white/10 rounded-[12px] shadow-2xl z-40 overflow-hidden animate-modalIn">
                <div className="p-3 border-b border-white/[0.08] bg-white/[0.04]">
                  <div className="text-xs font-bold text-slate-100">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-400">{currentUser.email}</div>
                  <div className="text-[10.5px] text-blue-400 font-semibold mt-0.5">
                    {currentUser.group} &bull; {currentUser.role}
                  </div>
                </div>

                {allDemoUsers.length > 0 && (
                  <div className="p-2 border-b border-white/[0.08]">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1 flex items-center gap-1">
                      <UserCheck className="w-3 h-3" /> Switch Demo Account
                    </div>
                    {allDemoUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleSwitchUser(u.email)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-[6px] text-xs flex items-center justify-between transition ${
                          u.id === currentUser.id
                            ? "bg-[#2F6FED]/20 text-blue-300 font-semibold"
                            : "text-slate-300 hover:bg-white/[0.07]"
                        }`}
                      >
                        <div>
                          <div>{u.name}</div>
                          <div className="text-[10px] text-slate-500">{u.title || u.group}</div>
                        </div>
                        {u.id === currentUser.id && <Check className="w-3.5 h-3.5 text-blue-400" />}
                      </button>
                    ))}
                  </div>
                )}

                <div className="p-1">
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full text-left px-3 py-2 text-xs text-red-400 font-semibold hover:bg-red-500/10 rounded-[6px] flex items-center gap-2 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
