## Purpose

Provides the persistent, role-aware side navigation that lets an authenticated personal or aluno move between the app's pages, and the placeholder routes those menu items link to until each page's real functionality is built.

## Requirements

### Requirement: Role-based navigation menu
The system SHALL display a side navigation menu to authenticated users, showing exactly the menu items appropriate to their role, in a fixed order.

#### Scenario: Personal sees the personal menu
- **WHEN** an authenticated personal views any authenticated page
- **THEN** the side navigation shows, in order: Dashboard, Alunos, Exercícios, Nova Ficha de Treino, Treinos, Meu Perfil, Criar utilizador

#### Scenario: Aluno sees the aluno menu
- **WHEN** an authenticated aluno views any authenticated page
- **THEN** the side navigation shows, in order: Dashboard, Ficha de Treino Atual, Treinos, Meu Perfil

### Requirement: Navigation routes to a page per menu item
The system SHALL provide a route for each menu item that navigates to it without a full page reload, and SHALL visually indicate which item corresponds to the current page.

#### Scenario: Selecting a menu item
- **WHEN** an authenticated user selects a menu item
- **THEN** the system navigates to that item's route without a full page reload, and the menu indicates that item as the current page

### Requirement: Placeholder pages for unbuilt features
The system SHALL render a placeholder page for any menu item whose real functionality has not been built yet, clearly indicating the feature is not yet available.

#### Scenario: Visiting an unbuilt page
- **WHEN** an authenticated user navigates to a menu item that has no real page built yet
- **THEN** the system displays a placeholder page indicating the feature is coming soon, without erroring

### Requirement: Menu visibility is client-side only
The system SHALL determine which menu items to show based on the authenticated user's role known to the client, without requiring a server round-trip beyond the existing session check.

#### Scenario: Menu renders immediately after session recovery
- **WHEN** the app finishes recovering the user's session on load
- **THEN** the side navigation renders the correct role-based items without an additional loading step
