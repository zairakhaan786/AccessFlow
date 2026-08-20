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
      },
      animation: {
        toastIn: "toastIn 0.22s ease",
        toastOut: "toastOut 0.18s ease forwards",
        drawerIn: "drawerIn 0.2s ease",
        drawerOut: "drawerOut 0.16s ease forwards",
        modalIn: "modalIn 0.18s ease",
        modalOut: "modalOut 0.15s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
