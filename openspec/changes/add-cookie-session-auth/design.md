## Context

See proposal.md - Why. The backend's corresponding `add-cookie-session-auth` change moves the JWT into an httpOnly cookie and adds `GET /api/auth/me` and `POST /api/auth/logout`. Today, `src/auth/AuthContext.tsx` only holds the user in memory (`useState`, no persistence), and `src/main.tsx` renders the router immediately with no session check - matching the risk already documented in the original `add-login-screen` design ("Role state only lives in memory... refreshing the dashboard page loses the authenticated role").

## Goals / Non-Goals

**Goals:**
- Send `credentials: 'include'` on the login, `/me`, and `/logout` calls so the browser handles the session cookie automatically.
- Call `GET /api/auth/me` once on app startup (before rendering routes) to recover an existing session.
- Add a minimal logout action reachable from the dashboard.
- Keep the mock (MSW) contract equivalent to the real backend so `npm run dev:mock` continues to exercise the same UI flow end-to-end.

**Non-Goals:**
- No route guards/redirects beyond what already exists (`DashboardPage` already redirects to `/login` when there's no user) - this change only affects how the user is populated (via `/me` recovery in addition to a fresh login), not access control logic itself.
- No "remember me" / long-lived session behavior beyond whatever expiration the backend's cookie already has - this change doesn't add its own persistence layer (e.g. no localStorage).
- No changes to the login screen's visual design or the still-static secondary UI elements ("Lembrar de mim", "Esqueci minha senha", "Continuar com Google").

## Decisions

- **A loading state while `/me` resolves**: `main.tsx` awaits the `/me` check before the first render of routes (similar to how MSW's `enableMocking()` is already awaited before rendering), showing nothing/a minimal placeholder until it resolves, then rendering with the recovered user (or none) already in context. This avoids a flash of the login screen for an already-authenticated user.
- **Mock parity via a simulated session cookie**: MSW intercepts at the network level, so a mocked response can set a real `Set-Cookie` header and the browser will store and resend it like any other cookie. The mock login handler sets a distinct cookie (e.g. `mock_session`) encoding which test user is logged in; a new mock handler for `/api/auth/me` reads that cookie the same way the real backend reads its own; a new mock handler for `/api/auth/logout` clears it. This keeps `dev:mock` behaviorally identical to the real backend without needing any different frontend code path.
- **Logout placement**: a simple "Sair" action on `DashboardPage` (the only page reachable after login today) calling the new logout function and then navigating back to `/login`. No dedicated logout UI elsewhere yet, since no other authenticated page exists.
- **`role`/`name` unchanged as the success shape**: both login and `/me` resolve to the same `{ role, name }` shape the app already uses, so `AuthContext`'s stored user type does not need to change.

## Risks / Trade-offs

- [Risk] If `/me` is slow or the backend is unreachable, the app could appear to hang before its first render → Mitigation: keep the check minimal (a single fetch) and treat any error/non-200 response as "not authenticated" rather than retrying, so the app still renders the login screen promptly.
- [Risk] Mocked cookie behavior could subtly diverge from the real backend's cookie attributes (e.g. `SameSite`, expiration) → Mitigation: acceptable since MSW's purpose is exercising the UI flow, not verifying backend cookie security attributes - that's covered by the backend change's own tasks.
