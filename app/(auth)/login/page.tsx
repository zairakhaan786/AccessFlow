"use client";

import React, { useState, useRef, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import GlassSpotlight from "@/components/auth/GlassSpotlight";
import AutomationBackground from "@/components/auth/AutomationBackground";

const DEMO_ACCOUNTS = [
  {
    name: "Manvi Mehta",
    email: "manvi@company.com",
    role: "Employee · Product Team",
    desc: "Approver for Marketing & Zendesk, requester for Salesforce",
    password: "emp123",
    tone: "#2563EB",
    badge: "Requester & Approver",
  },
  {
    name: "Rahul Sharma",
    email: "rahul@company.com",
    role: "Board Admin & Access Provider",
    desc: "Manual provisioning queue, board config, Access ID governance",
    password: "admin123",
    tone: "#6366F1",
    badge: "Full Admin Queue",
  },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
        callbackUrl,
      });

      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (acc: typeof DEMO_ACCOUNTS[0]) => {
    setError(null);
    setQuickLoading(acc.email);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: acc.email,
        password: acc.password,
        callbackUrl,
      });

      if (res?.error) {
        setError(res.error);
        setQuickLoading(null);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "Login failed");
      setQuickLoading(null);
    }
  };

  return (
    <div
      ref={cardRef}
      className="relative w-full max-w-[430px] rounded-2xl bg-[#0F172A]/80 backdrop-blur-2xl border border-white/[0.18] shadow-2xl p-8 sm:p-9 text-white overflow-hidden transition-all duration-300 animate-fadeIn"
      style={{
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.3)",
      }}
    >
      {/* Eased Cursor Follow Spotlight */}
      <GlassSpotlight cardRef={cardRef} />

      {/* Top Specular Edge Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent z-10 pointer-events-none" />

      {/* Brand Header */}
      <div className="relative text-center mb-7 z-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#2F6FED] to-[#1E4FC7] text-white font-extrabold text-base mb-3 shadow-[0_0_20px_rgba(47,111,237,0.4)] border border-white/20">
          NA
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
          <span>AccessFlow</span>
        </h1>
        <p className="text-xs text-slate-300 mt-1 tracking-wide">
          Governed enterprise access &amp; provisioning portal
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="relative z-10 mb-5 p-3 bg-red-500/15 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-xs text-red-200 animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Work Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              className="w-full h-10 pl-10 pr-3.5 rounded-lg bg-black/30 border border-white/15 text-white text-sm placeholder-slate-400 outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/30 focus:bg-black/45"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || !!quickLoading}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Password
            </label>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full h-10 pl-10 pr-3.5 rounded-lg bg-black/30 border border-white/15 text-white text-sm placeholder-slate-400 outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/30 focus:bg-black/45"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || !!quickLoading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !!quickLoading}
          className="w-full h-10 mt-2 rounded-lg bg-gradient-to-r from-[#2F6FED] to-[#1E4FC7] hover:from-[#3B7BF6] hover:to-[#2558D4] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_2px_15px_rgba(47,111,237,0.35)] transition-all duration-150 hover:shadow-[0_4px_20px_rgba(47,111,237,0.5)] active:translate-y-[1px] disabled:opacity-50"
        >
          {isLoading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Log in</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Secondary Signup Link */}
      <div className="relative z-10 mt-5 text-center text-xs text-slate-300">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-[#60A5FA] font-semibold hover:underline hover:text-white transition"
        >
          Register here
        </Link>
      </div>

      {/* Evaluator 1-Click Demo Switcher */}
      {(process.env.NEXT_PUBLIC_ENABLE_DEMO_ACCOUNTS === "true" ||
        process.env.NODE_ENV !== "production") && (
        <div className="relative z-10 mt-7 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#60A5FA]" />
              1-Click Demo Accounts
            </span>
            <span className="text-[10.5px] text-slate-300">Evaluator mode</span>
          </div>

          <div className="space-y-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleQuickLogin(acc)}
                disabled={isLoading || !!quickLoading}
                className="w-full text-left p-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.14] hover:border-white/30 transition-all duration-150 flex items-center justify-between gap-3 group shadow-xs active:translate-y-[1px]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 shadow-xs"
                    style={{ backgroundColor: acc.tone }}
                  >
                    {acc.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-white group-hover:text-white flex items-center gap-1.5">
                      <span>{acc.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-slate-300 font-normal">
                        {acc.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 truncate">
                      {acc.role}
                    </div>
                  </div>
                </div>

                <div className="text-xs font-semibold text-[#60A5FA] group-hover:translate-x-0.5 transition-transform flex-shrink-0">
                  {quickLoading === acc.email ? (
                    <span className="text-slate-300 text-[11px]">Loading...</span>
                  ) : (
                    <span className="flex items-center gap-1">
                      Login <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0B1220] overflow-hidden">
      {/* Automation / Robotics Shader Background */}
      <AutomationBackground />

      <div className="relative z-10 w-full flex justify-center">
        <Suspense
          fallback={
            <div className="text-center text-sm text-slate-400">
              Loading AccessFlow...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
