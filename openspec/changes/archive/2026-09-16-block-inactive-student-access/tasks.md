## 1. Authentication Contract Handling

- [x] 1.1 Update frontend auth response/error handling so a backend rejection for a non-active aluno does not set authenticated user state and surfaces the message on the login screen.
- [x] 1.2 Ensure session bootstrap clears or avoids authenticated state when `/api/auth/me` rejects a non-active aluno session, and verify protected routes redirect to `/login`.

## 2. Mock Parity and Verification

- [x] 2.1 Update MSW login and session handlers to model aluno status and reject a non-active aluno in both flows.
- [x] 2.2 Verify active aluno access and inactive aluno login/session denial through MSW and run lint and production build.
