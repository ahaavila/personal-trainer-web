## Why

The exercise library already exposes a "Novo exercício" action, but it currently leads to a placeholder. Personal trainers need to add movements to their own private libraries, including default prescription fields and optional execution media required for the MVP.

## What Changes

- Replace `/novo-exercicio` with a personal-only exercise creation form matching the supplied design.
- Collect name, muscle group, optional equipment, level, description, default sets, default repetitions, and optional execution photo/video.
- Create the exercise through `POST /api/exercicios`; the backend assigns ownership from the authenticated personal, never from frontend input.
- Support optional direct uploads to Cloudflare R2 using backend-issued signed URLs when `R2_ENABLED=true`; keep the creation flow working with media disabled when it is false.
- Validate files before upload: photo JPEG/PNG/WebP up to 10 MB, video MP4/WebM up to 100 MB.
- On success, navigate to `/exercicios` and show the new private exercise in the creator's library.

## Capabilities

### New Capabilities
- `exercise-creation`: Personal-only exercise creation form with optional photo/video execution media.

### Modified Capabilities
- `exercise-library`: Newly created exercises appear only in their creator's private library.

## Impact

- Frontend: functional `/novo-exercicio` form, upload client/UI, MSW parity, list refresh.
- Backend: `POST /api/exercicios`, exercise media metadata, R2 signed upload endpoints/configuration, migration, tests.
- Exercises and all related media stay private to the creating personal; other personals receive no list, direct-resource, or signed-upload/download access.
