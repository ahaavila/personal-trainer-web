## Why

The exercise creation flow already validates local file selection, but it never actually uploads the file anywhere. As a result, users can select a photo or video, create an exercise, and still see nothing in Cloudflare R2. Personal trainers need a secure, private media flow that preserves the exercise library without exposing bucket secrets to the browser.

## What Changes

- Add a secure signed-upload path for optional exercise photo/video files, using Cloudflare R2 through the backend rather than exposing credentials to the frontend.
- Update the frontend exercise creation flow to request signed URLs, upload selected media directly to R2, and associate the stored asset with the new exercise record.
- Keep exercise creation working when R2 is disabled by allowing media-free exercises without failing submission.
- Enforce validation and privacy rules: allowed file types, size limits, authenticated personal ownership, and no user-controlled owner or bucket key fields.

## Capabilities

### New Capabilities
- `exercise-media-upload`: Secure direct upload of optional exercise photo/video files to private Cloudflare R2 storage, tied to the authenticated personal owner.

### Modified Capabilities
- None

## Impact

- Frontend: exercise form uploads real media when enabled, shows explicit success/error feedback, and falls back cleanly when the backend disables R2.
- Backend: signed URL issuance, media validation, bucket configuration, file association metadata, and private ownership checks.
- Storage: Cloudflare R2 private bucket integration via S3-compatible signed uploads, with no public URLs or secrets exposed to the browser.
- Security: authenticated personal-only access, no owner override from client input, and resource checks that prevent cross-person access to media or signed URLs.
