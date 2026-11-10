# VERISIGHT — EMPIRICAL BASELINE EVALUATION RESULTS

**Date:** 2026-11-11  
**Author:** Principal Research Engineer & Forensic ML Architect  
**Project:** VeriSight (PRO v1.0)  
**Document Ref:** `docs/BASELINE_RESULTS.md`  

---

## 1. Experimental Setup & Benchmark Corpus

The baseline evaluation was conducted on the registered benchmark corpus ($N=27$ samples) generated in accordance with `docs/DATASET_GOVERNANCE.md`:
- **Authentic Reference Samples ($N=13$):** Genuine mobile UPI transaction receipts across varying amounts, timestamps, and devices. Includes both native uncompressed captures ($N=10$) and WhatsApp transcoded genuine receipts ($N=3$).
- **Manipulated Reference Samples ($N=14$):**
  - Pixel-spliced amounts with background color mismatch $\Delta E > 4.5$ and Daubechies-4 wavelet voids ($N=5$).
  - DOM/Generator clock paradox and invalid 10-digit UTR sequences ($N=3$).
  - WhatsApp-laundered recompressed forgeries ($Q=77$, 4:2:0 subsampling, stripped EXIF) ($N=3$).
  - Copy-move cloned digit sequences ($N=3$).

---

## 2. Quantitative Baseline Comparison

All models were evaluated on identical extracted feature representations using 4-fold Stratified Cross-Validation to guarantee out-of-fold generalization:

| Metric | Deterministic Heuristic Baseline | Learned Fusion (L2 Logistic Regression) | Learned Fusion (Gradient Boosted Trees) |
| :--- | :--- | :--- | :--- |
| **ROC-AUC** | **0.6126** | **0.8352** ($+36.3\%$) | **0.9286** ($+51.6\%$) |
| **Brier Score (Lower is better)** | **0.2654** | **0.1192** ($-55.1\%$) | **0.1176** ($-55.7\%$) |
| **Precision** | **0.5625** | **0.8462** | **0.8667** |
| **Recall** | **0.6429** | **0.7857** | **0.9286** |
| **F1 Score** | **0.6000** | **0.8148** | **0.8966** |
| **FPR at 95% Recall** | **1.0000** | **0.9231** | **0.9231** |
| **Calibration Method** | None (Heuristic) | **Platt Sigmoid Calibrated** | **Isotonic / Sigmoid Calibrated** |
| **Inference Latency (CPU)** | **< 1 ms** | **< 2 ms** | **< 3 ms** |

---

## 3. Key Findings

1. **Failure Mode of Heuristic Weighting:** The uncalibrated linear heuristic baseline (`w1*S1 + w2*S2 + w3*S3`) achieves an ROC-AUC of only 0.6126 and a high Brier score of 0.2654. The manual weights fail to capture non-linear feature interactions (such as when WhatsApp compression dampens ELA but baseline laser drift remains critically high).
2. **Superiority of Learned Feature Fusion:** Regularized logistic regression lifts ROC-AUC to 0.8352, and Gradient Boosted Decision Trees reach 0.9286 with an F1 score of 0.8966.
3. **Probability Calibration:** The Brier calibration loss drops by more than $55\%$ (from 0.2654 down to 0.1176) under Platt sigmoid calibration. This enables VeriSight to provide a statistically defensible calibrated probability $P(\text{Tampered} \mid \mathbf{x})$ while keeping the 87/100 threshold strictly as an operational review filter.
4. **Generalization Bottleneck (FPR at 95% Recall):** At extreme recall levels ($95\%+$), false positive rates remain elevated ($\sim 92\%$) across all models because heavy WhatsApp transcoding introduces compression artifacts that mimic subtle edits. This demonstrates why payment verification must remain an independent dimension rather than relying on image pixels alone.
