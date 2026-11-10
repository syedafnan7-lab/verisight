# VERISIGHT — INITIAL PROJECT AUDIT

**Date:** 2026-11-10  
**Project:** VeriSight (PRO v1.0)  
**Category:** AI-Assisted Digital Forensics & Evidence Intelligence Platform  
**Target Environment:** Google Antigravity / Web  

---

## 1. Existing System Architecture

VeriSight is an offline-capable, decoupled client-server digital forensics platform engineered to verify mobile payment and financial chat screenshots against digital tampering, synthetic generators, and laundering channels.

### Frontend Architecture
- **Framework:** React 18.3.1 + TypeScript 5.7.3 + Vite 6.1.0.
- **Styling:** Tailwind CSS 3.4.17 + PostCSS + Autoprefixer.
- **UI Components & Icons:** `lucide-react` (v0.475.0), `qrcode.react` (v4.2.0), `clsx`, `tailwind-merge`.
- **Core View Hierarchy:**
  - `App.tsx`: Top-level orchestrator handling routing between `MobileUploadView` and `DesktopWorkbench`.
  - `TopCommandBar.tsx`: Header holding brand badge, golden demo sample pills (S1–S5), file upload drop trigger, WhatsApp laundering simulator trigger, Judge mobile QR trigger, and Print dossier trigger.
  - `ForensicViewer.tsx`: Primary central canvas hosting spectral layers (Original, ELA, Wavelet, Copy-Move, Loupe, Quad-View), laser overlays, bounding boxes, and zoom/pan controls.
  - `SynchronizedLoupe.tsx`: 3x magnifying optical comparison lens.
  - `RiskDossierSidebar.tsx`: Right-hand analytical pane with 4-layer heuristic scores, findings list, and Syndicate Entity Resolution.
  - Modals: `ForensicReportModal.tsx` (print/export dossier), `WhatsAppSimulatorModal.tsx` (channel laundering), `MobileUploadModal.tsx` (QR pairing), `Section91NoticeModal.tsx` (Statutory Cyber Subpoena notice).

### Backend Architecture
- **Framework:** FastAPI (Python 3.12) with asynchronous ASGI worker (Uvicorn).
- **Core Pipelines:**
  - `pipeline.py`: Master orchestrator generating cryptographic SHA-256 evidence hashes and sequencing 4 forensic layers.
  - Layer 1 (`pixel_analysis/`): Multi-scale Error Level Analysis (ELA), native Daubechies-4 (`db4`) high-pass wavelet noise residuals, ORB copy-move feature matching, and JPEG ghost analysis.
  - Layer 2 (`typography/`): Subpixel baseline drift laser audit, CIELAB ΔE color patch anomalies, and Laplacian edge sharpness gradients.
  - Layer 3 (`metadata/`, `qr_inspector.py`): Container chunk inspection, EXIF/XMP parsing, device viewport aspect ratio verification, 12-digit UPI UTR validation, status-bar vs receipt clock paradox detection, and UPI QR intent decoding.
  - Layer 4 (`ensemble/calibrator.py`): Heuristic evidentiary fusion, cross-layer spatial IoU synergy, and legally conservative verdict calibration (`CORROBORATED_ANOMALIES`, `REVIEW_REQUIRED`, `INCONCLUSIVE`).
  - Intelligence (`intelligence/syndicate.py`): Financial entity extraction (VPA, Payee, UTR, Amount) and automated statutory Section 91 Cr.P.C. / Section 94 BNSS notice generator.

---

## 2. Existing Functionality Audit

