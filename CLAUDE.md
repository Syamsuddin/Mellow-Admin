# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project scope

Mellow Admin is a frontend-only React 19 CRM dashboard template ("clay & glass" styling). It uses demo data stored in `localStorage` and has no backend, auth, or network calls. The UI text is in English; the user-facing docs (`README.txt`, `PANDUAN.html`, `QA.txt`) are in Indonesian.

The parent directory has a `CLAUDE.md` (`/Users/syams/Downloads/CLAUDE.md`) for **eLAB**, a separate Laravel/Bootstrap project. Its rules (no React, Bootstrap only, Laravel conventions, etc.) do **not** apply here.

## Commands

```bash
npm ci            # Node.js 20+; node_modules is not checked in
npm run build     # runs build.mjs (esbuild); this is the only script
python3 -m http.server 8080   # optional: serve to get consistent localStorage (file:// varies by browser)
```

There is no dev server, watch mode, linter, or test suite. To verify a change, rebuild, then open `index.html` (or the served URL) and exercise the page by hand. `QA.txt` lists the manual checks done for 1.0.0.

## Build pipeline

`build.mjs` bundles `src/App.jsx` into an IIFE (`assets/app.js`, target es2020). esbuild also emits the imported `src/styles.css` as `assets/app.css`, plus `assets/app.js.LEGAL.txt`. The script then:

- writes `Mellow-Admin-Standalone.html`: `index.html` with the CSS, JS, and favicon inlined;
- copies `index.html` and the assets into `dist/`.

**Generated, never hand-edit:** `assets/app.js`, `assets/app.css`, `assets/app.js.LEGAL.txt`, `Mellow-Admin-Standalone.html`, `dist/`. Edit `src/` and rebuild. `index.html` and `assets/favicon.svg` are sources.

The standalone inlining is plain string replacement on the exact tags `href="assets/favicon.svg"`, `<link rel="stylesheet" href="assets/app.css">`, and `<script src="assets/app.js"></script>`. If those tags in `index.html` change, the standalone file silently keeps external references.

esbuild uses the classic JSX transform, so every file that contains JSX must `import React from "react"`.

`styles.css` declares an `@font-face` for Nunito Sans that points at the latin `wght` file in `node_modules/@fontsource-variable/nunito-sans` (a devDependency). `build.mjs` uses the `dataurl` loader for `.woff2`, so the font is base64-inlined into `app.css` and therefore into the standalone file and `dist/`. Its OFL license is appended to `THIRD-PARTY-NOTICES.txt`.

## Architecture

There are five source files:

- `src/App.jsx`: a single `App` component that owns **all** state, the shell (sidebar, topbar, dock, modals, toast), and the original 10 pages. It mounts itself with `createRoot` at the bottom of the file.
- `src/pages.jsx`: the pages added later (Products, Orders, Projects, Files, Team, Activity, Profile, Billing, Help, Pages) plus `Screen`, which renders the standalone layouts (sign in/up, forgot password, lock screen, 404/500, maintenance). Each page is a component that receives the shared `ctx` object from `App` (`data`, `update`, `patch`, `setModal`, `setToast`, `go`, `match`, `pageHead`, `exportCSV`, `query`, `log`, `remove`) and may keep its own filter state.
- `src/components.jsx`: UI primitives (`Icon` with an inline SVG path map, `Button`, `Modal` on native `<dialog>`, `Field`, `StatCard`, `RevenueChart`, etc.). `Menu` is the only stateful one: the "•••" action menu, rendered through a portal to `document.body` with fixed positioning, arrow-key/Home/End navigation, and Esc/outside-click/scroll to close. Pass `items` as `[text, icon, run, danger]` tuples; falsy items are skipped. `StatCard` renders a `<button>` with an arrow only when it gets `onClick`, otherwise a plain `<div>`.
- `src/data.js`: the `seed` dataset, the `stages`/`chances` arrays, read-only demo constants (`plans`, `receipts`, `faq`), and the formatters (`money`, `short`, `fmtDate`, `initials`).
- `src/styles.css`: design tokens in `:root`, themes, breakpoints (1250 / 1000 / 760 px), and print styles. Tokens: type scale `--fs-xs…--fs-3xl` (11/12/14/16/20/24/28 px), radius `--r-sm/md/lg/xl/full` (8/12/16/24/pill), semantic pairs `--success/--warning/--danger/--info/--neutral` with `-bg` variants, `--surface-2`, `--stat-*` backgrounds, shadows `--shadow` (flat containers), `--shadow-raised` (interactive), `--shadow-overlay` (modal, menu, toast, dropdown), and per-accent `--primary-a/b` and `--sidebar-a/b`.

Key mechanics in `App.jsx`:

