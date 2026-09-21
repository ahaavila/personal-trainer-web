## Purpose

Provides the persistent, role-aware side navigation that lets an authenticated personal or aluno move between the app's pages, and the placeholder routes those menu items link to until each page's real functionality is built.

## Requirements

### Requirement: Role-based navigation menu
The system SHALL display a side navigation menu to authenticated users, showing exactly the menu items appropriate to their role, in a fixed order.

#### Scenario: Personal sees the personal menu
- **WHEN** an authenticated personal views any authenticated page
- **THEN** the side navigation shows, in order: Dashboard, Alunos, Exercícios, Nova Ficha de Treino, Treinos, Evolução dos Alunos, Meu Perfil, Criar utilizador

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

### Requirement: Top application header with user profile menu
The system SHALL display a persistent top application header in the main authenticated layout, containing a search input for personal trainers and a user profile button with an interactive dropdown menu in the upper-right corner.

#### Scenario: Personal views the application header
- **WHEN** an authenticated personal trainer views any authenticated page
- **THEN** the system displays the top header containing a search input placeholder and a user profile trigger showing the user's name, role title ("Personal Trainer"), avatar or initials, and a dropdown caret

#### Scenario: Aluno views the application header
- **WHEN** an authenticated aluno views any authenticated page
- **THEN** the system displays the top header without the search input, showing the user profile trigger with name, role title ("Aluno"), avatar or initials, and a dropdown caret

#### Scenario: Opening the user profile menu
- **WHEN** the user clicks the profile button in the top header
- **THEN** the system toggles open a dropdown menu presenting the options "Ver o meu perfil" and "Sair"

#### Scenario: Selecting "Ver o meu perfil"
- **WHEN** the user opens the user menu and clicks "Ver o meu perfil"
- **THEN** the system closes the dropdown menu and navigates to `/meu-perfil`

#### Scenario: Selecting "Sair"
- **WHEN** the user opens the user menu and clicks "Sair"
- **THEN** the system terminates the session, clears user state, and redirects the user to `/login`

#### Scenario: Closing the user menu on outside click or escape
- **WHEN** the user menu is open and the user clicks outside the menu or presses the Escape key
- **THEN** the system closes the dropdown menu without performing any navigation or action

### Requirement: Dynamic brand logo and theme colors in application shell
The system SHALL dynamically render the personal trainer's custom brand logo in place of the default logo mark, and inject the customized primary and background colors into the root document styling for both the PRO trainer and their assigned students.

#### Scenario: PRO trainer views customized app shell
- **WHEN** a PRO personal trainer with configured custom branding loads any authenticated page
- **THEN** the sidebar displays their custom brand logo mark and the application theme adopts their chosen primary and background colors

#### Scenario: Student views trainer customized app shell
- **WHEN** an authenticated student whose personal trainer is on Plano PRO and has configured custom branding logs in
- **THEN** the student's navigation shell displays the personal trainer's custom logo and adopts the trainer's custom theme colors

#### Scenario: Default branding fallback
- **WHEN** a trainer has not set custom branding, or is on Plano Básico
- **THEN** the application shell displays the standard FitManager Pro dumbbell logo and default dark-and-gold color theme
