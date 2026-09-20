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
The system SHALL authenticate login attempts against a mocked API layer when mocking is enabled, since the real backend may not always be running locally. There SHALL be exactly two documented test credentials that succeed - one for a **personal** (trainer) user and one for an **aluno** (student) user - each associated with its user type. Any other non-empty email/password combination SHALL fail. An aluno whose account status is not `ativo` SHALL be denied even when the credentials are correct. Success SHALL be identified by the response containing the user's role and name; the response is not required to contain a token.

#### Scenario: Successful login as personal
- **WHEN** a user submits the login form with the documented personal test email and password
- **THEN** the system treats the login as successful, identifies the user as a personal, and navigates to the placeholder dashboard route

#### Scenario: Successful login as aluno
- **WHEN** a user submits the login form with the documented active aluno test email and password
- **THEN** the system treats the login as successful, identifies the user as an aluno, and navigates to the placeholder dashboard route

#### Scenario: Non-active aluno login is denied
- **WHEN** an aluno whose account status is not `ativo` submits correct credentials
- **THEN** the system keeps the user on the login screen, displays the access-denied message, and does not establish authenticated client state

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
The system SHALL render the login screen matching the provided design: a split layout with a decorative panel on one side and the form panel on the other, including branding, a functional "Lembrar de mim" checkbox, an active "Esqueci minha senha" navigation link, and a footer message directing users to contact their personal trainer. The "Esqueci minha senha" link SHALL navigate the user to `/esqueci-minha-senha`. The login screen SHALL NOT render a Google login button or divider. Secondary elements other than "Lembrar de mim" and "Esqueci minha senha" SHALL be rendered as static UI with no authentication or navigation behavior attached.

#### Scenario: Rendering the login screen
- **WHEN** a user opens the login route
- **THEN** the screen displays the branding, form, checkbox, links, and footer message, without rendering any Google login button or divider

#### Scenario: Clicking forgot password link
- **WHEN** a user clicks the "Esqueci minha senha" link on the login screen
- **THEN** the system navigates to the `/esqueci-minha-senha` route without a full page reload

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

### Requirement: Session recovery on load
The system SHALL check for an existing authenticated session when the app loads, before showing the login screen, so that a page reload does not force a user to log in again if their session is still valid. An aluno whose status is no longer `ativo` SHALL be treated as unauthenticated.

#### Scenario: Reloading with a valid session
- **WHEN** the app loads and the browser holds a valid session for a personal or active aluno
- **THEN** the system recognizes the user as authenticated (with their role and name) without requiring a new login, and does not display the login form to them

#### Scenario: Reloading after aluno deactivation
- **WHEN** the app loads and the browser holds a session for an aluno whose status is no longer `ativo`
- **THEN** the system clears authenticated client state and shows the login screen without exposing protected content

#### Scenario: Reloading with no valid session
- **WHEN** the app loads and there is no valid session
- **THEN** the system treats the user as not authenticated and shows the login screen when they navigate to `/login`

### Requirement: Logout ends the session
The system SHALL provide a way for an authenticated user to log out, ending their session.

#### Scenario: Logging out
- **WHEN** an authenticated user chooses to log out
- **THEN** the system ends the session, and a subsequent app load no longer recognizes the user as authenticated
