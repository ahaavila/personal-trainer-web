## Purpose

Provides a personal-only form that creates an aluno account, assigns it to the creating personal, and returns the personal to their updated aluno roster.

## Requirements

### Requirement: Personal can create an aluno
The system SHALL provide a personal-only new aluno form accepting name, email, objective, and level, and SHALL NOT require or display fields for a temporary password or password confirmation. The system SHALL inform the trainer that an invitation email will be dispatched to the student to establish their password.

#### Scenario: Successful aluno creation
- **WHEN** an authenticated personal submits valid new aluno details (name, valid email, objective, and level)
- **THEN** the system creates the aluno, confirms success, and navigates to the alunos list where the new aluno appears

#### Scenario: Missing or invalid form data
- **WHEN** a personal submits missing required fields or an invalid email format
- **THEN** the system shows field-level validation errors and does not submit the request

### Requirement: Creation errors are recoverable
The system SHALL show an API creation error without discarding the personal's entered form values.

#### Scenario: Duplicate email
- **WHEN** a personal submits an email already used by an account
- **THEN** the system shows an error explaining that the email is unavailable and retains the form values

### Requirement: Only personal can access creation
The system SHALL deny an authenticated aluno access to the new aluno route before rendering the creation form.

#### Scenario: Aluno opens the creation route
- **WHEN** an authenticated aluno navigates directly to `/criar-utilizador`
- **THEN** the system displays a 403 access-denied page and does not request aluno creation
