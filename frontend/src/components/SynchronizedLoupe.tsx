import React from "react";
import { ZoomIn, Crosshair } from "lucide-react";

interface SynchronizedLoupeProps {
  visible: boolean;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  originalImgSrc: string;
  spectralImgSrc?: string;
  spectralLabel?: string;
  imgWidth: number;
  imgHeight: number;
}

export const SynchronizedLoupe: React.FC<SynchronizedLoupeProps> = ({
  visible,
  x,
  y,
  originalImgSrc,
  spectralImgSrc,
  spectralLabel = "Forensic Spectral Layer",
  imgWidth,
  imgHeight,
}) => {
  if (!visible) return null;

  const actualX = Math.round((x / 100) * imgWidth);
  const actualY = Math.round((y / 100) * imgHeight);

  // Loupe diameter
  const size = 150;
  const zoomFactor = 3.0;

  return (
    <div
      className="absolute bottom-4 right-4 z-30 watermelon-glass border border-white/[0.1] rounded-2xl p-3 shadow-2xl flex flex-col space-y-2 pointer-events-none animate-in fade-in duration-150"
      style={{ width: size * 2 + 32 }}
    >
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-1.5 text-[11px] font-mono text-slate-400">
        <div className="flex items-center space-x-1.5 text-watermelon-coral">
          <ZoomIn className="w-3.5 h-3.5" />
          <span className="font-bold tracking-wide">
            3X DUAL-SYNC LOUPE
          </span>
        </div>
        <div className="flex items-center space-x-1 text-slate-500">
          <Crosshair className="w-3 h-3 text-watermelon-coral" />
          <span>
            X: {actualX}px | Y: {actualY}px
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Loupe 1: Original */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-mono text-slate-400 mb-1">
            ORIGINAL CAPTURE
          </span>
          <div
            className="rounded-xl border border-sky-400/40 overflow-hidden relative shadow-inner bg-black"
            style={{
              width: size,
              height: size,
              backgroundImage: `url(${originalImgSrc})`,
              backgroundPosition: `${x}% ${y}%`,
              backgroundSize: `${imgWidth * zoomFactor}px ${imgHeight * zoomFactor}px`,
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Center Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-[1px] bg-sky-400/40" />
              <div className="h-full w-[1px] bg-sky-400/40 absolute" />
              <div className="w-3 h-3 rounded-full border border-sky-400/70 absolute shadow-[0_0_6px_rgba(56,189,248,0.5)]" />
            </div>
          </div>
        </div>

        {/* Loupe 2: Active Spectral Layer */}
        {spectralImgSrc && (
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-slate-400 mb-1 truncate max-w-[150px]">
              {spectralLabel.toUpperCase()}
            </span>
            <div
              className="rounded-xl border border-watermelon-coral/50 overflow-hidden relative shadow-inner bg-black"
              style={{
                width: size,
                height: size,
                backgroundImage: `url(${spectralImgSrc})`,
                backgroundPosition: `${x}% ${y}%`,
                backgroundSize: `${imgWidth * zoomFactor}px ${imgHeight * zoomFactor}px`,
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* Center Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-[1px] bg-watermelon-coral/40" />
                <div className="h-full w-[1px] bg-watermelon-coral/40 absolute" />
                <div className="w-3 h-3 rounded-full border border-watermelon-coral/70 absolute shadow-[0_0_6px_rgba(244,63,94,0.5)]" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
