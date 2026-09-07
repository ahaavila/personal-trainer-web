## 1. API Client Updates

- [x] 1.1 Update `src/auth/api.ts`'s `login` call to send `credentials: 'include'` and stop expecting a `token` field in the success response, and verify the type/shape still compiles and matches the new contract
- [x] 1.2 Add a `getSession` (or similarly named) function calling `GET /api/auth/me` with `credentials: 'include'`, returning the user on success or `null` on a non-200 response, and verify it against the mock and a manual call
- [x] 1.3 Add a `logout` function calling `POST /api/auth/logout` with `credentials: 'include'`, and verify it resolves successfully against the mock

## 2. Session Recovery on Load

- [x] 2.1 Update `src/main.tsx` to call the session-recovery check before the first render, populating `AuthContext` with the recovered user (or none), and verify via a manual reload after logging in that the user stays authenticated
- [x] 2.2 Verify that with no valid session, the app still renders promptly and shows the login screen when navigating to `/login`

## 3. Logout UI

- [x] 3.1 Add a "Sair" action to `DashboardPage` that calls `logout`, clears the in-memory user, and navigates back to `/login`, and verify clicking it ends the session (a subsequent reload no longer recognizes the user)

## 4. Mock Parity

- [x] 4.1 Update `src/mocks/handlers.ts`'s login handler to stop returning a token and instead set a mock session cookie identifying the logged-in test user, and verify existing login scenarios (personal, aluno, failure) still pass
- [x] 4.2 Add a mock handler for `GET /api/auth/me` reading the mock session cookie and returning `{ role, name }` or a 401, and verify it manually in `dev:mock` mode
- [x] 4.3 Add a mock handler for `POST /api/auth/logout` clearing the mock session cookie, and verify a subsequent mock `/me` call returns 401 after logout

## 5. Documentation

- [x] 5.1 Update `README.md`'s login section to describe session recovery and logout, and verify the documented flow matches the implementation in both `npm run dev` (real backend) and `npm run dev:mock` modes
