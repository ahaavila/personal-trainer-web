# Personal Trainer Web

Base React + TypeScript + Vite project scaffold.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Other available scripts:

- `npm run build` — type-check and produce a production build in `dist/`
- `npm run preview` — serve the production build locally
- `npm run lint` — run ESLint over the project

## Login

By default (`npm run dev`), login requests go through the Vite dev proxy (`/api` → `http://localhost:3000`) to the real backend ([`personal-trainer-backend`](https://github.com/ahaavila/personal-trainer-backend)), which must be running locally with its database migrated and seeded.

If you want to work on the UI without running the backend, use `npm run dev:mock` instead - this starts the app with [Mock Service Worker](https://mswjs.io/) (see `src/mocks/`) intercepting login requests. Mocking is controlled by the `VITE_ENABLE_MOCKS` env var (see `.env.mock`, loaded automatically in `mock` mode) and is always excluded from production builds.

Two fixed test credentials work in both modes (the backend seeds the same two users), one per user type:

| Role     | E-mail                 | Password      |
| -------- | ----------------------- | ------------- |
| Personal | `personal@fitforge.app` | `personal123` |
| Aluno    | `aluno@fitforge.app`    | `aluno123`    |

Any other email/password combination results in a login error. A successful login navigates to `/dashboard`, which renders a different placeholder view depending on the authenticated role.

### Session

Authentication uses an httpOnly session cookie (set by the backend, or simulated by the mock) rather than a token in the response body. All auth requests (`login`, `me`, `logout`) send `credentials: 'include'` so the browser attaches/receives the cookie automatically - no manual token handling in the frontend.

On app load, the frontend calls `GET /api/auth/me` before rendering routes to recover an existing session, so reloading the page while logged in does not force a new login. Use the "Sair" button on the dashboard to log out (calls `POST /api/auth/logout`), which ends the session in both `npm run dev` and `npm run dev:mock`.

## Template Details

This project was scaffolded with the official Vite React + TypeScript template, which provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
