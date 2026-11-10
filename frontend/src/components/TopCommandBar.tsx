import React, { useRef, useState } from "react";
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
} from "lucide-react";
import { DemoSampleMeta, ForensicAnalysisReport } from "../types/forensic";

interface TopCommandBarProps {
  databaseStatus: "CHECKING" | "HEALTHY" | "UNAVAILABLE" | "NOT_CONFIGURED";
  demoSamples: DemoSampleMeta[];
  selectedSampleId: string | null;
  report: ForensicAnalysisReport | null;
  onSelectSample: (sampleId: string) => void;
  onFileUpload: (file: File) => void;
  onOpenIntakeModal: () => void;
  onOpenWhatsAppModal: () => void;
  onOpenMobileModal: () => void;
  onOpenReportModal: () => void;
  onOpenSection91Modal?: () => void;
  onStageSelect?: (stage: "INTAKE" | "ANALYSIS" | "CANVAS" | "RISK" | "DOSSIER") => void;
  activeStage?: "INTAKE" | "ANALYSIS" | "CANVAS" | "RISK" | "DOSSIER";
  isLoading: boolean;
}

export const TopCommandBar: React.FC<TopCommandBarProps> = ({
  databaseStatus,
  demoSamples,
  selectedSampleId,
  report,
  onSelectSample,
  onFileUpload,
  onOpenIntakeModal,
  onOpenWhatsAppModal,
  onOpenMobileModal,
  onOpenReportModal,
  onOpenSection91Modal,
  onStageSelect,
  activeStage = "CANVAS",
  isLoading,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) onFileUpload(file);
  };

  const caseId = report?.file_sha256
    ? report.file_sha256.substring(0, 8).toUpperCase()
    : "S1-GPAY";

  return (
    <header className="relative z-30 flex w-full flex-col border-b border-[#1e293b] bg-[#070b14]/95 px-3 py-2.5 backdrop-blur-md md:h-16 md:flex-row md:items-center md:justify-between md:px-5 md:py-0">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/webp,image/bmp"
        className="hidden"
      />

      {/* LEFT: Product Identity & Telemetry */}
      <div className="flex items-center justify-between md:justify-start">
        <div className="flex items-center space-x-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-sky-600 to-indigo-700 shadow-lg shadow-sky-500/25">
            <ShieldAlert className="w-5 h-5 text-white" />
            <div className="absolute inset-0 rounded-xl border border-white/20" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-wider text-base bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                VERISIGHT
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 font-bold tracking-wider">
                PRO v1.0
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono text-[#64748b] bg-[#0f172a] px-2 py-0.5 rounded border border-[#1e293b]">
                CASE #{caseId}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-[#64748b]">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  databaseStatus === "HEALTHY"
                    ? "bg-emerald-400 animate-pulse"
                    : databaseStatus === "CHECKING"
                    ? "bg-amber-400 animate-pulse"
                    : "bg-rose-500"
                }`}
              />
              <span className="font-mono text-[10px]">
                4-LAYER DETERMINISTIC ENGINE · DB {databaseStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          className="p-2 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1e293b] md:hidden transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* CENTER: 5-Stage Investigation Workflow Stepper (Desktop) */}
      <nav
        aria-label="Investigation Stages"
        className="hidden lg:flex items-center space-x-1 bg-[#0b1120] border border-[#1e293b] p-1 rounded-xl shadow-inner text-xs font-mono"
      >
        <button
          onClick={onOpenIntakeModal}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeStage === "INTAKE"
              ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold"
              : "text-[#94a3b8] hover:text-white hover:bg-[#1e293b]"
          }`}
        >
          <Scan className="w-3.5 h-3.5 text-sky-400" />
          <span>1. Intake</span>
        </button>

        <span className="text-[#334155]">/</span>

        <button
          onClick={() => onStageSelect?.("ANALYSIS")}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeStage === "ANALYSIS"
              ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold"
              : "text-[#94a3b8] hover:text-white hover:bg-[#1e293b]"
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>2. Pipeline</span>
        </button>

        <span className="text-[#334155]">/</span>

        <button
          onClick={() => onStageSelect?.("CANVAS")}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeStage === "CANVAS"
              ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold"
              : "text-[#94a3b8] hover:text-white hover:bg-[#1e293b]"
          }`}
        >
          <FileSearch className="w-3.5 h-3.5 text-emerald-400" />
          <span>3. Evidence</span>
        </button>

        <span className="text-[#334155]">/</span>

        <button
          onClick={() => onStageSelect?.("RISK")}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeStage === "RISK"
              ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold"
              : "text-[#94a3b8] hover:text-white hover:bg-[#1e293b]"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>4. Risk Triage</span>
        </button>

        <span className="text-[#334155]">/</span>

        <button
          onClick={onOpenReportModal}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition-all"
        >
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          <span>5. Dossier</span>
        </button>
      </nav>

      {/* Demo Scenario Pills (Compact Desktop) */}
      <div className="hidden xl:flex items-center space-x-1 bg-[#0b1120] border border-[#1e293b] p-1 rounded-xl text-xs font-mono">
        <span className="text-[10px] text-[#64748b] px-2 font-bold uppercase">Scenarios:</span>
        {demoSamples.map((sample, idx) => {
          const isSelected = selectedSampleId === sample.id;
          const isClean = sample.id === "sample_1";
          return (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample.id)}
              disabled={isLoading}
              title={`${sample.title}: ${sample.scenario}`}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                isSelected
                  ? isClean
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-600 shadow-sm"
                    : "bg-rose-950 text-rose-300 border border-rose-600 shadow-sm"
                  : "text-[#94a3b8] hover:text-white hover:bg-[#1e293b]"
              }`}
            >
              {`S${idx + 1}`}
            </button>
          );
        })}
      </div>

      {/* RIGHT: Action Hierarchy */}
      <div className="hidden md:flex items-center space-x-2">
        {/* Primary Action: New Evidence / Intake */}
        <button
          onClick={onOpenIntakeModal}
          disabled={isLoading}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition-all flex items-center space-x-1.5"
          title="Open Evidence Intake & Benchmark Scenarios"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
          ) : (
            <Upload className="w-3.5 h-3.5 text-white" />
          )}
          <span>New Investigation</span>
        </button>

        {/* Secondary Utility: Simulate WhatsApp */}
        <button
          onClick={onOpenWhatsAppModal}
          disabled={isLoading}
          className="px-2.5 py-2 rounded-xl border border-emerald-800/60 bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-300 text-xs font-medium transition-all flex items-center space-x-1.5"
          title="Simulate WhatsApp compression and channel scrubbing"
        >
          <Share2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden 2xl:inline">WhatsApp Test</span>
        </button>

        {/* Secondary Utility: Mobile QR Handoff */}
        <button
          onClick={onOpenMobileModal}
          disabled={isLoading}
          className="px-2.5 py-2 rounded-xl border border-sky-800/60 bg-sky-950/30 hover:bg-sky-900/40 text-sky-300 text-xs font-medium transition-all flex items-center space-x-1.5"
          title="Stage judge live mobile phone upload pairing"
        >
          <QrCode className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden 2xl:inline">Judge QR</span>
        </button>

        {/* Legal Process: Section 91 Cyber Notice */}
        {onOpenSection91Modal && (
          <button
            onClick={onOpenSection91Modal}
            disabled={isLoading}
            className="px-2.5 py-2 rounded-xl border border-amber-800/80 bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
            title="Generate Statutory Section 91 Cyber Subpoena (1930 Cyber-Cell Ready)"
          >
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Section 91</span>
          </button>
        )}

        {/* Export / Print Dossier */}
        <button
          onClick={onOpenReportModal}
          disabled={isLoading}
          className="px-3 py-2 rounded-xl border border-[#334155] bg-[#0f172a] hover:bg-[#1e293b] text-[#f1f5f9] text-xs font-medium transition-all flex items-center space-x-1.5"
          title="Print official multi-layer forensic report"
        >
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          <span>Dossier</span>
        </button>
      </div>

      {/* MOBILE COLLAPSIBLE DRAWER */}
      {mobileMenuOpen && (
        <div className="mt-3 flex flex-col space-y-2.5 border-t border-[#1e293b] pt-3 pb-2 md:hidden animate-in fade-in slide-in-from-top-2">
          {/* Mobile Stages */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <button
              onClick={() => {
                onOpenIntakeModal();
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded-lg bg-[#0b1120] border border-[#1e293b] text-sky-300 flex items-center space-x-2"
            >
              <Scan className="w-4 h-4 text-sky-400" />
              <span>1. Evidence Intake</span>
            </button>

            <button
              onClick={() => {
                onOpenReportModal();
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded-lg bg-[#0b1120] border border-[#1e293b] text-indigo-300 flex items-center space-x-2"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>5. Print Dossier</span>
            </button>
          </div>

          {/* Mobile Scenario Selector */}
          <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
            {demoSamples.map((sample, idx) => (
              <button
                key={sample.id}
                onClick={() => {
                  onSelectSample(sample.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono shrink-0 border ${
                  selectedSampleId === sample.id
                    ? "bg-sky-950 text-sky-300 border-sky-500 font-bold"
                    : "bg-[#0b1120] text-[#94a3b8] border-[#1e293b]"
                }`}
              >
                {`Sample S${idx + 1}`}
              </button>
            ))}
          </div>

          {/* Mobile Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                onOpenWhatsAppModal();
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded-lg border border-emerald-900 bg-emerald-950/40 text-emerald-300 text-xs font-medium flex items-center justify-center space-x-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp Test</span>
            </button>

            {onOpenSection91Modal && (
              <button
                onClick={() => {
                  onOpenSection91Modal();
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded-lg border border-amber-900 bg-amber-950/40 text-amber-300 text-xs font-semibold flex items-center justify-center space-x-1.5"
              >
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>Section 91 Notice</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
