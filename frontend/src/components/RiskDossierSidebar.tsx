import React, { useState } from "react";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Copy,
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
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  CreditCard,
  Hash,
  Building,
  Info,
  Scale,
  FileText,
  PanelRightClose,
  PanelRightOpen,
  Sliders,
} from "lucide-react";
import { verdictLabel } from "../services/verdictLabel";
import { ForensicAnalysisReport, BoundingBox } from "../types/forensic";
import { RiskState } from "../services/riskTheme";

interface RiskDossierSidebarProps {
  report: ForensicAnalysisReport | null;
  selectedLocus: BoundingBox | null;
  riskState: RiskState;
  onSelectLocus: (box: BoundingBox | null) => void;
  onOpenSection91Modal?: () => void;
  onOpenThresholdModal?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const RiskDossierSidebar: React.FC<RiskDossierSidebarProps> = ({
  report,
  selectedLocus,
  riskState,
  onSelectLocus,
  onOpenSection91Modal,
  onOpenThresholdModal,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [expandedCheck, setExpandedCheck] = useState<string | null>("check_l2");
  const [copiedHash, setCopiedHash] = useState(false);

  if (!report) {
    return (
      <aside className="flex min-h-48 w-full flex-col items-center justify-center border-t border-[#1e293b] bg-[#0b1120] p-6 text-[#64748b] md:min-h-0 md:w-80 md:border-l md:border-t-0 md:shrink-0">
        <Layers className="w-10 h-10 mb-3 stroke-[1.5] text-sky-500/40 animate-pulse" />
        <span className="text-xs font-mono tracking-wider uppercase text-[#94a3b8]">
          No Investigation Dossier Active
        </span>
        <span className="text-[11px] text-[#475569] mt-1 text-center max-w-xs">
          Load an evidence capture to generate the 4-layer heuristic dossier.
        </span>
      </aside>
    );
  }

  const {
    overall_tamper_score,
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
    syndicate_intelligence,
  } = report;

  // Gauge calculations
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (Math.min(100, Math.max(0, overall_tamper_score)) / 100) * circumference;

  const copyHash = () => {
    navigator.clipboard.writeText(file_sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const toggleCheck = (id: string) => {
    setExpandedCheck((prev) => (prev === id ? null : id));
  };

  // =========================================================================
  // COLLAPSED RAIL VIEW (Saves horizontal space for centerpiece evidence)
  // =========================================================================
  if (isCollapsed) {
    return (
      <aside className="hidden md:flex w-14 shrink-0 flex-col items-center justify-between border-l border-[#1e293b] bg-[#090f1d] py-3 text-xs select-none transition-all duration-300">
        {/* Top: Expand Button */}
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={onToggleCollapse}
            title="Expand Forensic Dossier ([)"
            className="p-2 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#152033] border border-transparent hover:border-[#334155] transition-colors cursor-pointer"
          >
            <PanelRightOpen className="w-4 h-4 text-sky-400" />
          </button>

          {/* Mini Score Pill */}
          <div
            onClick={onToggleCollapse}
            title={`Risk Score: ${overall_tamper_score.toFixed(1)}/100 (${riskState.shortLabel})`}
            className="flex flex-col items-center justify-center w-10 h-10 rounded-xl border p-1 shadow-md cursor-pointer transition-transform hover:scale-105"
            style={{
              borderColor: riskState.borderColor,
              backgroundColor: riskState.bannerBg,
            }}
          >
            <span
              className="text-[11px] font-mono font-black"
              style={{ color: riskState.accentColor }}
            >
              {Math.round(overall_tamper_score)}
            </span>
            <span className="text-[7px] font-mono text-[#94a3b8] uppercase">
              SCORE
            </span>
          </div>

          {/* Layer Indicator Dots */}
          <div className="flex flex-col items-center space-y-2 pt-2 border-t border-[#1e293b] w-8">
            <div
              title={`Layer 1: ${layer1.layer_score.toFixed(1)}`}
              className="w-2.5 h-2.5 rounded-full bg-sky-500"
            />
            <div
              title={`Layer 2: ${layer2.layer_score.toFixed(1)}`}
              className="w-2.5 h-2.5 rounded-full bg-rose-500"
            />
            <div
              title={`Layer 3: ${layer3.layer_score.toFixed(1)}`}
              className="w-2.5 h-2.5 rounded-full bg-purple-500"
            />
            <div
              title={`Layer 4: ${layer4.layer_score.toFixed(1)}`}
              className="w-2.5 h-2.5 rounded-full bg-amber-500"
            />
          </div>

          {/* Findings Count Pill */}
          <div
            onClick={onToggleCollapse}
            title={`${findings.length} Anomalous Findings`}
            className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#0f172a] border border-[#1e293b] text-[10px] font-mono font-bold text-slate-300 cursor-pointer"
          >
            {findings.length}
          </div>
        </div>

        {/* Bottom: Settings / Section 91 Shortcut */}
        <div className="flex flex-col items-center space-y-2">
          {onOpenThresholdModal && (
            <button
              onClick={onOpenThresholdModal}
              title={`Adjust Threshold (${riskState.criticalThreshold}%)`}
              className="p-2 rounded-lg text-[#64748b] hover:text-sky-400 hover:bg-[#152033] transition-colors cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
            </button>
          )}

          {onOpenSection91Modal && (
            <button
              onClick={onOpenSection91Modal}
              title="Section 91 Notice"
              className="p-2 rounded-lg text-amber-500 hover:bg-amber-950/60 transition-colors cursor-pointer"
            >
              <Scale className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>
    );
  }

  // =========================================================================
  // FULL EXPANDED DOSSIER VIEW (~28% desktop width)
  // =========================================================================
  return (
    <aside className="flex w-full flex-col border-t border-[#1e293b] bg-[#090f1d] text-xs select-text transition-all duration-300 md:h-full md:w-84 lg:w-96 md:shrink-0 md:overflow-hidden md:border-l md:border-t-0">
      {/* Dossier Header */}
      <div className="p-3 border-b border-[#1e293b] flex items-center justify-between bg-[#070b14]/80">
        <div className="flex items-center space-x-2">
          <Fingerprint className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-[#f1f5f9] tracking-wide uppercase font-mono text-[11px]">
            STAGE 4 & 5: RISK DOSSIER
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          {onOpenThresholdModal && (
            <button
              onClick={onOpenThresholdModal}
              title={`Threshold Settings (${riskState.criticalThreshold}%)`}
              className="p-1 rounded text-[#94a3b8] hover:text-sky-400 hover:bg-[#152033] transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          )}

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              title="Collapse Dossier ([)"
              className="p-1 rounded text-[#94a3b8] hover:text-white hover:bg-[#152033] transition-colors cursor-pointer"
            >
              <PanelRightClose className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Dossier Content */}
      <div className="space-y-3 p-3 md:flex-1 md:overflow-y-auto">
        {/* =========================================================================
            STAGE 4: MASTER HEURISTIC RISK SCORE & VERDICT
            ========================================================================= */}
        <div
          className="border rounded-xl p-3.5 flex flex-col items-center relative overflow-hidden shadow-xl transition-all duration-500"
          style={{
            backgroundColor: "#0b1220",
            borderColor: riskState.borderColor,
          }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-500"
            style={{ backgroundColor: riskState.accentColor }}
          />

          {/* Master Gauge */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-[#151f32]"
                strokeWidth="9"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke={riskState.accentColor}
                strokeWidth="9"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold font-mono text-[#f8fafc] tracking-tight">
                {overall_tamper_score.toFixed(1)}
              </span>
              <span className="text-[8px] font-mono uppercase tracking-wider text-[#64748b]">
                HEURISTIC / 100
              </span>
            </div>
          </div>

          {/* Verdict Banner */}
          <div className="mt-2.5 flex flex-col items-center w-full text-center">
            <div
              className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider flex items-center space-x-1.5 border"
              style={{
                backgroundColor: riskState.bannerBg,
                color: riskState.accentColor,
                borderColor: riskState.borderColor,
              }}
            >
              {riskState.isCritical ? (
                <AlertTriangle className="w-3.5 h-3.5" />
              ) : riskState.level === "MODERATE" || riskState.level === "ELEVATED" ? (
                <AlertCircle className="w-3.5 h-3.5" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              <span className="font-mono">{riskState.shortLabel}: {verdictLabel(verdict)}</span>
            </div>

            <div className="flex items-center space-x-2 text-[10px] text-[#64748b] mt-1.5 font-mono">
              <span>Channel: <strong className="text-slate-300">{channel_detected}</strong></span>
              <span>•</span>
              <span>Findings: <strong className="text-slate-300">{findings.length}</strong></span>
            </div>

            <p className="mt-2 text-[10px] leading-relaxed text-[#94a3b8] bg-[#070b14]/70 p-2 rounded-lg border border-[#1e293b]/70">
              <strong>Cautionary notice:</strong> Automated heuristic score reflects structural and pixel-level statistical anomalies. It is not an uncalibrated probability of fraud nor a definitive legal determination.
            </p>
          </div>
        </div>

        {/* =========================================================================
            SYNDICATE ENTITY RESOLUTION CARD
            ========================================================================= */}
        {syndicate_intelligence && (
          <div className="bg-[#0b1220] border border-amber-700/50 rounded-xl p-3 shadow-lg space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
              <div className="flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span className="uppercase tracking-wider font-mono text-[10px]">
                  Syndicate Entity Resolution
                </span>
              </div>
              <span
                className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold border ${
                  syndicate_intelligence.syndicate_risk_level === "CRITICAL_SYNDICATE_THREAT"
                    ? "bg-rose-950 text-rose-300 border-rose-800"
                    : syndicate_intelligence.syndicate_risk_level === "MODERATE_REVIEW_REQUIRED"
                    ? "bg-amber-950 text-amber-300 border-amber-800"
                    : "bg-emerald-950 text-emerald-300 border-emerald-800"
                }`}
              >
                {syndicate_intelligence.syndicate_risk_level === "CRITICAL_SYNDICATE_THREAT"
                  ? "CRITICAL THREAT"
                  : "TRIAGE REVIEW"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
              <div className="bg-[#070b14] p-1.5 rounded border border-[#1e293b]">
                <span className="text-[#64748b] block text-[9px]">TARGET VPA:</span>
                <span className="text-white font-medium truncate block" title={syndicate_intelligence.entity_summary.payee_vpa || "None"}>
                  {syndicate_intelligence.entity_summary.payee_vpa || "Non-detected"}
                </span>
              </div>
              <div className="bg-[#070b14] p-1.5 rounded border border-[#1e293b]">
                <span className="text-[#64748b] block text-[9px]">UTR REFERENCE:</span>
                <span className="text-white font-medium truncate block">
                  {syndicate_intelligence.entity_summary.utr_number || "Non-standard"}
                </span>
              </div>
              <div className="bg-[#070b14] p-1.5 rounded border border-[#1e293b]">
                <span className="text-[#64748b] block text-[9px]">AMOUNT:</span>
                <span className="text-amber-400 font-bold block">
                  {syndicate_intelligence.entity_summary.amount || "N/A"}
                </span>
              </div>
              <div className="bg-[#070b14] p-1.5 rounded border border-[#1e293b]">
                <span className="text-[#64748b] block text-[9px]">PAYEE / ENTITY:</span>
                <span className="text-sky-300 font-medium block truncate" title={syndicate_intelligence.entity_summary.payee_name || "Unknown"}>
                  {syndicate_intelligence.entity_summary.payee_name || "Unknown"}
                </span>
              </div>
            </div>

            {onOpenSection91Modal && (
              <button
                onClick={onOpenSection91Modal}
                className="w-full py-1.5 px-2.5 rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-[#070b14] font-bold font-mono text-[11px] flex items-center justify-center space-x-1.5 shadow-md transition-all cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-[#070b14]" />
                <span>GENERATE SECTION 91 NOTICE</span>
              </button>
            )}
          </div>
        )}

        {/* =========================================================================
            CROSS-LAYER SPATIAL SYNERGY OVERLAP BANNER
            ========================================================================= */}
        {synergy.synergy_multiplier_applied && (
          <div className="bg-amber-950/30 border border-amber-500/60 rounded-xl p-3 shadow-md">
            <div className="flex items-center justify-between text-amber-400 font-semibold mb-1">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="font-mono text-[11px] uppercase">Cross-Layer IoU Synergy</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-300 font-mono text-[9px] font-bold">
                LOCUS OVERLAP
              </span>
            </div>
            <p className="text-[11px] text-amber-200/90 leading-relaxed font-sans">
              {synergy.synergy_explanation}
            </p>
            {synergy.primary_forgery_locus && (
              <button
                onClick={() =>
                  onSelectLocus(synergy.primary_forgery_locus || null)
                }
                className="mt-2 w-full py-1.5 bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 rounded-lg font-mono text-[10px] flex items-center justify-center space-x-1.5 border border-amber-500/50 transition-colors cursor-pointer"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Focus Canvas on Primary Locus</span>
              </button>
            )}
          </div>
        )}

        {/* =========================================================================
            PROGRESSIVE DISCLOSURE: 4-LAYER ANALYSIS BREAKDOWN ACCORDION
            ========================================================================= */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#64748b] tracking-wider uppercase font-semibold">
              4-Layer Forensic Architecture
            </span>
            <span className="text-[10px] font-mono text-sky-400">Progressive Detail</span>
          </div>

          {/* Layer 1 */}
          <div className="bg-[#0b1220] border border-[#1e293b] rounded-lg overflow-hidden transition-all">
            <button
              onClick={() => toggleCheck("check_l1")}
              className="w-full p-2.5 flex items-center justify-between hover:bg-[#101827] text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-sky-500" />
                <span className="text-xs font-semibold text-[#f1f5f9]">
                  Layer 1: Physical & Noise Signals
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-sky-400">
                  {layer1.layer_score.toFixed(1)}
                </span>
                {expandedCheck === "check_l1" ? <ChevronUp className="w-3.5 h-3.5 text-[#64748b]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />}
              </div>
            </button>
            <div className="w-full bg-[#151f32] h-1">
              <div className="h-full bg-sky-500 transition-all duration-700" style={{ width: `${Math.min(100, layer1.layer_score)}%` }} />
            </div>
            {expandedCheck === "check_l1" && (
              <div className="p-2.5 bg-[#070b14]/70 border-t border-[#1e293b] space-y-2 text-[10px] font-mono">
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div className="bg-[#0b1220] p-1 rounded border border-[#1e293b]">
                    <span className="text-[#64748b] block text-[8px]">ELA</span>
                    <span className="text-amber-400 font-bold">{layer1.ela_score.toFixed(1)}</span>
                  </div>
                  <div className="bg-[#0b1220] p-1 rounded border border-[#1e293b]">
                    <span className="text-[#64748b] block text-[8px]">WAVELET</span>
                    <span className="text-cyan-400 font-bold">{layer1.wavelet_noise_score.toFixed(1)}</span>
                  </div>
                  <div className="bg-[#0b1220] p-1 rounded border border-[#1e293b]">
                    <span className="text-[#64748b] block text-[8px]">CLONES</span>
                    <span className="text-pink-400 font-bold">{layer1.clone_count}</span>
                  </div>
                </div>
                <p className="text-[#94a3b8] font-sans text-[10px] leading-relaxed">
                  Evaluates 8x8 DCT quantization inconsistencies and Daubechies db4 high-frequency sub-band noise variance.
                </p>
              </div>
            )}
          </div>

          {/* Layer 2 */}
          <div className="bg-[#0b1220] border border-[#1e293b] rounded-lg overflow-hidden transition-all">
            <button
              onClick={() => toggleCheck("check_l2")}
              className="w-full p-2.5 flex items-center justify-between hover:bg-[#101827] text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-xs font-semibold text-[#f1f5f9]">
                  Layer 2: Typography & Alignment
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-rose-400">
                  {layer2.layer_score.toFixed(1)}
                </span>
                {expandedCheck === "check_l2" ? <ChevronUp className="w-3.5 h-3.5 text-[#64748b]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />}
              </div>
            </button>
            <div className="w-full bg-[#151f32] h-1">
              <div className="h-full bg-rose-500 transition-all duration-700" style={{ width: `${Math.min(100, layer2.layer_score)}%` }} />
            </div>
            {expandedCheck === "check_l2" && (
              <div className="p-2.5 bg-[#070b14]/70 border-t border-[#1e293b] space-y-2 text-[10px] font-mono">
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div className="bg-[#0b1220] p-1 rounded border border-[#1e293b]">
                    <span className="text-[#64748b] block text-[8px]">DRIFT</span>
                    <span className="text-rose-400 font-bold">+{layer2.max_baseline_drift_px.toFixed(1)}px</span>
                  </div>
                  <div className="bg-[#0b1220] p-1 rounded border border-[#1e293b]">
                    <span className="text-[#64748b] block text-[8px]">COLOR ΔE</span>
                    <span className="text-amber-400 font-bold">{layer2.max_delta_e.toFixed(1)}</span>
                  </div>
                  <div className="bg-[#0b1220] p-1 rounded border border-[#1e293b]">
                    <span className="text-[#64748b] block text-[8px]">LASERS</span>
                    <span className="text-sky-400 font-bold">{layer2.lasers.length}</span>
                  </div>
                </div>
                <p className="text-[#94a3b8] font-sans text-[10px] leading-relaxed">
                  Performs sub-pixel horizontal regression across text line baselines and calculates CIEDE2000 color delta (ΔE).
                </p>
              </div>
            )}
          </div>

          {/* Layer 3 */}
          <div className="bg-[#0b1220] border border-[#1e293b] rounded-lg overflow-hidden transition-all">
            <button
              onClick={() => toggleCheck("check_l3")}
              className="w-full p-2.5 flex items-center justify-between hover:bg-[#101827] text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-xs font-semibold text-[#f1f5f9]">
                  Layer 3: Metadata & Protocol Rules
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-purple-400">
                  {layer3.layer_score.toFixed(1)}
                </span>
                {expandedCheck === "check_l3" ? <ChevronUp className="w-3.5 h-3.5 text-[#64748b]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />}
              </div>
            </button>
            <div className="w-full bg-[#151f32] h-1">
              <div className="h-full bg-purple-500 transition-all duration-700" style={{ width: `${Math.min(100, layer3.layer_score)}%` }} />
            </div>
            {expandedCheck === "check_l3" && (
              <div className="p-2.5 bg-[#070b14]/70 border-t border-[#1e293b] space-y-1.5 text-[10px] font-mono">
                <div className="flex items-center justify-between bg-[#0b1220] p-1.5 rounded border border-[#1e293b]">
                  <span className="text-[#64748b]">CLOCK PARADOX:</span>
                  <span className={layer3.clock_paradox_detected ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                    {layer3.clock_paradox_detected ? "DETECTED" : "NOMINAL"}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-[#0b1220] p-1.5 rounded border border-[#1e293b]">
                  <span className="text-[#64748b]">UTR FORMAT:</span>
                  <span className="text-purple-400 font-bold">
                    {layer3.upi_utr_valid == null ? "UNAVAILABLE" : layer3.upi_utr_valid ? "VALID" : "INVALID"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Layer 4 */}
          <div className="bg-[#0b1220] border border-[#1e293b] rounded-lg overflow-hidden transition-all">
            <button
              onClick={() => toggleCheck("check_l4")}
              className="w-full p-2.5 flex items-center justify-between hover:bg-[#101827] text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-semibold text-[#f1f5f9]">
                  Layer 4: Heuristic Synergy & VLM
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-amber-400">
                  {layer4.layer_score.toFixed(1)}
                </span>
                {expandedCheck === "check_l4" ? <ChevronUp className="w-3.5 h-3.5 text-[#64748b]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />}
              </div>
            </button>
            <div className="w-full bg-[#151f32] h-1">
              <div className="h-full bg-amber-500 transition-all duration-700" style={{ width: `${Math.min(100, layer4.layer_score)}%` }} />
            </div>
            {expandedCheck === "check_l4" && (
              <div className="p-2.5 bg-[#070b14]/70 border-t border-[#1e293b] space-y-1.5 text-[10px] font-mono">
                <div className="flex items-center justify-between bg-[#0b1220] p-1.5 rounded border border-[#1e293b]">
                  <span className="text-[#64748b]">SPATIAL SYNERGY:</span>
                  <span className={synergy.synergy_multiplier_applied ? "text-amber-400 font-bold" : "text-slate-400"}>
                    {synergy.synergy_multiplier_applied ? "ACTIVE (IoU OVERLAP)" : "INACTIVE"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            STRUCTURED FINDINGS FEED (CLICK TO FOCUS)
            ========================================================================= */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#64748b] tracking-wider uppercase font-semibold">
              Evidence Findings Log ({findings.length})
            </span>
            <span className="text-[10px] text-[#475569] font-mono">Click to target</span>
          </div>

          {findings.length === 0 ? (
            <div className="p-3 bg-[#0b1220] border border-[#1e293b] rounded-lg text-center text-[#64748b] font-mono text-[11px]">
              No strong manipulation indicators were detected.
            </div>
          ) : (
            <div className="space-y-1.5">
              {findings.map((f) => {
                const isCritical = f.severity === "CRITICAL";
                const isHigh = f.severity === "HIGH";
                const isSelected =
                  selectedLocus &&
                  f.bounding_box &&
                  selectedLocus.x === f.bounding_box.x &&
                  selectedLocus.y === f.bounding_box.y;

                return (
                  <div
                    key={f.id}
                    onClick={() => onSelectLocus(f.bounding_box || null)}
                    className={`p-2 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-sky-950/40 border-sky-500 shadow-md shadow-sky-500/10"
                        : isCritical
                        ? "bg-rose-950/20 border-rose-800/80 hover:bg-rose-950/30"
                        : isHigh
                        ? "bg-amber-950/20 border-amber-800/80 hover:bg-amber-950/30"
                        : "bg-[#0b1220] border-[#1e293b] hover:bg-[#101827]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-[#f1f5f9] truncate max-w-[210px]">
                        {f.title}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isCritical
                            ? "bg-rose-900 text-rose-200"
                            : isHigh
                            ? "bg-amber-900 text-amber-200"
                            : "bg-sky-900 text-sky-200"
                        }`}
                      >
                        {f.severity}
                      </span>
                    </div>

                    <p className="text-[10px] text-[#94a3b8] leading-snug line-clamp-2">
                      {f.description}
                    </p>

                    <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-[#64748b]">
                      <span className="flex items-center space-x-1">
                        <Target className="w-3 h-3 text-sky-400" />
                        <span>Layer {f.layer}</span>
                      </span>
                      <span className="text-[#38bdf8] truncate max-w-[170px]">
                        {f.metric_name}: {f.metric_value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cryptographic Hash & Custody Footer */}
        <div className="bg-[#0b1220] border border-[#1e293b] rounded-lg p-2.5 space-y-1.5 text-[10px] font-mono">
          <div className="flex items-center justify-between text-[#94a3b8]">
            <span className="truncate max-w-[210px]" title={file_sha256}>
              SHA-256: {file_sha256.slice(0, 16)}...
            </span>
            <button
              onClick={copyHash}
              className="text-sky-400 hover:text-sky-300 p-0.5 rounded bg-[#070b14] border border-[#1e293b] flex items-center space-x-1 text-[9px] cursor-pointer"
            >
              {copiedHash ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="flex justify-between text-[#64748b] border-t border-[#1e293b]/60 pt-1">
            <span>{image_width}×{image_height}px</span>
            <span>{layer3.viewport_aspect_ratio.split(" ")[0]}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
