# VeriSight — Forensic UI & Usability Audit

## 1. Audit Overview & Methodology

An exhaustive heuristic and visual evaluation of the existing Verisight interface was conducted against the running application at `http://localhost:5174/` across desktop (1920x1080, 1440x900) and responsive viewports.

Baseline artifacts captured:
- `artifacts/screenshots/verisight-ui/baseline_existing_ui.png` (Clean baseline, Sample 1)
- `artifacts/screenshots/verisight-ui/baseline_sample2_tampered.png` (Tampered case, Sample 2)

---

## 2. Comprehensive Issue Matrix

| ID | Category | Severity | Summary | Location |
|:---|:---|:---|:---|:---|
| **ISS-01** | Visual Branding | HIGH | Rainbow gradient text & amateur crypto/SaaS aesthetic | `TopCommandBar.tsx` (Brand logo) |
| **ISS-02** | Information Hierarchy | HIGH | Top command bar is overcrowded with competing pills, badges & buttons | `TopCommandBar.tsx` (Header) |
| **ISS-03** | Evidence Workspace | CRITICAL | Fixed-width sidebar constricts image canvas; lack of responsive flex | `App.tsx`, `RiskDossierSidebar.tsx` |
| **ISS-04** | Jargon & Cognitive Load | HIGH | Raw technical acronyms used as primary labels without plain-language context | `ForensicViewer.tsx`, `RiskDossierSidebar.tsx` |
| **ISS-05** | Image Inspection Controls | MEDIUM | Zoom/pan controls lack 1-click presets ("Fit", "Actual 100%", "Split Diff") | `ForensicViewer.tsx` (Canvas) |
| **ISS-06** | Visual Noise & Cards | MEDIUM | Excessive nested card borders, saturated color badges, and repetitive icons | `RiskDossierSidebar.tsx` |
| **ISS-07** | Information Density | HIGH | All 4 forensic layers dumped simultaneously without progressive disclosure | `RiskDossierSidebar.tsx` |
| **ISS-08** | Keyboard & Accessibility | MEDIUM | Missing global shortcut hints, visible focus indicators, and escape trapping | Global Shell & Modals |
| **ISS-09** | Responsive Degradation | HIGH | Rigid vertical stack on tablet/mobile with unusable image viewport height | Mobile & Tablet viewports |

---

## 3. Deep-Dive Itemized Audits

### ISS-01: Rainbow Gradient Text & Crypto-Style Header
- **What is wrong**: The brand header uses a vibrant gradient (`from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent`) accompanied by a bright `PRO-v1.0` badge and pulsing neon dots (`DB HEALTHY`).
- **Why it affects usability**: It undermines user trust. Forensic investigators, fraud compliance officers, and judicial authorities require an interface that looks sober, authoritative, and scientifically sound. Rainbow gradients signal marketing prototypes, not judicial-grade evidence tooling.
- **What should replace it**: A clean, monochrome or muted metallic brandmark in pure crisp sans-serif with a subtle forensic reticle icon (`ShieldCheck` or `ScanFace`), accompanied by a quiet, non-blinking status pill (`System Calibrated · 4-Layer Core`).
- **Functionality that must remain**: System readiness and database connectivity indicators.

---

### ISS-02: Overcrowded Header Bar with Competing Actions
- **What is wrong**: The header attempts to host six distinct concerns in a single cramped horizontal bar:
  1. Brand and DB indicator
  2. Five golden demo scenario pills (`S1 Clean Synthetic`, `S2 Spliced ₹95k`, etc.)
  3. Upload Screenshot button
  4. WhatsApp Simulation button
  5. Mobile QR sync button
  6. Section 91 Subpoena button
  7. Print Dossier button
  On viewports below 1440px, these buttons wrap awkwardly or trigger horizontal scrollbars in the header.
- **Why it affects usability**: Violates Hick's Law. Investigators are overwhelmed by seven competing buttons in four different color schemes (emerald, amber, sky, purple).
- **What should replace it**:
  - Move Scenario/Investigation Selection into an organized, segmented investigation selector or dedicated dropdown/quick-switch bar.
  - Group primary evidence acquisition actions (`Upload`, `Mobile Sync`) into a cohesive input group.
  - Consolidate investigative utilities (`WhatsApp Laundering`, `Section 91 Notice`, `Export Dossier`) into a unified action cluster with consistent visual hierarchy.
- **Functionality that must remain**: Instant switching between the 5 golden demo cases, file upload, mobile upload modal, WhatsApp simulator, Section 91 notice, and printable dossier export.

---

### ISS-03: Constrained Evidence Canvas & Rigid Sidebar
- **What is wrong**: The primary image canvas shares horizontal space with a permanently docked 384px (`w-96`) sidebar. The image container has fixed max-height constraints and cannot be expanded to full-screen or wide-canvas mode.
- **Why it affects usability**: The evidence image is the *core raison d'être* of Verisight. Forensic analysts need to inspect subtle 1-pixel font misalignments and minute compression blocking artifacts. Forcing the image into a constricted viewport impairs detection of subtle forgeries.
- **What should replace it**:
  - A collapsible and resizable Risk Dossier sidebar that can be collapsed to an ultra-compact summary bar (or hidden) with one click or shortcut (`[`), granting 100% of the screen to the evidence canvas.
  - Dedicated "Fit to Screen", "100% Actual Size", and "200% Pixel Inspection" controls.
- **Functionality that must remain**: The complete Risk Dossier with all scores, syndicate analysis, and findings log.

---

