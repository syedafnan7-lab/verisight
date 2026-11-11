# VeriSight Pro — Real Website Design Research & Comparative Analysis

**Date:** November 11, 2026  
**Methodology:** Direct inspection of live public websites using headless browser automation (`playwright`).

---

## 1. Reference 1: ScamShield AI (`https://www.scamshieldai.in/`)

### A. Actual Interface Observed
- **Target URL**: `https://www.scamshieldai.in/features/payment-received-check`
- **Headline**: *"Payment successful, but the money never arrived?"*
- **Primary Message**: *"ScamShield AI checks whether a UPI payment screenshot is fake, and returns a verdict, usually in under 10 seconds."*
- **Structure**:
  1. Clear, emotional pain point: *"A customer sends a screenshot showing '₹18,500, Payment Successful.' The goods are dispatched. The money never arrives."*
  2. Four-stage mechanism: ELA, OCR on-image reading, UPI handle reputation, QR decoding.
  3. Illustrative verdict card: `HIGH RISK · 88/100`, category tags, and plain-English bullet points.
  4. 3-step action model: 1. Upload or paste -> 2. Forensic + reputation check -> 3. Decide with confidence.

### B. What Verisight Should Learn From It
- **Clear Problem Formulation**: Indian merchants, fraud officers, and digital-forensics investigators encounter fake payment screenshots created via template generators and photo editing apps. Verisight must clearly explain this problem in its Product Overview.
- **Explainable Verdict Presentation**: Present findings in plain English (e.g. *"The font baseline for the amount field drifts +4.8px below neighboring text, indicating digital text insertion"*).
- **Practical User Persona Alignment**: Address fraud analysts, compliance reviewers, and merchants directly.

### C. What Should NOT Be Copied
- **Do not copy ScamShield's branding or verbatim copy**: Verisight is an investigative digital-forensics workstation, not a retail SMB scanner.
- **Do not claim bank verification**: Never claim that Verisight confirms whether bank funds actually moved unless an API integration to an authorized banking rail exists.
- **Do not promise automated conclusive fraud determinations**: Always maintain scientific caveats: *"Heuristic forensic indicator · warrants human verification"*.

### D. Proposed Verisight Implementation
- **Overview Positioning**: *"Investigate the integrity of payment screenshots. Understand the evidence behind every finding."*
- **4-Stage Workflow**:
  - `01 — UPLOAD`: Submit payment screenshot or choose a labelled demonstration sample.
  - `02 — ANALYZE`: Execute 4-layer multi-spectral forensic signal extraction.
  - `03 — INVESTIGATE`: Inspect anomaly regions, baseline lasers, and OCR geometry.
  - `04 — DOCUMENT`: Review calibrated findings and generate a court-admissible dossier.

---

## 2. Reference 2: Linear (`https://linear.app/now/behind-the-latest-design-refresh`)

### A. Actual Interface Observed
- Navigation chrome is dimmed several notches below active workspace content.
- Borders and dividers are soft hairline rules (`rgba(255,255,255,0.07)`).
- Typography relies on crisp weights and sentence-case labels without screaming all-caps.

### B. What Verisight Should Learn From It
- Calmer interface chrome so evidence images are the primary focal point.
- Structure felt through spacing and subtle borders rather than heavy colored cards.

### C. What Should NOT Be Copied
- Icon-only navigation without text labels: forensic tools require explicit labeling to avoid critical errors.

---

## 3. Reference 3: Sentry (`https://sentry.io/changelog/new-issue-details-ui-now-available/`)

### A. Actual Interface Observed
- Clear boundary between triage workflow actions and technical diagnostic details.
- Expandable drawers and accordions for deep telemetry (stack traces, breadcrumbs).

### B. What Verisight Should Learn From It
- Progressive disclosure: High-level findings visible immediately; raw mathematical metrics (CIELAB ΔE, Daubechies variance) accessible via accordion or Advanced Mode.

### C. What Should NOT Be Copied
- Multi-nested tab drawers that bury critical anomalies several clicks deep.

---

## 4. Reference 4: Vercel (`https://vercel.com/changelog/dashboard-navigation-redesign-rollout`)

### A. Actual Interface Observed
- Collapsible sidebar that frees up 100% viewport width for logs and diffs.
- Unified top navigation across team, project, and deployment views.

### B. What Verisight Should Learn From It
- Collapsible Risk Dossier (`[` hotkey) that shrinks into a 48px mini-rail with an overall score badge, giving the image viewer full canvas width.
- Responsive adaptation: desktop multi-column collapses into a touch-friendly single column on mobile.

---

## 5. Reference 5: 21st.dev (`https://docs.21st.dev/`)

### A. Actual Interface Observed
- High-craft React/shadcn primitives: interactive comparison sliders, command menus, and dark glassmorphic toolbars.

### B. What Verisight Should Learn From It
- Interactive **Split Comparison Slider** allowing real-time draggable comparison between Original Evidence and active spectral heatmaps (ELA, Wavelet, Clones).

---

## 6. Reference 6: React Bits (`https://reactbits.dev/`)

### A. Actual Interface Observed
- Micro-dot matrices, mouse-proximity spotlights, and subtle scanline animations.

### B. What Verisight Should Learn From It
- Ambient dual-scale forensic grid (16px micro-dots + 128px crosshair matrix) with hardware-accelerated cursor spotlight illumination.
- 450ms laser scanline sweep on case switch.
- Slow-breathing ambient threat-state backlight (Emerald, Amber, Rose) reflecting the active risk score.
