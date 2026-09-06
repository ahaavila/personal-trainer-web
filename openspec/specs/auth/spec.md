## Purpose

Provides the login screen users see before entering the app, including form validation and a mocked authentication flow that stands in for the real backend until it exists.

## Requirements

### Requirement: Login form with validation
The system SHALL display a login form with email and password fields, and SHALL validate that both fields are non-empty before attempting authentication.

#### Scenario: Submitting with empty fields
- **WHEN** a user submits the login form with an empty email or password
- **THEN** the system displays a validation error for each empty field and does not attempt authentication

#### Scenario: Submitting with both fields filled
- **WHEN** a user submits the login form with a non-empty email and password
- **THEN** the system attempts authentication using the entered credentials

### Requirement: Mocked authentication flow
The system SHALL authenticate login attempts against a mocked API layer, since no real backend exists yet. There SHALL be exactly two documented test credentials that succeed - one for a **personal** (trainer) user and one for an **aluno** (student) user - each associated with its user type. Any other non-empty email/password combination SHALL fail.

#### Scenario: Successful login as personal
- **WHEN** a user submits the login form with the documented personal test email and password
- **THEN** the system treats the login as successful, identifies the user as a personal, and navigates to the placeholder dashboard route

#### Scenario: Successful login as aluno
- **WHEN** a user submits the login form with the documented aluno test email and password
- **THEN** the system treats the login as successful, identifies the user as an aluno, and navigates to the placeholder dashboard route

#### Scenario: Failed login with other credentials
- **WHEN** a user submits the login form with a non-empty email and password that do not match either test credential
- **THEN** the system displays a login error message and remains on the login screen

### Requirement: Post-login navigation
The system SHALL provide a placeholder dashboard route that a successful login navigates to, and SHALL render the dashboard content appropriate to the authenticated user's type: the personal dashboard SHALL list more placeholder sections than the aluno dashboard.

#### Scenario: Reaching the dashboard after login
- **WHEN** a login attempt succeeds
- **THEN** the browser navigates to the dashboard route without a full page reload

#### Scenario: Personal sees more dashboard sections than aluno
- **WHEN** a personal user and an aluno user each reach the dashboard
- **THEN** the personal dashboard displays more placeholder sections than the aluno dashboard

### Requirement: Login screen visual design
The system SHALL render the login screen matching the provided design: a split layout with a decorative panel on one side and the form panel on the other, including branding, a "Lembrar de mim" checkbox, an "Esqueci minha senha" link, a "Continuar com Google" button, and a footer message directing users to contact their personal trainer. These secondary elements SHALL be rendered as static UI in this change, with no authentication or navigation behavior attached.

#### Scenario: Rendering the login screen
- **WHEN** a user opens the login route
- **THEN** the screen displays the branding, form, checkbox, links, and footer message matching the provided design, and clicking the secondary elements has no effect
