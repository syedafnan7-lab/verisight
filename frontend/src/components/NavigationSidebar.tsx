import React, { useRef } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Upload,
  Share2,
  QrCode,
  FileText,
  Loader2,
  Github,
  LayoutDashboard,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  Database,
  ExternalLink,
} from "lucide-react";
import { DemoSampleMeta } from "../types/forensic";

interface NavigationSidebarProps {
  demoSamples: DemoSampleMeta[];
  selectedSampleId: string | null;
  onSelectSample: (sampleId: string) => void;
  onFileUpload: (file: File) => void;
  onOpenWhatsAppModal: () => void;
  onOpenMobileModal: () => void;
  onOpenReportModal: () => void;
  isLoading: boolean;
  activeView: "DASHBOARD" | "INSPECTOR";
  onViewChange: (view: "INSPECTOR" | "DASHBOARD") => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  demoSamples,
  selectedSampleId,
  onSelectSample,
  onFileUpload,
  onOpenWhatsAppModal,
  onOpenMobileModal,
  onOpenReportModal,
  isLoading,
  activeView,
  onViewChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <aside className="w-72 xl:w-80 h-full border-r border-white/[0.08] watermelon-glass flex flex-col justify-between shrink-0 select-none z-30">
      {/* 1. Brand & Core Header */}
      <div className="p-4 border-b border-white/[0.08] bg-slate-950/60">
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-watermelon-coral via-watermelon-crimson to-watermelon-rind p-0.5 shadow-lg shadow-watermelon-coral/25">
              <div className="w-full h-full bg-[#080c16] rounded-[14px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-watermelon-coral group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-watermelon-emerald opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-watermelon-emerald" />
            </span>
          </div>

          <div className="overflow-hidden">
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold tracking-wider text-base bg-gradient-to-r from-white via-slate-100 to-watermelon-rose bg-clip-text text-transparent">
                VERISIGHT
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-watermelon-coral/10 text-watermelon-rose border border-watermelon-coral/30 font-semibold tracking-wider">
                v1.2
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-mono mt-0.5">
              <span className="text-watermelon-emerald font-semibold">100% DETERMINISTIC</span>
              <span className="text-slate-600">•</span>
              <span>CORE ONLINE</span>
            </div>
          </div>
        </div>

