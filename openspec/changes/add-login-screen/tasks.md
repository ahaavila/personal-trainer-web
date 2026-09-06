## 1. Dependencies & Routing Setup

- [x] 1.1 Add `react-router` dependency and verify `npm install` completes without errors
- [x] 1.2 Add `msw` as a dev dependency and run its init command to generate `public/mockServiceWorker.js`, verifying the file is created
- [x] 1.3 Set up a router in `src/main.tsx` (or a new `src/router.tsx`) with a `/login` route and a placeholder `/dashboard` route, and verify the app builds and the dev server serves `/login`

## 2. Mock API Layer

- [x] 2.1 Add an MSW request handler for `POST /api/auth/login` implementing the two-credential mock contract from design.md (personal and aluno test credentials each succeed with 200 and a `role`, anything else non-empty fails with 401), and verify it via manual requests against the running dev server for both roles and a failure case
- [x] 2.2 Wire up the MSW worker to start only in development (`import.meta.env.DEV`), and verify it does not start in a production build

## 3. Login Screen UI

- [x] 3.1 Build the login page layout matching the provided design: decorative side panel, branding, "Bem-vindo de volta" heading, and form panel, and verify visually in the browser against the reference image
- [x] 3.2 Build the email/password form fields with labels and placeholders matching the design, and verify they render and accept input
- [x] 3.3 Add the "Lembrar de mim" checkbox, "Esqueci minha senha" link, "Continuar com Google" button, and footer message as static (non-functional) UI matching the design, and verify clicking them has no side effect
- [x] 3.4 Style the page to match the provided design's dark theme, colors, and typography, and verify visually against the reference image

## 4. Form Validation & Auth Integration

- [x] 4.1 Add client-side validation requiring non-empty email and password, showing field-level errors on submit when empty, and verify by submitting the empty form
- [x] 4.2 Wire the form submission to call the mock login endpoint and handle the response: store the returned `role` in app state and navigate to `/dashboard` on success, show a login error message on failure, and verify both paths manually with each test credential and an incorrect one
- [x] 4.3 Add a placeholder `/dashboard` page that reads the authenticated `role` from app state and renders one of two placeholder views (personal: more placeholder sections; aluno: fewer placeholder sections), and verify navigating there after each role's login shows the correct role-specific view without a full page reload

## 5. Documentation

- [x] 5.1 Document both mock test credentials (personal and aluno) and how to run the app with MSW enabled in `README.md`, and verify the documented steps work as written for both roles
