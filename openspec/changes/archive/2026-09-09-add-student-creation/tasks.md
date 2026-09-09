## 1. Creation API Client & Routing

- [x] 1.1 Add typed `POST /api/alunos` client using `credentials: 'include'`, and verify request/response types contain no owner/role/status input fields
- [x] 1.2 Replace the `/criar-utilizador` placeholder with a personal-only route guarded by the existing role guard, and verify aluno receives the 403 page while personal can access the form
- [x] 1.3 Add an MSW creation handler that appends valid alunos, rejects duplicate email, and mirrors the real safe response shape; verify list data includes a mock-created aluno

## 2. New Aluno Form

- [x] 2.1 Build the reference-consistent Novo aluno form with name, email, temporary password, confirmation, objective, and level fields; verify all inputs are accessible and rendered
- [x] 2.2 Add client-side required/email/password-length/confirmation validation; verify invalid submission makes no API request and shows field errors
- [x] 2.3 Submit valid fields to the API, show submitting/success/error feedback, preserve values after server errors, and verify duplicate email handling
- [x] 2.4 On successful creation, navigate to `/alunos` and verify the newly created aluno appears after list refetch

## 3. Verification

- [x] 3.1 Verify personal creation against `npm run dev:mock`, including successful create and duplicate-email error
- [x] 3.2 Verify personal creation against the real backend, including automatic personal ownership, initial active status, and aluno login with temporary password
- [x] 3.3 Run build and lint; verify both pass
