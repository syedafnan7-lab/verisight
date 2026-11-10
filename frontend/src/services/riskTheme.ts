export type RiskLevel =
  | "LOW"
  | "MODERATE"
  | "ELEVATED"
  | "CRITICAL"
  | "UNKNOWN"
  | "DATA_ERROR";

export const DEFAULT_CRITICAL_RISK_THRESHOLD = 87.0;
export const STORAGE_KEY_THRESHOLD = "verisight_critical_threshold";

export interface RiskState {
  score: number | null;
  level: RiskLevel;
  label: string;
  shortLabel: string;
  subtext: string;
  accentColor: string;
  glowColor: string;
  bgTint: string;
  borderColor: string;
  bannerBg: string;
  criticalThreshold: number;
  isCritical: boolean;
}

/**
 * Retrieves the persisted critical risk threshold from localStorage,
 * falling back to DEFAULT_CRITICAL_RISK_THRESHOLD (87.0).
 */
export function getSavedCriticalThreshold(): number {
  if (typeof window === "undefined" || !window.localStorage) {
    return DEFAULT_CRITICAL_RISK_THRESHOLD;
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY_THRESHOLD);
    if (saved !== null) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
        return Math.round(parsed * 10) / 10;
      }
    }
  } catch {
    // localStorage restricted or disabled
  }
  return DEFAULT_CRITICAL_RISK_THRESHOLD;
}

/**
 * Persists the user-configured critical risk threshold.
 */
export function saveCriticalThreshold(threshold: number): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    const clamped = Math.min(100, Math.max(0, Math.round(threshold * 10) / 10));
    localStorage.setItem(STORAGE_KEY_THRESHOLD, clamped.toString());
  } catch {
    // ignore
  }
}

/**
 * Resets the critical risk threshold back to default (87.0).
 */
export function resetSavedCriticalThreshold(): number {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.removeItem(STORAGE_KEY_THRESHOLD);
    } catch {
      // ignore
    }
  }
  return DEFAULT_CRITICAL_RISK_THRESHOLD;
}

/**
 * Evaluates the deterministic risk state from a forensic score and threshold.
 * 
 * Risk Bands:
 * - LOW: 0.00 – 39.99
 * - MODERATE: 40.00 – 69.99
 * - ELEVATED: 70.00 – (threshold - 0.01) (default: 70.00 – 86.99)
 * - CRITICAL: >= threshold (default: >= 87.00)
 * - UNKNOWN: score is null or undefined
 * - DATA_ERROR: score < 0 or score > 100 or isNaN
 */