### ISS-04: Confusing Technical Acronyms Without Human Explanations
- **What is wrong**: Tab buttons and metrics use cryptic technical terminology:
  - `ELA (HEATMAP)`
  - `WAVELET NOISE (db4)`
  - `ORB COPY-MOVE`
  - `Cross-Layer Spatial IoU Synergy Banner`
  - `max_baseline_drift_px`, `max_delta_e`, `cielab_patch_anomaly`
- **Why it affects usability**: Fraud managers and legal reviewers without signal-processing PhDs cannot decipher what "Wavelet db4" or "IoU Synergy" signifies. This leads to erroneous interpretation or complete reliance on raw tamper numbers without understanding the underlying evidence.
- **What should replace it**:
  - Primary human-readable labels:
    - **Compression Analysis** (sub-caption: Error Level Analysis)
    - **Noise Consistency** (sub-caption: Daubechies Wavelet Residuals)
    - **Cloned Region Detector** (sub-caption: ORB Feature Keypoints)
    - **Geometry & Alignment** (sub-caption: Baseline & Font Drift)
  - A persistent **"Simple / Advanced Mode"** toggle:
    - In *Simple Mode*: Plain-English explanations (e.g., "The font baseline for the amount field drifts 4.8 pixels below surrounding text, indicating digital text insertion").
    - In *Advanced Mode*: Full mathematical metrics (Drift: `+4.8px`, ΔE: `14.2`, IoU: `0.78`).
- **Functionality that must remain**: All exact mathematical values, algorithms, and metric names must remain accessible in tooltips and Advanced Mode.

---

### ISS-05: Primitive Image Diffing & Inspection Controls
- **What is wrong**: Currently, users must click back and forth between "ORIGINAL" and "ELA" tabs to mentally compare where an anomaly sits relative to the original receipt text. The existing "LOUPE" is a floating circle that only shows a magnified circle without an interactive side-by-side sweep.
- **Why it affects usability**: Mental cross-referencing between two static views is slow and prone to error. Professional forensic tools (and photo analysis suites) provide an interactive **Before/After Split Slider** where dragging a vertical line reveals the hidden manipulation overlay right on top of the original image coordinates.
- **What should replace it**:
  - An interactive **Split Comparison Slider** allowing real-time draggable comparison between Original Evidence and the active spectral layer (ELA, Wavelet, or Copy-Move).
  - Smooth pan/zoom with trackpad wheel and drag, plus rapid presets: "Fit", "100%", "200%".
- **Functionality that must remain**: Single view, Loupe view, and Quad-Spectral Matrix views.

---

### ISS-06: Excessive Nested Cards & Visual Noise in Dossier
- **What is wrong**: The sidebar stacks six separate boxes with high-contrast borders (`#1e293b`), background fills (`#070b14`), and vibrant colored progress bars (sky, rose, purple, amber) right next to each other.
- **Why it affects usability**: When every section has a border, a background, a title, a colored bar, and three sub-metrics, visual hierarchy collapses into a "wall of cards." The user's eye has no clear anchor.
- **What should replace it**:
  - A clean, cohesive data plane with subtle dividers, clear section headings, and a unified telemetry scale.
  - Color used strictly for semantic severity (Green = Low Risk / Consistent, Amber = Review Required, Red = Corroborated Tampering / Critical Threat).
- **Functionality that must remain**: Overall tamper score gauge, verdict banner, syndicate intelligence, cross-layer synergy banner, 4-layer breakdown, findings log, and cryptographic metadata.

---

### ISS-07: Lack of Progressive Disclosure
- **What is wrong**: Every layer (Physical, Geometric, Metadata, Semantic) is permanently open in the sidebar, consuming vertical height and forcing constant scrolling.
- **Why it affects usability**: When an investigation has 5 critical findings and 3 syndicate alerts, the findings push the cryptographic hash and layer scores off-screen.
- **What should replace it**: Collapsible sections with accordion headers that show a one-line summary (e.g., "Layer 1: Physical Signals · 87.5 / 100") when closed, and expand on click for complete telemetry.
- **Functionality that must remain**: All forensic fields and findings.

---

### ISS-08: Lack of Keyboard-First Navigation
- **What is wrong**: There are no documented keyboard shortcuts for rapid case review. Power users must use the mouse for every sample switch and mode change.
- **Why it affects usability**: High-volume fraud triage requires speed. Analysts processing hundreds of suspicious UPI receipts daily need keyboard shortcuts.
- **What should replace it**:
  - Global keyboard listener:
    - Keys `1`–`5`: Switch Golden Demo Samples
    - Key `O`: Original view
    - Key `E`: Compression (ELA) view
    - Key `W`: Noise (Wavelet) view
    - Key `C`: Clones (ORB) view
    - Key `S`: Split Comparison Slider
    - Key `Q`: Quad-Spectral Matrix
    - Key `[`: Toggle Risk Dossier Sidebar
    - Key `F`: Fit to Screen / Reset Zoom
    - Key `?`: Open Keyboard Shortcuts Cheatsheet
- **Functionality that must remain**: All mouse click handlers.

---

### ISS-09: Responsive Layout Breakdown on Tablets & Small Laptops
- **What is wrong**: On screens below 1280px (e.g., iPad Pro at 1024px or laptops at 1366x768), the header wraps into multiple rows, pushing the viewer downward. The viewer height is hard-coded (`h-[72dvh]`), leading to dual-scrollbar traps and awkward overflow.
- **Why it affects usability**: Forensic field operatives and investigators on laptops cannot view evidence comfortably without extensive scrolling.
- **What should replace it**:
  - Robust flexbox/grid layout that dynamically computes available height (`flex-1 min-h-0`).
  - Tablet/mobile layout with a bottom tab bar for primary modes and a sliding sheet for the Risk Dossier.
- **Functionality that must remain**: Full desktop and mobile upload capabilities.
