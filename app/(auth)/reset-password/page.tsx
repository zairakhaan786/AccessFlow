"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowRight, CheckCircle } from "lucide-react";
import AutomationBackground from "@/components/auth/AutomationBackground";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!token) {
      setError("Missing reset link. Please request a new one from the Forgot Password page.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, token }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reset password");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <CheckCircle className="w-12 h-12 text-[#22C55E] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Password Reset Successful!</h2>
        <p className="text-sm text-slate-300 mb-6">Your password has been securely updated.</p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center w-full h-10 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white text-sm font-semibold transition"
        >
          Return to Login
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-white">Create New Password</h1>
        <p className="text-xs text-slate-300 mt-1">
          For account: <span className="font-semibold text-white">{email}</span>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-xs text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            New Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              className="w-full h-10 pl-10 pr-3.5 rounded-lg bg-black/30 border border-white/15 text-white text-sm outline-none transition focus:border-[#2F6FED] focus:ring-2"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              className="w-full h-10 pl-10 pr-3.5 rounded-lg bg-black/30 border border-white/15 text-white text-sm outline-none transition focus:border-[#2F6FED] focus:ring-2"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !password || !confirmPassword}
          className="w-full h-10 mt-2 rounded-lg bg-gradient-to-r from-[#2F6FED] to-[#1E4FC7] hover:from-[#3B7BF6] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_2px_15px_rgba(47,111,237,0.35)] transition-all disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save New Password"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center py-12 px-4 bg-[#0F1B33] overflow-hidden">
      <AutomationBackground />
      <div className="relative z-10 w-full max-w-[430px] rounded-2xl bg-[#16233F]/80 backdrop-blur-2xl border border-white/[0.18] shadow-2xl p-8 text-white animate-fadeIn">
        <Suspense fallback={<div className="text-center text-sm text-slate-400">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
