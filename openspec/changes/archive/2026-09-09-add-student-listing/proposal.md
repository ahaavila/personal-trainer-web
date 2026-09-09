## Why

The personal navigation currently has a placeholder "Clientes" page, while the personal needs a usable overview of the alunos they manage. The provided design establishes the desired page: a dark, compact student table with search, status/objective filters, and a clear action to start creating a new aluno.

## What Changes

- Replace the personal-only "Clientes" menu item, label, route, dashboard metrics, and visible copy with the canonical term "Alunos".
- Add an `/alunos` page for personal users, matching the supplied design: title/description, search input, status and objective filters, a table of assigned alunos, and an empty state.
- The table presents each aluno's name/email, objective, level, latest workout, and status.
- Add client-side filtering by name/email, status, and objective against the fetched list.
- Add a "Novo aluno" action that navigates to the existing `/criar-utilizador` placeholder; functional user creation remains out of scope.
- Fetch list data only from the new authenticated backend aluno-listing endpoint; include loading, error/retry, and no-results states.
- Prevent an authenticated aluno from accessing `/alunos` directly: show a client-side 403 access-denied page while the backend remains the authoritative data protection layer.

## Capabilities

### New Capabilities
- `student-listing`: Personal-facing aluno list with filtering, table states, and navigation to user creation.

### Modified Capabilities
- `app-navigation`: Rename the personal navigation item and its route from Clientes to Alunos.
- `role-dashboards`: Rename personal dashboard cards, metrics, and quick action language from Clientes to Alunos.

## Impact

- Affected code: navigation/menu data, router path, dashboard copy/types/API normalization, new aluno-listing page and API client.
- Affected backend contract: consumes `GET /api/alunos` implemented in the companion backend change.
- No user-creation request is made by this change; `/criar-utilizador` remains a placeholder.
