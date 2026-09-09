---
name: web-design-guidelines
description: >-
  Vercel Web Interface Guidelines. Comprehensive standards for modern web interfaces,
  accessibility, focus states, animations, forms, typography, performance, and dark mode.
---

# Web Interface Guidelines (Vercel)

Review and build UI code for strict compliance with modern Web Interface Guidelines.

## Rules & Standards

### Accessibility
- Icon-only buttons MUST have `aria-label`.
- Form controls MUST have `<label>` or `aria-label`.
- Interactive elements MUST have keyboard handlers (`onKeyDown`/`onKeyUp`).
- Use `<button>` for actions, `<a>`/`<Link>` for navigation (NEVER `<div onClick>`).
- Images need `alt` (or `alt=""` if decorative).
- Decorative icons need `aria-hidden="true"`.
- Async updates (toasts, live validation) need `aria-live="polite"`.
- Use semantic HTML (`<button>`, `<a>`, `<label>`, `<table>`) before ARIA.
- Headings must be hierarchical `<h1>`–`<h6>`; include skip links for main content.
- `scroll-margin-top` on heading anchors.

### Focus States
- Interactive elements need visible focus: `focus-visible:ring-*` or equivalent.
- NEVER use `outline-none` / `outline: none` without focus replacement.
- Use `:focus-visible` over `:focus` (avoid focus rings on click).
- Group focus with `:focus-within` for compound controls.
- Sticky headers/footers/overlays must not obscure the focused element.

### Forms
- Inputs need `autocomplete` and meaningful `name`.
- Use correct `type` (`email`, `tel`, `url`, `number`) and `inputmode`.
- Never block paste (`onPaste` + `preventDefault`).
- Labels must be clickable (`htmlFor` or wrapping control).
- Disable spellcheck on emails, codes, usernames (`spellCheck={false}`).
- Checkboxes/radios: label + control share a single hit target (no dead zones).
- Submit button stays enabled until request starts; show spinner during request.
- Errors inline next to fields; focus first error on submit.
- Placeholders end with `…` and show example pattern.
- Warn before navigation with unsaved changes.

### Animation & Motion
- Honor `prefers-reduced-motion` (provide reduced variant or disable).
- Animate `transform` and `opacity` only (GPU/compositor-friendly).
- NEVER use `transition: all` — list properties explicitly.
- Set correct `transform-origin`.
- SVG: transforms on `<g>` wrapper with `transform-box: fill-box; transform-origin: center`.
- Animations must be interruptible — respond to user input mid-animation.
- Autoplay motion >5 seconds alongside other content needs pause, stop, or hide controls.

### Typography
- Use ellipsis `…` not `...`.
- Curly quotes `“` `”` not straight `"`.
- Non-breaking spaces: `10 MB`, `⌘ K`, brand names.
- Loading states end with `…`: `"Loading…"`, `"Saving…"`.
- `font-variant-numeric: tabular-nums` for number columns and metric comparisons.
- Use `text-wrap: balance` or `text-pretty` on headings to prevent widows.

### Content Handling
- Text containers must handle long content: `truncate`, `line-clamp-*`, or `break-words`.
- Flex children need `min-w-0` to allow text truncation.
- Handle empty states gracefully — do not render broken UI for empty data.

### Performance
- Large lists (>50 items): virtualize (`virtua`, `content-visibility: auto`).
- No layout reads in render (`getBoundingClientRect`, `offsetHeight`, `offsetWidth`, `scrollTop`).
- Batch DOM reads/writes; avoid interleaving.
- Critical fonts: `<link rel="preload" as="font">` with `font-display: swap`.
- Images need explicit `width` and `height` to prevent Cumulative Layout Shift (CLS).
- Below-fold images: `loading="lazy"`. Above-fold critical images: `fetchpriority="high"`.

### Navigation & State
- URL reflects state — sync filters, tabs, pagination, and expanded panels in query params.
- Links use `<a>`/`<Link>` (Cmd/Ctrl+click, middle-click support).
- Deep-link all stateful UI.
- Destructive actions need confirmation modal or undo window — never immediate.

### Dark Mode & Theming
- `color-scheme: dark` on `<html>` for dark themes (fixes scrollbar, inputs).
- `<meta name="theme-color">` matches page background.
- Native `<select>`: explicit `background-color` and `color`.

### Anti-Patterns to Flag & Ban
- `user-scalable=no` or `maximum-scale=1` disabling zoom.
- `onPaste` with `preventDefault`.
- `transition: all`.
- `outline-none` without focus-visible replacement.
- Inline `onClick` navigation without `<a>`.
- `<div>` or `<span>` with click handlers (must be `<button>`).
- Large arrays `.map()` without virtualization.
- Icon buttons without `aria-label`.
- Hardcoded date/number formats (use `Intl.*`).
