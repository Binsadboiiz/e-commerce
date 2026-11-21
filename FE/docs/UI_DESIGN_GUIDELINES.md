# PolarisX Mall — UI Design Guidelines (Customer app)

**Scope:** Client/Customer frontend only (`FE/src/apps/customer`, shared auth pages, shared UI). Seller and Admin are out of scope.
**Process source:** `docs/PROMPT_DESIGN.md`. This file is the single source of truth for the visual system. If code and this file disagree, fix the code or update this file in the same change.
**Status:** Stage 1 (system definition) approved. Later stages are listed in section 12.

---

## 1. Brand brief

| | |
|---|---|
| Brand | PolarisX Mall |
| What it is | A Vietnamese online marketplace where shoppers buy from many verified shops. |
| Audience | Vietnamese shoppers on phones first (360px+), also desktop. They compare price, trust and delivery speed. |
| Core idea | **One Pole Star.** Like the North Star, each screen has one point that guides the eye. Everything else stays calm. |
| Personality | Precise, clear, trustworthy. Never loud. |
| Language | Vietnamese (all type must render full diacritics). English is secondary (`locales/en.json`). |
| Stack | React 18, Vite, CSS Modules, Tailwind 4 (tokens via `@theme`), lucide-react. |

Open items to confirm with the owner: reference sites, real product photography, real shop/brand content.

## 2. Logo and visual motif

The logo (`public/logo.png`) is a `>` made of two slanted bars, split in the middle, with one blue dot beside the gap, plus the wordmark with a blue **X**.

The system reuses two shapes only:

1. **The cut.** A 45° slanted edge, taken from the bars of the `>`.
   - Banner and hero image corners are clipped at 45°.
   - Section dividers are a short slanted bar, not a full-width line.
   - Section headings carry a small slanted bar before the text.
2. **The dot.** One solid circle, taken from the logo.
   - Marks the one active or important thing: selected variant, unread count, cart count, price-drop marker, current step.
   - Never more than one dot-style highlight competing in the same area.

Do not add other decorative shapes (blobs, spheres, particles, random gradients).

## 3. Color

Neutral base, one dominant brand color, one rare accent. No other decorative colors.

### Brand
| Token | Value | Use |
|---|---|---|
| `--color-primary` | `#2563EB` | Primary CTA, links, active states, the dot |
| `--color-primary-hover` | `#3B82F6` | Hover |
| `--color-primary-active` | `#1D4ED8` | Pressed |
| `--color-primary-light` | `#DBEAFE` | Selected backgrounds |
| `--color-primary-focus` | `rgba(37,99,235,.25)` | Focus ring |
| `--color-secondary` | `#0F172A` | Navy: brand identity, headings, secondary actions |
| `--color-secondary-hover` | `#1E293B` | Navy hover |

### Accent (rare)
| Token | Value | Use |
|---|---|---|
| `--color-accent` | `#F59E0B` | Flash sale, discount tag, promo strip. Nothing else. |
| `--color-accent-hover` | `#D97706` | Hover on accent fills |
| `--color-accent-light` | `#FFFBEB` | Promo backgrounds |

Rules:
- Use accent as a **fill with navy text** (contrast about 8:1). Never use accent as text on white (fails WCAG AA).
- At most one accent element per viewport area. If everything is amber, nothing is.
- Accent is not a status color. "Pending" still uses `--color-warning` (same hue, different job: status vs promo). Do not mix them in one component.
- Regular prices are **navy**, not red. The discount tag is the only amber/discount element on a card.

### Neutrals
| Token | Value |
|---|---|
| `--bg-page` | `#F8FAFC` |
| `--bg-surface` | `#FFFFFF` |
| `--bg-muted` | `#F1F5F9` |
| `--border-color` | `#E2E8F0` |
| `--text-main` | `#1E293B` |
| `--text-muted` | `#64748B` |
| `--color-white` | `#FFFFFF` |

### Status (semantic only)
`--color-success #10B981`, `--color-warning #F59E0B`, `--color-danger #EF4444`, `--color-info #06B6D4`.
Red is for errors and destructive actions only. Orange-red `#EE4D2D` is retired.

