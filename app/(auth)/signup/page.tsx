"use client";

import React, { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { AlertCircle, ArrowRight, User, Mail, Lock, Building, ShieldCheck, Briefcase } from "lucide-react";
import AutomationBackground from "@/components/auth/AutomationBackground";

const DEPARTMENTS = [
  "Product Team",
  "Marketing Team",
  "Sales Team",
  "Support Team",
  "Finance Team",
  "Engineering Team",
  "IT Support",
];

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [group, setGroup] = useState(DEPARTMENTS[0]);
  const [role, setRole] = useState("EMPLOYEE");
  const [title, setTitle] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mouse position state for card spotlight effect
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 220, y: 180 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          group,
          role,
          title,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account");
        setIsLoading(false);
        return;
      }

      // Auto sign-in after registration
      const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
      const loginRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (loginRes?.error) {
        router.push("/login?registered=true");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-full max-w-[460px] rounded-2xl bg-[#16233F]/75 backdrop-blur-2xl border border-white/[0.16] shadow-2xl p-8 sm:p-9 text-white overflow-hidden transition-all duration-300 animate-fadeIn"
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.25)",
          }}
        >
          {/* Dynamic Cursor Spotlight Layer */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0.35,
              background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(47, 111, 237, 0.18), transparent 70%)`,
            }}
          />

          {/* Specular Edge Highlight on Top */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          {/* Brand Header */}
          <div className="relative text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#2F6FED] to-[#1E4FC7] text-white font-extrabold text-base mb-3 shadow-[0_0_20px_rgba(47,111,237,0.4)] border border-white/20">
              NA
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Create an Account
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Join the AccessFlow Enterprise Portal
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-500/15 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-xs text-red-200 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  className="w-full h-10 pl-10 pr-3.5 rounded-lg bg-black/25 border border-white/15 text-white text-sm placeholder-slate-400 outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/30"
                  placeholder="e.g. Maya Lin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  className="w-full h-10 pl-10 pr-3.5 rounded-lg bg-black/25 border border-white/15 text-white text-sm placeholder-slate-400 outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/30"
                  placeholder="maya@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  minLength={6}
                  className="w-full h-10 pl-10 pr-3.5 rounded-lg bg-black/25 border border-white/15 text-white text-sm placeholder-slate-400 outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/30"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Department
                </label>
                <select
                  className="w-full h-10 px-3 rounded-lg bg-black/25 border border-white/15 text-white text-xs outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/30"
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  disabled={isLoading}
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} className="bg-slate-900 text-white">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Role
                </label>
                <select
                  className="w-full h-10 px-3 rounded-lg bg-black/25 border border-white/15 text-white text-xs outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/30"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="EMPLOYEE" className="bg-slate-900 text-white">Employee</option>
                  <option value="BOARD_ADMIN" className="bg-slate-900 text-white">Board Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Job Title (Optional)
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  className="w-full h-10 pl-10 pr-3.5 rounded-lg bg-black/25 border border-white/15 text-white text-sm placeholder-slate-400 outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/30"
                  placeholder="e.g. Senior Product Designer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 mt-3 rounded-lg bg-gradient-to-r from-[#2F6FED] to-[#1E4FC7] hover:from-[#3B7BF6] hover:to-[#2558D4] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_2px_15px_rgba(47,111,237,0.35)] transition-all duration-150 hover:shadow-[0_4px_20px_rgba(47,111,237,0.5)] active:translate-y-[1px] disabled:opacity-50"
            >
              {isLoading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative mt-5 text-center text-xs text-slate-300">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#60A5FA] font-semibold hover:underline hover:text-white transition"
            >
              Sign in
            </Link>
          </div>
        </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0F1B33] overflow-hidden">
      {/* Automation / Robotics Shader Background */}
      <AutomationBackground />

      <div className="relative z-10 w-full flex justify-center">
        <Suspense
          fallback={
            <div className="text-center text-sm text-slate-400">
              Loading...
            </div>
          }
        >
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
