import React, { useRef } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Upload,
  Share2,
  QrCode,
  FileText,
  Loader2,
  Cpu,
  Github,
  LayoutDashboard,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  FileCode,
} from "lucide-react";
import { DemoSampleMeta } from "../types/forensic";

interface TopCommandBarProps {
  demoSamples: DemoSampleMeta[];
  selectedSampleId: string | null;
  onSelectSample: (sampleId: string) => void;
  onFileUpload: (file: File) => void;
  onOpenWhatsAppModal: () => void;
  onOpenMobileModal: () => void;
  onOpenReportModal: () => void;
  isLoading: boolean;
  activeView: "INSPECTOR" | "DASHBOARD";
  onViewChange: (view: "INSPECTOR" | "DASHBOARD") => void;
}

export const TopCommandBar: React.FC<TopCommandBarProps> = ({
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
    <header className="h-16 border-b border-white/[0.08] watermelon-glass px-4 flex items-center justify-between z-30 relative">
      {/* Brand & System Indicator */}
      <div className="flex items-center space-x-3.5 min-w-[260px]">
        <div className="relative group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-watermelon-coral via-watermelon-crimson to-watermelon-rind p-0.5 shadow-lg shadow-watermelon-coral/25">
            <div className="w-full h-full bg-[#080c16] rounded-[10px] flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-watermelon-coral group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-watermelon-emerald opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-watermelon-emerald" />
          </span>
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold tracking-wider text-base bg-gradient-to-r from-white via-slate-100 to-watermelon-rose bg-clip-text text-transparent">
              VERISIGHT
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-watermelon-coral/10 text-watermelon-rose border border-watermelon-coral/30 font-semibold tracking-wider">
              WATERMELON-v1.2
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 font-mono">
            <span className="text-watermelon-emerald font-semibold">100% DETERMINISTIC</span>
            <span className="text-slate-600">•</span>
            <span>CV & METADATA CORE</span>
          </div>
        </div>
      </div>

      {/* Center Group: View Switcher + Golden Demo Sample Selector */}
      <div className="hidden md:flex items-center space-x-3">
        {/* View Switcher Segmented Control */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-white/[0.08] text-xs font-medium">
          <button
            onClick={() => onViewChange("DASHBOARD")}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              activeView === "DASHBOARD"
                ? "bg-gradient-to-r from-watermelon-coral to-watermelon-crimson text-white shadow-md shadow-watermelon-coral/20 font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => onViewChange("INSPECTOR")}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              activeView === "INSPECTOR"
                ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20 font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Deep Inspector</span>
          </button>
        </div>

        {/* Golden Demo Sample Selector Pills */}
        <div className="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-white/[0.08] overflow-x-auto max-w-[460px]">
          {demoSamples.map((sample, idx) => {
            const isSelected = selectedSampleId === sample.id;
            const isAuthentic = sample.id === "sample_1";
            return (
              <button
                key={sample.id}
                onClick={() => onSelectSample(sample.id)}
                disabled={isLoading}
                title={`${sample.title}: ${sample.scenario}`}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                  isSelected
                    ? isAuthentic
                      ? "bg-watermelon-rind/80 text-watermelon-mint border border-watermelon-emerald/50 shadow-sm shadow-watermelon-emerald/20"
                      : "bg-watermelon-darkrose/80 text-watermelon-rose border border-watermelon-coral/50 shadow-sm shadow-watermelon-coral/20"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <span className="font-mono font-bold">{`S${idx + 1}`}</span>
                <span className="hidden xl:inline text-[11px]">
                  {sample.id === "sample_1" && "Genuine"}
                  {sample.id === "sample_2" && "Spliced ₹95k"}
                  {sample.id === "sample_3" && "Clock Paradox"}
                  {sample.id === "sample_4" && "WhatsApp"}
                  {sample.id === "sample_5" && "ORB Clones"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Action Commands */}
      <div className="flex items-center space-x-2">
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
          className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white transition-all flex items-center space-x-1.5 border border-white/[0.1] shadow-sm"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-watermelon-coral" />
          ) : (
            <Upload className="w-3.5 h-3.5 text-watermelon-coral" />
          )}
          <span className="hidden sm:inline">Upload</span>
        </button>

        {/* Simulate WhatsApp Button */}
        <button
          onClick={onOpenWhatsAppModal}
          disabled={isLoading}
          className="px-3 py-1.5 rounded-xl bg-watermelon-emerald/10 hover:bg-watermelon-emerald/20 text-xs font-medium text-watermelon-mint transition-all flex items-center space-x-1.5 border border-watermelon-emerald/30"
          title="Simulate WhatsApp compression laundering"
        >
          <Share2 className="w-3.5 h-3.5 text-watermelon-emerald" />
          <span className="hidden lg:inline">WhatsApp Lab</span>
        </button>

        {/* Stage Judge Mobile QR Sync Button */}
        <button
          onClick={onOpenMobileModal}
          disabled={isLoading}
          className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-xs font-medium text-amber-300 transition-all flex items-center space-x-1.5 border border-amber-500/30"
          title="Scan QR to live-upload from phone camera"
        >
          <QrCode className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden xl:inline">Judge QR</span>
        </button>

        {/* Export Printable Dossier Button */}
        <button
          onClick={onOpenReportModal}
          disabled={isLoading}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-watermelon-coral to-watermelon-crimson hover:from-watermelon-rose hover:to-watermelon-coral text-xs font-semibold text-white transition-all flex items-center space-x-1.5 shadow-md shadow-watermelon-coral/20"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Audit Dossier</span>
        </button>

        {/* GitHub Link */}
        <a
          href="https://github.com/syedafnan7-lab/verisight"
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all border border-white/[0.08]"
          title="View on GitHub"
        >
          <Github className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
};
