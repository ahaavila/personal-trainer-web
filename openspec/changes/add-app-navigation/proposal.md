## Why

The app currently only has a login screen and a single dashboard page listing static section names with no navigation. To start building out the personal trainer's and aluno's real pages, the app needs a persistent side navigation menu with role-appropriate items and routes, so each future feature (Clientes, Exercícios, Treinos, etc.) has a place to live.

## What Changes

- Add a persistent left sidebar navigation menu, visible on all authenticated pages.
- The menu shows role-appropriate items in a fixed order:
  - **Personal**: Dashboard, Clientes, Exercícios, Nova Ficha de Treino, Treinos, Meu Perfil, Criar utilizador.
  - **Aluno**: Dashboard, Ficha de Treino Atual, Treinos, Meu Perfil.
- Add a client-side route for each menu item, rendering a placeholder ("em construção") page for items that don't have a real page yet. Real functionality for each page is out of scope for this change and will be built in follow-up changes.
- The existing `/dashboard` route becomes the "Dashboard" menu item; its current placeholder content (role-based section list) is replaced by the new navigation structure.
- Menu items are shown/hidden based on the authenticated user's role entirely on the client; there is no server-side route protection in this change (matches the existing `auth` capability's Non-Goals).

## Capabilities

### New Capabilities
- `app-navigation`: Persistent role-based side navigation and the routes/placeholder pages it links to.

### Modified Capabilities
<!-- none -->

## Impact

- Affected code: `src/router.tsx` (new routes), a new layout component wrapping authenticated pages with the sidebar, `src/pages/DashboardPage.tsx` (simplified now that sections aren't ad-hoc), new placeholder page components.
- No new dependencies expected (uses the existing `react-router` setup).
- Depends on the backend's `add-training-domain-models` change only in the sense that future changes building out each real page (Clientes, Exercícios, etc.) will depend on it - this change itself does not call any new backend endpoint.
