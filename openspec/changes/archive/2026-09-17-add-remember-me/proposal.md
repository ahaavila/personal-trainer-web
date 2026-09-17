## Why

Currently, the "Lembrar de mim" checkbox on the login page is a static UI placeholder without state or behavior. Users who check "Lembrar de mim" expect their email to be remembered for subsequent logins, and their authenticated session to remain active for an extended duration (e.g. 30 days) rather than a short session.

## What Changes

- Make the "Lembrar de mim" checkbox on `/login` interactive with controlled state.
- If a remembered email exists in browser storage (`localStorage`), prefill the email input field on page load and keep "Lembrar de mim" checked by default.
- On successful login:
  - If "Lembrar de mim" is checked: persist the entered email in `localStorage` and transmit `rememberMe: true` in the authentication request.
  - If "Lembrar de mim" is unchecked: remove any previously saved email from `localStorage` and transmit `rememberMe: false`.
- Update `LoginRequestBody` in `src/auth/types.ts` to include optional `rememberMe?: boolean`.
- Update MSW mock handlers in `src/mocks/handlers.ts` to recognize `rememberMe` and simulate extended cookie expiration (`Max-Age=2592000`).
- Define the contract for the backend (`personal-trainer-backend`) to accept `rememberMe` and issue extended JWTs/cookies accordingly.

## Capabilities

### New Capabilities
<!-- No new capabilities -->

### Modified Capabilities
- `auth`: The "Lembrar de mim" checkbox is functional, storing remembered email in browser storage and forwarding `rememberMe` to the authentication request for extended sessions.

## Impact

- Frontend: `src/pages/LoginPage.tsx`, `src/auth/types.ts`, `src/mocks/handlers.ts`.
- Backend (`personal-trainer-backend`): `LoginDto`, `AuthService.login`, cookie expiration handling.
