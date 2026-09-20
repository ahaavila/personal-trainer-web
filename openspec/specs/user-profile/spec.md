## Purpose

Allows authenticated users (personal trainers and students) to review and edit their profile details and change their account password.

## Requirements

### Requirement: View profile information
The system SHALL display the authenticated user's profile details on `/meu-perfil`, including their avatar (or initials placeholder), role badge, name, email address, and, if the user is a student, their training objective and experience level.

#### Scenario: Personal views profile
- **WHEN** an authenticated personal trainer opens `/meu-perfil`
- **THEN** the system displays their account details, avatar (or initials if none), role badge "Personal Trainer", name, and email

#### Scenario: Student views profile
- **WHEN** an authenticated student opens `/meu-perfil`
- **THEN** the system displays their account details, avatar (or initials if none), role badge "Aluno", name, email, training objective, and experience level

### Requirement: Update profile details
The system SHALL allow authenticated users to edit and save their profile details, including updating their name, uploading or removing their avatar photo (supporting image formats up to 5MB with immediate preview), and updating objective/level for students.

#### Scenario: Personal updates profile name
- **WHEN** an authenticated personal submits an updated name
- **THEN** the system persists the updated name, reflects the new name in the navigation header, and displays a success feedback message

#### Scenario: User updates profile avatar photo
- **WHEN** an authenticated user selects an image file for their avatar
- **THEN** the system displays a preview, validates the file format and size, persists the avatar upon save, and updates the avatar display across the interface

#### Scenario: User removes profile avatar photo
- **WHEN** an authenticated user with an existing avatar chooses to remove their photo
- **THEN** the system resets the avatar to the initials placeholder upon save

#### Scenario: Student updates profile name and fitness profile
- **WHEN** an authenticated student submits updated name, objective, or level
- **THEN** the system persists the changes and displays a success confirmation message

#### Scenario: Validation errors on empty name
- **WHEN** a user clears the name field and attempts to save
- **THEN** the system displays a validation error and does not submit the update

### Requirement: Change account password
The system SHALL allow authenticated users to change their password on `/meu-perfil` by providing their current password, a new password, and confirmation of the new password.

#### Scenario: Successfully changing password
- **WHEN** a user enters their correct current password, a valid new password (at least 6 characters), and a matching confirmation
- **THEN** the system updates the password, clears the sensitive fields, and shows a success confirmation message

#### Scenario: Incorrect current password
- **WHEN** a user submits an incorrect current password
- **THEN** the system displays an error message indicating that the current password is invalid

#### Scenario: Mismatched or short new password
- **WHEN** a user submits a new password under 6 characters or where confirmation does not match
- **THEN** the system displays field validation errors and does not make an API request
