## ADDED Requirements

### Requirement: Custom brand identity configuration for PRO trainers
The system SHALL allow personal trainers with an active Plano PRO subscription to configure custom brand assets in `/meu-perfil`, including uploading a custom brand logo image and selecting custom primary (accent) and background theme colors.

#### Scenario: PRO trainer views branding settings
- **WHEN** an authenticated personal trainer on Plano PRO navigates to `/meu-perfil`
- **THEN** the system displays the "Personalização Visual (PRO)" section with logo upload controls, color pickers for accent and dark base colors, and a preview of their brand theme

#### Scenario: Basic trainer views branding settings
- **WHEN** an authenticated personal trainer on Plano Básico views `/meu-perfil`
- **THEN** the system displays the branding section in a locked state with an upgrade callout prompting the trainer to subscribe to Plano PRO to unlock custom branding

#### Scenario: PRO trainer updates custom logo and colors
- **WHEN** a PRO personal trainer uploads a custom logo image and selects custom theme colors and saves
- **THEN** the system saves the branding settings, immediately reflects the new logo and colors in the interface, and updates the branding applied to their assigned students

#### Scenario: Resetting branding to default theme
- **WHEN** a PRO personal trainer clicks the action to reset branding to default
- **THEN** the system clears the custom logo and resets the colors to the default FitManager Pro gold (`#e6b94e`) and dark background (`#0c0a08`)
