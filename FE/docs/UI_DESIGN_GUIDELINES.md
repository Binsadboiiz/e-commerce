**Project:** PolarisX — E-Commerce Enterprise System  
**Scope:** Entire Client/Customer Frontend  
**Design Specification:** `UI_DESIGN_GUIDELINES`  
**Task Type:** UI/UX Standardization and Consistency Refactoring  
**Priority:** High

## 1. Project Context

PolarisX is an e-commerce platform with multiple frontend subsystems. This task applies only to the Client/Customer frontend.

Before modifying code, read and follow `UI_DESIGN_GUIDELINES` as the authoritative design specification. The specification defines the required brand colors, typography, design tokens, component styles, accessibility standards, and responsive behavior.

Do not create a separate design system or introduce visual conventions that conflict with the specification.

## 2. Objectives

Standardize the entire Client/Customer frontend so every page follows one consistent PolarisX design system.

The work must:
- Unify brand colors and neutral colors across all customer-facing pages.
- Standardize buttons, cards, badges, icons, forms, tables, modals, dropdowns, tabs, pagination, notifications, and other shared UI elements.
- Apply Inter as the only intended font family throughout the client interface.
- Eliminate inconsistent component styling and duplicated CSS where safe.
- Reuse existing shared components and design tokens.
- Ensure consistent interaction states, accessibility, and responsive behavior.
- Preserve all existing business logic and application functionality.

The result must look like one coherent product rather than a collection of independently styled pages.

## 3. Phase 1 — Codebase Audit

Inspect the actual Client/Customer frontend structure before making changes.

Identify:
- Customer-facing pages and routes.
- Shared layouts, headers, navigation, footers, and sidebars.
- Shared UI components and supported component variants.
- Global CSS, CSS modules, component styles, and utility classes.
- Existing design tokens in `src/styles/global.css`.
- Existing Button, Card, Badge, Input, Modal, and Icon implementations.
- Hardcoded colors, font declarations, border radii, shadows, and spacing values.
- Duplicate components that implement the same visual function.
- Inconsistent hover, active, focus, disabled, and loading states.

Use the real project structure and naming conventions. Do not assume file locations without inspecting the repository.

After the audit, continue into implementation. Do not stop after producing an analysis or plan.

## 4. Phase 2 — Global Design Token Standardization

Use `UI_DESIGN_GUIDELINES` as the source of truth.

Inspect and update the existing tokens in `src/styles/global.css`, preserving the project's established architecture.

### 4.1. Brand Colors

| Token | Value | Intended Usage |
|---|---|---|
| `--color-primary` | `#2563EB` | Primary CTA, active states, links |
| `--color-primary-hover` | `#3B82F6` | Primary hover |
| `--color-primary-active` | `#1D4ED8` | Primary pressed state |
| `--color-primary-light` | `#DBEAFE` | Selected backgrounds and highlights |
| `--color-primary-focus` | `rgba(37, 99, 235, 0.25)` | Keyboard focus ring |
| `--color-secondary` | `#0F172A` | Navy brand identity and secondary actions |
| `--color-secondary-hover` | `#1E293B` | Secondary hover |

Remove legacy orange-red branding, including `#EE4D2D`, from brand-level components within the task scope.

Do not indiscriminately replace every red value. Red must remain available for destructive actions and validation errors.

### 4.2. Neutral Colors

| Token | Value |
|---|---|
| `--bg-page` | `#F8FAFC` |
| `--bg-surface` | `#FFFFFF` |
| `--bg-muted` | `#F1F5F9` |
| `--border-color` | `#E2E8F0` |
| `--text-muted` | `#64748B` |
| `--text-main` | `#1E293B` |
| `--color-white` | `#FFFFFF` |

### 4.3. Status Colors

| Status Token | Value |
|---|---|
| `--color-success` | `#10B981` |
| `--color-warning` | `#F59E0B` |
| `--color-danger` | `#EF4444` |
| `--color-info` | `#06B6D4` |

Maintain semantic color usage across order status, payment status, shipping status, product availability, notifications, and validation messages.

### Design Token Rules

- Reuse existing CSS variables wherever possible.
- Avoid duplicate or conflicting token definitions.
- Replace hardcoded values with shared tokens when appropriate.
- Do not introduce new brand colors without a clear requirement.
- Do not change colors that carry meaningful business semantics.
- Keep status colors separate from general brand interactions.

