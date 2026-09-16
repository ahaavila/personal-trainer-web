## Why

An aluno marked with a status other than `ativo` must no longer be able to use the application. The frontend currently trusts a recovered authenticated session without receiving or enforcing student account status.

## What Changes

- Treat an inactive or otherwise non-active aluno session as unavailable in the frontend.
- Clear the local authenticated user and redirect to `/login` when login or session recovery is rejected because the aluno is inactive.
- Display the backend-provided access message on the login screen without exposing dashboard or protected page content.
- Update MSW authentication behavior so non-active aluno accounts are denied consistently during mock login and session recovery.
- Consume the backend's status-aware session/authentication contract; this repository does not own the authorization decision.

## Capabilities

### New Capabilities
<!-- No new capabilities. -->

### Modified Capabilities
- `auth`: Frontend authentication handling denies sessions for alunos whose account status is not `ativo`.

## Impact

- Frontend: auth response types, authentication API/client handling, login/session bootstrap behavior, and MSW handlers.
- Backend: depends on the separate `personal-trainer-backend` change of the same name to enforce account status authoritatively.
