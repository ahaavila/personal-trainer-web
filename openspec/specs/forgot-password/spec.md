## Purpose

Allows users to recover access to their accounts through a self-service password reset flow, requesting a recovery link and establishing a new password.

## Requirements

### Requirement: Password recovery request form
The system SHALL provide a dedicated route at `/esqueci-minha-senha` displaying a recovery request form with an email input field, a submission button, and a link to return to `/login`.

#### Scenario: Submitting with empty email
- **WHEN** a user submits the password recovery request form with an empty email
- **THEN** the system displays a validation error indicating that email is required and does not make an API request

#### Scenario: Submitting with invalid email format
- **WHEN** a user submits the password recovery request form with an invalid email format
- **THEN** the system displays a validation error indicating an invalid email format and does not make an API request

#### Scenario: Successful recovery request submission
- **WHEN** a user submits a valid email address on `/esqueci-minha-senha`
- **THEN** the system sends a recovery request to `/api/auth/forgot-password`, displays a confirmation message informing that recovery instructions were generated, and presents a simulated reset link for development/testing

#### Scenario: Navigating back to login
- **WHEN** a user clicks the back or return to login link on `/esqueci-minha-senha`
- **THEN** the system navigates back to `/login` without a full page reload

### Requirement: Reset password form and token validation
The system SHALL provide a dedicated route at `/redefinir-senha` that reads a `token` query parameter from the URL and presents a password reset form if the token is present and valid.

#### Scenario: Accessing reset page without token
- **WHEN** a user navigates to `/redefinir-senha` without a `token` parameter in the URL
- **THEN** the system displays an invalid or missing token message and provides a link to request a new recovery link

#### Scenario: Accessing reset page with invalid token
- **WHEN** a user navigates to `/redefinir-senha` with an expired or unrecognized token
- **THEN** the system displays an error message indicating the token is invalid and provides a link to request a new recovery link

#### Scenario: Accessing reset page with valid token
- **WHEN** a user navigates to `/redefinir-senha` with a valid token
- **THEN** the system displays a form with new password and password confirmation fields

### Requirement: Password update submission
The system SHALL validate the new password inputs and submit the password update when the form on `/redefinir-senha` is submitted.

#### Scenario: Submitting with empty or non-matching passwords
- **WHEN** a user submits the reset password form with empty fields or when the password confirmation does not match the new password
- **THEN** the system displays a validation error and does not send a reset request

#### Scenario: Submitting with short password
- **WHEN** a user submits a new password with fewer than 6 characters
- **THEN** the system displays a validation error indicating that the password must have at least 6 characters

#### Scenario: Successful password reset
- **WHEN** a user submits matching valid passwords with a valid reset token
- **THEN** the system sends a reset request to `/api/auth/reset-password`, displays a success confirmation message, and provides a button to navigate to `/login`

#### Scenario: Failed password reset
- **WHEN** the reset request fails due to an API or server error
- **THEN** the system displays an error message and keeps the user on the reset screen

### Requirement: Mocked password recovery flow
The system SHALL simulate password recovery and password reset endpoints via the mock API layer (MSW) when mocking is enabled.

#### Scenario: Mocked forgot-password request
- **WHEN** a request is sent to `POST /api/auth/forgot-password` with an email
- **THEN** the mock API returns a 200 OK response with a success message, a simulated reset token, and a simulated recovery URL

#### Scenario: Mocked reset-password request
- **WHEN** a request is sent to `POST /api/auth/reset-password` with a valid token and new password
- **THEN** the mock API updates the mock user's password in memory and returns a 200 OK response allowing the user to log in with the new password
