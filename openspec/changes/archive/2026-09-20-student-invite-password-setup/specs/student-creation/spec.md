## MODIFIED Requirements

### Requirement: Personal can create an aluno
The system SHALL provide a personal-only new aluno form accepting name, email, objective, and level, and SHALL NOT require or display fields for a temporary password or password confirmation. The system SHALL inform the trainer that an invitation email will be dispatched to the student to establish their password.

#### Scenario: Successful aluno creation
- **WHEN** an authenticated personal submits valid new aluno details (name, valid email, objective, and level)
- **THEN** the system creates the aluno, confirms success, and navigates to the alunos list where the new aluno appears

#### Scenario: Missing or invalid form data
- **WHEN** a personal submits missing required fields or an invalid email format
- **THEN** the system shows field-level validation errors and does not submit the request
