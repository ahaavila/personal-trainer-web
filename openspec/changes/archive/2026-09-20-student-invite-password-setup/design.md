## Context

Currently, `NovoAlunoPage.tsx` forces personal trainers to enter and confirm a temporary password when registering an aluno. See `proposal.md` for motivation and `specs/student-creation/spec.md` for requirement changes.

## Goals / Non-Goals

**Goals:**
- Streamline the student creation form in `NovoAlunoPage.tsx` by eliminating password and password confirmation inputs.
- Inform trainers clearly that the student will receive an invitation email containing a secure link to define their initial password.
- Align `CreateAlunoInput` and the mock API handler with passwordless creation.
- Wire MSW mock handler to register the newly created student with an initial password setup token (leveraging the password recovery / setup mechanism), providing a simulated activation link in development.

**Non-Goals:**
- Changing existing student listing fields or student dashboard layouts.
- Implementing backend changes in this repository (the corresponding backend change will be tracked in `personal-trainer-backend`).

## Decisions

### 1. Form simplification and updated copy
- **Choice**: Remove password state, toggles, and validations from `NovoAlunoPage.tsx`. Retain name, email, training objective, and experience level.
- **Rationale**: Faster registration workflow for trainers and zero-knowledge security (trainer never knows or chooses the student's password).
- **Copy**: Section header updated to explain: *"Enviaremos um convite por e-mail para que o aluno crie a sua senha de acesso."*

### 2. Integration with MSW and setup token simulation
- **Choice**: When `POST /api/alunos` is called in MSW mock mode, generate an activation token in `RESET_TOKENS` and return a simulated setup URL (e.g. `/redefinir-senha?token=...`), registering the student with initial status `ativo`.
- **Rationale**: Allows immediate, realistic end-to-end testing in development where the developer can register a student and use the simulated link to set the student's password.

## Risks / Trade-offs

- **[Risk: Breaking backend contract if backend still requires `password`]** → *Mitigation*: Ensure the companion backend change in `personal-trainer-backend` updates `CreateAlunoDto` to remove the password requirement in tandem.
