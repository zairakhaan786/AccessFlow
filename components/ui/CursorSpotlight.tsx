"use client";

import React, { useEffect } from "react";

export default function CursorSpotlight() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll<HTMLElement>(".glass-card, .result-row, .list-row, .board-card, .card");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      });

      // Also set global cursor glow position
      const glow = document.getElementById("global-cursor-glow");
      if (glow) {
        glow.style.transform = `translate3d(${e.clientX - 250}px, ${e.clientY - 250}px, 0)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <div
        id="global-cursor-glow"
        className="pointer-events-none fixed top-0 left-0 w-[500px] h-[500px] rounded-full opacity-20 filter blur-[120px] transition-transform duration-75 ease-out z-0"
        style={{
          background: "radial-gradient(circle, rgba(47, 111, 237, 0.6) 0%, rgba(139, 92, 246, 0.4) 40%, transparent 70%)",
        }}
      />
    </>
  );
}
