## 1. Type Definitions & API Client

- [x] 1.1 Update `CreateAlunoInput` in `src/alunos/types.ts` to remove the `password` property and verify compilation via `npm run build`
- [x] 1.2 Update `createAluno` in `src/alunos/api.ts` to pass the updated payload and verify request handling

## 2. Form Refactoring & Messaging

- [x] 2.1 Refactor `NovoAlunoPage.tsx` to remove password fields, password confirmation, toggles, and validations, updating form header/description to indicate that an invite email is sent to the student; verify form rendering and clean validation
- [x] 2.2 Clean up unused CSS in `NovoAlunoPage.css` related to password inputs and toggles, verifying page styling and layout

## 3. MSW Mock Handler & Flow Verification

- [x] 3.1 Update `POST /api/alunos` handler in `src/mocks/handlers.ts` to handle passwordless aluno creation and generate an activation reset token in `RESET_TOKENS`, verifying mock creation
- [x] 3.2 Verify the full flow: personal creates aluno on `/criar-utilizador` without entering password, aluno appears in `/alunos` list, and student can set password via the simulated recovery link
