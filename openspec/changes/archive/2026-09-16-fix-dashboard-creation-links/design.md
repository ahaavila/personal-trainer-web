## Context

`PersonalDashboard` in `src/pages/DashboardPage.tsx` renders two quick-action links. Their visible labels correctly describe creation actions, but their `to` values currently lead to `/exercicios` and `/alunos`, rather than the existing creation routes.

## Goals / Non-Goals

**Goals:**
- Correct both quick-action destinations while preserving their labels, icons, styling, and client-side navigation behavior.
- Reuse the established routes already protected by the router: `/novo-exercicio` and `/criar-utilizador`.

**Non-Goals:**
- Changing dashboard layout, permissions, API requests, or the target form pages.
- Adding backend changes or new routes.

## Decisions

- Update only the `to` values in `PersonalDashboard`. The router already owns access control and both target routes already exist, so this is the smallest and most reliable correction.
- Do not redirect from the listing pages because their existing direct-access behavior remains valid; only the dashboard quick-action intent is incorrect.

## Risks / Trade-offs

- [Risk] Route paths could be renamed later -> Mitigation: validate the navigation against the existing router after the change.
