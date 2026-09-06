## Context

The project is a freshly scaffolded React + Vite + TypeScript app (see `app-scaffold`) with no routing, no API layer, and no auth-related code yet. See proposal.md - Why for motivation on using a mocked API instead of waiting for the real backend.

## Goals / Non-Goals

**Goals:**
- Introduce minimal client-side routing sufficient for a `/login` route and a placeholder `/dashboard` route.
- Introduce Mock Service Worker (MSW) to intercept a login request in development and return a mocked response, so the UI is built against a realistic request/response contract that a real backend can later fulfill.
- Match the provided visual design closely (colors, layout, copy) using plain CSS.

**Non-Goals:**
- No real backend integration, token storage/session persistence, or route protection/guards - the dashboard route is a static placeholder reachable only via successful mocked login in this change.
- No real Google OAuth integration - the button is static UI only.
- No password reset flow - the "Esqueci minha senha" link is static UI only.

## Decisions

- **Router: `react-router` (v7, `createBrowserRouter`)**: Standard, widely-adopted client-side router for React; needed since the project currently has none. Alternative considered: hand-rolled state-based view switching - rejected because it doesn't scale past this change and `react-router` is the de facto standard.
- **Mocking: Mock Service Worker (`msw`)**: Intercepts at the network level (via a service worker in the browser), so the app's `fetch` calls are unchanged when the real backend arrives later - only the MSW handler is removed. Alternative considered: an in-memory fake function replacing the API client directly - rejected because it diverges further from real network behavior (no request/response shape, no async network delay) than MSW.
- **Mock login contract**: `POST /api/auth/login` with `{ email, password }` body. Two test credentials, one per user type:
  - Personal: `email: "personal@fitforge.app"`, `password: "personal123"` → `200` with a mock user payload where `role: "personal"`.
  - Aluno: `email: "aluno@fitforge.app"`, `password: "aluno123"` → `200` with a mock user payload where `role: "aluno"`.
  - Any other non-empty email/password → `401` with an error message.
  This exact contract is documented here (not in specs) since it's an implementation detail the mock enforces, not user-facing behavior beyond success/failure.
- **Role-based dashboard rendering**: the `/dashboard` route reads the `role` from the mocked login response (held in in-memory app state, not persisted) and renders one of two placeholder views: a personal view listing more placeholder sections (e.g. Alunos, Treinos, Financeiro, Configurações) and an aluno view listing fewer (e.g. Meus Treinos, Meu Perfil). Both are static placeholders with no real pages behind them yet - this only demonstrates that personal and aluno see a different set of options.
- **Styling: plain CSS module/file per component**, matching the existing `App.css` convention in `app-scaffold` rather than introducing a new styling library, to keep the base scaffold's tooling decisions intact.

## Risks / Trade-offs

- [Risk] MSW requires a generated service worker file (`public/mockServiceWorker.js`) and browser-only setup that only runs in dev/test, not production → Mitigation: gate MSW's `worker.start()` behind a dev-only check (e.g. `import.meta.env.DEV`) so production builds never load it.
- [Risk] Hardcoding test credentials could be mistaken for real ones → Mitigation: clearly label them as mock/test credentials in the README and in a visible on-screen hint during development only.
- [Risk] Role state only lives in memory (per Non-Goals, no persistence), so refreshing the dashboard page loses the authenticated role and cannot re-render it → Mitigation: acceptable for this change since route protection/persistence is explicitly out of scope; documented here so it isn't mistaken for a bug.
