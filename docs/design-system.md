# Handcrafted Indie Game Design System

**Project:** Interactive 3D Indie Portfolio CMS  
**Design Philosophy:** Handcrafted Indie Diorama (_Monument Valley_ meets _A Short Hike_)  
**Engine:** Next.js 16 + Tailwind CSS v4 + React 19

---

## 1. Visual Art Direction

The aesthetic is deliberate, warm, atmospheric, and distinctly human. It rejects generic AI SaaS templates, harsh neon purples, and gratuitous blur in favor of:

- **Earthy Tactility:** Crisp 1px borders with subtle inner bevels (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.05)`).
- **Atmospheric Palette:** Deep slate obsidian landscapes illuminated by warm amber runes, moss-covered stone, and terracotta accents.
- **Game HUD Elements:** Tactical coordinate tickers (`SECTOR: 01 // INDIE DIORAMA`), beacon pulses, and tactile push-buttons with mechanical depth.
- **Dual-Path Spatial Composition:** An interactive 3D diorama exploration layer paired with a permanent, fully accessible 2D navigation bar.

---

## 2. Semantic Color Tokens

All colors are exposed as CSS custom properties on `:root` and automatically mapped to Tailwind v4 utilities (`bg-realm-bg`, `text-realm-amber`, etc.):

```css
:root {
  /* Surface & Background */
  --realm-bg: #0d131a; /* Deep obsidian slate canvas */
  --realm-bg-surface: #141d27; /* Primary container and section background */
  --realm-bg-card: #182330; /* Tactile card surface */
  --realm-bg-elevated: #202d3d; /* Elevated controls, badges, hovered states */
  --realm-border: #2c3c4f; /* Standard structural border */
  --realm-border-light: #3d5168; /* Interactive hover border */

  /* Text & Hierarchy */
  --realm-text-primary: #f5f4f0; /* Warm parchment white for headings */
  --realm-text-secondary: #a9bac7; /* Readable muted slate for body paragraphs */
  --realm-text-muted: #6f8291; /* Monospace telemetry, dates, captions */

  /* Accents & Status */
  --realm-amber: #d99b38; /* Primary rune gold / interactive focus */
  --realm-amber-glow: #f3c46b; /* Hover glow */
  --realm-moss: #3d634f; /* Forest green for verified badges / live telemetry */
  --realm-moss-bright: #528a6d; /* Active beacon indicator */
  --realm-clay: #c45a3c; /* Terracotta warning / destructive action */
  --realm-parchment: #e4dbc9; /* Light theme alternate token */
}
```

### Dynamic CMS Theme Presets

Theme presets override CSS variables dynamically via `data-theme` attributes without requiring rebuilds:

```css
[data-theme="parchment"] {
  --realm-bg: #f5f2ea;
  --realm-bg-surface: #ebe5d7;
  --realm-bg-card: #e2dbca;
  --realm-text-primary: #23201b;
  --realm-text-secondary: #575145;
  --realm-amber: #b0701a;
  --realm-moss: #2f5240;
}
```

---

## 3. Typography Hierarchy

Fonts are self-hosted via `next/font/google` for zero layout shifts and instant loading:

| Role                    | Font Family      | Variable       | Usage                                               |
| :---------------------- | :--------------- | :------------- | :-------------------------------------------------- |
| **Display / Headings**  | `Outfit`         | `--font-sans`  | Hero titles, section headers, brand mark.           |
| **Editorial Prose**     | `Newsreader`     | `--font-serif` | Deep case studies, philosophical journey chronicle. |
| **Technical Telemetry** | `JetBrains Mono` | `--font-mono`  | Coordinates, dates, tags, status badges, code.      |

---

## 4. Spacing, Radii & Tactile Depth

- **Radii:**
  - `--radius-tactile: 10px` — Used on buttons, cards, inputs, dialog surfaces.
  - `--radius-pill: 9999px` — Used on status badges and navigation pill capsules.
- **Tactile Depths:**
  - Standard Button: `shadow: [0 2px 0 #9f6c18, 0 4px 12px rgba(217,155,56,0.25)]`
  - Active Press: `transform: translateY(1px); shadow: [0 1px 0 #9f6c18]`
  - Tactile Card: `border: 1px solid var(--realm-border); shadow: [0 4px 16px -2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)]`

---

## 5. Motion & Reduced-Motion Policy

- All interactive state transitions use fast, spring-like easing: `transition: all 0.15s ease-out`.
- Camera transitions and floating motes honor `prefers-reduced-motion: reduce`:
  - Camera lerps are replaced with instant snap or subtle crossfades.
  - Particle physics and beacon pulses are halted or replaced with static glows.
