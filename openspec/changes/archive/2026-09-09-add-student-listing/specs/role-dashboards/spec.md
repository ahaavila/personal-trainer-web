## MODIFIED Requirements

### Requirement: Personal dashboard overview
The system SHALL render a personal dashboard with a date greeting, quick actions, summary metrics, upcoming trainings, and a weekly evolution visualization using data from the personal dashboard endpoint.

#### Scenario: Personal with dashboard data
- **WHEN** an authenticated personal opens the dashboard and the API returns data
- **THEN** the page displays summary cards for alunos, active alunos, exercises, and training plans; a list of upcoming trainings; and a weekly evolution visualization

#### Scenario: Personal without scheduled trainings
- **WHEN** the personal dashboard API returns no upcoming trainings
- **THEN** the dashboard displays the summary metrics and an intentional empty state for the upcoming trainings area
