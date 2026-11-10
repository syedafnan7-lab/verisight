import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Layers,
  Activity,
  Waves,
  Copy,
  Split,
  Grid,
  Eye,
  ZoomIn,
  ZoomOut,
  Move,
  Maximize2,
  Minimize2,
  Crosshair,
  Sparkles,
  RotateCcw,
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
  onSelectLocus?: (box: BoundingBox | null) => void;
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
  onSelectLocus,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("ORIGINAL");
  const [showLasers, setShowLasers] = useState<boolean>(true);
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: 1280, height: 800 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mouseImageCoords, setMouseImageCoords] = useState<{ x: number; y: number } | null>(null);

  // Loupe tracking state
  const [loupePos, setLoupePos] = useState<{ x: number; y: number }>({
    x: 50,
    y: 50,
  });
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const panStartRef = useRef<{
    pointerId: number;
    clientX: number;
    clientY: number;
    scrollLeft: number;
    scrollTop: number;
  } | null>(null);

  // Viewport resize tracking
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const updateSize = () =>
      setViewportSize({ width: viewport.clientWidth, height: viewport.clientHeight });
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [Boolean(report)]);

  // Reset zoom on new report
  useEffect(() => {
    setZoom(1);
    if (viewportRef.current) {
      viewportRef.current.scrollLeft = 0;
      viewportRef.current.scrollTop = 0;
    }
  }, [report?.file_sha256]);

  // Center on selected locus when it changes
  useEffect(() => {
    if (!selectedLocus || !report || !viewportRef.current || !containerRef.current) return;
    const { image_width, image_height } = report;
    const availableWidth = Math.max(240, viewportSize.width - 32);
    const availableHeight = Math.max(240, viewportSize.height - 32);
    const fitScale = Math.min(
      availableWidth / image_width,
      availableHeight / image_height,
      1,
    );
    const scale = fitScale * Math.max(zoom, 1.5);
    if (zoom < 1.5) setZoom(1.5);

    // Calculate center of locus in scaled coordinates
    const locusCenterX = (selectedLocus.x + selectedLocus.width / 2) * scale;
    const locusCenterY = (selectedLocus.y + selectedLocus.height / 2) * scale;

    const viewport = viewportRef.current;
    viewport.scrollTo({
      left: locusCenterX - viewport.clientWidth / 2,
      top: locusCenterY - viewport.clientHeight / 2,
      behavior: "smooth",
    });
  }, [selectedLocus]);

  // Keyboard navigation shortcuts
  const clampZoom = useCallback((value: number) => Math.min(5, Math.max(0.5, Math.round(value * 100) / 100)), []);

  const toggleFullscreen = useCallback(() => {
    if (!rootRef.current) return;
    if (!document.fullscreenElement) {
      rootRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (e.key) {
        case "1":
          setViewMode("ORIGINAL");
          break;
        case "2":
          setViewMode("ELA");
          break;
        case "3":
          setViewMode("WAVELET");
          break;
        case "4":
          setViewMode("COPY_MOVE");
          break;
        case "5":
          setViewMode("LOUPE");
          break;
        case "6":
          setViewMode("QUAD");
          break;
        case "l":
        case "L":
          setShowLasers((prev) => !prev);
          break;
        case "b":
        case "B":
          setShowBoxes((prev) => !prev);
          break;
        case "g":
        case "G":
          setShowGrid((prev) => !prev);
          break;
        case "+":
        case "=":
          e.preventDefault();
          setZoom((current) => clampZoom(current + 0.25));
          break;
        case "-":
        case "_":
          e.preventDefault();
          setZoom((current) => clampZoom(current - 0.25));
          break;
        case "0":
          e.preventDefault();
          setZoom(1);
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "Escape":
          if (viewMode === "LOUPE") setViewMode("ORIGINAL");
          if (selectedLocus && onSelectLocus) onSelectLocus(null);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [clampZoom, toggleFullscreen, viewMode, selectedLocus, onSelectLocus]);

  // Fullscreen change listener
  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  if (!report) {
    return (
      <div className="flex min-h-[55dvh] w-full flex-col items-center justify-center bg-[#070b14] text-[#64748b] md:min-h-0 md:flex-1">
        <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/5 shadow-inner">
          <Layers className="h-8 w-8 text-sky-400 stroke-[1.5] animate-pulse" />
        </div>
        <p className="text-sm font-mono tracking-wider text-[#94a3b8] uppercase font-semibold">
          EVIDENCE WORKSPACE STANDBY
        </p>
        <p className="text-xs text-[#475569] mt-1 max-w-sm text-center">
          Upload screenshot evidence or select an investigation scenario to activate multi-spectral analysis.
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

  // Active channel image selection
  let currentLayerImg = original_image_b64;
  let layerLabel = "Original Evidence";
  let layerDescription = "Unmodified pixel capture as ingested";

  if (viewMode === "ELA") {
    currentLayerImg = layer1.ela_b64;
    layerLabel = "Error Level Analysis (Inferno)";
    layerDescription = "Differenced DCT high-frequency quantization artifact residuals";
  } else if (viewMode === "WAVELET") {
    currentLayerImg = layer1.wavelet_noise_b64;
    layerLabel = "Daubechies db4 Wavelet Noise";
    layerDescription = "Sub-band orthogonal wavelet filter (HL, LH, HH) high-pass noise";
  } else if (viewMode === "COPY_MOVE") {
    currentLayerImg = layer1.clone_b64;
    layerLabel = "ORB Copy-Move Vector Clones";
    layerDescription = "Oriented FAST and Rotated BRIEF affine duplicate displacement vectors";
  } else if (viewMode === "LOUPE") {
    layerLabel = "3x Split Inspection Loupe";
    layerDescription = "Synchronized dual-channel spatial comparison magnifying reticle";
  } else if (viewMode === "QUAD") {
    layerLabel = "Quad-Spectral Multi-Layer Matrix";
    layerDescription = "Simultaneous 4-quadrant cross-inspection matrix";
  }

  // Mouse move handler for synchronized loupe & coordinate tracking
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

    // Calculate actual image pixel coordinates
    const pxX = Math.round((xPct / 100) * image_width);
    const pxY = Math.round((yPct / 100) * image_height);
    setMouseImageCoords({ x: pxX, y: pxY });
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    setZoom((current) => clampZoom(current + (e.deltaY < 0 ? 0.2 : -0.2)));
  };

  const handlePanStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1 || e.button !== 0 || !viewportRef.current) return;
    if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("a")) return;
    panStartRef.current = {
      pointerId: e.pointerId,
      clientX: e.clientX,
      clientY: e.clientY,
      scrollLeft: viewportRef.current.scrollLeft,
      scrollTop: viewportRef.current.scrollTop,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsPanning(true);
    e.preventDefault();
  };

  const handlePanMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = panStartRef.current;
    const viewport = viewportRef.current;
    if (!start || !viewport || start.pointerId !== e.pointerId) return;
    viewport.scrollLeft = start.scrollLeft - (e.clientX - start.clientX);
    viewport.scrollTop = start.scrollTop - (e.clientY - start.clientY);
  };

  const handlePanEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (panStartRef.current?.pointerId !== e.pointerId) return;
    panStartRef.current = null;
    setIsPanning(false);
  };

  // Dimensions & scaling
  const availableWidth = Math.max(240, viewportSize.width - 32);
  const availableHeight = Math.max(240, viewportSize.height - 32);
  const quadWidth = Math.min(920, availableWidth, availableHeight * 0.95);
  const fitScale = Math.min(
    availableWidth / image_width,
    availableHeight / image_height,
    1,
  );
  const canvasWidth = Math.round(
    (viewMode === "QUAD" ? quadWidth : image_width * fitScale) * zoom,
  );
  const canvasHeight = Math.round(
    (viewMode === "QUAD" ? quadWidth * (10 / 9) : image_height * fitScale) * zoom,
  );

  return (
    <div
      ref={rootRef}
      className={`relative flex min-h-[500px] w-full flex-none flex-col overflow-hidden bg-[#070b14] select-none md:h-full md:min-h-0 md:flex-1 ${
        isFullscreen ? "h-screen w-screen z-50 fixed inset-0" : "h-[75dvh]"
      }`}
    >
      {/* =========================================================================
          STAGE 2 & 3: CATEGORIZED FORENSIC COMMAND TOOLBAR
          ========================================================================= */}
      <div className="flex w-full shrink-0 flex-col border-b border-[#1e293b] bg-[#090f1d] px-3 py-2 text-xs md:flex-row md:items-center md:justify-between md:px-4 md:py-2">
        {/* Left: Categorized Analysis & View Selection */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-3">
          {/* CATEGORY: EVIDENCE */}
          <div className="flex items-center space-x-1 border-r border-[#1e293b] pr-2.5">
            <span className="hidden font-mono text-[9px] uppercase tracking-wider text-[#64748b] lg:inline-block mr-1">
              Evidence:
            </span>
            <button
              onClick={() => setViewMode("ORIGINAL")}
              title="Shortcut: 1"
              className={`px-2.5 py-1.2 rounded-md font-medium text-[11px] flex items-center space-x-1.5 transition-all border ${
                viewMode === "ORIGINAL"
                  ? "bg-sky-600/90 text-white border-sky-400 shadow-sm shadow-sky-600/30"
                  : "bg-[#0b1220] text-[#94a3b8] border-[#1e293b] hover:text-[#f1f5f9] hover:bg-[#152033]"
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span>ORIGINAL</span>
              <kbd className="hidden xl:inline-block ml-1 font-mono text-[9px] text-[#64748b] bg-[#070b14] px-1 rounded border border-[#1e293b]">
                1
              </kbd>
            </button>
          </div>

          {/* CATEGORY: IMAGE ANALYSIS (PHYSICAL & NOISE) */}
          <div className="flex items-center space-x-1 border-r border-[#1e293b] pr-2.5">
            <span className="hidden font-mono text-[9px] uppercase tracking-wider text-[#64748b] lg:inline-block mr-1">
              Analysis:
            </span>
            <button
              onClick={() => setViewMode("ELA")}
              title="Shortcut: 2 — Error Level Analysis"
              className={`px-2.5 py-1.2 rounded-md font-medium text-[11px] flex items-center space-x-1.5 transition-all border ${
                viewMode === "ELA"
                  ? "bg-amber-600/90 text-white border-amber-400 shadow-sm shadow-amber-600/30"
                  : "bg-[#0b1220] text-[#94a3b8] border-[#1e293b] hover:text-[#f1f5f9] hover:bg-[#152033]"
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span>ELA HEATMAP</span>
              <kbd className="hidden xl:inline-block ml-1 font-mono text-[9px] text-[#64748b] bg-[#070b14] px-1 rounded border border-[#1e293b]">
                2
              </kbd>
            </button>

            <button
              onClick={() => setViewMode("WAVELET")}
              title="Shortcut: 3 — Daubechies db4 Wavelet Noise"
              className={`px-2.5 py-1.2 rounded-md font-medium text-[11px] flex items-center space-x-1.5 transition-all border ${
                viewMode === "WAVELET"
                  ? "bg-cyan-600/90 text-white border-cyan-400 shadow-sm shadow-cyan-600/30"
                  : "bg-[#0b1220] text-[#94a3b8] border-[#1e293b] hover:text-[#f1f5f9] hover:bg-[#152033]"
              }`}
            >
              <Waves className="w-3.5 h-3.5 text-cyan-400" />
              <span>WAVELET NOISE</span>
              <kbd className="hidden xl:inline-block ml-1 font-mono text-[9px] text-[#64748b] bg-[#070b14] px-1 rounded border border-[#1e293b]">
                3
              </kbd>
            </button>

            <button
              onClick={() => setViewMode("COPY_MOVE")}
              title="Shortcut: 4 — ORB Copy-Move Detection"
              className={`px-2.5 py-1.2 rounded-md font-medium text-[11px] flex items-center space-x-1.5 transition-all border ${
                viewMode === "COPY_MOVE"
                  ? "bg-pink-600/90 text-white border-pink-400 shadow-sm shadow-pink-600/30"
                  : "bg-[#0b1220] text-[#94a3b8] border-[#1e293b] hover:text-[#f1f5f9] hover:bg-[#152033]"
              }`}
            >
              <Copy className="w-3.5 h-3.5 text-pink-400" />
              <span>COPY-MOVE</span>
              <kbd className="hidden xl:inline-block ml-1 font-mono text-[9px] text-[#64748b] bg-[#070b14] px-1 rounded border border-[#1e293b]">
                4
              </kbd>
            </button>
          </div>

          {/* CATEGORY: COMPARISON */}
          <div className="flex items-center space-x-1">
            <span className="hidden font-mono text-[9px] uppercase tracking-wider text-[#64748b] lg:inline-block mr-1">
              Compare:
            </span>
            <button
              onClick={() => setViewMode("LOUPE")}
              title="Shortcut: 5 — 3x Split Loupe Comparison"
              className={`px-2.5 py-1.2 rounded-md font-medium text-[11px] flex items-center space-x-1.5 transition-all border ${
                viewMode === "LOUPE"
                  ? "bg-indigo-600/90 text-white border-indigo-400 shadow-sm shadow-indigo-600/30"
                  : "bg-[#0b1220] text-[#94a3b8] border-[#1e293b] hover:text-[#f1f5f9] hover:bg-[#152033]"
              }`}
            >
              <Split className="w-3.5 h-3.5 text-indigo-400" />
              <span>SPLIT LOUPE</span>
              <kbd className="hidden xl:inline-block ml-1 font-mono text-[9px] text-[#64748b] bg-[#070b14] px-1 rounded border border-[#1e293b]">
                5
              </kbd>
            </button>

            <button
              onClick={() => setViewMode("QUAD")}
              title="Shortcut: 6 — Quad-Spectral 2x2 Matrix"
              className={`px-2.5 py-1.2 rounded-md font-medium text-[11px] flex items-center space-x-1.5 transition-all border ${
                viewMode === "QUAD"
                  ? "bg-purple-600/90 text-white border-purple-400 shadow-sm shadow-purple-600/30"
                  : "bg-[#0b1220] text-[#94a3b8] border-[#1e293b] hover:text-[#f1f5f9] hover:bg-[#152033]"
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-purple-400" />
              <span>QUAD-SPECTRAL</span>
              <kbd className="hidden xl:inline-block ml-1 font-mono text-[9px] text-[#64748b] bg-[#070b14] px-1 rounded border border-[#1e293b]">
                6
              </kbd>
            </button>
          </div>
        </div>

        {/* Right: Overlays & Viewport Options */}
        <div className="flex items-center space-x-2 pt-2 md:pt-0">
          {/* Overlays Group */}
          <div className="flex items-center space-x-2 text-[11px] font-mono bg-[#070b14] p-1 rounded-lg border border-[#1e293b]">
            <label
              title="Toggle Subpixel Baseline Alignment Lasers (Shortcut: L)"
              className="flex items-center space-x-1.5 cursor-pointer px-1.5 py-0.5 rounded hover:bg-[#152033] text-[#94a3b8]"
            >
              <input
                type="checkbox"
                checked={showLasers}
                onChange={(e) => setShowLasers(e.target.checked)}
                className="rounded bg-[#1e293b] border-[#334155] text-sky-500 focus:ring-0 w-3 h-3"
              />
              <span className={showLasers ? "text-sky-400 font-semibold" : ""}>
                Lasers
              </span>
              <kbd className="hidden md:inline-block text-[9px] text-[#64748b]">L</kbd>
            </label>

            <label
              title="Toggle Anomaly Reticles & Locus Callouts (Shortcut: B)"
              className="flex items-center space-x-1.5 cursor-pointer px-1.5 py-0.5 rounded hover:bg-[#152033] text-[#94a3b8]"
            >
              <input
                type="checkbox"
                checked={showBoxes}
                onChange={(e) => setShowBoxes(e.target.checked)}
                className="rounded bg-[#1e293b] border-[#334155] text-rose-500 focus:ring-0 w-3 h-3"
              />
              <span className={showBoxes ? "text-rose-400 font-semibold" : ""}>
                Boxes
              </span>
              <kbd className="hidden md:inline-block text-[9px] text-[#64748b]">B</kbd>
            </label>

            <label
              title="Toggle Micro-Coordinate Grid (Shortcut: G)"
              className="flex items-center space-x-1.5 cursor-pointer px-1.5 py-0.5 rounded hover:bg-[#152033] text-[#94a3b8]"
            >
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                className="rounded bg-[#1e293b] border-[#334155] text-purple-500 focus:ring-0 w-3 h-3"
              />
              <span className={showGrid ? "text-purple-400 font-semibold" : ""}>
                Grid
              </span>
              <kbd className="hidden md:inline-block text-[9px] text-[#64748b]">G</kbd>
            </label>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
            className="p-1.5 rounded-lg border border-[#1e293b] bg-[#0b1220] hover:bg-[#152033] text-[#94a3b8] hover:text-white transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Subheader: Active Spectral Method & Technical Description */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#070b14]/90 border-b border-[#1e293b]/60 text-[11px] font-mono">
        <div className="flex items-center space-x-2 truncate">
          <span className="text-[#64748b] uppercase tracking-wider">Active Channel:</span>
          <span className="text-sky-300 font-semibold truncate">{layerLabel}</span>
          <span className="hidden md:inline-block text-[#475569]">•</span>
          <span className="hidden md:inline-block text-[#64748b] truncate">{layerDescription}</span>
        </div>

        {mouseImageCoords && (
          <div className="hidden sm:flex items-center space-x-2 text-[10px] text-[#64748b] shrink-0 font-mono">
            <Crosshair className="w-3 h-3 text-sky-400/80" />
            <span>
              X: <strong className="text-white">{mouseImageCoords.x}</strong> Y: <strong className="text-white">{mouseImageCoords.y}</strong>
            </span>
            <span>({image_width}×{image_height}px)</span>
          </div>
        )}
      </div>

      {/* =========================================================================
          STAGE 3: MAIN FORENSIC CANVAS AREA
          ========================================================================= */}
      <div
        ref={viewportRef}
        onWheel={handleWheel}
        onPointerDown={handlePanStart}
        onPointerMove={handlePanMove}
        onPointerUp={handlePanEnd}
        onPointerCancel={handlePanEnd}
        className="relative min-h-0 flex-1 touch-pan-x touch-pan-y overflow-auto p-2 md:p-4 bg-[#05080f]"
        aria-label="Zoomable and pannable forensic screenshot viewer"
      >
        <div
          className={`flex ${
            canvasWidth > availableWidth ? "justify-start" : "justify-center"
          } ${canvasHeight > availableHeight ? "items-start" : "items-center"}`}
          style={{
            width: Math.max(availableWidth, canvasWidth),
            height: Math.max(availableHeight, canvasHeight),
          }}
        >
          {viewMode === "QUAD" ? (
            /* 2x2 Synchronized Quad-Spectral Matrix */
            <div
              className="grid grid-cols-2 gap-3 aspect-[9/10] w-full"
              style={{ width: canvasWidth, height: canvasHeight }}
            >
              {/* Quad 1: Original */}
              <div
                onClick={() => setViewMode("ORIGINAL")}
                className="group flex flex-col bg-[#0b1120] border border-[#1e293b] rounded-lg overflow-hidden cursor-pointer hover:border-sky-500/60 transition-colors shadow-lg"
              >
                <div className="px-2.5 py-1.5 bg-[#070b14] border-b border-[#1e293b] flex items-center justify-between text-[10px] font-mono text-sky-400">
                  <span className="font-semibold tracking-wider">1. ORIGINAL EVIDENCE</span>
                  <Eye className="w-3 h-3 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 flex items-center justify-center p-2 bg-black/60">
                  <img
                    src={original_image_b64}
                    alt="Original Screenshot"
                    className="max-h-full object-contain rounded"
                  />
                </div>
              </div>

              {/* Quad 2: ELA */}
              <div
                onClick={() => setViewMode("ELA")}
                className="group flex flex-col bg-[#0b1120] border border-[#1e293b] rounded-lg overflow-hidden cursor-pointer hover:border-amber-500/60 transition-colors shadow-lg"
              >
                <div className="px-2.5 py-1.5 bg-[#070b14] border-b border-[#1e293b] flex items-center justify-between text-[10px] font-mono text-amber-400">
                  <span className="font-semibold tracking-wider">2. ERROR LEVEL ANALYSIS (INFERNO)</span>
                  <Activity className="w-3 h-3 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 flex items-center justify-center p-2 bg-black/60">
                  <img
                    src={layer1.ela_b64}
                    alt="ELA Heatmap"
                    className="max-h-full object-contain rounded"
                  />
                </div>
              </div>

              {/* Quad 3: Wavelet Noise */}
              <div
                onClick={() => setViewMode("WAVELET")}
                className="group flex flex-col bg-[#0b1120] border border-[#1e293b] rounded-lg overflow-hidden cursor-pointer hover:border-cyan-500/60 transition-colors shadow-lg"
              >
                <div className="px-2.5 py-1.5 bg-[#070b14] border-b border-[#1e293b] flex items-center justify-between text-[10px] font-mono text-cyan-400">
                  <span className="font-semibold tracking-wider">3. DAUBECHIES db4 WAVELET NOISE</span>
                  <Waves className="w-3 h-3 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 flex items-center justify-center p-2 bg-black/60">
                  <img
                    src={layer1.wavelet_noise_b64}
                    alt="Wavelet Noise Residual"
                    className="max-h-full object-contain rounded"
                  />
                </div>
              </div>

              {/* Quad 4: Copy-Move */}
              <div
                onClick={() => setViewMode("COPY_MOVE")}
                className="group flex flex-col bg-[#0b1120] border border-[#1e293b] rounded-lg overflow-hidden cursor-pointer hover:border-pink-500/60 transition-colors shadow-lg"
              >
                <div className="px-2.5 py-1.5 bg-[#070b14] border-b border-[#1e293b] flex items-center justify-between text-[10px] font-mono text-pink-400">
                  <span className="font-semibold tracking-wider">4. ORB COPY-MOVE CLONED VECTORS</span>
                  <Copy className="w-3 h-3 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 flex items-center justify-center p-2 bg-black/60">
                  <img
                    src={layer1.clone_b64}
                    alt="ORB Clone Keypoints"
                    className="max-h-full object-contain rounded"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Single High-Resolution Multi-Spectral Canvas with SVG Overlay */
            <div
              ref={containerRef}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => {
                setIsHovering(false);
                setMouseImageCoords(null);
              }}
              onMouseMove={handleMouseMove}
              className="relative max-h-full flex items-center justify-center rounded-lg overflow-hidden shadow-2xl border border-[#1e293b] bg-black"
              style={{
                width: canvasWidth,
                height: canvasHeight,
                aspectRatio: `${image_width} / ${image_height}`,
                cursor: zoom > 1 ? (isPanning ? "grabbing" : "grab") : "crosshair",
              }}
            >
              {/* Base Image */}
              <img
                src={currentLayerImg}
                alt="Forensic Channel View"
                className="w-full h-full object-contain select-none pointer-events-none"
              />

              {/* Coordinate Grid Overlay */}
              {showGrid && (
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />
              )}

              {/* Interactive SVG Reticles (Lasers & Anomaly Boxes) */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox={`0 0 ${image_width} ${image_height}`}
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Layer 2: Sub-pixel Horizontal Baseline Lasers */}
                {showLasers &&
                  layer2.lasers.map((laser: BaselineLaser, idx: number) => {
                    const hasAlignmentCue = laser.is_tampered;
                    const x1 = laser.x_start ?? 40;
                    const x2 = laser.x_end ?? image_width - 40;
                    const y = laser.y_baseline;

                    return (
                      <g key={`laser-${idx}`}>
                        <line
                          x1={x1}
                          y1={y}
                          x2={x2}
                          y2={y}
                          stroke={hasAlignmentCue ? "#f43f5e" : "#38bdf8"}
                          strokeWidth={hasAlignmentCue ? "2.5" : "1.2"}
                          strokeDasharray={hasAlignmentCue ? "none" : "4 3"}
                          className={hasAlignmentCue ? "laser-critical" : "laser-aligned"}
                        />
                        <circle
                          cx={x1}
                          cy={y}
                          r={hasAlignmentCue ? 4 : 2.5}
                          fill={hasAlignmentCue ? "#f43f5e" : "#38bdf8"}
                        />
                        {hasAlignmentCue && laser.callout_text && (
                          <g transform={`translate(${x2 + 8}, ${y - 8})`}>
                            <rect
                              x="0"
                              y="0"
                              width="120"
                              height="18"
                              rx="3"
                              fill="#f43f5e"
                              stroke="#ffffff"
                              strokeWidth="0.5"
                            />
                            <text
                              x="6"
                              y="13"
                              fill="#ffffff"
                              fontSize="10"
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
                  all_bounding_boxes.map((box: BoundingBox, bIdx: number) => {
                    const isLocus =
                      box.anomaly_type === "CROSS_LAYER_SYNERGY_LOCUS";
                    const isSelected =
                      selectedLocus &&
                      selectedLocus.x === box.x &&
                      selectedLocus.y === box.y;

                    const strokeColor = isLocus
                      ? "#f59e0b"
                      : isSelected
                      ? "#38bdf8"
                      : box.layer === 1
                      ? "#ec4899"
                      : box.layer === 2
                      ? "#f43f5e"
                      : "#38bdf8";

                    return (
                      <g
                        key={`bbox-${bIdx}`}
                        className="pointer-events-auto cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectLocus) {
                            onSelectLocus(isSelected ? null : box);
                          }
                        }}
                      >
                        {/* Box Highlight Fill */}
                        <rect
                          x={box.x}
                          y={box.y}
                          width={box.width}
                          height={box.height}
                          fill={
                            isSelected
                              ? "rgba(56, 189, 248, 0.22)"
                              : isLocus
                              ? "rgba(245, 158, 11, 0.16)"
                              : "rgba(244, 63, 94, 0.08)"
                          }
                          stroke={strokeColor}
                          strokeWidth={isSelected || isLocus ? "3" : "1.8"}
                          strokeDasharray={isSelected || isLocus ? "none" : "3 3"}
                        />

                        {/* Corner Reticles */}
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

                        {/* Callout Header Badge */}
                        <g transform={`translate(${box.x}, ${Math.max(16, box.y - 6)})`}>
                          <rect
                            x="0"
                            y="-14"
                            width={Math.min(box.width + 24, 250)}
                            height="16"
                            rx="2"
                            fill={strokeColor}
                          />
                          <text
                            x="5"
                            y="-2"
                            fill="#070b14"
                            fontSize="10"
                            fontWeight="bold"
                            fontFamily="monospace"
                          >
                            {box.label.slice(0, 30)}
                          </text>
                        </g>

                        {/* Selection pulse ring if active */}
                        {isSelected && (
                          <rect
                            x={box.x - 4}
                            y={box.y - 4}
                            width={box.width + 8}
                            height={box.height + 8}
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="1.5"
                            strokeDasharray="4 2"
                            className="animate-pulse"
                          />
                        )}
                      </g>
                    );
                  })}
              </svg>
            </div>
          )}

          {/* 3x Synchronized Inspection Loupe */}
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
        </div>
      </div>

      {/* =========================================================================
          VIEWPORT FLOATING DOCK (ZOOM, FIT, ACTUAL, CONTROLS)
          ========================================================================= */}
      <div className="absolute bottom-5 left-5 z-40 flex items-center gap-1 rounded-xl border border-[#334155] bg-[#070b14]/95 p-1.5 shadow-2xl backdrop-blur-md">
        {/* Zoom Out */}
        <button
          type="button"
          onClick={() => setZoom((current) => clampZoom(current - 0.25))}
          disabled={zoom <= 0.5}
          title="Zoom out (Shortcut: -)"
          aria-label="Zoom out"
          className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ZoomOut className="h-4 w-4" />
        </button>

        {/* Zoom Indicator */}
        <span
          className="min-w-14 text-center font-mono text-xs text-sky-400 font-semibold"
          aria-live="polite"
        >
          {Math.round(zoom * 100)}%
        </span>

        {/* Zoom In */}
        <button
          type="button"
          onClick={() => setZoom((current) => clampZoom(current + 0.25))}
          disabled={zoom >= 5}
          title="Zoom in (Shortcut: +)"
          aria-label="Zoom in"
          className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ZoomIn className="h-4 w-4" />
        </button>

        <span className="mx-1 h-5 w-px bg-slate-700" />

        {/* Fit to View */}
        <button
          type="button"
          onClick={() => setZoom(1)}
          title="Fit screenshot to screen (Shortcut: 0)"
          aria-label="Fit screenshot to view"
          className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs transition-colors ${
            zoom === 1 ? "bg-slate-800 text-sky-300 font-semibold" : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          <Maximize2 className="h-3.5 w-3.5" />
          <span>Fit</span>
        </button>

        {/* 100% Actual Size */}
        <button
          type="button"
          onClick={() => {
            const actualScale = 1 / fitScale;
            setZoom(clampZoom(actualScale));
          }}
          title="100% Native Resolution 1:1"
          aria-label="100% 1:1 Actual size"
          className="hidden sm:flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
        >
          <Crosshair className="h-3.5 w-3.5" />
          <span>1:1</span>
        </button>

        <span className="mx-1 h-5 w-px bg-slate-700" />

        {/* Pan Helper Hint */}
        <span className="hidden items-center gap-1 pl-1.5 pr-2 text-[10px] text-slate-400 lg:flex">
          <Move className="h-3 w-3" /> Drag to pan
        </span>
      </div>

      {/* Floating Shortcut Hint */}
      {!isPanning && zoom === 1 && (
        <span className="pointer-events-none absolute bottom-6 right-5 z-30 hidden text-[11px] font-mono text-slate-500 xl:block bg-[#070b14]/80 px-2 py-1 rounded border border-[#1e293b]">
          Ctrl/⌘ + scroll to zoom · 1-6 channels · L lasers · B boxes
        </span>
      )}
    </div>
  );
};