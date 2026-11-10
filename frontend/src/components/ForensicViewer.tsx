import React, { useState, useRef } from "react";
import {
  Layers,
  Activity,
  Waves,
  Copy,
  Split,
  Grid,
  Eye,
  Sliders,
  Crosshair,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Info,
} from "lucide-react";
import {
  ForensicAnalysisReport,
  BoundingBox,
  BaselineLaser,
} from "../types/forensic";
import { SynchronizedLoupe } from "./SynchronizedLoupe";

interface ForensicViewerProps {
  report: ForensicAnalysisReport | null;
  selectedLocus: BoundingBox | null;
}

export type ViewMode =
  | "ORIGINAL"
  | "ELA"
  | "WAVELET"
  | "COPY_MOVE"
  | "LOUPE"
  | "QUAD";

export const ForensicViewer: React.FC<ForensicViewerProps> = ({
  report,
  selectedLocus,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("ORIGINAL");
  const [showLasers, setShowLasers] = useState<boolean>(true);
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [splitPos, setSplitPos] = useState<number>(50);

  // Loupe tracking state
  const [loupePos, setLoupePos] = useState<{ x: number; y: number }>({
    x: 50,
    y: 50,
  });
  const [pixelCoords, setPixelCoords] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!report) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 bg-[#080c16]">
        <div className="w-16 h-16 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-center mb-4">
          <Layers className="w-8 h-8 text-sky-400/60 animate-pulse" />
        </div>
        <h3 className="text-sm font-semibold font-mono text-slate-300">
          AWAITING EVIDENCE INPUT
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Select a sample above or drop an image anywhere to begin forensic signal & geometry analysis.
        </p>
      </div>
    );
  }

  const {
    image_width,
    image_height,
    original_image_b64,
    layer1,
    layer2,
    all_bounding_boxes,
  } = report;

  // Active layer image selection
  let currentLayerImg = original_image_b64;
  let layerLabel = "Original Evidence Capture";

  if (viewMode === "ELA") {
    currentLayerImg = layer1.ela_b64;
    layerLabel = "Multi-Scale Error Level Analysis (Inferno)";
  } else if (viewMode === "WAVELET") {
    currentLayerImg = layer1.wavelet_noise_b64;
    layerLabel = "Daubechies db4 Wavelet High-Pass Noise Residual";
  } else if (viewMode === "COPY_MOVE") {
    currentLayerImg = layer1.clone_b64;
    layerLabel = "ORB Keypoint Duplicate Copy-Move Vectors";
  }

  // Mouse move handler for synchronized loupe and coordinates
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = Math.max(
      0,
      Math.min(100, ((e.clientX - rect.left) / rect.width) * 100),
    );
    const yPct = Math.max(
      0,
      Math.min(100, ((e.clientY - rect.top) / rect.height) * 100),
    );
    setLoupePos({ x: xPct, y: yPct });

    const pxX = Math.round((xPct / 100) * image_width);
    const pxY = Math.round((yPct / 100) * image_height);
    setPixelCoords({ x: pxX, y: pxY });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#080c16] overflow-hidden relative">
      {/* Top Floating Controls Bar */}
      <div className="h-13 border-b border-white/[0.08] watermelon-glass px-4 py-2 flex items-center justify-between text-xs z-10">
        {/* Spectral Mode Tabs */}
        <div className="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-white/[0.08]">
          <button
            onClick={() => setViewMode("ORIGINAL")}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1.5 transition-all ${
              viewMode === "ORIGINAL"
                ? "bg-slate-800 text-white shadow-sm font-semibold border border-white/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-slate-300" />
            <span>ORIGINAL</span>
          </button>

          <button
            onClick={() => setViewMode("ELA")}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1.5 transition-all ${
              viewMode === "ELA"
                ? "bg-amber-950/80 text-amber-300 border border-amber-600/50 shadow-sm font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>ELA HEATMAP</span>
          </button>

          <button
            onClick={() => setViewMode("WAVELET")}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1.5 transition-all ${
              viewMode === "WAVELET"
                ? "bg-sky-950/80 text-sky-300 border border-sky-600/50 shadow-sm font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Waves className="w-3.5 h-3.5 text-sky-400" />
            <span>WAVELET (db4)</span>
          </button>

          <button
            onClick={() => setViewMode("COPY_MOVE")}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1.5 transition-all ${
              viewMode === "COPY_MOVE"
                ? "bg-watermelon-darkrose/80 text-watermelon-rose border border-watermelon-coral/50 shadow-sm font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Copy className="w-3.5 h-3.5 text-watermelon-coral" />
            <span>ORB CLONES</span>
          </button>

          <button
            onClick={() => setViewMode("LOUPE")}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1.5 transition-all ${
              viewMode === "LOUPE"
                ? "bg-indigo-950/80 text-indigo-300 border border-indigo-600/50 shadow-sm font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Split className="w-3.5 h-3.5 text-indigo-400" />
            <span>3x LOUPE</span>
          </button>

          <button
            onClick={() => setViewMode("QUAD")}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1.5 transition-all ${
              viewMode === "QUAD"
                ? "bg-purple-950/80 text-purple-300 border border-purple-600/50 shadow-sm font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Grid className="w-3.5 h-3.5 text-purple-400" />
            <span>QUAD-SPECTRAL</span>
          </button>
        </div>

        {/* Right Controls: Overlay Toggles & Zoom */}
        <div className="flex items-center space-x-4">
          {/* Overlay Switches */}
          <div className="flex items-center space-x-3 text-[11px] font-mono">
            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-400 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={showLasers}
                onChange={(e) => setShowLasers(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-0"
              />
              <span className={showLasers ? "text-sky-400 font-semibold" : ""}>
                Baseline Lasers
              </span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-400 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={showBoxes}
                onChange={(e) => setShowBoxes(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-watermelon-coral focus:ring-0"
              />
              <span
                className={showBoxes ? "text-watermelon-rose font-semibold" : ""}
              >
                Anomaly Boxes
              </span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-400 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-slate-400 focus:ring-0"
              />
              <span>Grid</span>
            </label>
          </div>

          {/* Zoom Group */}
          <div className="flex items-center space-x-1 bg-slate-950/80 p-0.5 rounded-lg border border-white/[0.08] text-[11px] font-mono">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
              className="p-1 rounded text-slate-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-slate-300 font-semibold">
              {(zoomLevel * 100).toFixed(0)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
              className="p-1 rounded text-slate-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 rounded text-slate-400 hover:text-white ml-0.5"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center relative bg-gradient-to-b from-[#080c16] via-[#090e1c] to-[#080c16]">
        {viewMode === "QUAD" ? (
          /* 2x2 Synchronized Quad-Spectral Grid */
          <div className="grid grid-cols-2 gap-3.5 max-h-full max-w-[900px] aspect-[9/10] w-full">
            <div className="flex flex-col watermelon-glass-card rounded-xl overflow-hidden">
              <div className="px-3 py-1.5 bg-slate-950/90 border-b border-white/[0.06] text-[10px] font-mono font-bold text-sky-400 flex items-center justify-between">
                <span>1. ORIGINAL EVIDENCE</span>
                <span className="text-slate-500">{image_width}x{image_height}</span>
              </div>
              <div className="flex-1 flex items-center justify-center p-2.5 bg-black/60">
                <img
                  src={original_image_b64}
                  alt="Original"
                  className="max-h-full object-contain rounded"
                />
              </div>
            </div>

            <div className="flex flex-col watermelon-glass-card rounded-xl overflow-hidden">
              <div className="px-3 py-1.5 bg-slate-950/90 border-b border-white/[0.06] text-[10px] font-mono font-bold text-amber-400 flex items-center justify-between">
                <span>2. ERROR LEVEL ANALYSIS (ELA)</span>
                <span className="text-amber-500 font-semibold">{layer1.ela_score.toFixed(1)}%</span>
              </div>
              <div className="flex-1 flex items-center justify-center p-2.5 bg-black/60">
                <img
                  src={layer1.ela_b64}
                  alt="ELA"
                  className="max-h-full object-contain rounded"
                />
              </div>
            </div>

            <div className="flex flex-col watermelon-glass-card rounded-xl overflow-hidden">
              <div className="px-3 py-1.5 bg-slate-950/90 border-b border-white/[0.06] text-[10px] font-mono font-bold text-cyan-400 flex items-center justify-between">
                <span>3. DAUBECHIES db4 WAVELET NOISE</span>
                <span className="text-cyan-500 font-semibold">{layer1.wavelet_noise_score.toFixed(1)}%</span>
              </div>
              <div className="flex-1 flex items-center justify-center p-2.5 bg-black/60">
                <img
                  src={layer1.wavelet_noise_b64}
                  alt="Wavelet"
                  className="max-h-full object-contain rounded"
                />
              </div>
            </div>

            <div className="flex flex-col watermelon-glass-card rounded-xl overflow-hidden">
              <div className="px-3 py-1.5 bg-slate-950/90 border-b border-white/[0.06] text-[10px] font-mono font-bold text-watermelon-rose flex items-center justify-between">
                <span>4. ORB CLONED KEYPOINTS</span>
                <span className="text-watermelon-coral font-semibold">{layer1.clone_count} pairs</span>
              </div>
              <div className="flex-1 flex items-center justify-center p-2.5 bg-black/60">
                <img
                  src={layer1.clone_b64}
                  alt="Clone"
                  className="max-h-full object-contain rounded"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Single Multi-Spectral Canvas with SVG Overlay & Scaling */
          <div
            ref={containerRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
            className="relative flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl border border-white/[0.1] bg-black transition-transform duration-150"
            style={{
              maxHeight: "calc(100vh - 170px)",
              aspectRatio: `${image_width} / ${image_height}`,
              transform: `scale(${zoomLevel})`,
              transformOrigin: "center center",
            }}
          >
            {/* Base Image */}
            <img
              src={currentLayerImg}
              alt="Forensic View"
              className="w-full h-full object-contain select-none pointer-events-none"
            />

            {/* Optional Coordinate Grid */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
            )}

            {/* Interactive SVG Overlay (Lasers & Anomaly Reticles) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox={`0 0 ${image_width} ${image_height}`}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Layer 2: Sub-pixel Horizontal Baseline Lasers */}
              {showLasers &&
                layer2.lasers.map((laser, idx) => {
                  const isTampered = laser.is_tampered;
                  const x1 = laser.x_start ?? 40;
                  const x2 = laser.x_end ?? image_width - 40;
                  const y = laser.y_baseline;

                  return (
                    <g key={`laser-${idx}`}>
                      {/* Laser Line */}
                      <line
                        x1={x1}
                        y1={y}
                        x2={x2}
                        y2={y}
                        stroke={isTampered ? "#f43f5e" : "#38bdf8"}
                        strokeWidth={isTampered ? "3" : "1.5"}
                        strokeDasharray={isTampered ? "none" : "5 3"}
                        className={
                          isTampered ? "laser-critical" : "laser-aligned"
                        }
                      />

                      {/* Laser Left Anchor Dot */}
                      <circle
                        cx={x1}
                        cy={y}
                        r={isTampered ? 4.5 : 2.5}
                        fill={isTampered ? "#f43f5e" : "#38bdf8"}
                      />

                      {/* Callout Badge for Tampered Drift */}
                      {isTampered && laser.callout_text && (
                        <g transform={`translate(${x2 + 8}, ${y - 9})`}>
                          <rect
                            x="0"
                            y="0"
                            width="118"
                            height="18"
                            rx="4"
                            fill="#f43f5e"
                            stroke="#ffffff"
                            strokeWidth="0.8"
                          />
                          <text
                            x="6"
                            y="13"
                            fill="#ffffff"
                            fontSize="11"
                            fontWeight="bold"
                            fontFamily="monospace"
                          >
                            {laser.callout_text}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

              {/* Anomaly Bounding Box Reticles */}
              {showBoxes &&
                all_bounding_boxes.map((box, bIdx) => {
                  const isLocus =
                    box.anomaly_type === "CROSS_LAYER_SYNERGY_LOCUS";
                  const isSelected =
                    selectedLocus &&
                    selectedLocus.x === box.x &&
                    selectedLocus.y === box.y;

                  const strokeColor = isLocus
                    ? "#f59e0b"
                    : box.layer === 1
                      ? "#ec4899"
                      : box.layer === 2
                        ? "#f43f5e"
                        : "#38bdf8";

                  return (
                    <g key={`bbox-${bIdx}`}>
                      {/* Selected Locus Glow Indicator */}
                      {isSelected && (
                        <rect
                          x={box.x - 6}
                          y={box.y - 6}
                          width={box.width + 12}
                          height={box.height + 12}
                          fill="none"
                          stroke="#fb7185"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                          className="animate-spin"
                        />
                      )}

                      {/* Main Box Outline */}
                      <rect
                        x={box.x}
                        y={box.y}
                        width={box.width}
                        height={box.height}
                        fill={
                          isLocus
                            ? "rgba(245, 158, 11, 0.18)"
                            : "rgba(244, 63, 94, 0.08)"
                        }
                        stroke={strokeColor}
                        strokeWidth={isLocus || isSelected ? "3.2" : "1.8"}
                        strokeDasharray={isLocus ? "none" : "3 3"}
                      />

                      {/* Corner Targeting Reticles */}
                      <line
                        x1={box.x - 4}
                        y1={box.y}
                        x2={box.x + 8}
                        y2={box.y}
                        stroke={strokeColor}
                        strokeWidth="2.5"
                      />
                      <line
                        x1={box.x}
                        y1={box.y - 4}
                        x2={box.x}
                        y2={box.y + 8}
                        stroke={strokeColor}
                        strokeWidth="2.5"
                      />
                      <line
                        x1={box.x + box.width - 8}
                        y1={box.y}
                        x2={box.x + box.width + 4}
                        y2={box.y}
                        stroke={strokeColor}
                        strokeWidth="2.5"
                      />
                      <line
                        x1={box.x + box.width}
                        y1={box.y - 4}
                        x2={box.x + box.width}
                        y2={box.y + 8}
                        stroke={strokeColor}
                        strokeWidth="2.5"
                      />

                      {/* Header Badge */}
                      <g
                        transform={`translate(${box.x}, ${Math.max(16, box.y - 6)})`}
                      >
                        <rect
                          x="0"
                          y="-14"
                          width={Math.min(box.width + 24, 250)}
                          height="16"
                          rx="3"
                          fill={strokeColor}
                        />
                        <text
                          x="4"
                          y="-2"
                          fill="#080c16"
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {box.label.slice(0, 32)}
                        </text>
                      </g>
                    </g>
                  );
                })}
            </svg>
          </div>
        )}

        {/* 3x Synchronized Loupe (active in SPLIT LOUPE view or hovering) */}
        <SynchronizedLoupe
          visible={viewMode === "LOUPE" || (isHovering && viewMode !== "QUAD")}
          x={loupePos.x}
          y={loupePos.y}
          originalImgSrc={original_image_b64}
          spectralImgSrc={
            viewMode !== "ORIGINAL" ? currentLayerImg : layer1.ela_b64
          }
          spectralLabel={
            viewMode !== "ORIGINAL" ? layerLabel : "ELA Heatmap Reference"
          }
          imgWidth={image_width}
          imgHeight={image_height}
        />

        {/* Bottom Floating Telemetry Badge */}
        <div className="absolute bottom-3 left-4 px-3 py-1.5 rounded-xl watermelon-glass border border-white/[0.08] text-[11px] font-mono text-slate-400 flex items-center space-x-3 pointer-events-none z-10 shadow-lg">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-watermelon-coral" />
            <span className="text-white font-semibold">{layerLabel}</span>
          </div>
          <span className="text-slate-600">|</span>
          <span>
            POS: ({pixelCoords.x}, {pixelCoords.y})
          </span>
          <span className="text-slate-600">|</span>
          <span>
            CANVAS: {image_width} × {image_height} px
          </span>
        </div>
      </div>
    </div>
  );
};
