## ADDED Requirements

### Requirement: Top application header with user profile menu
The system SHALL display a persistent top application header in the main authenticated layout, containing a search input and a user profile button with an interactive dropdown menu in the upper-right corner.

#### Scenario: User views the application header
- **WHEN** an authenticated personal trainer or student views any authenticated page
- **THEN** the system displays the top header containing a search input placeholder and a user profile trigger showing the user's name, role title ("Personal Trainer" or "Aluno"), avatar or initials, and a dropdown caret

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
