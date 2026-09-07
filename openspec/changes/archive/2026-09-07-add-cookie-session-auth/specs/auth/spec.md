## MODIFIED Requirements

### Requirement: Mocked authentication flow
The system SHALL authenticate login attempts against a mocked API layer when mocking is enabled, since the real backend may not always be running locally. There SHALL be exactly two documented test credentials that succeed - one for a **personal** (trainer) user and one for an **aluno** (student) user - each associated with its user type. Any other non-empty email/password combination SHALL fail. Success SHALL be identified by the response containing the user's role and name; the response is not required to contain a token.

#### Scenario: Successful login as personal
- **WHEN** a user submits the login form with the documented personal test email and password
- **THEN** the system treats the login as successful, identifies the user as a personal, and navigates to the placeholder dashboard route

#### Scenario: Successful login as aluno
- **WHEN** a user submits the login form with the documented aluno test email and password
- **THEN** the system treats the login as successful, identifies the user as an aluno, and navigates to the placeholder dashboard route

#### Scenario: Failed login with other credentials
- **WHEN** a user submits the login form with a non-empty email and password that do not match either test credential
- **THEN** the system displays a login error message and remains on the login screen

## ADDED Requirements

### Requirement: Session recovery on load
The system SHALL check for an existing authenticated session when the app loads, before showing the login screen, so that a page reload does not force a user to log in again if their session is still valid.

#### Scenario: Reloading with a valid session
- **WHEN** the app loads and the browser holds a valid session
- **THEN** the system recognizes the user as authenticated (with their role and name) without requiring a new login, and does not display the login form to them

#### Scenario: Reloading with no valid session
- **WHEN** the app loads and there is no valid session
- **THEN** the system treats the user as not authenticated and shows the login screen when they navigate to `/login`

### Requirement: Logout ends the session
The system SHALL provide a way for an authenticated user to log out, ending their session.

#### Scenario: Logging out
- **WHEN** an authenticated user chooses to log out
- **THEN** the system ends the session, and a subsequent app load no longer recognizes the user as authenticated
