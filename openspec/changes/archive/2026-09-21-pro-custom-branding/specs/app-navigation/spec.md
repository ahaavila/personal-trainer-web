## ADDED Requirements

### Requirement: Dynamic brand logo and theme colors in application shell
The system SHALL dynamically render the personal trainer's custom brand logo in place of the default logo mark, and inject the customized primary and background colors into the root document styling for both the PRO trainer and their assigned students.

#### Scenario: PRO trainer views customized app shell
- **WHEN** a PRO personal trainer with configured custom branding loads any authenticated page
- **THEN** the sidebar displays their custom brand logo mark and the application theme adopts their chosen primary and background colors

#### Scenario: Student views trainer customized app shell
- **WHEN** an authenticated student whose personal trainer is on Plano PRO and has configured custom branding logs in
- **THEN** the student's navigation shell displays the personal trainer's custom logo and adopts the trainer's custom theme colors

#### Scenario: Default branding fallback
- **WHEN** a trainer has not set custom branding, or is on Plano Básico
- **THEN** the application shell displays the standard FitManager Pro dumbbell logo and default dark-and-gold color theme
