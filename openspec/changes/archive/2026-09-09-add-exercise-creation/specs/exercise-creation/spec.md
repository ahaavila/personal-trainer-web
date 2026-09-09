## Purpose

Provides a personal-only form for creating private exercises with default prescription data and optional execution photo/video for the personal's own library.

## ADDED Requirements

### Requirement: Personal can create an exercise
The system SHALL provide a personal-only new exercise form accepting name, muscle group, optional equipment, level, description, default sets, and default repetitions.

#### Scenario: Successful exercise creation
- **WHEN** an authenticated personal submits valid exercise details
- **THEN** the system creates the exercise and navigates to the personal's exercise library where it appears

#### Scenario: Invalid exercise data
- **WHEN** a personal submits missing or invalid required details
- **THEN** the system shows field-level validation errors and does not create the exercise

### Requirement: Personal can attach optional execution media
The system SHALL allow a personal to select an optional execution photo and/or video for a new exercise when media upload is enabled.

#### Scenario: Supported media upload
- **WHEN** a personal selects a supported photo or video within its size limit and submits a valid exercise
- **THEN** the system uploads the selected media and associates it with the created exercise

#### Scenario: Unsupported media upload
- **WHEN** a personal selects an unsupported media type or a file exceeding its size limit
- **THEN** the system shows a validation error and does not upload that file

#### Scenario: Media upload is unavailable
- **WHEN** media upload is disabled by the deployment configuration
- **THEN** the form indicates media is unavailable while still allowing an exercise without media to be created

### Requirement: Aluno access to creation is denied
The system SHALL deny an authenticated aluno access to the new exercise route.

#### Scenario: Aluno opens new exercise route
- **WHEN** an authenticated aluno navigates to `/novo-exercicio`
- **THEN** the system displays a 403 access-denied page and does not submit or upload exercise data
