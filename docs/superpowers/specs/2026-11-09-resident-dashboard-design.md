# Rikna resident dashboard — approved design

## Intent
Make the mobile home screen a recognizable community recycling utility: editorial hierarchy, factual impact, and quick access to the resident QR. The user approved the field-journal direction and My QR as the primary action.

## Approaches
Selected: one teal EcoPoints anchor, an open impact section, compact activity rows, and date-led community events. Repeating rounded cards would retain the current generic hierarchy; an illustration-heavy landing page would waste mobile space and weaken utility.

## Design
- Preserve the logo, personalized greeting, barangay, notifications, and five resident destinations.
- Keep the existing neutral background and exact green/teal/leaf/lime/cream brand tokens. Add semantic aliases rather than a new palette.
- EcoPoints uses large tabular numerals, a restrained material/recycling motif, and a points-breakdown entry point.
- Quick actions: My QR (primary), EcoWallet, Rewards; all use existing navigation.
- Impact presents recorded kilograms and deposit count, with no unsupported conversions or invented goals.
- Activity rows distinguish material deposits, redemptions, and pending status with icon, label, amount, and text status.
- Events use AppState.activities and openActivityDetail; do not invent missing event times.
- Keep existing fonts and outline SVG vocabulary. Use typography, open space, dividers, and date blocks for variety.
- Preserve full-width navigation and login-only count-up. Press feedback is subtle and reduced-motion-aware.

## Scope and constraints
Vanilla HTML/CSS/JavaScript; localStorage demo state; no backend/API changes or UI dependencies. Dashboard styling is scoped; resident navigation receives consistent safe areas, selected state, and touch targets. Related screens retain their content and routing.

## Acceptance
Keyboard-accessible actions; controls at least 44px; no horizontal overflow at 320/375/390/430px; accurate dynamic metrics/events/transactions; readable long content and empty states; all five destinations and event/transaction dialogs work. No commit or push.

## EcoWallet extension
The user subsequently requested EcoWallet to share the new identity. Use a pale-green balance hero with large teal numerals, compact pending/lifetime totals, an accessible segmented filter, and the shared material-specific feed grouped by month. Monthly insight is calculated from verified earned entries in the latest recorded month, explicitly labeled with month/year and limited to the available history. No streak or trend is fabricated. Preserve the neutral page and all navigation destinations.
