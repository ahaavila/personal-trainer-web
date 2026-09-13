## 1. Backend signed-upload support

- [x] 1.1 Define the backend capability/config contract for media support and `R2_ENABLED` behavior.
- [x] 1.2 Add signed URL issuance for photo/video uploads that is scoped to the authenticated personal and the target exercise.
- [x] 1.3 Enforce file type and size validation server-side before creating the signed URL.
- [x] 1.4 Persist media references on the exercise record and reject cross-owner access to upload or media endpoints.

## 2. Frontend upload flow

- [x] 2.1 Update the exercise form to request signed URLs only when the backend confirms media support is enabled.
- [x] 2.2 Upload selected photo/video files directly to R2 and show explicit selected/uploaded status messages.
- [x] 2.3 Keep exercise creation working without media when R2 is disabled and surface the appropriate fallback state.
- [x] 2.4 Show success and error feedback without exposing bucket credentials or misreporting upload success.

## 3. Verification

- [x] 3.1 Verify valid photo/video uploads land in the Cloudflare R2 bucket under the correct private path.
- [x] 3.2 Verify invalid type/size requests are rejected before or during the upload flow.
- [x] 3.3 Verify another personal cannot request or use upload access for a different user's exercise.
- [x] 3.4 Run the relevant frontend and backend checks and confirm the exercise library continues to work with and without R2 enabled.
