## Context

The current `DashboardPage` only renders a greeting and an instruction to select a sidebar item. The role-aware sidebar is already implemented, and `AuthContext` exposes the authenticated role/name. The backend counterpart will provide two role-specific HTTP endpoints.

## Goals / Non-Goals

**Goals:**
- Build a polished personal dashboard closely following the supplied reference: dark surface, warm gold accent, metric cards, upcoming-training list, quick actions, and a weekly bar visualization.
- Build an aluno-specific variant using the same visual system but focusing on training plan/progress instead of management metrics.
- Keep dashboard fetching isolated in a small API client and make loading/error/empty states explicit.

**Non-Goals:**
- No CRUD actions from the dashboard quick-action buttons; they navigate to existing placeholder routes only.
- No new chart dependency; the weekly visualization is a small accessible CSS-based bar chart.
- No changes to sidebar navigation or authentication.

## Decisions

- **Role switch at the page boundary**: `DashboardPage` selects a personal or aluno dashboard component from `AuthContext.user.role`, while both variants share primitives for metric cards, section headers, empty states, and loading/error states.
- **Single request per dashboard entry**: fetch the relevant endpoint on mount and expose a retry action on failure. Avoid polling or websocket behavior until the domain workflows require it.
- **CSS bars for weekly evolution**: the chart only needs five to seven labeled values and does not need axes, zoom, or tooltips yet. CSS bars keep bundle size and interaction complexity low; a chart library can be introduced later if analytics become richer.
- **Quick actions remain route links**: personal actions link to `/exercicios` and `/clientes`, matching the current navigation routes; no mutation is implied by the dashboard.
- **Date greeting uses the browser locale**: format the current date in Portuguese with `Intl.DateTimeFormat('pt-PT'/'pt-BR')` rather than hardcoding the screenshot date.

## Risks / Trade-offs

- [Risk] The backend may return empty domain data during early testing → Mitigation: every list and metric area has a designed empty/zero state.
- [Risk] Dashboard data shape can evolve while domain endpoints are still being built → Mitigation: keep the frontend API types local to the dashboard client and version the backend contract before expanding it.
