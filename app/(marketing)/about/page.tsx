import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex-1 w-full max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--navy)] tracking-tight">
          About AccessFlow
        </h1>
        <p className="mt-4 text-lg text-[var(--muted)]">
          A deep dive into how I built this platform.
        </p>
      </div>

      {/* Video Walkthrough Placeholder */}
      <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-[var(--border)] shadow-lg mb-12 relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-800 text-white">
          <svg className="w-16 h-16 mb-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-bold mb-2">Walkthrough Video</h3>
          <p className="text-sm text-slate-300 max-w-md">
            The video walkthrough will be embedded here.
          </p>
        </div>
        
        {/* PASTE VIDEO EMBED URL HERE */}
        {/* Replace the src="" attribute below with your YouTube or Loom embed URL, and remove the hidden className */}
        <iframe 
          className="w-full h-full relative z-10 hidden" 
          src="" 
          title="AccessFlow Walkthrough" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>

      {/* Narrative & Assessment Info */}
      <div className="prose prose-slate max-w-none text-[15px] leading-relaxed text-[var(--text)] bg-white p-8 md:p-12 rounded-2xl border border-[var(--border)] shadow-sm">
        
        {/* My Approach */}
        <h2 className="text-xl font-bold text-[var(--navy)] mb-4">My Approach</h2>
        <h3 className="text-[17px] font-bold text-[var(--navy)] mt-6 mb-2">The Origin Story</h3>
        <p className="mb-6">
          I built AccessFlow as a comprehensive solution to a common enterprise problem: the chaotic, untrackable process of requesting and approving tool access. In many organizations, this happens over Slack or email, leaving no audit trail and creating massive compliance headaches.
        </p>
        
        <p className="mb-6">
          This project originated as a technical assessment where I was tasked with converting a static UI prototype into a fully functional, full-stack application. My goal was to retain the strict aesthetic requirements of the original glassmorphic design while building a robust, production-ready backend.
        </p>

        <h3 className="text-[17px] font-bold text-[var(--navy)] mt-8 mb-2">Technical Execution</h3>
        <p className="mb-6">
          Under the hood, AccessFlow is powered by Next.js App Router and a PostgreSQL database managed via Prisma. I implemented NextAuth for secure credential-based authentication, and utilized a strictly typed schema to handle complex relationships between users, groups, access items, and audit logs. 
        </p>

        <p className="mb-10">
          The result is a platform that not only looks beautiful but functions as a true multi-tenant governance tool, complete with automated provisioning queues and exception handling workflows.
        </p>

        {/* Submission & Assessment */}
        <hr className="my-10 border-[var(--border)]" />
        <h2 className="text-xl font-bold text-[var(--navy)] mb-6">Submission & Assessment</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="text-[16px] font-bold text-[var(--navy)] mb-3">Assessment Deliverables</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-[var(--accent)] mr-2 mt-0.5">✓</span>
                <div>
                  <strong>Deployed Application</strong><br />
                  <a href="#" className="text-sm text-[var(--accent)] hover:underline">[Deployment Link Placeholder]</a>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--accent)] mr-2 mt-0.5">✓</span>
                <div>
                  <strong>GitHub Repository</strong><br />
                  <a href="#" className="text-sm text-[var(--accent)] hover:underline">[GitHub Link Placeholder]</a>
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
                  <a href="#" className="text-sm text-[var(--accent)] hover:underline">[Loom Video Placeholder]</a>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[16px] font-bold text-[var(--navy)] mb-3">What I Built</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-[var(--text)]">
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2">✓</span> Authentication</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2">✓</span> Access Directory</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2">✓</span> Access Requests</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2">✓</span> Request on behalf</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2">✓</span> Approval workflow</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2">✓</span> Automated provisioning</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2">✓</span> Manual provisioning</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2">✓</span> Request tracking</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2">✓</span> Persistent database</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2">✓</span> Role-based access</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2">✓</span> Responsive UI/UX</li>
              <li className="flex items-center"><span className="text-[var(--accent)] mr-2">✓</span> Part 4 improvements</li>
            </ul>
          </div>
        </div>

        {/* Technologies Used */}
        <hr className="my-10 border-[var(--border)]" />
        <h2 className="text-xl font-bold text-[var(--navy)] mb-6">Technologies Used</h2>
        <div className="flex flex-wrap gap-2 mb-8">
          {["Next.js 14", "TypeScript", "Tailwind CSS", "Prisma ORM", "PostgreSQL", "NextAuth.js", "Zod", "Vitest"].map((tech) => (
            <span key={tech} className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-sm font-medium rounded-full">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex justify-center border-t border-[var(--border)] pt-8 mt-4">
          <Link
            href="/projects"
            className="inline-flex items-center text-[var(--accent)] font-semibold hover:text-[var(--accent-dark)] transition-colors"
          >
            View the Projects Showcase <ArrowRight className="ml-1.5 w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