        {/* View Switcher Controls */}
        <div className="mt-4 grid grid-cols-2 gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-white/[0.08] text-xs font-medium">
          <button
            onClick={() => onViewChange("DASHBOARD")}
            className={`py-2 px-2.5 rounded-lg flex items-center justify-center space-x-2 transition-all ${
              activeView === "DASHBOARD"
                ? "bg-gradient-to-r from-watermelon-coral to-watermelon-crimson text-white shadow-md shadow-watermelon-coral/25 font-semibold"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => onViewChange("INSPECTOR")}
            className={`py-2 px-2.5 rounded-lg flex items-center justify-center space-x-2 transition-all ${
              activeView === "INSPECTOR"
                ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/25 font-semibold"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Inspector</span>
          </button>
        </div>
      </div>

      {/* 2. Middle Scrollable Area: Samples & Actions */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Golden Demo Samples Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold px-1">
            <span className="flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-watermelon-coral" />
              <span>Evidence Samples</span>
            </span>
            <span className="text-slate-500 text-[10px]">
              {demoSamples.length} CASSETTES
            </span>
          </div>

          <div className="space-y-1.5">
            {demoSamples.map((sample, idx) => {
              const isSelected = selectedSampleId === sample.id;
              const isAuthentic = sample.id === "sample_1";
              const isSpliced = sample.id === "sample_2";
              const isParadox = sample.id === "sample_3";
              const isLaundered = sample.id === "sample_4";
              const isCloned = sample.id === "sample_5";

              return (
                <button
                  key={sample.id}
                  onClick={() => onSelectSample(sample.id)}
                  disabled={isLoading}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start space-x-2.5 group relative overflow-hidden ${
                    isSelected
                      ? isAuthentic
                        ? "bg-watermelon-rind/30 border-watermelon-emerald/50 shadow-md shadow-watermelon-emerald/10"
                        : "bg-watermelon-darkrose/30 border-watermelon-coral/50 shadow-md shadow-watermelon-coral/10"
                      : "bg-slate-950/40 border-white/[0.05] hover:border-white/[0.14] hover:bg-white/[0.03]"
                  }`}
                >
                  {/* Left Pill Badge */}
                  <span
                    className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded uppercase mt-0.5 shrink-0 border ${
                      isSelected
                        ? isAuthentic
                          ? "bg-watermelon-emerald text-slate-950 border-watermelon-emerald"
                          : "bg-watermelon-coral text-white border-watermelon-coral"
                        : "bg-slate-900 text-slate-400 border-white/10"
                    }`}
                  >
                    S{idx + 1}
                  </span>

                  {/* Sample Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white truncate">
                        {isAuthentic && "Genuine GPay UPI"}
                        {isSpliced && "Spliced Amount ₹95k"}
                        {isParadox && "Clock Temporal Paradox"}
                        {isLaundered && "WhatsApp Recompressed"}
                        {isCloned && "ORB Keypoint Clones"}
                      </span>
                      <span
                        className={`text-[9px] font-mono uppercase font-bold shrink-0 ml-1 ${
                          isAuthentic
                            ? "text-watermelon-mint"
                            : isParadox
                              ? "text-amber-400"
                              : "text-watermelon-rose"
                        }`}
                      >
                        {isAuthentic ? "VERIFIED" : isParadox ? "PARADOX" : "TAMPER"}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 truncate mt-0.5 leading-tight">
                      {sample.scenario}
                    </p>
                  </div>

                  {isSelected && (
                    <div
                      className={`absolute right-0 top-0 bottom-0 w-1 ${
                        isAuthentic
                          ? "bg-watermelon-emerald"
                          : "bg-watermelon-coral"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Forensic Toolkit Section */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold px-1 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Forensic Toolkit</span>
          </div>

          <div className="space-y-1.5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="w-full p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-white transition-all flex items-center justify-between border border-white/[0.08]"
            >
              <div className="flex items-center space-x-2.5">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-watermelon-coral" />
                ) : (
                  <Upload className="w-4 h-4 text-watermelon-coral" />
                )}
                <span>Upload Screenshot</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">PNG/JPG</span>
            </button>

            {/* Simulate WhatsApp Button */}
            <button
              onClick={onOpenWhatsAppModal}
              disabled={isLoading}
              className="w-full p-2.5 rounded-xl bg-watermelon-emerald/10 hover:bg-watermelon-emerald/20 text-xs font-medium text-watermelon-mint transition-all flex items-center justify-between border border-watermelon-emerald/30"
            >
              <div className="flex items-center space-x-2.5">
                <Share2 className="w-4 h-4 text-watermelon-emerald" />
                <span>WhatsApp Lab</span>
              </div>
              <span className="text-[10px] font-mono text-watermelon-mint/70">Q=77</span>
            </button>

            {/* Judge Mobile QR Button */}
            <button
              onClick={onOpenMobileModal}
              disabled={isLoading}
              className="w-full p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-xs font-medium text-amber-300 transition-all flex items-center justify-between border border-amber-500/30"
            >
              <div className="flex items-center space-x-2.5">
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>Judge Mobile QR</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400/70">Wi-Fi</span>
            </button>

            {/* Printable Dossier Button */}
            <button
              onClick={onOpenReportModal}
              disabled={isLoading}
              className="w-full p-2.5 rounded-xl bg-gradient-to-r from-watermelon-coral/20 to-watermelon-crimson/20 hover:from-watermelon-coral/30 hover:to-watermelon-crimson/30 text-xs font-medium text-watermelon-rose transition-all flex items-center justify-between border border-watermelon-coral/40"
            >
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-watermelon-coral" />
                <span>Print Audit Dossier</span>
              </div>
              <span className="text-[10px] font-mono text-watermelon-coral">ISO/IEC</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Sidebar Footer */}
      <div className="p-3.5 border-t border-white/[0.08] bg-slate-950/60 flex items-center justify-between text-xs">
        <a
          href="https://github.com/syedafnan7-lab/verisight"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <Github className="w-4 h-4" />
          <span className="font-mono text-[11px]">syedafnan7-lab/verisight</span>
          <ExternalLink className="w-3 h-3 text-slate-500" />
        </a>
      </div>
    </aside>
  );
};
