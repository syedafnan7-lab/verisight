# VeriSight Pro — Initial Product & Repository Audit

**Date:** November 11, 2026  
**Auditor:** Principal Product Designer & Senior Frontend Architect  
**Branch:** `feature/verisight-product-experience` (Worktree: `C:\Users\HP\verisight-ui`)  
**Target Repository:** VeriSight Digital Screenshot Forensics Workstation  

---

## 1. Repository Safety & Environment Audit

### A. Git Worktree & Branch Topology
* **Active ML Worktree**: `C:\Users\HP\verisight-new`  
  * **Branch**: `feature/scamshield-scaling-enhancements` (Commit `b8dabfb`)
  * **Status**: Uncommitted ML repair files (`schemas.py`, `calibrator.py`, `extractor.py`, `learned_fusion.py`, checkpoints).
  * **Safety Guarantee**: Isolated completely. Zero ML code or backend services are touched or modified by the UI workstream.
* **UI Worktree**: `C:\Users\HP\verisight-ui`  
  * **Branch**: `feature/verisight-product-experience` (Created for this master product experience overhaul)
  * **Upstream**: Inherited from `main` and refined during Phase 0.

### B. Active System Processes & Ports
* **Forensic Backend API**: Running on `http://127.0.0.1:8000` via Uvicorn (PID 14448).
  * Service: `VeriSight Forensics Engine v1.0.0`
  * Active Layers: `L1_Signal`, `L2_Typography_Geometry`, `L3_Metadata_Protocol`, `L4_Ensemble_Synergy`
  * Evaluation Endpoints: `/api/model/status`, `/api/model/evaluation`, `/api/benchmark/results` active.
* **UI Development Server**: Running on `http://localhost:5174/` via Vite 6.4.6 (PID 12724).
  * Reverse Proxy: `/api/*` and `/samples/*` mapped to `http://127.0.0.1:8000`.

---

## 2. Frontend Architecture & Component Inventory

| Component / Module | Path | Classification | Functional Status | Redesign Recommendation |
|:---|:---|:---|:---|:---|
| **TopCommandBar** | `src/components/TopCommandBar.tsx` | Functional / Chrome | Operational | Refactor into persistent top navigation with links across Overview (`/`), Workbench (`/workbench`), and Evaluation (`/evaluation`). |
| **ForensicViewer** | `src/components/ForensicViewer.tsx` | Functional / Core | Operational | Retain high-craft canvas, 7 spectral modes, laser overlays, and split slider. |
| **ComparisonSlider** | `src/components/ComparisonSlider.tsx` | Functional / High-Value | Operational | Retain draggable before/after comparison with in-slider channel toggling. |
| **ForensicReticle** | `src/components/ForensicReticle.tsx` | Functional / Identity | Operational | Retain coordinate HUD and laboratory corner reticles. |
| **AmbientThreatBackground** | `src/components/AmbientThreatBackground.tsx` | Sensory / Atmospheric | Operational | Retain micro-dot matrix and threat-state backlight. |
| **RiskDossierSidebar** | `src/components/RiskDossierSidebar.tsx` | Functional / Core | Operational | Retain ScamShield two-column hero verdict, syndicate copy chips, and collapsible rail. |
| **ForensicReportModal** | `src/components/ForensicReportModal.tsx` | Functional / Utility | Operational | Retain print-ready legal audit dossier formatting. |
| **Section91NoticeModal** | `src/components/Section91NoticeModal.tsx` | Functional / Legal | Operational | Update with legal note regarding **Section 94 of BNSS** (replacing former CrPC Section 91). |
| **WhatsAppSimulatorModal** | `src/components/WhatsAppSimulatorModal.tsx` | Functional / Educational | Operational | Retain educational compression laundering demonstration. |
| **MobileUploadModal** | `src/components/MobileUploadModal.tsx` | Functional / Live Sync | Operational | Retain QR code camera live-sync. |
| **KeyboardShortcutsModal** | `src/components/KeyboardShortcutsModal.tsx` | Functional / Accessibility | Operational | Retain cheatsheet dialog for zero-latency shortcuts. |

---

## 3. Existing Route & Navigation Deficiencies

1. **Monolithic Workbench Route**:
   The current application serves only the desktop workbench at the root (`/`). There is no introductory **Product Overview** to onboard investigators or merchants, nor a dedicated **Research & Evaluation** view to explain the 27-sample benchmark corpus and model calibration.
2. **Missing Product Narrative**:
   First-time users arrive directly into a complex image canvas with high cognitive load. They cannot quickly read the 4-step workflow, forensic capabilities, or data privacy boundaries.
3. **Hidden Benchmark Science**:
   Real scientific evaluation metrics (`ROC-AUC 0.91-1.0`, Brier scores, out-of-fold cross-validation) exist in the backend at `/api/model/evaluation`, but are completely hidden from frontend users.

---

## 4. Architectural Transformation Plan

We will structure Verisight Pro into **three connected experiences**:
1. **Experience A — Product Overview (`/`)**:
   * Hero with authentic positioning ("Investigate payment screenshots. Understand the evidence behind every finding.")
   * Interactive live synthetic preview with real forensic heatmap and findings.
   * 4-step investigation workflow: 01 Upload -> 02 Analyze -> 03 Investigate -> 04 Document.
   * Capability breakdown (ELA, Wavelet, Copy-Move ORB, Text Geometry, Viewport/Metadata).
   * Demonstration gallery for golden samples (S1–S5) prominently labelled: `"SYNTHETIC DEMONSTRATION — NOT REAL PAYMENT EVIDENCE"`.
   * Transparent methodology statement & privacy/retention commitments.
   * Factual FAQ addressing image manipulation vs. bank confirmation.
2. **Experience B — Forensic Workbench (`/workbench`)**:
   * Preserves and enhances the complete multi-spectral inspection environment.
   * Full zoom/pan, before/after split diff, synchronized dual loupe, quad matrix.
   * Explainable risk dossier with ScamShield-inspired verdict summary and Section 94 BNSS note.
3. **Experience C — Research & Evaluation Dashboard (`/evaluation`)**:
   * Engineering transparency dashboard fetching live telemetry from `/api/model/status` and `/api/model/evaluation`.
   * Displays model version, architecture, dataset provenance (27 synthetic samples), ROC-AUC, Brier score, and calibration status.
   * Prominently disclaims: *"Current evaluation uses synthetic development samples. Real-world generalization has not yet been independently established."*
