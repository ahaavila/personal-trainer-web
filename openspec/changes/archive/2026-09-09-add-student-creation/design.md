## Context

`/criar-utilizador` is currently a placeholder route, and `/alunos` already contains a personal-only list. The backend counterpart adds `POST /api/alunos`, backed by existing User fields and the existing cookie session.

## Goals / Non-Goals

**Goals:**
- Replace the placeholder with a focused, personal-only aluno creation form consistent with the dark/gold application style.
- Validate input locally, submit one credentialed request, and preserve form state on server errors.
- Return the personal to the list after success.

**Non-Goals:**
- No email invitation, generated password, self-signup, editing, password reset, or multi-step wizard.
- No manual personal selection; the server assigns ownership from the authenticated session.

## Decisions

- **Fields**: name, email, temporary password, confirmation, objective and level. Status is not shown because the server sets it to active.
- **Shared role guard**: reuse `RequireRole role="personal"` from the aluno listing to protect `/criar-utilizador`.
- **Password behavior**: require a minimum of eight characters and matching confirmation; use a password input with show/hide control only if it fits the established UI primitives.
- **Success behavior**: show a brief success feedback, then navigate to `/alunos`; a full list refetch ensures the created row appears.
- **Mock parity**: MSW keeps an in-memory list, appends valid created alunos, and returns a conflict for duplicate email.

## Risks / Trade-offs

- [Risk] A personal must share a temporary password manually → Mitigation: explicitly label it as temporary in the form; invitation workflow remains future work.
- [Risk] Browser refresh loses mock-created alunos → Mitigation: expected for mock mode; real backend persists them.
