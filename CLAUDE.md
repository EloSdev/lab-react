# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A course lab (Lemoncode/Luckia, Módulo 04 · React): build "Tueste", a coffee-roaster catalog (list + search + cart, detail, create/edit forms). The full assignment — required steps O1–O8, optionals P1–P7, challenges D1–D5 — is in `docs/enunciado_proyecto.txt` (Spanish). **Read it before implementing anything**; each step builds on the previous one and specifies exact file names, behaviors, and checks. The repo currently holds only the starter demo (`src/app.tsx` with placeholder "members" data that O1 replaces).

The student must be able to explain every component and hook delivered — favor clear, idiomatic code over clever code, and explain *why* when making React decisions (state vs. derived value, what an effect cleans up, etc.).

## Commands

Requires Node.js ≥ 22.12.

- `npm start` — Vite dev server
- `npm run build` — `tsc --noEmit && vite build` (type-checks). Must pass with no errors; this is the grading gate.
- `npm run typecheck` — type-check only
- `npm run preview` — serve the production build

No test runner is set up (Vitest + Testing Library only arrive with optional challenge D4). Not yet a git repo; the assignment recommends one commit per required step.

**Once TanStack Router is added (O5)**, change the build script to `vite build && tsc --noEmit` — the router plugin generates `src/routeTree.gen.ts` during the Vite build and `tsc` needs it. Never hand-edit `routeTree.gen.ts`.

## Stack

React 19, TypeScript 7 (strict, `verbatimModuleSyntax` → use `import type` for type-only imports), Vite 8, Tailwind 4 via `@tailwindcss/vite`. Planned additions per the assignment: `@tanstack/react-router` + `@tanstack/router-plugin` (plugin goes **before** `react()` in `vite.config.ts`), `@tanstack/react-form`, `zod` (v4).

Styling: `src/styles.css` sets base element styles with `@apply` in `@layer base` (buttons, inputs, links, focus-visible outlines); components add Tailwind utility classes. UI text is in Spanish (`<html lang="es">`). Keep `<StrictMode>` in `main.tsx` (double-invoked effects in dev are expected).

## Data model

- `public/coffees.json` — seed data (6 coffees), fetched from `/coffees.json` starting at O3.
- `src/model.ts` (later `src/core/coffees/model.ts`): `Roast = "light" | "medium" | "dark"`, `Coffee { id, name, origin, roast, price, notes }`, `CoffeeInput = Omit<Coffee, "id">`.
- Persistence for created/edited coffees is `localStorage` via `saveCoffee` in `api.ts`; clearing the key restores the 6 seed coffees.

## Target architecture (end state after O7)

```
src/
  routes/            navigation only: read params, render a scene
    __root.tsx, index.tsx ("/" → redirect "/coffees")
    coffees/index.tsx, new.tsx, $coffeeId/index.tsx, $coffeeId/edit.tsx
  core/
    router/router.ts  create + register router (declare module ... Register)
    coffees/          shared by both pods: model.ts, coffee.schema.ts (Zod), api.ts, hooks.ts (useCoffees, useCoffee(id))
  layouts/app-layout.tsx  nav + <Outlet />
  scenes/            compose a screen and decide where to navigate
  pods/
    catalogo/        list, search, cart, detail
    edicion/         create/edit form (CoffeeForm, optional initial values; edit keeps the id)
  common/components/ loading / error messages
```

Pod rules: each pod has a *container* (fetches data, decides what to show) and a *component* (props in, render out); each pod exposes an `index.ts` and scenes import only from it; **pods never import each other** (catalog links to editing via `<Link>`); the form receives `onSaved` from the scene rather than deciding navigation itself.

## Lab rules (enforced in review)

- Function components with typed props; hooks at the top, never after a conditional return.
- Never mutate state (`push`, `splice`, property assignment) — use spread/`map`/`filter`, functional updates (`setCart(prev => [...prev, coffee])`).
- Derived values (cart total, bag count, filtered list) are computed during render, not stored in state/effects.
- Every list `.map` has `key={coffee.id}`, not the index.
- Effects with intervals/requests return a cleanup (`clearInterval`, `controller.abort()`); check `response.ok` after `fetch`.
- Use TanStack Router (`createFileRoute`, `Route.useParams()`, typed `<Link to="/coffees/$coffeeId" params={...}>`), **not** React Router.
- Pass the Zod 4 schema directly to TanStack Form validators (`onChange`/`onSubmit`) — no `@hookform/resolvers` / `zodValidator` adapter. Number inputs use `event.target.valueAsNumber`.
- No blanket `useMemo`/`useCallback` without a measured reason.
- Accessibility counts toward the grade: every field has a `<label>`, errors linked via `aria-describedby`, visible focus.
