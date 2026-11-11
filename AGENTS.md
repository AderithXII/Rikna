# AGENTS.md — Rikna

Rikna is a community recycling-rewards mobile web app (vanilla HTML/CSS/JS, no build step, no framework). Residents earn EcoPoints for recyclable deposits, track impact, redeem rewards, and show a QR pass at barangay drop-offs. Collector and Admin roles manage deposits, events, materials, and reports.

## Quick facts

- **Runtime:** browser only. Open `index.html` or serve it: `npm run dev` → http://localhost:8124
- **Checks:** `npm run check` (node --check on `script.js` + `tests/ui-checks.js`)
- **No git repo, no build, no backend.** State is a local demo model persisted to localStorage.
- **Mobile only.** Desktop/tablet layouts are out of scope.
- **Palette (exact, do not change):** forest `#3C8D70`, forest-dark `#32755D`, leaf `#99CB5B`, lime `#D4EA50`, teal `#146375`, cream `#F5EFB3`, page `#F6F7F8`.

## File map

| File | Purpose |
|---|---|
| `index.html` | All screens + modals. Screens are `.screen` divs toggled by `.active` |
| `style.css` | Design tokens in `:root`, components, screen styles, motion |
| `script.js` | State, rendering, navigation, swipe system, all interactions |
| `assets/logo.png` | App logo (cropped from `rikna_logo1.png`, the master) |
| `assets/grain.png` | Tiling noise texture behind the welcome scene's grain layer |
| `tests/ui-checks.html` / `.js` | Browser QA harness (see below) |
| `docs/architecture.md`, `docs/data-model.md`, `docs/design-system.md` | Reference docs — read before big changes |

## Reading efficiently (token discipline)

- `index.html` (~5,450 lines) and `script.js` (~4,100 lines) are large. **Never read whole files.** Use `grep` to locate a symbol/id, then `read` only the surrounding range with `offset`/`limit`.
- CSS: tokens at the top of `style.css`; screen styles are scoped per screen (`#screen-resident-home`, `#screen-resident-wallet`, `#screen-resident-qr` …). Search `#screen-…` before reading.
- Prefer one targeted grep + one ranged read over broad exploration.
- Keep new files/docs small; link instead of duplicating.

## Graphify (optional navigation aid)

`graphify-out/graph.json` is a generated knowledge graph (AST + docs). Use it for **navigation questions** — "where is X defined", "what calls Y", "how does A connect to B":

- `graphify query "<question>" --budget 800` — broad context, capped tokens
- `graphify path "A" "B"` — shortest path between two symbols
- `graphify explain "X"` — connections of a node
- `graphify update .` — rebuild after code changes (free, no LLM)

`update` is AST-only: it re-indexes symbols, call edges, and doc section headings, so it stays accurate after a code refactor. Doc-level `INFERRED` edges and community names need an LLM backend (`graphify label`) that is not configured here — treat them as hints, not facts.

Graph-first for relationships, grep-first for exact text/symbols. The graph is additive: if it's missing or stale, fall back to grep + ranged reads. Don't run the full `/graphify` semantic pipeline (token-heavy) — `update` covers navigation needs.

## Architecture in one page