export function evaluateRiskState(
  score: number | null | undefined,
  criticalThreshold: number = DEFAULT_CRITICAL_RISK_THRESHOLD,
): RiskState {
  const threshold = Math.min(100, Math.max(0, criticalThreshold));

  // 1. Missing score check (never interpret as 0)
  if (score === null || score === undefined) {
    return {
      score: null,
      level: "UNKNOWN",
      label: "RISK ASSESSMENT PENDING",
      shortLabel: "UNKNOWN",
      subtext: "No forensic score available. Evidence ingestion or pipeline execution required.",
      accentColor: "#64748b",
      glowColor: "rgba(100, 116, 139, 0.2)",
      bgTint: "rgba(100, 116, 139, 0.02)",
      borderColor: "rgba(100, 116, 139, 0.3)",
      bannerBg: "rgba(15, 23, 42, 0.8)",
      criticalThreshold: threshold,
      isCritical: false,
    };
  }

  // 2. Data validation check
  if (typeof score !== "number" || isNaN(score) || score < 0 || score > 100) {
    return {
      score: null,
      level: "DATA_ERROR",
      label: "DATA INTEGRITY ERROR",
      shortLabel: "ERROR",
      subtext: `Invalid forensic score value received (${String(score)}). Value must be between 0 and 100.`,
      accentColor: "#f43f5e",
      glowColor: "rgba(244, 63, 94, 0.3)",
      bgTint: "rgba(244, 63, 94, 0.08)",
      borderColor: "rgba(244, 63, 94, 0.6)",
      bannerBg: "rgba(136, 19, 55, 0.8)",
      criticalThreshold: threshold,
      isCritical: true,
    };
  }

  // Check thresholds against raw numeric score without pre-rounding
  // 3. Critical Risk (score >= threshold)
  if (score >= threshold) {
    return {
      score: Math.round(score * 10) / 10,
      level: "CRITICAL",
      label: "CRITICAL RISK — POSSIBLE FRAUD / SUSPECTED MANIPULATION",
      shortLabel: "CRITICAL RISK",
      subtext:
        "The forensic engine detected a high concentration of suspicious indicators. Immediate human review is recommended. This automated assessment does not independently establish fraud.",
      accentColor: "#f43f5e",
      glowColor: "rgba(244, 63, 94, 0.35)",
      bgTint: "rgba(225, 29, 72, 0.08)",
      borderColor: "rgba(244, 63, 94, 0.6)",
      bannerBg: "rgba(76, 5, 25, 0.85)",
      criticalThreshold: threshold,
      isCritical: true,
    };
  }

  // 4. Elevated Risk (70 <= score < threshold)
  if (score >= 70) {
    return {
      score: Math.round(score * 10) / 10,
      level: "ELEVATED",
      label: "ELEVATED RISK — Multiple suspicious indicators detected",
      shortLabel: "ELEVATED RISK",
      subtext:
        "Multiple structural or pixel-level inconsistencies were identified across inspection layers. Close examination recommended.",
      accentColor: "#f97316",
      glowColor: "rgba(249, 115, 22, 0.28)",
      bgTint: "rgba(249, 115, 22, 0.05)",
      borderColor: "rgba(249, 115, 22, 0.45)",
      bannerBg: "rgba(67, 26, 7, 0.85)",
      criticalThreshold: threshold,
      isCritical: false,
    };
  }

  // 5. Moderate Risk (40 <= score < 70)
  if (score >= 40) {
    return {
      score: Math.round(score * 10) / 10,
      level: "MODERATE",
      label: "MODERATE RISK — Additional review recommended",
      shortLabel: "MODERATE RISK",
      subtext:
        "Inconclusive indicators or isolated compression anomalies detected. Verify with recipient or issuing bank.",
      accentColor: "#f59e0b",
      glowColor: "rgba(245, 158, 11, 0.22)",
      bgTint: "rgba(245, 158, 11, 0.035)",
      borderColor: "rgba(245, 158, 11, 0.4)",
      bannerBg: "rgba(69, 39, 8, 0.85)",
      criticalThreshold: threshold,
      isCritical: false,
    };
  }

  // 6. Low Risk (0 <= score < 40)
  return {
    score: Math.round(score * 10) / 10,
    level: "LOW",
    label: "LOW RISK — No critical manipulation indicators detected",
    shortLabel: "LOW RISK",
    subtext:
      "Signals appear consistent with standard mobile capture. This does not verify bank ledger settlement or merchant identity.",
    accentColor: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.2)",
    bgTint: "rgba(16, 185, 129, 0.02)",
    borderColor: "rgba(16, 185, 129, 0.35)",
    bannerBg: "rgba(6, 78, 59, 0.8)",
    criticalThreshold: threshold,
    isCritical: false,
  };
}

/**
 * Injects CSS custom properties into a target element (e.g. document.documentElement).
 */
export function applyRiskCssVariables(riskState: RiskState, target?: HTMLElement): void {
  const el = target || (typeof document !== "undefined" ? document.documentElement : null);
  if (!el) return;

  el.style.setProperty("--risk-accent", riskState.accentColor);
  el.style.setProperty("--risk-glow", riskState.glowColor);
  el.style.setProperty("--risk-bg-tint", riskState.bgTint);
  el.style.setProperty("--risk-border", riskState.borderColor);
  el.style.setProperty("--risk-banner-bg", riskState.bannerBg);
  el.setAttribute("data-risk-level", riskState.level.toLowerCase());
}
