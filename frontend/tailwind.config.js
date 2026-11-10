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
        // User Custom Palette
        palette: {
          sage: "var(--dry-sage)",
          custard: "var(--vanilla-custard)",
          beige: "var(--beige)",
          bronze: "var(--light-bronze)",
          rose: "var(--dusty-rose)",
        },
        sage: "#a3a380",
        custard: "#d6ce93",
        beige: "#efebce",
        bronze: "#d8a48f",
        dustyRose: "#bb8588",
        watermelon: {
          coral: "#bb8588", // mapped to dusty-rose
          rose: "#d8a48f",  // mapped to light-bronze
          crimson: "#a86b6e",
          darkrose: "#4a2d30",
          deepcoral: "#321d20",
          emerald: "#a3a380", // mapped to dry-sage
          mint: "#c5c5a5",
          darkmint: "#828260",
          rind: "#2b2b20",
          deeprind: "#1a1a12",
          sky: "#d6ce93",   // mapped to vanilla-custard
          ice: "#efebce",   // mapped to beige
          cyan: "#a3a380",
          amber: "#d6ce93", // mapped to vanilla-custard
          gold: "#d8a48f",  // mapped to light-bronze
          purple: "#bb8588",
          violet: "#a86b6e",
        },
        workbench: {
          canvas: "#0c0e12",
          subtle: "#12151b",
          card: "#161a22",
          cardHover: "#1c212c",
          panel: "#141820",
          border: "rgba(239, 235, 206, 0.12)",
          borderLight: "rgba(239, 235, 206, 0.08)",
          highlight: "#222834",
          text: "#efebce",
          muted: "#a3a380",
          darkMuted: "#727258",
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'inner-light': 'inset 0 1px 0 0 rgba(239, 235, 206, 0.1)',
        'rose-glow': '0 0 25px -5px rgba(187, 133, 136, 0.4)',
        'sage-glow': '0 0 25px -5px rgba(163, 163, 128, 0.4)',
        'custard-glow': '0 0 25px -5px rgba(214, 206, 147, 0.4)',
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
