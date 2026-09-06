## Why

The repository currently has no application code — only `.github/` and `openspec/`. Before any feature work can start, the project needs a base React application scaffolded with Vite so future changes have a working frontend foundation to build on.

## What Changes

- Scaffold a new React + Vite application at the repository root (TypeScript template).
- Add standard tooling configuration: ESLint, `.gitignore`, `package.json` scripts (`dev`, `build`, `preview`, `lint`).
- Add a minimal starter page/component confirming the app runs, replacing the default Vite template content with a project-appropriate placeholder.
- Document how to install dependencies and run the dev server (README).

## Capabilities

### New Capabilities
- `app-scaffold`: Base React + Vite project structure, build/dev tooling, and the minimal runnable starter app.

### Modified Capabilities
<!-- none -->

## Impact

- Affected code: entire repository root (new `src/`, `public/`, `index.html`, `vite.config.ts`, `package.json`, `tsconfig*.json`, `.eslintrc`/`eslint.config.*`).
- Affected dependencies: adds Node.js/npm-based toolchain (React, Vite, TypeScript, ESLint) as new project dependencies.
- No existing specs or code are modified since none currently exist.
