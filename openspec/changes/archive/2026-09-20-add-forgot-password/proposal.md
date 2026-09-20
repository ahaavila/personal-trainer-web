## Why

Currently, the login screen includes a non-functional "Esqueci minha senha?" link with no recovery behavior attached. Users (both personal trainers and students) who lose or forget their password need a self-service recovery flow to request a reset link and set a new password, improving accessibility and reducing administrative overhead.

## What Changes

- Update the "Esqueci minha senha?" link on the login page to navigate to a dedicated password recovery request page (`/esqueci-minha-senha`).
- Add a new "Esqueci minha senha" page (`/esqueci-minha-senha`) with an email input form, input validation, loading states, and feedback displaying instructions and a simulated reset link for development/mocking.
- Add a new "Redefinir senha" page (`/redefinir-senha`) accepting a reset token via URL search parameters, validating token presence/validity, and providing a password confirmation form to update credentials.
- Add API client functions and Mock Service Worker (MSW) endpoints to handle password reset requests (`POST /api/auth/forgot-password`) and password updates (`POST /api/auth/reset-password`).
- Provide navigation back to `/login` upon completion or cancellation.

## Capabilities

### New Capabilities
- `forgot-password`: Covers the self-service password recovery flow, including requesting a reset link by email, token validation, and resetting the account password.

### Modified Capabilities
- `auth`: Updates the login screen visual design requirements so that the "Esqueci minha senha?" link actively navigates to `/esqueci-minha-senha` instead of remaining an inert static link.

## Impact

- **Routing**: Adds public routes `/esqueci-minha-senha` and `/redefinir-senha` to `src/router.tsx`.
- **Components & Pages**: Updates `src/pages/LoginPage.tsx` (navigation link); creates `src/pages/ForgotPasswordPage.tsx` and `src/pages/ResetPasswordPage.tsx` along with corresponding CSS files.
- **Auth & API**: Adds recovery endpoints in `src/auth/api.ts`, request/response types in `src/auth/types.ts`, and mock handlers in `src/mocks/handlers.ts`.
