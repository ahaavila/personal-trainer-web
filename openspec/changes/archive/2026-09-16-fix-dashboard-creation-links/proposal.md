## Why

The personal dashboard exposes quick actions named "Novo exercício" and "Adicionar aluno", but both currently navigate to their respective listing pages instead of the creation forms. This adds an unnecessary extra step to two frequent workflows.

## What Changes

- Update the personal dashboard's "Novo exercício" quick action to navigate directly to `/novo-exercicio`.
- Update the personal dashboard's "Adicionar aluno" quick action to navigate directly to `/criar-utilizador`.
- Preserve the existing personal-only dashboard access and the visual presentation of both actions.

## Capabilities

### New Capabilities
<!-- No new capabilities. -->

### Modified Capabilities
- `role-dashboards`: Personal dashboard quick actions route users to their corresponding creation forms.

## Impact

- Frontend only: `src/pages/DashboardPage.tsx`.
- No API, data model, backend, or dependency changes.
