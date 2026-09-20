## 1. Auth Cleanup & API Types

- [x] 1.1 Remove Google login button and "ou" divider from `LoginPage.tsx` and `LoginPage.css`; verify login page renders without Google elements
- [x] 1.2 Add profile and password change request/response interfaces in `src/auth/types.ts` and client methods (`updateProfile`, `changePassword`, `getProfileDetails`) in `src/auth/api.ts`; verify types compile with `npm run build`
- [x] 1.3 Add MSW mock handlers for `PATCH /api/auth/profile` and `POST /api/auth/change-password` in `src/mocks/handlers.ts`, verifying response formats and error states

## 2. Meu Perfil Page Implementation

- [x] 2.1 Implement `MeuPerfilPage.tsx` with user details card, editable personal information form, and password change form with validation rules; verify validations and error feedback
- [x] 2.2 Implement `MeuPerfilPage.css` adhering to the FitForge dark and gold design system; verify layout and responsive styling
- [x] 2.3 Wire `MeuPerfilPage` into `/meu-perfil` in `src/router.tsx` replacing `ComingSoonPage`; verify route access for personal and aluno roles
- [x] 2.4 Add avatar upload and removal functionality to `MeuPerfilPage` with image preview and validation; verify preview and clearing to initials

## 3. End-to-End Verification

- [x] 3.1 Verify profile updates for personal trainer: update name, check header synchronization, and change password
- [x] 3.2 Verify profile updates for aluno: update name, objective, and level, and test password change
- [x] 3.3 Verify avatar upload, preview, update, and removal flow
