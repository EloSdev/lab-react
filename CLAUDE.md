# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Tueste", a single-page coffee catalog: list with name search and a cart, coffee detail, and create/edit forms with validation. UI text is in Spanish (`<html lang="es">`). `README.md` is the user-facing document (how to run, route map, screenshots in `screenshots/`, Q&A, AI log) — keep it in sync when routes or structure change.

Favor clear, idiomatic code over clever code: every component and hook must be explainable (why something is state vs. derived, what an effect cleans up).

## Commands

Requires Node.js ≥ 22.12.

- `npm start` — Vite dev server
- `npm run build` — `vite build && tsc --noEmit`. The order matters: the router plugin generates `src/routeTree.gen.ts` during the Vite build and `tsc` needs it. Must pass with no errors.
- `npm run typecheck` — type-check only (needs an up-to-date `routeTree.gen.ts`)
- `npm run preview` — serve the production build

No test runner is set up. `src/routeTree.gen.ts` is generated and committed — never edit it by hand.

In the dev server the app's modules are served unbundled, so under network throttling the page stays blank for a long time and the short "Cargando…" state is easy to miss; check loading states with `npm run build && npm run preview`.

## Stack

React 19, TypeScript 7 (strict, `verbatimModuleSyntax` → `import type` for type-only imports), Vite 8, Tailwind 4 via `@tailwindcss/vite`, TanStack Router (file-based; `tanstackRouter({ target: "react" })` from `@tanstack/router-plugin/vite`, placed **before** `react()` in `vite.config.ts`), TanStack Form, Zod 4.

Styling: `src/styles.css` sets base element styles with `@apply` in `@layer base` (headings, buttons, inputs, links, focus-visible outlines); components add Tailwind utilities. `<StrictMode>` stays in `main.tsx` (effects run twice in dev; the first `coffees.json` request shows as cancelled).

## Architecture

```
src/
  main.tsx               mounts <RouterProvider router={router} />
  routes/                navigation only: read params, render a scene (Number(coffeeId))
    __root.tsx           AppLayout + notFoundComponent ("Página no encontrada")
    index.tsx            "/" → redirect to "/coffees" in beforeLoad
    coffees/index.tsx, new.tsx, $coffeeId/index.tsx, $coffeeId/edit.tsx
  core/
    router/router.ts     createRouter + `declare module ... Register`
    coffees/             shared by both pods: model.ts, coffee.schema.ts, api.ts, hooks.ts
  layouts/app-layout.tsx header nav + <Outlet />
  scenes/                compose a screen; own navigation (pass onSaved → navigate to detail)
  pods/
    catalogo/            catalog (search, cart) + coffee detail; index.ts
    edicion/             new/edit containers + CoffeeForm; index.ts
  common/components/     LoadingMessage, ErrorMessage
```

Pod rules:
- Each pod splits *containers* (call hooks/API, hold state, decide between loading / error / "Café no encontrado" / content) from *components* (props in, render out). Containers return early, so all hooks go before those returns.
- Scenes import pods only through their `index.ts`; **pods never import each other** (the detail links to editing with a typed `<Link>`, it does not import the form).
- `CoffeeForm` does not call the API or navigate: its container saves and then calls the scene's `onSaved`.

Data flow (`core/coffees/`):
- `model.ts`: `Roast = "light" | "medium" | "dark"`, `Coffee { id, name, origin, roast, price, notes }`, `CoffeeInput = Omit<Coffee, "id">`.
- `api.ts`: `getCoffees` fetches `public/coffees.json` (checks `response.ok`) and merges `localStorage["tueste-coffees"]` by id — a saved coffee with a seed id replaces it (an edit), others are appended (new coffees). `getCoffee(id)` finds within that list. `saveCoffee(input, id?)` creates (next id = max + 1) or replaces by id, after a simulated 600 ms delay so the disabled submit button is visible. Clearing the key restores the 6 seed coffees.
- `hooks.ts`: `useCoffees()` returns `{ coffees, loading, error }` and `useCoffee(id)` returns `{ coffee, loading, error }` (`coffee` is `null` when not found). Each effect uses an `AbortController`, returns `controller.abort()` as cleanup, and skips state updates once aborted. `useCoffee` depends on `[id]`.
- `coffee.schema.ts`: single Zod schema used by both create and edit (trimmed name/origin ≥ 2 chars, `z.enum` roast, price > 0 and ≤ 100, notes ≤ 120), with Spanish messages.

Form details (`pods/edicion/coffee-form.component.tsx`): the Zod schema is passed directly to `useForm` validators (`onChange` and `onSubmit`) — no adapter. Errors show only for touched fields (submit marks all fields touched), linked via `aria-describedby` / `aria-invalid`. Price uses `event.target.valueAsNumber` (NaN renders as an empty input). On submit, `coffeeSchema.parse(value)` yields trimmed values and strips extra keys such as `id`.

## Conventions

- Function components with typed props interfaces; hooks at the top, never after a conditional return.
- Never mutate state — spread/`map`/`filter` and functional updates (`setCart((previous) => [...previous, coffee])`).
- Derived values (cart total, bag count, filtered list, coffee count) are computed during render, not stored in state or synced with effects.
- Every list `.map` uses `key={coffee.id}`, never the index.
- Effects with requests or intervals return a cleanup.
- TanStack Router APIs only (`createFileRoute`, `Route.useParams()`, typed `<Link to="/coffees/$coffeeId" params={{ coffeeId: String(id) }}>`, `useNavigate`) — not React Router.
- No `useMemo`/`useCallback` without a measured reason.
- Accessibility: every field has a `<label>`, errors are announced (`role="alert"` for load errors, `aria-live` on the cart summary), focus stays visible.
