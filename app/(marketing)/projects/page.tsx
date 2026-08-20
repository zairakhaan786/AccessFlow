import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="flex-1 w-full max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--navy)] tracking-tight">
          Projects Showcase
        </h1>
        <p className="mt-4 text-lg text-[var(--muted)]">
          A selection of highlighted work and technical implementations.
        </p>
      </div>

      <div className="space-y-12">
        {/* Project Card: AccessFlow */}
        <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden flex flex-col md:flex-row transition-shadow hover:shadow-md">
          {/* Images Gallery */}
          <div className="w-full md:w-2/5 bg-slate-50 border-b md:border-b-0 md:border-r border-[var(--border)] p-6 flex flex-col gap-4">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-sm">
              <Image 
                src="/screenshots/03-dashboard.png" 
                alt="AccessFlow Dashboard" 
                fill 
                className="object-cover object-left-top"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                <Image 
                  src="/screenshots/01-login.png" 
                  alt="AccessFlow Login" 
                  fill 
                  className="object-cover object-top"
                />
              </div>
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-[#0F1B33]">
                <Image 
                  src="/screenshots/02-signup.png" 
                  alt="AccessFlow Signup" 
                  fill 
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="w-full md:w-3/5 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-[var(--navy)]">AccessFlow</h2>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                  Live
                </span>
              </div>
              
              <p className="text-[15px] text-[var(--muted)] leading-relaxed mb-6">
                An enterprise-grade access management portal built to automate tool provisioning and governance. 
                Originally a static UI prototype, this was converted into a full-stack, production-ready application. 
                It features a custom glassmorphic design system, role-based access control, an automated request approval queue, and a simulated 1-click evaluation mode.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {["Next.js", "TypeScript", "Prisma", "PostgreSQL", "NextAuth", "Tailwind CSS"].map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-6 border-t border-slate-100 mt-auto">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white text-sm font-semibold transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Live Demo
              </Link>
              <a 
                href="https://github.com/zairakhaan786/AccessFlow" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[var(--border)] text-[var(--navy)] text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                <Github className="w-4 h-4" /> GitHub Repo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
