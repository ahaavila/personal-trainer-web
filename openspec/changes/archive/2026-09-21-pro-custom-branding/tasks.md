## 1. Branding Theme Provider and State

- [x] 1.1 Define CSS root custom variables (`--brand-primary`, `--brand-bg`) and dynamic injection helper in `personal-trainer-web`
- [x] 1.2 Add branding types, API methods, and MSW handlers for getting and updating branding configuration (`logoUrl`, `primaryColor`, `backgroundColor`)

## 2. Branding Settings in Meu Perfil

- [x] 2.1 Add "Personalização Visual (PRO)" section in `src/pages/MeuPerfilPage.tsx` with logo file upload and preview
- [x] 2.2 Add color picker inputs for primary/accent color and background color with color presets and "Restaurar Padrão" button
- [x] 2.3 Add PRO plan gating: show locked state with upgrade CTA when trainer is on Plano Básico

## 3. Dynamic App Shell Branding

- [x] 3.1 Update `src/layouts/AppLayout.tsx` to render the custom logo if available instead of default dumbbell icon
- [x] 3.2 Ensure student layout loads and applies the personal trainer's custom branding if the trainer is PRO
- [x] 3.3 Validate styling, responsive behavior, lint, and build
