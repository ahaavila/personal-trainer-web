## MODIFIED Requirements

### Requirement: New aluno action navigates to creation
The system SHALL provide a "Novo aluno" action on the alunos page that opens the functional aluno creation form.

#### Scenario: Selecting Novo aluno
- **WHEN** a personal selects "Novo aluno"
- **THEN** the system navigates to `/criar-utilizador` without a full page reload and displays the new aluno form

#### Scenario: Returning after creation
- **WHEN** a personal successfully creates an aluno
- **THEN** the system navigates to the alunos list and the newly created aluno is present
