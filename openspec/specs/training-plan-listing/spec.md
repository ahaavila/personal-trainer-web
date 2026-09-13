## Purpose

Enables personal trainers to browse, search, filter, and inspect all created training plans (fichas de treino) within the dedicated `/treinos` page.

## Requirements

### Requirement: Personal-only access to training plans listing
The system SHALL provide a dedicated training plans listing page at `/treinos` accessible exclusively to authenticated personal trainers.

#### Scenario: Personal views the training plans page
- **WHEN** an authenticated personal navigates to `/treinos`
- **THEN** the system displays the training plans listing page with search, status filters, and the "Nova ficha de treino" action

#### Scenario: Non-personal user attempts to access the page
- **WHEN** an unauthenticated user or an authenticated aluno navigates to `/treinos`
- **THEN** the system prevents access and redirects unauthenticated users to `/login` and non-personal users to the access denied page

### Requirement: Training plan overview and card display
The system SHALL display the list of training plans created by the personal trainer, rendering key metadata for each plan including title, student name and email, total number of divisions, total exercise count, status badge, and validity dates.

#### Scenario: Training plans rendered in listing
- **WHEN** training plans are loaded from `GET /api/fichas-de-treino`
- **THEN** the system renders a card for each plan showing its title, assigned student, number of workout divisions, total exercises, status, and creation/validity dates

#### Scenario: Empty training plans state
- **WHEN** the personal has not yet created any training plans
- **THEN** the system displays an empty state message with a direct link to create a new training plan

### Requirement: Real-time search and status filtering
The system SHALL allow personal trainers to filter the displayed training plans by searching text (matching plan title or student name) and selecting status filters (all, active, archived).

#### Scenario: Searching by plan title or student name
- **WHEN** the personal enters search terms in the search bar
- **THEN** the system filters the displayed list to only include plans whose title or student name/email matches the search term

#### Scenario: Filtering by status
- **WHEN** the personal selects a status filter option (e.g. "Ativos" or "Arquivados")
- **THEN** the system filters the displayed plans matching the selected status

#### Scenario: Search with no matches
- **WHEN** search criteria return zero matching plans
- **THEN** the system displays a "no results found" notice and prompts the user to adjust filters

### Requirement: Training plan details inspection
The system SHALL allow personal trainers to view the full breakdown of a training plan, including its workout divisions (Treino A, B...) and each division's prescribed exercises with sets, repetitions, rest interval, load, and notes.

#### Scenario: Personal inspects plan details
- **WHEN** the personal clicks on a plan card or selects "Ver detalhes"
- **THEN** the system displays the breakdown of all divisions and their respective exercise prescriptions

### Requirement: Personal can edit a training plan
The system SHALL allow personal trainers to edit an existing training plan from within the details modal, modifying its title, notes, dates, status, divisions, and exercise prescriptions, and submitting updates to `PUT /api/fichas-de-treino/:id`.

#### Scenario: Successful training plan update
- **WHEN** the personal updates plan fields or exercise prescriptions and clicks "Salvar Alterações"
- **THEN** the system sends a `PUT /api/fichas-de-treino/:id` request, updates the plan in the list, and displays a success notification

#### Scenario: Canceling edits
- **WHEN** the personal cancels editing mode without saving
- **THEN** the system discards changes and restores the previous plan view

### Requirement: Personal can delete a training plan
The system SHALL allow personal trainers to delete an existing training plan from within the details modal with explicit confirmation, submitting a `DELETE /api/fichas-de-treino/:id` request.

#### Scenario: Successful plan deletion
- **WHEN** the personal clicks "Excluir ficha", confirms the prompt, and deletion succeeds
- **THEN** the system deletes the plan via `DELETE /api/fichas-de-treino/:id`, closes the modal, removes the plan from the list, and displays a success notification

#### Scenario: Canceling plan deletion
- **WHEN** the personal clicks "Excluir ficha" but cancels the confirmation prompt
- **THEN** the system does not delete the plan and remains on the modal

### Requirement: Error handling and retry
The system SHALL display an error notice if loading training plans fails, and provide a retry button.

#### Scenario: Failed plans fetch
- **WHEN** the request to `GET /api/fichas-de-treino` fails
- **THEN** the system displays an error message with a retry button to reload the data
