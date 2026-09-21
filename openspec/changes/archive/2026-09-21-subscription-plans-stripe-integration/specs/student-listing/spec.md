## MODIFIED Requirements

### Requirement: Personal can view assigned alunos
The system SHALL provide an alunos page for authenticated personal users, listing only the alunos assigned to that personal, along with an active student quota indicator reflecting their current subscription plan.

#### Scenario: Personal opens the alunos page
- **WHEN** an authenticated personal opens the alunos page
- **THEN** the system displays each assigned aluno's name, email, objective, level, latest workout, status, and an action to toggle status (Ativar / Desativar)
- **AND** displays the quota of active students (e.g. "3/5 alunos ativos no Plano Básico")

#### Scenario: No alunos are assigned
- **WHEN** the personal has no assigned alunos
- **THEN** the system displays an intentional empty state instead of an empty/broken table

### Requirement: New aluno action navigates to creation
The system SHALL provide a "Novo aluno" action on the alunos page that opens the functional aluno creation form, or displays an upgrade prompt if the personal is on Plano Básico and has already reached 5 active students.

#### Scenario: Selecting Novo aluno with available quota
- **WHEN** a personal with available quota selects "Novo aluno"
- **THEN** the system navigates to `/criar-utilizador` without a full page reload and displays the new aluno form

#### Scenario: Selecting Novo aluno when quota is reached
- **WHEN** a personal on Plano Básico with 5 active students selects "Novo aluno"
- **THEN** the system informs the user that the Plano Básico limit of 5 active students has been reached and offers a direct action to upgrade to Plano PRO
