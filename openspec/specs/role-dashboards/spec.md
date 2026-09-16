## Purpose

Provides useful, role-specific dashboard experiences: a management overview for personal trainers and a focused training overview for alunos, backed by the dashboard APIs.

## Requirements

### Requirement: Personal dashboard overview
The system SHALL render a personal dashboard with a date greeting, quick actions, summary metrics, upcoming trainings, and a weekly evolution visualization using data from the personal dashboard endpoint. The "Novo exercício" quick action SHALL navigate directly to `/novo-exercicio`, and the "Adicionar aluno" quick action SHALL navigate directly to `/criar-utilizador`.

#### Scenario: Personal with dashboard data
- **WHEN** an authenticated personal opens the dashboard and the API returns data
- **THEN** the page displays summary cards for alunos, active alunos, exercises, and training plans; a list of upcoming trainings; and a weekly evolution visualization

#### Scenario: Personal opens the new exercise quick action
- **WHEN** an authenticated personal selects "Novo exercício" on the dashboard
- **THEN** the application navigates to `/novo-exercicio` without a full page reload

#### Scenario: Personal opens the new aluno quick action
- **WHEN** an authenticated personal selects "Adicionar aluno" on the dashboard
- **THEN** the application navigates to `/criar-utilizador` without a full page reload

#### Scenario: Personal without scheduled trainings
- **WHEN** the personal dashboard API returns no upcoming trainings
- **THEN** the dashboard displays the summary metrics and an intentional empty state for the upcoming trainings area

### Requirement: Aluno dashboard overview
The system SHALL render an aluno dashboard with the current training plan, next workouts, progress information, and a weekly activity summary using data from the aluno dashboard endpoint.

#### Scenario: Aluno with an active training plan
- **WHEN** an authenticated aluno opens the dashboard and the API returns an active plan
- **THEN** the page displays the current plan, next workouts, progress information, and weekly activity summary

#### Scenario: Aluno without an active plan
- **WHEN** the aluno dashboard API returns no active plan
- **THEN** the page displays an intentional empty state explaining that no current training plan is available

### Requirement: Dashboard loading and error states
The system SHALL show a loading state while dashboard data is being fetched and a recoverable error state when the request fails.

#### Scenario: Dashboard is loading
- **WHEN** an authenticated user enters the dashboard before the API response arrives
- **THEN** the page displays a loading state instead of blank or stale dashboard content

#### Scenario: Dashboard request fails
- **WHEN** the dashboard request returns an error or cannot be reached
- **THEN** the page displays an error message and a way to retry the request

### Requirement: Role-specific dashboard requests
The system SHALL request only the endpoint corresponding to the authenticated user's role: `/api/dashboard/personal` for personal and `/api/dashboard/aluno` for aluno.

#### Scenario: Personal request
- **WHEN** the authenticated user has role `personal`
- **THEN** the frontend requests the personal dashboard endpoint

#### Scenario: Aluno request
- **WHEN** the authenticated user has role `aluno`
- **THEN** the frontend requests the aluno dashboard endpoint