| Status | Color |
|---|---|
| Active, Delivered, Approved | success |
| Pending, Preparing | warning |
| In transit | info |
| Cancelled, Rejected, Deleted | danger |

### Banned
No purple, pink or indigo gradients. No gradient-filled headline text. No glassmorphism.

## 4. Typography

Two families, loaded in `index.html` (one Google Fonts request):

| Role | Family | Weights | Token |
|---|---|---|---|
| Display (h1–h3, hero, section titles, prices on detail page) | **Be Vietnam Pro** | 600, 700, 800 | `--font-family-display` |
| Body, UI, forms, tables, buttons | **Inter** | 400, 500, 600, 700 | `--font-family-base` |

Why Be Vietnam Pro: it is drawn for Vietnamese diacritics, and its geometric shapes match the logo wordmark.

Scale (contrast is the point: big display vs small supporting text):

| Use | Size / line-height | Family, weight |
|---|---|---|
| Hero | 40–56px / 1.05, -0.03em | Display 800 |
| Page title (h1) | 28–32px / 1.15 | Display 700 |
| Section title (h2) | 20–24px / 1.2 | Display 700 |
| Card title | 14–15px / 1.4 | Inter 500–600 |
| Body | 14–16px / 1.6 | Inter 400 |
| Label, helper | 12–13px / 1.4 | Inter 500–600 |

Rules:
- `button, input, select, textarea { font-family: inherit }`.
- Headings use display type only inside the customer app (`.customer-shell`). Admin and Seller keep Inter.
- Inputs are at least 16px on mobile so iOS does not zoom on focus.
- No component declares its own `font-family`. Use the tokens.

## 5. Spacing, radius, elevation, motion

