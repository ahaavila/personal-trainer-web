## MODIFIED Requirements

### Requirement: Login screen visual design
The system SHALL render the login screen matching the provided design: a split layout with a decorative panel on one side and the form panel on the other, including branding, a functional "Lembrar de mim" checkbox, an "Esqueci minha senha" link, a "Continuar com Google" button, and a footer message directing users to contact their personal trainer. Secondary elements other than "Lembrar de mim" SHALL be rendered as static UI with no authentication or navigation behavior attached.

#### Scenario: Rendering the login screen
- **WHEN** a user opens the login route
- **THEN** the screen displays the branding, form, checkbox, links, and footer message matching the provided design

## ADDED Requirements

### Requirement: Remember me functionality
The system SHALL support remembering user credentials and extending session lifetime when "Lembrar de mim" is selected.

#### Scenario: Prefilling remembered email on load
- **WHEN** a user previously logged in with "Lembrar de mim" checked and visits `/login`
- **THEN** the email field is prefilled with the saved email and the "Lembrar de mim" checkbox is checked

#### Scenario: Persisting email on successful login
- **WHEN** a user submits the login form with "Lembrar de mim" checked and authentication succeeds
- **THEN** the system saves the email in local browser storage and sends `rememberMe: true` in the authentication request

#### Scenario: Clearing remembered email when unchecked
- **WHEN** a user submits the login form with "Lembrar de mim" unchecked and authentication succeeds
- **THEN** the system removes any previously stored email from local browser storage and sends `rememberMe: false` in the authentication request
