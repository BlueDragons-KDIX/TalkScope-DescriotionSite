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
      colors: {
        surface: {
          DEFAULT: "#111113",
          raised: "#18181b",
        },
        accent: {
          DEFAULT: "#6366f1",
          light: "#818cf8",
          dim: "#312e81",
        },
      },
      typography: {
        invert: {
          css: {
            "--tw-prose-body": "#d4d4d8",
            "--tw-prose-headings": "#f4f4f5",
            "--tw-prose-code": "#c4b5fd",
            "--tw-prose-pre-bg": "#0f0f12",
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
