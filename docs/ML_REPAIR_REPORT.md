# VeriSight ML Implementation Repair & Forensic Validation Report

**Branch:** `feature/scamshield-scaling-enhancements`  
**Execution Date:** 2026-11-11  
**Lead Engineer / Auditor:** Antigravity Forensic Engineering  
**Primary Directive:** Critical ML Implementation Repair & Parity Validation  
**Overall System Status:** `EXPERIMENTAL` (Serving & Parity Fully Repaired & Verified)  

---

## 1. Executive Summary

In accordance with the **VeriSight — Critical ML Implementation Repair & Validation Directive**, this audit and repair operation was conducted on branch `feature/scamshield-scaling-enhancements`. Rather than introducing new deep learning architectures or ungrounded models, the mandate was strictly to **repair the existing implementation, eliminate semantic discrepancies, resolve runtime model bypasses, enforce strict feature parity, and conduct leak-free scientific retraining and evaluation**.

### Summary of Audit Findings & Status Classifications:
1. **CIELAB Delta-E Disparity:** **RESOLVED (`VERIFIED`).** Legacy offline training measured black-font ink contrast ($\approx 124.0$) while live inference measured background patch discontinuity ($\approx 0.0 - 5.0$). This defect caused clean receipts to produce extreme negative $z$-scores ($z = -7.54$), saturating probability predictions to $1.000$ ($99.999\%$). Repaired by standardizing both pipelines to `cielab_patch_delta_e` (background patch margin discontinuity), achieving $z \approx -0.52$ and $P \approx 0.3412$ on clean receipts.
2. **Model Serving Bypass:** **RESOLVED (`VERIFIED`).** The live service advertised `verisight-fusion-gbdt-v1` while executing an obsolete linear logit dot product from `calibrated_weights.json`. Repaired by rewiring `MLCalibratedService` to directly deserialize and execute `verisight_fusion_gbdt_v1.joblib` containing `StandardScaler` and `CalibratedClassifierCV`.
3. **Data Leakage & Evaluation Rigor:** **RESOLVED (`VERIFIED`).** Overlapping train/test splits were eliminated. Retraining was performed strictly on 20 Development samples with Stratified 4-Fold Out-of-Fold Cross-Validation, while 7 Held-Out Test samples were completely isolated from model selection and calibration.
4. **Promotion Status Demoted to EXPERIMENTAL:** **ENFORCED (`EXPERIMENTAL`).** The champion model `verisight-fusion-gbdt-v1` was officially demoted from `PRODUCTION` to `EXPERIMENTAL` across registry entries, API metadata, and frontend UI badges.
5. **Independent External Validation:** **`UNVERIFIED`.** External generalization across uncurated real-world consumer screenshots remains unproven and awaits future independent dataset acquisition.

---

## 2. Phase-by-Phase Remediation Log

### Phase 1: Freeze and Preserve
- Backed up legacy checkpoints to `ml/checkpoints/verisight_fusion_gbdt_v1_legacy_audit.joblib` and `calibrated_weights_legacy_audit.json`.
- Updated `ml/registry/models.json` promotion status from `PRODUCTION` to `EXPERIMENTAL`.
- Preserved existing 27 benchmark samples in `ml/datasets/images/`.

### Phase 2: Trace Live Inference Path
- Discovered that `backend/app/services/forensic/ensemble/ml_calibrated_service.py` never loaded `.joblib` checkpoints.
- Documented full runtime call graph from HTTP image upload to model prediction.

### Phase 3: Canonical Feature Schema Parity (v1.0.0)
- Created `ml/src/feature_extraction/schema.py` defining:
  - `FEATURE_SCHEMA_VERSION = "1.0.0"`
  - `CANONICAL_FEATURE_NAMES` (11 features)
  - Strict mathematical bounds, missing value defaults, and `validate_and_format_feature_vector()`.
- Unified `ml/src/feature_extraction/extractor.py` to directly call production forensic analysis modules (`run_ela_analysis`, `run_wavelet_noise_analysis`, `run_copy_move_analysis`, `extract_text_tokens`, `run_baseline_laser_audit`, `run_cielab_patch_and_sharpness_audit`, and `compute_box_iou`).
- Added raw geometric IoU tracking (`synergy.max_iou`) in `calibrator.py` and passed it into feature index 7 in `pipeline.py`.

### Phase 4: Feature-Parity Test Suite
- Implemented `backend/tests/test_feature_parity.py` testing 8 distinct fixtures:
  1. Pristine synthetic payment receipt (`auth_01.png`)
  2. WhatsApp-recompressed reference (`auth_05.png`)
  3. Pixel-spliced amount manipulation (`manip_splice_01.png`)
  4. Copy-move cloning manipulation (`manip_clone_01.png`)
  5. Status bar clock paradox anomaly (`manip_paradox_01.png`)
  6. Unseen synthetic generated canvas ($720 \times 1280$)
  7. Explicit CIELAB background margin verification ($\Delta E < 15.0$, not font contrast)
  8. Live GBDT inference execution test
