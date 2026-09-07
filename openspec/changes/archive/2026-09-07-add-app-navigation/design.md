## Context

See proposal.md - Why. Today the app has one authenticated route (`/dashboard`, see `router.tsx`) rendering `DashboardPage`, which hardcodes a flat list of section name strings per role (no navigation, no routes behind them). `AuthContext`/`useAuth` already expose the authenticated user's `role` and `name`; session recovery via `/api/auth/me` already happens before the first render (see the archived `add-cookie-session-auth` change).

## Goals / Non-Goals

**Goals:**
- Introduce a layout component with a persistent sidebar, wrapping all authenticated routes.
- Add one route per menu item, in the exact order specified in the proposal, for both roles.
- Render a generic placeholder page for every route that doesn't have a real page yet (all of them, in this change).
- Highlight the active menu item based on the current route.

**Non-Goals:**
- No real functionality behind any page yet (no data fetching for Clientes, Exercícios, etc.) - every route renders the same kind of placeholder content in this change.
- No server-side route protection - matches the existing `auth` capability's Non-Goals; menu items are hidden/shown purely based on the client-known role.
- No responsive/mobile-specific sidebar behavior (e.g. collapse to a hamburger menu) - desktop layout only for now.

## Decisions

- **Layout via a wrapping route component**: introduce an `AppLayout` component (rendered by `react-router`'s layout route feature) containing the sidebar and an `<Outlet />` for the active page, so every authenticated route automatically gets the sidebar without repeating it per page.
- **Menu item list is data, not JSX**: define the personal and aluno menu item lists (label + route path) as plain arrays in one place (e.g. `src/navigation/menuItems.ts`), so the fixed order from the proposal is enforced by a single source of truth and the sidebar component just maps over it.
- **One shared placeholder component**: a single `ComingSoonPage` (or similar) component, parameterized by the page title, is reused for every route without real functionality yet - avoids creating near-identical placeholder files per page.
- **Route paths**: derive kebab-case paths from each label (e.g. `/clientes`, `/exercicios`, `/nova-ficha-de-treino`, `/treinos`, `/meu-perfil`, `/criar-utilizador`, `/ficha-de-treino-atual`). `/dashboard` is kept as-is since it already exists and is linked from both roles' menus.
- **`DashboardPage` simplified**: remove the hardcoded `PERSONAL_SECTIONS`/`ALUNO_SECTIONS` arrays and role-based section list now that real navigation exists; keep the welcome message and logout action, moving logout into the new layout (sidebar) instead of the page itself so it's available everywhere, not just on the dashboard.

## Risks / Trade-offs

- [Risk] Placeholder pages for every item could make the app feel unfinished if shown to real users too early → Mitigation: acceptable for this stage since the goal is explicitly to start structuring pages before building each feature; the proposal documents this as intentional, incremental scope.
