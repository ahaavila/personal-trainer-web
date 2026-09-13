## Context

The exercise library allows listing and creating private exercises. However, the existing exercise cards are static, preventing personal trainers from opening exercise details, modifying descriptions/prescriptions/media, or deleting exercises.

## Goals / Non-Goals

**Goals:**
- Make exercise cards interactive with hover states and click handlers to open exercise management.
- Provide a clean modal or detailed view allowing editing of all exercise fields (name, muscle group, equipment, level, description, default sets, default reps, and existing media).
- Provide a destructive deletion action with a clear confirmation dialog to prevent accidental removals.
- Handle API updates via `PUT /api/exercicios/:id` and deletion via `DELETE /api/exercicios/:id`, with automatic library refresh upon success.
- Maintain mock service worker (MSW) parity for offline/development testing.

**Non-Goals:**
- No bulk editing or bulk deleting of multiple exercises at once.
- No historical versioning of exercise changes.

## Decisions

- **Modal vs Dedicated Page**: Use an interactive Edit/Detail Modal on top of `/exercicios` to allow quick editing and immediate visual feedback without losing filter/search state on the library page.
- **Form Reuse / Consistency**: Align the edit form fields, validation limits, and design styles (dark theme, gold accents, clear error labels) with `NovoExercicioPage`.
- **Confirmation for Deletion**: Display an explicit confirmation prompt ("Tem certeza que deseja excluir este exercício?") before triggering `DELETE /api/exercicios/:id`.
- **Ownership & Privacy**: Frontend relies on credentialed session auth; backend guarantees that a personal trainer can only update or delete their own exercises (returning 404/403 for unauthorized attempts).

## Risks / Trade-offs

- [Risk] Deleting an exercise that is referenced in active training plans (`FichaDeTreino` / `TreinoExercicio`).
  → Mitigation: In the backend, handle foreign key constraints gracefully (e.g. restrict deletion if in use or cascade/detach appropriately), and return a clear user-friendly error message if deletion is blocked.
- [Risk] Losing unsaved edits if modal is closed accidentally.
  → Mitigation: Provide explicit Cancel/Close buttons and ensure backdrop click requires intentional dismissal or preserves state until confirmed.
