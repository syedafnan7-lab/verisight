import React, { useState } from "react";
import {
  X,
  Share2,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Info,
  Check,
  Zap,
} from "lucide-react";
import {
  WhatsAppSimulationResponse,
  ForensicAnalysisReport,
} from "../types/forensic";

interface WhatsAppSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulationData: WhatsAppSimulationResponse | null;
  isLoading: boolean;
  onApplyLaunderedImage: (report: ForensicAnalysisReport) => void;
}

export const WhatsAppSimulatorModal: React.FC<WhatsAppSimulatorModalProps> = ({
  isOpen,
  onClose,
  simulationData,
  isLoading,
  onApplyLaunderedImage,
}) => {
  const [activeTab, setActiveTab] = useState<"SIDE_BY_SIDE" | "DIFF_HEATMAP">(
    "SIDE_BY_SIDE",
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="watermelon-glass border border-white/[0.1] rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Modal Header */}
        <div className="h-16 px-6 border-b border-white/[0.08] bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-watermelon-emerald/15 border border-watermelon-emerald/40 flex items-center justify-center">
              <Share2 className="w-4 h-4 text-watermelon-mint" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white tracking-wide flex items-center space-x-2">
                <span>Educational WhatsApp Laundering Simulator</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-watermelon-emerald/10 text-watermelon-mint border border-watermelon-emerald/30">
                  4:2:0 CHROMA TEST
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Inspects EXIF/ICC metadata stripping and tests typographic laser & wavelet survival
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="h-80 flex flex-col items-center justify-center space-y-3 text-slate-400">
              <div className="w-10 h-10 border-3 border-watermelon-emerald border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-mono text-slate-300">
                Simulating WhatsApp 4:2:0 Chroma Subsampling & EXIF Stripping...
              </p>
            </div>
          ) : !simulationData ? (
            <div className="h-80 flex flex-col items-center justify-center text-slate-500 font-mono text-xs">
              No simulation data available. Please re-run simulation from the workbench.
            </div>
          ) : (
            <>
              {/* Top Stats Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                <div className="watermelon-glass-card rounded-2xl p-4">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                    Original File Size
                  </span>
                  <div className="text-lg font-bold font-mono text-white mt-1">
                    {(simulationData.original_size_bytes / 1024).toFixed(1)} KB
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Lossless Raw Capture
                  </span>
                </div>

                <div className="watermelon-glass-card rounded-2xl p-4 border-watermelon-emerald/30">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                    Laundered Size
                  </span>
                  <div className="text-lg font-bold font-mono text-watermelon-mint mt-1">
                    {(simulationData.simulated_size_bytes / 1024).toFixed(1)} KB
                  </div>
                  <span className="text-[10px] text-watermelon-mint font-mono font-semibold">
                    -
                    {Math.round(
                      (1 -
                        simulationData.simulated_size_bytes /
                          simulationData.original_size_bytes) *
                        100,
                    )}
                    % Data Stripped
                  </span>
                </div>

                <div className="watermelon-glass-card rounded-2xl p-4">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                    Compression Factor
                  </span>
                  <div className="text-lg font-bold font-mono text-sky-400 mt-1">
                    {simulationData.compression_ratio}x
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Standard JPEG Q=77
                  </span>
                </div>

                <div className="watermelon-glass-card rounded-2xl p-4 border-watermelon-coral/30">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                    Surviving Verdict
                  </span>
                  <div className="text-lg font-bold font-mono text-watermelon-rose mt-1 truncate">
                    {simulationData.reanalysis.verdict.replace(/_/g, " ")}
                  </div>
                  <span className="text-[10px] text-watermelon-rose font-mono font-semibold">
                    Score: {simulationData.reanalysis.overall_tamper_score.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center space-x-2 border-b border-white/[0.08] pb-3">
                <button
                  onClick={() => setActiveTab("SIDE_BY_SIDE")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === "SIDE_BY_SIDE"
                      ? "bg-watermelon-emerald/20 text-watermelon-mint border border-watermelon-emerald/40 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Side-by-Side Comparison
                </button>
                <button
                  onClick={() => setActiveTab("DIFF_HEATMAP")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === "DIFF_HEATMAP"
                      ? "bg-watermelon-emerald/20 text-watermelon-mint border border-watermelon-emerald/40 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Quantization Difference Heatmap
                </button>
              </div>

              {/* Image Previews */}
              {activeTab === "SIDE_BY_SIDE" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-96">
                  <div className="watermelon-glass-card rounded-2xl p-3 flex flex-col items-center justify-center">
                    <span className="text-[11px] font-mono text-slate-400 font-semibold mb-2">
                      BEFORE (ORIGINAL EVIDENCE)
                    </span>
                    <img
                      src={simulationData.reanalysis.original_image_b64}
                      alt="Before"
                      className="max-h-80 object-contain rounded-xl border border-white/[0.06]"
                    />
                  </div>

                  <div className="watermelon-glass-card rounded-2xl p-3 flex flex-col items-center justify-center border-watermelon-emerald/30">
                    <span className="text-[11px] font-mono text-watermelon-mint font-semibold mb-2">
                      AFTER (WHATSAPP LAUNDERED)
                    </span>
                    <img
                      src={simulationData.simulated_image_b64}
                      alt="After"
                      className="max-h-80 object-contain rounded-xl border border-white/[0.06]"
                    />
                  </div>
                </div>
              ) : (
                <div className="watermelon-glass-card rounded-2xl p-4 flex flex-col items-center justify-center h-96">
                  <span className="text-[11px] font-mono text-amber-300 font-semibold mb-2">
                    ABSOLUTE PIXEL DIFFERENCE (AMPLIFIED 12X — JET COLORMAP)
                  </span>
                  <img
                    src={simulationData.diff_heatmap_b64}
                    alt="Difference Heatmap"
                    className="max-h-80 object-contain rounded-xl border border-white/[0.06]"
                  />
                </div>
              )}

              {/* Educational Forensic Note */}
              <div className="watermelon-glass-card border-watermelon-emerald/30 rounded-2xl p-4 flex items-start space-x-3.5 text-xs bg-gradient-to-r from-watermelon-rind/20 to-transparent">
                <Info className="w-5 h-5 text-watermelon-emerald shrink-0 mt-0.5" />
                <div className="space-y-1 text-slate-300">
                  <span className="font-bold text-watermelon-mint">
                    Why does VeriSight still catch forgeries after WhatsApp laundering?
                  </span>
                  <p className="leading-relaxed text-slate-400">
                    Social media platforms strip EXIF metadata and quantize DCT high frequencies, which often defeats basic camera PRNU checks. However,{" "}
                    <strong className="text-slate-200">Layer 2 Sub-Pixel Typographic Baselines</strong> and{" "}
                    <strong className="text-slate-200">
                      Layer 1 Daubechies db4 Wavelet Noise Boundaries
                    </strong>{" "}
                    are structurally geometric: the pixel shifts and off-color card halos survive 4:2:0 subsampling, allowing VeriSight to confidently detect manipulation even on forwarded images.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="h-16 px-6 border-t border-white/[0.08] bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            HackStellar PS-12 // Educational Module
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 transition-all"
            >
              Close
            </button>
            {simulationData && (
              <button
                onClick={() => {
                  onApplyLaunderedImage(simulationData.reanalysis);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-watermelon-emerald to-emerald-600 hover:from-watermelon-mint hover:to-watermelon-emerald text-xs font-semibold text-white transition-all flex items-center space-x-2 shadow-lg shadow-watermelon-emerald/25"
              >
                <Check className="w-4 h-4" />
                <span>Load in Active Workbench</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
