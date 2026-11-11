export function verdictLabel(verdict: string, score?: number): string {
  if (
    verdict === "AUTHENTIC_VERIFIED" ||
    verdict === "AUTHENTIC" ||
    verdict === "INCONCLUSIVE" ||
    (score !== undefined && score < 25)
  ) {
    return "Likely authentic";
  }
  if (
    verdict === "CORROBORATED_ANOMALIES" ||
    verdict === "MANIPULATED_FORGERY" ||
    (score !== undefined && score >= 65)
  ) {
    return "Fraud / Tampered";
  }
  return "Likely misleading";
}
