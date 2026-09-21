## MODIFIED Requirements

### Requirement: Training plan inspection and division breakdown
The system SHALL allow students to open and inspect a training plan to view its workout divisions (e.g. Treino A, Treino B) and each division's prescribed exercises, target sets, repetitions, rest interval, notes, and instructional demonstration video when available.

#### Scenario: Student opens a training plan
- **WHEN** a student clicks the action to view an assigned training plan
- **THEN** the system displays the plan's divisions and their prescribed exercises, with an "Iniciar Treino" button for each division

#### Scenario: Student views exercise with instructional video in inspection modal
- **WHEN** a student inspects a division containing an exercise that has an instructional video
- **THEN** the system displays a "Vídeo" button in the exercise row
- **AND** clicking the button opens the media viewer modal playing the exercise video demonstration

#### Scenario: Student views exercise without video in inspection modal
- **WHEN** a student inspects a division containing an exercise with no video uploaded
- **THEN** the system displays a dash (`—`) in place of the video action button

### Requirement: Exercise set tracking with prescribed reference
The system SHALL display each exercise in the active workout with the prescribed number of sets, providing input fields for the student to record the actual weight (kg) and repetitions performed on each set, alongside the trainer's prescribed values as visual reference and access to exercise demonstration videos.

#### Scenario: Recording load and reps for a set
- **WHEN** a student enters their actual load and completed repetitions for a set
- **THEN** the system stores the values for that set and marks the set as completed

#### Scenario: Viewing prescribed reference targets
- **WHEN** a student views an exercise during an active workout
- **THEN** the system displays the target sets, reps (e.g. "8 a 12"), and target load prescribed by the personal trainer as a guide

#### Scenario: Viewing exercise video during active workout execution
- **WHEN** a student performs an exercise with an associated video during an active workout session
- **THEN** the exercise card header shows a "Vídeo" button
- **AND** clicking the button opens the media viewer modal without interrupting or resetting the active workout timer

#### Scenario: Exercise without video during active workout execution
- **WHEN** an exercise has no demonstration video attached
- **THEN** no video action button is shown in the active workout exercise header