- **State:** `AppState` in `script.js` (template `INITIAL_STATE`), persisted via `saveState()`/`loadState()` (localStorage). Demo accounts: resident / collector / admin, prefills on login.
- **Authentication & Onboarding (`screen-welcome`, `screen-login`, `screen-register`):** Cinematic editorial eco-tech experience. Welcome is built on a custom environmental scene (`.wlc-scene`): inline SVG topographic contours (`.wlc-contour`), layered canopy silhouettes (`.wlc-canopy`), gradient light ribbons (`.wlc-ribbons`), a recycling-loop motif (`.wlc-motif`), drifting light pools (`.wlc-glow-a/b`), a sweeping light pass (`.wlc-light`), three luminous motes (`.wlc-mote-*`) and a tiling grain texture (`assets/grain.png`). The existing `assets/logo.png` is the centerpiece — it is never redrawn, restyled or distorted — framed by a blooming halo (`.wlc-aura`), an orbiting rim (`.wlc-rim`) and a tap ripple (`.wlc-ripple`). Editorial typography: uppercase lime eyebrow, Poppins headline with masked line reveals (`.wlc-line` / `.wlc-line-in`) and a lime-emphasised "into rewards." (`.wlc-em`), then a supporting EcoPoints line. White CTA (`.wlc-btn-start`) with a press-down state, plus the secondary Reset Demo Data link. Entrance is a 5-stage ~1.8s choreography (background → mark → environment → typography → CTA) that never blocks interaction. Touch: `initWelcomeInteractions()` drives the logo ripple and a light pointer parallax on the scene (`--wlc-px` / `--wlc-py`). Login includes a multi-stop top brand gradient stripe, top navigation bar, emerald-focus inputs with 3px elevation, interactive password visibility eye toggle, and a polished collapsible prototype demo panel (`Explore Rikna`) featuring role-specific icons and `.selected-demo` active highlighting. Register features a sticky header, icon-prefixed form inputs (`.reg-input-wrap`) with focus coupling, terms disclaimer, and resident signup.
- **Navigation:** `showScreen(id, direction)` + `showResidentTab` / `showCollectorTab` / `showAdminTab`. Tabs slide full-width (direction from `TAB_ORDER`); non-tab routes fade. Auth routes use the shared-mark handoff: `handoffTo(targetId, opts)` cross-dissolves the two screens (`.handoff-out` / `.handoff-in`) and flies a body-level clone of the Rikna mark (`.handoff-mark`) from the outgoing logo slot into the incoming one, landing exactly on target. `goToLogin()` (welcome → login), `goToRegister()` (login → create account) and `backToLogin()` (register → login) all route through it; `doLogin()` still adds `.login-leaving` (login wrap lifts/fades before role routing; double-taps guarded). `showScreen` clears the transient handoff classes and resets `loginLeaving` on return to login; reduced motion skips the flight and the crossfade entirely. Bottom navs: `nav-resident`, `nav-collector`, `nav-admin`. Notifications counts as the rightmost tab.
- **Shell headings:** Home / Dashboard is the only branded destination (masthead + notifications) across Resident, Collector, and Admin roles. Resident root tabs EcoWallet, My QR, Rewards, and Profile, as well as Admin Manage, use one contextual `.page-title-block h1`; root tabs never get back navigation. Nested pages keep their compact back header.
- **Swipe:** touch-drag pager between adjacent tabs (`initSwipeNavigation`); finger-tracking with commit/springback. Taps and swipes share the `glideTo` engine — do not fork a second slide path. Notifications is the rightmost tab in every role's `TAB_ORDER`.
- **Renderers:** `updateResidentUI` / `updateResidentHomeUI`, `renderHomeRecentTransactions`, `renderHomeActivities`, `renderTransactions` (wallet), `renderRewards` (ticket catalog) / `renderVouchers` (voucher rows + counts), `renderQRScreen`, `renderProfileScreen` (pf-* identity/impact/details/settings; `setEditProfilePanel` owns the edit disclosure ARIA), etc. `refreshTab(role, tab)` is the single per-tab refresh used by both taps and swipe commits.
- **Admin Dashboard (`screen-admin-home`):** Single branded masthead destination for admin. Unified KPI card, program coverage accordion (`toggleBarangaySummary`), 7-day proportional waste trends with explicit zero-value day visibility, responsive 3-column Material Share (`.bar-row`: Material, Bar, Value with `<wbr>` breaking), and data-driven Barangay Rankings distinguishing participating barangays from active deposit barangays.
- **Admin Manage (`screen-admin-manage`):** Title-only `.page-title-block` (`<h1>Manage</h1>`) without duplicate brand masthead. 4 pill tabs (`.manage-pills`: Materials, Rewards, Collectors, Activities). Compact collector statistics, responsive 3-tier collector cards (`.collector-row`), full-width `.manage-card-row` items for activities/proposals with stacked action footers, and guarded workflow modals (Collector Details with independent scroll, Event Proposal Review with budget allocation calculation and distinct revision request vs approval).
- **Admin Audits & Reports (`screen-admin-reports`):** `getAdminReportFilters()` reads search/material/collector/date controls; `getFilteredAdminRecords()` applies AND logic and bounded local calendar dates. `filterAdminReports()` refreshes both Flagged Activity and Verified Transactions, including tab/admin refreshes. Section counts/empty states follow the results; the header deposit total and CSV remain unfiltered. Clear filters lives in a conditional secondary row beneath the dropdowns. Review access is preserved. Audit Log stays independent with its existing eight-entry limit; `formatAuditTimestamp()` restores the UTC convention of `nowStr()` and formats local dates/times. Audit entries split IDs, people, amounts, and notes into readable lines without truncating IDs; final readability pass: action titles 14px semibold, descriptions 13px at 1.5 line-height, timestamps ≥12px with better contrast, transaction/resident IDs semibold, EcoPoints values in Rikna forest green. `parseAuditDetail()` splits action-specific details into logical display lines (primary first) and `appendAuditTokens()` marks IDs/EcoPoints via spans. Existing grouped cards, palette, and safe-area bottom clearance remain.
- **Toast notifications:** Single `#app-toast` fixed to the top (`top: calc(14px + env(safe-area-inset-top, 0px))`) with tap-to-dismiss and automatic clearing during screen transitions in `showScreen()`, ensuring transient feedback never obscures transaction rows, modal controls, or bottom navigation.
- **Collector:** dashboard uses `col-*` with a New collection action that opens the Scanner root. The Scanner tab owns the **only** QR scanning surface (`#scan-root-surface`); the wizard lives in the same screen but owns no viewport. `selectedResident` is the single verified-resident state — written through `setVerifiedResident()`/`clearVerifiedResident()`, painted into both surfaces by `renderVerifiedResident()`. `scanSession` owns the viewport lifecycle (`startScanSession()`/`stopScanSession()`): it starts at most once, pauses on verification, and never resumes while the wizard owns the screen. Selection leaves bottom nav visible; Continue Collection requires a resident and calls `startDepositWizard()` at step 2 without resetting data. Wizard Back to step 1 shows the verified resident summary (`#wiz-resident-card`), never a scanner; Scan Different Resident inside the wizard and Exit use the discard guard, while Scan Different Resident on the Scanner tab clears the resident and restarts scanning. Only `.wizard-mode` hides bottom nav and excludes tab swipes. `goToStep` owns progress/header/summary/focus; `syncWizardFooter()` owns footer state; `depositInFlight` blocks double submits. Success resets the finished draft; `finishDepositSuccess()` opens Records and `startAnotherCollection()` opens the Scanner root. This demo has no live camera/decoder or production QR authorization service.
- **Rewards:** compact balance row + single-column two-row reward cards built with DOM APIs (top: monogram/merchant/cost; bottom: value/Redeem). Value is split out of the live reward name (presentation only); deterministic merchant monograms are tinted by category; the card is keyboard-activatable (`article[role=button]` opens the detail sheet, Redeem `stopPropagation`s). My Vouchers tabs live on `#voucher-tab-bar` with live counts; voucher rows show merchant/status/value/expiry without codes. `redemptionInFlight` blocks duplicate confirm submissions.
- **Count-up gate:** `countUpArmed` — EcoPoints numbers animate only inside `doLogin`'s render; everywhere else they set instantly. Do not re-enable count-up on tab re-entry. The flag stays armed through the login exit so the count still plays on arrival.
- **Collector Records:** light contextual `.collector-page-head`; filters live in `currentRecordFilter`, with local Today and Monday–Sunday This Week boundaries via `collectorLocalDateKey()` (also used when recording a deposit). DOM-built `.record-row` buttons open receipts; inventory is explicitly all-time.
- **Unified profiles:** Resident, Collector, and Admin use `.profile-screen` / `pf-*`: green-to-teal botanical identity, circular avatar, metadata chips, two-column statistics/details, icon-backed settings, and shared Logout. Resident editing/actions remain resident-only. Collector identity matches its ID/email; waste/points use stored collector totals, verified deposits are counted from that collector's verified/unflagged records and labeled "on file", and accepted types use enabled program materials. Admin statistics use existing program totals. Collector/Admin retain Notifications and coming-soon Help & Support; no unsupported edit/password actions.
- **QR:** deterministic 21×21 pattern from `generateQRPattern(user.id)` (demo pattern, not a standards QR). `createResidentQrBlob()` exports the exact pattern as PNG for download/share. `copyResidentId()` copies the live user ID with clipboard + fallback.