## 5. Phase 3 — Typography Standardization

Use **Inter as the only intended font family** throughout the Client/Customer frontend.

Inspect the current font-loading implementation before making changes. Ensure Inter is loaded correctly, then apply the global font token consistently across navigation, headings, body text, buttons, forms, tables, badges, dialogs, and dynamically rendered UI.

Remove unnecessary component-level font declarations that conflict with the global standard. Avoid duplicate font imports and unnecessary font weights.

Reference configuration:

```css
:root {
  --font-family-base: 'Inter', sans-serif;
}

html,
body,
#root {
  font-family: var(--font-family-base);
}

button,
input,
select,
textarea {
  font-family: inherit;
}
```

Use the existing font assets or established font-loading strategy when available. A CSS declaration alone is insufficient if the font itself is not loaded.

Maintain a consistent typography hierarchy for page headings, section headings, body text, labels, buttons, tables, and helper text. Do not redesign page layouts solely to change typography.

## 6. Phase 4 — Button Standardization

Audit every button on every customer-facing page. Standardize buttons through the existing reusable Button component and its supported variants.

Required variants:
- `primary`
- `secondary`
- `outline`
- `outline-primary`
- `danger`
- `success`
- `ghost`
- `link`

Required default sizes:
- `xs`: 28px high
- `sm`: 34px high
- `md`: 40px high
- `lg`: 46px high
- `xl`: 52px high

Standardize default, hover, active/pressed, focus-visible, disabled, and loading states.

Use Blue for primary actions, Navy for appropriate secondary actions, and semantic colors for destructive or confirmation actions. Keep button heights, typography, padding, border radius, and icon spacing consistent.

Preserve existing click handlers, navigation targets, form submission, loading behavior, and disabled conditions. Do not change the Button component API unless a compatibility issue has been demonstrated.

Do not mechanically convert every clickable element into a button. Preserve the semantic distinction between buttons and links.

## 7. Phase 5 — Cards, Badges, and Surface Components

### 7.1. Cards

Standardize background, border, border radius, shadow, padding, typography, and hover behavior.

Default specifications:
- Background: `#FFFFFF`
- Border: `#E2E8F0`
- Border radius: 12px
- Shadow: existing `--shadow-sm` token

Apply consistently to product cards, category cards, account panels, order summaries, checkout panels, and other equivalent components. Do not force identical dimensions when content and layout requirements differ.

### 7.2. Badges

Standardize pill-shaped borders, font size and weight, padding, status backgrounds, foreground colors, and alignment.

Status mapping:
- Active, Delivered, Approved: Success
- Pending, Preparing: Warning
- Cancelled, Rejected, Deleted: Danger
- In-transit: Info

Ensure the same status uses the same visual treatment across all pages. Do not change underlying status values or business logic.

### 7.3. Other Surface Components

Standardize dropdowns, popovers, tooltips, dividers, empty states, loading skeletons, notifications, toast messages, pagination, tabs, and breadcrumbs.

Use shared tokens and a consistent visual hierarchy without forcing unrelated components into identical layouts.

## 8. Phase 6 — Icon Standardization

Audit all icons throughout the Client/Customer frontend.

Use the project's existing icon library, preferably its current Lucide implementation where already established. Maintain consistent icon sizing, stroke weight, alignment, spacing, and color tokens.

Default size conventions:
- Small inline icons: 14–16px
- Standard action icons: 18–20px
- Prominent navigation icons: 20–24px

These sizes are defaults, not absolute constraints. Follow existing component requirements when a different size is necessary.

Icon requirements:
- Use brand, neutral, and semantic status tokens for icon colors.
- Align icons correctly with Inter text.
- Provide accessible names for icon-only buttons.
- Provide appropriate hover and focus feedback for interactive icons.
- Avoid mixing unrelated icon libraries or inconsistent icon styles.
- Preserve the meaning and function of existing icons.

Do not replace icons solely for aesthetic preference if doing so would reduce clarity or change their meaning.

## 9. Phase 7 — Forms, Inputs, Tables, and Modals

### Forms and Inputs

Standardize labels, helper text, input heights, padding, borders, radius, focus rings, validation messages, disabled states, and read-only states.

Preserve validation rules, data binding, field names, and submission logic.

### Tables

Standardize header backgrounds, typography, row borders, hover states, cell spacing, action buttons, status badges, empty states, and loading states.

