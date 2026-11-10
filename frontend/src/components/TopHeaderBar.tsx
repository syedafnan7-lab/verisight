import React from "react";
import {
  FileText,
  Upload,
  QrCode,
  Share2,
  ShieldCheck,
  AlertTriangle,
  LayoutDashboard,
  Eye,
  Sparkles,
  Layers,
  CheckCircle2,
} from "lucide-react";
import PillNav from "./ui/PillNav/PillNav";
import { ForensicAnalysisReport } from "../types/forensic";

interface TopHeaderBarProps {
  report: ForensicAnalysisReport | null;
  activeView: "DASHBOARD" | "INSPECTOR";
  onViewChange: (view: "INSPECTOR" | "DASHBOARD") => void;
  onOpenReportModal: () => void;
  onOpenMobileModal: () => void;
  onOpenWhatsAppModal: () => void;
  onUploadClick: () => void;
}

export const TopHeaderBar: React.FC<TopHeaderBarProps> = ({
  report,
  activeView,
  onViewChange,
  onOpenReportModal,
  onOpenMobileModal,
  onOpenWhatsAppModal,
  onUploadClick,
}) => {
  const isAuthentic = report?.verdict === "AUTHENTIC_VERIFIED";
  const isSuspicious = report?.verdict === "SUSPICIOUS_ANOMALIES";
  const isManipulated = report?.verdict === "MANIPULATED_FORGERY";

  return (
    <header className="h-16 border-b border-white/[0.08] watermelon-glass px-5 flex items-center justify-between shrink-0 z-20">
      {/* Left: Case Evidence Breadcrumb */}
      <div className="flex items-center space-x-3 min-w-0">
        {report ? (
          <div className="flex items-center space-x-2.5 truncate">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isAuthentic
                  ? "bg-watermelon-emerald shadow-[0_0_8px_#10b981]"
                  : isSuspicious
                    ? "bg-amber-400 shadow-[0_0_8px_#f59e0b]"
                    : "bg-watermelon-coral shadow-[0_0_8px_#f43f5e]"
              }`}
            />
            <div className="truncate">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-white font-mono truncate">
                  {report.filename || "Screenshot Evidence"}
                </span>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase border ${
                    isAuthentic
                      ? "bg-watermelon-emerald/15 text-watermelon-mint border-watermelon-emerald/40"
                      : isSuspicious
                        ? "bg-amber-950/70 text-amber-300 border-amber-600/50"
                        : "bg-watermelon-coral/15 text-watermelon-rose border-watermelon-coral/40"
                  }`}
                >
                  {report.verdict.replace(/_/g, " ")}
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-500 truncate">
                SHA-256: {report.file_sha256.slice(0, 16)}... • {report.image_width} ×{" "}
                {report.image_height} px
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs font-mono text-slate-500">
            Awaiting Evidence Analysis...
          </div>
        )}
      </div>

      {/* Center: React Bits PillNav component */}
      <div className="flex items-center justify-center px-2">
        <PillNav
          items={[
            {
              label: "Dashboard",
              href: "#dashboard",
              icon: <LayoutDashboard className="w-3.5 h-3.5" />,
            },
            {
              label: "Deep Inspector",
              href: "#inspector",
              icon: <Eye className="w-3.5 h-3.5" />,
            },
          ]}
          activeHref={activeView === "DASHBOARD" ? "#dashboard" : "#inspector"}
          onItemClick={(item) => {
            onViewChange(item.label === "Dashboard" ? "DASHBOARD" : "INSPECTOR");
          }}
          theme="dark"
          size="sm"
          surface="glass"
          itemStyle="pill"
          hoverEffect="glide"
          indicator="dot"
          highlightColor="#f43f5e"
          highlightTextColor="#ffffff"
          className="shadow-md shadow-black/40"
        />
      </div>

      {/* Right: Quick Context Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onUploadClick}
          className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-200 transition-all flex items-center space-x-1.5 border border-white/[0.08]"
        >
          <Upload className="w-3.5 h-3.5 text-watermelon-coral" />
          <span className="hidden sm:inline">Upload</span>
        </button>

        <button
          onClick={onOpenMobileModal}
          className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-xs font-medium text-amber-300 transition-all flex items-center space-x-1.5 border border-amber-500/30"
          title="Scan QR to live-upload from phone camera"
        >
          <QrCode className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">Judge QR</span>
        </button>

        <button
          onClick={onOpenReportModal}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-watermelon-coral to-watermelon-crimson hover:from-watermelon-rose hover:to-watermelon-coral text-xs font-semibold text-white transition-all flex items-center space-x-1.5 shadow-md shadow-watermelon-coral/25"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Audit Dossier</span>
        </button>
      </div>
    </header>
  );
};
