## Context

The application provides a login interface for personal trainers and students using React, React Router, and a mock API layer powered by MSW (`src/mocks/handlers.ts`). Currently, the "Esqueci minha senha?" link on `LoginPage.tsx` is an inert anchor tag with `e.preventDefault()`. See `proposal.md` for motivation and `specs/forgot-password/spec.md` for functional requirements.

## Goals / Non-Goals

**Goals:**
- Provide dedicated public routes for password recovery (`/esqueci-minha-senha`) and password reset (`/redefinir-senha`).
- Enable users to request recovery via email, with friendly validation and security-conscious feedback.
- Allow password reset with token verification, enforcing minimum length (6+ characters) and confirmation match.
- Wire MSW mock endpoints (`/api/auth/forgot-password` and `/api/auth/reset-password`) to simulate token generation and update mock credentials in memory, making the flow end-to-end testable immediately.
- Maintain visual harmony with the existing FitForge dark theme and typography.

**Non-Goals:**
- Integrating real email delivery infrastructure (SMTP, SendGrid, Amazon SES) in this frontend repo.
- Complex multi-factor authentication (MFA/SMS) or recovery questions.

## Decisions

### 1. Dedicated routes over modals
- **Choice**: Implement `/esqueci-minha-senha` and `/redefinir-senha` as standalone routes in `src/router.tsx`.
- **Rationale**: Real password reset emails contain links that navigate the user directly to a reset page with a token parameter (`/redefinir-senha?token=xyz`). Using standalone routes matches production architecture and ensures smooth transition when connecting a real backend.
- **Alternatives considered**: Modal overlay on the login page (does not support natural email deep-linking).

### 2. In-memory MSW token simulation and credential update
- **Choice**: MSW stores issued tokens in a module-level map: `RESET_TOKENS: Map<string, { email: string, expiresAt: number }>`.
  - When `POST /api/auth/forgot-password` is called, generate a token, store the association, and return `{ message: string, simulatedUrl?: string }`.
  - The UI displays a helpful testing banner containing the simulated reset link (`/redefinir-senha?token=...`).
  - When `POST /api/auth/reset-password` is called with the token and new password, MSW verifies the token, finds the user in `TEST_CREDENTIALS`, and updates their password in memory.
- **Rationale**: Developers and testers can immediately test the entire roundtrip (request -> click link -> set new password -> log in with new password) without configuring any external email server.

### 3. Enumeration protection with dev visibility
- **Choice**: The UI and API message always confirms instructions were sent ("Se o e-mail estiver registado, enviámos instruções..."), adhering to OWASP security guidelines. For development/testing convenience, the mock response provides the simulated link so tests and local users can proceed easily.
- **Alternatives considered**: Erroring on unknown emails (vulnerable to email enumeration attacks).

### 4. Visual alignment with Login split design
- **Choice**: The recovery and reset pages will reuse the styling language from `LoginPage.css` (dark background `#0c0a08`, gold accent `#e2a83e`, typography, clean input containers, and button states).
- **Rationale**: Consistent brand identity across all authentication/access screens.

## Risks / Trade-offs

- **[Risk: Browser refresh loses in-memory MSW tokens]** → *Mitigation*: Support a fallback deterministic token (e.g. `mock-token-personal` or `dev-test-token`) in MSW handlers so manual testing or refreshed tabs can still validate the reset page.
- **[Risk: User visits `/redefinir-senha` without a token]** → *Mitigation*: The component inspects `useSearchParams().get('token')` immediately on mount; if absent or invalid, it displays an informative warning card with a direct link back to `/esqueci-minha-senha`.
