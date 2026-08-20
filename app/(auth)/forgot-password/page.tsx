"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import AutomationBackground from "@/components/auth/AutomationBackground";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate sending an email, but since this is a local development environment,
    // we'll just redirect directly to the reset password screen for testing.
    setTimeout(() => {
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0F1B33] overflow-hidden">
      <AutomationBackground />

      <div className="relative z-10 w-full max-w-[430px] rounded-2xl bg-[#16233F]/80 backdrop-blur-2xl border border-white/[0.18] shadow-2xl p-8 text-white overflow-hidden animate-fadeIn">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#2F6FED] to-[#1E4FC7] text-white font-extrabold text-base mb-3 shadow-[0_0_20px_rgba(47,111,237,0.4)] border border-white/20">
            NA
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Reset Password</h1>
          <p className="text-xs text-slate-300 mt-1">
            Enter your email to receive a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                className="w-full h-10 pl-10 pr-3.5 rounded-lg bg-black/30 border border-white/15 text-white text-sm placeholder-slate-400 outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/30"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full h-10 mt-2 rounded-lg bg-gradient-to-r from-[#2F6FED] to-[#1E4FC7] hover:from-[#3B7BF6] hover:to-[#2558D4] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_2px_15px_rgba(47,111,237,0.35)] transition-all disabled:opacity-50"
          >
            {isLoading ? "Sending Link..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="inline-flex items-center text-xs font-semibold text-[#60A5FA] hover:text-white transition">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
