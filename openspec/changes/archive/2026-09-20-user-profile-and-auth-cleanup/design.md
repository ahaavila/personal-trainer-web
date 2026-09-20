## Context

Currently, the `/meu-perfil` route renders a static `ComingSoonPage`. Meanwhile, `LoginPage.tsx` contains a static "Continuar com Google" button and divider that have no backend or OAuth integration. See `proposal.md` for motivation and `specs/user-profile/spec.md` and `specs/auth/spec.md` for requirements.

## Goals / Non-Goals

**Goals:**
- Replace `ComingSoonPage` with `MeuPerfilPage.tsx` and `MeuPerfilPage.css`.
- Support viewing account details: avatar initials, role badge ("Personal Trainer" or "Aluno"), email (read-only), name, and student fitness attributes (objective, level).
- Enable updating editable profile details: name (all users), and training objective & level (students).
- Synchronize updated name with `AuthContext` so header and sidebar reflect the change immediately without a page reload.
- Provide a secure password change section: current password, new password, confirm new password, with validation feedback.
- Clean up `LoginPage.tsx` and `LoginPage.css` by removing the Google login button and "ou" divider.
- Add mock endpoints in MSW (`PATCH /api/auth/profile` and `POST /api/auth/change-password`).

**Non-Goals:**
- Profile picture binary file uploads (can be added in a future enhancement).
- OAuth Google authentication integration (deferred until dedicated provider setup).

## Decisions

### 1. Two Sections on `MeuPerfilPage`
- **Section 1: Dados Pessoais / Perfil**: Avatar management (interactive upload button, preview, and remove button), Name, Email (disabled/read-only), Role badge, and conditional fields for students (Objetivo, Nível). Save button with inline success/error alert.
- **Section 2: Segurança & Senha**: Current password, New password (min 6 characters), Confirm password. Form clears after successful update.

### 2. Avatar Upload & Preview
- **Choice**: File input accepting images (`image/*` up to 5MB) converted to data URL for immediate client preview and persistence via `avatarUrl` string in `PATCH /api/auth/profile`. A "Remover foto" button allows clearing the avatar to return to the generated initials badge.
- **Rationale**: Clean UX, zero external dependencies required for development and production, seamless fallback to initials avatar.

### 3. Immediate Client Context Synchronization
- **Choice**: Call `setUser` from `useAuth()` upon successful profile update so the new user name is reflected across `AppLayout` and navigation components without requiring a re-login.

### 3. Removal of Google Login Elements
- **Choice**: Remove `<div className="login-form__divider">` and `<button className="login-form__google">` from `LoginPage.tsx`, removing the corresponding unused CSS classes.
- **Rationale**: Avoids presenting misleading inactive UI elements to end users.

## Risks / Trade-offs

- **[Risk: Incorrect current password during password change]** → *Mitigation*: MSW handler and backend verify the submitted current password against the stored password hash and return a clear `400 Bad Request` ("A senha atual está incorreta").
