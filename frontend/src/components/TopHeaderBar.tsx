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
    <header className="h-16 border-b border-[#efebce]/10 watermelon-glass px-5 flex items-center justify-between shrink-0 z-20">
      {/* Left: Case Evidence Breadcrumb */}
      <div className="flex items-center space-x-3 min-w-0">
        {report ? (
          <div className="flex items-center space-x-2.5 truncate">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isAuthentic
                  ? "bg-[#a3a380] shadow-[0_0_8px_#a3a380]"
                  : isSuspicious
                    ? "bg-[#d6ce93] shadow-[0_0_8px_#d6ce93]"
                    : "bg-[#bb8588] shadow-[0_0_8px_#bb8588]"
              }`}
            />
            <div className="truncate">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-[#efebce] font-mono truncate">
                  {report.filename || "Screenshot Evidence"}
                </span>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase border ${
                    isAuthentic
                      ? "bg-[#a3a380]/15 text-[#a3a380] border-[#a3a380]/40"
                      : isSuspicious
                        ? "bg-[#d6ce93]/15 text-[#d6ce93] border-[#d6ce93]/40"
                        : "bg-[#bb8588]/15 text-[#bb8588] border-[#bb8588]/40"
                  }`}
                >
                  {report.verdict.replace(/_/g, " ")}
                </span>
              </div>
              <div className="text-[10px] font-mono text-[#a3a380]/70 truncate">
                SHA-256: {report.file_sha256.slice(0, 16)}... • {report.image_width} ×{" "}
                {report.image_height} px
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs font-mono text-[#a3a380]/60">
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
          highlightColor="#bb8588"
          highlightTextColor="#efebce"
          className="shadow-md shadow-black/40 border border-[#efebce]/10"
        />
      </div>

      {/* Right: Quick Context Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onUploadClick}
          className="px-3 py-1.5 rounded-xl bg-[#efebce]/[0.05] hover:bg-[#efebce]/[0.1] text-xs font-semibold text-[#efebce] transition-all flex items-center space-x-1.5 border border-[#efebce]/10"
        >
          <Upload className="w-3.5 h-3.5 text-[#d8a48f]" />
          <span className="hidden sm:inline">Upload</span>
        </button>

        <button
          onClick={onOpenMobileModal}
          className="px-3 py-1.5 rounded-xl bg-[#d6ce93]/10 hover:bg-[#d6ce93]/20 text-xs font-medium text-[#d6ce93] transition-all flex items-center space-x-1.5 border border-[#d6ce93]/30"
          title="Scan QR to live-upload from phone camera"
        >
          <QrCode className="w-3.5 h-3.5 text-[#d6ce93]" />
          <span className="hidden md:inline">Judge QR</span>
        </button>

        <button
          onClick={onOpenReportModal}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#bb8588] to-[#d8a48f] hover:from-[#d8a48f] hover:to-[#bb8588] text-xs font-semibold text-[#0c0e12] transition-all flex items-center space-x-1.5 shadow-md shadow-[#bb8588]/25"
        >
          <FileText className="w-3.5 h-3.5 text-[#0c0e12]" />
          <span className="hidden sm:inline">Audit Dossier</span>
        </button>
      </div>
    </header>
  );
};
