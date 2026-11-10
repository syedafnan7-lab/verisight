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
      <div className="w-96 border-l border-[#efebce]/10 watermelon-glass p-6 flex flex-col items-center justify-center text-center text-[#a3a380]">
        <Layers className="w-8 h-8 mb-3 text-[#a3a380]/60 stroke-[1.5]" />
        <span className="text-xs font-mono tracking-wider uppercase font-semibold text-[#efebce]">
          No Evidence Dossier
        </span>
        <span className="text-[11px] text-[#a3a380]/60 mt-1">
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
    ? "#a3a380" // dry-sage
    : isSuspicious
      ? "#d6ce93" // vanilla-custard
      : "#bb8588"; // dusty-rose

  const copyHash = () => {
    navigator.clipboard.writeText(file_sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <aside className="w-96 border-l border-[#efebce]/10 watermelon-glass flex flex-col h-full overflow-hidden text-xs select-text">
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-[#efebce]/10 flex items-center justify-between bg-[#0c0e12]/80">
        <div className="flex items-center space-x-2">
          <Fingerprint className="w-4 h-4 text-[#d8a48f]" />
          <span className="font-bold text-[#efebce] tracking-wide uppercase font-mono text-[11px]">
            Risk Dossier
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#a3a380] bg-[#a3a380]/15 border border-[#a3a380]/30 px-2 py-0.5 rounded-full font-semibold">
          EVIDENCE CHAIN
        </span>
      </div>

      {/* Tab Selector */}
      <div className="flex border-b border-[#efebce]/10 bg-[#0c0e12]/60 p-1 text-[11px] font-mono">
        <button
          onClick={() => setActiveTab("OVERVIEW")}
          className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
            activeTab === "OVERVIEW"
              ? "bg-[#efebce] text-[#0c0e12] font-bold shadow-sm"
              : "text-[#a3a380] hover:text-[#efebce]"
          }`}
        >
          Scoring
        </button>
        <button
          onClick={() => setActiveTab("FINDINGS")}
          className={`flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center space-x-1 ${
            activeTab === "FINDINGS"
              ? "bg-[#efebce] text-[#0c0e12] font-bold shadow-sm"
              : "text-[#a3a380] hover:text-[#efebce]"
          }`}
        >
          <span>Findings</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#161a22] border border-[#efebce]/10">
            {findings.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("SPECS")}
          className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
            activeTab === "SPECS"
              ? "bg-[#efebce] text-[#0c0e12] font-bold shadow-sm"
              : "text-[#a3a380] hover:text-[#efebce]"
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
                    className="stroke-[#161a22]"
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
                    className="transition-all duration-1000 ease-out"
                    style={{
                      filter: `drop-shadow(0 0 6px ${gaugeColor}88)`,
                    }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold font-mono text-[#efebce]">
                    {overall_tamper_score.toFixed(1)}%
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#a3a380]">
                    Tamper Risk
                  </span>
                </div>
              </div>

              {/* Verdict Banner */}
              <div className="mt-3 flex flex-col items-center w-full">
                <div
                  className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider flex items-center space-x-1.5 border"
                  style={{
                    backgroundColor: `${gaugeColor}18`,
                    borderColor: `${gaugeColor}40`,
                    color: gaugeColor,
                  }}
                >
                  {isAuthentic ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#a3a380]" />
                  ) : isSuspicious ? (
                    <AlertCircle className="w-3.5 h-3.5 text-[#d6ce93]" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-[#bb8588]" />
                  )}
                  <span>{verdict.replace(/_/g, " ")}</span>
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-[#a3a380] mt-1.5">
                  <span>Confidence: {confidence_score.toFixed(1)}%</span>
                  <span>•</span>
                  <span className="truncate max-w-[160px] font-mono text-[#d6ce93]">
                    {channel_detected}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Cross-Layer Spatial Synergy Banner */}
            {synergy.synergy_multiplier_applied && (
              <div className="watermelon-glass-card border-[#d6ce93]/40 rounded-xl p-3 bg-gradient-to-r from-[#d6ce93]/10 to-transparent">
                <div className="flex items-center justify-between text-[#d6ce93] font-semibold mb-1">
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#d6ce93]" />
                    <span className="text-xs">Spatial IoU Synergy</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-[#d6ce93]/20 text-[#d6ce93] font-mono text-[10px]">
                    x{synergy.multiplier_factor} MULTIPLIER
                  </span>
                </div>
                <p className="text-[11px] text-[#efebce]/90 leading-relaxed">
                  {synergy.synergy_explanation}
                </p>
                {synergy.primary_forgery_locus && (
                  <button
                    onClick={() =>
                      onSelectLocus(synergy.primary_forgery_locus || null)
                    }
                    className="mt-2 w-full py-1 bg-[#d6ce93]/20 hover:bg-[#d6ce93]/30 text-[#d6ce93] rounded-lg font-mono text-[10px] flex items-center justify-center space-x-1.5 border border-[#d6ce93]/40 transition-colors"
                  >
                    <Target className="w-3 h-3" />
                    <span>Focus Primary Forgery Locus</span>
                  </button>
                )}
              </div>
            )}

            {/* 3. 4-Layer Forensic Scores Breakdown */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-[#a3a380] tracking-wider uppercase font-semibold">
                4-Layer Evidentiary Scoring
              </span>

              {/* Layer 1 */}
              <div className="watermelon-glass-card rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#efebce]">
                    Layer 1: Signal & Noise
                  </span>
                  <span className="font-mono text-xs font-bold text-[#a3a380]">
                    {layer1.layer_score.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-[#161a22] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#a3a380] rounded-full transition-all duration-700"
                    style={{ width: `${layer1.layer_score}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#a3a380] font-mono pt-0.5">
                  <span>ELA: {layer1.ela_score.toFixed(1)}%</span>
                  <span>db4: {layer1.wavelet_noise_score.toFixed(1)}%</span>
                  <span>Clones: {layer1.clone_count}</span>
                </div>
              </div>

              {/* Layer 2 */}
              <div className="watermelon-glass-card rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#efebce]">
                    Layer 2: Typography & Lasers
                  </span>
                  <span className="font-mono text-xs font-bold text-[#bb8588]">
                    {layer2.layer_score.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-[#161a22] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#bb8588] rounded-full transition-all duration-700"
                    style={{ width: `${layer2.layer_score}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#a3a380] font-mono pt-0.5">
                  <span>Drift: +{layer2.max_baseline_drift_px.toFixed(1)}px</span>
                  <span>ΔE: {layer2.max_delta_e.toFixed(1)}</span>
                  <span>Lasers: {layer2.lasers.length}</span>
                </div>
              </div>

              {/* Layer 3 */}
              <div className="watermelon-glass-card rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#efebce]">
                    Layer 3: Metadata & Protocol
                  </span>
                  <span className="font-mono text-xs font-bold text-[#d8a48f]">
                    {layer3.layer_score.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-[#161a22] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#d8a48f] rounded-full transition-all duration-700"
                    style={{ width: `${layer3.layer_score}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#a3a380] font-mono pt-0.5">
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
                  <span className="text-xs font-semibold text-[#efebce]">
                    Layer 4: Ensemble & Synergy
                  </span>
                  <span className="font-mono text-xs font-bold text-[#d6ce93]">
                    {layer4.layer_score.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-[#161a22] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#d6ce93] rounded-full transition-all duration-700"
                    style={{ width: `${layer4.layer_score}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#a3a380] font-mono pt-0.5">
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
            <span className="text-[11px] font-mono text-[#a3a380] tracking-wider uppercase font-semibold">
              Findings Catalog ({findings.length})
            </span>

            {findings.length === 0 ? (
              <div className="p-4 watermelon-glass-card rounded-xl text-center text-[#a3a380] font-mono text-[11px]">
                No tampering indicators identified. All layers verified authentic.
              </div>
            ) : (
              findings.map((f) => {
                const isCritical = f.severity === "CRITICAL";
                const isHigh = f.severity === "HIGH";

                const badgeColor = isCritical
                  ? "#bb8588"
                  : isHigh
                    ? "#d8a48f"
                    : "#d6ce93";

                return (
                  <div
                    key={f.id}
                    onClick={() => onSelectLocus(f.bounding_box || null)}
                    className="p-3 rounded-xl border transition-all cursor-pointer watermelon-glass-card hover:bg-white/[0.04]"
                    style={{
                      borderColor: isCritical ? "#bb858866" : isHigh ? "#d8a48f66" : "rgba(239, 235, 206, 0.1)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-[#efebce] truncate max-w-[190px]">
                        {f.title}
                      </span>
                      <span
                        className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border"
                        style={{
                          backgroundColor: `${badgeColor}20`,
                          borderColor: `${badgeColor}50`,
                          color: badgeColor,
                        }}
                      >
                        {f.severity}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#efebce]/80 leading-snug line-clamp-2">
                      {f.description}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-[#a3a380] border-t border-[#efebce]/10 pt-1.5">
                      <span>Layer {f.layer}</span>
                      <span className="text-[#d6ce93] font-semibold">
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
              <div className="text-[10px] text-[#a3a380] uppercase font-semibold">
                Cryptographic Digest
              </div>
              <div className="flex items-center justify-between text-[#efebce] bg-[#0c0e12]/80 p-2 rounded-lg border border-[#efebce]/10">
                <span className="truncate max-w-[200px]" title={file_sha256}>
                  {file_sha256}
                </span>
                <button
                  onClick={copyHash}
                  className="text-[#d8a48f] hover:text-[#efebce] p-1"
                  title="Copy SHA-256"
                >
                  {copiedHash ? (
                    <Check className="w-3.5 h-3.5 text-[#a3a380]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="watermelon-glass-card rounded-xl p-3.5 space-y-2 text-[11px] font-mono">
              <div className="text-[10px] text-[#a3a380] uppercase font-semibold">
                Device & Canvas Geometry
              </div>
              <div className="space-y-1.5 text-[#efebce]/90">
                <div className="flex justify-between">
                  <span className="text-[#a3a380]">Dimensions:</span>
                  <span>{image_width} × {image_height} px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a3a380]">Aspect Ratio:</span>
                  <span>{layer3.viewport_aspect_ratio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a3a380]">Native Viewport:</span>
                  <span>{layer3.is_non_native_viewport ? "MISMATCH" : "VERIFIED"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a3a380]">WhatsApp Laundered:</span>
                  <span>{layer3.is_whatsapp_laundered ? "YES" : "NO"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a3a380]">EXIF Stripped:</span>
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