- **Spacing:** 4px base. Page gutter 12px (mobile), 16px (tablet), 24px (desktop). Max content width 1280px.
- **Radius:** `--radius-sm 6`, `--radius-md 8`, `--radius-lg 12` (cards), `--radius-xl 16` (modals). Pills (`9999px`) only for badges, chips and sort tabs.
- **Elevation:** use `--shadow-xs/sm/md` tokens. Cards rest on a border plus `--shadow-xs`; only hover or overlays get more. Do not put a large soft shadow on everything.
- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` for entrances and the signature move; `--transition-fast/normal` for state changes. No default `ease`.
- **Durations:** 150ms state change, 250ms reveal, 600ms signature move.
- **Reduced motion:** all animation must stop under `prefers-reduced-motion: reduce` (already enforced in `global.css`).

## 6. Signature moment: the dot flies to the cart

When a shopper presses "Thêm vào giỏ", a blue dot (the logo dot) leaves the button, arcs to the cart icon in the header, and the cart count then updates and nudges once.

- One interaction only. It is the main place the dot moves.
- Duration 600ms, easing above. Falls back to the count nudge alone under reduced motion.
- Must not delay or block the add-to-cart request.

Supporting motion stays small: card lift on hover (2–3px), focus rings, skeleton shimmer.

## 7. Components

Reuse existing shared components. Do not create a second implementation.

### Buttons (`shared/components/ui/Button.jsx`)
Variants: `primary`, `secondary`, `outline`, `outline-primary`, `danger`, `success`, `ghost`, `link` (plus `warning`).
Sizes: `xs 28`, `sm 34`, `md 40`, `lg 46`, `xl 52` px high.
States: default, hover, pressed, `:focus-visible` (3px `--color-primary-focus` ring), disabled, loading.
Primary is blue. Navy is for secondary actions. Raw `<button>` elements with their own CSS are legacy: migrate them when touching that file.
Do not turn links into buttons. Navigation stays `<Link>`.

### Cards
White surface, 1px `--border-color`, radius 12px, `--shadow-xs`. Product card: image first, brand tag, 2-line title, rating, navy price, optional discount tag. Do not force equal sizes where content differs; vary hierarchy and size in editorial areas (hero, category entry points).

### Badges
Pill, 11–12px, weight 600, tinted background with matching dark text, status mapping from section 3. The same status looks the same on every page.

### Inputs and forms
48px high on mobile, 40–44px on desktop. 1px border, radius 12px, focus = blue border + 4px focus ring. Label above the field (13px, 600). Errors in `--color-danger` with text, not color alone.

### Modals and dropdowns
Backdrop `rgba(15,23,42,.6)` with optional 4px blur. White surface, radius 16px. Keep focus inside; Esc closes.

### Tables (account, orders)
Muted header row, 1px row borders, hover `--bg-muted`, horizontal scroll under 640px. Keep all columns and actions.

### Icons
lucide-react only. 14–16px inline, 18–20px actions, 20–24px navigation. Stroke width consistent. Never emoji as icons. Icon-only controls need `aria-label`.

### States
Every list or page has designed loading (skeleton), empty (icon + one sentence + action) and error states, plus a styled 404.

## 8. Layout principles

- Calm and aligned by default; break the grid in a few chosen places (hero, one editorial band).
- Home sections must not repeat the same structure back to back. Alternate: hero with slanted-cut image, a horizontal rail, an editorial category band, a product grid, a promo strip.
- Avoid: centered hero with two buttons as the only pattern, and three identical cards with circular icon badges.
- Product grid: 2 columns at 360px, 3 at 768px, 4 at 1100px, 5 at 1400px.

## 9. Content

- Real, specific Vietnamese copy. No stock phrases ("unlock", "elevate", "seamless", "all-in-one", "cutting-edge" and their Vietnamese equivalents).
- No lorem ipsum, fake reviews, invented statistics or fake brand logos.
- Placeholder images are marked as placeholders (currently `picsum.photos` in seed data) and replaced with real product photos.

## 10. Accessibility and performance

- WCAG AA contrast. Amber is never text on white.
- Visible focus on every interactive element (global `:focus-visible` rule exists).
- Semantic HTML, keyboard reachable, accessible names on icon-only controls.
- Responsive from 360px. No horizontal page scroll. Breakpoints: mobile < 640, tablet 640–1024, desktop > 1024.
- Target Core Web Vitals in the green: reserve image space (`width`/`height` or `aspect-ratio`), lazy-load below the fold, keep font weights to the ones listed in section 4.

## 11. Implementation rules

- Tokens live in `src/styles/global.css` (`:root`). Do not redefine them per component. Tailwind `@theme` in `index.css` mirrors only what Tailwind needs.
- Prefer tokens over hardcoded hex. Do not add new brand colors.
- Do not change business logic, API contracts, routing or auth flows.
- Do not delete a CSS class or component before checking all usages.
- Do not touch Seller or Admin UI.

## 12. Rollout stages (pause for review after each)

1. **System** (done): this document, display font, accent and display tokens, `customer-shell` scope.
2. **Layout and content** (done): header, footer, home composition, product card, `.dot` and `.section-title` motif classes in `global.css`.
3. **Type and color pass** (done for detail, cart, checkout titles; raw-button migration partial: add-to-cart, buy now, cart checkout): display type, navy prices, amber promo tag.
4. **Motion** (done): cart-dot signature moment in `shared/utils/flyDot.js`, hooked to the add-to-cart button; skipped under reduced motion.
5. **Quality** (done): 404 and empty states use the cut tile and dot; overflow, alt text, control names and heading checks run at 360, 768, 1024, 1440px.

After each stage: self-critique against `docs/PROMPT_DESIGN.md` Part 2 and Part 3, and fix anything that still looks generic before review.

## 13. Reviewer checklist

- [ ] Only Be Vietnam Pro and Inter are loaded; diacritics render correctly.
- [ ] Every screen has one clear focal point.
- [ ] The cut and the dot are the only decorative motifs.
- [ ] Amber appears only on promo elements, never as text on white.
- [ ] No orange-red brand color, no purple/pink/indigo.
- [ ] Prices are navy; red appears only for errors/destructive actions.
- [ ] No horizontal scroll at 360px.
- [ ] Reduced motion respected.
