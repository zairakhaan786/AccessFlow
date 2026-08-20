"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";

const DEPARTMENTS = [
  "Product Team",
  "Marketing Team",
  "Sales Team",
  "Support Team",
  "Finance Team",
  "Engineering Team",
  "IT Support",
];

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [group, setGroup] = useState(DEPARTMENTS[0]);
  const [role, setRole] = useState("EMPLOYEE");
  const [title, setTitle] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="min-h-screen bg-[var(--bg)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[480px]">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-[12px] bg-[var(--navy)] text-white font-bold text-lg mb-3 shadow-sm">
            NA
          </div>
          <h1 className="text-2xl font-extrabold text-[var(--text)] tracking-tight">
            Create an Account
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Join the New Age Access Management portal
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white border border-[var(--border)] rounded-[var(--radius-container)] p-8 shadow-sm">
          {error && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-[var(--radius-control)] flex items-start gap-2.5 text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                className="text-input"
                placeholder="e.g. Maya Lin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="form-label">Work Email</label>
              <input
                type="email"
                required
                className="text-input"
                placeholder="maya@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                minLength={6}
                className="text-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">Department / Group</label>
                <select
                  className="text-input"
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  disabled={isLoading}
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Persona Role</label>
                <select
                  className="text-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="BOARD_ADMIN">Board Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Job Title (Optional)</label>
              <input
                type="text"
                className="text-input"
                placeholder="e.g. Senior Product Designer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-block mt-4 flex items-center justify-center gap-2"
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

          <div className="mt-6 text-center text-xs text-[var(--muted)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[var(--accent)] font-semibold hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
