import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "Access Management – New Age Portal",
  description: "Enterprise Governed Access Management and Board Provisioning System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] selection:bg-blue-500/20">
        <AuthProvider>
          {children}
          <div
            id="toast-root"
            className="toast-container fixed bottom-6 right-6 z-[90] flex flex-col gap-2.5 items-end pointer-events-none"
          />
        </AuthProvider>
      </body>
    </html>
  );
}
