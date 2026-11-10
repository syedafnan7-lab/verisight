# VERISIGHT PRO v1.0 — DESIGN RESEARCH & COMPONENT INTEGRATION SPECIFICATION

**Project:** VERISIGHT PRO v1.0  
**Phase:** 1 — Design Research & Component Selection  
**Date:** November 11, 2026  
**Audience:** Principal Product Designer, Senior React Architect, Lead UX Engineer  

---

## 1. Executive Overview

This document records the architectural and interaction design research conducted prior to the Phase 2–10 implementation. The goal is to solve the visual overcrowding identified in the previous version, prioritize the evidence investigation canvas, implement a dynamic risk-responsive visual system with an **87% critical-risk threshold**, and selectively integrate components from **React Bits** and **21st.dev**.

---

## 2. Research Analysis of Design References

### Reference A: Linear (Information Density & Navigation Discipline)
- **Reference URL**: `https://linear.app/now/behind-the-latest-design-refresh`
- **Key Findings**:
  - **Single-Line Header**: Linear confines global navigation, view toggles, and user actions into a single 44–56px bar with high contrast and zero clutter.
  - **Muted Secondary Actions**: Non-primary actions are grouped under keyboard-accessible dropdowns or command palettes rather than exposed as individual buttons.
  - **Subtle Surface Elevation**: Surface hierarchy is established through 1px border contrasts (`#1e293b` on `#070b14`) and subtle background shifts (`#0b1220` -> `#101827`) rather than glowing gradients on every card.
  - **Typography Discipline**: Monospace font is restricted strictly to machine data, identifiers, and timestamps. Body copy uses clean, legible sans-serif.

### Reference B: Sentry (Forensic Issue Details & Progressive Disclosure)
- **Reference URL**: `https://docs.sentry.io/product/issues/issue-details/`
- **Key Findings**:
  - **Two-Column Asymmetric Workspace**: Main investigation area occupies 70–75% of horizontal space; metadata and triage sidebar occupies 25–30%.
  - **Progressive Disclosure Accordions**: Heavy stack traces, breadcrumbs, and raw headers are collapsed by default behind clear metric badges.
  - **Severity Banners**: Critical issues display a sticky, dismissible triage banner with immediate action buttons (`Resolve`, `Ignore`, `Assign`) that does not occlude the core crash telemetry.

### Reference C: Vercel (Collapsible Navigation & Common Action Prioritization)
- **Reference URL**: `https://vercel.com/changelog/dashboard-navigation-redesign-rollout`
- **Key Findings**:
  - **Collapsible Rails**: Secondary panels can be collapsed with a single click, allowing the centerpiece deployment/preview canvas to expand to 100% width.
  - **Contextual Status Pills**: The state of the current environment (e.g. `Production`, `Preview`, `Failed`) is conveyed via a compact pill in the header.

### Reference D: React Bits (Micro-Interactions & Ambient Surfaces)
- **Reference URL**: `https://reactbits.dev/`
- **Catalog Inspection**:
  - **DotField / DotGrid**: Clean interactive dot matrix with subtle radial cursor falloff. Perfect for a forensic canvas background without the heavy 500KB Three.js overhead.
  - **SpotlightCard**: Dynamic radial spotlight that tracks cursor movement, providing subtle illumination on the active card.
  - **BorderGlow**: Subtle gradient rim lighting that responds to focus/hover, ideal for highlighting the primary evidence canvas.
  - **DecryptedText**: Hacker/investigative text decryption effect for case numbers and forensic identifiers.
- **Architectural Decision**: Avoid heavy WebGL/Three.js backgrounds (`Ballpit`, `Beams`, `Galaxy`) that cause GPU churn, memory leaks, and render latency during heavy OpenCV canvas manipulation. Use lightweight, zero-dependency CSS/Canvas shaders and CSS variable-driven radial vignettes.

### Reference E: 21st.dev (Component Architecture & Collapsible Layouts)
- **Reference URL**: `https://docs.21st.dev/%40wensity/components/sidebar`
- **Catalog Inspection**:
  - **Collapsible Sidebar**: A smooth transition rail that collapses from 384px to 0px (or a 48px icon rail), releasing horizontal space for the canvas.
  - **Command Dropdown / Menu**: Grouping secondary actions (WhatsApp simulation, Judge QR, Statutory Notice, Risk Configuration) into an accessible popover.
  - **Scenario Switcher Popover**: Replacing 5 cluttered scenario buttons in the header with a compact, searchable dropdown.

