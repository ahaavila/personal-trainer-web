## Context

`/exercicios` currently renders `ComingSoonPage`. The existing role guard already provides the correct 403 UX. The dashboard already links its action to `/exercicios`. The backend counterpart will return a personal-scoped list with the card data shown in the reference.

## Goals / Non-Goals

**Goals:**
- Build the supplied dark/gold exercise-library visual direction using reusable card/filter patterns already present in Alunos.
- Fetch once, then filter locally by search, muscle group and level.
- Protect the route with the existing personal guard.

**Non-Goals:**
- No exercise create/edit/delete UI or API calls; Novo exercício routes to a placeholder.
- No pagination, global/shared exercise catalog, images, or videos.

## Decisions

- **Private data endpoint**: `GET /api/exercicios` with credentials; the frontend never sends a personal owner ID.
- **Card layout**: cards preserve the reference fields: group pill, title, description, and two compact default prescription cells. Level is included in the group/metadata area.
- **Filter options from loaded data**: derive unique muscle groups/levels from the API list, avoiding duplicated frontend enums.
- **Creation placeholder path**: use `/novo-exercicio`, guarded for personal, until a dedicated creation change replaces it.

## Risks / Trade-offs

- [Risk] local filtering does not scale indefinitely → Mitigation: backend supports matching filters so future pagination can move work server-side.
- [Risk] defaults could be mistaken for prescriptions → Mitigation: label them as defaults; future plan assembly explicitly may override them.