- **Routing:** the `nav` array of `[label, icon, section]` drives the sidebar. `groups` collects entries by section in order of first appearance; each group has a collapse button whose state lives in `settings.navCollapsed` (default `["UI kit"]`), and navigating to a page re-expands its group. Between 761 and 1000 px the sidebar is an icon rail: section buttons are hidden, every group is shown, and nav buttons get `title` tooltips (via `useMedia`); they always carry an `aria-label` that includes the badge count. The sidebar is sticky and only its `<nav>` scrolls. The hash is `slug(label)` (lowercase, spaces → `-`, for example `#forgot-password`). `resolve()` maps the hash to a `nav` label or a `screens` entry (from `pages.jsx`); an empty hash goes to Dashboard and an unknown one to "Error 404". Screens return early from `App` and render without the shell, so they cannot use modals. To add a shell page, add it to `nav` and add a `{page === "X" && …}` block (or a component in `pages.jsx`).
- **Persistence:** `data` holds every collection in `seed` (CRM records plus `products`, `orders`, `team`, `projects`, `files`, `activity`, and `settings`) and is written to `localStorage["mellow-admin-v1"]` with `schema: 1` on every change. On load, stored data with `schema === 1` is merged over a fresh seed (and `settings` is merged one level deep), so new seed keys or settings fields appear without wiping a user's edits. Changed seed *values* for existing keys do not show up until Settings → "Reset demo data".
- **Mutations** all go through `update(key, list)`, `patch(key, id, values)`, `move(id, stage)`, `saveRecord`, and `remove(key, row, label)`. These are the documented hook points for swapping in a real API (PANDUAN §05). `remove` deletes a single record immediately and shows a toast with Undo that reinserts it at its old index; `removeRecord` (the Delete button in record forms) and `confirmRemove` in `pages.jsx` both call it. `log(text, kind)` prepends an entry to `data.activity` (capped at 60) and feeds the Activity page; call it from new mutations.
- **Toast:** `setToast(text, { tone, undo })`, where `tone` is `"success"` (default), `"info"`, or `"error"`, and `undo` adds an Undo button and keeps the toast up for 7 s instead of 4.5 s. It renders inside an always-present `aria-live` region.
- **Filter:** the top-bar box filters the current page (press `/` to focus it, Esc to clear). `match(record, extra)` only looks at string fields, compares ISO dates through `fmtDate` (so "nov 2" works), and checks `extra` for IDs that are displayed differently (`"INV-" + id`, `"#" + id`). It ignores a numeric second argument, so `.filter(match)` stays safe.
- **Page header:** the H1 is the page name in the top bar. `pageHead(sub, actions)` renders only a functional subtitle and the action buttons.
- **Modals:** one `modal` state object, keyed by `type`:
  - `deal`, `contact`, `task`, `event`, `product`, `member`, `project`: record forms. `recordKeys` maps each type to its `data` collection (`member` → `team`). `saveRecord` reads the form with `FormData`, so input `name` attributes must equal the record keys, and only a few fields are coerced to numbers (deal `value`/`stage`, product `price`/`stock`, project `progress`); add coercion there for new numeric fields. New IDs come from `Date.now()`.
  - `confirm`: carries an `action` callback, plus an optional `confirmLabel` (the button text, e.g. "Reset data") and `danger: false` for non-destructive confirms. Keep it for bulk actions (reset, clear log, plan switch); single-record deletes use `remove` with Undo instead.
  - `invoice`, `example`: display dialogs.
- **Deals:** `stage` is an index into `stages`/`chances` (0–4; 4 = Won, which triggers the confetti). The "My deals" filter is hard-coded to `owner === "MT"`. The stat cards (pipeline, weighted forecast, won, average) are computed from the currently filtered deals. `RevenueChart` uses hard-coded illustrative numbers that are not derived from data.
- **Theming:** `data-theme` (`light`/`dark`) and `data-accent` (`violet` default, `rose`, `sage`, `navy`) are set on `<html>` from `settings`. The CSS overrides tokens with `[data-theme=dark]` and `[data-accent=…]` selectors; dark mode redefines the surface, text, semantic, `--accent-deep`, `--accent-light`, and `--stat-*` tokens (with `[data-theme=dark][data-accent=…]` for per-accent `--accent-deep`), so components should read tokens rather than hard-code colors.
- **CSV export:** `exportCSV` prefixes cells that start with `= + @ -` to guard against formula injection. Keep that guard when you touch it.

## Code style

The source looks like esbuild-formatted output: long single-line JSX expressions, numeric literals such as `12e3`, `/* @__PURE__ */` annotations, and a single `export { … }` block at the bottom of each module. Match this compact style rather than reformatting whole files. Reformatting would make diffs unreadable.

In CSS, use the tokens: `font-size: var(--fs-*)` (11 px only for uppercase labels, badges, counters, and initials; everything else 12 px or larger), `border-radius: var(--r-*)`, padding/margin/gap in multiples of 4 px (2 px is allowed for hairline adjustments), semantic color tokens for status, and the three shadow tokens. Text must keep at least 4.5:1 contrast against its background in both themes (`--muted` is the lightest allowed text color), and interactive targets should be at least 24×24 px.