---

## 3. Selected Components & Integration Rationale

| Component | Source Reference | VeriSight Implementation Target | Rationale & Performance Impact |
|---|---|---|---|
| **Dynamic Atmospheric Background** | React Bits (`DotField` + `SoftAurora` concept) | `frontend/src/components/ui/AtmosphericBackground.tsx` | CSS variable-driven (`--risk-accent`, `--risk-bg-tint`). Smooth 500ms transition without Three.js. Respects `prefers-reduced-motion`. |
| **Collapsible Sidebar Rail** | 21st.dev (`@wensity/sidebar`) | `frontend/src/components/RiskDossierSidebar.tsx` | Allows evidence canvas to expand from ~72% to 100% width. Persisted in `localStorage`. |
| **Command & Actions Menu** | 21st.dev (`CommandMenu` / Dropdown) | `frontend/src/components/TopCommandBar.tsx` | Consolidates WhatsApp, Judge QR, Section 91, and Settings into a single clean dropdown. |
| **Scenario Switcher Dropdown** | Linear / 21st.dev Popover | `frontend/src/components/TopCommandBar.tsx` | Eliminates 5 horizontal scenario buttons. Displays active scenario with clean tag pills. |
| **Critical Risk Alert Banner** | Sentry Severity Banner | `frontend/src/components/CriticalRiskAlert.tsx` | Appears at >= 87 score. Highlights suspected manipulation with immediate investigation actions. |
| **Risk Threshold Configuration Modal** | 21st.dev Dialog & Slider | `frontend/src/components/RiskThresholdModal.tsx` | Allows adjusting the critical threshold (default: 87) with live preview and persistence. |
| **Contextual Workspace HUD** | Linear Toolbar | `frontend/src/components/ForensicViewer.tsx` | Embeds active channel info directly into the canvas header, freeing a complete horizontal row. |

---

## 4. Risk State System & Threshold Architecture

### Centralized Risk Bands
```typescript
export type RiskLevel = "LOW" | "MODERATE" | "ELEVATED" | "CRITICAL" | "UNKNOWN" | "DATA_ERROR";

export const DEFAULT_CRITICAL_RISK_THRESHOLD = 87.0;

export interface RiskState {
  score: number | null;
  level: RiskLevel;
  label: string;
  subtext: string;
  accentColor: string;
  glowColor: string;
  bgTint: string;
  borderColor: string;
  criticalThreshold: number;
}
```

- **LOW (`0.00 – 39.99`)**: Navy/black atmosphere, Emerald (`#10B981`) accents. *"LOW RISK — No critical manipulation indicators detected."*
- **MODERATE (`40.00 – 69.99`)**: Subtle Amber (`#F59E0B`) highlights. *"MODERATE RISK — Additional review recommended."*
- **ELEVATED (`70.00 – 86.99`)**: Controlled Orange (`#F97316`) illumination. *"ELEVATED RISK — Multiple suspicious indicators detected."*
- **CRITICAL (`>= 87.00`)**: Deep Crimson (`#F43F5E`) atmosphere. *"CRITICAL RISK — POSSIBLE FRAUD / SUSPECTED MANIPULATION."* Persistent alert banner activated.
- **UNKNOWN (`null` / `undefined`)**: Muted slate (`#64748B`). Never defaulted to zero.
- **DATA_ERROR (`< 0` or `> 100` or `NaN`)**: Warning crimson outline with data error banner.

---

## 5. Implementation Roadmap

1. **Phase 2**: Rebuild `TopCommandBar.tsx` (Level 1: 60px header + Level 2: compact stepper + scenario dropdown + actions menu).
2. **Phase 3 & 4**: Rebuild `ForensicViewer.tsx` (Embed channel info, maximize canvas to ~72%/100%, contextual toolbar).
3. **Phase 5 & 6**: Build centralized `src/services/riskTheme.ts` & `CriticalRiskAlert.tsx`. Update `AtmosphericBackground.tsx` to transition smoothly with `--risk-accent`.
4. **Phase 7**: Build `RiskThresholdModal.tsx` for configurable critical threshold (0–100, default 87).
5. **Phase 3 (Sidebar)**: Upgrade `RiskDossierSidebar.tsx` to be collapsible with expand/collapse toggle and compact mode.
6. **Phase 11**: Write comprehensive unit tests in `src/services/__tests__/riskTheme.test.ts`.
7. **Phase 12**: Run native Playwright verification on all risk states, viewports, and capture screenshots.