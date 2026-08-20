import React from "react";
import Link from "next/link";
import { ArrowRight, Shield, Zap, Search, Key } from "lucide-react";
import AutomationBackground from "@/components/auth/AutomationBackground";

export default function MarketingHomePage() {
  return (
    <div className="relative flex-1 flex flex-col items-center py-20 px-4 sm:px-6 lg:px-8 bg-[#0F1B33] overflow-hidden">
      {/* Background */}
      <AutomationBackground />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center mt-12 md:mt-24">
        {/* Hero Section */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[13px] font-semibold mb-6 shadow-sm backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-[#22C55E]"></span>
          Now supporting automated provisioning
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
          Enterprise Access Management, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] to-[#2F6FED]">
            Simplified.
          </span>
        </h1>
        
        <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Request, approve, and provision employee tool access across your organization with automated workflows and complete audit trails.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-gradient-to-r from-[#2F6FED] to-[#1E4FC7] hover:from-[#3B7BF6] hover:to-[#2558D4] text-white text-[15px] font-bold shadow-[0_4px_20px_rgba(47,111,237,0.4)] transition-all duration-150 hover:shadow-[0_6px_25px_rgba(47,111,237,0.5)] active:translate-y-[1px]"
          >
            Log in to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-[15px] font-bold backdrop-blur-md transition-all duration-150 active:translate-y-[1px]"
          >
            Learn more
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="mt-32 w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-[#16233F]/80 backdrop-blur-xl border border-white/10 shadow-xl">
            <div className="w-10 h-10 rounded-lg bg-[#2F6FED]/20 border border-[#2F6FED]/30 flex items-center justify-center mb-4">
              <Search className="w-5 h-5 text-[#60A5FA]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Access Directory</h3>
            <p className="text-sm text-slate-400">Browse and request access to standardized boards and applications.</p>
          </div>
          
          <div className="p-6 rounded-2xl bg-[#16233F]/80 backdrop-blur-xl border border-white/10 shadow-xl">
            <div className="w-10 h-10 rounded-lg bg-[#2F6FED]/20 border border-[#2F6FED]/30 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-[#60A5FA]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Automated Provisioning</h3>
            <p className="text-sm text-slate-400">Instantly provision access upon approval without manual IT intervention.</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#16233F]/80 backdrop-blur-xl border border-white/10 shadow-xl">
            <div className="w-10 h-10 rounded-lg bg-[#2F6FED]/20 border border-[#2F6FED]/30 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-[#60A5FA]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Complete Audit Trail</h3>
            <p className="text-sm text-slate-400">Track every request, approval, and exception for compliance reporting.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
