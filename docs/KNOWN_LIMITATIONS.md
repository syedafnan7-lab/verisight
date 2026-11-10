# VeriSight Known Limitations & External Validation Boundaries

**Document Version:** 1.0.0  
**Status Classification:** `EXPERIMENTAL`  
**Last Updated:** 2026-11-11  

---

## 1. Classification & Status Boundaries

To prevent misleading claims of forensic infallibility or production certainty, all core components are formally classified under strict status designations:

| Dimension / Component | Status | Empirical Rationale |
|:---|:---:|:---|
| **Pipeline Feature Parity** | `VERIFIED` | 8-fixture test suite proves offline and live extraction match at $\Delta = 0.0000$. |
| **GBDT Serving Execution** | `VERIFIED` | `verisight_fusion_gbdt_v1.joblib` loaded directly via joblib; legacy bypass removed. |
| **CIELAB Semantic Bug Fix** | `VERIFIED` | Measures background patch discontinuity ($\Delta E < 2.5$ on clean images); $1.000$ saturation eliminated. |
| **Model Promotion Status** | `EXPERIMENTAL` | Evaluated strictly on 27 synthetic benchmark receipts. Not promoted to `PRODUCTION`. |
| **Independent External Validation** | `UNVERIFIED` | No external real-world consumer dataset has been evaluated. Generalization remains unproven. |
| **Standalone Financial Settlement** | `BLOCKED` | Digital screenshots cannot prove banking transfer; NPCI settlement query is mandatory. |

---

## 2. Benchmark Dataset Limitations ($N=27$)

1. **Synthetic Nature of Dataset:**
   All 27 samples in `v1.0-benchmark-27` were created using a PIL/OpenCV image synthesis pipeline simulating Google Pay, PhonePe, and Paytm receipts. While realistic, synthetic generation cannot replicate the diversity of physical smartphone screen captures, camera re-photographing (Moiré patterns), OS-level antialiasing, and device-specific display color profiles.
2. **Small Sample Size:**
   With 20 development samples and 7 held-out test samples, individual sub-categories (e.g., Copy-Move with $N=3$, DOM edits with $N=3$) have wide binomial confidence intervals. A single classification error shifts test accuracy by $14.3\%$.
3. **Template Bias:**
   The majority of synthetic samples utilize standard Android Google Pay-style cards. Third-party banking apps (BHIM, CRED, Amazon Pay, YONO SBI) with custom layouts and dark/light gradients remain unvalidated.

---

## 3. Generator Artifact & Ablation Analysis

A controlled ablation experiment was conducted (`ml/experiments/run_ablation_study.py`) to determine whether the trained GBDT model exploits generator shortcuts rather than genuine forensic tampering signals:

### A. Watermark & Header Banner Removal
- **Hypothesis:** The model might detect synthetic receipts by identifying watermark artifacts or header banner edges.
- **Test:** Masked top 12% and bottom 10% of the image with the mean card background color.
- **Finding:** Calibrated probability on `auth_01` remained identical ($P = 0.3412$, $\Delta = 0.0000$). The model does not rely on banner edges or watermarks.

### B. Transcoding & Compression Perturbations
- **Hypothesis:** Heavy compression will induce spurious ELA or wavelet void alarms on clean images.
- **Test:** Re-compressed clean images at JPEG $Q \in \{95, 80, 60\}$.
- **Finding:** Probability remained well below fraud threshold ($P \approx 0.3261$). However, on tampered images, lossy WhatsApp recompression was shown to suppress high-frequency ELA residuals, resulting in 1 false negative on the held-out test set (`manip_wa_splice_03`).

### C. Resolution & Display Scaling
- **Hypothesis:** Scaling or non-native viewport resolutions degrade sub-pixel baseline OLS and DCT block alignments.
- **Test:** Resized images by $0.8\times$ and $1.25\times$.
- **Finding:** At $1.25\times$ scaling, interpolation artifacts caused ELA noise to rise slightly ($P = 0.4260$, still below $0.50$). For images with width $< 300\text{px}$, algorithmic SNR collapses, requiring the pipeline to return `INCONCLUSIVE`.

---

## 4. Fundamental Forensic Boundaries

1. **Screenshots Are Not Bank Settlements:**
   A pixel-perfect, completely authentic screenshot can still be paired with an uncompleted, reversed, or fake financial transaction. Independent confirmation against bank ledger APIs or NPCI UTR settlement logs is mandatory before disbursing funds or releasing goods.
2. **Anti-Forensic Attacks:**
   Adversaries who re-photograph screens with a smartphone camera (display re-capture) or apply adversarial noise filtering can disguise digital splicing boundaries.
3. **Inconclusive Determinations:**
   When an image has been transcoded multiple times or resized below 300px, the engine refuses to output high-confidence predictions, explicitly returning `MODERATE_UNCERTAINTY` or `INCONCLUSIVE`.
