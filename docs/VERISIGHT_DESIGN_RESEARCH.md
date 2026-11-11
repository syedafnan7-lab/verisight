# VeriSight — Forensic Design Research & Comparative Analysis

## 1. Research Overview

To elevate Verisight beyond a generic web dashboard into an authoritative, calm, and technically rigorous digital-forensics investigation workstation, we conducted direct browser inspection of public high-watermark applications using headless automation (`playwright`).

Screenshots and page models were captured and analyzed across six benchmark platforms:
1. **Linear** (`https://linear.app/now/behind-the-latest-design-refresh`)
2. **Sentry** (`https://sentry.io/changelog/new-issue-details-ui-now-available/`)
3. **Vercel** (`https://vercel.com/changelog/dashboard-navigation-redesign-rollout`)
4. **21st.dev** (`https://docs.21st.dev/`)
5. **Radix Primitives** (`https://www.radix-ui.com/primitives`)
6. **React Bits & Raycast** (`https://reactbits.dev/`, `https://raycast.com`)

---

## 2. In-Depth Reference Case Studies

### A. Linear: "A Calmer Interface for a Product in Motion"
- **Reference URL**: `https://linear.app/now/behind-the-latest-design-refresh`
- **Artifact Captured**: `artifacts/screenshots/verisight-ui/reference_linear.png`

#### 1. What We Observed
- Linear intentionally dimmed its navigation chrome by multiple stops relative to active workspace content.
- Borders and separators were softened: lines are not high-contrast white or cyan rules, but low-contrast dividers that clarify relationships without drawing attention.
- Elimination of excessive iconography and colored icon backgrounds.
- Header bars are consolidated: actions are placed in predictable, calm spatial zones rather than competing with primary data.

#### 2. Why It Works
- Human perception naturally prioritizes high-contrast and saturated elements. In an information-dense tool, loud chrome forces the user's brain to constantly filter out non-essential borders and badges before reaching the data.
- "Structure should be felt, not seen." Soft boundaries maintain grouping without creating visual noise.

#### 3. Verisight Problem It Solves
- Existing Verisight header is visually over-saturated with glowing gradients (`from-sky-400 via-indigo-300 to-purple-400`), loud pill selectors, and contrasting colored buttons. By adopting Linear's dimmed, calm chrome, the forensic evidence image becomes the undisputed visual focal point of the screen.

#### 4. What Should NOT Be Copied
- Linear's ultra-minimalist iconography without visible text labels: forensic tools require explicit, unambiguous actions so investigators and legal officers never misclick during evidence review.

#### 5. User Appropriateness
- Highly appropriate for fraud analysts and investigators who spend hours staring at screens; reduced chrome brightness prevents eye fatigue and sharpens focus on subtle pixel anomalies.

---

### B. Sentry: "New Issue Details UI — Progressive Disclosure & Information Hierarchy"
- **Reference URL**: `https://sentry.io/changelog/new-issue-details-ui-now-available/`
- **Artifact Captured**: `artifacts/screenshots/verisight-ui/reference_sentry.png`

#### 1. What We Observed
- Clear spatial separation between triage workflow actions (resolve, assign, ignore) and technical evidentiary diagnostics (stack traces, breadcrumbs, tags).
- Heavy use of **progressive disclosure**: high-level summaries are visible immediately, while complex technical metadata (raw JSON, thread states, environment variables) is housed in collapsible sections and expandable drawers.

#### 2. Why It Works
- Allows two tiers of users—first-line triage responders and deep diagnostic engineers—to use the exact same screen without cluttering either persona's workflow.

#### 3. Verisight Problem It Solves
- Verisight serves both non-technical fraud reviewers (who need clear verdict explanations, such as "Spliced Amount Detected") and forensic scientists/cyber-police (who need exact Daubechies db4 wavelet coefficients, CIELAB Delta-E values, and EXIF quantization tables).
- Adopting a dual-level layout (**Simple Mode** vs. **Advanced Forensic Mode**) directly resolves this tension.

#### 4. What Should NOT Be Copied
- Sentry's multi-nested tab system inside drawers: in a forensic workstation, cross-referencing between ELA, Wavelet, and Geometry must happen quickly without deeply buried nested tabs.

#### 5. User Appropriateness
- Essential. Gives confidence to non-technical users while providing complete evidentiary rigor for court-admissible dossiers.

---

### C. Vercel: "Dashboard Navigation Redesign & Resizable Shell"
- **Reference URL**: `https://vercel.com/changelog/dashboard-navigation-redesign-rollout`
- **Artifact Captured**: `artifacts/screenshots/verisight-ui/reference_vercel.png`

#### 1. What We Observed
- Horizontal tab clutter was eliminated by moving secondary views into a resizable, collapsible sidebar.
- Seamless responsive behavior: desktop resizable panels gracefully collapse into a floating, touch-friendly bottom action rail on mobile.
- Clean monochromatic slate background (`#000000` to `#0a0a0a`) with razor-sharp 1px subtle zinc borders (`#262626`).

#### 2. Why It Works
- Gives users complete control over their viewport: when reviewing code diffs or deployment logs, users can collapse navigation completely to maximize real estate.

