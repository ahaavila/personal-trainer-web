## 1. Auth Types and Mock Handlers

- [x] 1.1 Update `LoginRequestBody` in `src/auth/types.ts` to include optional `rememberMe?: boolean`, and verify TypeScript compilation passes.
- [x] 1.2 Update MSW mock login handler in `src/mocks/handlers.ts` to inspect `rememberMe` and set extended cookie expiration (`Max-Age=2592000`) when enabled.

## 2. Login Form Implementation & Persistence

- [x] 2.1 Update `src/pages/LoginPage.tsx` to bind the "Lembrar de mim" checkbox to controlled React state, pre-filling email and checkbox state from `localStorage.getItem('fitforge:remembered_email')` on mount.
- [x] 2.2 In `src/pages/LoginPage.tsx`, handle successful login persistence: save email to `localStorage` when "Lembrar de mim" is checked, or clear it from `localStorage` when unchecked.
- [x] 2.3 Send `rememberMe` in the login request payload in `src/pages/LoginPage.tsx` and verify proper forwarding to `/api/auth/login`.

## 3. Verification

- [x] 3.1 Verify end-to-end flow: logging in with "Lembrar de mim" checked persists the email, logging out/revisiting pre-fills the email field, and logging in unchecked clears the saved email.
- [x] 3.2 Run lint and production build to ensure clean compilation.
