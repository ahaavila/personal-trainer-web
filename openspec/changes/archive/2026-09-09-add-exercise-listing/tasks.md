## 1. Exercise Data & Routing

- [x] 1.1 Add typed private exercise list client with credentialed `GET /api/exercicios`, and verify it has no personal ID input
- [x] 1.2 Replace the Exercícios placeholder with a personal-guarded exercise library route and a guarded `/novo-exercicio` placeholder, verifying aluno sees 403 on both
- [x] 1.3 Add MSW private exercise data/handler with examples across group and level, verifying mock personal receives list and aluno is forbidden

## 2. Exercise Library Page

- [x] 2.1 Build the reference-inspired exercise library shell: heading, description, Novo exercício action, search and filter controls, and card container
- [x] 2.2 Render exercise cards with muscle group, level, name, description, default sets, and default repetitions from API data
- [x] 2.3 Add client-side name search plus muscle-group/level filters and loading/error/retry/empty/no-results states, verifying combined filtering
- [x] 2.4 Wire Novo exercício to `/novo-exercicio` and verify client-side navigation

## 3. Verification

- [x] 3.1 Verify in mock mode that personal sees only their library and aluno receives 403
- [x] 3.2 Verify against real backend endpoint including empty/error states
- [x] 3.3 Run build and lint and verify both pass
