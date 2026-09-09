## 1. Creation Route & API Client

- [x] 1.1 Add typed credentialed exercise creation and media-upload API clients, ensuring no owner/key/role input is exposed
- [x] 1.2 Replace `/novo-exercicio` placeholder with a personal-guarded form and verify aluno sees 403 before form/API access
- [x] 1.3 Add MSW creation/media-disabled behavior and verify mock-created exercises appear in the personal library

## 2. Exercise Form

- [x] 2.1 Build the supplied Novo exercício form with name, group, equipment, level, description, default sets, default repetitions, and photo/video selectors
- [x] 2.2 Validate required fields plus photo JPEG/PNG/WebP <=10 MB and video MP4/WebM <=100 MB; verify invalid input prevents submission/upload
- [x] 2.3 Respect media availability from backend: show disabled/unavailable state when R2 is off, otherwise request signed URLs, upload direct, and confirm attachments
- [x] 2.4 Show submission/success/error feedback; preserve form values on failure and navigate to `/exercicios` after success

## 3. Verification

- [x] 3.1 Verify form, private creation, list refresh, validation and 403 guard in mock mode
- [x] 3.2 Verify real backend creation without R2 enabled and private list ownership
- [x] 3.3 Verify R2 direct photo/video upload after bucket setup, including rejected type/size and another-personal access denial
- [x] 3.4 Run build and lint and verify both pass
