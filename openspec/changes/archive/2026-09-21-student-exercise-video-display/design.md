# Design: Student Exercise Video Display

## Architecture & Integration
1. **Ficha listing & inspection**:
   - Backend training plan queries (`list` and `findById`) include exercise media records and compute a `hasVideo` boolean flag.
   - Frontend `TrainingPlanDivisionExercise` interface includes `hasVideo?: boolean` and `media?: ExerciseMediaItem[]`.
   - Inspection table in `FichaTreinoAlunoPage` renders a "Vídeo" button only when `hasVideo` is true, otherwise rendering a dash (`—`).

2. **Active Workout Execution**:
   - In `ActiveWorkoutModal`, the header of each exercise card renders a video trigger button only when `hasVideo` is true.
   - Clicking the button opens `ExerciseMediaViewerModal` while the active timer continues running in the background.

3. **Media Viewer Component**:
   - `ExerciseMediaViewerModal`:
     - Checks if a media item already contains an active URL; if not, asynchronously calls `/api/exercicios/:id/media` to obtain a fresh presigned Cloudflare R2 URL.
     - Renders native `<video>` element with controls and fallback direct link in case embedded player playback encounters issues.
     - Supports closing on backdrop click, Escape key, or close button.

4. **Multi-tenant Backend Authorization**:
   - `GET /api/exercicios/:id/media` decorated with `@Roles('personal', 'aluno')`.
   - Personal can access their created exercises.
   - Student can access exercises belonging to their personal trainer or assigned to their training plans.
