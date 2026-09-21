## Why

To enhance the value proposition of the PRO plan, personal trainers need white-label capabilities to deliver a branded experience to their clients. Allowing PRO trainers to customize the app logo and key theme colors (accent and dark background) elevates their professionalism and provides students with an experience customized to their coach's visual identity.

## What Changes

- Add a **Personalização Visual (PRO)** section on `/meu-perfil`:
  - Only accessible / editable for personal trainers on Plano PRO (with an upgrade CTA banner if on Plano Básico).
  - Custom brand logo upload (image file) with live preview and remove action.
  - Theme color pickers:
    - **Cor Principal / Destaque (Accent)**: default `#e6b94e` (gold).
    - **Cor de Fundo / Base Escura (Background)**: default `#0c0a08` (dark).
    - "Restaurar Padrão" action to return to FitManager Pro default colors.
- Distribute branding to assigned students:
  - When an aluno logs in, the app loads their trainer's custom branding (logo and colors) if the trainer has an active PRO subscription.
- Dynamically inject CSS custom properties (`--color-primary`, `--color-bg-base`, etc.) and render the custom logo in `AppLayout` (sidebar logo) for both the personal trainer and their students.

## Capabilities

### Modified Capabilities
- `user-profile`: Adds custom logo upload and primary/background theme color customization settings for PRO personal trainers.
- `app-navigation`: Adds dynamic rendering of the trainer's custom brand logo and application of custom theme colors across the application shell for trainers and their assigned students.

## Impact

- `src/pages/MeuPerfilPage.tsx` and `.css`: New branding customization section for PRO trainers.
- `src/layouts/AppLayout.tsx` and `.css`: Dynamic logo display and theme CSS variables injection.
- Theme context or CSS variables hook to apply brand colors dynamically across DOM elements.
