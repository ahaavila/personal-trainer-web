## Context

The `/clientes` route is currently a generic placeholder. The sidebar and dashboard currently expose "Clientes" in the personal experience. The backend counterpart will expose a scoped aluno list; current frontend has no reusable table/filter primitives.

## Goals / Non-Goals

**Goals:**
- Rename all product-facing personal terminology from Clientes to Alunos and `/clientes` to `/alunos`.
- Build the reference-inspired alunos page with accessible search/select filters, table, status badge, avatar initials, and all loading/error/empty/no-results states.
- Keep filtering responsive by applying it client-side over the fetched list; backend filters remain supported for future pagination/server-side scale.

**Non-Goals:**
- No aluno profile/detail page or inline editing.
- No functional user creation; Novo aluno routes to `/criar-utilizador`.
- No pagination until list sizes require it.

## Decisions

- **Canonical route `/alunos`**: removes the product concept "cliente" rather than merely changing labels. Existing `/clientes` will redirect to `/alunos` as a short compatibility path during the transition.
- **Role guard at the route boundary**: wrap `/alunos` in a reusable `RequireRole` component. Users without a session continue through the existing `AppLayout` redirect to `/login`; authenticated alunos receive an explicit 403 view before `AlunosPage` mounts or makes its API request. The backend's existing role guard remains the security authority.
- **Fetch once, filter locally**: the first list is small and this gives immediate filter response. API types preserve filter fields so a future pagination change can send filters to the server without redesigning the UI.
- **Table fields follow the reference**: Aluno (name/email/initials), Objetivo, Nível, Último treino, Estado. Objective/level are displayed as the API returns them; state uses a compact active/inactive badge.
- **Visual system**: reuse the dashboard/sidebar dark surface, gold accents and Lucide icons; no design-system dependency.

## Risks / Trade-offs

- [Risk] Local filtering becomes costly for large personal rosters → Mitigation: backend supports equivalent filters and future pagination can move filtering server-side.
- [Risk] Renaming `/clientes` can break saved links → Mitigation: retain a redirect route for this first transition.
