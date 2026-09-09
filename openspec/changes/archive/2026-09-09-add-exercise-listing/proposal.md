## Why

The personal navigation has an Exercícios placeholder, but personal trainers need a private exercise library to reuse when building training plans. The supplied design establishes a compact searchable card layout for that library.

## What Changes

- Replace the Exercícios placeholder with a personal-only private exercise library page matching the supplied design.
- Display cards containing muscle group, name, description, default sets, default repetitions, and level.
- Add client-side search plus muscle-group and level filters.
- Fetch only the authenticated personal's exercises from a new `GET /api/exercicios` endpoint.
- Add loading, error/retry, empty-library, and no-results states.
- Add a "Novo exercício" action that navigates to a placeholder creation route; creating/editing exercises is out of scope for this change.
- Deny aluno access to the exercises route with the existing 403 route experience.

## Capabilities

### New Capabilities
- `exercise-library`: Personal-only exercise library listing with search and filters.

### Modified Capabilities
- `training-domain`: Exercise records gain default prescription and display fields required by the library.

## Impact

- Affected frontend: `/exercicios`, dashboard quick action, mock handlers, new exercise client/types/page/styles.
- Affected backend: Exercicio schema migration, private list endpoint, seed and tests.
- No exercise data is shared between personals, and no aluno can access the library.
