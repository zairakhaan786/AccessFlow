"use client";

import React, { useEffect, useRef, useState } from "react";

interface GlassSpotlightProps {
  cardRef: React.RefObject<HTMLDivElement>;
}

export default function GlassSpotlight({ cardRef }: GlassSpotlightProps) {
  const [isTouch, setIsTouch] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Position references for requestAnimationFrame lerp easing
  const targetPos = useRef({ x: 200, y: 150 });
  const currentPos = useRef({ x: 200, y: 150 });
  const spotRef = useRef<HTMLDivElement>(null);
  const bgSpotRef = useRef<HTMLDivElement>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Check if device supports fine pointer (mouse/trackpad)
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        targetPos.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }

      if (bgSpotRef.current) {
        bgSpotRef.current.style.transform = `translate3d(${e.clientX - 250}px, ${e.clientY - 250}px, 0)`;
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Smooth lerp loop
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const updateLoop = () => {
      currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.12);
      currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.12);

      if (spotRef.current) {
        spotRef.current.style.background = `radial-gradient(360px circle at ${currentPos.current.x}px ${currentPos.current.y}px, rgba(47, 111, 237, 0.22), transparent 70%)`;
      }

      animFrameId.current = requestAnimationFrame(updateLoop);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    animFrameId.current = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [cardRef]);

  if (isTouch) {
    // Graceful static ambient glow on touch devices
    return (
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: "radial-gradient(circle at 50% 30%, rgba(47, 111, 237, 0.15), transparent 70%)",
        }}
      />
    );
  }

  return (
    <>
      {/* Background ambient cursor follow glow */}
      <div
        ref={bgSpotRef}
        className="pointer-events-none fixed top-0 left-0 w-[500px] h-[500px] rounded-full opacity-30 filter blur-[100px] transition-transform duration-100 ease-out z-0"
        style={{
          background: "radial-gradient(circle, rgba(47, 111, 237, 0.45) 0%, rgba(79, 70, 229, 0.3) 45%, transparent 70%)",
        }}
      />

      {/* Card Specular Spotlight */}
      <div
        ref={spotRef}
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 z-1"
        style={{
          opacity: isVisible ? 1 : 0.4,
        }}
      />
    </>
  );
}
