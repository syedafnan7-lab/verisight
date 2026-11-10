# VERISIGHT — MODEL SELECTION & ARCHITECTURAL DECISION

**Date:** 2026-11-11  
**Author:** Principal Research Engineer & Forensic ML Architect  
**Project:** VeriSight (PRO v1.0)  
**Document Ref:** `docs/MODEL_SELECTION_DECISION.md`  

---

## 1. Architectural Strategy & Evaluation Mandate

In digital forensics, **model complexity does not equal scientific credibility**. Forensic tools introduced in judicial or enterprise fraud-prevention environments must satisfy:
1. **Explainability:** An investigator or court must understand *why* an anomaly was flagged (e.g., "The font baseline drops 3.5px below regression slope, and Daubechies wavelet energy drops to zero in this exact $48 \times 120\text{px}$ box").
2. **Deterministic Reproducibility:** Repeated evaluation of identical pixel bytes must yield identical forensic measurements.
3. **Domain Alignment:** Smartphone payment screenshots have strict UI layout geometries, vector typography rendering, and lossy communication channel compression profiles.
4. **Licensing Permissibility:** No models or datasets with ambiguous or prohibited commercial licenses may be integrated into production.

---

## 2. Model Selection Decisions

### DECISION 1: REJECT Full Foundation Model Training from Scratch
* **Status:** `NOT JUSTIFIED`
* **Rationale:** Training a 50M–100M parameter visual backbone from scratch requires tens of thousands of GPU hours, millions of annotated smartphone screenshots, and months of compute. Our goal is not to train a foundation model; our goal is to solve digital payment screenshot tampering with maximum accuracy and reliability.

### DECISION 2: REJECT Heavy Scanned-Document Models (DocTamper)
* **Status:** `BLOCKED / NOT RECOMMENDED`
* **Rationale:** DocTamper's frequency perception head is tailored to physical paper grain, ink bleed, and scanning optics. When applied to digital mobile screens, clean UI rasterization boundaries produce false positive ringing. Furthermore, its dataset license is strictly non-commercial.

### DECISION 3: ADOPT Multi-Layer Feature Extraction with Dual-Stream Typographic Alignment (Primary Pipeline)
* **Status:** `VERIFIED & ADOPTED`
* **Architecture:** Retain and mathematically formalize the 4-layer inspection pipeline:
  * **Stream 1 (Signal & Frequency Residuals):** ELA, Daubechies-4 Wavelet $HH$ sub-band variance, ORB copy-move feature matching, and JPEG ghost analysis.
  * **Stream 2 (Geometric Typography & OCR Alignment):** OCR token extraction, sub-pixel baseline regression ($y = mx + c$), CIELAB perceptual patch distance ($\Delta E$), and Laplacian edge anti-aliasing Z-score.
  * **Stream 3 (Container & Protocol Integrity):** EXIF, PNG chunks, C2PA, WhatsApp transcoding fingerprinting, NPCI UPI UTR syntax verification, and temporal clock consistency.
  * **Stream 4 (Spatial IoU Synergy):** Explicit spatial cross-correlation between Stream 1 physical pixel anomalies and Stream 2 typographic anomalies.

### DECISION 4: EVALUATE Learned Feature Fusion with Calibration (Experimental Candidate)
* **Status:** `EXPERIMENTAL`
* **Architecture:** Ingest the 12 extracted forensic continuous and categorical metrics from the 4 layers into:
  1. **L2-Regularized Logistic Regression (ElasticNet)** for interpretable, monotonic probabilistic mapping.
  2. **Gradient-Boosted Decision Trees (LightGBM / XGBoost)** for non-linear feature interactions (e.g. WhatsApp compression $\times$ baseline drift).
* **Validation Constraint:** Must be evaluated via stratified 5-fold cross-validation with out-of-fold predictions to prevent data leakage and over-optimistic in-sample evaluation.

### DECISION 5: INTEGRATE Uncertainty-Aware 4-Dimensional Reporting
* **Status:** `VERIFIED & ADOPTED`
* **Dimensions:**
  1. **Image Integrity:** Physical pixel and frequency anomaly index.
  2. **Text & Transaction Consistency:** Typographic baseline alignment, font sharpness, and temporal logic.
  3. **Payment Verification:** Independent payment gateway / NPCI provider status (explicitly isolated as a separate external query).
  4. **Forensic Uncertainty:** Reliability index reflecting image resolution, compression severity, and model agreement.
* **Triage Labeling:** The 87/100 threshold is formalized as an **Operational Forensic Triage Threshold**, preventing uncalibrated fraud claims.
