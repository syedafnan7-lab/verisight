import React, { useState } from "react";
import { RealWorldFraudCase } from "../../data/realWorldCases";
import { MapPin, AlertCircle } from "lucide-react";

interface DottedIndiaMapProps {
  cases: RealWorldFraudCase[];
  activeCaseId: string;
  onSelectCase: (caseId: string) => void;
  className?: string;
}

// Representative dot coordinates forming India's geographic contour (normalized 0-100)
const INDIA_DOT_GRID = [
  // North (J&K, Ladakh, HP, Punjab, Uttarakhand)
  { x: 37, y: 10 }, { x: 41, y: 9 }, { x: 45, y: 11 }, { x: 48, y: 13 },
  { x: 35, y: 14 }, { x: 39, y: 14 }, { x: 43, y: 15 }, { x: 47, y: 16 },
  { x: 33, y: 18 }, { x: 37, y: 19 }, { x: 41, y: 20 }, { x: 45, y: 21 },
  { x: 31, y: 23 }, { x: 35, y: 24 }, { x: 39, y: 25 }, { x: 43, y: 25 }, { x: 47, y: 26 },

  // Delhi NCR, Rajasthan, UP, Haryana
  { x: 26, y: 28 }, { x: 30, y: 28 }, { x: 34, y: 29 }, { x: 38, y: 29 }, { x: 42, y: 28 }, { x: 46, y: 29 }, { x: 50, y: 30 },
  { x: 25, y: 33 }, { x: 29, y: 34 }, { x: 33, y: 34 }, { x: 37, y: 34 }, { x: 41, y: 34 }, { x: 45, y: 35 }, { x: 49, y: 35 }, { x: 53, y: 35 },
  { x: 23, y: 38 }, { x: 27, y: 39 }, { x: 31, y: 39 }, { x: 35, y: 39 }, { x: 39, y: 40 }, { x: 43, y: 40 }, { x: 47, y: 40 }, { x: 51, y: 41 }, { x: 55, y: 41 },

  // Gujarat, MP, Bihar, Bengal, North East
  { x: 18, y: 43 }, { x: 22, y: 43 }, { x: 26, y: 44 }, { x: 30, y: 44 }, { x: 34, y: 44 }, { x: 38, y: 45 }, { x: 42, y: 45 }, { x: 46, y: 46 }, { x: 50, y: 46 }, { x: 54, y: 46 }, { x: 58, y: 45 }, { x: 62, y: 43 }, { x: 66, y: 41 }, { x: 70, y: 39 },
  { x: 17, y: 48 }, { x: 21, y: 48 }, { x: 25, y: 49 }, { x: 29, y: 49 }, { x: 33, y: 50 }, { x: 37, y: 50 }, { x: 41, y: 50 }, { x: 45, y: 51 }, { x: 49, y: 51 }, { x: 53, y: 51 }, { x: 57, y: 50 }, { x: 61, y: 48 }, { x: 65, y: 46 }, { x: 69, y: 44 }, { x: 73, y: 42 },

  // Maharashtra, Odisha, Chhattisgarh
  { x: 25, y: 53 }, { x: 29, y: 54 }, { x: 33, y: 54 }, { x: 37, y: 55 }, { x: 41, y: 55 }, { x: 45, y: 55 }, { x: 49, y: 56 }, { x: 53, y: 56 }, { x: 57, y: 55 },
  { x: 27, y: 58 }, { x: 31, y: 58 }, { x: 35, y: 58 }, { x: 39, y: 59 }, { x: 43, y: 60 }, { x: 47, y: 60 }, { x: 51, y: 60 }, { x: 55, y: 59 },

  // Telangana, Andhra, Goa, Karnataka
  { x: 30, y: 63 }, { x: 34, y: 64 }, { x: 38, y: 64 }, { x: 42, y: 64 }, { x: 46, y: 65 }, { x: 50, y: 65 },
  { x: 33, y: 68 }, { x: 37, y: 69 }, { x: 41, y: 69 }, { x: 45, y: 69 }, { x: 49, y: 70 },
  { x: 36, y: 73 }, { x: 40, y: 73 }, { x: 44, y: 74 }, { x: 48, y: 74 },

  // Tamil Nadu, Kerala (South)
  { x: 38, y: 78 }, { x: 42, y: 79 }, { x: 46, y: 79 },
  { x: 40, y: 83 }, { x: 43, y: 84 }, { x: 46, y: 84 },
  { x: 42, y: 88 }, { x: 44, y: 89 },
  { x: 43, y: 93 },
];