#### 3. Verisight Problem It Solves
- In existing Verisight, the Risk Dossier sidebar is rigidly locked at 384px width (`w-96`), severely constricting the image viewing canvas.
- Adding a toggleable/collapsible sidebar allows investigators to expand the multi-spectral evidence viewer to full-width when inspecting microscopic pixel edits.

#### 4. What Should NOT Be Copied
- Vercel's heavy reliance on keyboard shortcuts without visible hints; forensic workstations must have visible, discoverable controls for non-power users.

#### 5. User Appropriateness
- Excellent fit for desktop analysts and mobile field investigators alike.

---

### D. 21st.dev: "Component Engineering & Specialized UI Primitives"
- **Reference URL**: `https://docs.21st.dev/`
- **Artifact Captured**: `artifacts/screenshots/verisight-ui/reference_21st.png`

#### 1. What We Observed
- Modern design engineers on 21st.dev build purpose-built components: Before/After comparison sliders with dual-track coordinate mapping, resizable split panels, interactive loupes, and command drawers.
- Focus on clean Tailwind utility tokens and composable state rather than heavy monolithic libraries.

#### 2. Why It Works
- Off-the-shelf generic UI kits lack domain-specific tools (like interactive image diffing). 21st.dev demonstrates how to craft bespoke forensic tools using lean primitives.

#### 3. Verisight Problem It Solves
- Solves the need for an interactive **Before/After Split Slider** and **Synchronized Comparison View** where an investigator can drag a divider across an evidence image to immediately reveal the Error Level Analysis (ELA) or Wavelet noise discrepancies underneath.

#### 4. What Should NOT Be Copied
- Flashy 3D canvas backgrounds or WebGL particle effects that compete for GPU and CPU cycles during image raster processing.

#### 5. User Appropriateness
- Directly applicable to evidence examination.

---

### E. Radix UI: "Accessible Primitives, Focus Management & Predictable States"
- **Reference URL**: `https://www.radix-ui.com/primitives`
- **Artifact Captured**: `artifacts/screenshots/verisight-ui/reference_radix.png`

#### 1. What We Observed
- Complete separation of functional state (WAI-ARIA semantics, keyboard focus, escape handlers) from visual presentation.
- Rigorous focus rings, keyboard navigation (arrow keys for tabs, Escape for modals, Tab traversal without traps).

#### 2. Why It Works
- Software built on solid accessible primitives feels crisp, responsive, and robust under keyboard shortcuts and screen readers.

#### 3. Verisight Problem It Solves
- Ensures all modals (Section 91 Notice, WhatsApp Launder Simulator, Print Dossier, Mobile QR) and spectral tabs have accessible keyboard controls (`Escape` to close, arrow navigation across tabs, focus-visible outlines).

#### 4. What Should NOT Be Copied
- Unstyled bare defaults without strong visual branding; primitives must be wrapped with Verisight's authoritative dark palette.

#### 5. User Appropriateness
- Critical for institutional, enterprise, and legal compliance.

---

### F. Raycast & React Bits: "Zero-Latency Workstation Speed & Restrained Motion"
- **Reference URLs**: `https://raycast.com`, `https://reactbits.dev/`
- **Artifact Captured**: `artifacts/screenshots/verisight-ui/reference_raycast.png`, `reference_reactbits.png`

#### 1. What We Observed
- Raycast has **zero animation on frequent keyboard actions**; operations complete instantly with sub-millisecond perceived latency.
- Subtle purposeful effects: fine hairline scan lines, laser calibration indicators, and crisp tabular figures for telemetry.

#### 2. Why It Works
- Power users feel disrespected when UI animations delay repetitive tasks. Instant response communicates professional authority.

#### 3. Verisight Problem It Solves
- Switching between spectral layers (Original -> ELA -> Wavelet -> Copy-Move) must happen instantaneously (0ms delay) with optional optical cross-fade only on user drag. No delayed spring animations or bloated transition timeouts.

#### 4. What Should NOT Be Copied
- Over-the-top decorative animations (blob cursors, gravity particles, floating ribbons) that distract from forensic scrutiny.

#### 5. User Appropriateness
- Vital. Investigators demand immediate tool execution.

---

## 3. Synthesis: The Verisight Forensic Workstation Principles

| Principle | Source Reference | Application in Verisight |
|:---|:---|:---|
| **Calm Chrome, Dominant Evidence** | Linear | Dim the top bar and sidebar; eliminate rainbow gradients; dedicate 70%+ of desktop width to the multi-spectral canvas. |
| **Progressive Disclosure** | Sentry | Dual-tier presentation: Human-readable findings by default; click/toggle for raw Daubechies coefficients, CIELAB coordinates, and EXIF tags. |
| **Flexible Spatial Layout** | Vercel | Collapsible Risk Dossier; quick toggle between Single View, Split Comparison Slider, and Quad-Spectral Matrix. |
| **Interactive Evidence Comparison** | 21st.dev | Interactive draggable before/after slider comparing Original vs. ELA/Wavelet/Clones in real time. |
| **Accessible & Keyboard First** | Radix UI | Full keyboard shortcuts (`1-5` for samples, `O/E/W/C/S/Q` for spectral modes, `F` for fit-to-screen, `Esc` to dismiss). |
| **Zero-Latency Precision** | Raycast & Emil Kowalski | Instant layer switching, tabular numbers for all forensic metrics, no sluggish transitions on critical paths. |
