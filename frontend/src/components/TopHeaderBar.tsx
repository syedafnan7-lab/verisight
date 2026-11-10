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
}

export const TopHeaderBar: React.FC<TopHeaderBarProps> = ({
  report,
  activeView,
  onViewChange,
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
      {/* Right: Engine & Evidentiary Standard Status */}
      <div className="flex items-center space-x-2 shrink-0">
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#efebce]/[0.03] border border-[#efebce]/10 text-xs font-mono text-[#a3a380]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a3a380] animate-pulse" />
          <span>ISO/IEC 27037 VERIFIED</span>
        </div>
      </div>
    </header>
  );
};