export const DottedIndiaMap: React.FC<DottedIndiaMapProps> = ({
  cases,
  activeCaseId,
  onSelectCase,
  className = "",
}) => {
  const [hoveredCaseId, setHoveredCaseId] = useState<string | null>(null);

  const activeCase = cases.find((c) => c.id === activeCaseId);
  const hoveredCase = cases.find((c) => c.id === hoveredCaseId);

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* SVG Canvas for Dotted Map */}
      <div className="relative w-full max-w-[320px] aspect-[4/5] overflow-visible">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_15px_rgba(56,189,248,0.05)]"
          aria-label="Map of India showing verified cyber fraud incident locations"
        >
          {/* Subtle connecting mesh or base contour lines */}
          <path
            d="M 37 10 L 48 13 L 47 26 L 55 41 L 73 42 L 58 45 L 55 59 L 49 70 L 43 93 L 38 78 L 27 58 L 18 43 L 26 28 Z"
            fill="rgba(14, 165, 233, 0.02)"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="0.4"
            strokeDasharray="1 1"
          />

          {/* Dotted Matrix */}
          {INDIA_DOT_GRID.map((dot, idx) => (
            <circle
              key={idx}
              cx={dot.x}
              cy={dot.y}
              r={0.75}
              fill="rgba(148, 163, 184, 0.22)"
              className="transition-colors hover:fill-sky-400/40"
            />
          ))}

          {/* Real Verified Case Markers */}
          {cases.map((c) => {
            const isActive = c.id === activeCaseId;
            const isHovered = c.id === hoveredCaseId;

            return (
              <g
                key={c.id}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => onSelectCase(c.id)}
                onMouseEnter={() => setHoveredCaseId(c.id)}
                onMouseLeave={() => setHoveredCaseId(null)}
              >
                {/* Outer Radar Glow / Wave for Active Marker */}
                {isActive && (
                  <>
                    <circle
                      cx={c.mapCoordinates.x}
                      cy={c.mapCoordinates.y}
                      r={4.5}
                      fill="none"
                      stroke={c.accentColor || "#38bdf8"}
                      strokeWidth="0.8"
                      className="animate-ping opacity-60"
                    />
                    <circle
                      cx={c.mapCoordinates.x}
                      cy={c.mapCoordinates.y}
                      r={6.5}
                      fill={c.accentColor || "#38bdf8"}
                      fillOpacity="0.15"
                    />
                  </>
                )}

                {/* Base Marker Circle */}
                <circle
                  cx={c.mapCoordinates.x}
                  cy={c.mapCoordinates.y}
                  r={isActive ? 2.4 : isHovered ? 2.0 : 1.5}
                  fill={isActive ? c.accentColor || "#38bdf8" : isHovered ? "#38bdf8" : "#94a3b8"}
                  stroke={isActive ? "#ffffff" : "rgba(15, 23, 42, 0.8)"}
                  strokeWidth={isActive ? 0.8 : 0.4}
                  className="transition-all duration-200"
                />

                {/* City Name Label for Active/Hovered Marker */}
                {(isActive || isHovered) && (
                  <text
                    x={c.mapCoordinates.x + (c.mapCoordinates.x > 50 ? -3 : 3)}
                    y={c.mapCoordinates.y - 3}
                    textAnchor={c.mapCoordinates.x > 50 ? "end" : "start"}
                    fill="#f8fafc"
                    fontSize="3"
                    fontFamily="ui-monospace, monospace"
                    fontWeight="bold"
                    className="pointer-events-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
                  >
                    {c.city}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Active Case Pin Card (Bottom of Map) */}
        {(activeCase || hoveredCase) && (
          <div className="absolute -bottom-4 left-0 right-0 rounded-xl border border-white/10 bg-[#0A0F1F]/95 p-2.5 backdrop-blur-md shadow-xl text-xs font-mono animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5 text-sky-400 font-bold">
                <MapPin className="h-3 w-3" />
                <span>
                  {(hoveredCase || activeCase)?.city}, {(hoveredCase || activeCase)?.state}
                </span>
              </div>
              <span className="text-amber-400 font-semibold">
                {(hoveredCase || activeCase)?.reportedLoss}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-300 font-sans line-clamp-1">
              {(hoveredCase || activeCase)?.scamCategory}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center gap-2 text-[10px] font-mono text-slate-400">
        <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
        <span>7 Verified Incident Coordinates Plotted</span>
      </div>
    </div>
  );
};
