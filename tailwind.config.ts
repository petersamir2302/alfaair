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
        primary: {
          DEFAULT: "#4A90E2", // Main blue from logo
          dark: "#2E5C8A",
          light: "#6BA3E8",
          lighter: "#E3F2FD", // Very light blue
        },
        secondary: {
          DEFAULT: "#6B7280",
          light: "#9CA3AF",
          dark: "#4B5563",
        },
        accent: {
          light: "#F0F7FF", // Light blue tint
          DEFAULT: "#E8F4FD", // Soft blue accent
          blue: "#B3D9FF", // Medium blue accent
        },
        background: {
          dark: "#0F172A",
          light: "#FFFFFF",
          DEFAULT: "#F5F7FA",
          gradient: {
            start: "#E3F2FD", // Light blue
            end: "#FFFFFF", // White
            middle: "#F0F7FF", // Very light blue
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;

