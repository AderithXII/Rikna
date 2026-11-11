# Data model

`AppState` in `script.js` is initialized from `INITIAL_STATE` and persisted to localStorage (`saveState` / `loadState`). All data is local demo data — no API.

## Accounts

```js
{ email, password, role: 'resident'|'collector'|'admin', name, id, contact, barangay, municipality?, registeredDate, status?, restrictionReason?, restrictionDate?, restrictionHistory? }
```

Three demo accounts ship in `INITIAL_STATE.accounts` (prefilled on the login screen). `AppState.currentUser` is the logged-in account.

## Resident

```js
{
  points, pendingPoints, lifetimePoints,
  kgRecycled, deposits,
  transactions: [
    { id, type: 'earned'|'spent', label, points, date, kg?, material?, collector?, barangay?, status: 'verified'|'redeemed'|'pending', merchant?, remarks?, photo? }
  ],
  vouchers: [
    { id, name, code, status: 'active'|'used'|'expired', pointsSpent, expiry, merchant, redeemedDate }
  ]
}
```

## Collector / Admin

- `collector: { kgToday, txToday, ptsToday, currentDeposit: { resident, material, weight, points, photoDataUrl, remarks } }`
- `admin: { totalWaste, registeredResidents, pointsDistributed, vouchersRedeemed, barangays }`
- `collectionRecords`: deposit records with collector, resident, weight, points, flagged/review fields.
- `collectors`: collector accounts with status (`active`/`restricted`), restriction history, and stored `totalWaste`, `totalDeposits`, `totalPoints` aggregates. Profile waste/points use the matching account aggregates; the verified-deposit count is derived from that collector's unflagged `status: 'verified'` collection records and labeled "on file" (the aggregate deposit count is not a verified-only count). Accepted waste types come from enabled `wasteMaterials`, not a collector-specific permission list.

## Catalogs

- `wasteMaterials`: `{ id, name, rate (pts/kg), enabled }` — PET, Paper/Cardboard, Aluminum, Tin/Steel, Glass.
- `rewards`: `{ id, name, merchant, points, category, available, qty, description }`.
- `collectionCenters`: `{ id, name, address, hours, contact, materials[] }`.
- `activities`: approved barangay events `{ id, name, type, date, location, description, participationPts, status, proposedBy }`. Dates only — no invented times.
- `eventProposals`: pending community proposals with `ecoPointReward`.
- `notifications`: per-role arrays `{ id, title, body, time, read, link }`.
- `auditLog`: `{ timestamp, action, detail }`. `nowStr()` stores truncated UTC (`YYYY-MM-DD HH:mm`, no zone suffix); Reports restores UTC before formatting these timestamps in browser-local date/time via `formatAuditTimestamp()`. Details may be pre-split into logical lines by `parseAuditDetail()`. Filtering does not mutate records or audit history.

## Rules

- Metrics shown in the UI come from these fields — never hardcode displayed numbers in markup beyond placeholder defaults.
- No CO₂/tree-equivalent conversions, goals, streaks, or event times exist in the model; do not fabricate them in the UI. Monthly insight is computed at render from verified earned entries in the latest recorded month.
- Demo QR patterns are deterministic functions of the resident ID (`generateQRPattern`); they are not standards-compliant QR codes.
