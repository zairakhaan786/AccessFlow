"use client";

import React from "react";
import AutomationBackground from "@/components/auth/AutomationBackground";

interface CinematicBackgroundProps {
  intensity?: "subtle" | "full";
}

export default function CinematicBackground({
  intensity = "full",
}: CinematicBackgroundProps) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* WebGL shader base */}
      {intensity === "full" ? (
        <AutomationBackground />
      ) : (
        <div className="absolute inset-0 opacity-25">
          <AutomationBackground />
        </div>
      )}

      {/* Floating aurora orbs for depth */}
      <div className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-[#2F6FED]/20 to-[#8B5CF6]/12 filter blur-[140px] animate-floatOrb" />
      <div className="absolute top-[35%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-[#06B6D4]/15 to-[#2F6FED]/12 filter blur-[150px] animate-floatOrb" style={{ animationDelay: "-6s" }} />
      <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-[#8B5CF6]/15 to-[#EC4899]/8 filter blur-[160px] animate-floatOrb" style={{ animationDelay: "-10s" }} />

      {/* Fine animated grid */}
      <div className="absolute inset-0 bg-grid-fine animate-gridPan opacity-60" />

      {/* Vignette for cinematic depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(5, 8, 16, 0.55) 100%)",
        }}
      />
    </div>
  );
}