## Why

Users (both personal trainers and students) currently see a placeholder "Coming Soon" page when visiting `/meu-perfil`. They need a functional profile screen to review and manage their account information (name, email, role-specific attributes like objective/level for students) and securely change their account password. Additionally, the login screen displays a non-functional "Continuar com Google" button which should be removed until OAuth integrations are actually supported.

## What Changes

- Replace `ComingSoonPage` on `/meu-perfil` with a full-featured `MeuPerfilPage`.
- Allow users to view their account info (Role, Email, Name, and training profile objective/level for students).
- Allow users to update their profile details (Name, avatar photo upload/removal, and training objective/level when student).
- Provide a secure password change form (Current Password, New Password, Confirm New Password) with validation rules (min 6 characters, confirmation match).
- Remove the "Continuar com Google" button and its decorative divider ("ou") from `LoginPage.tsx` and `LoginPage.css`.
- Add client API functions and MSW mock handlers for updating profile information (`PATCH /api/auth/profile`) and changing password (`POST /api/auth/change-password`).

## Capabilities

### New Capabilities
- `user-profile`: Covers viewing and updating user account profile details (name, training goals) and changing account passwords within authenticated sessions.

### Modified Capabilities
- `auth`: Removes the "Continuar com Google" button and secondary OAuth element from the login screen specification.

## Impact

- **Routing & Navigation**: Replaces `ComingSoonPage` with `MeuPerfilPage` on route `/meu-perfil` in `src/router.tsx`.
- **Pages & Components**: Creates `src/pages/MeuPerfilPage.tsx` and `src/pages/MeuPerfilPage.css`; edits `src/pages/LoginPage.tsx` and `src/pages/LoginPage.css`.
- **API & Mocking**: Adds endpoints `PATCH /api/auth/profile` and `POST /api/auth/change-password` in `src/auth/api.ts` and `src/mocks/handlers.ts`.
