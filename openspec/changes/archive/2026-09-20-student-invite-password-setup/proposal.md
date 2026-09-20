## Why

Currently, Personal Trainers must define temporary passwords when registering new students, which creates friction, security vulnerabilities (shared/weak passwords), and administrative overhead. By replacing manual password creation with an automated email invitation, students can choose their own passwords securely during account activation.

## What Changes

- Remove temporary password and password confirmation fields from the student creation form (`/criar-utilizador`).
- Update the student creation form copy to explain that an invitation email with instructions to define a password will be dispatched to the student's email.
- Update `CreateAlunoInput` and the API client function to no longer require or transmit a password when creating a student.
- Update the MSW mock handlers for student creation to register students with pending password setup and provide a simulated activation/setup link for development and testing.

## Capabilities

### New Capabilities
<!-- No new standalone capabilities; modifications apply to existing student-creation capability -->

### Modified Capabilities
- `student-creation`: Updates `Requirement: Personal can create an aluno` so the creation form accepts name, email, objective, and level, without requiring or accepting a trainer-defined password.

## Impact

- **UI & Pages**: `src/pages/NovoAlunoPage.tsx` and `src/pages/NovoAlunoPage.css` remove password inputs, toggles, and validations.
- **Data Models**: `src/alunos/types.ts` updates `CreateAlunoInput` to remove the `password` property.
- **API & Mocking**: `src/alunos/api.ts` and `src/mocks/handlers.ts` handle student creation without password inputs and return simulated activation link info in development.
