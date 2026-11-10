import test from "node:test";
import assert from "node:assert/strict";

// Import compiled or transpile-free implementation for Node test runner
import {
  evaluateRiskState,
  DEFAULT_CRITICAL_RISK_THRESHOLD,
  getSavedCriticalThreshold,
  saveCriticalThreshold,
  resetSavedCriticalThreshold,
} from "../riskTheme.ts";

test("Risk Theme Engine - Default Threshold Value", () => {
  assert.equal(DEFAULT_CRITICAL_RISK_THRESHOLD, 87.0);
});

test("Risk Theme Engine - Exact Boundary Classifications", () => {
  // Score 18.4: LOW
  const s18_4 = evaluateRiskState(18.4);
  assert.equal(s18_4.level, "LOW");
  assert.equal(s18_4.isCritical, false);
  assert.equal(s18_4.accentColor, "#10b981");

  // Score 39.99: LOW
  const s39_99 = evaluateRiskState(39.99);
  assert.equal(s39_99.level, "LOW");
  assert.equal(s39_99.isCritical, false);

  // Score 40: MODERATE
  const s40 = evaluateRiskState(40);
  assert.equal(s40.level, "MODERATE");
  assert.equal(s40.isCritical, false);
  assert.equal(s40.accentColor, "#f59e0b");

  // Score 69.99: MODERATE
  const s69_99 = evaluateRiskState(69.99);
  assert.equal(s69_99.level, "MODERATE");
  assert.equal(s69_99.isCritical, false);

  // Score 70: ELEVATED
  const s70 = evaluateRiskState(70);
  assert.equal(s70.level, "ELEVATED");
  assert.equal(s70.isCritical, false);
  assert.equal(s70.accentColor, "#f97316");

  // Score 86.99: ELEVATED (below default 87)
  const s86_99 = evaluateRiskState(86.99);
  assert.equal(s86_99.level, "ELEVATED");
  assert.equal(s86_99.isCritical, false);

  // Score 87: CRITICAL
  const s87 = evaluateRiskState(87);
  assert.equal(s87.level, "CRITICAL");
  assert.equal(s87.isCritical, true);
  assert.equal(s87.accentColor, "#f43f5e");

  // Score 87.01: CRITICAL
  const s87_01 = evaluateRiskState(87.01);
  assert.equal(s87_01.level, "CRITICAL");
  assert.equal(s87_01.isCritical, true);

  // Score 100: CRITICAL
  const s100 = evaluateRiskState(100);
  assert.equal(s100.level, "CRITICAL");
  assert.equal(s100.isCritical, true);
});

test("Risk Theme Engine - Missing and Invalid Scores", () => {
  // Missing (null) -> UNKNOWN
  const sNull = evaluateRiskState(null);
  assert.equal(sNull.level, "UNKNOWN");
  assert.equal(sNull.isCritical, false);
  assert.equal(sNull.score, null);

  // Missing (undefined) -> UNKNOWN
  const sUndef = evaluateRiskState(undefined);
  assert.equal(sUndef.level, "UNKNOWN");
  assert.equal(sUndef.isCritical, false);

  // Invalid: negative -> DATA_ERROR
  const sNeg = evaluateRiskState(-5);
  assert.equal(sNeg.level, "DATA_ERROR");

  // Invalid: over 100 -> DATA_ERROR
  const sOver = evaluateRiskState(105);
  assert.equal(sOver.level, "DATA_ERROR");

  // Invalid: NaN -> DATA_ERROR
  const sNan = evaluateRiskState(NaN);
  assert.equal(sNan.level, "DATA_ERROR");
});

test("Risk Theme Engine - Score Transitions", () => {
  // Score drops from 90 to 50
  const high = evaluateRiskState(90);
  assert.equal(high.level, "CRITICAL");
  assert.equal(high.isCritical, true);

  const reduced = evaluateRiskState(50);
  assert.equal(reduced.level, "MODERATE");
  assert.equal(reduced.isCritical, false);

  // Score increases from 50 to 90
  const increased = evaluateRiskState(90);
  assert.equal(increased.level, "CRITICAL");
  assert.equal(increased.isCritical, true);
});

test("Risk Theme Engine - Custom Configured Threshold", () => {
  // Lower threshold to 75
  const s74 = evaluateRiskState(74, 75);
  assert.equal(s74.level, "ELEVATED");
  assert.equal(s74.isCritical, false);

  const s76 = evaluateRiskState(76, 75);
  assert.equal(s76.level, "CRITICAL");
  assert.equal(s76.isCritical, true);

  // Higher threshold to 95
  const s90 = evaluateRiskState(90, 95);
  assert.equal(s90.level, "ELEVATED");
  assert.equal(s90.isCritical, false);

  const s95 = evaluateRiskState(95, 95);
  assert.equal(s95.level, "CRITICAL");
  assert.equal(s95.isCritical, true);
});
