## Why

The authenticated app currently lands on a minimal welcome page, while the provided reference shows a useful daily overview for a personal trainer. The dashboard should become the first real product surface: a clear, data-rich summary for personals and a focused training summary for alunos, with the UI prepared to consume role-specific backend data.

## What Changes

- Replace the current dashboard placeholder with a personal dashboard matching the reference direction: date greeting, quick actions, summary cards, upcoming trainings, and a weekly evolution visualization.
- Add an aluno dashboard variant focused on the current training plan, next workouts, progress, and a concise weekly summary rather than personal-management metrics.
- Fetch dashboard data from the role-specific backend endpoints `/api/dashboard/personal` and `/api/dashboard/aluno`.
- Add loading, empty, and error states so the dashboard remains usable while data is loading or when there are no scheduled trainings.
- Keep the existing role-based sidebar and navigation unchanged.

## Capabilities

### New Capabilities
- `role-dashboards`: Role-specific personal and aluno dashboard experiences backed by dashboard API data.

### Modified Capabilities
<!-- none -->

## Impact

- Affected code: `src/pages/DashboardPage.tsx`, dashboard-specific components/styles, and a new dashboard API client module.
- Affected dependencies: no new dependency required; the weekly chart can be implemented with accessible CSS/SVG primitives already available in the project rather than introducing a chart library.
- Depends on the backend change `add-dashboard-endpoints`, which will provide the two role-specific payloads.