## Design skills (UI/UX)

Load the skill before starting UI/UX work; keep the order:

1. **`ui-ux-pro-max`** — first. Design system, hierarchy, color harmony, mobile responsiveness, accessibility, typography. Use for direction and system-wide decisions.
2. **`design-taste-frontend`** (taste) — second. Visual identity, distinctive layouts, removing generic AI-dashboard patterns.
3. **Implement** with existing tokens/components (`docs/design-system.md`). 21st skills as needed: `21st-ui-explore` for variants/directions, `21st-ui-build` for production implementation, `21st-ui-review` for critique-only passes.
4. **`impeccable`** — last. Final polish and audit: spacing, alignment, states, consistency, craft floor. Run `impeccable detect` once the UI is finished.
5. **`animate`** — for any motion change (purpose, easing, duration, reduced motion).
6. **`browser`** — visual QA at 320/375/390/430px before claiming done.
7. **`graphify`** — navigation/relationships if the question is architectural (see section above).

## Design rules

- Light UI, GCash-crisp flat buttons, radii 8/10/14/18, neutral shadows.
- Motion: `transform`/`opacity` only, `--ease-out` for entrances, `--ease-bounce` only for the welcome/login logo pop. Tab switches slide; everything else fades. Always honor `prefers-reduced-motion` (gentler fade, never zero).
- One entrance drama per session (post-login home entrance is one-shot via `.entrance-dramatic`, stripped after ~1.5s).
- Use existing outline-SVG icon vocabulary; no emojis as icons. New dynamic text must be inserted via `textContent`/`replaceChildren` (never `innerHTML` with user data).
- Horizontal rails stay inside their own container: no wrapping, no shrinking, hidden scrollbar, touch scrolling, no edge-fade overlays over interactive content (a clipped child is the scroll cue). The Rewards category rail uses `#rw-chips` / `#rw-chips-wrap`; it must never widen the page.
- Long content, empty states, and 320–430px widths must not overflow horizontally.

## QA harness

`tests/ui-checks.html` loads the app in a mobile iframe; `runUiChecks()` asserts layout, touch targets, navigation, filters, dialogs, reduced motion, long/empty states, and data fidelity across 320/375/390/430px. Run it in the in-app browser after UI changes. Fixtures are in-memory and restored afterward.

The harness aborts on the first failure, so a single failure hides every later assertion. When one appears, re-run with `assert` downgraded to a non-throwing collector to see the rest of the suite before fixing.

## Conventions

- Do not commit or push (no git repo here).
- Preserve palette, functionality, and existing navigation/routes; prefer minimal scoped CSS/JS over rewrites.
- `rikna_logo1.png` is the untouched logo master — don't edit it.
- Keep `AGENTS.md` and `docs/` current when architecture changes.
