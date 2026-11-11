# VeriSight — Existing Forensic ML Implementation Audit

**Document:** `docs/EXISTING_ML_IMPLEMENTATION_AUDIT.md`  
**Date:** 2026-11-11  
**Auditor:** Principal Forensic ML Architect & Digital Image Forensics Researcher  
**Branch:** `feature/verisight-ml-integrity-repair` (branched from `feature/scamshield-scaling-enhancements`)  
**Status:** `AUDITED & VERIFIED`

---

## 1. Executive Summary

This independent forensic engineering audit verifies the legacy and current state of the machine learning pipeline in the VeriSight Pro repository. Each reported vulnerability and structural defect has been tested directly against source code and runtime execution.

The engine comprises a multi-spectral feature extractor (11 deterministic signals), an ensemble calibrator, and a learned feature fusion classifier (`verisight-fusion-gbdt-v1` / `verisight-fusion-logistic-v1`).

---

## 2. Independent Verification of Known Issues (A through E)

### A. Model Runtime Mismatch (Static Weight Bypass)
* **Reported Vulnerability:** The platform claimed to serve a trained `HistGradientBoostingClassifier` (`verisight-fusion-gbdt-v1.joblib`), but live backend execution bypassed the serialized model and evaluated an obsolete linear logit dot-product from `calibrated_weights.json`.
* **Verification & Audit Findings:**
  * In the legacy codebase prior to commit `b8dabfb`, `ml_calibrated_service.py` imported static arrays `mean`, `scale`, `coef`, and `intercept` from `calibrated_weights.json`. The trained `.joblib` model was completely unreferenced in runtime inference.
  * In `feature/scamshield-scaling-enhancements` (and verified in this repair branch), `ml_calibrated_service.py` now directly loads `CHECKPOINT_PATH = BASE_DIR / "ml" / "checkpoints" / "verisight_fusion_gbdt_v1.joblib"` using `joblib.load()` on service initialization.
  * Live inference validates that `self._calibrated_model.predict_proba(x_scaled)[0, 1]` is actively executed, and the inference status is explicitly set to `"EXECUTED"`. Fallback heuristic execution is triggered only if the artifact is missing or corrupted.
* **Status:** `RESOLVED & VERIFIED`.

---

### B. CIELAB Feature Discrepancy (Font Ink vs. Background Patch)
* **Reported Vulnerability:** Offline training feature extraction calculated font ink contrast ($\Delta E \approx 124.0$ comparing inner character glyph to outer white canvas), whereas live runtime inference calculated background patch margin discontinuity ($\Delta E \approx 0.0 - 5.0$ comparing local character margin to outer reference card).
* **Impact:** Clean, authentic payment screenshots produced an extreme standardized feature outlier ($z = -7.54$), saturating the calibrated probability to $P(\text{Tampered}) \approx 0.9999$ ($99.999\%$).
* **Verification & Audit Findings:**
  * The defect was reproduced in legacy `extractor.py`: `inner = lab[by:by+bh, bx:bx+bw]` sampled the inner glyph pixels directly, measuring text contrast instead of background patch tampering.
  * In the repaired implementation (`schema.py` v1.0.0 and updated `extractor.py`), both training and runtime call the canonical `run_cielab_patch_and_sharpness_audit()`, which explicitly samples a 2px–12px perimeter margin around the token.
  * Verified via `backend/tests/test_feature_parity.py`: On clean synthetic GPAY receipts, $\Delta E$ is now strictly $< 2.0$, producing normal standardized scores ($z \approx -0.52$) and non-saturated probabilities ($P \approx 0.34 - 0.38$).
* **Status:** `RESOLVED & VERIFIED`.

---

### C. Data Leakage & Split Partitioning
* **Reported Vulnerability:** The original benchmark defined 27 samples with split assignments (12 Training, 6 Validation, 1 Calibration, 8 Final Test), but all 27 samples were fed indiscriminately into cross-validation and calibration fitting.
* **Verification & Audit Findings:**
  * Source inspection of legacy `run_evaluation.py` confirmed that `X` and `y` arrays contained all 27 samples without masking out `FINAL_TEST`.
  * In the repaired pipeline, `run_evaluation.py` explicitly isolates:
    ```python
    dev_mask = (splits != "FINAL_TEST")
    test_mask = (splits == "FINAL_TEST")
    X_dev, y_dev = X[dev_mask], y[dev_mask]    # 20 samples (Dev CV)
    X_test, y_test = X[test_mask], y[test_mask] # 7 samples (Strictly Held-Out)
    ```
  * `X_test` is never seen by `StandardScaler.fit()`, Stratified K-Fold CV, or `CalibratedClassifierCV`.
