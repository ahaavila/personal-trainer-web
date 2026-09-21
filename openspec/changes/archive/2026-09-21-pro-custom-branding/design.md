## Context

See `proposal.md` for background and user goals.
Currently, `AppLayout` renders a hardcoded dumbbell icon logo and standard gold/dark palette defined in CSS files.
PRO personal trainers should be able to white-label the app with their custom logo and custom colors (accent and background).

## Goals / Non-Goals

**Goals:**
- Provide a dedicated "Personalização Visual (PRO)" section on `/meu-perfil`.
- Logo upload with thumbnail preview, compression/formatting, and removal.
- 2 color pickers (with hex inputs and preset palettes):
  - Primary / Accent color (default: `#e6b94e`).
  - Dark base / Background color (default: `#0c0a08`).
- CSS variable system (`--color-primary`, `--color-bg-base`, `--color-primary-hover`, etc.) applied to `document.documentElement` to tint UI elements, buttons, active sidebar links, and background dynamically.
- Student brand sync: when an aluno session is active, fetch their personal trainer's branding configuration (if trainer is PRO) and apply it to the student's app shell.

**Non-Goals:**
- Custom font family uploads (inter/system typography remains standardized for consistency and performance).
- Full custom CSS editor (too prone to breaking layout).

## Decisions

1. **CSS Custom Properties for Themable Elements**:
   - Define theme variables on `:root` in `src/index.css`:
     - `--brand-primary`: `#e6b94e`
     - `--brand-bg`: `#0c0a08`
     - Derived hover/border/glow colors.
   - Inject these variables via a lightweight `useBrandingTheme()` hook or directly in `AppLayout` based on current user / trainer branding.

2. **Logo Storage & Presentation**:
   - In `AppLayout`, replace the fixed `.app-sidebar__logo` with a responsive image container when `branding.logoUrl` exists, falling back to the standard gold dumbbell mark.

3. **Gating for PRO Plan**:
   - In `MeuPerfilPage`, check `subscription.plan === 'pro'`. If `basic`, the branding section displays a preview with a locked badge and "Disponível no Plano PRO - Fazer Upgrade" button.

## Risks / Trade-offs

- [Risk] Personal trainer chooses low-contrast colors (e.g. white background with light text).  
  → Mitigation: Provide presets, sensible validation, and a one-click "Restaurar cores padrão" button.
