"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, AlertCircle, ArrowRight, UserCheck, CheckCircle2 } from "lucide-react";

const DEMO_ACCOUNTS = [
  {
    name: "Manvi Mehta",
    email: "manvi@company.com",
    role: "Employee (Product Team)",
    desc: "Approver for Marketing & Zendesk, requester for Salesforce & Finance",
    password: "emp123",
    tone: "#2563EB",
  },
  {
    name: "Rahul Sharma",
    email: "rahul@company.com",
    role: "Board Admin & Access Provider",
    desc: "Full administrator queue, board configuration, and Access ID governance",
    password: "admin123",
    tone: "#334155",
  },
  {
    name: "Ananya Rao",
    email: "ananya@company.com",
    role: "Employee (Support Team)",
    desc: "Cross-functional requester awaiting approval from Manvi",
    password: "emp123",
    tone: "#7C3AED",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState<string | null>(null);

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
    <div className="min-h-screen bg-[var(--bg)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[480px]">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-[12px] bg-[var(--navy)] text-white font-bold text-lg mb-3 shadow-sm">
            NA
          </div>
          <h1 className="text-2xl font-extrabold text-[var(--text)] tracking-tight">
            Access Management
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            New Age Portal &bull; Sign in to access your boards and applications
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-container)] p-8 shadow-sm">
          {error && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-[var(--radius-control)] flex items-start gap-2.5 text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Work Email</label>
              <input
                type="email"
                required
                className="text-input"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || !!quickLoading}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="form-label mb-0">Password</label>
              </div>
              <input
                type="password"
                required
                className="text-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || !!quickLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !!quickLoading}
              className="btn btn-primary btn-block mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[var(--muted)]">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[var(--accent)] font-semibold hover:underline"
            >
              Register here
            </Link>
          </div>
        </div>

        {/* Demo Quick Logins (Evaluator Convenience) */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            <UserCheck className="w-4 h-4 text-[var(--muted-2)]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-2)]">
              1-Click Demo Accounts
            </span>
          </div>

          <div className="space-y-2.5">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleQuickLogin(acc)}
                disabled={isLoading || !!quickLoading}
                className="w-full text-left p-3.5 bg-white hover:bg-slate-50 border border-[var(--border)] hover:border-slate-300 rounded-[10px] transition flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: acc.tone }}
                  >
                    {acc.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-gray-900 flex items-center gap-2">
                      <span>{acc.name}</span>
                      <span className="text-[10.5px] font-normal text-gray-500">
                        &bull; {acc.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 truncate mt-0.5">
                      {acc.desc}
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 text-xs font-semibold text-[var(--accent)]">
                  {quickLoading === acc.email ? (
                    "Loading..."
                  ) : (
                    <span className="flex items-center gap-1">
                      Login <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
