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
    <aside className="w-72 xl:w-80 h-full border-r border-[#efebce]/10 watermelon-glass flex flex-col justify-between shrink-0 select-none z-30">
      {/* 1. Brand & Core Header */}
      <div className="p-4 border-b border-[#efebce]/10 bg-[#0c0e12]/80">
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#bb8588] via-[#d8a48f] to-[#a3a380] p-0.5 shadow-lg shadow-[#bb8588]/20">
              <div className="w-full h-full bg-[#0c0e12] rounded-[14px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-[#bb8588] group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a3a380] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#a3a380]" />
            </span>
          </div>

          <div className="overflow-hidden">
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold tracking-wider text-base bg-gradient-to-r from-[#efebce] via-[#d6ce93] to-[#d8a48f] bg-clip-text text-transparent">
                VERISIGHT
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[#bb8588]/15 text-[#bb8588] border border-[#bb8588]/30 font-semibold tracking-wider">
                v1.2
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-[10px] text-[#a3a380] font-mono mt-0.5">
              <span className="text-[#a3a380] font-semibold">100% DETERMINISTIC</span>
              <span className="text-slate-600">•</span>
              <span>CORE ONLINE</span>
            </div>
          </div>
        </div>

        {/* View Switcher Controls */}
        <div className="mt-4 grid grid-cols-2 gap-1.5 bg-[#0c0e12]/90 p-1 rounded-xl border border-[#efebce]/10 text-xs font-medium">
          <button
            onClick={() => onViewChange("DASHBOARD")}
            className={`py-2 px-2.5 rounded-lg flex items-center justify-center space-x-2 transition-all ${
              activeView === "DASHBOARD"
                ? "bg-gradient-to-r from-[#bb8588] to-[#d8a48f] text-[#0c0e12] shadow-md shadow-[#bb8588]/25 font-bold"
                : "text-[#efebce]/70 hover:text-[#efebce] hover:bg-white/[0.04]"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => onViewChange("INSPECTOR")}
            className={`py-2 px-2.5 rounded-lg flex items-center justify-center space-x-2 transition-all ${
              activeView === "INSPECTOR"
                ? "bg-gradient-to-r from-[#a3a380] to-[#d6ce93] text-[#0c0e12] shadow-md shadow-[#a3a380]/25 font-bold"
                : "text-[#efebce]/70 hover:text-[#efebce] hover:bg-white/[0.04]"
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
          <div className="flex items-center justify-between text-[11px] font-mono text-[#a3a380] uppercase tracking-wider font-semibold px-1">
            <span className="flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-[#d8a48f]" />
              <span>Evidence Samples</span>
            </span>
            <span className="text-[#a3a380]/60 text-[10px]">
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

              // Color accents per scenario from user's palette
              const accentColor = isAuthentic
                ? "#a3a380" // dry-sage
                : isParadox
                  ? "#d6ce93" // vanilla-custard
                  : isLaundered
                    ? "#d8a48f" // light-bronze
                    : "#bb8588"; // dusty-rose

              return (
                <button
                  key={sample.id}
                  onClick={() => onSelectSample(sample.id)}
                  disabled={isLoading}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start space-x-2.5 group relative overflow-hidden ${
                    isSelected
                      ? isAuthentic
                        ? "bg-[#a3a380]/15 border-[#a3a380]/50 shadow-md shadow-[#a3a380]/10"
                        : isParadox
                          ? "bg-[#d6ce93]/15 border-[#d6ce93]/50 shadow-md shadow-[#d6ce93]/10"
                          : "bg-[#bb8588]/15 border-[#bb8588]/50 shadow-md shadow-[#bb8588]/10"
                      : "bg-[#0c0e12]/50 border-[#efebce]/[0.06] hover:border-[#efebce]/20 hover:bg-white/[0.03]"
                  }`}
                >
                  {/* Left Pill Badge */}
                  <span
                    className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded uppercase mt-0.5 shrink-0 border ${
                      isSelected
                        ? "bg-[#efebce] text-[#0c0e12] border-[#efebce]"
                        : "bg-[#161a22] text-[#a3a380] border-[#efebce]/10"
                    }`}
                  >
                    S{idx + 1}
                  </span>

                  {/* Sample Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#efebce] truncate">
                        {isAuthentic && "Genuine GPay UPI"}
                        {isSpliced && "Spliced Amount ₹95k"}
                        {isParadox && "Clock Temporal Paradox"}
                        {isLaundered && "WhatsApp Recompressed"}
                        {isCloned && "ORB Keypoint Clones"}
                      </span>
                      <span
                        className="text-[9px] font-mono uppercase font-bold shrink-0 ml-1"
                        style={{ color: accentColor }}
                      >
                        {isAuthentic ? "VERIFIED" : isParadox ? "PARADOX" : "TAMPER"}
                      </span>
                    </div>

                    <p className="text-[10px] text-[#a3a380] truncate mt-0.5 leading-tight">
                      {sample.scenario}
                    </p>
                  </div>

                  {isSelected && (
                    <div
                      className="absolute right-0 top-0 bottom-0 w-1"
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Forensic Toolkit Section */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono text-[#a3a380] uppercase tracking-wider font-semibold px-1 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#d6ce93]" />
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
              className="w-full p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-[#efebce] transition-all flex items-center justify-between border border-[#efebce]/10"
            >
              <div className="flex items-center space-x-2.5">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#d8a48f]" />
                ) : (
                  <Upload className="w-4 h-4 text-[#d8a48f]" />
                )}
                <span>Upload Screenshot</span>
              </div>
              <span className="text-[10px] font-mono text-[#a3a380]/60">PNG/JPG</span>
            </button>

            {/* Simulate WhatsApp Button */}
            <button
              onClick={onOpenWhatsAppModal}
              disabled={isLoading}
              className="w-full p-2.5 rounded-xl bg-[#a3a380]/10 hover:bg-[#a3a380]/20 text-xs font-medium text-[#efebce] transition-all flex items-center justify-between border border-[#a3a380]/30"
            >
              <div className="flex items-center space-x-2.5">
                <Share2 className="w-4 h-4 text-[#a3a380]" />
                <span>WhatsApp Lab</span>
              </div>
              <span className="text-[10px] font-mono text-[#a3a380]">Q=77</span>
            </button>

            {/* Judge Mobile QR Button */}
            <button
              onClick={onOpenMobileModal}
              disabled={isLoading}
              className="w-full p-2.5 rounded-xl bg-[#d6ce93]/10 hover:bg-[#d6ce93]/20 text-xs font-medium text-[#d6ce93] transition-all flex items-center justify-between border border-[#d6ce93]/30"
            >
              <div className="flex items-center space-x-2.5">
                <QrCode className="w-4 h-4 text-[#d6ce93]" />
                <span>Judge Mobile QR</span>
              </div>
              <span className="text-[10px] font-mono text-[#d6ce93]/70">Wi-Fi</span>
            </button>

            {/* Printable Dossier Button */}
            <button
              onClick={onOpenReportModal}
              disabled={isLoading}
              className="w-full p-2.5 rounded-xl bg-gradient-to-r from-[#bb8588]/20 to-[#d8a48f]/20 hover:from-[#bb8588]/30 hover:to-[#d8a48f]/30 text-xs font-medium text-[#efebce] transition-all flex items-center justify-between border border-[#bb8588]/40"
            >
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-[#bb8588]" />
                <span>Print Audit Dossier</span>
              </div>
              <span className="text-[10px] font-mono text-[#bb8588]">ISO/IEC</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Sidebar Footer */}
      <div className="p-3.5 border-t border-[#efebce]/10 bg-[#0c0e12]/80 flex items-center justify-between text-xs">
        <a
          href="https://github.com/syedafnan7-lab/verisight"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-[#a3a380] hover:text-[#efebce] transition-colors"
        >
          <Github className="w-4 h-4" />
          <span className="font-mono text-[11px]">syedafnan7-lab/verisight</span>
          <ExternalLink className="w-3 h-3 text-[#a3a380]/60" />
        </a>
      </div>
    </aside>
  );
};
