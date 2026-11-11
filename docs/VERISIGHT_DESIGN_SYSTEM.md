# VeriSight — Forensic Design System Specification

## 1. Design Direction & Vision

**VeriSight is an authoritative, precise, calm, and technically rigorous digital-forensics investigation workstation.**

It is not a generic marketing SaaS dashboard, nor a flashy cyberpunk game interface. It rejects rainbow gradients, particle confetti, and noisy cards. It embraces the physical precision of high-end optical laboratory equipment, the information discipline of Linear, and the progressive disclosure of Sentry.

---

## 2. Core Token Specification

### A. Surfaces & Depth System (Zinc / Slate Forensic Foundation)
Surfaces use a strict 4-level luminance hierarchy to establish natural depth without heavy shadows or garish borders:

| Surface Token | Hex Value | Purpose / Placement |
|:---|:---|:---|
| `surface-canvas` | `#080b11` | Deep background substrate for the whole application |
| `surface-workbench` | `#0d121d` | Active workspace area framing the evidence viewport |
| `surface-panel` | `#111827` | Elevated chrome (Top Command Bar, Risk Dossier panel) |
| `surface-elevated` | `#1a2234` | Popovers, tooltips, dialogs, active pill highlights |
| `surface-overlay` | `rgba(8, 11, 17, 0.85)` | Modal backdrop with 8px gaussian blur |

### B. Borders & Structural Separators
Following Linear's principle (*"Structure should be felt, not seen"*):

| Border Token | CSS Value | Usage |
|:---|:---|:---|
| `border-subtle` | `rgba(255, 255, 255, 0.07)` | Dividers, subtle panel seams, card outlines |
| `border-default` | `rgba(255, 255, 255, 0.12)` | Interactive control boundaries, input fields |
| `border-focus` | `#38bdf8` (Sky-400) | Keyboard focus ring (`2px solid`, offset 2px) |
| `border-active` | `rgba(56, 189, 248, 0.4)` | Active tab or highlighted evidence locus |

### C. Semantic Forensic Status Palette
Color is reserved strictly for functional meaning and is never used as arbitrary decoration:

| Semantic Status | Surface Pill | Border | Text Accent | Evidentiary Meaning |
|:---|:---|:---|:---|:---|
| **Low Risk / Authentic** | `#06281e` (`emerald-950/70`) | `#059669` (`emerald-600`) | `#34d399` (`emerald-400`) | Baseline consistency observed; no splice or clone detected |
| **Review Required** | `#2d1a04` (`amber-950/70`) | `#d97706` (`amber-600`) | `#fbbf24` (`amber-400`) | Heuristic anomaly detected; warrants human verification |
| **Critical / Tampered** | `#3b0813` (`rose-950/70`) | `#e11d48` (`rose-600`) | `#fb7185` (`rose-400`) | Multi-spectral corroborated forgery or illegal syndicate match |
| **Information / System** | `#08203a` (`sky-950/70`) | `#0284c7` (`sky-600`) | `#38bdf8` (`sky-400`) | Metadata details, viewport dimensions, hash data |

### D. Typography Hierarchy
- **Body & Headings**: Crisp modern sans-serif (`Inter`, `system-ui`, `-apple-system`, `sans-serif`)
- **Telemetry & Numbers**: High-legibility monospaced numerals with tabular numbers (`ui-monospace`, `SFMono-Regular`, `Consolas`, `monospace`)
- **Rule**: Sentence case for all normal interface copy. No all-caps screaming labels.

| Role | Font Family | Size | Weight | Line Height | Tracking |
|:---|:---|:---|:---|:---|:---|
| **Brand Identity** | Sans | 15px | 700 (Bold) | 20px | +0.06em |
| **Section Header** | Sans | 13px | 600 (Semibold) | 18px | Normal |
| **Card Title / Finding** | Sans | 12px | 500 (Medium) | 16px | Normal |
| **Body Copy** | Sans | 12px | 400 (Regular) | 17px | Normal |
| **Telemetry Metric** | Mono (Tabular) | 11px | 600 (Semibold) | 14px | +0.02em |
| **Micro Caption / Hash** | Mono | 10px | 400 (Regular) | 14px | Normal |

---

## 3. Signature Design Element: The Calibrated Forensic Reticle

To give Verisight an unmistakable, professional identity without adding ornamental clutter:

- **The Forensic Reticle (`VerisightReticle`)**:
  A subtle corner-bracket alignment frame in the evidence canvas with sub-pixel tick marks, cross-hair alignment lines, and live cursor coordinate readout (`X: 412px, Y: 890px · 100% Zoom`).
- When an anomaly locus is selected, the bounding box smoothly focuses with crisp corner reticles rather than a generic blurry red box.

---

## 4. UI Layout Architecture (ASCII Wireframes)

### A. Desktop Workstation Layout (1440px - 1920px)

