/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--surface-l0-canvas)",
        panel: "var(--surface-l1-base)",
        elevated: "var(--surface-l2-elevated)",
        sheet: "var(--surface-l3-sheet)",
        popover: "var(--surface-l3-popover)",
        "border-subtle": "var(--border-subtle)",
        "border-medium": "var(--border-medium)",
        "border-highlight": "var(--border-highlight)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",
        "text-dim": "var(--text-dim)",
        consensus: "var(--accent-consensus)",
        refuted: "var(--accent-refuted)",
        canon: "var(--accent-canon)",
        frontier: "var(--accent-frontier)",
        gap: "var(--accent-gap)",
      },
      fontFamily: {
        serif: ["'Newsreader'", "'Instrument Serif'", "Georgia", "serif"],
        sans: ["'Plus Jakarta Sans'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "sans-serif"],
        mono: ["'JetBrains Mono'", "'SF Mono'", "Menlo", "Consolas", "monospace"],
      },
      boxShadow: {
        specular: "inset 0 1px 0 rgba(255, 255, 255, 0.10)",
        panel: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
}


