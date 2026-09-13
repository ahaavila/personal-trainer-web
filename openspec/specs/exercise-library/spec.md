## Purpose

Provides a personal-only private library of exercises with search and filters, helping personal trainers find default movements while building future training plans.

## Requirements

### Requirement: Personal can view private exercises
The system SHALL provide an exercises page for authenticated personal users, displaying only exercises belonging to that personal, and allowing the user to select an exercise to inspect or edit it.

#### Scenario: Personal opens the exercise library
- **WHEN** an authenticated personal opens the exercises page
- **THEN** the system displays cards with each exercise's muscle group, name, description, default sets, default repetitions, and level

#### Scenario: Library is empty
- **WHEN** the personal has no exercises
- **THEN** the system displays an intentional empty state

#### Scenario: Newly created exercise appears in library
- **WHEN** a personal creates an exercise and returns to the exercise library
- **THEN** the new exercise appears only in that personal's library

#### Scenario: Selecting an exercise card
- **WHEN** a personal clicks on an exercise card in the library
- **THEN** the system opens the exercise details and edit view

### Requirement: Personal can filter exercises
The system SHALL allow a personal to filter loaded exercises by name search, muscle group, and level.

#### Scenario: Combined filters
- **WHEN** a personal selects one or more filters and/or enters a search term
- **THEN** only exercises matching all active filters are displayed

#### Scenario: No matched exercises
- **WHEN** active filters match no exercises
- **THEN** the system displays a no-results state

### Requirement: Aluno access to exercises is denied
The system SHALL deny an authenticated aluno access to the exercises route.

#### Scenario: Aluno opens exercises directly
- **WHEN** an authenticated aluno navigates to `/exercicios`
- **THEN** the system displays a 403 access-denied page and does not request exercise data

### Requirement: New exercise action is available
The system SHALL display a "Novo exercício" action on the exercise library.

#### Scenario: Selecting Novo exercício
- **WHEN** a personal selects "Novo exercício"
- **THEN** the system navigates to the exercise creation placeholder without a full page reload
