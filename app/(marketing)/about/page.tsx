import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AutomationBackground from "@/components/auth/AutomationBackground";
import Reveal from "@/components/ui/Reveal";

export default function AboutPage() {
  return (
    <div className="flex-1 w-full bg-[var(--bg)]">
      {/* Hero Section with Automation Background */}
      <div className="relative w-full overflow-hidden bg-[#0F1B33] py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <AutomationBackground />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            About <span className="text-gradient">AccessFlow</span>
          </h1>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
            A deep dive into how I built this platform.
          </p>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Video Walkthrough Placeholder */}
        <Reveal>
        <div className="w-full aspect-video rounded-2xl overflow-hidden bg-[#0D1526] border border-white/10 shadow-xl mb-12 relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-[#0F1B33] to-[#0A0F1C] text-white">
          <svg className="w-16 h-16 mb-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-bold mb-2">Walkthrough Video</h3>
          <p className="text-sm text-slate-400 max-w-md">
            A walkthrough is shared with the assessment team.
          </p>
        </div>
      </div>
      </Reveal>

      {/* Narrative & Assessment Info */}
      <Reveal delay={0.1}>
      <div className="prose prose-slate max-w-none text-[15px] leading-relaxed text-[var(--text)] bg-[#0D1526]/90 backdrop-blur-xl p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl">
        
        {/* My Approach */}
        <h2 className="text-xl font-bold text-[#E5EAF3] mb-4">My Approach</h2>
        <h3 className="text-[17px] font-bold text-[#E5EAF3] mt-6 mb-2">The Origin Story</h3>
        <p className="mb-6">
          I built AccessFlow as a comprehensive solution to a common enterprise problem: the chaotic, untrackable process of requesting and approving tool access. In many organizations, this happens over Slack or email, leaving no audit trail and creating massive compliance headaches.
        </p>
        
        <p className="mb-6">
          This project originated as a technical assessment where I was tasked with converting a static UI prototype into a fully functional, full-stack application. My goal was to retain the strict aesthetic requirements of the original glassmorphic design while building a robust, production-ready backend.
        </p>

        <h3 className="text-[17px] font-bold text-[#E5EAF3] mt-8 mb-2">Technical Execution</h3>
        <p className="mb-6">
          Under the hood, AccessFlow is powered by Next.js App Router and a PostgreSQL database managed via Prisma. I implemented NextAuth for secure credential-based authentication, and utilized a strictly typed schema to handle complex relationships between users, groups, access items, and audit logs. 
        </p>

        <p className="mb-10">
          The result is a platform that not only looks beautiful but functions as a true multi-tenant governance tool, complete with automated provisioning queues and exception handling workflows.
        </p>

        {/* Submission & Assessment */}
        <hr className="my-10 border-white/10" />
        <h2 className="text-xl font-bold text-[#E5EAF3] mb-6">Submission &amp; Assessment</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="text-[16px] font-bold text-[#E5EAF3] mb-3">Assessment Deliverables</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-[var(--accent)] mr-2 mt-0.5">✓</span>
                <div>
                  <strong>Deployed Application</strong><br />
                  <a href="https://github.com/zairakhaan786/AccessFlow#readme" className="text-sm text-[var(--accent)] hover:underline">Live deployment details in the repo README</a>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--accent)] mr-2 mt-0.5">✓</span>
                <div>
                  <strong>GitHub Repository</strong><br />
                  <a href="https://github.com/zairakhaan786/AccessFlow" className="text-sm text-[var(--accent)] hover:underline">github.com/zairakhaan786/AccessFlow</a>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--accent)] mr-2 mt-0.5">✓</span>
                <div>
                  <strong>Part 4 Improvement Report</strong><br />
                  <span className="text-sm text-[var(--muted)]">Added atomic Database Transactions for race-safe manual provisioning, and Inline Quick-Approvals for Board Admins to reduce click-fatigue.</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--accent)] mr-2 mt-0.5">✓</span>
                <div>
                  <strong>AI Usage Documentation</strong><br />
                  <span className="text-sm text-[var(--muted)]">Fully documented in the repository README.</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--accent)] mr-2 mt-0.5">✓</span>
                <div>
                  <strong>Loom Walkthrough</strong><br />
                  <span className="text-sm text-[var(--muted)]">Screen recording shared with the assessment team.</span>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[16px] font-bold text-[#E5EAF3] mb-3">What I Built &amp; Implemented</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-[var(--text)]">
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2 font-bold">✓</span> NextAuth Authentication</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2 font-bold">✓</span> Forgot Password &amp; Reset Flow</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2 font-bold">✓</span> Access Directory &amp; Search</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2 font-bold">✓</span> Self &amp; On-Behalf Requests</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2 font-bold">✓</span> Out-of-Group Exception Flow</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2 font-bold">✓</span> Approval &amp; Rejection Logic</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2 font-bold">✓</span> Automated Provisioning Engine</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2 font-bold">✓</span> Manual Provisioning Queue</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2 font-bold">✓</span> Recent Activity &amp; Audit Logs</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2 font-bold">✓</span> 7d / 21d / 30d History Filters</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2 font-bold">✓</span> Request Timeline Tracking</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2 font-bold">✓</span> Neon PostgreSQL Database</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2 font-bold">✓</span> Employee vs Admin Roles</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2 font-bold">✓</span> Inline Quick-Approvals</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2 font-bold">✓</span> Concurrency Transaction Lock</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2 font-bold">✓</span> Responsive Glassmorphic UI</li>
            </ul>
          </div>
        </div>

        {/* Technologies Used */}
        <hr className="my-10 border-white/10" />
        <h2 className="text-xl font-bold text-[#E5EAF3] mb-6">Technologies Used</h2>
        <div className="flex flex-wrap gap-2 mb-8">
          {["Next.js 14", "TypeScript", "Tailwind CSS", "Prisma ORM", "PostgreSQL", "NextAuth.js", "Zod", "Vitest"].map((tech) => (
            <span key={tech} className="px-3 py-1 bg-white/[0.06] border border-white/15 text-slate-300 text-sm font-medium rounded-full">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex justify-center border-t border-white/10 pt-8 mt-4">
          <Link
            href="/projects"
            className="inline-flex items-center text-[var(--accent)] font-semibold hover:text-[var(--accent-dark)] transition-colors"
          >
            View the Projects Showcase <ArrowRight className="ml-1.5 w-4 h-4" />
          </Link>
        </div>
      </div>
      </Reveal>
    </div>
    </div>
  );
}
