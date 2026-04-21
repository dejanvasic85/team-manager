---
name: frontend-design-system
description: Token-first frontend design system with Tailwind v4 and CSS variables (light/dark only)
allowed-tools: Read, Glob, Grep, Bash, apply_patch
version: 1.0
priority: HIGH
---

# Frontend Design System Skill

Use this skill for any frontend code changes in this repository.

## Goals

- Keep UI cohesive through CSS variable tokens.
- Keep Tailwind v4 as the styling engine.
- Support only light/dark themes (plus auto mode resolution).
- Prefer token-first implementation before introducing new component libraries.

## Rules

- Define and update tokens in `src/styles.css`.
- Follow token layers:
  - primitive tokens (`--sea-ink`, `--lagoon`, etc.)
  - semantic tokens (`--text-primary`, `--bg-surface`, `--border-subtle`)
  - component tokens (`--button-neutral-bg`, `--auth-avatar-bg`)
- Never hardcode new hex or rgba values inside `className` strings when a semantic token can be used.
- Prefer reusable recipe classes in `src/styles.css` for repeated component patterns (`.button-neutral`, `.chip-shell`, `.icon-button`).
- Keep inline `style` usage minimal and only for dynamic runtime values (for example animation delays).
- Keep all new tokens parity-mapped in light and dark mode.

## Theming Model

- Respect existing theme behavior:
  - `data-theme="light"` forces light
  - `data-theme="dark"` forces dark
  - no `data-theme` means auto/system mode
- Keep `html` color-scheme aligned with resolved mode.
- Do not add multi-brand or white-label token scopes.

## Component Guidance

- Prefer semantic token references in component classes:
  - text -> `--text-*`
  - backgrounds -> `--bg-*`
  - borders -> `--border-*`
- If a component repeats across pages, introduce a recipe class in `src/styles.css` instead of duplicating utility strings.

## Radix or Ariakit Adoption Path

- Introduce Radix/Ariakit only after token model changes are complete for the touched UI.
- Wrap primitives with local components that consume existing semantic/component tokens.
- Do not ship default library styles as-is; map states and variants to project tokens.

## Verification

Run after frontend changes:

1. `vp check`
2. `vp test`
3. `vp build` for larger UI/theming changes

Manual checks:

- Theme toggle cycles through light -> dark -> auto.
- Key surfaces/controls have visual parity in light and dark.
- Desktop and mobile layouts remain usable.
