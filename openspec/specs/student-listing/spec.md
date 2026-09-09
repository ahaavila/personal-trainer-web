## Purpose

Provides a personal-facing table of assigned alunos, with search and filters that make it possible to find and review student training status quickly.

## Requirements

### Requirement: Personal can view assigned alunos
The system SHALL provide an alunos page for authenticated personal users, listing only the alunos assigned to that personal.

#### Scenario: Personal opens the alunos page
- **WHEN** an authenticated personal opens the alunos page
- **THEN** the system displays each assigned aluno's name, email, objective, level, latest workout, and status

#### Scenario: No alunos are assigned
- **WHEN** the personal has no assigned alunos
- **THEN** the system displays an intentional empty state instead of an empty/broken table

### Requirement: Aluno access to the listing is denied
The system SHALL deny an authenticated aluno access to the alunos route before loading the listing data.

#### Scenario: Aluno opens the alunos route directly
- **WHEN** an authenticated aluno navigates directly to `/alunos`
- **THEN** the system displays a 403 access-denied page and does not request the aluno listing endpoint

#### Scenario: Unauthenticated user opens the alunos route
- **WHEN** a user without an authenticated session navigates to `/alunos`
- **THEN** the system redirects the user to `/login`

### Requirement: Personal can filter alunos
The system SHALL allow a personal to filter the displayed alunos by name/email search, status, and objective.

#### Scenario: Searching by name or email
- **WHEN** the personal enters part of an aluno name or email
- **THEN** only alunos matching that text are displayed

#### Scenario: Filtering by status and objective
- **WHEN** the personal selects a status and/or objective filter
- **THEN** only alunos matching all selected filters are displayed

#### Scenario: No alunos match filters
- **WHEN** the active filters match no alunos
- **THEN** the system displays a no-results state

### Requirement: New aluno action navigates to creation
The system SHALL provide a "Novo aluno" action on the alunos page.

#### Scenario: Selecting Novo aluno
- **WHEN** a personal selects "Novo aluno"
- **THEN** the system navigates to `/criar-utilizador` without a full page reload
