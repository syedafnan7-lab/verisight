/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        watermelon: {
          coral: "#f43f5e",
          rose: "#fb7185",
          crimson: "#e11d48",
          darkrose: "#881337",
          deepcoral: "#4c0519",
          emerald: "#10b981",
          mint: "#34d399",
          darkmint: "#059669",
          rind: "#064e3b",
          deeprind: "#022c22",
          sky: "#38bdf8",
          ice: "#7dd3fc",
          cyan: "#06b6d4",
          amber: "#f59e0b",
          gold: "#fbbf24",
          purple: "#a855f7",
          violet: "#8b5cf6",
        },
        workbench: {
          canvas: "#080c16",
          subtle: "#0b101e",
          card: "#0d1527",
          cardHover: "#111b33",
          panel: "#0f182c",
          border: "#1e293b",
          borderLight: "rgba(255, 255, 255, 0.08)",
          highlight: "#1e2942",
          text: "#f8fafc",
          muted: "#94a3b8",
          darkMuted: "#64748b",
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'watermelon-glow': '0 0 25px -5px rgba(244, 63, 94, 0.35)',
        'emerald-glow': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'sky-glow': '0 0 25px -5px rgba(56, 189, 248, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'laser-pulse': 'laserPulse 2s ease-in-out infinite',
        'cyan-glow': 'cyanGlow 2.5s ease-in-out infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
