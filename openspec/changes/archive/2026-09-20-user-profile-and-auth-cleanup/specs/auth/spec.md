## MODIFIED Requirements

### Requirement: Login screen visual design
The system SHALL render the login screen matching the provided design: a split layout with a decorative panel on one side and the form panel on the other, including branding, a functional "Lembrar de mim" checkbox, an active "Esqueci minha senha" navigation link, and a footer message directing users to contact their personal trainer. The "Esqueci minha senha" link SHALL navigate the user to `/esqueci-minha-senha`. The login screen SHALL NOT render a Google login button or divider. Secondary elements other than "Lembrar de mim" and "Esqueci minha senha" SHALL be rendered as static UI with no authentication or navigation behavior attached.

#### Scenario: Rendering the login screen
- **WHEN** a user opens the login route
- **THEN** the screen displays the branding, form, checkbox, links, and footer message, without rendering any Google login button or divider

#### Scenario: Clicking forgot password link
- **WHEN** a user clicks the "Esqueci minha senha" link on the login screen
- **THEN** the system navigates to the `/esqueci-minha-senha` route without a full page reload
