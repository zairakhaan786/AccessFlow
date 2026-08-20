import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "var(--navy)",
          soft: "var(--navy-soft)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          dark: "var(--accent-dark)",
        },
        surface: {
          bg: "var(--bg)",
          border: "var(--border)",
        },
        customText: {
          DEFAULT: "var(--text)",
          muted: "var(--muted)",
          muted2: "var(--muted-2)",
        },
      },
      borderRadius: {
        container: "12px",
        control: "9px",
      },
      height: {
        control: "40px",
      },
      keyframes: {
        toastIn: {
          from: { opacity: "0", transform: "translateY(10px) scale(0.97)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        toastOut: {
          from: { opacity: "1", transform: "translateY(0)" },
          to: { opacity: "0", transform: "translateY(6px)" },
        },
        drawerIn: {
          from: { transform: "translateX(26px)", opacity: "0.5" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        drawerOut: {
          from: { transform: "translateX(0)", opacity: "1" },
          to: { transform: "translateX(26px)", opacity: "0" },
        },
        modalIn: {
          from: { opacity: "0", transform: "scale(0.96) translateY(6px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        modalOut: {
          from: { opacity: "1", transform: "scale(1)" },
          to: { opacity: "0", transform: "scale(0.97)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        gradientPan: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        gridPan: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "40px 40px" },
        },
        floatOrb: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(24px, -18px) scale(1.06)" },
          "66%": { transform: "translate(-18px, 14px) scale(0.96)" },
        },
      },
      animation: {
        toastIn: "toastIn 0.22s ease",
        toastOut: "toastOut 0.18s ease forwards",
        drawerIn: "drawerIn 0.2s ease",
        drawerOut: "drawerOut 0.16s ease forwards",
        modalIn: "modalIn 0.18s ease",
        modalOut: "modalOut 0.15s ease forwards",
        fadeUp: "fadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
        fadeIn: "fadeIn 0.35s ease both",
        shimmer: "shimmer 2.4s linear infinite",
        pulseGlow: "pulseGlow 3.2s ease-in-out infinite",
        gradientPan: "gradientPan 6s ease infinite",
        gridPan: "gridPan 16s linear infinite",
        floatOrb: "floatOrb 14s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
