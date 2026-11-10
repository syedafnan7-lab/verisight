import React from "react";

export const AtmosphericBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* 1. Subtle Fine Technical Grid Matrix */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #38bdf8 1px, transparent 1px),
            linear-gradient(to bottom, #38bdf8 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* 2. Primary Atmospheric Radial Vignette */}
      <div className="absolute -top-[25%] -left-[10%] w-[50vw] h-[50vh] rounded-full bg-sky-500/[0.04] blur-[120px]" />
      <div className="absolute top-[30%] -right-[15%] w-[45vw] h-[45vh] rounded-full bg-indigo-500/[0.03] blur-[140px]" />
      <div className="absolute -bottom-[20%] left-[20%] w-[55vw] h-[55vh] rounded-full bg-cyan-500/[0.03] blur-[150px]" />

      {/* 3. Horizontal Subtle Scanline / Forensic Grid Beam */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/[0.015] to-transparent bg-[length:100%_4px] opacity-40 pointer-events-none" />
    </div>
  );
};