- All 8 tests passed with zero floating-point discrepancies ($\Delta = 0.0000$).

### Phase 5: Resolve Model Serving
- Rewrote `backend/app/services/forensic/ensemble/ml_calibrated_service.py` to load and execute `verisight_fusion_gbdt_v1.joblib`.
- Installed `scikit-learn==1.9.1`, `joblib`, and `PyWavelets` in backend Python environment (`verisight-hackstellar-ps12\.venv`).
- Added fallback heuristic handling with explicit `inference_status = "FALLBACK_HEURISTIC"` flag if checkpoint loading fails.

### Phase 6 & 7: Leak-Free Retraining & Scientific Evaluation
- Re-trained models using `ml/experiments/run_evaluation.py` on 20 Development samples with Stratified 4-Fold CV and Platt Sigmoid calibration ($cv=3$).
- Held out 7 test samples completely.
- GBDT Champion Results:
  - **Dev OOF ROC-AUC:** `0.9100` (Accuracy: `90.0%`, F1: `0.9000`, Brier: `0.0992`)
  - **Held-Out Test ROC-AUC:** `1.0000` (Accuracy: `85.7%` [6/7], False Positive Rate: `0.0%` [0/3])
  - Saved verified models to `ml/checkpoints/verisight_fusion_gbdt_v1.joblib` and `ml/checkpoints/verisight_fusion_logistic_v1.joblib`.

### Phase 8: Frontend Integration & Transparency
- Updated `frontend/src/types/forensic.ts` to include `AssessmentDimensions` and `ModelInferenceMetadata`.
- Updated `frontend/src/components/RiskDossierSidebar.tsx` to render a dedicated **"ML Fusion Engine"** dossier card featuring:
  - Badges: `EXPERIMENTAL MODEL` and `EXECUTED`.
  - Active model ID and version: `verisight-fusion-gbdt-v1 (v1.2.1 · Schema v1.0.0)`.
  - Calibrated Probability progress gauge with explicit legal disclaimers.
  - Decoupled 4 assessment dimensions: Image Integrity (A), Text Consistency (B), Payment Verification (C), and Forensic Uncertainty (D).
  - Explicit list of missing evidence caveats.
- Successfully built frontend bundle with zero TypeScript errors (`tsc && vite build`).

### Phase 9: Synthetic Generator Shortcut & Ablation Analysis
- Executed `ml/experiments/run_ablation_study.py`.
- Proved that masking watermarks and header banners does not alter model predictions ($\Delta P = 0.0000$).
- Verified robustness to luminance shifts and resolution scaling.
- Confirmed that lossy WhatsApp transcoding softens ELA residuals, accounting for the single false negative on `manip_wa_splice_03`.

---

## 3. Final Verification Status Classifications

| Dimension | Classification | Status Rationale |
|:---|:---:|:---|
| **Pipeline Feature Parity** | `VERIFIED` | 100% mathematical parity across all 11 features ($\Delta = 0.0000$). |
| **GBDT Serving Execution** | `VERIFIED` | `verisight_fusion_gbdt_v1.joblib` executed directly via `predict_proba`. |
| **CIELAB Semantic Bug Fix** | `VERIFIED` | Discontinuity measured; $1.000$ saturation defect fully eliminated. |
| **Model Promotion Status** | `EXPERIMENTAL` | Champion model promoted only to `EXPERIMENTAL`, not `PRODUCTION`. |
| **Independent External Validation** | `UNVERIFIED` | Generalization beyond the 27 synthetic benchmark samples remains unproven. |
| **Standalone Financial Settlement** | `BLOCKED` | Digital screenshots cannot independently prove financial transfers. |

---

## 4. Primary Deliverables Generated

1. `docs/ML_REPAIR_REPORT.md` (This document)
2. `docs/FEATURE_SCHEMA.md` (Detailed 11-feature mathematical specification and units)
3. `docs/FEATURE_PARITY_REPORT.md` (Comparison table across fixtures proving parity)
4. `docs/MODEL_RUNTIME_VERIFICATION.md` (Trace showing `.joblib` is actually executing)
5. `docs/UPDATED_EVALUATION.md` (Clean Dev OOF metrics vs Held-out Test metrics)
6. `docs/KNOWN_LIMITATIONS.md` (Dataset boundaries, FPR analysis, and synthetic limits)
7. `backend/tests/test_feature_parity.py` (Automated pytest parity test suite)
8. `ml/experiments/run_ablation_study.py` (Generator artifact ablation study)
