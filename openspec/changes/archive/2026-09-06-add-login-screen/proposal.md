## Why

The product needs a login screen so users can authenticate before reaching the app. The real backend auth API doesn't exist yet, so the frontend needs to be built and testable in isolation using a mocked API layer (Mock Service Worker) that can later be swapped for the real backend without changing the UI code.

## What Changes

- Add a login page matching the provided visual design (dark theme, split layout, email/password form, "Lembrar de mim" checkbox, "Esqueci minha senha" link, "Continuar com Google" button, and a footer message directing users to contact their personal trainer).
- Add client-side routing (introducing a router, since none exists yet) with a `/login` route and a placeholder `/dashboard` route.
- Add Mock Service Worker (MSW) to intercept a login API call in development, returning a mocked success/failure response.
- Implement mocked authentication with two user types - **personal** (trainer) and **aluno** (student) - each with its own fixed test credential (documented in design.md). A successful login redirects to the placeholder dashboard route, which renders a different placeholder view depending on the authenticated user type: the personal dashboard lists more placeholder sections than the aluno dashboard, reflecting that trainers will have access to more pages than students once real features exist. Any other input returns a login error shown on the form. Empty email/password show client-side validation errors before any request is made.
- Secondary actions ("Lembrar de mim", "Esqueci minha senha", "Continuar com Google") are rendered as static UI only in this change - no real behavior wired up yet.

## Capabilities

### New Capabilities
- `auth`: Login screen UI, form validation, and mocked authentication flow (via MSW) for two user types (personal, aluno) that redirects to a role-appropriate placeholder dashboard on success.

### Modified Capabilities
<!-- none -->

## Impact

- Affected code: adds `src/` routing setup, a login page/component and styles, a mocked API layer (MSW handlers + service worker), and a placeholder dashboard page.
- Affected dependencies: adds a client-side router (e.g. `react-router`) and `msw` as new dependencies.
- No existing specs are modified; `app-scaffold` remains as-is (this change builds on top of it).
