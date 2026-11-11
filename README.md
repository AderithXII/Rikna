# Rikna

A community recycling-rewards mobile web app. Residents earn EcoToken for recyclable deposits, track their impact, redeem rewards, and show a QR pass at barangay drop-offs. Collector and Admin roles manage deposits, events, materials, and reports.

Built with vanilla HTML/CSS/JS — no framework, no build step, no backend. State is a local demo model persisted to `localStorage`.

## Run it

```bash
npm install
npm run dev        # → http://localhost:8124
```

Or just open `index.html` in a browser.

## Checks

```bash
npm run check      # syntax-checks script.js and the test harnesses
```

## Demo accounts

Three prefilled demo accounts (resident, collector, admin) are available on the login screen under **Explore Rikna**.

- **Resident** — deposit points, wallet, rewards/vouchers, QR pass, impact tracking
- **Collector** — scan residents, record deposits, collection records
- **Admin** — dashboard KPIs, manage materials/rewards/collectors/activities, audits & reports

## Project structure

```
rikna/
├── index.html      # All screens + modals
├── style.css       # Design tokens, components, screen styles
├── script.js       # State, rendering, navigation, interactions
├── assets/         # logo.png, grain.png
└── rikna_logo1.png # Logo master
```

## Scope notes

- Mobile only (320–430px); desktop layouts are out of scope.
- The QR pass is a deterministic demo pattern, not a standards-compliant QR code, and there is no live camera/decoder — this is a prototype with no production QR authorization service.
