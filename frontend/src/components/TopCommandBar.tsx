import React, { useRef, useState, useEffect } from "react";
import {
  ShieldAlert,
  Upload,
  Share2,
  QrCode,
  FileText,
  Loader2,
  Layers,
  Menu,
  X,
  Scan,
  Compass,
  FileSearch,
  Scale,
  Sparkles,
  ChevronDown,
  Sliders,
  MoreHorizontal,
  Check,
  Eye,
  Activity,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { DemoSampleMeta, ForensicAnalysisReport } from "../types/forensic";
import { RiskState } from "../services/riskTheme";

interface TopCommandBarProps {
  databaseStatus: "CHECKING" | "HEALTHY" | "UNAVAILABLE" | "NOT_CONFIGURED";
  demoSamples: DemoSampleMeta[];
  selectedSampleId: string | null;
  report: ForensicAnalysisReport | null;
  riskState: RiskState;
  onSelectSample: (sampleId: string) => void;
  onFileUpload: (file: File) => void;
  onOpenIntakeModal: () => void;
  onOpenWhatsAppModal: () => void;
  onOpenMobileModal: () => void;
  onOpenReportModal: () => void;
  onOpenSection91Modal?: () => void;
  onOpenThresholdModal?: () => void;
  onStageSelect?: (stage: "INTAKE" | "ANALYSIS" | "CANVAS" | "RISK" | "DOSSIER") => void;
  activeStage?: "INTAKE" | "ANALYSIS" | "CANVAS" | "RISK" | "DOSSIER";
  isLoading: boolean;
}

export const TopCommandBar: React.FC<TopCommandBarProps> = ({
  databaseStatus,
  demoSamples,
  selectedSampleId,
  report,
  riskState,
  onSelectSample,
  onFileUpload,
  onOpenIntakeModal,
  onOpenWhatsAppModal,
  onOpenMobileModal,
  onOpenReportModal,
  onOpenSection91Modal,
  onOpenThresholdModal,
  onStageSelect,
  activeStage = "CANVAS",
  isLoading,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scenarioDropdownOpen, setScenarioDropdownOpen] = useState(false);
  const [moreActionsOpen, setMoreActionsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scenarioDropdownRef = useRef<HTMLDivElement>(null);
  const moreActionsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        scenarioDropdownRef.current &&
        !scenarioDropdownRef.current.contains(e.target as Node)
      ) {
        setScenarioDropdownOpen(false);
      }
      if (
        moreActionsRef.current &&
        !moreActionsRef.current.contains(e.target as Node)
      ) {
        setMoreActionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) onFileUpload(file);
  };

  const caseId = report?.file_sha256
    ? report.file_sha256.substring(0, 8).toUpperCase()
    : "S1-GPAY";

  const activeSample = demoSamples.find((s) => s.id === selectedSampleId);

  // Risk Pill styling derived from riskState
  const getRiskPillClass = () => {
    switch (riskState.level) {
      case "CRITICAL":
        return "bg-rose-950/90 text-rose-300 border-rose-600/80 shadow-rose-950/50 shadow-sm animate-pulse";
      case "ELEVATED":
        return "bg-orange-950/80 text-orange-300 border-orange-600/70";
      case "MODERATE":
        return "bg-amber-950/80 text-amber-300 border-amber-600/70";
      case "LOW":
        return "bg-emerald-950/80 text-emerald-300 border-emerald-600/70";
      default:
        return "bg-slate-900 text-slate-400 border-slate-700";
    }
  };

  return (
    <header className="relative z-30 flex h-16 w-full shrink-0 items-center justify-between border-b border-[#1e293b] bg-[#070b14]/95 px-3 backdrop-blur-md md:px-5">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/webp,image/bmp"
        className="hidden"
      />

      {/* =========================================================================
          LEFT: BRAND IDENTITY, PRO BADGE & DYNAMIC RISK PILL
          ========================================================================= */}
      <div className="flex items-center space-x-3">
        {/* Brand Icon */}
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-sky-600 to-indigo-700 shadow-md shadow-sky-500/20">
          <ShieldAlert className="w-5 h-5 text-white" />
          <div className="absolute inset-0 rounded-xl border border-white/20" />
        </div>

        {/* Brand Title + Pro Badge */}
        <div className="flex items-center space-x-2">
          <span className="font-extrabold tracking-wider text-base bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
            VERISIGHT
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950/80 text-sky-400 border border-sky-800 font-bold tracking-wider">
            PRO v1.0
          </span>
        </div>

        {/* Dynamic Risk Status Pill (Clickable to open threshold settings) */}
        <button
          onClick={onOpenThresholdModal}
          title={`Click to adjust threshold (Threshold: ${riskState.criticalThreshold})`}
          className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border transition-all cursor-pointer ${getRiskPillClass()}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          <span>{riskState.shortLabel}</span>
          {riskState.score != null && (
            <span className="opacity-90 font-mono font-normal">
              ({riskState.score.toFixed(1)})
            </span>
          )}
        </button>
      </div>

      {/* =========================================================================
          CENTER: COMPACT 5-STAGE WORKFLOW STEPPER (DESKTOP)
          ========================================================================= */}
      <nav
        aria-label="Investigation Stages"
        className="hidden xl:flex items-center space-x-1 rounded-xl border border-[#1e293b] bg-[#0b1220]/80 p-1 text-xs font-mono"
      >
        <button
          onClick={() => onStageSelect?.("INTAKE")}
          className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
            activeStage === "INTAKE"
              ? "bg-sky-600 text-white font-semibold shadow-sm"
              : "text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#152033]"
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>1. Intake</span>
        </button>

        <span className="text-[#334155] text-xs font-sans">/</span>

        <button
          onClick={() => onStageSelect?.("ANALYSIS")}
          className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
            activeStage === "ANALYSIS"
              ? "bg-sky-600 text-white font-semibold shadow-sm"
              : "text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#152033]"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2. Pipeline</span>
        </button>

        <span className="text-[#334155] text-xs font-sans">/</span>

        <button
          onClick={() => onStageSelect?.("CANVAS")}
          className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
            activeStage === "CANVAS"
              ? "bg-sky-600 text-white font-semibold shadow-sm"
              : "text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#152033]"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>3. Evidence</span>
        </button>

        <span className="text-[#334155] text-xs font-sans">/</span>

        <button
          onClick={() => onStageSelect?.("RISK")}
          className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
            activeStage === "RISK"
              ? "bg-sky-600 text-white font-semibold shadow-sm"
              : "text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#152033]"
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>4. Risk Triage</span>
        </button>

        <span className="text-[#334155] text-xs font-sans">/</span>

        <button
          onClick={() => onStageSelect?.("DOSSIER")}
          className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
            activeStage === "DOSSIER"
              ? "bg-sky-600 text-white font-semibold shadow-sm"
              : "text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#152033]"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>5. Dossier</span>
        </button>
      </nav>

      {/* =========================================================================
          RIGHT: CASE BADGE, SCENARIO SWITCHER, NEW CASE & ACTIONS MENU
          ========================================================================= */}
      <div className="flex items-center space-x-2.5">
        {/* Case ID Badge */}
        <span className="hidden lg:inline-block text-[11px] font-mono text-[#94a3b8] bg-[#0f172a] px-2.5 py-1 rounded-lg border border-[#1e293b]">
          CASE #{caseId}
        </span>

        {/* Compact Scenario Switcher Popover (Replaces the 5 huge buttons!) */}
        <div className="relative" ref={scenarioDropdownRef}>
          <button
            onClick={() => setScenarioDropdownOpen(!scenarioDropdownOpen)}
            className="flex items-center space-x-1.5 rounded-lg border border-[#1e293b] bg-[#0b1220] px-2.5 py-1.5 text-xs font-mono text-[#94a3b8] hover:border-sky-500/50 hover:text-white transition-colors cursor-pointer"
            title="Switch demonstration scenarios"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="max-w-[130px] truncate hidden md:inline-block">
              {activeSample ? activeSample.title.replace(/^Sample \d+ — /, "") : "Demonstrations"}
            </span>
            <span className="md:hidden">Cases</span>
            <ChevronDown className="w-3 h-3 text-[#64748b]" />
          </button>

          {/* Scenario Popover Menu */}
          {scenarioDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-[#334155] bg-[#0b1220] p-2 shadow-2xl z-50 animate-in fade-in">
              <div className="px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#64748b] border-b border-[#1e293b] mb-1">
                Controlled Demonstration Scenarios
              </div>
              <div className="space-y-1">
                {demoSamples.map((sample, idx) => {
                  const isSelected = sample.id === selectedSampleId;
                  return (
                    <button
                      key={sample.id}
                      onClick={() => {
                        onSelectSample(sample.id);
                        setScenarioDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg transition-colors flex items-start justify-between cursor-pointer ${
                        isSelected
                          ? "bg-sky-950/80 border border-sky-600/70 text-white"
                          : "hover:bg-[#152033] text-[#94a3b8] hover:text-white border border-transparent"
                      }`}
                    >
                      <div className="space-y-0.5 pr-2">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono text-[10px] font-bold text-sky-400">
                            S{idx + 1}
                          </span>
                          <span className="text-xs font-medium text-slate-200">
                            {sample.title}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#64748b] line-clamp-1">
                          {sample.description}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-amber-400 font-semibold shrink-0">
                        {sample.target_score_range}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Primary Action: New Investigation Button */}
        <button
          onClick={onOpenIntakeModal}
          disabled={isLoading}
          className="flex items-center space-x-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-mono font-bold text-white hover:bg-sky-500 shadow-md shadow-sky-600/30 transition-all cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline-block">New Case</span>
        </button>

        {/* More Actions / Command Menu Dropdown */}
        <div className="relative" ref={moreActionsRef}>
          <button
            onClick={() => setMoreActionsOpen(!moreActionsOpen)}
            className="flex items-center justify-center rounded-lg border border-[#1e293b] bg-[#0b1220] p-2 text-[#94a3b8] hover:border-sky-500/50 hover:text-white transition-colors cursor-pointer"
            title="More forensic actions & settings"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {/* More Actions Menu */}
          {moreActionsOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-[#334155] bg-[#0b1220] p-1.5 shadow-2xl z-50 animate-in fade-in text-xs font-mono">
              <button
                onClick={() => {
                  setMoreActionsOpen(false);
                  onOpenThresholdModal?.();
                }}
                className="w-full flex items-center space-x-2.5 p-2 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#152033] transition-colors cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-sky-400" />
                <div className="text-left">
                  <div className="font-semibold text-slate-200">Risk Threshold</div>
                  <div className="text-[10px] text-[#64748b]">Configure trigger sensitivity ({riskState.criticalThreshold}%)</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setMoreActionsOpen(false);
                  onOpenSection91Modal?.();
                }}
                className="w-full flex items-center space-x-2.5 p-2 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#152033] transition-colors cursor-pointer"
              >
                <Scale className="w-4 h-4 text-amber-400" />
                <div className="text-left">
                  <div className="font-semibold text-slate-200">Section 91 Notice</div>
                  <div className="text-[10px] text-[#64748b]">Statutory Bank Subpoena</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setMoreActionsOpen(false);
                  onOpenWhatsAppModal();
                }}
                className="w-full flex items-center space-x-2.5 p-2 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#152033] transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <div className="font-semibold text-slate-200">WhatsApp Test</div>
                  <div className="text-[10px] text-[#64748b]">Re-compression Simulator</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setMoreActionsOpen(false);
                  onOpenMobileModal();
                }}
                className="w-full flex items-center space-x-2.5 p-2 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#152033] transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-cyan-400" />
                <div className="text-left">
                  <div className="font-semibold text-slate-200">Judge QR Upload</div>
                  <div className="text-[10px] text-[#64748b]">Real-Time Mobile Pairing</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setMoreActionsOpen(false);
                  onOpenReportModal();
                }}
                className="w-full flex items-center space-x-2.5 p-2 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#152033] transition-colors cursor-pointer border-t border-[#1e293b] mt-1 pt-2"
              >
                <FileText className="w-4 h-4 text-purple-400" />
                <div className="text-left">
                  <div className="font-semibold text-slate-200">Printable Dossier</div>
                  <div className="text-[10px] text-[#64748b]">12-Section Evidentiary PDF</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          className="p-2 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1e293b] xl:hidden transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#070b14]/98 border-b border-[#1e293b] p-4 shadow-2xl xl:hidden z-40 space-y-4 animate-in slide-in-from-top-2">
          {/* Mobile Stepper */}
          <div className="grid grid-cols-5 gap-1 text-[10px] font-mono text-center">
            {(["INTAKE", "ANALYSIS", "CANVAS", "RISK", "DOSSIER"] as const).map(
              (stage, idx) => (
                <button
                  key={stage}
                  onClick={() => {
                    onStageSelect?.(stage);
                    setMobileMenuOpen(false);
                  }}
                  className={`py-1.5 rounded ${
                    activeStage === stage
                      ? "bg-sky-600 text-white font-bold"
                      : "bg-[#0b1220] text-[#94a3b8]"
                  }`}
                >
                  {idx + 1}. {stage.slice(0, 4)}
                </button>
              ),
            )}
          </div>

          {/* Mobile Actions */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <button
              onClick={() => {
                onOpenIntakeModal();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg bg-sky-600 text-white font-bold flex items-center justify-center space-x-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>New Case</span>
            </button>
            <button
              onClick={() => {
                onOpenThresholdModal?.();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg bg-[#0b1220] border border-[#1e293b] text-slate-200 flex items-center justify-center space-x-1.5"
            >
              <Sliders className="w-4 h-4 text-sky-400" />
              <span>Threshold</span>
            </button>
            <button
              onClick={() => {
                onOpenSection91Modal?.();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg bg-[#0b1220] border border-[#1e293b] text-slate-200 flex items-center justify-center space-x-1.5"
            >
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Section 91</span>
            </button>
            <button
              onClick={() => {
                onOpenReportModal();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg bg-[#0b1220] border border-[#1e293b] text-slate-200 flex items-center justify-center space-x-1.5"
            >
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Dossier</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
