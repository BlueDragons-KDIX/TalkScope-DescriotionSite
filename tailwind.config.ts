import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        ink: {
          DEFAULT: "#0e1019",
          deep: "#0a0c14",
          surface: "#141722",
          raised: "#1a1e2b",
        },
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
          strong: "var(--accent-strong)",
        },
      },
      maxWidth: {
        prose: "68ch",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-ring": {
          "0%": { opacity: "0.5", transform: "scale(0.9)" },
          "70%, 100%": { opacity: "0", transform: "scale(1.8)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
        float: "float 7s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.16,1,0.3,1) infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
      typography: {
        invert: {
          css: {
            "--tw-prose-body": "#c8cad8",
            "--tw-prose-headings": "#f3f4fb",
            "--tw-prose-bold": "#eef0f8",
            "--tw-prose-code": "var(--accent-strong)",
            "--tw-prose-pre-bg": "#06070e",
            "--tw-prose-links": "var(--accent-strong)",
            "--tw-prose-quotes": "#aeb1c4",
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