* **Status:** `RESOLVED & VERIFIED`.

---

### D. Frontend Integration & Telemetry Binding
* **Reported Vulnerability:** The backend emitted decoupled `assessment_dimensions` and `model_metadata`, but the frontend UI did not render them.
* **Verification & Audit Findings:**
  * Source inspection of `frontend/src/components/RiskDossierSidebar.tsx` and `types/forensic.ts` confirms full component binding.
  * The Risk Dossier renders an **ML Fusion Engine** card displaying:
    * Active Model: `verisight-fusion-gbdt-v1` (v1.2.1 · Schema v1.0.0)
    * Status Badges: `EXPERIMENTAL MODEL` and `EXECUTED`
    * Calibrated posterior probability bar with threshold indicator
    * Decoupled Dimensions: Image Integrity, Text Consistency, Payment Verification, and Forensic Uncertainty
    * Missing Evidence Caveats list (e.g., absence of NPCI banking ledger rails).
* **Status:** `RESOLVED & VERIFIED`.

---

### E. Newer WhatsApp Experiment Metric Inconsistency
* **Reported Vulnerability:** An experimental report cited an F1-score of 85.71% in one KPI, while the confusion matrix reported an F1 of approximately 89.36%.
* **Investigation & Root-Cause Resolution:**
  * The **85.71%** KPI was the out-of-fold cross-validation $F_1$ score of the **L2 Logistic Regression model** (`learned_fusion_logistic`) at the standard decision boundary ($P \ge 0.50$): $\text{Precision} = 1.000$, $\text{Recall} = 0.750$, $F_1 = 2 \cdot \frac{1.0 \cdot 0.75}{1.0 + 0.75} = 0.8571$.
  * The **89.36%** metric was calculated from the **heuristic triage rule** ($21$ TP, $2$ FP, $3$ FN, $18$ TN): $F_1 = \frac{2 \cdot 21}{2 \cdot 21 + 2 + 3} = \frac{42}{47} \approx 0.8936$.
  * The **84.00%** metric belonged to the **GBDT Fusion model** (`learned_fusion_gbdt`): $\text{Precision} = 0.8077$, $\text{Recall} = 0.8750$, $F_1 = 0.8400$.
  * **Resolution:** Metrics must never be conflated. Every metric in VeriSight documentation is now explicitly labeled with its specific model architecture, dataset split, decision cutoff, and validation protocol.
* **Status:** `EXPLAINED & RESOLVED`.

---

## 3. Summary of Engine Architecture

```
[Input Screenshot]
       │
       ▼
[Canonical Feature Extraction (v1.0.0)] ── 11 Standardized Signals
       │
       ├──────────────────────────────────────────────┐
       ▼                                              ▼
[Layer 1-4 Heuristic Triage]             [Live GBDT Checkpoint Inference]
- ELA Z-Scores                           - StandardScaler (x_scaled)
- Wavelet Void (DWT db4)                 - CalibratedClassifierCV (cv=3)
- Sub-Pixel Baseline Drift               - Output: Calibrated P(Tampered | x)
- Background Margin Delta E
- Cross-Layer Spatial IoU Synergy
       │                                              │
       ▼                                              ▼
[Operational Triage Score (0-100)]       [Forensic Risk Dossier & Telemetry]
- Cutoff: 87.0 (Triage Alert)            - 4 Decoupled Dimensions
- Verdicts: AUTHENTIC / SUSPICIOUS /     - Missing Evidence Caveats
            MANIPULATED_FORGERY          - Statutory Summons Draft (Sec 94 BNSS)
```

**Approval Status:** The active model `verisight-fusion-gbdt-v1` remains formally classified as `EXPERIMENTAL` pending multi-brand real-world dataset validation.
