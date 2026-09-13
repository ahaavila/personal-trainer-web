## Why

Personal trainers need the ability to inspect, edit, and delete exercises directly from their private library. Currently, exercise cards are static and do not allow viewing details, updating prescription parameters/media, or removing obsolete exercises.

## What Changes

- Make exercise cards in the library clickable to open an exercise details/edit modal or view.
- Enable editing exercise fields (name, muscle group, equipment, level, description, default sets, default repetitions, and optional media).
- Support saving changes via `PUT /api/exercicios/:id` (or `PATCH /api/exercicios/:id`).
- Support deleting an exercise via `DELETE /api/exercicios/:id` with a confirmation dialog before removal.
- Ensure only the personal trainer who created the exercise can edit or delete it.
- Update the exercise library view dynamically after an edit or deletion.

## Capabilities

### New Capabilities
- `exercise-edit-delete`: View details, edit exercise attributes/prescriptions, and delete exercises with confirmation.

### Modified Capabilities
- `exercise-library`: Exercise cards are interactive and open the exercise detail/edit interface on click.

## Impact

- Frontend: clickable exercise cards in `ExerciciosPage`, edit/details modal or page with pre-filled form, delete confirmation modal, API integration with `PUT/DELETE` endpoints, and MSW handlers updated.
- Backend / API: endpoints for `GET /api/exercicios/:id`, `PUT /api/exercicios/:id` (update), and `DELETE /api/exercicios/:id` (delete) ensuring strict ownership validation.
