## Context

The frontend establishes its local authentication state from `POST /api/auth/login` and restores it from `GET /api/auth/me`. Both currently reduce any non-success response to no session, while MSW does not model aluno status. The backend is the authority for status and will reject non-active alunos.

## Goals / Non-Goals

**Goals:**
- Preserve existing login and session-recovery flow for personal and active aluno accounts.
- Treat the backend's non-active aluno rejection as unauthenticated state, while showing its message after an attempted login.
- Keep mock-mode behavior aligned with the backend contract.

**Non-Goals:**
- Let the frontend independently authorize status, or expose account status in authenticated client state.
- Add personal UI to change an aluno status.

## Decisions

- Keep the status decision server-side; `getSession()` returns `null` on a rejected session so route guards redirect to login.
- Preserve error bodies from failed login requests so the login screen can display the blocked-account message.
- Extend mock credential records with the aluno status and reject non-active alunos from both `/api/auth/login` and `/api/auth/me`.

## Risks / Trade-offs

- [Risk] An active session may appear valid in the browser until the next authenticated request -> Mitigation: backend re-checks status on session recovery and protected API requests; frontend clears state when session recovery is rejected.