```
+------------------------------------------------------------------------------------------------------------------+
| VERISIGHT [Reticle Icon]  Evidence: [ UPI Payment #S2 - ₹95,000 Spliced v ]   [Simple / Advanced Mode]  [? Keys] |
| Actions: [Upload Screenshot] [Phone Sync] | [Simulate WhatsApp] [Section 91 Notice] [Export PDF Dossier]        |
+------------------------------------------------------------------------------------+-----------------------------+
| EVIDENCE WORKSPACE (72% width - dominant)                                          | RISK DOSSIER (28% - Collaps)|
|                                                                                    | [< Collapse Panel]          |
| [View Modes: [Original] [Compression (ELA)] [Noise (Wavelet)] [Clones] [Split Diff] [Quad Matrix] ]              |
| [Overlays: [x] Anomaly Regions  [x] Typographic Baselines  [x] Grid ]   [Zoom: - [100%] + [Fit] [200%]]          |
|------------------------------------------------------------------------------------+-----------------------------+
|                                                                                    | OVERALL VERDICT GAUGE       |
|                                                                                    |   [  84.5 / 100  ]          |
|                                                                                    |   [!] REVIEW REQUIRED       |
|                     +---------------------------------------+                      |                             |
|                     | [Reticle Coordinate: X:240, Y:380]    |                      | SYNDICATE THREAT ALERT      |
|                     |                                       |                      | Payee: fraud@axl (Mule UPI) |
|                     |           EVIDENCE IMAGE              |                      |                             |
|                     |                                       |                      | 4-LAYER FORENSIC BREAKDOWN  |
|                     |      +-------------------------+      |                      | > Layer 1: Physical (92.4)  |
|                     |      | [!] Spliced Amount Zone |      |                      | > Layer 2: Geometry (88.1)  |
|                     |      +-------------------------+      |                      | > Layer 3: Metadata (65.0)  |
|                     |                                       |                      | > Layer 4: Heuristics (80.0)|
|                     |                                       |                      |                             |
|                     +---------------------------------------+                      | FINDINGS EVIDENCE LOG (4)   |
|                                                                                    | [!] Amount Font Drift (+4px)|
| [Interactive Comparison Split Slider or Loupe tracking enabled]                    | [!] JPEG Blocking Anomaly   |
| Status: SHA-256: 7a9f...b412 | 1080 x 2400 px | Aspect: 20:9 Native                | [!] Mule UPI Identifier     |
+------------------------------------------------------------------------------------+-----------------------------+
```

### B. Collapsed Workspace Mode (100% Canvas Width)

```
+------------------------------------------------------------------------------------------------------------------+
| VERISIGHT   Evidence: S2 Spliced ₹95k   [Simple/Adv]                                      [Expand Dossier (84.5) >]
+------------------------------------------------------------------------------------------------------------------+
|                                                                                                                  |
|                                                                                                                  |
|                                  WIDE-CANVAS HIGH-RESOLUTION EVIDENCE VIEW                                       |
|                                                                                                                  |
|                                                                                                                  |
+------------------------------------------------------------------------------------------------------------------+
```

### C. Tablet / Mobile Responsive Layout (< 1024px)

```
+-------------------------------------------------------------+
| VERISIGHT   [Sample Selector v]             [Dossier (84.5)]|
+-------------------------------------------------------------+
|                                                             |
|                     EVIDENCE VIEWPORT                       |
|                   (Aspect-ratio preserved)                  |
|                                                             |
+-------------------------------------------------------------+
| Tool Presets: [Original] [Compression] [Noise] [Clones]     |
+-------------------------------------------------------------+
| Bottom Floating Action Bar:                                 |
| [Upload]   [Compare Slider]   [Dossier Sheet]   [Export]    |
+-------------------------------------------------------------+
```

---

## 5. Dual-Mode Information Design

| Element | Simple Mode (Default for Fraud Investigators) | Advanced Mode (For Forensic Scientists & Police) |
|:---|:---|:---|
| **Layer 1** | **Compression & Noise Analysis**: "Inconsistent image compression detected in the amount region." | **Layer 1 Signals**: ELA score `87.4`, Wavelet db4 variance `0.041`, anomalous blocks `14`. |
| **Layer 2** | **Typography & Font Alignment**: "Text baseline drops 4.8 pixels below neighboring text." | **Layer 2 Geometry**: Drift `+4.8px`, CIELAB ΔE `14.2`, patch anomaly `TRUE`. |
| **Layer 3** | **Phone Metadata & Time**: "WhatsApp recompression detected; status bar time aligns." | **Layer 3 Protocol**: Aspect `20:9` (`0.450`), clock delta `0s`, UPI UTR syntax valid. |
| **Layer 4** | **Cross-Signal Synergy**: "Multiple independent forensic signals pinpoint the same area." | **Layer 4 VLM**: Spatial IoU `0.78`, synergy multiplier applied `1.25x`. |

---

## 6. Interaction & Motion Rules

1. **Layer Switching**: 0ms transition. Instant texture swap prevents disorientation.
2. **Comparison Slider**: Real-time cursor tracking using CSS clip-path or coordinate masking.
3. **Sidebar Collapse**: Smooth 180ms ease-out width transition (`cubic-bezier(0.16, 1, 0.3, 1)`).
4. **Tooltips**: 150ms delay, instant dismiss on mouse leave.
5. **Keyboard Hotkeys**: Guaranteed immediate response without intermediate animation.
