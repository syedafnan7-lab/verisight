# VeriSight — Multi-Layer Digital Screenshot Forensics & Tamper Detection Platform

> **HackStellar Problem Statement 12: "Is This Screenshot Real?"**  
> *A deterministic, mathematically rigorous 4-layer digital image forensics workbench for detecting payment receipt alterations, typographic tampering, DevTools edits, and social media media laundering.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python: 3.10+](https://img.shields.io/badge/Python-3.10%2B-brightgreen.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg)](https://fastapi.tiangolo.com)
[![React: 18](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev)
[![TypeScript: 5](https://img.shields.io/badge/TypeScript-5-3178C6.svg)](https://www.typescriptlang.org)
[![Tailwind CSS: 3](https://img.shields.io/badge/TailwindCSS-3-38B2AC.svg)](https://tailwindcss.com)
[![Tests: 23 Passed](https://img.shields.io/badge/Tests-23%2F23%20Passing-success.svg)](backend/tests)
[![Zero Cloud OCR](https://img.shields.io/badge/OCR-100%25%20Offline%20MSER-orange.svg)](backend/app/services/forensic/layer2_geometry/ocr_engine.py)

---

## 1. Executive Summary & Problem Context

Financial fraud perpetrated via fabricated and spliced mobile transaction screenshots (Google Pay, PhonePe, Paytm, banking receipts) has scaled exponentially due to browser DevTools DOM tampering, graphic editors, and online "fake receipt generator" web applications.

### Why Vision-LLMs Fail on Screenshot Verification
Generic Multimodal Vision-LLMs (such as GPT-4o or Gemini Flash) are fundamentally probabilistic semantic models. When fed a spliced screenshot, they suffer from severe forensic blind spots:
1. **Blind to Pixel-Level Compression Splices:** LLMs do not inspect DCT coefficient quantization matrices or Error Level Analysis (ELA) gradients.
2. **Fooled by DevTools DOM Edits:** If the text reads "Payment Successful: ₹95,250", a Vision-LLM assumes semantic consistency and marks it genuine.
3. **Deceived by WhatsApp Compression:** Downsampled and 4:2:0 recompressed images destroy standard image features while leaving macroscopic typographic alignment anomalies that LLMs cannot mathematically evaluate.
4. **Hallucination Risk:** Vision-LLMs frequently hallucinate confidence scores without verifiable, reproducible forensic evidence.

**VeriSight is built on a different paradigm:** A deterministic, multi-layer computational forensics engine backed by signal processing, mathematical morphology, sub-pixel regression, and domain protocol verification. Every score is mathematically grounded, visualizable, and reproducible.

> **Forensic Integrity Notice:** VeriSight operates as an **investigative assistance platform**, not an absolute authenticity oracle. In accordance with ISO/IEC 27037 guidelines, visual forensics provides evidentiary indicators of tampering; a digital screenshot alone cannot prove or disprove financial settlement on a core banking ledger.

---

## 2. Four-Layer Forensic Architecture

VeriSight synthesizes proven digital forensic techniques into four modular, decoupled layers:

```
                            INPUT SCREENSHOT (PNG/JPEG/WEBP)
                                          │
       ┌──────────────────┬───────────────┴───────────────┬──────────────────┐
       ▼                  ▼                               ▼                  ▼
┌──────────────┐   ┌──────────────┐                ┌──────────────┐   ┌──────────────┐
│   LAYER 1    │   │   LAYER 2    │                │   LAYER 3    │   │   LAYER 4    │
│   Physical   │   │  Typographic │                │  Container & │   │ Multi-Layer  │
│  & Signal    │   │  & Geometry  │                │   Protocol   │   │   Bayesian   │
│  Forensics   │   │  Forensics   │                │  Forensics   │   │  Calibrator  │
└──────┬───────┘   └──────┬───────┘                └──────┬───────┘   └──────┬───────┘
       │                  │                               │                  │
       │ Multi-Scale ELA  │ Sub-pixel Baseline Laser      │ Viewport DB      │ Spatial IoU
       │ Wavelet db4 Noise│ CIELAB ΔE Color Step          │ 12-digit UTR     │ Synergy Multiplier
       │ ORB Copy-Move    │ Laplacian Sharpness Z-Score   │ Clock Paradox    │ (1.35x Penalty)
       │ Ghost DCT Sweep  │ Offline MSER OCR (<300ms)     │ EXIF / Chunks    │ Calibrated Gauge
       │                  │                               │                  │
       └──────────────────┴───────────────┬───────────────┴──────────────────┘
                                          ▼
                         UNIFIED FORENSIC DOSSIER & WORKBENCH
                         • 6-Mode Spectral Multi-Viewer
                         • SVG Baseline Laser Overlay
                         • 3x Synchronized Dual Loupe
                         • Live Mobile QR Stage Upload
                         • ISO/IEC 27037 Audit Dossier
```

### Layer 1: Physical & Signal Forensics
*File: `backend/app/services/forensic/layer1_signal/`*
* **Multi-Scale Error Level Analysis (ELA):** Resaves the image at varying quality factors ($Q \in \{75, 85, 95\}$), computes absolute pixel difference matrices $|I - I_{\text{resave}}|$, and scales variance. Spliced patches (saved at different compression levels) show marked error divergence from authentic background pixels.
* **2D Wavelet Noise Variance Residuals (Daubechies `db4`):** Extracts high-pass spatial noise variance in the diagonal detail sub-band ($W_{HH}$) combined with a Laplacian residual filter:
  $$\sigma^2_{\text{noise}} = \text{Var}\left(\mathcal{W}_{\text{db4}}(I)\right)$$
  Digital brush edits, cloned regions, and synthetic text overlays exhibit unnatural drops in local sensor/render noise variance ($\sigma^2 \to 0$).
* **ORB Copy-Move Duplicate Forgery Detection:** Employs Oriented FAST and Rotated BRIEF feature keypoint extraction with Lowe's ratio test ($d_1 / d_2 \le 0.78$), minimum spatial Euclidean distance separation ($d \ge 35\text{ px}$), vector orientation binning, and spatial bounding clustering to uncover duplicated text/icons while rejecting authentic periodic UI elements.
* **JPEG Double-Quantization & Ghost Analysis:** Computes quality-sweep difference curves across $Q \in [60, 95]$ to identify double-compression minima ($\Delta E(Q_{\text{valley}})$) indicative of spliced crops.

### Layer 2: Typographic & Geometric Forensics
*File: `backend/app/services/forensic/layer2_geometry/`*
* **Zero-Cloud Offline OCR Engine:** Uses OpenCV connected-components labeling and Maximally Stable Extremal Regions (MSER) to detect and bound character/word contours with sub-pixel precision in $< 300\text{ ms}$, with zero reliance on cloud APIs or external downloads.
* **Sub-Pixel Horizontal Baseline Regression ($\sigma_{\text{baseline}}$):** Clusters word tokens into horizontal text rows and runs linear regression across bottom boundary anchors ($y + h$). A robust median consensus prevents false positives on punctuation/descenders while flagging spliced amounts with $\ge 2$ deviating tokens or $\ge 4.5\text{ px}$ vertical drift:
  $$\text{Drift}_i = |y_i - (\alpha \cdot x_i + \beta)|$$
* **CIELAB Perceptual Color Distance ($\Delta E_{ab}$):** Converts regions to the CIE $L^*a^*b^*$ color space and evaluates perceptual color differences between the text margin patch and the surrounding receipt card:
  $$\Delta E_{ab}^* = \sqrt{(\Delta L^*)^2 + (\Delta a^*)^2 + (\Delta b^*)^2}$$
  Color differences exceeding the Just-Noticeable-Difference threshold ($\Delta E > 2.3$) expose pasted background patch rectangles.
* **Laplacian Sharpness Z-Score:** Measures high-frequency gradient variance per character box to identify anti-aliasing mismatches caused by inserting text rendered with different rasterization engines.

### Layer 3: Container, Protocol & Domain Forensics
*File: `backend/app/services/forensic/layer3_metadata/`*
* **Native Mobile Viewport Database:** Matches image dimensions and aspect ratios against an extensive database of 25+ standard Android and iOS devices (iPhone 13–16 Pro Max, Samsung Galaxy S21–S24 Ultra, Google Pixel 6–9 Pro, OnePlus). Arbitrary desktop DevTools viewport crops (e.g. 680×1120) are instantly flagged.
* **Indian UPI Payment Standard Rules (NPCI Specifications):**
  - Validates 12-digit numeric UPI Reference / UTR format.
  - Verifies Julian calendar day-of-year and year prefix encoding.
  - Flags synthetic placeholder patterns (e.g., `9999999999`, `123456789012`).
* **Status-Bar Clock vs. Receipt Timestamp Temporal Paradox Engine:**
  - Extracts the top status bar system time (e.g. `11:12`) and the transaction confirmation time (e.g. `11:45 AM`).
  - Identifies chronological impossibilities where transaction completion is reported after the status bar capture time ($\text{Clock} < \text{Receipt}$).
* **WhatsApp Media Laundering Detection:**
  - Identifies standard social media forward laundering signatures: stripping of all EXIF metadata, exact $Q=77$ chroma subsampling, and standard dimension downsampling caps.
* **Container & Chunk Inspection:**
  - Inspects PNG `tEXt`, `zTXt`, and `iTXt` metadata chunks for software generator signatures (`FakeGen-UI`, `Photoshop`, `Canva`).

### Layer 4: Multi-Layer Bayesian Fusion & Cross-Layer Spatial IoU Synergy
*File: `backend/app/services/forensic/layer4_ensemble/`*
* **Weighted Layer Aggregation:** Evaluates independent layer scores ($w_1=0.30$, $w_2=0.35$, $w_3=0.25$).
* **Cross-Layer Spatial IoU Synergy:** Computes Intersection-over-Union between Layer 1 physical anomaly bounding boxes (e.g. wavelet noise voids or ELA hotspots) and Layer 2 typographic bounding boxes (e.g. spliced amount baseline drift):
  $$\text{IoU}(B_1, B_2) = \frac{\text{Area}(B_1 \cap B_2)}{\text{Area}(B_1 \cup B_2)}$$
  When independent physical and typographic algorithms converge on the same bounding region ($\text{IoU} \ge 0.15$), a **$1.35\times$ cross-layer synergy multiplier** is applied, raising the confidence score to reflect multi-modal corroboration.

#### Calibrated Risk Index Classification
| Risk Score | Classification | Evidence Profile |
| :---: | :---: | :--- |
| **0% – 24%** | `AUTHENTIC_VERIFIED` | Native mobile viewport, clean baseline regression, uniform sensor noise, valid UTR, coherent timestamps. |
| **25% – 49%** | `INCONCLUSIVE_RECOMPRESSED` | Recompressed/laundered container without localized splicing signatures. Further verification recommended. |
| **50% – 74%** | `SUSPICIOUS_ANOMALIES` | Measurable single-layer anomaly (e.g. baseline drift $>4.5\text{px}$ or localized wavelet noise void). |
| **75% – 100%** | `MANIPULATED_FORGERY` | Multiple corroborated tampering traces or cross-layer spatial synergy convergence. |

---

## 3. Ground-Truth Synthetic Golden Dataset

VeriSight includes an automated synthetic dataset generator (`verisight/samples/generator.py`) producing 5 ground-truth test cases covering authentic baselines and real-world fraud vectors. 

> *All synthetic demonstration images are permanently watermarked with "SYNTHETIC DEMONSTRATION — NOT A REAL TRANSACTION" in accordance with forensic safety guidelines.*

| Sample ID | File | Target Scenario | Tamper Vectors | Risk Classification |
| :--- | :--- | :--- | :--- | :--- |
| **Sample 1** | `sample_1_authentic_gpay.png` | Authentic Google Pay Receipt | None. Native 1080×2400 viewport, valid 12-digit UTR, uniform noise, aligned text. | **18.4% (AUTHENTIC_VERIFIED)** |
| **Sample 2** | `sample_2_spliced_amount.jpg` | Spliced Amount Field | Pasted ₹95,250 over original amount. Baseline drift: **+8.0px**. Zero-noise wavelet void. | **50.1% (SUSPICIOUS_ANOMALIES)** |
| **Sample 3** | `sample_3_fake_generator_paradox.png` | Web Generator with Temporal Paradox | Status bar: 11:12 vs Receipt: 11:45 AM. Fake 10-digit UTR (`9999999999`). Generator tag. Corroborated with **1.35× Spatial IoU Synergy**. | **99.0% (MANIPULATED_FORGERY)** |
| **Sample 4** | `sample_4_whatsapp_laundered.jpg` | WhatsApp Forwarded Spliced Receipt | Stripped EXIF, Q=77 subsampling. Baseline drift survives compression. | **92.8% (MANIPULATED_FORGERY)** |
| **Sample 5** | `sample_5_cloned_chat_receipt.jpg` | Cloned Chat UI Elements | **62 ORB keypoint duplicate vectors**. Desktop DevTools crop (680×1120). | **88.0% (MANIPULATED_FORGERY)** |

---

## 4. Palantir/Sherloq-Style React Forensics Workbench

The frontend interface (`verisight/frontend/`) delivers an elite digital forensics workspace built with React 18, Vite, TypeScript, and Tailwind CSS.

### Key Capabilities
1. **Multi-Spectral Forensic Viewer:**
   - **Original View:** High-resolution rendering with dynamic overlays.
   - **ELA Heatmap:** Visualizes compression error divergence using a jet colormap.
   - **Wavelet Noise Residual:** Displays high-pass Daubechies db4 noise variance; reveals zero-noise voids.
   - **Clone-Move Vectors:** Renders matched ORB keypoints and vector displacement lines.
   - **Split Loupe:** Interactive slider for real-time before/after comparison.
   - **Quad-Spectral Mode:** Simultaneous 4-pane comparative analysis (Original, ELA, Wavelet, Clones).
2. **Interactive SVG Baseline Lasers:**
   - Overlays horizontal laser alignment guides across detected text baselines.
   - Aligned lines render in **cyan**; spliced lines with vertical drift render in **glowing red** with pixel drift badges (e.g. `DRIFT: +8.0px`).
3. **3x Synchronized Dual Loupe:**
   - Tracks cursor position across images to inspect sub-pixel anti-aliasing and JPEG blocking artifacts.
4. **Live Stage Judge Mobile QR Upload:**
   - Displays a dynamic QR code connected to the workstation's local network IP.
   - Judges can scan with a mobile phone and upload real screenshots with zero cables.
   - Web interface auto-polls every 2 seconds and triggers instant live analysis upon receipt.
5. **WhatsApp Media Laundering Simulator:**
   - Built-in educational modal demonstrating how social media compression alters images.
   - Displays side-by-side comparison, difference heatmaps, byte reduction metrics, and an explanation of which forensic signatures survive.
6. **Printable ISO/IEC 27037 Forensic Audit Dossier:**
   - One-click modal rendering a court-admissible forensic audit report.
   - Includes SHA-256 integrity hash, four-layer breakdown, risk gauge, findings table, and print-optimized CSS.

---

## 5. Quickstart & Installation

### System Prerequisites
- **Operating System:** Windows 10/11, macOS, or Linux
- **Python:** 3.10, 3.11, or 3.12
- **Node.js:** 18+ and npm

---

### Option A: One-Click Launch (Windows)
Run the root batch script:
```cmd
start-verisight.bat
```
This launcher checks prerequisites, generates synthetic golden samples if missing, starts the FastAPI backend daemon on port 8000, starts the Vite frontend daemon on port 5173, and opens your default browser to `http://localhost:5173`.

---

### Option B: Manual Setup

#### 1. Backend Setup
```bash
cd verisight/backend

# Create virtual environment (optional)
python -m venv venv
# Windows: venv\Scripts\activate | Unix: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend API will be available at `http://127.0.0.1:8000`. Interactive OpenAPI documentation is available at `http://127.0.0.1:8000/docs`.

#### 2. Frontend Setup
```bash
cd verisight/frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
The workbench UI will be available at `http://localhost:5173`.

---

## 6. Test Suites & Verification

VeriSight includes comprehensive automated unit and integration tests covering all 4 layers, synthetic sample analysis, and API endpoints.

### Run Python Test Suite (23/23 Tests)
```bash
cd verisight/backend
pytest tests/ -v
```
**Test Coverage Breakdown:**
- `test_layer1_signal.py`: ELA computation, Daubechies db4 wavelet noise variance, ORB copy-move detection, JPEG ghost quality sweep.
- `test_layer2_geometry.py`: Offline OpenCV MSER token extraction, clean baseline alignment, spliced baseline drift detection, CIELAB patch color step.
- `test_layer3_metadata.py`: Mobile viewport database lookup, NPCI 12-digit UTR validation, status bar vs receipt temporal paradox, WhatsApp laundering detection, EXIF inspection.
- `test_layer4_ensemble.py`: Clean baseline risk calibration, cross-layer spatial IoU synergy multiplier verification.
- `test_synthetic_samples.py`: API health check, demo samples catalog, end-to-end analysis on Samples 1 through 5.

### Run Frontend Static Type Checking & Build
```bash
cd verisight/frontend
npx tsc --noEmit
npm run build
```

---

## 7. API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status, active computer vision libraries, and timestamp. |
| `GET` | `/api/demo-samples` | Catalog of pre-generated golden test samples with metadata. |
| `POST` | `/api/analyze` | Upload and analyze an arbitrary screenshot (`multipart/form-data`). |
| `GET` | `/api/analyze-sample/{sample_id}` | Run full 4-layer forensic pipeline on a specific sample (`sample_1` to `sample_5`). |
| `POST` | `/api/simulate-whatsapp` | Educational endpoint: applies WhatsApp laundering pipeline to an uploaded image. |
| `POST` | `/api/mobile-upload` | Receives mobile camera photo uploads from the judge QR portal. |
| `GET` | `/api/latest-mobile-upload` | Polling endpoint returning the most recently uploaded mobile image ID. |
| `GET` | `/api/network-info` | Returns workstation LAN IP address for dynamic QR code generation. |

---

## 8. Scientific References & Attributions

VeriSight synthesizes and builds upon foundational image forensics research and open-source tools:

1. **Sherloq (Guido Bartoli):**
   - Reference: [GuidoBartoli/sherloq](https://github.com/GuidoBartoli/sherloq)
   - Architectural inspiration for Error Level Analysis, luminance gradient mapping, and interactive forensic inspection paradigms.
2. **TruFor & Noiseprint (Politecnico di Milano):**
   - Reference: Guillaro et al., *"TruFor: Leveraging RGB and Noise Analysis for Multimodal Image Forgery Detection"*, CVPR 2023.
   - Inspired VeriSight's high-pass spatial noise variance residual analysis using Daubechies `db4` wavelets.
3. **C2PA / Content Authenticity Initiative:**
   - Reference: [contentauth/c2pa-python](https://github.com/contentauth/c2pa-python)
   - Cryptographic provenance and container metadata chunk inspection standards.
4. **NPCI Unified Payments Interface (UPI) Specifications:**
   - National Payments Corporation of India procedural guidelines for 12-digit Transaction Reference Numbers (UTR).
5. **ISO/IEC 27037:2012 Standard:**
   - *Guidelines for identification, collection, acquisition and preservation of digital evidence.*

---

## 9. Monorepo Structure

```
verisight/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── endpoints.py               # REST API endpoints
│   │   ├── core/
│   │   │   └── config.py                  # Server configuration
│   │   ├── services/
│   │   │   ├── forensic/
│   │   │   │   ├── layer1_signal/         # ELA, Wavelet db4, ORB Copy-Move, Ghost
│   │   │   │   ├── layer2_geometry/       # Offline OCR, Baseline Lasers, CIELAB
│   │   │   │   ├── layer3_metadata/       # Viewport DB, UTR, Clock Paradox, WhatsApp
│   │   │   │   ├── layer4_ensemble/       # Bayesian Calibrator & Spatial IoU Synergy
│   │   │   │   └── pipeline.py            # Master 4-Layer Forensic Coordinator
│   │   │   └── vlm/                       # Optional semantic VLM provider
│   │   ├── simulation/
│   │   │   └── whatsapp_pipeline.py       # WhatsApp media laundering simulator
│   │   └── main.py                        # FastAPI entry point & lifespan
│   ├── tests/                             # 23 automated pytest suites
│   ├── requirements.txt                   # Backend dependencies
│   └── conftest.py                        # Pytest configuration
├── frontend/
│   ├── src/
│   │   ├── components/                    # React UI components
│   │   │   ├── ForensicViewer.tsx         # Multi-spectral viewer & SVG lasers
│   │   │   ├── SynchronizedLoupe.tsx      # 3x dual cursor tracking loupe
│   │   │   ├── RiskDossierSidebar.tsx     # Radial risk gauge & layer breakdown
│   │   │   ├── TopCommandBar.tsx          # Navigation, sample pills, action triggers
│   │   │   ├── WhatsAppSimulatorModal.tsx # Educational re-compression modal
│   │   │   ├── MobileUploadModal.tsx      # Dynamic LAN QR modal
│   │   │   ├── MobileUploadView.tsx       # Stage judge mobile capture portal
│   │   │   └── ForensicReportModal.tsx    # ISO/IEC 27037 printable audit dossier
│   │   ├── services/
│   │   │   └── api.ts                     # REST API client
│   │   ├── types/
│   │   │   └── forensic.ts                # TypeScript interfaces
│   │   ├── App.tsx                        # Main application container
│   │   └── main.tsx                       # React DOM entry
│   ├── package.json
│   ├── vite.config.ts                     # Reverse proxy to backend:8000
│   └── tailwind.config.js                 # Palantir dark theme tokens
├── samples/
│   ├── generator.py                       # Synthetic golden dataset generator
│   ├── sample_1_authentic_gpay.png        # Authentic Google Pay baseline
│   ├── sample_2_spliced_amount.jpg        # Spliced amount field (+8.0px drift)
│   ├── sample_3_fake_generator_paradox.png# Clock paradox & fake UTR generator
│   ├── sample_4_whatsapp_laundered.jpg    # WhatsApp forwarded forged receipt
│   └── sample_5_cloned_chat_receipt.jpg   # ORB keypoint cloned vectors
├── docs/                                  # Audit & architectural specifications
│   ├── ALGORITHM_COMPARISON.md
│   ├── ARCHITECTURE.md
│   ├── REFERENCE_REPOSITORY_AUDIT.md
│   ├── THIRD_PARTY_ATTRIBUTIONS.md
│   └── VALIDATION.md
├── start-verisight.bat                    # One-click Windows launcher
└── README.md                              # Master project documentation
```

---

## 10. License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details. Synthetic dataset assets and demonstration scripts are provided solely for educational, research, and forensic auditing purposes.
