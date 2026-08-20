import React from "react";
import MarketingHeader from "@/components/marketing/MarketingHeader";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <MarketingHeader />

      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
