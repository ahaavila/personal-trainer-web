## Why

Currently, the application layout only contains a sidebar navigation and lacks an application header (topbar). Users have to rely on sidebar links for profile navigation and a bottom sidebar button for logout. Adding the application header with a global search bar and a user profile dropdown menu creates a modern, consistent layout matching the platform design, allowing quick access to "Meu Perfil" and "Sair" directly from the top-right user menu.

## What Changes

- Add a top application header (`app-header`) in the main layout (`AppLayout`), visible across all authenticated screens.
- Include a global search input ("Pesquisar clientes ou exercícios...") in the header.
- Include a user profile menu button in the top right displaying the user's avatar (or initials placeholder), name, and role badge ("Personal Trainer" or "Aluno"), along with a dropdown caret.
- Clicking the user profile button opens an accessible dropdown menu with 2 options:
  1. **Ver o meu perfil**: navigates to `/meu-perfil`.
  2. **Sair**: terminates the session via `logout()`, clears client state, and redirects to `/login`.
- Close the dropdown menu automatically when clicking outside or pressing Escape, or upon selecting an option.

## Capabilities

### Modified Capabilities
- `app-navigation`: Adds the top application header and the user profile dropdown menu with "Ver o meu perfil" and "Sair" actions.

## Impact

- `src/layouts/AppLayout.tsx`: Updated to integrate the top header alongside the main content outlet.
- `src/layouts/AppLayout.css`: Styles for top header, search box, user avatar, and dropdown menu.
- Specs: `openspec/specs/app-navigation/spec.md` updated with the top header and user menu requirements.
