## Context

See `proposal.md` for background and motivation.
Currently, `AppLayout.tsx` wraps child route components directly in `.app-shell__content` without an application-wide header. User profile info and logout functionality were only accessible through the sidebar.

## Goals / Non-Goals

**Goals:**
- Provide a persistent top application bar (`app-header`) that spans the content area next to the sidebar.
- Display a search box with placeholder "Pesquisar clientes ou exercícios..." matching the design mockup.
- Render the user summary on the right with avatar image (or initials badge), user name, role subtitle ("Personal Trainer" or "Aluno"), and caret icon.
- Implement a dropdown menu with 2 distinct actions:
  1. "Ver o meu perfil" (navigates to `/meu-perfil`).
  2. "Sair" (calls `logout()`, clears user context, navigates to `/login`).
- Ensure full keyboard and outside-click accessibility (e.g. clicking outside or pressing Escape closes the dropdown).

**Non-Goals:**
- Full backend-powered global search engine implementation (search bar input will be visual/functional client-side without changing other routes).
- Redesigning the sidebar navigation menu or deleting existing routes.

## Decisions

1. **Header placement in `AppLayout`**:
   - Wrap the content section in a vertical layout (`.app-main`), composed of `.app-header` at the top and `.app-content` beneath it holding the `<Outlet />`.
   - *Alternative considered*: Putting the header inside each individual page. Rejected because it would duplicate header markup across 10+ pages and cause layout jumps on navigation.

2. **Avatar resolution**:
   - Check `user?.email` against local storage key `fitforge:avatar:${user.email}` or profile details to display the uploaded photo if present, with fallback to 2-letter uppercase initials on a circular badge matching the design in `MeuPerfilPage`.

3. **Dropdown menu state & accessibility**:
   - Use standard React state (`isUserMenuOpen`) with a ref attached to the user menu container.
   - Attach a document mousedown event listener and Escape key handler to automatically dismiss the dropdown on outside clicks.
   - Use semantic button and links with `role="menu"` and `aria-expanded`.

## Risks / Trade-offs

- [Risk] Layout width and z-index overlap with modals or fixed page elements.  
  → Mitigation: Use proper z-index layering (`z-index: 100` for header, below overlay modals which use 1000+) and sticky/flex positioning.