Maintain horizontal scrolling on small screens. Do not remove existing columns, actions, filters, sorting, or pagination.

### Modals and Dialogs

Standardize:
- Backdrop: `rgba(15, 23, 42, 0.6)`
- Optional blur: `blur(4px)`
- Content background: `#FFFFFF`
- Border radius: 16px
- Header, body, footer, and action spacing
- Typography and button variants

Preserve modal triggers, form submission, dismissal behavior, keyboard interactions, and focus management.

## 10. Phase 8 — Page-by-Page Standardization

Inspect and standardize every customer-facing route, not only the homepage or shared layout.

Include all applicable pages and features found in the actual project, such as:
- Home and landing pages
- Product listing and category pages
- Product detail
- Search results and filtering
- Cart
- Checkout and payment
- Order history and order detail
- User profile and account settings
- Address management
- Client authentication and registration pages
- Wishlist and reviews
- Notifications, empty states, loading states, and error states

This list is illustrative. The actual route inventory determines the final scope.

For each page, identify shared components, apply consistent brand colors and typography, standardize buttons/cards/badges/icons, align spacing and surfaces, verify loading/error/empty/success states, preserve page-specific functionality, and inspect responsive behavior.

Do not leave secondary routes unstandardized simply because the primary pages look consistent.

## 11. Phase 9 — Responsive and Accessibility Validation

Validate the updated interface at these breakpoints:

| Device | Width |
|---|---|
| Mobile | Below 640px |
| Tablet | 640–1024px |
| Desktop | Above 1024px |

Ensure forms adapt to narrow screens, buttons use full width when appropriate, tables scroll horizontally when required, grids adapt to available width, navigation remains usable, and modals fit within the viewport.

Prevent unintended horizontal overflow. Keep keyboard focus visible, provide accessible names for icon-only controls, meet applicable contrast requirements, and respect reduced-motion preferences.

Do not change responsive layouts unnecessarily if they already satisfy the specification.

## 12. Phase 10 — CSS Cleanup and Component Reuse

After standardization:
- Remove redundant CSS declarations introduced by legacy styling.
- Consolidate duplicate visual rules when safe.
- Reuse existing shared components.
- Replace repeated hardcoded values with established tokens.
- Remove conflicting font-family declarations where appropriate.
- Avoid broad selectors that unintentionally affect unrelated components.
- Avoid new dependencies without a clear technical need.
- Keep changes limited to the Client/Customer scope.

Do not perform a broad architectural refactor. Do not delete a CSS class or component until all usages and dependencies have been checked. Do not change business logic as part of style cleanup.

## 13. Implementation Constraints

Unless explicitly authorized, do not:
- Change business logic.
- Change API contracts or add endpoints.
- Change routing or authentication flows.
- Modify database schemas.
- Remove existing functionality.
- Replace working shared components with duplicated implementations.
- Introduce another intended font family.
- Introduce orange-red as the default brand color.
- Rewrite entire pages unnecessarily.
- Modify Seller or Admin interfaces outside the requested Client/Customer scope.

You must inspect before modifying, reuse existing components, follow `UI_DESIGN_GUIDELINES`, preserve existing behavior, keep changes focused, and report incomplete coverage or technical blockers honestly.

## 14. Validation and Reporting

After implementation, inspect the updated pages and components for consistent colors, typography, component states, responsive behavior, accessibility, import errors, CSS conflicts, and font loading.

Run relevant lint, build, and tests when available. Report only checks that were actually executed and describe their real results.

Provide a final implementation report containing:
1. Pages and components inspected.
2. Files modified, added, or removed.
3. Design tokens and components standardized.
4. Customer routes completed and any routes not covered.
5. Areas reviewed for functional regressions.
6. Actual lint, build, test, and responsive-check results.
7. Remaining issues, blockers, or follow-up work.

Do not claim the task is fully complete if significant routes remain unaudited or unstandardized.

## Final Execution Instruction

Read `UI_DESIGN_GUIDELINES` first. Audit the entire Client/Customer frontend, then implement the standardization systematically across shared components and individual pages.

The goal is a unified PolarisX interface using Navy–Blue branding, Inter typography, consistent component styling, accessible interactions, and responsive layouts while preserving all existing application functionality.

**Execute the task end-to-end. Do not stop after analysis or planning.**
