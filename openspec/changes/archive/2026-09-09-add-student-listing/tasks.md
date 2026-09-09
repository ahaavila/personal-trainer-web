## 1. Terminology & Navigation

- [x] 1.1 Rename personal-facing Clientes terminology to Alunos in menu labels, dashboard cards/actions, types, and visible copy; verify no product-facing Cliente/Clientes text remains
- [x] 1.2 Replace `/clientes` with `/alunos` throughout the personal navigation and add a `/clientes` → `/alunos` redirect; verify navigation and saved legacy route both reach the alunos page

## 2. Aluno Listing Data

- [x] 2.1 Define aluno listing TypeScript types and an authenticated `GET /api/alunos` client using `credentials: 'include'`; verify it compiles without `any`
- [x] 2.2 Add MSW data/handler for the aluno list, including filterable active/inactive and objective examples; verify `npm run dev:mock` returns the expected list
- [x] 2.3 Handle loading, API error with retry, no alunos, and no filter results; verify each state renders safely

## 3. Alunos Page

- [x] 3.1 Replace the placeholder with an Alunos page matching the supplied dark/gold reference: heading, description, Novo aluno action, filters, and table container; verify visually in the browser
- [x] 3.2 Implement name/email search plus status and objective select filters; verify combined filters update the displayed rows
- [x] 3.3 Render table rows with initials, name/email, objective, level, latest workout, and status badge; verify API data maps to each column and the mobile layout remains readable
- [x] 3.4 Wire Novo aluno to `/criar-utilizador`; verify client-side navigation without a full page reload

## 4. Verification

- [x] 4.1 Verify the personal test user sees/uses Alunos and the aluno test user does not see the page in their menu
- [x] 4.2 Run build and lint; verify both pass
- [x] 4.3 Verify list loading/filtering/error/empty states against the real backend endpoint once the backend change is implemented

## 5. Route Authorization

- [x] 5.1 Add a client-side role guard to `/alunos` that renders a 403 access-denied page for authenticated aluno users before the listing request runs, and verify unauthenticated users go to `/login` while personal users retain access
