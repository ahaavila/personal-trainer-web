## Context

The app already supports personal-only exercise creation and listing. The remaining gap is that the frontend validates selected local files but never performs the real direct-upload flow to Cloudflare R2, so the selected asset never reaches storage even though the form appears to work.

## Goals / Non-Goals

**Goals:**
- Issue signed upload URLs from the backend for valid exercise media.
- Upload files directly from the browser to R2 without exposing secrets.
- Keep media tied to the authenticated personal and private to that user's library.
- Preserve exercise creation when R2 is disabled.

**Non-Goals:**
- No media editing, replacement, thumbnail generation, or transcoding.
- No public bucket access or direct browser-to-bucket credentials.
- No upload progress persistence across sessions.

## Decisions

- **Backend-issued signed URLs**: the backend generates short-lived upload URLs to the private bucket and enforces ownership and file policy. This avoids leaking Cloudflare credentials and centralizes authorization.
- **Two-step upload flow**: validate form -> create exercise metadata -> request signed URL(s) -> upload file(s) directly -> confirm attachment metadata. This keeps the exercise record consistent and lets the user continue even when media is optional.
- **Capability gate**: the frontend checks the backend capability/config flag before exposing the media upload UI, instead of hard-coding R2 assumptions from environment strings alone.
- **Client-side validation remains**: the browser still rejects unsupported types and oversized files early, but backend validation remains authoritative for security.
- **Privacy via ownership enforcement**: all signed upload and media access paths are scoped to the authenticated personal and checked against the exercise's owner before the storage request is accepted.

## Risks / Trade-offs

- [Risk] Upload and metadata creation can become inconsistent if the file upload fails after the exercise record is created → Mitigation: keep media as optional and surface clear error feedback without claiming success.
- [Risk] Bucket configuration drift may cause production upload failures → Mitigation: use environment-guarded configuration and a clear `R2_ENABLED=false` fallback for development/offline scenarios.
- [Risk] File validation in browser and backend can disagree → Mitigation: enforce the same type and size rules in both layers and keep backend rules authoritative.

## Migration Plan

1. Add the backend signed-upload endpoint and R2 configuration support behind the existing auth/session infrastructure.
2. Update the UI to request signed URLs only when the backend indicates media support is enabled.
3. Verify a valid photo/video upload reaches R2, the media reference persists on the exercise record, and private access remains restricted to the owning personal.
4. Roll out with `R2_ENABLED=false` as the safe local fallback and keep all existing non-media exercise creation paths intact.

## Open Questions

- None at this point; the direct-upload approach and privacy constraints are clear enough to proceed without further design ambiguity.
