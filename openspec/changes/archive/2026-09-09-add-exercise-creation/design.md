## Context

`/novo-exercicio` is a personal-guarded placeholder. The private library and `GET /api/exercicios` are already implemented. The backend counterpart adds exercise creation and optional Cloudflare R2 direct-upload support.

## Goals / Non-Goals

**Goals:**
- Replace the placeholder with the supplied dark/gold form design, adding description/default prescription beneath the primary fields.
- Create exercises without an owner/role input, using credentialed API calls.
- Support media selection and direct signed URL upload only when the backend advertises media as enabled.

**Non-Goals:**
- No edit/delete/media replacement UI, media preview player, transcoding, thumbnails, or upload progress persistence.
- No upload when R2 is unavailable; create-without-media remains the fallback.

## Decisions

- **Creation order**: validate form -> create exercise -> request signed URL(s) for selected media -> upload directly to R2 -> confirm attachment metadata. If no media or R2 disabled, finish after creation.
- **Field validation**: name/muscle group/level/description/default sets/default repetitions required; equipment optional. Photo types JPEG/PNG/WebP maximum 10 MB; video MP4/WebM maximum 100 MB.
- **R2 enabled signal**: fetch a backend capability/config endpoint or use creation response metadata so frontend does not guess from credentials.
- **Mock parity**: MSW supports form creation and returns media-disabled behavior; it does not fake binary R2 uploads.
- **Privacy**: frontend never accepts/selects an exercise owner and only calls endpoints with session credentials; backend is authoritative.

## Risks / Trade-offs

- [Risk] a created exercise can exist before an upload fails → Mitigation: show attachment-specific error while retaining the exercise, letting a future media-edit feature retry attachment.
- [Risk] direct upload fails on unstable connections → Mitigation: clear validation/error feedback and no false success indication for the failed file.
