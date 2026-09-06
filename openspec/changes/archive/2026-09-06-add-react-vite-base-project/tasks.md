## 1. Scaffold Project

- [x] 1.1 Run `npm create vite@latest . -- --template react-ts` at the repository root and verify `package.json`, `index.html`, `src/`, `vite.config.ts`, and `tsconfig*.json` are created
- [x] 1.2 Run `npm install` and verify `node_modules/` is populated and install completes without errors
- [x] 1.3 Add/confirm `.gitignore` covers `node_modules/`, `dist/`, and editor/log artifacts

## 2. Verify Tooling Scripts

- [x] 2.1 Run the `dev` script and verify the dev server starts and serves the app locally without errors
- [x] 2.2 Run the `build` script and verify a production bundle is generated in the output directory without errors
- [x] 2.3 Run the `preview` script against the build output and verify the app loads correctly
- [x] 2.4 Run the `lint` script and verify it completes, reporting zero violations on the generated starter code

## 3. Minimal Starter Page

- [x] 3.1 Replace the default Vite template starter content in `src/App.tsx` with a minimal, generic placeholder page
- [x] 3.2 Manually load the app in a browser (dev server) and verify the placeholder page renders with no console errors

## 4. Documentation

- [x] 4.1 Add/update `README.md` with install (`npm install`) and run (`npm run dev`) instructions, and verify the documented commands work as written
