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
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
        <div className="w-16 h-16 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-center mb-4">
          <Layers className="w-8 h-8 text-watermelon-coral/60 animate-pulse" />
        </div>
        <h3 className="text-base font-semibold text-slate-300">
          No Forensic Evidence Loaded
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Select one of the 5 Golden Demo Samples from the top toolbar or upload
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-watermelon-emerald mb-1">
            <span className="w-2 h-2 rounded-full bg-watermelon-emerald animate-ping" />
            <span className="tracking-wider uppercase">
              CASE EVIDENCE IDENTIFIER: #{file_sha256.substring(0, 8)}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">
              {channel_detected.replace(/_/g, " ")}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center space-x-3">
            <span>Forensics Intelligence Dashboard</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium border bg-white/[0.04] border-white/10 text-slate-300">
              {filename || "Active Evidence Capture"}
            </span>
          </h1>
        </div>

        {/* Quick Action Group */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onSwitchToInspector()}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-watermelon-coral to-watermelon-crimson hover:from-watermelon-rose hover:to-watermelon-coral text-white text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-watermelon-coral/25 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Launch Deep Inspector</span>
          </button>
          <button
            onClick={onOpenWhatsAppModal}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-watermelon-emerald/30 text-watermelon-mint text-xs font-medium flex items-center space-x-2 transition-all"
          >
            <Share2 className="w-3.5 h-3.5 text-watermelon-emerald" />
            <span>WhatsApp Lab</span>
          </button>
          <button
            onClick={onOpenReportModal}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 text-xs font-medium flex items-center space-x-2 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>Audit PDF</span>
          </button>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Bento 1: Master Threat Gauge Hero (Col 1-5) */}
        <div className="lg:col-span-5 watermelon-glass-card rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle ambient backglow */}
          <div
            className={`absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none ${
              isAuthentic
                ? "bg-watermelon-emerald"
                : isSuspicious
                  ? "bg-watermelon-amber"
                  : "bg-watermelon-coral"
            }`}
          />

          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono tracking-wider uppercase text-slate-400 font-semibold flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-slate-400" />
              <span>Synthesized Authenticity Gauge</span>
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold tracking-wider border ${
                isAuthentic
                  ? "bg-watermelon-rind/50 border-watermelon-emerald/40 text-watermelon-mint"
                  : isSuspicious
                    ? "bg-amber-950/50 border-amber-500/40 text-amber-300"
                    : "bg-watermelon-darkrose/50 border-watermelon-coral/40 text-watermelon-rose"
              }`}
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
                  className="stroke-slate-800/80"
                  strokeWidth="11"
                  fill="none"
                />
                {/* Value Ring */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  stroke={
                    isAuthentic
                      ? "#10b981"
                      : isSuspicious
                        ? "#f59e0b"
                        : "#f43f5e"
                  }
                  strokeWidth="11"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out filter drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-extrabold font-mono text-white tracking-tight">
                  {overall_tamper_score.toFixed(1)}%
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
                  Tamper Risk Index
                </span>
              </div>
            </div>
          </div>

          {/* Verdict Banner */}
          <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3">
            <div
              className={`p-3 rounded-xl flex items-center justify-between border ${
                isAuthentic
                  ? "bg-watermelon-emerald/10 border-watermelon-emerald/30 text-watermelon-mint"
                  : isSuspicious
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                    : "bg-watermelon-coral/10 border-watermelon-coral/30 text-watermelon-rose"
              }`}
            >
              <div className="flex items-center space-x-2.5">
                {isAuthentic ? (
                  <ShieldCheck className="w-5 h-5 text-watermelon-emerald" />
                ) : isSuspicious ? (
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-watermelon-coral" />
                )}
                <div>
                  <div className="text-xs font-bold tracking-wide">
                    {verdict.replace(/_/g, " ")}
                  </div>
                  <div className="text-[10px] opacity-80">
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
            <div className="flex items-center justify-between px-3 py-2 bg-slate-950/60 rounded-xl border border-white/[0.05] text-[11px] font-mono">
              <span className="text-slate-500">SHA-256:</span>
              <span className="text-slate-300 truncate max-w-[200px] mx-2">
                {file_sha256}
              </span>
              <button
                onClick={handleCopyHash}
                className="text-slate-400 hover:text-white p-1 transition-colors"
                title="Copy SHA-256 Hash"
              >
                {copiedHash ? (
                  <Check className="w-3.5 h-3.5 text-watermelon-emerald" />
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
                  <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                    <Waves className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                      Layer 1: Signal & Noise
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ELA & Daubechies db4
                    </span>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-sky-400">
                  {layer1.layer_score.toFixed(1)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, layer1.layer_score)}%` }}
                />
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-400 pt-1 border-t border-white/[0.05]">
                <div className="bg-slate-950/40 p-1.5 rounded-lg border border-white/[0.04]">
                  <span className="text-slate-500 block">ELA Heat:</span>
                  <span className="text-slate-200 font-semibold">
                    {layer1.ela_score.toFixed(1)}%
                  </span>
                </div>
                <div className="bg-slate-950/40 p-1.5 rounded-lg border border-white/[0.04]">
                  <span className="text-slate-500 block">db4 Residual:</span>
                  <span className="text-slate-200 font-semibold">
                    {layer1.wavelet_noise_score.toFixed(1)}%
                  </span>
                </div>
                <div className="bg-slate-950/40 p-1.5 rounded-lg border border-white/[0.04]">
                  <span className="text-slate-500 block">ORB Clones:</span>
                  <span
                    className={`font-semibold ${
                      layer1.clone_count > 0 ? "text-watermelon-coral" : "text-slate-200"
                    }`}
                  >
                    {layer1.clone_count} pairs
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSwitchToInspector()}
              className="mt-3 w-full py-1.5 rounded-lg bg-sky-950/40 hover:bg-sky-900/50 text-sky-300 text-[11px] font-medium flex items-center justify-center space-x-1.5 border border-sky-800/40 transition-colors"
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
                  <div className="w-7 h-7 rounded-lg bg-watermelon-coral/10 border border-watermelon-coral/20 flex items-center justify-center text-watermelon-rose">
                    <ScanText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                      Layer 2: Typography & Lasers
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      MSER & Sub-pixel Baselines
                    </span>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-watermelon-coral">
                  {layer2.layer_score.toFixed(1)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-watermelon-coral to-watermelon-rose rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, layer2.layer_score)}%` }}
                />
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-400 pt-1 border-t border-white/[0.05]">
                <div className="bg-slate-950/40 p-1.5 rounded-lg border border-white/[0.04]">
                  <span className="text-slate-500 block">Baseline Drift:</span>
                  <span
                    className={`font-semibold ${
                      layer2.max_baseline_drift_px > 3
                        ? "text-watermelon-coral"
                        : "text-watermelon-mint"
                    }`}
                  >
                    +{layer2.max_baseline_drift_px.toFixed(1)}px
                  </span>
                </div>
                <div className="bg-slate-950/40 p-1.5 rounded-lg border border-white/[0.04]">
                  <span className="text-slate-500 block">CIELAB ΔE:</span>
                  <span className="text-slate-200 font-semibold">
                    {layer2.max_delta_e.toFixed(1)}
                  </span>
                </div>
                <div className="bg-slate-950/40 p-1.5 rounded-lg border border-white/[0.04]">
                  <span className="text-slate-500 block">Laser Tracks:</span>
                  <span className="text-slate-200 font-semibold">
                    {layer2.lasers.length} rows
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSwitchToInspector()}
              className="mt-3 w-full py-1.5 rounded-lg bg-watermelon-darkrose/30 hover:bg-watermelon-darkrose/50 text-watermelon-rose text-[11px] font-medium flex items-center justify-center space-x-1.5 border border-watermelon-coral/30 transition-colors"
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
                  <div className="w-7 h-7 rounded-lg bg-watermelon-purple/10 border border-watermelon-purple/20 flex items-center justify-center text-watermelon-purple">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                      Layer 3: Metadata & UPI
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Viewport DB & NPCI Rules
                    </span>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-watermelon-purple">
                  {layer3.layer_score.toFixed(1)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-watermelon-purple to-purple-400 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, layer3.layer_score)}%` }}
                />
              </div>

              {/* Status items */}
              <div className="space-y-1.5 text-[11px] pt-1 border-t border-white/[0.05]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">12-Digit UTR Check:</span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      layer3.upi_utr_valid
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : "bg-rose-950 text-rose-400 border border-rose-800"
                    }`}
                  >
                    {layer3.upi_utr_valid ? "VALID CHECKSUM" : "ANOMALOUS / FAKE"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Clock vs Receipt:</span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      layer3.clock_paradox_detected
                        ? "bg-rose-950 text-rose-400 border border-rose-800"
                        : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                    }`}
                  >
                    {layer3.clock_paradox_detected ? "TEMPORAL PARADOX" : "COHERENT"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
              <span>Ratio: {layer3.viewport_aspect_ratio}</span>
              <span>Laundered: {layer3.is_whatsapp_laundered ? "YES" : "NO"}</span>
            </div>
          </div>

          {/* Tile 4: Layer 4 Synergy & Ensemble */}
          <div className="watermelon-glass-card rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                      Layer 4: Spatial Synergy
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Bayesian Cross-Layer Fusion
                    </span>
                  </div>
                </div>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold">
                  {synergy.synergy_multiplier_applied
                    ? `x${synergy.multiplier_factor} MULTIPLIER`
                    : "STANDALONE"}
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                {synergy.synergy_explanation}
              </p>
            </div>

            {synergy.primary_forgery_locus ? (
              <button
                onClick={() =>
                  onSwitchToInspector(synergy.primary_forgery_locus)
                }
                className="w-full py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 text-[11px] font-medium flex items-center justify-center space-x-1.5 border border-amber-700/40 transition-colors"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Focus Corroborated Locus</span>
              </button>
            ) : (
              <div className="text-[10px] font-mono text-slate-500 text-center py-1 bg-slate-950/40 rounded-lg border border-white/[0.04]">
                No cross-layer intersection anomalies found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bento 3: Findings Timeline & Evidentiary Log */}
      <div className="watermelon-glass-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-watermelon-coral" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Forensic Evidentiary Findings Stream ({findings.length})
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1 bg-slate-950/60 p-1 rounded-xl border border-white/[0.06] text-[11px] font-mono">
            {(["ALL", "CRITICAL", "HIGH", "MEDIUM", "INFO"] as const).map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => setFindingsFilter(filter)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    findingsFilter === filter
                      ? "bg-slate-800 text-white font-bold shadow-sm"
                      : "text-slate-400 hover:text-white"
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
            <div className="p-8 text-center text-slate-500 font-mono text-xs">
              No findings matching the selected filter category.
            </div>
          ) : (
            filteredFindings.map((finding) => {
              const isCrit = finding.severity === "CRITICAL";
              const isHigh = finding.severity === "HIGH";
              const isMed = finding.severity === "MEDIUM";

              return (
                <div
                  key={finding.id}
                  className="p-3.5 rounded-xl bg-slate-950/50 border border-white/[0.06] hover:border-white/[0.14] transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex items-start space-x-3">
                    <span
                      className={`text-[10px] font-mono px-2 py-1 rounded font-bold uppercase mt-0.5 whitespace-nowrap border ${
                        isCrit
                          ? "bg-rose-950/80 border-rose-600/60 text-rose-300"
                          : isHigh
                            ? "bg-orange-950/80 border-orange-600/60 text-orange-300"
                            : isMed
                              ? "bg-amber-950/80 border-amber-600/60 text-amber-300"
                              : "bg-sky-950/80 border-sky-600/60 text-sky-300"
                      }`}
                    >
                      {finding.severity}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center space-x-2">
                        <span>{finding.title}</span>
                        <span className="text-[10px] font-mono text-slate-500">
                          (Layer {finding.layer})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        {finding.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end md:self-center">
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-slate-500 uppercase">
                        {finding.metric_name}
                      </div>
                      <div className="text-xs font-mono font-bold text-slate-200">
                        {finding.metric_value}
                      </div>
                    </div>

                    {finding.bounding_box && (
                      <button
                        onClick={() =>
                          onSwitchToInspector(finding.bounding_box)
                        }
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-white/[0.06]"
                        title="Locate region in Deep Inspector"
                      >
                        <Crosshair className="w-4 h-4 text-sky-400" />
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
