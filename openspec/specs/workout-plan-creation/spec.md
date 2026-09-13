## Purpose

Allows personal trainers to create, structure, and assign personalized workout plans (fichas de treino) with multiple workout divisions and detailed exercise prescriptions to their students.

## Requirements

### Requirement: Personal-only access to workout plan creation
The system SHALL provide a dedicated workout plan creation route at `/nova-ficha-de-treino` accessible exclusively to authenticated personal trainers.

#### Scenario: Personal accesses the workout plan creation page
- **WHEN** an authenticated personal navigates to `/nova-ficha-de-treino`
- **THEN** the system displays the workout plan creation form with student selector, plan metadata fields, and workout division builder

#### Scenario: Non-personal user attempts to access the page
- **WHEN** an unauthenticated user or an authenticated aluno attempts to navigate to `/nova-ficha-de-treino`
- **THEN** the system prevents access and redirects unauthenticated users to `/login` and non-personal users to the access denied page

### Requirement: Student selection and plan metadata
The system SHALL allow the personal trainer to select a student from their active student list and specify general information about the training plan including title, observations, and optional date range.

#### Scenario: Personal selects a student and fills plan metadata
- **WHEN** the personal opens the student dropdown and selects a student and enters a title for the workout plan
- **THEN** the selected student and title are bound to the form state

#### Scenario: Submitting without student or plan title
- **WHEN** the personal attempts to submit the form without selecting a student or without providing a plan title
- **THEN** the system blocks submission and displays validation error messages highlighting the missing fields

### Requirement: Multi-division workout structure
The system SHALL allow the personal trainer to organize the workout plan into one or more named divisions (e.g., Treino A, Treino B) within the same plan.

#### Scenario: Adding multiple workout divisions
- **WHEN** the personal adds a new division to the workout plan
- **THEN** a new division card is created with its own name and exercise list

#### Scenario: Removing a workout division
- **WHEN** the personal removes a division from a plan that has multiple divisions
- **THEN** the division and all its associated exercise items are removed from the plan

### Requirement: Exercise prescription within workout divisions
The system SHALL allow the personal trainer to add exercises from their exercise library into any division and configure prescription parameters including sets, repetitions, rest interval, target load, and technical notes.

#### Scenario: Adding an exercise with default values
- **WHEN** the personal selects an exercise from the library picker to add to a division
- **THEN** the exercise is appended to the division with its default sets and reps pre-filled

#### Scenario: Customizing exercise prescription
- **WHEN** the personal adjusts sets, repetitions, rest interval, load, or notes for an exercise in a division
- **THEN** the modified values are preserved in the workout division state

#### Scenario: Removing an exercise from a division
- **WHEN** the personal deletes an exercise from a division
- **THEN** the exercise item is removed from that division's exercise list

### Requirement: Plan validation and submission
The system SHALL validate the entire workout plan structure and submit it to `POST /api/fichas-de-treino`, handling both successful creation and server-side errors.

#### Scenario: Successful workout plan creation
- **WHEN** the personal submits a valid form containing a student, plan title, at least one division, and at least one exercise per division with valid prescription parameters
- **THEN** the system sends a `POST /api/fichas-de-treino` request with credentials, shows a success feedback, and navigates to the workouts or students view

#### Scenario: Division without exercises prevents submission
- **WHEN** the personal attempts to submit a plan containing a division with zero exercises
- **THEN** the system blocks submission and displays a validation error indicating that every division must contain at least one exercise

#### Scenario: Server error response handling
- **WHEN** the API responds with an error status (e.g. 400 Bad Request or 403 Forbidden)
- **THEN** the system displays the server error message to the user without discarding entered form values
