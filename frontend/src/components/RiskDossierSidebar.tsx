import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Sparkles,
  Fingerprint,
  Smartphone,
  Clock,
  Key,
  ShieldCheck,
  Zap,
  Target,
  FileSearch,
  SlidersHorizontal,
} from "lucide-react";
import { ForensicAnalysisReport, BoundingBox } from "../types/forensic";

interface RiskDossierSidebarProps {
  report: ForensicAnalysisReport | null;
  selectedLocus: BoundingBox | null;
  onSelectLocus: (box: BoundingBox | null) => void;
}

export const RiskDossierSidebar: React.FC<RiskDossierSidebarProps> = ({
  report,
  selectedLocus,
  onSelectLocus,
}) => {
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "FINDINGS" | "SPECS">("OVERVIEW");
  const [copiedHash, setCopiedHash] = useState(false);

  if (!report) {
    return (
      <div className="w-96 border-l border-white/[0.08] watermelon-glass p-6 flex flex-col items-center justify-center text-center text-slate-500">
        <Layers className="w-8 h-8 mb-3 text-slate-600 stroke-[1.5]" />
        <span className="text-xs font-mono tracking-wider uppercase font-semibold text-slate-400">
          No Evidence Dossier
        </span>
        <span className="text-[11px] text-slate-600 mt-1">
          Select or drop a screenshot
        </span>
      </div>
    );
  }

  const {
    overall_tamper_score,
    confidence_score,
    verdict,
    file_sha256,
    image_width,
    image_height,
    channel_detected,
    layer1,
    layer2,
    layer3,
    layer4,
    synergy,
    findings,
  } = report;

  const isAuthentic = verdict === "AUTHENTIC_VERIFIED";
  const isSuspicious = verdict === "SUSPICIOUS_ANOMALIES";
  const isManipulated = verdict === "MANIPULATED_FORGERY";

  // Circular gauge calculations
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (overall_tamper_score / 100) * circumference;

  const gaugeColor = isAuthentic
    ? "#10b981"
    : isSuspicious
      ? "#f59e0b"
      : "#f43f5e";

  const copyHash = () => {
    navigator.clipboard.writeText(file_sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <aside className="w-96 border-l border-white/[0.08] watermelon-glass flex flex-col h-full overflow-hidden text-xs select-text">
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-white/[0.08] flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center space-x-2">
          <Fingerprint className="w-4 h-4 text-watermelon-coral" />
          <span className="font-bold text-white tracking-wide uppercase font-mono text-[11px]">
            Risk Dossier
          </span>
        </div>
        <span className="font-mono text-[10px] text-watermelon-emerald bg-watermelon-emerald/10 border border-watermelon-emerald/30 px-2 py-0.5 rounded-full font-semibold">
          EVIDENCE CHAIN
        </span>
      </div>

      {/* Tab Selector */}
      <div className="flex border-b border-white/[0.08] bg-slate-950/40 p-1 text-[11px] font-mono">
        <button
          onClick={() => setActiveTab("OVERVIEW")}
          className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
            activeTab === "OVERVIEW"
              ? "bg-slate-800 text-white font-bold shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Scoring
        </button>
        <button
          onClick={() => setActiveTab("FINDINGS")}
          className={`flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center space-x-1 ${
            activeTab === "FINDINGS"
              ? "bg-slate-800 text-white font-bold shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>Findings</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900 border border-white/10">
            {findings.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("SPECS")}
          className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
            activeTab === "SPECS"
              ? "bg-slate-800 text-white font-bold shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Specs
        </button>
      </div>

      {/* Tabbed Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === "OVERVIEW" && (
          <>
            {/* 1. Master Gauge Card */}
            <div className="watermelon-glass-card rounded-2xl p-4 flex flex-col items-center relative overflow-hidden">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    className="stroke-slate-800/80"
                    strokeWidth="10"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke={gaugeColor}
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out filter drop-shadow-[0_0_6px_rgba(244,63,94,0.3)]"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold font-mono text-white">
                    {overall_tamper_score.toFixed(1)}%
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400">
                    Tamper Risk
                  </span>
                </div>
              </div>

              {/* Verdict Banner */}
              <div className="mt-3 flex flex-col items-center w-full">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider flex items-center space-x-1.5 border ${
                    isAuthentic
                      ? "bg-watermelon-emerald/15 text-watermelon-mint border-watermelon-emerald/40"
                      : isSuspicious
                        ? "bg-amber-950/70 text-amber-300 border-amber-600/50"
                        : "bg-watermelon-coral/15 text-watermelon-rose border-watermelon-coral/40"
                  }`}
                >
                  {isAuthentic ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-watermelon-emerald" />
                  ) : isSuspicious ? (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-watermelon-coral" />
                  )}
                  <span>{verdict.replace(/_/g, " ")}</span>
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-1.5">
                  <span>Confidence: {confidence_score.toFixed(1)}%</span>
                  <span>•</span>
                  <span className="truncate max-w-[160px] font-mono">
                    {channel_detected}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Cross-Layer Spatial Synergy Banner */}
            {synergy.synergy_multiplier_applied && (
              <div className="watermelon-glass-card border-amber-500/40 rounded-xl p-3 bg-gradient-to-r from-amber-950/30 to-amber-900/10">
                <div className="flex items-center justify-between text-amber-300 font-semibold mb-1">
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                    <span className="text-xs">Spatial IoU Synergy</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-300 font-mono text-[10px]">
                    x{synergy.multiplier_factor} MULTIPLIER
                  </span>
                </div>
                <p className="text-[11px] text-amber-200/80 leading-relaxed">
                  {synergy.synergy_explanation}
                </p>
                {synergy.primary_forgery_locus && (
                  <button
                    onClick={() =>
                      onSelectLocus(synergy.primary_forgery_locus || null)
                    }
                    className="mt-2 w-full py-1 bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 rounded-lg font-mono text-[10px] flex items-center justify-center space-x-1.5 border border-amber-500/40 transition-colors"
                  >
                    <Target className="w-3 h-3" />
                    <span>Focus Primary Forgery Locus</span>
                  </button>
                )}
              </div>
            )}

            {/* 3. 4-Layer Forensic Scores Breakdown */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-slate-400 tracking-wider uppercase font-semibold">
                4-Layer Evidentiary Scoring
              </span>

              {/* Layer 1 */}
              <div className="watermelon-glass-card rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">
                    Layer 1: Signal & Noise
                  </span>
                  <span className="font-mono text-xs font-bold text-sky-400">
                    {layer1.layer_score.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-700"
                    style={{ width: `${layer1.layer_score}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                  <span>ELA: {layer1.ela_score.toFixed(1)}%</span>
                  <span>db4: {layer1.wavelet_noise_score.toFixed(1)}%</span>
                  <span>Clones: {layer1.clone_count}</span>
                </div>
              </div>

              {/* Layer 2 */}
              <div className="watermelon-glass-card rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">
                    Layer 2: Typography & Lasers
                  </span>
                  <span className="font-mono text-xs font-bold text-watermelon-coral">
                    {layer2.layer_score.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-watermelon-coral rounded-full transition-all duration-700"
                    style={{ width: `${layer2.layer_score}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                  <span>Drift: +{layer2.max_baseline_drift_px.toFixed(1)}px</span>
                  <span>ΔE: {layer2.max_delta_e.toFixed(1)}</span>
                  <span>Lasers: {layer2.lasers.length}</span>
                </div>
              </div>

              {/* Layer 3 */}
              <div className="watermelon-glass-card rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">
                    Layer 3: Metadata & Protocol
                  </span>
                  <span className="font-mono text-xs font-bold text-watermelon-purple">
                    {layer3.layer_score.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-watermelon-purple rounded-full transition-all duration-700"
                    style={{ width: `${layer3.layer_score}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                  <span>Ratio: {layer3.viewport_aspect_ratio.split(" ")[0]}</span>
                  <span>
                    Clock: {layer3.clock_paradox_detected ? "PARADOX" : "OK"}
                  </span>
                  <span>
                    UTR: {layer3.upi_utr_valid === false ? "INVALID" : "VALID"}
                  </span>
                </div>
              </div>

              {/* Layer 4 */}
              <div className="watermelon-glass-card rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">
                    Layer 4: Ensemble & Synergy
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-400">
                    {layer4.layer_score.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-700"
                    style={{ width: `${layer4.layer_score}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                  <span>
                    Synergy:{" "}
                    {synergy.synergy_multiplier_applied ? "ACTIVE" : "NONE"}
                  </span>
                  <span>
                    VLM: {layer4.vlm_used ? layer4.vlm_provider : "OFFLINE OPT"}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "FINDINGS" && (
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-slate-400 tracking-wider uppercase font-semibold">
              Findings Catalog ({findings.length})
            </span>

            {findings.length === 0 ? (
              <div className="p-4 watermelon-glass-card rounded-xl text-center text-slate-500 font-mono text-[11px]">
                No tampering indicators identified. All layers verified authentic.
              </div>
            ) : (
              findings.map((f) => {
                const isCritical = f.severity === "CRITICAL";
                const isHigh = f.severity === "HIGH";

                return (
                  <div
                    key={f.id}
                    onClick={() => onSelectLocus(f.bounding_box || null)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isCritical
                        ? "bg-watermelon-darkrose/20 border-watermelon-coral/60 hover:bg-watermelon-darkrose/30"
                        : isHigh
                          ? "bg-amber-950/20 border-amber-600/60 hover:bg-amber-950/30"
                          : "watermelon-glass-card hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-white truncate max-w-[190px]">
                        {f.title}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isCritical
                            ? "bg-watermelon-darkrose text-watermelon-rose"
                            : isHigh
                              ? "bg-amber-900 text-amber-200"
                              : "bg-sky-900 text-sky-200"
                        }`}
                      >
                        {f.severity}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                      {f.description}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-white/[0.04] pt-1.5">
                      <span>Layer {f.layer}</span>
                      <span className="text-sky-400 font-semibold">
                        {f.metric_name}: {f.metric_value}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === "SPECS" && (
          <div className="space-y-3">
            <div className="watermelon-glass-card rounded-xl p-3.5 space-y-2 text-[11px] font-mono">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">
                Cryptographic Digest
              </div>
              <div className="flex items-center justify-between text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-white/[0.05]">
                <span className="truncate max-w-[200px]" title={file_sha256}>
                  {file_sha256}
                </span>
                <button
                  onClick={copyHash}
                  className="text-watermelon-coral hover:text-white p-1"
                  title="Copy SHA-256"
                >
                  {copiedHash ? (
                    <Check className="w-3.5 h-3.5 text-watermelon-emerald" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="watermelon-glass-card rounded-xl p-3.5 space-y-2 text-[11px] font-mono">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">
                Device & Canvas Geometry
              </div>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Dimensions:</span>
                  <span>{image_width} × {image_height} px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Aspect Ratio:</span>
                  <span>{layer3.viewport_aspect_ratio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Native Viewport:</span>
                  <span>{layer3.is_non_native_viewport ? "MISMATCH" : "VERIFIED"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">WhatsApp Laundered:</span>
                  <span>{layer3.is_whatsapp_laundered ? "YES" : "NO"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">EXIF Stripped:</span>
                  <span>{layer3.exif_stripped ? "YES" : "NO"}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
