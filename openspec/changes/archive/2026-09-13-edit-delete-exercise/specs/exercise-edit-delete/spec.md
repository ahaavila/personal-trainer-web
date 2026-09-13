## Purpose

Allows personal trainers to view full exercise details, update prescription parameters or execution media, and delete exercises from their library with confirmation.

## ADDED Requirements

### Requirement: Personal can view exercise details
The system SHALL allow an authenticated personal user to view the full details and execution media of any exercise in their private library.

#### Scenario: Opening an exercise
- **WHEN** a personal selects an exercise from the library
- **THEN** the system displays the exercise name, muscle group, equipment, level, description, default sets, default repetitions, and execution media

#### Scenario: Aluno or unauthorized personal accesses exercise details
- **WHEN** an unauthenticated user, an aluno, or a personal who does not own the exercise tries to view it
- **THEN** the system denies access and does not expose the exercise data

### Requirement: Personal can edit an exercise
The system SHALL allow an authenticated personal to update details, default prescriptions, and optional media of an exercise they own.

#### Scenario: Saving valid exercise changes
- **WHEN** a personal updates the fields of an exercise with valid data and confirms save
- **THEN** the system saves the modifications, updates the library view, and displays a success feedback

#### Scenario: Submitting invalid edit data
- **WHEN** a personal clears required fields or enters invalid sets/reps
- **THEN** the system displays validation errors and prevents saving

### Requirement: Personal can delete an exercise with confirmation
The system SHALL allow an authenticated personal to permanently delete an exercise they own after explicit user confirmation.

#### Scenario: Confirming exercise deletion
- **WHEN** a personal requests to delete an exercise and confirms the prompt
- **THEN** the system deletes the exercise, removes it from the library list, and displays confirmation feedback

#### Scenario: Canceling exercise deletion
- **WHEN** a personal opens the delete confirmation and cancels
- **THEN** the exercise is not deleted and remains in the library
