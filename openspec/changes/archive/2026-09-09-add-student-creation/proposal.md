## Why

The Alunos page now has a "Novo aluno" action but it only leads to a placeholder. A personal needs to create an aluno account directly, define its initial temporary password, and have that aluno automatically appear in the personal's roster.

## What Changes

- Replace the `/criar-utilizador` placeholder with a personal-only "Novo aluno" form.
- Collect the aluno's name, email, temporary password, objective, and level.
- Validate required fields and password confirmation before submitting.
- Send the form to `POST /api/alunos` with cookie credentials.
- On success, show confirmation and navigate to `/alunos`, where the new aluno appears.
- Display server validation errors (including duplicate email) without losing the entered form values.

## Capabilities

### New Capabilities
- `student-creation`: Personal-facing form flow to create an aluno account.

### Modified Capabilities
- `student-listing`: The Novo aluno action now opens a functional creation flow and newly created alunos appear in the list.

## Impact

- Affected code: `/criar-utilizador` route, new form/API client, aluno list refresh behavior and MSW mocks.
- Depends on the backend `add-student-creation-api` change and reuses cookie session auth.
- No email invitation or password recovery is included; the personal distributes the temporary password outside the app.
