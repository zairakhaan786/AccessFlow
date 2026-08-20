import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import CursorSpotlight from "@/components/ui/CursorSpotlight";
import AuroraBackground from "@/components/ui/AuroraBackground";

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
      <body className="min-h-screen bg-[#F5F6F8] text-[#111827] relative selection:bg-blue-500/20">
        <AuroraBackground />
        <CursorSpotlight />
        <AuthProvider>
          <div className="relative z-10">{children}</div>
          <div
            id="toast-root"
            className="toast-container fixed bottom-6 right-6 z-[90] flex flex-col gap-2.5 items-end pointer-events-none"
          />
        </AuthProvider>
      </body>
    </html>
  );
}
