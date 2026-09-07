## Why

The backend (`personal-trainer-backend`) is switching authentication from returning a JWT in the login response body to setting it as an httpOnly session cookie, plus adding `GET /api/auth/me` and `POST /api/auth/logout` (see that repo's `add-cookie-session-auth` change). The frontend currently only keeps the authenticated user in memory, so a page refresh loses the session even though the browser would still hold a valid cookie. This change updates the frontend to use the cookie-based flow and recover the session on load.

## What Changes

- Send `credentials: 'include'` on auth-related requests so the browser sends/receives the session cookie.
- On app load, call `GET /api/auth/me` to recover an existing session (role/name) before rendering routes, instead of starting with no user until a fresh login.
- Stop expecting a `token` field in the login response body (the backend no longer returns one); success is still identified by `{ role, name }`.
- Add a logout action (calling `POST /api/auth/logout`) so the session can be ended from the UI, and clear the in-memory user on success.
- Update the mock (MSW) handlers to match the new contract: login no longer returns a token in the body and sets a mock session cookie instead; add mock handlers for `/api/auth/me` and `/api/auth/logout` so `npm run dev:mock` still exercises the same flow end-to-end.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `auth`: Session is now recovered via a cookie + `/me` check on load instead of only living in memory; login no longer expects a token in the response body; adds logout.

## Impact

- Affected code: `src/auth/api.ts` (credentials, `/me`, `/logout` calls), `src/auth/AuthContext.tsx`/`useAuth` (loading/recovery state), `src/main.tsx` (call `/me` before rendering), `src/pages/DashboardPage.tsx` (logout action), `src/mocks/handlers.ts` (updated contract).
- No new dependencies expected (uses the existing `fetch` API).
- Depends on the backend's `add-cookie-session-auth` change being implemented for real (non-mock) testing to work.
