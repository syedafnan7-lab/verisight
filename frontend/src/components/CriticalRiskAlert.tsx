import React, { useState } from "react";
import { ShieldAlert, AlertTriangle, Target, Scale, FileText, X, ChevronDown, ChevronUp } from "lucide-react";
import { RiskState } from "../services/riskTheme";

interface CriticalRiskAlertProps {
  riskState: RiskState;
  findingCount: number;
  onInspectLocus?: () => void;
  onOpenSection91?: () => void;
  onOpenDossier?: () => void;
  onOpenThresholdModal?: () => void;
}

export const CriticalRiskAlert: React.FC<CriticalRiskAlertProps> = ({
  riskState,
  findingCount,
  onInspectLocus,
  onOpenSection91,
  onOpenDossier,
  onOpenThresholdModal,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  // Only render when risk level is CRITICAL
  if (!riskState.isCritical || riskState.level !== "CRITICAL") {
    return null;
  }

  if (isDismissed) {
    return (
      <div className="mx-4 mt-2 mb-1 flex items-center justify-between rounded-lg border border-rose-800/80 bg-rose-950/80 px-3 py-1.5 text-xs text-rose-200 shadow-lg backdrop-blur transition-all">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="h-4 w-4 text-rose-400 animate-pulse" />
          <span className="font-mono font-bold tracking-wide">
            CRITICAL RISK ACTIVE ({riskState.score?.toFixed(1)} / 100 ≥ {riskState.criticalThreshold})
          </span>
        </div>
        <button
          onClick={() => setIsDismissed(false)}
          className="flex items-center space-x-1 text-[11px] font-mono text-rose-300 hover:text-white underline cursor-pointer"
        >
          <span>Expand Alert</span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="mx-3 my-2 rounded-xl border border-rose-600/70 bg-gradient-to-r from-rose-950/90 via-[#1f060f]/95 to-rose-950/90 p-3 shadow-2xl shadow-rose-950/60 backdrop-blur-md transition-all duration-500 animate-in fade-in"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        {/* Left: Indicator & Heading */}
        <div className="flex items-start space-x-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-rose-500/40 bg-rose-900/60 shadow-inner">
            <ShieldAlert className="h-5 w-5 text-rose-400 animate-pulse" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-rose-300">
                CRITICAL FORENSIC ALERT
              </span>
              <span className="rounded bg-rose-900/90 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white border border-rose-700">
                POSSIBLE FRAUD / SUSPECTED MANIPULATION
              </span>
              <button
                onClick={onOpenThresholdModal}
                title="Configure critical threshold"
                className="rounded bg-[#070b14]/80 px-2 py-0.5 font-mono text-[10px] text-rose-300 border border-rose-800/60 hover:border-rose-500 hover:text-white cursor-pointer"
              >
                Score: <strong>{riskState.score?.toFixed(1)}</strong> / 100 (Threshold: {riskState.criticalThreshold})
              </button>
            </div>

            <p className="mt-1 text-[11px] leading-relaxed text-rose-100/90 max-w-3xl">
              The forensic engine detected a high concentration of suspicious structural indicators ({findingCount} findings). Immediate human review is recommended. <em>This automated assessment does not independently establish fraud or lack of payment settlement.</em>
            </p>
          </div>
        </div>

        {/* Right: Actions & Dismiss */}
        <div className="flex items-center gap-2 pt-2 md:pt-0 shrink-0">
          {onInspectLocus && (
            <button
              onClick={onInspectLocus}
              className="flex items-center space-x-1.5 rounded-lg border border-rose-500/60 bg-rose-900/70 px-2.5 py-1.5 font-mono text-[11px] font-semibold text-white hover:bg-rose-800 transition-colors shadow-sm cursor-pointer"
            >
              <Target className="h-3.5 w-3.5 text-rose-300" />
              <span>Inspect Locus</span>
            </button>
          )}

          {onOpenSection91 && (
            <button
              onClick={onOpenSection91}
              className="flex items-center space-x-1.5 rounded-lg border border-amber-600/70 bg-gradient-to-r from-amber-600 to-amber-700 px-2.5 py-1.5 font-mono text-[11px] font-bold text-[#070b14] hover:from-amber-500 hover:to-amber-600 transition-all shadow-sm cursor-pointer"
            >
              <Scale className="h-3.5 w-3.5 text-[#070b14]" />
              <span>Section 91 Notice</span>
            </button>
          )}

          <button
            onClick={() => setIsDismissed(true)}
            title="Minimize alert banner"
            className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-900/40 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
