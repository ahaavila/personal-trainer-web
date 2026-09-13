## MODIFIED Requirements

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
