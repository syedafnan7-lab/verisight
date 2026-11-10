import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Layers,
  Activity,
  Waves,
  ScanText,
  Smartphone,
  Clock,
  KeyRound,
  FileCheck2,
  Share2,
  FileText,
  Target,
  ArrowRight,
  Maximize2,
  Eye,
  Crosshair,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { ForensicAnalysisReport, BoundingBox } from "../types/forensic";

interface BentoCaseDashboardProps {
  report: ForensicAnalysisReport | null;
  onSwitchToInspector: (locus?: BoundingBox) => void;
  onOpenWhatsAppModal: () => void;
  onOpenReportModal: () => void;
  onOpenMobileModal: () => void;
}

export const BentoCaseDashboard: React.FC<BentoCaseDashboardProps> = ({
  report,
  onSwitchToInspector,
  onOpenWhatsAppModal,
  onOpenReportModal,
  onOpenMobileModal,
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [findingsFilter, setFindingsFilter] = useState<
    "ALL" | "CRITICAL" | "HIGH" | "MEDIUM" | "INFO"
  >("ALL");

  if (!report) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#a3a380]">
        <div className="w-16 h-16 rounded-2xl bg-[#161a22] border border-[#efebce]/10 flex items-center justify-center mb-4">
          <Layers className="w-8 h-8 text-[#d8a48f] animate-pulse" />
        </div>
        <h3 className="text-base font-semibold text-[#efebce]">
          No Forensic Evidence Loaded
        </h3>
        <p className="text-xs text-[#a3a380]/70 mt-1 max-w-sm">
          Select one of the 5 Golden Demo Samples from the sidebar or upload
          a custom screenshot to initialize the 4-layer inspection.
        </p>
      </div>
    );
  }

  const {
    overall_tamper_score,
    confidence_score,
    verdict,
    file_sha256,
    filename,
    image_width,
    image_height,
    channel_detected,
    layer1,
    layer2,
    layer3,
    layer4,
    synergy,
    findings,
    original_image_b64,
  } = report;

  const isAuthentic = verdict === "AUTHENTIC_VERIFIED";
  const isSuspicious = verdict === "SUSPICIOUS_ANOMALIES";
  const isManipulated = verdict === "MANIPULATED_FORGERY";

  // Palette assignments
  const primaryStatusColor = isAuthentic
    ? "#a3a380" // dry-sage
    : isSuspicious
      ? "#d6ce93" // vanilla-custard
      : "#bb8588"; // dusty-rose

  // Circular gauge math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (overall_tamper_score / 100) * circumference;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(file_sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const filteredFindings = findings.filter((f) => {
    if (findingsFilter === "ALL") return true;
    if (findingsFilter === "CRITICAL") return f.severity === "CRITICAL";
    if (findingsFilter === "HIGH") return f.severity === "HIGH";
    if (findingsFilter === "MEDIUM") return f.severity === "MEDIUM";
    if (findingsFilter === "INFO") return f.severity === "INFO" || f.severity === "LOW";
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Welcome / Case Identity Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#efebce]/10">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono mb-1" style={{ color: "#a3a380" }}>
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: primaryStatusColor }}
            />
            <span className="tracking-wider uppercase">
              CASE EVIDENCE IDENTIFIER: #{file_sha256.substring(0, 8)}
            </span>
            <span className="text-[#a3a380]/40">•</span>
            <span className="text-[#d6ce93]">
              {channel_detected.replace(/_/g, " ")}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#efebce] flex items-center space-x-3">
            <span>Forensics Intelligence Dashboard</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium border bg-[#efebce]/[0.04] border-[#efebce]/10 text-[#d6ce93]">
              {filename || "Active Evidence Capture"}
            </span>
          </h1>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Bento 1: Master Threat Gauge Hero (Col 1-5) */}
        <div className="lg:col-span-5 watermelon-glass-card rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
          {/* Ambient Glow */}
          <div
            className="absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: primaryStatusColor }}
          />

          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono tracking-wider uppercase text-[#a3a380] font-semibold flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-[#d8a48f]" />
              <span>Authenticity Risk Gauge</span>
            </span>
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold tracking-wider border"
              style={{
                backgroundColor: `${primaryStatusColor}20`,
                borderColor: `${primaryStatusColor}50`,
                color: primaryStatusColor,
              }}
            >
              Tier {isAuthentic ? "I (Genuine)" : isSuspicious ? "II (Triage)" : "III (Manipulated)"}
            </span>
          </div>

          {/* Radial Gauge Centerpiece */}
          <div className="flex items-center justify-center my-2">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                {/* Background Ring */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  className="stroke-[#161a22]"
                  strokeWidth="11"
                  fill="none"
                />
                {/* Value Ring */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  stroke={primaryStatusColor}
                  strokeWidth="11"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  style={{
                    filter: `drop-shadow(0 0 8px ${primaryStatusColor}66)`,
                  }}
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-extrabold font-mono text-[#efebce] tracking-tight">
                  {overall_tamper_score.toFixed(1)}%
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#a3a380] font-semibold mt-0.5">
                  Tamper Risk Index
                </span>
              </div>
            </div>
          </div>

          {/* Verdict Banner */}
          <div className="mt-4 pt-4 border-t border-[#efebce]/10 space-y-3">
            <div
              className="p-3 rounded-xl flex items-center justify-between border"
              style={{
                backgroundColor: `${primaryStatusColor}18`,
                borderColor: `${primaryStatusColor}40`,
                color: primaryStatusColor,
              }}
            >
              <div className="flex items-center space-x-2.5">
                {isAuthentic ? (
                  <ShieldCheck className="w-5 h-5 text-[#a3a380]" />
                ) : isSuspicious ? (
                  <AlertCircle className="w-5 h-5 text-[#d6ce93]" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-[#bb8588]" />
                )}
                <div>
                  <div className="text-xs font-bold tracking-wide">
                    {verdict.replace(/_/g, " ")}
                  </div>
                  <div className="text-[10px] opacity-85">
                    {isAuthentic
                      ? "Signal, typography and viewport verify genuine"
                      : isSuspicious
                        ? "Anomalies detected; further audit suggested"
                        : "Definitive tampering or typographic forgery detected"}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold">
                  {confidence_score.toFixed(0)}%
                </div>
                <div className="text-[9px] uppercase tracking-wider opacity-70">
                  Confidence
                </div>
              </div>
            </div>

            {/* Cryptographic SHA-256 Fingerprint */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#0c0e12]/80 rounded-xl border border-[#efebce]/10 text-[11px] font-mono">
              <span className="text-[#a3a380]">SHA-256:</span>
              <span className="text-[#efebce] truncate max-w-[200px] mx-2">
                {file_sha256}
              </span>
              <button
                onClick={handleCopyHash}
                className="text-[#d8a48f] hover:text-[#efebce] p-1 transition-colors"
                title="Copy SHA-256 Hash"
              >
                {copiedHash ? (
                  <Check className="w-3.5 h-3.5 text-[#a3a380]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bento 2: 4-Layer Forensic Matrix (Col 6-12) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Tile 1: Layer 1 Signal & Noise */}
          <div className="watermelon-glass-card rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-[#a3a380]/15 border border-[#a3a380]/30 flex items-center justify-center text-[#a3a380]">
                    <Waves className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#efebce] uppercase tracking-wide">
                      Layer 1: Signal & Noise
                    </h4>
                    <span className="text-[10px] text-[#a3a380] font-mono">
                      ELA & Daubechies db4
                    </span>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-[#d6ce93]">
                  {layer1.layer_score.toFixed(1)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#161a22] h-1.5 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-[#a3a380] to-[#d6ce93] rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, layer1.layer_score)}%` }}
                />
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-[#a3a380] pt-1 border-t border-[#efebce]/10">
                <div className="bg-[#0c0e12]/60 p-1.5 rounded-lg border border-[#efebce]/10">
                  <span className="text-[#a3a380]/70 block">ELA Heat:</span>
                  <span className="text-[#efebce] font-semibold">
                    {layer1.ela_score.toFixed(1)}%
                  </span>
                </div>
                <div className="bg-[#0c0e12]/60 p-1.5 rounded-lg border border-[#efebce]/10">
                  <span className="text-[#a3a380]/70 block">db4 Noise:</span>
                  <span className="text-[#efebce] font-semibold">
                    {layer1.wavelet_noise_score.toFixed(1)}%
                  </span>
                </div>
                <div className="bg-[#0c0e12]/60 p-1.5 rounded-lg border border-[#efebce]/10">
                  <span className="text-[#a3a380]/70 block">ORB Clones:</span>
                  <span
                    className={`font-semibold ${
                      layer1.clone_count > 0 ? "text-[#bb8588]" : "text-[#efebce]"
                    }`}
                  >
                    {layer1.clone_count} pairs
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSwitchToInspector()}
              className="mt-3 w-full py-1.5 rounded-lg bg-[#a3a380]/15 hover:bg-[#a3a380]/25 text-[#a3a380] text-[11px] font-medium flex items-center justify-center space-x-1.5 border border-[#a3a380]/30 transition-colors"
            >
              <span>Inspect Spectral Masks</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Tile 2: Layer 2 Typographic Geometry */}
          <div className="watermelon-glass-card rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-[#bb8588]/15 border border-[#bb8588]/30 flex items-center justify-center text-[#bb8588]">
                    <ScanText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#efebce] uppercase tracking-wide">
                      Layer 2: Typography & Lasers
                    </h4>
                    <span className="text-[10px] text-[#a3a380] font-mono">
                      MSER & Sub-pixel Baselines
                    </span>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-[#bb8588]">
                  {layer2.layer_score.toFixed(1)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#161a22] h-1.5 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-[#bb8588] to-[#d8a48f] rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, layer2.layer_score)}%` }}
                />
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-[#a3a380] pt-1 border-t border-[#efebce]/10">
                <div className="bg-[#0c0e12]/60 p-1.5 rounded-lg border border-[#efebce]/10">
                  <span className="text-[#a3a380]/70 block">Drift:</span>
                  <span
                    className={`font-semibold ${
                      layer2.max_baseline_drift_px > 3
                        ? "text-[#bb8588]"
                        : "text-[#a3a380]"
                    }`}
                  >
                    +{layer2.max_baseline_drift_px.toFixed(1)}px
                  </span>
                </div>
                <div className="bg-[#0c0e12]/60 p-1.5 rounded-lg border border-[#efebce]/10">
                  <span className="text-[#a3a380]/70 block">CIELAB ΔE:</span>
                  <span className="text-[#efebce] font-semibold">
                    {layer2.max_delta_e.toFixed(1)}
                  </span>
                </div>
                <div className="bg-[#0c0e12]/60 p-1.5 rounded-lg border border-[#efebce]/10">
                  <span className="text-[#a3a380]/70 block">Lasers:</span>
                  <span className="text-[#efebce] font-semibold">
                    {layer2.lasers.length} rows
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSwitchToInspector()}
              className="mt-3 w-full py-1.5 rounded-lg bg-[#bb8588]/15 hover:bg-[#bb8588]/25 text-[#bb8588] text-[11px] font-medium flex items-center justify-center space-x-1.5 border border-[#bb8588]/30 transition-colors"
            >
              <span>Examine Baseline Lasers</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Tile 3: Layer 3 Metadata & Protocol */}
          <div className="watermelon-glass-card rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-[#d8a48f]/15 border border-[#d8a48f]/30 flex items-center justify-center text-[#d8a48f]">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#efebce] uppercase tracking-wide">
                      Layer 3: Metadata & UPI
                    </h4>
                    <span className="text-[10px] text-[#a3a380] font-mono">
                      Viewport DB & NPCI Rules
                    </span>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-[#d8a48f]">
                  {layer3.layer_score.toFixed(1)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#161a22] h-1.5 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-[#d8a48f] to-[#d6ce93] rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, layer3.layer_score)}%` }}
                />
              </div>

              {/* Status items */}
              <div className="space-y-1.5 text-[11px] pt-1 border-t border-[#efebce]/10">
                <div className="flex items-center justify-between">
                  <span className="text-[#a3a380]">12-Digit UTR Check:</span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                      layer3.upi_utr_valid
                        ? "bg-[#a3a380]/15 text-[#a3a380] border-[#a3a380]/40"
                        : "bg-[#bb8588]/15 text-[#bb8588] border-[#bb8588]/40"
                    }`}
                  >
                    {layer3.upi_utr_valid ? "VALID CHECKSUM" : "ANOMALOUS / FAKE"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#a3a380]">Clock vs Receipt:</span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                      layer3.clock_paradox_detected
                        ? "bg-[#bb8588]/15 text-[#bb8588] border-[#bb8588]/40"
                        : "bg-[#a3a380]/15 text-[#a3a380] border-[#a3a380]/40"
                    }`}
                  >
                    {layer3.clock_paradox_detected ? "TEMPORAL PARADOX" : "COHERENT"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-[#a3a380]/80 px-1">
              <span>Ratio: {layer3.viewport_aspect_ratio}</span>
              <span>Laundered: {layer3.is_whatsapp_laundered ? "YES" : "NO"}</span>
            </div>
          </div>

          {/* Tile 4: Layer 4 Synergy & Ensemble */}
          <div className="watermelon-glass-card rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-[#d6ce93]/15 border border-[#d6ce93]/30 flex items-center justify-center text-[#d6ce93]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#efebce] uppercase tracking-wide">
                      Layer 4: Spatial Synergy
                    </h4>
                    <span className="text-[10px] text-[#a3a380] font-mono">
                      Bayesian Cross-Layer Fusion
                    </span>
                  </div>
                </div>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-[#d6ce93]/15 border border-[#d6ce93]/40 text-[#d6ce93] font-bold">
                  {synergy.synergy_multiplier_applied
                    ? `x${synergy.multiplier_factor} MULTIPLIER`
                    : "STANDALONE"}
                </span>
              </div>

              <p className="text-[11px] text-[#efebce]/90 leading-relaxed mb-3">
                {synergy.synergy_explanation}
              </p>
            </div>

            {synergy.primary_forgery_locus ? (
              <button
                onClick={() =>
                  onSwitchToInspector(synergy.primary_forgery_locus)
                }
                className="w-full py-1.5 rounded-lg bg-[#d6ce93]/15 hover:bg-[#d6ce93]/25 text-[#d6ce93] text-[11px] font-medium flex items-center justify-center space-x-1.5 border border-[#d6ce93]/40 transition-colors"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Focus Corroborated Locus</span>
              </button>
            ) : (
              <div className="text-[10px] font-mono text-[#a3a380]/70 text-center py-1 bg-[#0c0e12]/60 rounded-lg border border-[#efebce]/10">
                No cross-layer intersection anomalies found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bento 3: Findings Timeline & Evidentiary Log */}
      <div className="watermelon-glass-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-[#efebce]/10">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#d8a48f]" />
            <h3 className="text-sm font-bold text-[#efebce] uppercase tracking-wide">
              Forensic Evidentiary Findings Stream ({findings.length})
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1 bg-[#0c0e12]/80 p-1 rounded-xl border border-[#efebce]/10 text-[11px] font-mono">
            {(["ALL", "CRITICAL", "HIGH", "MEDIUM", "INFO"] as const).map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => setFindingsFilter(filter)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    findingsFilter === filter
                      ? "bg-[#efebce] text-[#0c0e12] font-bold shadow-sm"
                      : "text-[#a3a380] hover:text-[#efebce]"
                  }`}
                >
                  {filter}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Findings List */}
        <div className="space-y-3">
          {filteredFindings.length === 0 ? (
            <div className="p-8 text-center text-[#a3a380] font-mono text-xs">
              No findings matching the selected filter category.
            </div>
          ) : (
            filteredFindings.map((finding) => {
              const isCrit = finding.severity === "CRITICAL";
              const isHigh = finding.severity === "HIGH";
              const isMed = finding.severity === "MEDIUM";

              const badgeColor = isCrit
                ? "#bb8588" // dusty-rose
                : isHigh
                  ? "#d8a48f" // light-bronze
                  : isMed
                    ? "#d6ce93" // vanilla-custard
                    : "#a3a380"; // dry-sage

              return (
                <div
                  key={finding.id}
                  className="p-3.5 rounded-xl bg-[#0c0e12]/60 border border-[#efebce]/10 hover:border-[#efebce]/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex items-start space-x-3">
                    <span
                      className="text-[10px] font-mono px-2 py-1 rounded font-bold uppercase mt-0.5 whitespace-nowrap border"
                      style={{
                        backgroundColor: `${badgeColor}20`,
                        borderColor: `${badgeColor}50`,
                        color: badgeColor,
                      }}
                    >
                      {finding.severity}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-[#efebce] flex items-center space-x-2">
                        <span>{finding.title}</span>
                        <span className="text-[10px] font-mono text-[#a3a380]/60">
                          (Layer {finding.layer})
                        </span>
                      </div>
                      <p className="text-[11px] text-[#efebce]/80 mt-0.5 leading-relaxed">
                        {finding.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end md:self-center">
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-[#a3a380] uppercase">
                        {finding.metric_name}
                      </div>
                      <div className="text-xs font-mono font-bold text-[#efebce]">
                        {finding.metric_value}
                      </div>
                    </div>

                    {finding.bounding_box && (
                      <button
                        onClick={() =>
                          onSwitchToInspector(finding.bounding_box)
                        }
                        className="p-1.5 rounded-lg bg-[#161a22] hover:bg-[#1c212c] text-[#d6ce93] hover:text-[#efebce] transition-colors border border-[#efebce]/10"
                        title="Locate region in Deep Inspector"
                      >
                        <Crosshair className="w-4 h-4 text-[#d6ce93]" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
