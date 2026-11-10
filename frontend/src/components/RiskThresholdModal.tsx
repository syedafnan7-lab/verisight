import React, { useState, useEffect } from "react";
import { Sliders, RotateCcw, Check, X, ShieldAlert, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";
import { DEFAULT_CRITICAL_RISK_THRESHOLD, evaluateRiskState, RiskLevel } from "../services/riskTheme";

interface RiskThresholdModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentThreshold: number;
  currentScore: number | null | undefined;
  onSaveThreshold: (newThreshold: number) => void;
}

export const RiskThresholdModal: React.FC<RiskThresholdModalProps> = ({
  isOpen,
  onClose,
  currentThreshold,
  currentScore,
  onSaveThreshold,
}) => {
  const [thresholdValue, setThresholdValue] = useState<number>(currentThreshold);

  useEffect(() => {
    setThresholdValue(currentThreshold);
  }, [currentThreshold, isOpen]);

  if (!isOpen) return null;

  const currentEvaluation = evaluateRiskState(currentScore, currentThreshold);
  const previewEvaluation = evaluateRiskState(currentScore, thresholdValue);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      setThresholdValue(Math.min(100, Math.max(0, Math.round(val * 10) / 10)));
    }
  };

  const handleReset = () => {
    setThresholdValue(DEFAULT_CRITICAL_RISK_THRESHOLD);
  };

  const handleSave = () => {
    onSaveThreshold(thresholdValue);
    onClose();
  };

  const getBadgeColor = (level: RiskLevel) => {
    switch (level) {
      case "CRITICAL":
        return "bg-rose-950 text-rose-300 border-rose-700";
      case "ELEVATED":
        return "bg-orange-950 text-orange-300 border-orange-700";
      case "MODERATE":
        return "bg-amber-950 text-amber-300 border-amber-700";
      case "LOW":
        return "bg-emerald-950 text-emerald-300 border-emerald-700";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#334155] bg-[#0b1220] p-6 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-400">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#f8fafc]">
                Critical Risk Threshold Settings
              </h2>
              <p className="text-xs text-[#94a3b8]">
                Configure the automated fraud-alert trigger sensitivity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#64748b] hover:bg-[#1e293b] hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-5 space-y-5 text-xs">
          {/* Threshold Slider & Value Display */}
          <div className="rounded-xl border border-[#1e293b] bg-[#070b14] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono uppercase tracking-wider text-[#94a3b8] text-[11px]">
                Critical Threshold (0 – 100)
              </span>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={thresholdValue}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v)) setThresholdValue(Math.min(100, Math.max(0, v)));
                  }}
                  className="w-16 rounded border border-[#334155] bg-[#0f172a] px-2 py-1 text-center font-mono text-sm font-bold text-sky-400 focus:border-sky-500 focus:outline-none"
                />
                <span className="font-mono text-slate-500 text-xs">/ 100</span>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="0.5"
              value={thresholdValue}
              onChange={handleSliderChange}
              className="w-full accent-sky-500 h-2 bg-[#1e293b] rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[10px] font-mono text-[#64748b]">
              <span>0% (Ultra-Sensitive)</span>
              <span className="text-sky-400 font-bold">Default: 87.0%</span>
              <span>100% (High-Tolerance)</span>
            </div>
          </div>

          {/* Live Simulation / Comparison Preview */}
          <div className="rounded-xl border border-[#1e293b] bg-[#070b14] p-4 space-y-3">
            <span className="font-mono uppercase tracking-wider text-[#94a3b8] text-[11px] block">
              Live Threshold Impact Preview
            </span>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              {/* Current */}
              <div className="rounded-lg border border-[#1e293b] bg-[#0b1220] p-3 space-y-1">
                <span className="text-[#64748b] block text-[10px]">CURRENT CLASSIFICATION</span>
                <span className="text-xs font-mono font-bold text-white block">
                  Threshold: {currentThreshold.toFixed(1)}%
                </span>
                <div className={`mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getBadgeColor(currentEvaluation.level)}`}>
                  {currentEvaluation.shortLabel}
                </div>
              </div>

              {/* Proposed */}
              <div className="rounded-lg border border-sky-500/40 bg-[#0c182d] p-3 space-y-1">
                <span className="text-sky-400 block text-[10px] font-semibold">PROPOSED CLASSIFICATION</span>
                <span className="text-xs font-mono font-bold text-white block">
                  Threshold: {thresholdValue.toFixed(1)}%
                </span>
                <div className={`mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getBadgeColor(previewEvaluation.level)}`}>
                  {previewEvaluation.shortLabel}
                </div>
              </div>
            </div>

            <p className="text-[11px] leading-relaxed text-[#94a3b8] pt-1">
              {currentScore != null ? (
                <>
                  Active case score: <strong className="text-white font-mono">{currentScore.toFixed(1)}</strong> / 100.{" "}
                  {previewEvaluation.isCritical ? (
                    <span className="text-rose-400 font-semibold">
                      This score meets or exceeds the proposed threshold and will trigger Critical Risk Mode.
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-semibold">
                      This score is below the proposed threshold; Critical Risk Mode will remain inactive.
                    </span>
                  )}
                </>
              ) : (
                "No active evidence score loaded."
              )}
            </p>
          </div>

          <div className="rounded-lg bg-[#070b14]/70 p-3 border border-[#1e293b] text-[10px] text-[#64748b] leading-relaxed">
            <strong>Analytical Governance Note:</strong> Modifying this threshold adjusts the heuristic sensitivity for alert dispatch and visual styling. It does not alter the underlying deterministic mathematical measurements (sub-pixel drift, ELA variances, or hash digests).
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex items-center justify-between border-t border-[#1e293b] pt-4">
          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 rounded-lg border border-[#334155] bg-[#0f172a] px-3 py-2 text-xs font-mono text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Default (87.0)</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-xs font-mono text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-1.5 rounded-lg bg-sky-600 px-4 py-2 text-xs font-mono font-bold text-white hover:bg-sky-500 shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>Apply Threshold</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
