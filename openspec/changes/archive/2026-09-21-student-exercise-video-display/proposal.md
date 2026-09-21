# Proposal: Student Exercise Video Display

## Problem
When students view their training plan (`/ficha-de-treino-atual`) or execute a workout in real time (`ActiveWorkoutModal`), they could not view exercise demonstration videos uploaded by their personal trainer. In addition, when videos were associated with exercises, no indicator or playback modal was offered in the student interface, and the backend restricted media access strictly to trainers.

## Proposed Solution
- Add video demonstration button only for exercises that possess an instructional video (`hasVideo: true` or media item with `kind: 'video'`).
- Display a dash (`—`) when no video exists for an exercise.
- Implement `ExerciseMediaViewerModal` with responsive HTML5 video player and captions track support, fetching secure presigned URLs on demand if not pre-populated.
- Update backend fichas listing/detail endpoints to return `hasVideo` and `media` metadata.
- Permit authenticated students to access `/api/exercicios/:id/media` for exercises that belong to their trainer or are assigned to their training plans.

## User Value
Students can now confidently check proper form and exercise execution technique directly from their workout overview and while performing their sets.
