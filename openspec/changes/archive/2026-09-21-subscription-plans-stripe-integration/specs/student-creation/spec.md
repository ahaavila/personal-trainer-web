## MODIFIED Requirements

### Requirement: Personal can create an aluno
The system SHALL provide a personal-only new aluno form accepting name, email, objective, and level, and SHALL NOT require or display fields for a temporary password or password confirmation. The system SHALL inform the trainer that an invitation email will be dispatched to the student to establish their password. The system SHALL enforce active student quota limits according to the personal trainer's subscription plan.

#### Scenario: Successful aluno creation within quota
- **WHEN** an authenticated personal with available active student capacity submits valid new aluno details
- **THEN** the system creates the aluno, confirms success, and navigates to the alunos list where the new aluno appears

#### Scenario: Aluno creation blocked when reaching Basic plan quota
- **WHEN** a personal on Plano Básico who already has 5 active students attempts to create an aluno
- **THEN** the system denies creation with a subscription quota error
- **AND** displays an upgrade prompt inviting the personal trainer to subscribe to Plano PRO for unlimited students

#### Scenario: Missing or invalid form data
- **WHEN** a personal submits missing required fields or an invalid email format
- **THEN** the system shows field-level validation errors and does not submit the request

### Requirement: Only personal can access creation
The system SHALL deny an authenticated aluno access to the new aluno route before rendering the creation form.

#### Scenario: Aluno opens the creation route
- **WHEN** an authenticated aluno navigates directly to `/criar-utilizador`
- **THEN** the system displays a 403 access-denied page and does not request aluno creation
