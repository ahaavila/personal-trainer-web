## 1. Menu Data & Layout Shell

- [ ] 1.1 Define the personal and aluno menu item lists (label + route path, in the exact specified order) in a single source of truth (e.g. `src/navigation/menuItems.ts`), and verify both lists match the proposal's order exactly
- [ ] 1.2 Create an `AppLayout` component with a sidebar and an outlet for the current page, and verify it renders without errors when given a role and children

## 2. Sidebar Navigation

- [ ] 2.1 Build the sidebar UI rendering the current user's role-appropriate menu items with links, and verify personal and aluno each see their own item list in the correct order
- [ ] 2.2 Highlight the menu item matching the current route, and verify it updates when navigating between items without a full page reload
- [ ] 2.3 Move the logout action into the sidebar (available on every authenticated page), and verify it still ends the session and navigates to `/login`

## 3. Routes & Placeholder Pages

- [ ] 3.1 Add a shared placeholder page component (e.g. `ComingSoonPage`) accepting a title, and verify it renders the given title with a "coming soon" message
- [ ] 3.2 Add routes for all personal-only items (Clientes, Exercícios, Nova Ficha de Treino, Treinos, Criar utilizador) rendering the placeholder page, wrapped in `AppLayout`, and verify each is reachable via the sidebar
- [ ] 3.3 Add routes for all aluno-only items (Ficha de Treino Atual, Treinos, Meu Perfil) rendering the placeholder page, wrapped in `AppLayout`, and verify each is reachable via the sidebar
- [ ] 3.4 Add a shared "Meu Perfil" route usable by both roles (placeholder for now), and verify it's reachable from both role menus
- [ ] 3.5 Update `/dashboard` to render inside `AppLayout` and remove the old hardcoded per-role section list, and verify the dashboard still shows a welcome message

## 4. Verification

- [ ] 4.1 Manually verify, logged in as the personal test user, that all 7 personal menu items are visible in the specified order and each navigates correctly
- [ ] 4.2 Manually verify, logged in as the aluno test user, that all 4 aluno menu items are visible in the specified order and each navigates correctly
