## 1. Auth Types and Mock API Layer

- [x] 1.1 Add request/response types for forgot-password and reset-password flows in `src/auth/types.ts` and verify types compile via `npm run build`
- [x] 1.2 Implement `requestPasswordReset` and `resetPassword` API client functions in `src/auth/api.ts` and verify function signatures and error handling
- [x] 1.3 Add MSW mock handlers for `POST /api/auth/forgot-password` and `POST /api/auth/reset-password` in `src/mocks/handlers.ts` with in-memory token tracking and credential updating, verifying API responses with mock calls

## 2. Password Recovery Pages and Routing

- [x] 2.1 Implement `ForgotPasswordPage.tsx` and `ForgotPasswordPage.css` with email validation, submission states, feedback message, and dev simulated link; verify empty and invalid email validations
- [x] 2.2 Implement `ResetPasswordPage.tsx` and `ResetPasswordPage.css` checking for the `token` URL query parameter, validating password length and match, and providing success confirmation; verify missing token and mismatched password states
- [x] 2.3 Register `/esqueci-minha-senha` and `/redefinir-senha` routes in `src/router.tsx` and update the "Esqueci minha senha?" link in `src/pages/LoginPage.tsx` to navigate to `/esqueci-minha-senha`; verify link navigation from `/login`

## 3. End-to-End Verification

- [x] 3.1 Perform end-to-end verification of the password reset flow: request recovery for `personal@fitforge.app`, open the simulated link, reset the password to a new value, and verify successful login on `/login` with the updated password
