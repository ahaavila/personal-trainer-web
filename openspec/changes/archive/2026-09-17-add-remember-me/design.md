## Context

The login screen currently includes a checkbox labeled "Lembrar de mim", but it is uncontrolled and static. Users expecting "Lembrar de mim" expect both:
1. Their email to be remembered in the browser so that returning to `/login` automatically fills in their email address.
2. Their authenticated session duration to be prolonged (e.g. 30 days) rather than a short 1-day/session expiration.

## Goals / Non-Goals

**Goals:**
- Make the "Lembrar de mim" checkbox controlled in `LoginPage.tsx`.
- On page load, read `localStorage` for `fitforge:remembered_email`. If found, prefill the email input and set the checkbox to checked.
- On successful login:
  - If "Lembrar de mim" is checked: persist the email in `localStorage` under `fitforge:remembered_email` and include `rememberMe: true` in `POST /api/auth/login`.
  - If unchecked: remove `fitforge:remembered_email` from `localStorage` and include `rememberMe: false`.
- Update `LoginRequestBody` in `src/auth/types.ts` to include `rememberMe?: boolean`.
- Update MSW mock handlers in `src/mocks/handlers.ts` to simulate extended session cookie expiration (`Max-Age=2592000` / 30 days) when `rememberMe` is true.
- Document backend architecture requirements for `personal-trainer-backend` to accept `rememberMe` in `LoginDto` and adjust JWT and cookie expiration accordingly.

**Non-Goals:**
- Storing passwords, credentials, or authentication tokens in `localStorage`. Only the email string is stored in browser storage.
- Implementing "Esqueci minha senha" or "Continuar com Google" (those remain static UI).

## Decisions

### 1. Browser Storage vs Cookies for Email Prefill
- *Choice*: Use `localStorage` key `fitforge:remembered_email` for remembering the email address.
- *Rationale*: Client-side email prefill only needs to be accessible to the frontend application on `/login`. Sensitive session tokens remain in `HttpOnly` cookies, preserving XSS security boundaries.

### 2. Controlled Checkbox & Lifecycle
- State: `rememberMe` initialized to `Boolean(localStorage.getItem('fitforge:remembered_email'))`.
- Email input: initialized to `localStorage.getItem('fitforge:remembered_email') || ''`.
- When form submits and login succeeds:
  - If `rememberMe`: `localStorage.setItem('fitforge:remembered_email', trimmedEmail)`.
  - Else: `localStorage.removeItem('fitforge:remembered_email')`.

### 3. API Contract for Extended Sessions
- `POST /api/auth/login`:
  ```json
  {
    "email": "user@fitforge.app",
    "password": "password123",
    "rememberMe": true
  }
  ```
- Backend (`personal-trainer-backend`) behavior:
  - Standard session (`rememberMe: false` or omitted): JWT valid for 1 day (`1d`), cookie expires in 1 day.
  - Extended session (`rememberMe: true`): JWT valid for 30 days (`30d`), cookie `expires` / `maxAge` set to 30 days.

### 4. MSW Handler Emulation
- Update mock login handler in `src/mocks/handlers.ts`:
  - When `rememberMe: true`: sets cookie with `Max-Age=2592000; Path=/`.
  - When `rememberMe: false`: sets cookie without extended Max-Age (standard session cookie).

## Risks / Trade-offs

- **[Risk] Security on shared/public devices**
  -> *Mitigation*: Never save passwords or authentication secrets in `localStorage`. The checkbox defaults to unchecked unless the user previously chose to be remembered. Unchecking and logging in immediately purges the stored email.
