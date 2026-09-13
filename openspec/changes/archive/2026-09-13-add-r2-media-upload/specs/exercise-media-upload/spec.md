## Purpose

Lets personal trainers attach optional photo or video media to exercises through secure signed URLs to Cloudflare R2 while keeping every asset private to the owning personal user and still allowing creation to work when R2 is disabled.

## ADDED Requirements

### Requirement: Personal can upload exercise media directly to R2
The system SHALL allow an authenticated personal user to request one or more signed upload URLs for a new exercise's optional photo and/or video, and SHALL upload those files directly to Cloudflare R2 using the issued URLs.

#### Scenario: Successful photo upload
- **WHEN** a personal selects a valid JPEG, PNG, or WebP photo under 10 MB for a new exercise while R2 is enabled
- **THEN** the system requests a signed upload URL, uploads the file directly to Cloudflare R2, and stores the resulting media reference with the new exercise

#### Scenario: Successful video upload
- **WHEN** a personal selects a valid MP4 or WebM video under 100 MB for a new exercise while R2 is enabled
- **THEN** the system requests a signed upload URL, uploads the file directly to Cloudflare R2, and stores the resulting media reference with the new exercise

#### Scenario: R2 disabled during exercise creation
- **WHEN** the backend indicates that Cloudflare R2 is disabled
- **THEN** the system allows the exercise to be created without media and does not attempt any signed upload

### Requirement: Upload validation protects the bucket and the user
The system SHALL reject invalid media input before a signed upload is created and SHALL only allow the supported file types and size limits defined for exercise execution media.

#### Scenario: Invalid file type is rejected
- **WHEN** a personal selects an unsupported file type for exercise media
- **THEN** the system prevents submission and displays a validation error before a signed upload request is sent

#### Scenario: File exceeds the allowed size
- **WHEN** a personal selects a photo or video larger than the permitted size limit
- **THEN** the system prevents the upload and shows a size-specific validation error

#### Scenario: Upload fails after creation
- **WHEN** a signed upload request succeeds but the direct upload fails or the response is incomplete
- **THEN** the system surfaces a clear media error without claiming the exercise was fully uploaded and keeps the exercise record in a consistent state

### Requirement: Media stays private to the creating personal
The system SHALL ensure that exercise media access and upload permissions are derived from the authenticated user and SHALL never trust a client-provided owner value.

#### Scenario: Another personal attempts to upload for someone else's exercise
- **WHEN** a personal without ownership tries to request media upload or access for another personal's exercise
- **THEN** the system denies the request and returns a not-found or access-denied response based on the private-resource policy

#### Scenario: Browser is not given bucket secrets
- **WHEN** the frontend requests signed upload metadata
- **THEN** it receives only the scoped upload instructions needed for that file and does not receive Cloudflare account credentials or private bucket secrets
