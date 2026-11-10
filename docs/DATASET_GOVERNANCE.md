# VERISIGHT — DATASET AUDIT, GOVERNANCE & PROVENANCE POLICY

**Date:** 2026-11-11  
**Author:** Principal Research Engineer & Forensic ML Architect  
**Project:** VeriSight (PRO v1.0)  
**Document Ref:** `docs/DATASET_GOVERNANCE.md`  

---

## 1. External Dataset Audit & Licensing Matrix

| Dataset | Primary Source | Access Mode | Stated License | Commercial Rights | Forensic Domain | Ground Truth Masks | Usability in VeriSight |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **STFD (Yu et al.)** | Hugging Face / GitHub | Password Request Required | CC BY 4.0 metadata vs Academic Only notice | **Ambiguous / Restricted** | Smartphone Screenshots | Pixel-level binary masks | Benchmarking only; no redistribution |
| **DocTamper (Qu et al.)** | Baidu / Google Drive | Open Academic Download | CC BY-NC 4.0 (Non-Commercial) | **Prohibited** | Scanned Paper Documents | Pixel-level binary masks | Research comparison only |
| **AIForge-Doc (Scam-AI)**| Hugging Face Hub | Public Download | CC BY-NC-SA 4.0 | **Prohibited** | Diffusion-inpainted receipts | Bounding box & segmentation | Challenge benchmark only |
| **VeriSight Synthetic** | In-Tree Generator | Local Execution | MIT / Project Owned | **Full Commercial Rights** | Mobile Payment Receipts | Mathematical bounding boxes & delta-masks | Training, unit tests, demo fixtures |
| **Consented UPI Receipts**| Internal Collection | Signed Donor Consent | Proprietary / Internal | **Authorized Internal Use** | Real Mobile Payment Apps | Validated by transaction bank SMS/API | Validation & Calibration partition |

---

## 2. Dataset Provenance Schema

Every sample ingested into the VeriSight ML laboratory must have a registered manifest entry adhering to this JSON schema:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "VerisightSampleProvenance",
  "type": "object",
  "required": [
    "sample_id",
    "original_source_id",
    "source_dataset",
    "source_type",
    "synthetic_or_real",
    "original_or_manipulated",
    "manipulation_type",
    "license_status",
    "split_assignment"
  ],
  "properties": {
    "sample_id": { "type": "string", "description": "Unique SHA-256 derived identifier" },
    "original_source_id": { "type": "string" },
    "source_dataset": { "type": "string" },
    "source_type": { "type": "string", "enum": ["PIL_SYNTHESIS", "CONSENTED_DEVICE_CAPTURE", "EXTERNAL_BENCHMARK"] },
    "synthetic_or_real": { "type": "string", "enum": ["SYNTHETIC", "REAL"] },
    "original_or_manipulated": { "type": "string", "enum": ["ORIGINAL", "MANIPULATED"] },
    "manipulation_type": {
      "type": "string",
      "enum": ["NONE", "PIXEL_SPLICE", "DOM_EDIT", "COPY_MOVE", "TEXT_INPAINT", "GENERATOR_PARADOX"]
    },
    "manipulation_mask": { "type": ["string", "null"], "description": "Relative path to ground-truth mask PNG" },
    "original_image_reference": { "type": ["string", "null"] },
    "screenshot_template": { "type": "string", "enum": ["GPAY_UPI", "PHONEPE_UPI", "PAYTM_UPI", "GENERIC_RECEIPT"] },
    "platform_device": { "type": "string" },
    "transformation_history": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Chain of encodings, e.g. ['PNG_NATIVE', 'WHATSAPP_JPEG_Q77']"
    },
    "license_status": { "type": "string", "enum": ["PROJECT_OWNED", "CONSENTED_INTERNAL", "ACADEMIC_RESTRICTED"] },
    "split_assignment": { "type": "string", "enum": ["TRAINING", "VALIDATION", "CALIBRATION", "FINAL_TEST"] }
  }
}
```

---

## 3. Evidence Governance & Ethical Rules

1. **Zero Automated User Retraining:** Production uploads via `/api/analyze` or `/api/mobile-upload` are strictly ephemeral for investigation. Uploads are NEVER automatically converted into training labels or appended to the training corpus.
2. **Synthetic Boundary Separation:** Synthetic benchmark images must always carry the label `SYNTHETIC_BENCHMARK` and an explicit watermark banner. They are used for:
   - Regression unit tests.
   - Sensitivity analysis under known perturbations.
   - Spatial localization precision verification.
3. **Non-Equivalence Clause:** High synthetic benchmark accuracy does NOT prove high real-world accuracy. Synthetic benchmarks verify algorithm correctness; real-world generalization requires consented field validation.
4. **Data Partitions:** Samples with common templates or parent generation seeds must never leak across splits. Stratified grouping by template, platform, and donor is mandatory.
