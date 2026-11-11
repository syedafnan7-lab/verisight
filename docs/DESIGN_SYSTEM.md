# VeriSight Pro — Forensic Design System Specification

**Design Direction:** High-precision scientific laboratory workstation meeting modern anti-slop editorial clarity.  
**Bar:** Linear, Sentry, ScamShield AI, and Figma.

---

## 1. Color Palette & Semantic Forensic Tokens

```css
:root {
  /* Surface Foundations */
  --surface-base: #060911;       /* Deepest ambient substrate */
  --surface-canvas: #090D16;     /* Elevated workbench & navigation */
  --surface-card: #0D1424;       /* Foreground interactive container */
  --surface-card-hover: #121B30; /* Active hover state */
  --surface-elevated: #162035;   /* Modals, popovers, dropdown menus */

  /* Borders & Dividers */
  --border-hairline: rgba(255, 255, 255, 0.07);
  --border-subtle: rgba(255, 255, 255, 0.12);
  --border-focus: #38bdf8; /* Sky-400 */

  /* Semantic Forensic Statuses */
  --status-authentic-bg: rgba(16, 185, 129, 0.15);
  --status-authentic-border: rgba(16, 185, 129, 0.40);
  --status-authentic-text: #34d399; /* Emerald-400 */

  --status-review-bg: rgba(245, 158, 11, 0.15);
  --status-review-border: rgba(245, 158, 11, 0.40);
  --status-review-text: #fbbf24;    /* Amber-400 */

  --status-tampered-bg: rgba(244, 63, 94, 0.18);
  --status-tampered-border: rgba(244, 63, 94, 0.50);
  --status-tampered-text: #fb7185;  /* Rose-400 */

  --status-info-bg: rgba(56, 189, 248, 0.15);
  --status-info-border: rgba(56, 189, 248, 0.40);
  --status-info-text: #38bdf8;      /* Sky-400 */
}
```

---

## 2. Typography Hierarchy

* **Primary Body & Headings**: `Inter`, `system-ui`, `-apple-system`, `sans-serif`
* **Telemetry & Cryptographic Identifiers**: `JetBrains Mono`, `ui-monospace`, `Consolas`, `monospace`
* **Numeric Guidance**: All forensic scores, pixel coordinates, and timestamps use tabular figures (`tabular-nums font-mono`) to prevent layout jitter during live updates.

| Element | Font Family | Size | Weight | Line Height | Tracking |
|:---|:---|:---|:---|:---|:---|
| **Display Hero** | Sans | 38px / 48px | 700 (Bold) | 1.1 | -0.02em |
| **Section Title** | Sans | 24px / 28px | 600 (Semibold) | 1.2 | -0.01em |
| **Subsection Header** | Sans | 16px / 18px | 600 (Semibold) | 1.3 | Normal |
| **Body Narrative** | Sans | 14px | 400 (Regular) | 1.6 | Normal |
| **Micro Labels** | Sans | 12px | 500 (Medium) | 1.4 | Normal |
| **Telemetry Metric** | Mono | 12px / 14px | 600 (Semibold) | 1.0 | +0.02em |
| **Code / Hash / Coord** | Mono | 11px | 400 (Regular) | 1.4 | Normal |

---

## 3. Atmospheric Effects & Micro-Interactions

1. **Forensic Grid Matrix**:
   Dual-scale grid with 16px micro-dots (`rgba(255,255,255,0.05)`) and 128px macro grid with crosshair intersections.
2. **Cursor Proximity Spotlight**:
   Radial illumination (`420px circle at var(--mouse-x) var(--mouse-y), rgba(56,189,248,0.09)`) tracking pointer position.
3. **Dynamic Threat-State Backlight**:
   Slow-breathing radial backlight shifting between Cool Emerald (Authentic), Amber (Review Required), and Crimson (Tampered / Spliced).
4. **Tactile Button Physics**:
   Every interactive element provides instant physical feedback: `active:scale-[0.97] transition-transform duration-100 ease-out` with a 1px top highlight `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]`.
5. **Sliding Segmented Tabs**:
   Smooth spring glide via Framer Motion's `layoutId` (`stiffness: 420, damping: 32`).
