# VeriSight Pro — Product Information Architecture & Identity

**Product Title:** VeriSight Pro — Digital Payment Screenshot Forensics  
**Core Promise:** *"Investigate payment screenshots. Understand the evidence behind every finding."*

---

## 1. Brand Identity & Ethical Boundaries

VeriSight is an investigative digital-forensics workbench designed to inspect the visual, physical, and geometric integrity of digital payment screenshots (e.g. UPI, IMPS, RTGS, and mobile banking receipts).

### Scientific & Legal Truth Disclaimers
1. **Not Bank Verification**: VeriSight inspects pixel-level signals, font geometry, and compression artifacts. It does not interface directly with bank ledger APIs; an authentic screenshot does not prove funds settled, and an anomaly does not prove legal fraudulent intent.
2. **Heuristic & Calibrated Assessment**: Forensic tamper scores reflect visual and statistical anomalies that warrant human investigation, not an automated verdict.
3. **Synthetic Demonstration Corpus**: All built-in demonstration samples (S1–S5) and the 27-sample development benchmark are synthetic artifacts. Real-world generalization is continuously evaluated.
4. **Legal Summons Disclaimer**: Output notices reference **Section 94 of Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023** (which supersedes former Section 91 of the Code of Criminal Procedure, 1973) and must be reviewed by an authorized law-enforcement or compliance officer before statutory submission.

---

## 2. Three-Experience Product Architecture

```
                          VERISIGHT PRO APPLICATION SHELL
     +-----------------------------------------------------------------------+
     | [Shield] VERISIGHT PRO   [Overview]   [Workbench]   [Evaluation]      |
     +-----------------------------------------------------------------------+
                    |                            |                        |
                    v                            v                        v
       ROUTE: /                      ROUTE: /workbench           ROUTE: /evaluation
  +-------------------------+   +-------------------------+   +-------------------------+
  | EXPERIENCE A:           |   | EXPERIENCE B:           |   | EXPERIENCE C:           |
  | PRODUCT OVERVIEW        |   | FORENSIC WORKBENCH      |   | RESEARCH & TRANSPARENCY |
  |                         |   |                         |   |                         |
  | - Hero with Live Demo   |   | - Top Case Selector     |   | - Active Model Registry |
  | - 4-Step User Story     |   | - Multi-Spectral Viewer |   | - 27-Sample Provenance  |
  | - Verified Capabilities |   | - Draggable Split Diff  |   | - ROC-AUC & Brier Score |
  | - Synthetic Case Matrix |   | - Sub-pixel Lasers HUD  |   | - Calibration Curves    |
  | - Privacy & Storage     |   | - Collapsible Dossier   |   | - Section 94 BNSS Legal |
  | - Honest FAQ            |   | - WhatsApp Launder Sim  |   | - Known Limitations     |
  +-------------------------+   +-------------------------+   +-------------------------+
```

---

## 3. Site Navigation & Routing Map

| Route | Primary View | Target Audience | Key User Actions |
|:---|:---|:---|:---|
| `/` | **Product Overview** | Merchants, fraud leads, first-time investigators | Read workflow, explore synthetic preview, inspect S1–S5 gallery, review privacy boundaries, launch workbench. |
| `/workbench` | **Forensic Workbench** | Forensic analysts, fraud investigators, police officers | Upload custom receipt, switch spectral layers (Original, ELA, Wavelet, Clones), drag split diff slider, inspect baseline lasers, generate Section 94 BNSS notice, export dossier. |
| `/evaluation` | **Research & Evaluation** | Machine learning engineers, compliance auditors, judges | Inspect HistGradientBoosting / Logistic fusion models, view out-of-fold cross-validation metrics, audit data leakage isolation, review known synthetic limitations. |
