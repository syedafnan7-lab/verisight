import React from "react";
import { RiskState } from "../../services/riskTheme";

interface AtmosphericBackgroundProps {
  riskState?: RiskState | null;
}

export const AtmosphericBackground: React.FC<AtmosphericBackgroundProps> = ({ riskState }) => {
  const isCritical = riskState?.level === "CRITICAL";
  const isElevated = riskState?.level === "ELEVATED";
  const isModerate = riskState?.level === "MODERATE";

  // Dynamic ambient glow colors based on risk state
  const primaryGlow = isCritical
    ? "rgba(225, 29, 72, 0.09)"
    : isElevated
    ? "rgba(249, 115, 22, 0.05)"
    : isModerate
    ? "rgba(245, 158, 11, 0.04)"
    : "rgba(56, 189, 248, 0.04)";

  const secondaryGlow = isCritical
    ? "rgba(159, 18, 57, 0.07)"
    : isElevated
    ? "rgba(194, 65, 12, 0.04)"
    : isModerate
    ? "rgba(180, 83, 9, 0.03)"
    : "rgba(99, 102, 241, 0.03)";

  const gridLineColor = isCritical
    ? "rgba(244, 63, 94, 0.05)"
    : isElevated
    ? "rgba(249, 115, 22, 0.035)"
    : isModerate
    ? "rgba(245, 158, 11, 0.03)"
    : "rgba(56, 189, 248, 0.03)";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-colors duration-700 ease-in-out"
    >
      {/* 1. Fine Technical Forensic Grid Matrix */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${gridLineColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${gridLineColor} 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
      />

      {/* 2. Top-Center Dynamic Risk Spotlight (Shifts smoothly to Crimson at >=87) */}
      <div
        className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[65vw] h-[55vh] rounded-full blur-[140px] transition-all duration-700 ease-out"
        style={{ backgroundColor: primaryGlow }}
      />

      {/* 3. Peripheral Ambient Shading */}
      <div
        className="absolute top-[35%] -right-[10%] w-[45vw] h-[45vh] rounded-full blur-[150px] transition-all duration-700 ease-out"
        style={{ backgroundColor: secondaryGlow }}
      />

      <div
        className="absolute -bottom-[20%] -left-[10%] w-[50vw] h-[50vh] rounded-full blur-[160px] transition-all duration-700 ease-out"
        style={{ backgroundColor: secondaryGlow }}
      />

      {/* 4. Subtle Scanline Texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/[0.008] to-transparent bg-[length:100%_4px] opacity-30 pointer-events-none" />
    </div>
  );
};
