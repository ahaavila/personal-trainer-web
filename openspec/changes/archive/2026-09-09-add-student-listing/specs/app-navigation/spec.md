## MODIFIED Requirements

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
