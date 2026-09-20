## MODIFIED Requirements

### Requirement: Role-based navigation menu
The system SHALL display a side navigation menu to authenticated users, showing exactly the menu items appropriate to their role, in a fixed order.

#### Scenario: Personal sees the personal menu
- **WHEN** an authenticated personal views any authenticated page
- **THEN** the side navigation shows, in order: Dashboard, Alunos, Exercícios, Nova Ficha de Treino, Treinos, Evolução dos Alunos, Meu Perfil, Criar utilizador

#### Scenario: Aluno sees the aluno menu
- **WHEN** an authenticated aluno views any authenticated page
- **THEN** the side navigation shows, in order: Dashboard, Ficha de Treino Atual, Treinos, Meu Perfil