| Capability | Module / Layer | Current Status |
| :--- | :--- | :--- |
| **Multi-Scale ELA** | Layer 1 Signal | Operational; adaptive Q-levels for recompression channels. |
| **Wavelet Noise Residuals** | Layer 1 Signal | Operational; native OpenCV Daubechies-4 orthogonal decomposition without external `pywt` dependency. |
| **ORB Copy-Move Clones** | Layer 1 Signal | Operational; matches duplicate text or digit stamps. |
| **Subpixel Baseline Lasers** | Layer 2 Typography | Operational; detects micro-displacements (+3.5px drift) from forged amount text. |
| **CIELAB ΔE Color Patches** | Layer 2 Typography | Operational; detects background patch color discontinuities. |
| **Clock Paradox Rules** | Layer 3 Metadata | Operational; catches status bar vs receipt timestamp discrepancies. |
| **12-Digit UTR Validation** | Layer 3 Metadata | Operational; identifies fictitious 10-digit APK generator reference IDs. |
| **UPI QR Inspector** | Layer 3 Metadata | Operational; decodes `upi://pay?pa=...` intents and isolates QR areas from text baseline checks. |
| **Syndicate Entity Resolution** | Intelligence | Operational; extracts suspect VPA, payee, UTR, and evaluates APK generator risk. |
| **Section 91 BNSS Subpoena** | Intelligence | Operational; drafts legal cyber-cell requisition with evidence SHA-256 hash. |
| **WhatsApp Simulator** | Simulation | Operational; models 4:2:0 chroma subsampling and quality compression. |
| **Mobile QR Intake** | Real-Time Sync | Operational; stage-judge phone pairing. |

---

## 3. Identified UX / UI & Design Problems

1. **Lack of Investigation Phasing**:
   - The user is immediately dropped into Sample 1 without a structured 5-stage workflow (Intake -> Forensic Analysis -> Investigation Results -> Risk Assessment -> Dossier).
   - First-time users are unsure whether an image is already being analyzed or what steps remain.
2. **Analysis Toolbar Clutter**:
   - The forensic view toggles (ORIGINAL, ELA, WAVELET, COPY_MOVE, LOUPE, QUAD) are displayed as flat technical buttons with minimal contextual guidance, tooltips, or explanation of what each filter reveals.
3. **Canvas Real Estate & Centering**:
   - On wide desktop screens, the central evidence viewport is visually constrained by fixed right-sidebars, leaving empty black dead zones while evidence cards should be the visual centerpiece.
4. **Risk Score Presentation**:
   - Heuristic scores can easily be misinterpreted as probabilistic confidence if not paired with explicit progressive disclosure and cautious forensic language.
5. **Atmospheric Cohesion & Polish**:
   - The dark palette (`#070B14`) lacks subtle depth layering (atmospheric dot-grid or restrained glow), making borders feel stark.

---

## 4. Component Dependencies & Installed Libraries

```json
{
  "dependencies": {
    "clsx": "^2.1.1",
    "lucide-react": "^0.475.0",
    "qrcode.react": "^4.2.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.1",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.3",
    "vite": "^6.1.0"
  }
}
```

---

## 5. Technical Debt & Performance Considerations

1. **Non-blocking Execution**:
   - Asynchronous endpoints use `asyncio.to_thread` to prevent CPU-bound OpenCV operations from locking the main asyncio event loop.
2. **Static Fixture Caching**:
   - Demo samples are memoized via `@lru_cache(maxsize=10)` to eliminate redundant image decomposition.
3. **Payload Optimization**:
   - Base64 images are delivered as lossless WebP (`cv2.IMWRITE_WEBP_QUALITY=101`) to cut network transport payload size by ~70% compared to raw PNG.
4. **Responsive Flex Layout**:
   - Need proper touch zoom/pan handlers and collapsible sidebar states for viewports below 1024px and mobile form factors.

---

## 6. Recommended Implementation Order

1. **Phase 1: Architecture & UI/UX Plan**: Define the 5-stage investigation lifecycle and component structure.
2. **Phase 2: Global Visual Design & Atmosphere**: Implement refined design tokens, atmospheric background layers, and typography hierarchy.
3. **Phase 3: Header & Navigation Hierarchy**: Reorganize actions into primary (Upload), secondary (Tools/Simulators), and legal (Section 91 Notice).
4. **Phase 4: Evidence Intake Workflow**: Build a dedicated Evidence Intake experience with file validation, hash computation, and demo scenario picker.
5. **Phase 5: Central Evidence Workspace (Centerpiece)**: Maximize image canvas, responsive zoom/pan, fit-to-screen, categorized analysis modes, and anomaly-click inspection.
6. **Phase 6: Risk Dossier & Explainability**: Progressive disclosure for heuristic scores, supporting vs contradictory signals, and syndicate resolution.
7. **Phase 7: Responsive & Accessibility Hardening**: Keyboard shortcuts, ARIA tags, mobile drawer viewports.
8. **Phase 8: Browser Verification & Validation**: Automated Playwright verification across screen resolutions.
