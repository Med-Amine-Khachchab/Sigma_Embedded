import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#0b0e13",
        steel: "#10141b",
        neon: "#38f2ff",
        acid: "#64ff8f",
        flare: "#5a7cff",
      },
      boxShadow: {
        glow: "0 0 25px rgba(56, 242, 255, 0.35)",
        "glow-strong": "0 0 40px rgba(100, 255, 143, 0.35)",
      },
      fontFamily: {
        sans: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "pcb-grid": "radial-gradient(circle at 1px 1px, rgba(56, 242, 255, 0.15) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};

export default config;
