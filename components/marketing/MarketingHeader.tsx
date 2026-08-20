"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function MarketingHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[var(--border)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] flex items-center justify-center shadow-md border border-[var(--accent)]/20 transition-transform group-hover:scale-105">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 12L12 4L20 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 4V20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 20H20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-[17px] font-bold text-[var(--navy)] tracking-tight">AccessFlow</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--navy)] transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--navy)] transition-colors">
            About
          </Link>
          <Link href="/projects" className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--navy)] transition-colors">
            Projects
          </Link>
        </nav>

        {/* CTA (Desktop) & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden md:inline-flex items-center justify-center h-10 px-6 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white text-sm font-bold shadow-md transition-all active:translate-y-[1px]"
          >
            Log in
          </Link>
          <button
            className="md:hidden p-2 text-[var(--navy)]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-white px-4 py-4 space-y-4 shadow-lg">
          <nav className="flex flex-col gap-4">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-semibold text-[var(--navy)]"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-semibold text-[var(--navy)]"
            >
              About
            </Link>
            <Link 
              href="/projects" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-semibold text-[var(--navy)]"
            >
              Projects
            </Link>
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-[var(--accent)] text-white text-sm font-bold shadow-sm"
            >
              Log in
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
