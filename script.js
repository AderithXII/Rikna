// =============================================================================
// RIKNA - MOBILE RECYCLING REWARDS APP
// Vanilla JavaScript SPA - Complete Implementation
// =============================================================================

'use strict';

// --- INITIAL STATE TEMPLATE ---
const INITIAL_STATE = {
  currentUser: null,
  accounts: [
    { email: 'rikna.resident.demo@gmail.com', password: 'Resident123!', role: 'resident', name: 'Maria Santos', id: 'RES-2024-001', contact: '09171234567', barangay: 'Barangay San Gabriel', municipality: 'Tuguegarao City', registeredDate: '2024-03-15', lang: 'en', philSysVerified: false },
    { email: 'rikna.collector.demo@gmail.com', password: 'Collector123!', role: 'collector', name: 'Rodel Aguila', id: 'COL-2024-007', contact: '09281234567', barangay: 'Barangay San Gabriel', registeredDate: '2024-01-10', status: 'active', restrictionReason: null, restrictionDate: null },
    { email: 'rikna.admin.demo@gmail.com', password: 'Admin123!', role: 'admin', name: 'Engr. Josefina Reyes', id: 'ADM-2024-001', contact: '09391234567', barangay: 'LGU Tuguegarao City', registeredDate: '2024-01-01' }
  ],
  resident: {
    points: 500, pendingPoints: 0, lifetimePoints: 1240, kgRecycled: 18.5, deposits: 12,
    registeredEvents: [],
    transactions: [
      { id: 'TXN001', type: 'earned', label: 'PET Plastic Deposit', points: 90, date: '2026-11-05', kg: 3.0, material: 'PET Plastic', collector: 'Rodel Aguila', barangay: 'Barangay San Gabriel', status: 'verified', photo: null, remarks: 'Clean and sorted' },
      { id: 'TXN002', type: 'earned', label: 'Aluminum Deposit', points: 120, date: '2026-11-02', kg: 2.0, material: 'Aluminum', collector: 'Rodel Aguila', barangay: 'Barangay San Gabriel', status: 'verified', photo: null, remarks: 'Crushed soda cans' },
      { id: 'TXN003', type: 'spent', label: 'SM Supermarket ₱50 Voucher', points: -100, date: '2026-10-30', status: 'redeemed', merchant: 'SM Supermarket' },
      { id: 'TXN004', type: 'earned', label: 'Paper Deposit', points: 50, date: '2026-10-25', kg: 5.0, material: 'Paper/Cardboard', collector: 'Rodel Aguila', barangay: 'Barangay San Gabriel', status: 'verified', photo: null, remarks: 'Folded cartons' },
      { id: 'TXN005', type: 'spent', label: 'Jollibee ₱30 Discount', points: -80, date: '2026-10-20', status: 'redeemed', merchant: 'Jollibee' },
      { id: 'TXN006', type: 'earned', label: 'Glass Deposit', points: 15, date: '2026-10-15', kg: 3.0, material: 'Glass', collector: 'Rodel Aguila', barangay: 'Barangay San Gabriel', status: 'verified', photo: null, remarks: 'Bottles uncracked' },
      { id: 'TXN007', type: 'earned', label: 'Tin/Steel Deposit', points: 24, date: '2026-10-10', kg: 2.0, material: 'Tin/Steel', collector: 'Rodel Aguila', barangay: 'Barangay San Gabriel', status: 'verified', photo: null, remarks: 'Washed food tins' },
      { id: 'TXN008', type: 'earned', label: 'PET Plastic Deposit', points: 60, date: '2026-10-05', kg: 2.0, material: 'PET Plastic', collector: 'Rodel Aguila', barangay: 'Barangay San Gabriel', status: 'verified', photo: null, remarks: 'Standard drop' }
    ],
    vouchers: [
      { id: 'VCH001', name: 'SM Supermarket ₱50 Voucher', code: 'SM-RKN-5839', status: 'used', pointsSpent: 100, expiry: '2026-12-31', merchant: 'SM Supermarket', redeemedDate: '2026-10-30' },
      { id: 'VCH002', name: 'Jollibee ₱30 Discount', code: 'JB-RKN-2947', status: 'used', pointsSpent: 80, expiry: '2026-12-31', merchant: 'Jollibee', redeemedDate: '2026-10-20' }
    ],
    pickups: [
      { id: 'PCK001', status: 'scheduled', date: '2026-11-20', timeWindow: '8:00 AM – 12:00 PM', materials: ['PET Plastic Bottles', 'Paper/Cardboard'] },
      { id: 'PCK002', status: 'completed', date: '2026-11-10', material: 'Aluminum Cans', weight: 2.5, points: 150, collector: 'Rodel Aguila', photo: null, verified: true },
      { id: 'PCK003', status: 'completed', date: '2026-10-28', material: 'PET Plastic Bottles', weight: 1.8, points: 54, collector: 'Rodel Aguila', photo: null, verified: true }
    ]
  },
  collector: {
    kgToday: 12.5, txToday: 5, ptsToday: 420,
    currentDeposit: { resident: null, material: null, weight: 0, points: 0, photoDataUrl: null, remarks: '' }
  },
  admin: { totalWaste: 847.3, registeredResidents: 234, pointsDistributed: 28450, vouchersRedeemed: 47, barangays: 5 },
  wasteMaterials: [
    { id: 'PET', name: 'PET Plastic', rate: 30, enabled: true },
    { id: 'PAPER', name: 'Paper/Cardboard', rate: 10, enabled: true },
    { id: 'ALUM', name: 'Aluminum', rate: 60, enabled: true },
    { id: 'TIN', name: 'Tin/Steel', rate: 12, enabled: true },
    { id: 'GLASS', name: 'Glass', rate: 5, enabled: true }
  ],
  rewards: [
    { id: 'RWD001', name: 'SM Supermarket ₱50 Voucher', merchant: 'SM Supermarket', points: 100, category: 'grocery', available: true, qty: 20, description: 'Get ₱50 off your next SM Supermarket purchase. Valid at all branches nationwide.' },
    { id: 'RWD002', name: 'Jollibee ₱30 Discount', merchant: 'Jollibee', points: 80, category: 'dining', available: true, qty: 15, description: 'Enjoy ₱30 off your favorite meals at any Jollibee branch.' },
    { id: 'RWD003', name: 'National Bookstore 10% Off', merchant: 'National Bookstore', points: 150, category: 'essentials', available: true, qty: 10, description: '10% discount on books and school essentials at National Bookstore.' },
    { id: 'RWD004', name: 'Mercury Drug ₱100 Voucher', merchant: 'Mercury Drug', points: 200, category: 'essentials', available: true, qty: 8, description: '₱100 medicine and wellness voucher redeemable at Mercury Drug.' },
    { id: 'RWD006', name: '7-Eleven ₱20 Credit', merchant: '7-Eleven', points: 50, category: 'grocery', available: true, qty: 50, description: '₱20 CLiQQ wallet credit redeemable at all 7-Eleven stores.' }
  ],
  collectionRecords: [
    { id: 'DEP001', residentName: 'Maria Santos', residentId: 'RES-2024-001', material: 'PET Plastic', weight: 3.0, points: 90, date: '2026-11-05', collector: 'Rodel Aguila', collectorId: 'COL-2024-007', barangay: 'Barangay San Gabriel', status: 'verified', photoDataUrl: null, remarks: 'Verified by officer', flagged: false, flagReason: '', reviewStatus: null, reviewNotes: null, reviewOutcome: null },
    { id: 'DEP002', residentName: 'Jose Reyes', residentId: 'RES-2024-002', material: 'Aluminum', weight: 1.5, points: 90, date: '2026-11-05', collector: 'Rodel Aguila', collectorId: 'COL-2024-007', barangay: 'Barangay San Gabriel', status: 'verified', photoDataUrl: null, remarks: 'Batch collection', flagged: false, flagReason: '', reviewStatus: null, reviewNotes: null, reviewOutcome: null },
    { id: 'DEP003', residentName: 'Ana Dela Cruz', residentId: 'RES-2024-003', material: 'Paper/Cardboard', weight: 4.2, points: 42, date: '2026-11-04', collector: 'Rodel Aguila', collectorId: 'COL-2024-007', barangay: 'Barangay San Gabriel', status: 'verified', photoDataUrl: null, remarks: 'Folded paper bundles', flagged: false, flagReason: '', reviewStatus: null, reviewNotes: null, reviewOutcome: null },
    { id: 'DEP004', residentName: 'Pedro Lim', residentId: 'RES-2024-004', material: 'Glass', weight: 2.8, points: 14, date: '2026-11-04', collector: 'Rodel Aguila', collectorId: 'COL-2024-007', barangay: 'Barangay San Gabriel', status: 'flagged', photoDataUrl: null, remarks: 'Frequent dropoffs', flagged: true, flagReason: 'Multiple deposits within 1 hour window', reviewStatus: 'pending', reviewNotes: null, reviewOutcome: null },
    { id: 'DEP005', residentName: 'Carmen Bautista', residentId: 'RES-2024-005', material: 'Tin/Steel', weight: 1.0, points: 12, date: '2026-11-03', collector: 'Rodel Aguila', collectorId: 'COL-2024-007', barangay: 'Barangay San Gabriel', status: 'verified', photoDataUrl: null, remarks: '', flagged: false, flagReason: '', reviewStatus: null, reviewNotes: null, reviewOutcome: null },
    { id: 'DEP006', residentName: 'Rodrigo Mendoza', residentId: 'RES-2024-006', material: 'PET Plastic', weight: 25.0, points: 750, date: '2026-11-03', collector: 'Rodel Aguila', collectorId: 'COL-2024-007', barangay: 'Barangay San Gabriel', status: 'flagged', photoDataUrl: null, remarks: 'Bulk commercial drop', flagged: true, flagReason: 'Unusually high weight (25.0 kg) exceeds 15 kg threshold', reviewStatus: 'pending', reviewNotes: null, reviewOutcome: null }
  ],
  collectors: [
    { id: 'COL-2024-007', name: 'Rodel Aguila', barangay: 'Barangay San Gabriel', email: 'rikna.collector.demo@gmail.com', contact: '09281234567', phone: '09281234567', status: 'active', registeredDate: '2024-01-10', totalWaste: 124.5, totalDeposits: 48, totalPoints: 3240, restrictionReason: null, restrictionDate: null, restrictionHistory: [] },
    { id: 'COL-2024-008', name: 'Ligaya Santos', barangay: 'Barangay Pengue Ruyu', email: 'ligaya.santos@brgy.gov.ph', contact: '09191234567', phone: '09191234567', status: 'active', registeredDate: '2024-02-20', totalWaste: 98.2, totalDeposits: 36, totalPoints: 2450, restrictionReason: null, restrictionDate: null, restrictionHistory: [] },
    { id: 'COL-2024-009', name: 'Ernesto Flores', barangay: 'Barangay Caritan Norte', email: 'ernesto.flores@brgy.gov.ph', contact: '09301234567', phone: '09301234567', status: 'restricted', registeredDate: '2024-03-05', totalWaste: 56.7, totalDeposits: 22, totalPoints: 1120, restrictionReason: 'Suspicious deposit activity under review', restrictionDate: '2026-10-28', restrictionHistory: [{ date: '2026-10-28', reason: 'Suspicious deposit activity under review', admin: 'Engr. Josefina Reyes' }] }
  ],
  activities: [
    { id: 'ACT001', name: 'Barangay Clean-Up Drive', type: 'cleanup', date: '2026-11-15', location: 'Barangay San Gabriel Plaza', description: 'Community cleanup of main streets and waterways. Bring gloves and eco bags.', participationPts: 50, status: 'approved', proposedBy: null },
    { id: 'ACT002', name: 'Tree Planting Initiative', type: 'planting', date: '2026-11-22', location: 'Barangay San Gabriel Park', description: 'Plant 200 native trees in our barangay park. Seedlings provided.', participationPts: 75, status: 'approved', proposedBy: null }
  ],
  eventProposals: [
    { id: 'PROP001', title: 'Community Recycling Campaign', category: 'Recycling Campaign', description: 'A one-day recycling drive targeting households in Sitio Masagana.', barangay: 'Barangay San Gabriel', location: 'Sitio Masagana Covered Court', date: '2026-12-05', startTime: '8:00 AM', endTime: '3:00 PM', participants: 50, ecoPointReward: 30, remarks: 'Please provide sorting bins.', proposedBy: 'Rodel Aguila', proposedById: 'COL-2024-007', status: 'pending', submittedDate: '2026-11-01', rejectionReason: null }
  ],
  notifications: {
    resident: [
      { id: 'RNOTIF001', title: 'EcoToken Credited', body: 'You earned 90 EcoToken for your PET Plastic deposit on Nov 5.', time: '2026-11-05 14:32', read: false, link: 'wallet' },
      { id: 'RNOTIF002', title: 'Deposit Verified', body: 'Your deposit DEP001 has been verified by Rodel Aguila.', time: '2026-11-05 14:33', read: false, link: 'wallet' },
      { id: 'RNOTIF003', title: 'Upcoming Event', body: 'Barangay Clean-Up Drive is on Nov 15. Earn 50 EcoToken!', time: '2026-11-04 09:00', read: true, link: 'home' },
      { id: 'RNOTIF004', title: 'Voucher Expiring Soon', body: 'Your SM Supermarket ₱50 Voucher expires on Dec 31, 2026.', time: '2026-11-03 10:00', read: true, link: 'rewards' }
    ],
    collector: [
      { id: 'CNOTIF001', title: 'Deposit Recorded Successfully', body: 'Deposit DEP001 for Maria Santos (3.0 kg PET Plastic) has been confirmed.', time: '2026-11-05 14:32', read: false, link: 'records' },
      { id: 'CNOTIF002', title: 'New Environmental Program', body: 'LGU Tuguegarao City launches the Green Barangay Challenge. Submit proposals by Nov 30.', time: '2026-11-04 08:00', read: true, link: null },
      { id: 'CNOTIF003', title: 'Event Proposal Under Review', body: 'Your Community Recycling Campaign proposal is currently under LGU review.', time: '2026-11-01 15:00', read: true, link: null }
    ],
    admin: [
      { id: 'ANOTIF001', title: 'New Event Proposal', body: 'Rodel Aguila submitted: Community Recycling Campaign (Barangay San Gabriel).', time: '2026-11-01 15:00', read: false, link: 'manage' },
      { id: 'ANOTIF002', title: 'Correction Request', body: 'A correction request was filed for deposit DEP003 by Rodel Aguila.', time: '2026-11-04 11:00', read: false, link: 'reports' },
      { id: 'ANOTIF003', title: 'Suspicious Deposit Flagged', body: 'Deposit DEP006 (25 kg PET Plastic) auto-flagged for review.', time: '2026-11-03 09:00', read: true, link: 'reports' }
    ]
  },
  auditLog: [
    { timestamp: '2026-11-05 14:32', action: 'Deposit confirmed', detail: 'RES-2024-001 — 3.0 kg PET Plastic — 90 pts' },
    { timestamp: '2026-11-05 11:15', action: 'Voucher redeemed', detail: 'RES-2024-001 — SM Supermarket ₱50 — 100 pts' },
    { timestamp: '2026-11-04 16:00', action: 'Deposit flagged', detail: 'DEP006 — unusually high weight (25.0 kg)' },
    { timestamp: '2026-11-03 09:22', action: 'Account restricted', detail: 'COL-2024-009 Ernesto Flores' },
    { timestamp: '2026-11-01 15:00', action: 'Event proposal submitted', detail: 'Community Recycling Campaign by Rodel Aguila' }
  ]
};

let AppState = JSON.parse(JSON.stringify(INITIAL_STATE));

// Active state variables
let currentRewardId = null;
let currentVoucherId = null;
let currentCollectorId = 'COL-2024-007';
let currentViewingCollectorId = 'COL-2024-007';
let activeReportRecordId = 'DEP001';
let currentFraudRecordId = null;
let currentProposalId = null;
let walletTabFilter = 'all';
let voucherTabFilter = 'active';
let rewardCategoryFilter = 'all';
let redemptionInFlight = false;
let currentStep = 1;
let currentWizardStep = 1;
let selectedResident = null;
let selectedMaterial = null;
let depositPhotoDataUrl = null;
let currentRecordFilter = { material: 'all', date: 'all', search: '' };

// --- PERSISTENCE ---
function saveState() {
  try {
    // v3: demo world moved to Tuguegarao — old v2 saves are deliberately ignored
    localStorage.setItem('riknaAppState_v3', JSON.stringify(AppState));
  } catch(e) {
    console.warn('LocalStorage save error:', e);
  }
}

function loadState() {
  try {
    const s = localStorage.getItem('riknaAppState_v3');
    if (s) {
      const parsed = JSON.parse(s);
      AppState = Object.assign({}, INITIAL_STATE, parsed);

    }
  } catch(e) {
    console.warn('LocalStorage load error, using default state:', e);
    AppState = JSON.parse(JSON.stringify(INITIAL_STATE));
  }
}

function resetDemoData() {
  AppState = JSON.parse(JSON.stringify(INITIAL_STATE));
  try { localStorage.removeItem('riknaAppState_v3'); localStorage.removeItem('riknaAppState_v2'); } catch(e) {}
  clearVerifiedResident();
  selectedMaterial = null;
  depositPhotoDataUrl = null;
  currentStep = 1;
  currentWizardStep = 1;
  showScreen('screen-welcome');
  showToast('Demo data reset successfully', 'success');
}

// --- HELPERS ---
function el(id) { return document.getElementById(id); }

function setText(id, text) {
  const e = el(id);
  if (e) e.textContent = text !== undefined && text !== null ? text : '';
}

function setHTML(id, html) {
  const e = el(id);
  if (e) e.innerHTML = html !== undefined && html !== null ? html : '';
}

function esc(value) {
  return String(value === undefined || value === null ? '' : value)
    .replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function formatDate(d) {
  if (!d) return '-';
  try {
    const parts = d.split('-');
    if (parts.length === 3) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const mIdx = parseInt(parts[1], 10) - 1;
      return `${months[mIdx]} ${parseInt(parts[2], 10)}, ${parts[0]}`;
    }
    return new Date(d + 'T00:00:00').toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch(e) {
    return d;
  }
}

function formatTimestamp(date) {
  const d = date || new Date();
  return d.toISOString().replace('T', ' ').substring(0, 16);
}

function formatPoints(n) {
  return (n || 0).toLocaleString();
}

function nowStr() {
  return formatTimestamp(new Date());
}

function uid() {
  return Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
}

function animateNumber(elementOrId, start, end, duration = 500, suffix = '') {
  const e = typeof elementOrId === 'string' ? el(elementOrId) : elementOrId;
  if (!e) return;
  const startNum = Number(start) || 0;
  const endNum = Number(end) || 0;
  const range = endNum - startNum;
  const startTime = performance.now();
  const step = t => {
    const p = Math.min((t - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    e.textContent = Math.round(startNum + range * ease).toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// --- PLAYFUL COUNT-UP (respects reduced motion) ---
// Animates a numeric display from its last shown value; falls back to a plain
// set when the user prefers reduced motion.
// Count-up gate: numbers only animate inside the post-login render window
// (armed by doLogin). Every other render — tab taps, swipes, actions — sets
// the text instantly, so re-entering Home never replays the count.
let countUpArmed = false;

function setNumberAnimated(elementOrId, value, duration = 700, suffix = '') {
  const e = typeof elementOrId === 'string' ? el(elementOrId) : elementOrId;
  if (!e) return;
  const prev = Number(e.dataset && e.dataset.points) || 0;
  if (e.dataset) e.dataset.points = value;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!countUpArmed || reduceMotion || prev === value) {
    e.textContent = (value || 0).toLocaleString() + suffix;
    return;
  }
  animateNumber(e, prev, value, duration, suffix);
}

// --- TOAST NOTIFICATIONS ---
function showToast(message, type = 'info', duration = 2200) {
  let toast = el('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.onclick = () => {
      toast.classList.remove('active');
      clearTimeout(toast._t);
    };
    document.body.appendChild(toast);
  }
  if (!el('toast-styles')) {
    const s = document.createElement('style');
    s.id = 'toast-styles';
    s.textContent = `
      #app-toast {
        position: fixed;
        top: calc(14px + env(safe-area-inset-top, 0px));
        left: 50%;
        transform: translateX(-50%) translateY(-24px) scale(0.95);
        padding: 10px 18px;
        border-radius: var(--radius-md, 12px);
        font-family: 'Poppins', sans-serif;
        font-size: 13px;
        font-weight: 500;
        color: #ffffff;
        z-index: 99999;
        opacity: 0;
        transition: opacity 0.2s var(--ease-out, ease-out), transform 0.22s var(--ease-out, ease-out);
        pointer-events: none;
        white-space: normal;
        line-height: 1.35;
        max-width: min(90vw, 380px);
        text-align: center;
        box-shadow: 0 8px 24px -4px rgba(0,0,0,0.25);
        cursor: pointer;
      }
      #app-toast.active {
        opacity: 1;
        pointer-events: auto;
        transform: translateX(-50%) translateY(0) scale(1);
      }
      .toast-success { background: #166534 !important; }
      .toast-error { background: #991B1B !important; }
      .toast-info { background: #146375 !important; }
      .toast-warn, .toast-warning { background: #D97706 !important; }
      @media (prefers-reduced-motion: reduce) {
        #app-toast { transition: opacity 0.18s; transform: translateX(-50%); }
        #app-toast.active { transform: translateX(-50%); }
      }
    `;
    document.head.appendChild(s);
  }
  toast.className = `toast-${type}`;
  toast.textContent = message;
  requestAnimationFrame(() => {
    toast.classList.add('active');
  });
  clearTimeout(toast._t);
  const dur = type === 'error' ? 3000 : duration;
  toast._t = setTimeout(() => {
    toast.classList.remove('active');
  }, dur);
}

// --- MODAL DIALOGS ---
function syncModalOpenClass() {
  const open = Array.from(document.querySelectorAll('.modal-overlay.active'))
    .some(m => !m.classList.contains('closing'));
  document.body.classList.toggle('modal-open', open);
}

function openModal(id) {
  const e = el(id);
  if (e) {
    e.classList.remove('closing'); // cancel an in-flight close, if any
    e.classList.add('active');
    e.setAttribute('aria-hidden', 'false');
    syncModalOpenClass();
  }
}

function closeModal(id) {
  if (id === 'modal-fraud-review') fraudReviewInFlight = false;
  const e = el(id);
  if (!e || !e.classList.contains('active')) return;
  e.classList.add('closing');
  e.setAttribute('aria-hidden', 'true');
  const done = () => {
    // If reopened mid-close, openModal cleared .closing — don't kill it.
    if (!e.classList.contains('closing')) return;
    e.classList.remove('active', 'closing');
    syncModalOpenClass();
  };
  e.querySelector('.modal-content')?.addEventListener('animationend', done, { once: true });
  setTimeout(done, 320); // fallback if animationend never fires
}

function closeModalOutside(event) {
  if (event.target === event.currentTarget) {
    closeModal(event.currentTarget.id);
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    // The deposit success sheet is a decision point, not a dismissible
    // dialog — Done or New collection clears it explicitly.
    document.querySelectorAll('.modal-overlay.active').forEach(m => {
      if (m.id !== 'modal-deposit-success') closeModal(m.id);
    });
  }
});

// --- SCREEN SLIDE TRANSITIONS -----------------------------------------------
// One motion system for both tab taps and swipe commits: the outgoing screen
// overlays (#app is the positioning context) and slides fully off one way
// while the incoming one slides in from the other. CSS transitions drive the
// glide, so a mid-slide tap retargets from the current position instead of
// restarting — quick tab chains stay fluid.
let activeGlide = null; // { from, to, timer, finish }

function glideFinish() {
  if (!activeGlide) return;
  clearTimeout(activeGlide.timer);
  const g = activeGlide;
  activeGlide = null;
  g.finish();
}

function glideTo(fromEl, toEl, direction, staged) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finishCommit = () => {
    fromEl.classList.remove('active', 'swipe-current');
    fromEl.style.cssText = '';
    toEl.classList.remove('swipe-under');
    toEl.style.cssText = '';
  };

  if (reduce) {
    if (activeGlide) glideFinish();
    toEl.classList.add('active', 'screen-enter');
    finishCommit();
    return;
  }

  if (activeGlide) {
    if (activeGlide.to === toEl) return; // same target mid-flight — let it land
    clearTimeout(activeGlide.timer);
    if (activeGlide.mode === 'commit' && activeGlide.to !== fromEl) {
      // Interruption: the still-entering screen becomes the outgoing one and
      // retargets from wherever it is; the old outgoing screen (mostly
      // offscreen already) leaves instantly.
      const prevFrom = activeGlide.from;
      prevFrom.classList.remove('active', 'swipe-current');
      prevFrom.style.cssText = '';
      fromEl = activeGlide.to;
    } else {
      activeGlide.finish();
    }
    activeGlide = null;
  }

  // 'right' = the target enters from the right side (moving leftward)
  const sign = direction === 'right' ? 1 : -1;
  const w = fromEl.clientWidth;

  if (!staged) {
    fromEl.classList.remove('screen-enter');
    fromEl.classList.add('swipe-current');
    fromEl.style.transition = 'none';
    fromEl.style.transform = 'translateX(0)';
    toEl.classList.add('active', 'swipe-under');
    toEl.style.transition = 'none';
    toEl.style.transform = `translateX(${sign * w}px)`;
    void toEl.offsetWidth; // flush the staged start positions
  }

  fromEl.style.transition = 'transform 0.28s var(--ease-out)';
  toEl.style.transition = 'transform 0.28s var(--ease-out)';
  fromEl.style.transform = `translateX(${-sign * w}px)`;
  toEl.style.transform = 'translateX(0)';

  activeGlide = { from: fromEl, to: toEl, mode: 'commit', timer: 0, finish: finishCommit };
  activeGlide.timer = setTimeout(glideFinish, 310);
}
function showScreen(screenId, direction, authCommit = false) {
  const current = document.querySelector('.screen.active');
  const target = el(screenId);
  if (!target) return;
  if (!authCommit) {
    if (AUTH_SCREENS.includes(current?.id) && AUTH_SCREENS.includes(screenId)) {
      transitionAuthScreen(screenId);
      return;
    }
    cancelAuthTransition();
  }

  // Dismiss any lingering toast when navigating between screens
  if (current && current.id !== screenId) {
    const toast = el('app-toast');
    if (toast && toast.classList.contains('active')) {
      toast.classList.remove('active');
      clearTimeout(toast._t);
    }
  }

  // The collection wizard is a focused task: hide the tab bar only while the
  // wizard mode is active. The Scanner tab itself is a normal root tab.
  const scanScreen = el('screen-collector-scan');
  const scanIsWizard = screenId === 'screen-collector-scan'
    && !!scanScreen?.classList.contains('wizard-mode');
  document.body.classList.toggle('wizard-active', scanIsWizard);

  // Tab taps with a direction slide; everything else fades.
  if (direction && current && current.id !== screenId) {
    const tctx = swipeScreenContext(target);
    if (tctx) {
      // Content refresh while the target is still hidden — no re-render
      // frame can land mid-glide.
      refreshTab(tctx.role, tctx.tab);
      glideTo(current, target, direction, false);
      return;
    }
  }

  // Auth owns its content animation; never stack a screen fade on top of it.
  if (activeGlide) glideFinish();
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.classList.remove('screen-enter', 'entrance-dramatic');
  });
  target.classList.add('active');
  if (!AUTH_SCREENS.includes(screenId)) target.classList.add('screen-enter');
  if (screenId !== 'screen-welcome') el('screen-welcome').classList.remove('welcome-intro');

  // Manage Bottom Navbars
  ['nav-resident', 'nav-collector', 'nav-admin'].forEach(id => {
    const nav = el(id);
    if (nav) nav.classList.remove('visible');
  });

  if (screenId.startsWith('screen-resident-')) {
    const n = el('nav-resident');
    if (n) n.classList.add('visible');
  } else if (screenId.startsWith('screen-collector-')) {
    const n = el('nav-collector');
    if (n) n.classList.add('visible');
  } else if (screenId.startsWith('screen-admin-')) {
    const n = el('nav-admin');
    if (n) n.classList.add('visible');
  }
}

// --- WELCOME INTERACTIONS --------------------------------------------------
// Touch-driven micro-interactions: the logo area reacts with a ring that
// travels outward, and the environment drifts a little with the pointer.
function initWelcomeInteractions() {
  const welcome = el('screen-welcome');
  const visual = welcome && welcome.querySelector('.welcome-visual');
  const scene = welcome && welcome.querySelector('.wlc-scene');
  if (!welcome) return;

  if (visual) {
    const ripple = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      visual.classList.remove('is-rippling');
      // Restart the ring animation on every tap.
      void visual.offsetWidth;
      visual.classList.add('is-rippling');
    };
    visual.addEventListener('pointerdown', ripple);
  }

  if (scene) {
    let raf = 0;
    const drift = (x, y) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!welcome.classList.contains('active')) return;
        scene.style.setProperty('--wlc-px', x.toFixed(1) + 'px');
        scene.style.setProperty('--wlc-py', y.toFixed(1) + 'px');
      });
    };
    const reset = () => drift(0, 0);
    welcome.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const r = welcome.getBoundingClientRect();
      drift((e.clientX - r.left - r.width / 2) * 0.02, (e.clientY - r.top - r.height / 2) * 0.01);
    }, { passive: true });
    welcome.addEventListener('pointerleave', reset);
    welcome.addEventListener('pointercancel', reset);
  }
}

// --- AUTH NAVIGATION -------------------------------------------------------
const AUTH_SCREENS = ['screen-welcome', 'screen-login', 'screen-register'];
let authTransition = null;

function cancelAuthTransition() {
  if (!authTransition) return;
  const transition = authTransition;
  authTransition = null;
  transition.animations.forEach(animation => animation.cancel());
  transition.background?.remove();
}

async function transitionAuthScreen(targetId) {
  if (authTransition?.targetId === targetId) return;
  cancelAuthTransition();
  const from = document.querySelector('.screen.active');
  const to = el(targetId);
  if (!to || from === to) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sign = AUTH_SCREENS.indexOf(targetId) > AUTH_SCREENS.indexOf(from.id) ? 1 : -1;
  const distance = reduce ? 0 : 8 * sign;
  const foreground = screen => screen.querySelectorAll(
    '.welcome-visual, .welcome-text, .welcome-actions, .login-wrap > *, .reg-header, .reg-body'
  );
  const transition = { targetId, animations: [], background: null };
  authTransition = transition;
  const animate = (node, frames, duration) => {
    const animation = node.animate(frames, { duration, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'both' });
    transition.animations.push(animation);
    return animation.finished;
  };
  try {
    // Settle an interrupted intro before leaving; it is never armed again.
    el('screen-welcome').classList.remove('welcome-intro');
    await Promise.all([...foreground(from)].map(node => animate(node, [
      { opacity: 1, transform: 'translateX(0)' },
      { opacity: 0, transform: `translateX(${-distance}px)` }
    ], reduce ? 60 : 90)));
    if (authTransition !== transition) return;

    // Blend only the old background, never a snapshot/clone of its content.
    const background = document.createElement('div');
    background.className = 'auth-background';
    background.setAttribute('aria-hidden', 'true');
    background.style.background = getComputedStyle(from).background;
    transition.background = background;
    showScreen(targetId, undefined, true);
    to.scrollTop = 0;
    el('app').appendChild(background);
    const heading = to.querySelector('.login-title, .reg-title, .welcome-brand');
    heading?.focus({ preventScroll: true });
    await Promise.all([
      animate(background, [{ opacity: 1 }, { opacity: 0 }], reduce ? 60 : 130),
      ...[...foreground(to)].map(node => animate(node, [
        { opacity: 0, transform: `translateX(${distance}px)`, offset: 0 },
        { opacity: 0, transform: `translateX(${distance}px)`, offset: 0.25 },
        { opacity: 1, transform: 'translateX(0)', offset: 1 }
      ], reduce ? 100 : 190))
    ]);
  } catch (error) {
    if (error.name !== 'AbortError') throw error;
  } finally {
    if (authTransition === transition) cancelAuthTransition();
  }
}

function goToLogin() {
  showScreen('screen-login');
}

function goToRegister() {
  showScreen('screen-register');
}

function backToLogin() {
  showScreen('screen-login');
}

function updateNavActive(navId, btnId) {
  document.querySelectorAll(`#${navId} .nav-item`).forEach(b => {
    b.classList.remove('active');
    b.removeAttribute('aria-current');
  });
  const btn = el(btnId);
  if (btn) {
    btn.classList.add('active');
    btn.setAttribute('aria-current', 'page');
  }
}

// Tab order defines the swipe sequence: swiping left reveals the next tab,
// swiping right the previous one. Notifications sits rightmost (a push).
const TAB_ORDER = {
  resident: ['home', 'pickup', 'qr', 'rewards', 'profile', 'notifications'],
  collector: ['home', 'scan', 'records', 'profile', 'notifications'],
  admin: ['home', 'manage', 'reports', 'profile', 'notifications'],
};

function tabDirection(role, tab) {
  const from = document.querySelector('.screen.active');
  if (!from) return undefined;
  const fromCtx = swipeScreenContext(from);
  if (!fromCtx || fromCtx.role !== role) return undefined;
  const a = TAB_ORDER[role].indexOf(fromCtx.tab);
  const b = TAB_ORDER[role].indexOf(tab);
  if (a === -1 || b === -1 || a === b) return undefined;
  return b > a ? 'right' : 'left';
}

function showResidentTab(tab) {
  const map = {
    home: 'screen-resident-home',
    pickup: 'screen-resident-pickup',
    wallet: 'screen-resident-wallet',
    qr: 'screen-resident-qr',
    rewards: 'screen-resident-rewards',
    profile: 'screen-resident-profile',
    notifications: 'screen-resident-notifications'
  };
  if (!map[tab]) return;
  showScreen(map[tab], tabDirection('resident', tab));
  updateNavActive('nav-resident', 'navbtn-resident-' + tab);
  refreshTab('resident', tab);
}

// --- RESIDENT TRASH PICKUP TAB ---
// Renders the Scheduled (status === 'scheduled') and History (status ===
// 'completed') pickup segments, each with its own empty state, plus the
// static Material Exchange Rates list rendered in index.html.
function renderPickupTab() {
  const pickups = Array.isArray(AppState.resident.pickups) ? AppState.resident.pickups : [];
  const segments = [
    { panel: 'pickup-scheduled', list: 'pickup-scheduled-list', status: 'scheduled', order: 'asc',
      empty: ['No scheduled pickups', 'Your upcoming collections will appear here.'] },
    { panel: 'pickup-history', list: 'pickup-history-list', status: 'completed', order: 'desc',
      empty: ['No pickup history yet', 'Completed collections will appear here.'] }
  ];
  segments.forEach(seg => {
    const panel = el(seg.panel);
    if (!panel) return;
    const items = pickups.filter(p => p.status === seg.status)
      .sort((a, b) => (seg.order === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));
    const list = document.createElement('div');
    list.id = seg.list;
    list.className = 'pickup-list';
    if (!items.length) {
      list.append(buildEmptyState(seg.empty[0], seg.empty[1]));
      panel.replaceChildren(list);
      return;
    }
    list.replaceChildren(...items.map(p => {
      const row = document.createElement('div');
      row.className = 'pickup-row ' + (seg.status === 'completed' ? 'clickable' : 'scheduled');
      if (seg.status === 'completed') {
        row.setAttribute('role', 'button');
        row.setAttribute('tabindex', '0');
        row.onclick = (e) => {
          e.stopPropagation();
          openPickupDetail(p.id);
        };
        row.onkeydown = (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPickupDetail(p.id); }
        };
      }
      if (seg.status === 'scheduled') {
        row.innerHTML = `<span class="pickup-date">${formatDate(p.date)}</span><span class="pickup-window">${esc(p.timeWindow)}</span><span class="pickup-materials">${esc(Array.isArray(p.materials) ? p.materials.join(', ') : (p.materials || ''))}</span>`;
      } else {
        row.innerHTML = `<span class="pickup-date">${formatDate(p.date)}</span><span class="pickup-material">${esc(p.material)}</span><span class="pickup-weight">${(Number(p.weight) || 0).toFixed(2)} kg</span><span class="pickup-points">+${(p.points || 0).toLocaleString()} pts</span><span class="pickup-collector">${esc(p.collector)}</span><span class="pickup-photo">${p.photo ? '<img class="pickup-photo-img" src="' + esc(p.photo) + '" alt="Pickup photo">' : '<span class="pickup-photo-placeholder">No photo</span>'}</span><span class="pickup-badge pickup-${p.verified ? 'verified' : 'unverified'}">${p.verified ? 'Verified' : 'Unverified'}</span>`;
      }
      return row;
    }));
    panel.replaceChildren(list);
  });
}

function switchPickupTab(tab) {
  if (tab !== 'scheduled' && tab !== 'history') return;
  document.querySelectorAll('#pickup-tab-bar .tab-btn').forEach(btn => {
    const active = btn.id === 'pickup-tab-' + tab;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('.pickup-panel').forEach(panel => {
    const active = panel.id === 'pickup-' + tab;
    panel.classList.toggle('active', active);
  });
  if (tab === 'history') renderPickupTab();
}

function openPickupDetail(pickupId) {
  const p = AppState.resident.pickups.find(x => x.id === pickupId);
  if (!p) return;
  setText('pickup-detail-date', formatDate(p.date));
  setText('pickup-detail-material', esc(p.material));
  setText('pickup-detail-weight', (Number(p.weight) || 0).toFixed(2) + ' kg');
  setText('pickup-detail-points', '+' + (p.points || 0).toLocaleString() + ' pts');
  setText('pickup-detail-collector', esc(p.collector));
  setText('pickup-detail-status', p.status);
  const photo = el('pickup-detail-photo');
  if (photo) {
    if (p.photo) { photo.src = p.photo; photo.style.display = 'block'; }
    else { photo.style.display = 'none'; }
  }
  openModal('modal-pickup-detail');
}

let wizardExitTab = 'scan';

function showCollectorTab(tab) {
  const map = {
    home: 'screen-collector-home',
    scan: 'screen-collector-scan',
    records: 'screen-collector-records',
    notifications: 'screen-collector-notifications',
    profile: 'screen-collector-profile'
  };
  if (!map[tab]) return;
  if (el('screen-collector-scan')?.classList.contains('wizard-mode')) {
    exitWizard(tab);
    return;
  }
  // Scanner is a normal root tab; the wizard starts from the scan surface.
  if (tab === 'scan') {
    showScannerRoot();
    return;
  }
  showScreen(map[tab], tabDirection('collector', tab));
  updateNavActive('nav-collector', 'navbtn-collector-' + tab);
  refreshTab('collector', tab);
}

function showScannerRoot() {
  const screen = el('screen-collector-scan');
  if (!screen) return;
  // Never drop an active wizard (where the tab bar is hidden) accidentally.
  if (screen.classList.contains('wizard-mode') && screen.classList.contains('active')) return;

  screen.classList.remove('wizard-mode');
  document.body.classList.remove('wizard-active');
  showScreen('screen-collector-scan', tabDirection('collector', 'scan'));
  updateNavActive('nav-collector', 'navbtn-collector-scan');
  // The scanner surface owns the only scanning viewport: resume it here.
  startScanSession();
  refreshTab('collector', 'scan');
  renderCollectorScanSurface();
}

function startNewCollection() {
  showCollectorTab('scan');
}

function showAdminTab(tab) {
  const map = {
    home: 'screen-admin-home',
    manage: 'screen-admin-manage',
    reports: 'screen-admin-reports',
    notifications: 'screen-admin-notifications',
    profile: 'screen-admin-profile'
  };
  if (!map[tab]) return;
  showScreen(map[tab], tabDirection('admin', tab));
  updateNavActive('nav-admin', 'navbtn-admin-' + tab);
  refreshTab('admin', tab);
}

// Per-tab UI refresh, shared by tap navigation (showXTab) and swipe commit.
function refreshTab(role, tab) {
  if (role === 'resident') {
    if (tab === 'home') updateResidentHomeUI();
    else if (tab === 'pickup') renderPickupTab();
    else if (tab === 'wallet') renderTransactions(walletTabFilter);
    else if (tab === 'qr') renderQRScreen();
    else if (tab === 'rewards') renderRewards();
    else if (tab === 'profile') renderProfileScreen();
    else if (tab === 'notifications') renderNotifications('resident');
  } else if (role === 'collector') {
    if (tab === 'home') updateCollectorHomeUI();
    else if (tab === 'scan') { startScanSession(); syncWizardFooter(); }
    else if (tab === 'records') { renderCollectorRecords(currentRecordFilter); renderMaterialInventory(); }
    else if (tab === 'notifications') renderNotifications('collector');
    else if (tab === 'profile') renderCollectorProfileScreen();
  } else if (role === 'admin') {
    if (tab === 'home') updateAdminUI();
    else if (tab === 'manage') { renderManageSections(); showManageTab('categories'); }
    else if (tab === 'reports') { _populateCollectorFilter(); filterAdminReports(); renderAuditLog(); }
    else if (tab === 'notifications') renderNotifications('admin');
    else if (tab === 'profile') renderAdminProfileScreen();
  }
}

// --- SWIPE BETWEEN TABS (screens follow the finger) -------------------------
// A drag that locks horizontal (|dx| > 10px and clearly wider than tall)
// reveals the neighboring tab in the role's TAB_ORDER: the current screen is
// pulled aside (absolute overlay) while the neighbor sits beneath, both
// translated 1:1 with the finger. Release either commits (30% of width, or a
// quick flick past 40px) or springs back. Vertical scrolling is untouched —
// the lock never engages on a vertical gesture, and horizontally scrollable
// rows (filter chips, card rails) are excluded at touch start.
const swipe = {
  el: null, ctx: null, target: null, w: 0,
  x0: 0, y0: 0, t0: 0, dir: null, dx: 0, vx: 0, lastX: 0, lastT: 0, timer: 0,
};

// Pending end-of-glide cleanup lives in activeGlide (see Screen Slide
// Transitions) so taps and swipes share one interruption-safe finalize.

function swipeScreenContext(screen) {
  if (screen.classList.contains('wizard-mode')) return null;
  const m = screen.id.match(/^screen-(resident|collector|admin)-(.+)$/);
  if (!m) return null;
  const order = TAB_ORDER[m[1]];
  if (!order || !order.includes(m[2])) return null;
  return { role: m[1], tab: m[2] };
}

function swipeNeighbor(ctx, step) {
  const order = TAB_ORDER[ctx.role];
  const idx = order.indexOf(ctx.tab);
  const tab = order[idx + step];
  if (ctx.role === 'collector' && tab === 'scan'
      && el('screen-collector-scan')?.classList.contains('wizard-mode')) return null;
  return tab ? { tab, idx: idx + step } : null;
}

function swipeReset() {
  swipe.el = null; swipe.ctx = null; swipe.target = null;
  swipe.dir = null; swipe.dx = 0; swipe.vx = 0;
}

function onSwipeStart(e) {
  if (e.touches.length !== 1) return;
  if (activeGlide) return; // a glide is still finishing — don't fight it
  const screen = e.currentTarget;
  if (!screen.classList.contains('active')) return;
  // The wizard owns its exits (Back/Cancel → guard); never let a swipe
  // abandon an in-progress deposit.
  if (screen.classList.contains('wizard-mode')) return;
  const ctx = swipeScreenContext(screen);
  if (!ctx) return;
  // Never hijack touches inside horizontally scrollable children
  let n = e.target;
  while (n && n !== screen) {
    const ox = getComputedStyle(n).overflowX;
    if (ox === 'auto' || ox === 'scroll') return;
    n = n.parentElement;
  }
  // The collection centers map owns its own pan gestures
  if (e.target.closest && e.target.closest('.cc-map')) return;
  const t = e.touches[0];
  swipe.el = screen; swipe.ctx = ctx;
  swipe.x0 = t.clientX; swipe.y0 = t.clientY;
  swipe.t0 = swipe.lastT = performance.now();
  swipe.lastX = t.clientX; swipe.vx = 0;
  swipe.dir = null; swipe.target = null;
}

function onSwipeMove(e) {
  if (!swipe.el || e.touches.length !== 1) return;
  const t = e.touches[0];
  const dx = t.clientX - swipe.x0;
  const dy = t.clientY - swipe.y0;

  if (!swipe.dir) {
    if (Math.abs(dx) < 10) return;
    swipe.dir = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'x' : 'y';
    if (swipe.dir === 'y') { swipeReset(); return; }
    // Horizontal locked: stage the neighbor beneath the current screen
    const nb = swipeNeighbor(swipe.ctx, dx < 0 ? 1 : -1);
    const targetEl = nb && el(`screen-${swipe.ctx.role}-${nb.tab}`);
    if (!targetEl) { swipeReset(); return; } // dead edge — let the gesture go
    swipe.target = { tab: nb.tab, el: targetEl };
    swipe.w = swipe.el.clientWidth;
    // Remove the entrance class from the outgoing screen so no CSS animation
    // can restart or fight the inline transform we're about to drive.
    swipe.el.classList.remove('screen-enter');
    swipe.el.classList.add('swipe-current');
    targetEl.classList.add('active', 'swipe-under');
  }

  e.preventDefault();
  const now = performance.now();
  if (now > swipe.lastT) swipe.vx = (t.clientX - swipe.lastX) / (now - swipe.lastT);
  swipe.lastX = t.clientX; swipe.lastT = now;
  swipe.dx = dx;

  const w = swipe.w;
  swipe.el.style.transform = `translateX(${dx}px)`;
  swipe.target.el.style.transform = `translateX(${dx < 0 ? dx + w : dx - w}px)`;
}

function onSwipeEnd(e) {
  if (!swipe.el) return;
  const cur = swipe.el, ctx = swipe.ctx, tgt = swipe.target;
  const w = swipe.w, vx = swipe.vx;
  const dx = e.changedTouches[0].clientX - swipe.x0;
  const lockEngaged = !!tgt;
  const cancelled = e.type === 'touchcancel' || e.touches.length > 0;
  swipeReset();

  // No horizontal lock engaged (tap or vertical scroll) — nothing to finish
  if (!lockEngaged) return;

  // Cancels and multi-touch remnants never commit — always snap back
  const commit = !cancelled &&
    (Math.abs(dx) > w * 0.3 || (Math.abs(dx) > 40 && Math.abs(vx) > 0.5));
  releaseSwipe(cur, ctx, tgt, dx, commit, w);
}

function releaseSwipe(cur, ctx, tgt, dx, commit, w) {
  if (commit) {
    // Nav feedback lands immediately — not after the glide
    updateNavActive('nav-' + ctx.role, 'navbtn-' + ctx.role + '-' + tgt.tab);
    // Heavy content refresh BEFORE the glide, so no re-render frame lands
    // right as the motion ends (that read as "hang, then snap").
    refreshTab(ctx.role, tgt.tab);
    // Both screens are already staged at the finger's position — glideTo
    // just retargets the existing transforms to the finish line.
    glideTo(cur, tgt.el, dx < 0 ? 'right' : 'left', true);
    return;
  }

  // Snap back: current returns on top, neighbor retreats off-screen
  const dur = '0.2s';
  cur.style.transition = `transform ${dur} var(--ease-out)`;
  tgt.el.style.transition = `transform ${dur} var(--ease-out)`;
  cur.style.transform = 'translateX(0)';
  tgt.el.style.transform = `translateX(${dx < 0 ? w : -w}px)`;

  activeGlide = {
    mode: 'revert', timer: 0,
    finish: () => {
      tgt.el.classList.remove('active', 'swipe-under');
      cur.classList.remove('swipe-current');
      cur.style.cssText = '';
      tgt.el.style.cssText = '';
    },
  };
  activeGlide.timer = setTimeout(glideFinish, 230);
}

function initSwipeNavigation() {
  document.querySelectorAll('.screen').forEach(s => {
    s.addEventListener('touchstart', onSwipeStart, { passive: true });
    s.addEventListener('touchmove', onSwipeMove, { passive: false });
    s.addEventListener('touchend', onSwipeEnd);
    s.addEventListener('touchcancel', onSwipeEnd);
  });
}

// --- AUTHENTICATION ---
// One-shot post-login entrance: strip + reflow + re-add restarts the CSS
// sequence, then the class is removed so returning to home (a high-frequency
// tab) never replays the drama.
function playHomeEntrance(screenId) {
  const s = el(screenId);
  if (!s) return;
  s.classList.remove('entrance-dramatic');
  void s.offsetWidth; // force reflow so re-adding restarts the animation
  s.classList.add('entrance-dramatic');
  setTimeout(() => s.classList.remove('entrance-dramatic'), 1500);
}

function doLogin() {
  if (!el('screen-login').classList.contains('active')) return;
  const email = (el('login-email')?.value || '').trim();
  const password = el('login-password')?.value || '';
  const errorEl = el('login-error');

  if (!email || !password) {
    showLoginError('Please enter your email and password.');
    return;
  }

  const account = AppState.accounts.find(a => a.email.toLowerCase() === email.toLowerCase() && a.password === password);
  if (!account) {
    showLoginError('Incorrect email or password. Please try again.');
    return;
  }

  if (errorEl) errorEl.style.display = 'none';
  AppState.currentUser = account;
  saveState();

  showToast(`Welcome back, ${account.name}!`, 'success');

  // Arm the EcoToken count-up for exactly this render, then disarm —
  // the count plays once, on login, and never on returning to Home.
  countUpArmed = true;
  const route = () => {
    if (account.role === 'resident') {
      showResidentTab('home');
      updateResidentUI();
      playHomeEntrance('screen-resident-home');
    } else if (account.role === 'collector') {
      showCollectorTab('home');
      updateCollectorUI();
      playHomeEntrance('screen-collector-home');
    } else if (account.role === 'admin') {
      showAdminTab('home');
      updateAdminUI();
      playHomeEntrance('screen-admin-home');
    }
    countUpArmed = false;
    const screen = el(
      account.role === 'resident' ? 'screen-resident-home'
      : account.role === 'collector' ? 'screen-collector-home'
      : 'screen-admin-home'
    );
    const heading = screen && (screen.querySelector('.greeting-name') || screen.querySelector('.admin-identity-role'));
    if (heading) heading.focus({ preventScroll: true });
  };

  route();
}

function showLoginError(msg) {
  const errorEl = el('login-error');
  if (!errorEl) {
    showToast(msg, 'error');
    return;
  }
  errorEl.textContent = msg;
  errorEl.style.display = 'block';
}

function doLogout() {
  AppState.currentUser = null;
  saveState();
  showScreen('screen-welcome');
  showToast('Successfully logged out', 'info');
}

function doRegister(event) {
  if (event && event.preventDefault) event.preventDefault();
  const name = el('reg-name')?.value?.trim();
  const contact = el('reg-contact')?.value?.trim();
  const barangay = el('reg-barangay')?.value;
  const email = el('reg-email')?.value?.trim();
  const password = el('reg-password')?.value;

  if (!name || !email || !password) {
    showToast('Please fill out all required fields', 'error');
    return;
  }

  const existing = AppState.accounts.find(a => a.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    showToast('An account with this email already exists', 'error');
    return;
  }

  const newId = 'RES-' + (new Date().getFullYear()) + '-' + String(AppState.accounts.length + 1).padStart(3, '0');
  const newAccount = {
    email,
    password,
    role: 'resident',
    name,
    id: newId,
    contact: contact || '09170000000',
    barangay: barangay || 'Barangay San Gabriel',
    municipality: 'Tuguegarao City',
    registeredDate: new Date().toISOString().split('T')[0]
  };

  AppState.accounts.push(newAccount);
  saveState();

  showToast('Account created successfully! Please log in.', 'success');
  fillDemo(email, password);
  showScreen('screen-login');
}

function togglePassword() {
  const inp = el('login-password');
  if (!inp) return;
  const isText = inp.type === 'password';
  inp.type = isText ? 'text' : 'password';
  const wrap = inp.closest('.input-icon-wrap');
  if (wrap) {
    const open = wrap.querySelector('.eye-open');
    const closed = wrap.querySelector('.eye-closed');
    if (open) open.style.display = isText ? 'none' : '';
    if (closed) closed.style.display = isText ? '' : 'none';
  }
}

function toggleRegisterPassword() {
  const inp = el('reg-password');
  if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
}

function fillDemo(email, password) {
  const eEl = el('login-email');
  const pEl = el('login-password');
  if (eEl) {
    eEl.value = email;
    eEl.style.borderColor = '#3C8D70';
    setTimeout(() => { eEl.style.borderColor = ''; }, 600);
  }
  if (pEl) pEl.value = password;
  const errorEl = el('login-error');
  if (errorEl) errorEl.style.display = 'none';
  document.querySelectorAll('.demo-account').forEach(card => {
    const isThis = card.getAttribute('onclick')?.includes(email);
    card.classList.toggle('selected-demo', !!isThis);
  });
  showToast(`Loaded ${email.split('.')[1] || 'demo'} credentials`, 'info');
}

function toggleDemoPanel() {
  const body = el('demo-panel-body');
  const toggle = el('demo-panel-toggle');
  const chevron = el('demo-chevron');
  if (!body) return;
  const isHidden = body.style.display === 'none' || body.style.display === '';
  body.style.display = isHidden ? 'flex' : 'none';
  if (toggle) {
    toggle.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    toggle.classList.toggle('active', isHidden);
  }
  if (chevron) {
    chevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
  }
}

function sendPasswordReset() {
  showToast('Password reset link sent to your registered email!', 'info');
  closeModal('modal-forgot-password');
}

// --- QR CODE GENERATION ---
function generateQRPattern(seed) {
  let hash = 0;
  const str = String(seed || 'RES-2024-001');
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  const SIZE = 21; // standard QR module size
  const cells = [];
  // Finder squares (7x7) at top-left, top-right, bottom-left
  const finderAt = (r, c) => {
    const boxes = [[0, 0], [0, SIZE - 7], [SIZE - 7, 0]];
    for (const [br, bc] of boxes) {
      if (r >= br && r < br + 7 && c >= bc && c < bc + 7) {
        const lr = r - br, lc = c - bc;
        const onBorder = lr === 0 || lr === 6 || lc === 0 || lc === 6;
        const inCore = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
        return onBorder || inCore ? 'dark' : 'light';
      }
    }
    return null;
  };
  for (let i = 0; i < SIZE * SIZE; i++) {
    const row = Math.floor(i / SIZE);
    const col = i % SIZE;
    const finder = finderAt(row, col);
    if (finder) { cells.push(finder); continue; }
    // Timing patterns (row/col 6, alternating) outside finder zones
    if (row === 6 || col === 6) {
      cells.push(((row + col) % 2 === 0) ? 'dark' : 'light');
      continue;
    }
    const val = (hash ^ (i * 2654435761)) & 0x7fffffff;
    cells.push(val % 3 !== 0 ? 'dark' : 'light');
  }
  return cells;
}

function renderQRGrid(containerId, seed) {
  const container = el(containerId);
  if (!container) return;
  const pattern = generateQRPattern(seed || 'RES-2024-001');
  container.innerHTML = pattern.map(c => `<div class="qr-cell ${c}"></div>`).join('');
}

function renderQRScreen() {
  const user = AppState.currentUser || AppState.accounts[0];
  setText('qr-resident-name', user.name);
  setText('qr-resident-id', user.id);
  renderQRGrid('qr-code-display', user.id);
  renderQRGrid('qr-code-display-modal', user.id);
  const display = el('qr-code-display');
  if (display) display.setAttribute('aria-label', `Resident QR code for ${user.name}, resident ID ${user.id}`);
}

// Resident pickup code: a per-render QR whose seed ties it to the resident,
// shown on Home so a collector can scan it at collection.
function generatePickupQr() {
  const user = AppState.currentUser || AppState.accounts[0];
  const seed = `PICKUP-${user.id}-${Date.now()}`;
  const display = el('pickup-qr-display');
  if (!display) return;
  const cells = generateQRPattern(seed);
  display.innerHTML = cells.map(c => `<div class="qr-cell ${c}"></div>`).join('');
  display.setAttribute('aria-label', `Pickup QR code for ${user.name}`);
}

function openPickupQrModal() {
  openModal('modal-pickup-qr');
  generatePickupQr();
}

function currentResidentUser() {
  return AppState.currentUser || AppState.accounts[0];
}

async function copyTextWithFallback(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  let copied = false;
  try { copied = document.execCommand('copy'); } catch (e) { copied = false; }
  area.remove();
  return copied;
}

async function copyResidentId() {
  const user = currentResidentUser();
  try {
    const ok = await copyTextWithFallback(user.id);
    if (!ok) throw new Error('clipboard unavailable');
    const label = el('btn-copy-qr-id-label');
    if (label) label.textContent = 'Copied';
    showToast('Resident ID copied to clipboard.', 'success');
    setTimeout(() => { if (label) label.textContent = 'Copy ID'; }, 2000);
  } catch (e) {
    showToast('Could not copy. Resident ID: ' + user.id, 'error');
  }
}

// The on-screen QR is a deterministic pattern grid; export the exact same
// modules as a crisp PNG so downloads always match what the user sees.
function createResidentQrBlob() {
  const user = currentResidentUser();
  const cells = generateQRPattern(user.id);
  const SIZE = 21, QUIET = 4, CELL = 24;
  const dim = (SIZE + QUIET * 2) * CELL;
  const canvas = document.createElement('canvas');
  canvas.width = dim;
  canvas.height = dim;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, dim, dim);
  ctx.fillStyle = '#1A2332';
  cells.forEach((cell, i) => {
    if (cell !== 'dark') return;
    const row = Math.floor(i / SIZE), col = i % SIZE;
    ctx.fillRect((col + QUIET) * CELL, (row + QUIET) * CELL, CELL, CELL);
  });
  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
}

async function downloadResidentQr() {
  const user = currentResidentUser();
  const blob = await createResidentQrBlob();
  if (!blob) {
    showToast('QR export is not available in this browser.', 'error');
    return;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rikna-resident-qr-${user.id}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  showToast('QR image downloaded.', 'success');
}

async function shareResidentQr() {
  const user = currentResidentUser();
  const blob = await createResidentQrBlob();
  if (!blob) {
    showToast('QR export is not available in this browser.', 'error');
    return;
  }
  const file = new File([blob], `rikna-resident-qr-${user.id}.png`, { type: 'image/png' });
  const payload = { title: 'Rikna Resident QR', text: `Resident ID ${user.id}` };
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ ...payload, files: [file] });
      return;
    }
    if (navigator.share) {
      await navigator.share(payload);
      return;
    }
    await copyResidentId();
    showToast('Sharing is not supported here. Resident ID copied instead.', 'info');
  } catch (e) {
    if (e && e.name !== 'AbortError') showToast('Sharing was cancelled.', 'info');
  }
}

// --- RESIDENT DASHBOARD & PROFILE ---
function getTimeOfDay() {
  const h = new Date().getHours();
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
}

function updateResidentUI() {
  const r = AppState.resident;
  setNumberAnimated('resident-points-display', r.points);
  setNumberAnimated('wallet-available', r.points);
  setNumberAnimated('rewards-points-balance', r.points);
  setText('wallet-pending', r.pendingPoints.toLocaleString());
  setText('wallet-lifetime', r.lifetimePoints.toLocaleString());
  setText('resident-kg-display', r.kgRecycled.toFixed(1) + ' kg');
  setText('resident-deposits-display', r.deposits.toLocaleString());
  setText('rewards-points-balance', r.points.toLocaleString());
  setText('rewards-balance-display', r.points.toLocaleString());

  const user = AppState.currentUser || AppState.accounts[0];
  setText('resident-greeting', 'Good ' + getTimeOfDay() + ', ' + user.name.split(' ')[0] + '!');
  setText('resident-barangay-text', user.barangay);

  updateNotifBadge('resident');
  renderHomeRecentTransactions();
  renderTransactions(walletTabFilter);
  renderRewards();
  renderVouchers(voucherTabFilter);
  renderQRScreen();
  renderProfileScreen();
  renderHomeActivities();
  renderEventPasses();
}

function updateResidentHomeUI() {
  const r = AppState.resident;
  setNumberAnimated('resident-points-display', r.points);
  setText('resident-kg-display', r.kgRecycled.toFixed(1) + ' kg');
  setText('resident-deposits-display', r.deposits.toLocaleString());
  const user = AppState.currentUser || AppState.accounts[0];
  setText('resident-greeting', 'Good ' + getTimeOfDay() + ', ' + user.name.split(' ')[0] + '!');
  setText('resident-barangay-text', user.barangay);
  updateNotifBadge('resident');
  renderHomeRecentTransactions();
  renderHomeActivities();
  renderEventPasses();
}

function renderHomeRecentTransactions() {
  const container = el('resident-recent-tx-list') || el('home-recent-tx');
  if (!container) return;
  const recent = AppState.resident.transactions.slice(0, 3);
  if (!recent.length) {
    container.innerHTML = '<p class="home-empty">Your recycling story starts here. Present your QR at a collection center to record your first deposit.</p>';
    return;
  }
  container.replaceChildren(...recent.map(createActivityRow));
}

// Shared by Home and EcoWallet; data is inserted as text, never markup.
function createActivityRow(tx) {
    const row = document.createElement('button');
    row.type = 'button';
    const state = tx.status === 'verified' ? 'earned' : tx.status === 'redeemed' ? 'spent' : 'pending';
    row.className = `activity-row activity-${state}`;
    row.innerHTML = `${homeMaterialIcon(tx.material, tx.type)}
      <span class="activity-copy"><strong></strong><span class="activity-meta"></span><span class="activity-status"></span></span>
      <span class="activity-amount"><strong></strong><small>EcoToken</small></span>`;
    row.querySelector('.activity-copy strong').textContent = tx.label;
    row.querySelector('.activity-meta').textContent = formatDate(tx.date) + (tx.kg != null ? ' · ' + tx.kg + ' kg' : '');
    row.querySelector('.activity-status').textContent = tx.status || 'Status unavailable';
    row.querySelector('.activity-amount strong').textContent = (tx.points > 0 ? '+' : '') + tx.points.toLocaleString();
    row.addEventListener('click', () => openTransactionDetail(tx.id));
    return row;
}

// Static outline paths share the dashboard's existing 24px icon vocabulary.
function homeMaterialIcon(material = '', type = 'earned') {
  let path = '<path d="m5 7 3-4 3 4M8 3v9m11 5-3 4-3-4m3 4V12M3 16l4 3m14-11-4-3"/>';
  if (/plastic|glass/i.test(material)) {
    path = '<path d="M9 3h6v4l3 5v9H6v-9l3-5V3Zm0 4h6M6 13h12M6 17h12"/>';
  } else if (/alum|tin|steel/i.test(material)) {
    path = '<ellipse cx="12" cy="5" rx="6" ry="2"/><path d="M6 5v14c0 3 12 3 12 0V5M9 9v8m6-8v8"/>';
  } else if (/paper|cardboard/i.test(material)) {
    path = '<path d="M5 3h11l3 3v15H5V3Zm10 0v5h4M8 12h8m-8 4h6"/>';
  }
  if (type === 'spent') {
    path = '<path d="M3 6h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4V6Zm12 0v3m0 2v2m0 2v3"/>';
  }
  return `<span class="activity-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${path}</svg></span>`;
}

function renderHomeActivities() {
  const container = el('home-activities-list');
  if (!container) return;
  const events = AppState.activities.filter(a => a.status === 'approved').slice(0, 2);
  if (!events.length) {
    container.innerHTML = '<p class="home-empty">No barangay activities posted yet. Check back for the next community event.</p>';
    return;
  }
  const cards = events.map(a => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'home-event';
    card.innerHTML = `<span class="home-event-date"><span class="home-event-month"></span><strong></strong><span class="home-event-year"></span></span>
      <span class="home-event-copy"><strong></strong><span class="home-event-location"></span><span class="home-event-time"></span>
      <span class="home-event-footer"><span class="home-event-reward"></span><button type="button" class="home-event-register"></button></span></span>`;
    const date = new Date(a.date + 'T00:00:00');
    const validDate = !Number.isNaN(date.getTime());
    card.querySelector('.home-event-month').textContent = validDate ? date.toLocaleDateString('en-US', { month: 'short' }) : 'Date';
    card.querySelector('.home-event-date strong').textContent = validDate ? date.getDate() : '—';
    card.querySelector('.home-event-year').textContent = validDate ? date.getFullYear() : 'To follow';
    card.querySelector('.home-event-copy > strong').textContent = a.name;
    card.querySelector('.home-event-location').textContent = a.location;
    card.querySelector('.home-event-time').textContent = a.startTime || a.time || '';
    const reward = card.querySelector('.home-event-reward');
    reward.textContent = a.participationPts > 0 ? '+' + a.participationPts.toLocaleString() + ' EcoToken' : '';
    const regBtn = card.querySelector('.home-event-register');
    if (isEventRegistered(a.id)) {
      regBtn.textContent = 'Registered ✓';
      regBtn.classList.add('registered');
      regBtn.disabled = true;
    } else {
      regBtn.textContent = 'Register';
      regBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // don't open the detail modal behind the button
        toggleEventRegistration(a.id);
      });
    }
    card.addEventListener('click', () => openActivityDetail(a.id));
    return card;
  });
  container.replaceChildren(...cards);
}

function openActivityDetail(actId) {
  const a = AppState.activities.find(x => x.id === actId);
  if (!a) return;
  setText('event-detail-name', a.name);
  setText('event-detail-date', formatDate(a.date) + ' • ' + a.location);
  setText('event-detail-location', a.location);
  setText('event-detail-desc', a.description);
  setText('event-detail-pts', '+' + a.participationPts + ' EcoToken for participation');
  const regBtn = el('event-detail-register');
  if (regBtn) {
    if (isEventRegistered(actId)) {
      regBtn.textContent = 'Registered ✓ — pass is in Home';
      regBtn.disabled = true;
    } else {
      regBtn.textContent = "I'm Interested — Register";
      regBtn.disabled = false;
      regBtn.onclick = () => {
        toggleEventRegistration(actId);
        openActivityDetail(actId); // refresh the button state inside the open modal
      };
    }
  }
  openModal('modal-event-detail');
}

// --- EVENT REGISTRATION & ATTENDANCE PASSES ---
function isEventRegistered(actId) {
  return (AppState.resident.registeredEvents || []).includes(actId);
}

function toggleEventRegistration(actId) {
  const a = AppState.activities.find(x => x.id === actId);
  if (!a) return;
  const list = AppState.resident.registeredEvents || (AppState.resident.registeredEvents = []);
  if (list.includes(actId)) return;
  list.push(actId);
  saveState();
  renderHomeActivities();
  renderEventPasses();
  showToast('Registered! Your attendance pass is ready in Home.', 'success');
}

function renderEventPasses() {
  const slot = el('event-passes-slot');
  if (!slot) return;
  const regs = (AppState.resident.registeredEvents || [])
    .map(id => AppState.activities.find(a => a.id === id))
    .filter(Boolean);
  slot.replaceChildren();
  if (!regs.length) return; // hidden until the resident registers
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'card event-passes-card';
  btn.innerHTML = `<span class="event-passes-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2M13 17v2M13 11v2"/></svg></span>
    <span class="event-passes-copy"><strong>Event Passes</strong><span class="event-passes-sub"></span></span>
    <svg class="event-passes-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>`;
  btn.querySelector('.event-passes-sub').textContent =
    regs.length + (regs.length === 1 ? ' event registered — tap to view your attendance pass' : ' events registered — tap to view your passes');
  btn.addEventListener('click', openEventPasses);
  slot.appendChild(btn);
}

function openEventPasses() {
  const regs = (AppState.resident.registeredEvents || [])
    .map(id => AppState.activities.find(a => a.id === id))
    .filter(Boolean);
  const user = AppState.currentUser || AppState.accounts[0];
  const list = el('event-pass-list');
  if (!list) return;
  if (!regs.length) { openModal('modal-event-pass'); return; }
  list.replaceChildren(...regs.map(a => {
    const pass = document.createElement('div');
    pass.className = 'event-pass';
    const head = document.createElement('div');
    head.className = 'event-pass-head';
    const name = document.createElement('strong');
    name.textContent = a.name;
    const meta = document.createElement('span');
    meta.textContent = formatDate(a.date) + ' • ' + a.location;
    head.append(name, meta);
    const bcWrap = document.createElement('div');
    bcWrap.className = 'barcode-wrap';
    bcWrap.appendChild(buildBarcodeSvg((user.id || 'RES') + '|' + a.id));
    const caption = document.createElement('p');
    caption.className = 'event-pass-caption';
    caption.textContent = 'Present this barcode at event check-in';
    pass.append(head, bcWrap, caption);
    return pass;
  }));
  openModal('modal-event-pass');
}

// Deterministic attendance barcode: hash-driven bar/gap widths from the seed,
// same one-way trick as generateQRPattern (demo pattern, not a retail barcode).
function buildBarcodeSvg(seed) {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Attendance barcode');
  const src = seed + '|' + seed;
  const runs = [];
  for (let i = 0; i < src.length; i++) {
    const c = src.charCodeAt(i);
    runs.push([1 + (c % 3), 1 + ((c >> 3) % 3)]);
  }
  let width = 4; // quiet zone
  for (const [bar, gap] of runs) width += bar + gap;
  width += 3;
  svg.setAttribute('viewBox', '0 0 ' + width + ' 40');
  let x = 2;
  for (const [bar, gap] of runs) {
    const r = document.createElementNS(NS, 'rect');
    r.setAttribute('x', x);
    r.setAttribute('y', '0');
    r.setAttribute('width', bar);
    r.setAttribute('height', '40');
    r.setAttribute('fill', '#1A2332');
    svg.appendChild(r);
    x += bar + gap;
  }
  return svg;
}

// Self-check: identical seeds must render identical barcodes.
(function barcodeSelfCheck() {
  const a = buildBarcodeSvg('SEED');
  const b = buildBarcodeSvg('SEED');
  console.assert(a.isEqualNode(b), 'barcode generator must be deterministic');
})();

function renderProfileScreen() {
  const user = AppState.currentUser || AppState.accounts[0];
  const r = AppState.resident;

  setText('profile-name', user.name);
  setText('profile-email', user.email);
  setText('profile-email-detail', user.email);
  setText('profile-member-since', 'Member since ' + formatDate(user.registeredDate || '2024-03-15'));
  setText('profile-id', user.id);
  setText('profile-display-phone', user.contact);
  setText('profile-barangay', user.barangay);
  setText('profile-barangay-detail', user.barangay);
  setText('profile-municipality', user.municipality || 'Tuguegarao City');
  setText('profile-total-kg', r.kgRecycled.toFixed(1));
  setText('profile-total-deposits', String(r.deposits));
  setText('profile-lifetime-pts', r.lifetimePoints.toLocaleString());

  const avatar = el('profile-avatar');
  if (avatar) {
    avatar.textContent = user.name.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  // Prepopulate edit inputs
  const nameInp = el('profile-edit-name') || el('edit-name');
  const phoneInp = el('profile-edit-phone') || el('edit-contact');
  const emailInp = el('profile-edit-email') || el('edit-email');

  if (nameInp) nameInp.value = user.name;
  if (phoneInp) phoneInp.value = user.contact;
  if (emailInp) emailInp.value = user.email;

  setText('profile-language-label', (user.lang === 'tl' ? 'Tagalog' : 'English'));
  setText('profile-philsys-badge', user.philSysVerified ? 'Verified' : 'Not verified');
}

function toggleLanguage() {
  const user = AppState.currentUser || AppState.accounts.find(a => a.role === 'resident');
  if (!user) return;
  user.lang = user.lang === 'tl' ? 'en' : 'tl';
  saveState();
  renderProfileScreen();
  showToast(user.lang === 'tl' ? 'Tagalog' : 'English', 'info');
}

function verifyPhilSys() {
  const user = AppState.currentUser || AppState.accounts.find(a => a.role === 'resident');
  if (!user) return;
  user.philSysVerified = true;
  saveState();
  renderProfileScreen();
  showToast('PhilSys ID verified and linked', 'success');
  closeModal('modal-philsys');
}

function setEditProfilePanel(open) {
  const panel = el('edit-profile-panel');
  if (!panel) return;

  if (open) panel.removeAttribute('hidden');
  else panel.setAttribute('hidden', '');
  panel.setAttribute('aria-hidden', open ? 'false' : 'true');

  document.querySelectorAll('[aria-controls="edit-profile-panel"]').forEach(btn => {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  if (open) {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    panel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
  }
}

function toggleEditProfilePanel() {
  const panel = el('edit-profile-panel');
  if (!panel) return;
  setEditProfilePanel(panel.hasAttribute('hidden'));
}

function toggleEditProfile() {
  toggleEditProfilePanel();
}

// --- COLLECTOR PROFILE SCREEN ---
function renderCollectorProfileScreen() {
  const user = AppState.currentUser || AppState.accounts.find(a => a.role === 'collector');
  if (!user) return;
  const col = AppState.collectors.find(c => (user.id && c.id === user.id) || (user.email && c.email === user.email));
  const collectorId = user.id || col?.id;
  const barangay = col?.barangay || user.barangay || '—';
  const registeredDate = user.registeredDate || col?.registeredDate;
  const registered = registeredDate ? formatDate(registeredDate) : 'Not recorded';
  const status = user.status === 'restricted' || col?.status === 'restricted'
    ? 'restricted' : (col?.status || user.status);
  setText('collector-profile-name', user.name);
  setText('collector-profile-email', user.email);
  setText('collector-profile-email-detail', user.email || '—');
  setText('collector-profile-id', collectorId || '—');
  setText('collector-profile-id-detail', collectorId || '—');
  setText('collector-profile-barangay', barangay);
  setText('collector-profile-barangay-detail', barangay);
  setText('collector-profile-contact', user.contact || col?.contact || col?.phone || '—');
  setText('collector-profile-since', registered);
  setText('collector-profile-registered', registeredDate ? 'Registered ' + registered : 'Registration date not recorded');
  const statusEl = el('collector-profile-status');
  if (statusEl) {
    statusEl.textContent = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Not recorded';
    statusEl.classList.toggle('is-restricted', status === 'restricted');
  }
  setText('collector-profile-authorization', status === 'active' ? 'Authorized Collector' : status === 'restricted' ? 'Collector · restricted' : 'Collector');
  el('collector-profile-authorization')?.closest('.pf-role-chip')?.classList.toggle('is-restricted', status === 'restricted');

  // Account totals include history beyond the available deposit records. Only
  // explicitly verified records can support a verified-deposit count.
  const records = (AppState.collectionRecords || []).filter(record => record.collectorId
    ? Boolean(collectorId && record.collectorId === collectorId)
    : Boolean(user.name && record.collector === user.name));
  const verified = records.filter(record => record.status === 'verified' && !record.flagged);
  const waste = col?.totalWaste ?? records.reduce((total, record) => total + (Number(record.weight) || 0), 0);
  const points = col?.totalPoints ?? verified.reduce((total, record) => total + (Number(record.points) || 0), 0);
  setText('collector-profile-total-kg', Number(waste).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }));
  setText('collector-profile-total-points', Number(points).toLocaleString());
  setText('collector-profile-verified-deposits', verified.length.toLocaleString());

  const materialsAvailable = Array.isArray(AppState.wasteMaterials);
  const materials = materialsAvailable ? AppState.wasteMaterials.filter(material => material.enabled) : [];
  const typesItem = el('collector-profile-types-item');
  if (typesItem) typesItem.hidden = !materialsAvailable;
  setText('collector-profile-types', materials.length.toLocaleString());
  const materialsNote = el('collector-profile-materials');
  if (materialsNote) {
    materialsNote.hidden = !materialsAvailable;
    materialsNote.textContent = materials.length
      ? 'Program accepts: ' + materials.map(material => material.name).join(', ') + '.'
      : 'No waste types are currently enabled in the program.';
  }
  const avatar = el('collector-profile-avatar');
  if (avatar) avatar.textContent = getInitials(user.name || '');
}

// --- ADMIN PROFILE SCREEN ---
function renderAdminProfileScreen() {
  const user = AppState.currentUser || AppState.accounts.find(a => a.role === 'admin');
  if (!user) return;
  setText('admin-profile-name', user.name);
  setText('admin-profile-email', user.email);
  setText('admin-profile-email-detail', user.email || '—');
  setText('admin-profile-id', user.id || '—');
  setText('admin-profile-barangay', user.barangay || '—');
  setText('admin-profile-office', user.barangay || 'Office not recorded');
  setText('admin-profile-contact', user.contact || '—');
  const registered = user.registeredDate ? formatDate(user.registeredDate) : 'Not recorded';
  setText('admin-profile-registration', registered);
  setText('admin-profile-since', user.registeredDate ? 'Administrator since ' + registered : 'Registration date not recorded');
  setText('ap-residents', AppState.admin.registeredResidents.toLocaleString());
  setText('ap-total-waste', AppState.admin.totalWaste.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }));
  setText('ap-points-distributed', AppState.admin.pointsDistributed.toLocaleString());
  setText('ap-vouchers-redeemed', AppState.admin.vouchersRedeemed.toLocaleString());
  const avatar = el('admin-profile-avatar');
  if (avatar) avatar.textContent = user.name.split(' ').filter(n => /^[A-Z]/i.test(n)).map(n => n[0]).join('').substring(0, 2).toUpperCase();
}


function saveProfileEdit() {
  const nameInp = el('profile-edit-name') || el('edit-name');
  const phoneInp = el('profile-edit-phone') || el('edit-contact');

  const name = nameInp?.value?.trim();
  const contact = phoneInp?.value?.trim();

  if (!name) {
    showToast('Name cannot be empty', 'error');
    return;
  }

  const userIdx = AppState.accounts.findIndex(a => a.role === 'resident');
  if (userIdx >= 0) {
    AppState.accounts[userIdx].name = name;
    if (contact) AppState.accounts[userIdx].contact = contact;
  }

  if (AppState.currentUser && AppState.currentUser.role === 'resident') {
    AppState.currentUser.name = name;
    if (contact) AppState.currentUser.contact = contact;
  }

  saveState();
  setEditProfilePanel(false);

  renderProfileScreen();
  showToast('Profile updated successfully!', 'success');
}

function toggleNotifPreferences() {
  showToast('Push notifications & SMS alerts are enabled', 'info');
}

// --- WALLET & TRANSACTIONS ---
function switchWalletTab(tab) {
  renderTransactions(tab);
}

function renderTransactions(filter) {
  if (!['all', 'earned', 'spent'].includes(filter)) filter = 'all';
  walletTabFilter = filter;
  const container = el('wallet-tx-list');
  if (!container) return;

  document.querySelectorAll('#wallet-tab-bar .tab-btn').forEach(button => {
    const selected = button.id === 'wallet-tab-' + filter;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  updateWalletSummary();

  let txs = AppState.resident.transactions;
  if (filter === 'earned') txs = txs.filter(t => t.type === 'earned');
  if (filter === 'spent') txs = txs.filter(t => t.type === 'spent');

  setText('wallet-tx-count', `${txs.length} ${filter === 'all' ? '' : filter + ' '}entr${txs.length === 1 ? 'y' : 'ies'}`);
  if (!txs.length) {
    const empty = document.createElement('p');
    empty.className = 'home-empty';
    empty.textContent = filter === 'spent' ? 'No rewards redeemed yet. Explore Rewards to put your points to use.' : filter === 'earned' ? 'No earned points recorded yet. Present your QR at a collection center to get started.' : 'Your EcoWallet activity will appear here after your first deposit or reward redemption.';
    container.replaceChildren(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  let currentMonth;
  [...txs].sort((a, b) => b.date.localeCompare(a.date)).forEach(tx => {
    const month = tx.date.slice(0, 7);
    if (month !== currentMonth) {
      const heading = document.createElement('h3');
      heading.className = 'wallet-month';
      heading.textContent = walletMonthLabel(month);
      fragment.append(heading);
      currentMonth = month;
    }
    fragment.append(createActivityRow(tx));
  });
  container.replaceChildren(fragment);
}

function walletMonthLabel(month) {
  const date = new Date(month + '-01T00:00:00');
  return Number.isNaN(date.getTime()) ? 'Recorded activity' : date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function updateWalletSummary() {
  const r = AppState.resident;
  setText('wallet-available', r.points.toLocaleString());
  setText('wallet-pending', r.pendingPoints.toLocaleString());
  setText('wallet-lifetime', r.lifetimePoints.toLocaleString());
  const latest = r.transactions.map(tx => tx.date).filter(Boolean).sort().at(-1);
  if (!latest) {
    setText('wallet-insight-title', 'Your recycling, rewarded');
    setText('wallet-insight-detail', 'Your first verified deposit starts your earnings story.');
    return;
  }
  const month = latest.slice(0, 7);
  const earned = r.transactions.filter(tx => tx.date.startsWith(month) && tx.type === 'earned' && tx.status === 'verified');
  const points = earned.reduce((total, tx) => total + tx.points, 0);
  setText('wallet-insight-title', `${points.toLocaleString()} pts earned · ${walletMonthLabel(month)}`);
  setText('wallet-insight-detail', `From ${earned.length} verified entr${earned.length === 1 ? 'y' : 'ies'} in your recorded history.`);
}

function openEcoWalletModal(tab) {
  if (!['balance', 'transactions', 'pending'].includes(tab)) tab = 'balance';
  openModal('modal-ecowallet');
  // Open on the requested pane: Balance | Transactions | Pending
  const btn = el('modal-ecowallet')?.querySelector('.tab-btn[onclick*="' + tab + '"]');
  if (btn && typeof ecwSwitchTab === 'function') ecwSwitchTab(btn, tab);
  renderTransactions('all');
  updateWalletSummary();
}

function openTransactionDetail(txId) {
  const tx = AppState.resident.transactions.find(t => t.id === txId)
          || AppState.collectionRecords.find(t => t.id === txId);
  if (!tx) return;

  const body = el('modal-transaction')?.querySelector('.modal-body');
  if (body) {
    body.innerHTML = `
      <div style="background:#F8FAFC;border-radius:14px;overflow:hidden;border:1px solid #E2E8F0">
        <div style="background:#3C8D70;padding:16px 20px;text-align:center">
          <div style="font-size:12px;font-weight:600;color:rgba(255,255,255,0.8);letter-spacing:0.5px;text-transform:uppercase">Receipt / Verification ID</div>
          <div style="font-family:'Poppins',sans-serif;font-size:18px;font-weight:800;color:white;margin-top:4px">${tx.id}</div>
        </div>
        <div style="padding:6px 0">
          ${detailRow('Category / Label', tx.label || tx.material || 'Recycling')}
          ${detailRow('Transaction Type', (tx.type === 'earned' || tx.weight != null) ? '⬆ Points Earned' : '⬇ Points Redeemed')}
          ${detailRow('Date Recorded', formatDate(tx.date))}
          ${tx.material ? detailRow('Waste Material', tx.material) : ''}
          ${tx.kg ? detailRow('Measured Weight', tx.kg + ' kg') : ''}
          ${tx.weight ? detailRow('Measured Weight', tx.weight + ' kg') : ''}
          ${tx.collector ? detailRow('Collector Officer', tx.collector) : ''}
          ${tx.barangay ? detailRow('Barangay Drop-off', tx.barangay) : ''}
          ${detailRow('EcoToken Impact', (tx.points > 0 ? '+' : '') + tx.points + ' pts')}
          ${detailRow('Verification Status', tx.status || 'Verified')}
          ${tx.remarks ? detailRow('Officer Remarks', tx.remarks) : ''}
        </div>
      </div>
      ${tx.photoDataUrl ? `
        <div style="margin-top:14px;text-align:center">
          <label style="font-size:12px;font-weight:700;color:#64748B;display:block;margin-bottom:6px">DIGITAL SCALE PHOTO EVIDENCE</label>
          <img src="${tx.photoDataUrl}" style="width:100%;border-radius:10px;max-height:160px;object-fit:cover;cursor:pointer;border:1px solid #CBD5E1" onclick="openPhotoPreview('${tx.id}')" />
        </div>
      ` : ''}
      <button class="btn-secondary" style="margin-top:16px;width:100%" onclick="closeModal('modal-transaction')">Close Details</button>
    `;
  }
  openModal('modal-transaction');
}

function detailRow(label, value) {
  return `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 16px;border-bottom:1px solid #EDF2F7;font-size:13.5px"><span style="color:#64748B">${label}</span><span style="font-weight:600;color:#1E293B">${value}</span></div>`;
}

function openPhotoPreview(txId) {
  const tx = AppState.collectionRecords.find(t => t.id === txId) || AppState.resident.transactions.find(t => t.id === txId);
  const fullImg = el('photo-preview-full');
  if (tx && tx.photoDataUrl && fullImg) {
    fullImg.src = tx.photoDataUrl;
  }
  openModal('modal-photo-preview');
}

// --- REWARDS & VOUCHERS ---
const REWARD_CATEGORY_LABELS = Object.freeze({
  grocery: 'Grocery',
  dining: 'Dining',
  essentials: 'Essentials'
});

function rewardInitials(merchant) {
  const cleaned = String(merchant || '').replace(/[^A-Za-z0-9]/g, '');
  return (cleaned.slice(0, 2) || 'RK').toUpperCase();
}

// Presentation-only split: hoist the headline value (₱50, 10%) out of the
// live reward name so the ticket hierarchy reads value → descriptor.
function splitRewardOffer(reward) {
  const name = String(reward.name || '');
  const merchant = String(reward.merchant || '');
  const rest = merchant && name.indexOf(merchant) === 0 ? name.slice(merchant.length).trim() : name.trim();
  const match = rest.match(/[₱$]\s?[\d,.]+|[\d.]+\s?%/);
  let value = '';
  let label = rest;
  if (match) {
    value = match[0].replace(/\s+/g, '');
    label = (rest.slice(0, match.index) + ' ' + rest.slice(match.index + match[0].length)).trim();
  }
  label = label.replace(/\boff\b/gi, 'Discount').replace(/\s+/g, ' ').trim();
  return { value: value || 'Reward', label: label || 'Voucher' };
}

function buildEmptyState(title, message) {
  const wrap = document.createElement('div');
  wrap.className = 'rw-empty';
  const icon = document.createElement('span');
  icon.className = 'rw-empty-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z"></path><path d="m4 8.5 8 4.5 8-4.5M12 13v7"></path></svg>';
  const heading = document.createElement('strong');
  heading.className = 'rw-empty-title';
  heading.textContent = title;
  const text = document.createElement('span');
  text.className = 'rw-empty-text';
  text.textContent = message;
  wrap.append(icon, heading, text);
  return wrap;
}

function buildRewardTicket(reward, userPts) {
  const canRedeem = userPts >= reward.points;
  const needed = Math.max(0, reward.points - userPts);
  const offer = splitRewardOffer(reward);

  const ticket = document.createElement('article');
  ticket.className = 'reward-ticket' + (canRedeem ? '' : ' is-locked');
  ticket.tabIndex = 0;
  ticket.setAttribute('role', 'button');
  ticket.setAttribute('aria-label', 'View ' + reward.name + ' — ' + reward.points.toLocaleString() + ' EcoToken' +
    (canRedeem ? '' : ', ' + needed.toLocaleString() + ' more needed'));
  ticket.addEventListener('click', e => {
    if (e.target.closest('.reward-redeem')) return;
    openRewardDetail(reward.id);
  });
  ticket.addEventListener('keydown', e => {
    if (e.target.closest('.reward-redeem')) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openRewardDetail(reward.id); }
  });

  const top = document.createElement('div');
  top.className = 'reward-top';

  const mark = document.createElement('span');
  mark.className = 'reward-mark';
  mark.dataset.category = reward.category;
  mark.setAttribute('aria-hidden', 'true');
  mark.textContent = rewardInitials(reward.merchant);

  const idBlock = document.createElement('div');
  idBlock.className = 'reward-id';
  const merchant = document.createElement('span');
  merchant.className = 'reward-merchant';
  merchant.textContent = reward.merchant;
  const category = document.createElement('span');
  category.className = 'reward-category';
  category.textContent = REWARD_CATEGORY_LABELS[reward.category] || reward.category;
  idBlock.append(merchant, category);

  const cost = document.createElement('span');
  cost.className = 'reward-cost';
  cost.append(document.createTextNode(reward.points.toLocaleString()));
  const unit = document.createElement('small');
  unit.textContent = 'pts';
  cost.append(unit);

  top.append(mark, idBlock, cost);

  const bottom = document.createElement('div');
  bottom.className = 'reward-bottom';

  const offerRow = document.createElement('div');
  offerRow.className = 'reward-offer';
  const value = document.createElement('span');
  value.className = 'reward-value';
  value.textContent = offer.value;
  const descriptor = document.createElement('span');
  descriptor.className = 'reward-desc';
  descriptor.textContent = offer.label;
  offerRow.append(value, descriptor);

  const redeem = document.createElement('button');
  redeem.type = 'button';
  redeem.className = 'reward-redeem';
  if (canRedeem) {
    redeem.textContent = 'Redeem';
    redeem.addEventListener('click', e => { e.stopPropagation(); openRewardDetail(reward.id); });
  } else {
    redeem.textContent = 'Need ' + needed.toLocaleString();
    redeem.disabled = true;
    redeem.setAttribute('aria-label', 'Need ' + needed.toLocaleString() + ' more EcoToken');
  }
  bottom.append(offerRow, redeem);

  ticket.append(top, bottom);
  return ticket;
}

function syncRewardFilterChips() {
  document.querySelectorAll('.rw-chips .chip').forEach(chip => {
    const isActive = (chip.getAttribute('data-category') || '') === rewardCategoryFilter;
    chip.classList.toggle('active', isActive);
    chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function updateVoucherCounts() {
  const vouchers = AppState.resident.vouchers || [];
  const counts = { active: 0, used: 0, expired: 0 };
  vouchers.forEach(v => {
    if (Object.prototype.hasOwnProperty.call(counts, v.status)) counts[v.status]++;
  });
  setText('rewards-voucher-count', counts.active.toLocaleString());
  setText('vouchers-total', counts.active + ' active');
  setText('voucher-count-active', counts.active);
  setText('voucher-count-used', counts.used);
  setText('voucher-count-expired', counts.expired);
}

function scrollToVouchers() {
  const section = el('my-vouchers');
  if (!section) return;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  section.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

// Category rail: no edge-fade overlays. A partially visible chip is the
// scroll cue, so fades never cover text or the selected state. Kept as a
// no-op (retains dataset flags for compatibility) because render paths
// call it; initRewardsChipScroll only ensures the scroller starts at
// scrollLeft 0 so the first chip is fully visible.
function updateRewardsChipFade() {
  const scroller = el('rw-chips');
  const wrap = el('rw-chips-wrap');
  if (!scroller || !wrap) return;
  const max = scroller.scrollWidth - scroller.clientWidth;
  wrap.dataset.fadeStart = max > 1 && scroller.scrollLeft > 1 ? 'true' : 'false';
  wrap.dataset.fadeEnd = max > 1 && scroller.scrollLeft < max - 1 ? 'true' : 'false';
}

function initRewardsChipScroll() {
  const scroller = el('rw-chips');
  if (!scroller || scroller.dataset.scrollBound === 'true') return;
  scroller.dataset.scrollBound = 'true';
  // Ensure the rail starts at the beginning so the first chip is fully
  // visible; scroll-snap was removed because it snapped the first chip
  // into the padding gutter (clipping "All").
  scroller.scrollLeft = 0;
  scroller.addEventListener('scroll', updateRewardsChipFade, { passive: true });
  window.addEventListener('resize', updateRewardsChipFade, { passive: true });
  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(updateRewardsChipFade).observe(scroller);
  }
  updateRewardsChipFade();
}

function filterRewards(cat) {
  rewardCategoryFilter = cat;
  syncRewardFilterChips();
  renderRewards();
}

function renderRewards() {
  const container = el('rewards-grid');
  if (!container) return;

  const userPts = AppState.resident.points;
  setText('rewards-points-balance', userPts.toLocaleString());
  setText('rewards-balance-display', userPts.toLocaleString());

  let rewards = AppState.rewards.filter(r => r.available);
  if (rewardCategoryFilter !== 'all') {
    rewards = rewards.filter(r => r.category === rewardCategoryFilter);
  }

  syncRewardFilterChips();
  initRewardsChipScroll();
  updateRewardsChipFade();
  updateVoucherCounts();
  setText('rewards-count', rewards.length === 1 ? '1 reward' : rewards.length + ' rewards');

  container.replaceChildren();
  if (!rewards.length) {
    container.append(buildEmptyState('No rewards in this category', 'Try another category to see more vouchers.'));
    return;
  }

  const frag = document.createDocumentFragment();
  rewards.forEach(r => frag.append(buildRewardTicket(r, userPts)));
  container.append(frag);
}

function openRewardDetail(rewardId) {
  currentRewardId = rewardId;
  const r = AppState.rewards.find(x => x.id === rewardId);
  if (!r) return;

  const userPts = AppState.resident.points;
  const canRedeem = userPts >= r.points && r.available;

  setText('vd-name', r.name);
  setText('vd-merchant', r.merchant);
  setText('vd-desc', r.description);
  setText('vd-pts-required', r.points.toLocaleString() + ' EcoToken');
  setText('vd-user-pts', userPts.toLocaleString() + ' EcoToken');

  const statusEl = el('vd-pts-status');
  if (statusEl) {
    statusEl.textContent = canRedeem ? '✓ You have sufficient points' : '✕ Insufficient points balance';
    statusEl.style.color = canRedeem ? '#166534' : '#DC2626';
    statusEl.style.fontWeight = '700';
  }

  const btn = el('btn-redeem-voucher');
  if (btn) {
    btn.disabled = !canRedeem;
    btn.onclick = canRedeem ? confirmRedemptionOpen : null;
  }

  openModal('modal-voucher-detail');
}

function confirmRedemptionOpen() {
  const r = AppState.rewards.find(x => x.id === currentRewardId);
  if (!r) return;
  // A fresh confirmation is a fresh submission window.
  redemptionInFlight = false;
  const confirmBtn = el('btn-confirm-redeem');
  if (confirmBtn) confirmBtn.disabled = false;
  const after = AppState.resident.points - r.points;
  setText('vc-reward-name', r.name);
  setText('vc-pts-deduct', r.points + ' EcoToken');
  setText('vc-pts-after', after.toLocaleString() + ' EcoToken');
  closeModal('modal-voucher-detail');
  openModal('modal-voucher-confirm');
}

function confirmRedemption() {
  const r = AppState.rewards.find(x => x.id === currentRewardId);
  if (!r) return;
  if (AppState.resident.points < r.points) {
    showToast('Insufficient points balance', 'error');
    return;
  }

  // Guard against a double tap queuing two redemptions before the modal closes.
  if (redemptionInFlight) return;
  redemptionInFlight = true;
  const confirmBtn = el('btn-confirm-redeem');
  if (confirmBtn) confirmBtn.disabled = true;

  const code = (r.merchant.substring(0, 2).toUpperCase().replace(/[^A-Z]/g, 'X')) + '-RKN-' + Math.floor(1000 + Math.random() * 9000);
  const expiry = '2027-06-30';
  const voucher = {
    id: 'VCH' + uid(),
    name: r.name,
    code,
    status: 'active',
    pointsSpent: r.points,
    expiry,
    merchant: r.merchant,
    redeemedDate: new Date().toISOString().split('T')[0]
  };

  AppState.resident.vouchers.unshift(voucher);
  AppState.resident.points -= r.points;
  AppState.resident.transactions.unshift({
    id: 'TXN' + uid(),
    type: 'spent',
    label: r.name,
    points: -r.points,
    date: new Date().toISOString().split('T')[0],
    status: 'redeemed'
  });
  AppState.admin.vouchersRedeemed++;

  AppState.notifications.resident.unshift({
    id: 'RNOTIF' + uid(),
    title: 'Voucher Redeemed!',
    body: `You redeemed ${r.name} for ${r.points} EcoToken. Claim Code: ${code}`,
    time: nowStr(),
    read: false,
    link: 'rewards'
  });

  AppState.auditLog.unshift({
    timestamp: nowStr(),
    action: 'Voucher redeemed',
    detail: `${r.name} — ${r.points} pts (Code: ${code})`
  });

  setText('vs-code', code);
  setText('vs-expiry', 'Valid until ' + formatDate(expiry));
  generateBarcode('vs-barcode', code);

  saveState();
  updateResidentUI();
  updateAdminUI();

  closeModal('modal-voucher-confirm');
  openModal('modal-voucher-success');
}

function switchVoucherTab(tab) {
  voucherTabFilter = tab;
  document.querySelectorAll('#voucher-tab-bar .tab-btn').forEach(b => {
    const isActive = b.getAttribute('data-tab') === tab;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
  renderVouchers(tab);
}

function buildVoucherRow(voucher) {
  const row = document.createElement('button');
  row.type = 'button';
  row.className = 'voucher-row ' + voucher.status;
  row.addEventListener('click', () => openVoucherScan(voucher.id));

  const top = document.createElement('span');
  top.className = 'voucher-top';
  const headName = document.createElement('span');
  headName.className = 'voucher-head-name';
  headName.textContent = voucher.merchant;
  const status = document.createElement('span');
  status.className = 'voucher-row-status ' + voucher.status;
  status.textContent = voucher.status;
  top.append(headName, status);

  const offer = splitRewardOffer(voucher);
  const valueLine = document.createElement('span');
  valueLine.className = 'voucher-value';
  valueLine.textContent = offer.value + ' ' + offer.label;

  const date = document.createElement('span');
  date.className = 'voucher-row-date';
  if (voucher.status === 'used') date.textContent = 'Redeemed ' + formatDate(voucher.redeemedDate);
  else if (voucher.status === 'expired') date.textContent = 'Expired ' + formatDate(voucher.expiry);
  else date.textContent = 'Expires ' + formatDate(voucher.expiry);

  const view = document.createElement('span');
  view.className = 'voucher-view';
  view.textContent = 'View voucher →';

  row.append(top, valueLine, date, view);
  return row;
}

function renderVouchers(tab) {
  voucherTabFilter = tab;
  const container = el('my-vouchers-list');
  if (!container) return;

  updateVoucherCounts();
  const vouchers = AppState.resident.vouchers.filter(v => v.status === tab);

  container.replaceChildren();
  if (!vouchers.length) {
    const copy = {
      active: ['No active vouchers', 'Redeem a reward above and it will appear here.'],
      used: ['No used vouchers', 'Vouchers you redeem at a partner will be listed here.'],
      expired: ['No expired vouchers', 'Nothing has expired yet — your vouchers are still valid.']
    }[tab] || ['No vouchers', 'Nothing to show here yet.'];
    container.append(buildEmptyState(copy[0], copy[1]));
    return;
  }

  const frag = document.createDocumentFragment();
  vouchers.forEach(v => frag.append(buildVoucherRow(v)));
  container.append(frag);
}

function openVoucherScan(voucherId) {
  currentVoucherId = voucherId;
  const v = AppState.resident.vouchers.find(x => x.id === voucherId);
  if (!v) return;

  setText('vscan-name', v.name);
  setText('vscan-code', v.code);
  generateBarcode('vscan-barcode', v.code);

  const btn = el('btn-merchant-scan') || document.querySelector('#modal-voucher-scan .btn-primary');
  if (btn) {
    btn.disabled = v.status !== 'active';
  }
  openModal('modal-voucher-scan');
}

function simulateMarkVoucherUsed() {
  const v = AppState.resident.vouchers.find(x => x.id === currentVoucherId);
  if (!v) return;
  v.status = 'used';

  saveState();
  closeModal('modal-voucher-scan');
  renderVouchers(voucherTabFilter);
  renderRewards();
  showToast('Voucher successfully scanned and accepted at merchant partner!', 'success');
}

function generateBarcode(containerId, code) {
  const e = el(containerId);
  if (!e) return;
  const seed = (code || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  let bars = '';
  for (let i = 0; i < 42; i++) {
    const h = 26 + ((seed * (i + 1) * 7919) % 36);
    const isWide = i % 5 === 0;
    bars += `<div style="height:${h}px;background:white;flex:${isWide ? 2 : 1};min-width:2px;border-radius:1px"></div>`;
    if (i % 4 === 3) bars += '<div style="width:2px"></div>';
  }
  e.style.cssText = 'background:#1A2332;border-radius:8px;padding:12px 18px;display:flex;align-items:flex-end;height:74px;overflow:hidden;gap:1.5px;justify-content:center';
  e.innerHTML = bars;
}

// --- NOTIFICATIONS SYSTEM ---
function updateNotifBadge(role) {
  const notifs = AppState.notifications[role] || [];
  const unread = notifs.filter(n => !n.read).length;
  const badgeId = { resident: 'resident-notif-badge', collector: 'collector-notif-badge', admin: 'admin-notif-badge' }[role];
  const badge = el(badgeId);
  if (badge) {
    badge.textContent = unread;
    badge.style.display = unread > 0 ? 'flex' : 'none';
  }
  if (role === 'admin') {
    document.querySelectorAll('.admin-notif-badge').forEach(b => {
      b.textContent = unread;
      b.style.display = unread > 0 ? 'flex' : 'none';
    });
  }
}

function renderNotifications(role) {
  const container = el(role + '-notif-list');
  if (!container) return;
  const notifs = AppState.notifications[role] || [];

  if (!notifs.length) {
    container.innerHTML = '<div class="notif-empty" style="padding:48px 24px;text-align:center;color:#9CA3AF">No notifications yet.</div>';
    return;
  }

  container.innerHTML = notifs.map(n => `
    <div class="notif-item ${n.read ? '' : 'unread'}" onclick="markNotificationRead('${n.id}','${role}')" style="display:flex;gap:12px;padding:14px 20px;border-bottom:1px solid #F1F5F9;cursor:pointer;background:${n.read?'white':'#F0FDF4'}">
      <div style="width:8px;height:8px;border-radius:50%;background:${n.read?'#CBD5E1':'#16A34A'};flex-shrink:0;margin-top:6px"></div>
      <div style="flex:1">
        <div style="font-size:14.5px;font-weight:700;color:#1A2332">${n.title}</div>
        <div style="font-size:13px;color:#475569;margin-top:3px;line-height:1.5">${n.body}</div>
        <div style="font-size:11px;color:#94A3B8;margin-top:5px">${n.time}</div>
      </div>
    </div>
  `).join('');
}

function markNotificationRead(notifId, role) {
  const notifs = AppState.notifications[role] || [];
  const n = notifs.find(x => x.id === notifId);
  if (n) {
    n.read = true;
    // Show detail modal if applicable
    setText('notif-detail-title', n.title);
    setText('notif-detail-time', n.time);
    setText('notif-detail-body', n.body);
    openModal('modal-notification-detail');
  }
  saveState();
  renderNotifications(role);
  updateNotifBadge(role);
}

function markAllNotificationsRead() {
  const role = AppState.currentUser?.role || 'resident';
  (AppState.notifications[role] || []).forEach(n => n.read = true);
  saveState();
  renderNotifications(role);
  updateNotifBadge(role);
  showToast('All notifications marked as read', 'info');
}

// --- COLLECTOR SCAN WIZARD (5 STEPS) ---
// One collection at a time. Every entry from the dashboard starts clean; the
// exit guard protects meaningful work.
const WIZARD_STEP_LABELS = [
  'Resident verified',
  'Select waste material',
  'Weight and documentation',
  'Calculated EcoToken',
  'Confirm deposit'
];

let depositInFlight = false;
let depositPhotoFileName = '';

function getInitials(name) {
  return (name || '')
    .replace(/^officer\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('') || 'RK';
}

function currentCollectorAccount() {
  return AppState.accounts.find(a => a.role === 'collector' && a.email === AppState.currentUser?.email)
    || AppState.accounts.find(a => a.role === 'collector')
    || null;
}

// --- COLLECTOR SCANNER SESSION & VERIFIED RESIDENT -----------------------
// One scanning interface exists in the app: the Scanner tab surface. The
// collection wizard never owns a viewport and never asks for a camera.
// The verified resident is a single piece of state shared by both surfaces,
// so the wizard can never disagree with the scanner about who was verified.
const scanSession = { active: false };

function getVerifiedResident() {
  return selectedResident;
}

function isResidentVerified() {
  const resident = selectedResident;
  return !!(resident && resident.id && resident.name);
}

function setVerifiedResident(resident) {
  selectedResident = resident
    ? { name: resident.name, id: resident.id, barangay: resident.barangay }
    : null;
  if (AppState.collector?.currentDeposit) {
    AppState.collector.currentDeposit.resident = selectedResident;
  }
}

function clearVerifiedResident() {
  setVerifiedResident(null);
}

// The demo has no live camera or decoder, so the session owns the scanning
// viewport's lifecycle only: it starts at most once, pauses the moment a
// resident is verified, and is never resumed while the wizard owns the screen.
function startScanSession() {
  if (scanSession.active) return;
  if (el('screen-collector-scan')?.classList.contains('wizard-mode')) return;
  // A verified resident keeps the viewport paused; it only resumes once the
  // resident is explicitly cleared.
  if (isResidentVerified()) return;
  scanSession.active = true;
  renderScanSurface();
}

function stopScanSession() {
  if (!scanSession.active) return;
  scanSession.active = false;
  renderScanSurface();
}

// Writes the verified resident into both surfaces from the one state.
function renderVerifiedResident() {
  const resident = getVerifiedResident();
  const verified = isResidentVerified();
  if (!verified) return;
  const monogram = getInitials(resident.name);
  setText('scan-resident-monogram', monogram);
  setText('scan-resident-name', resident.name);
  setText('scan-resident-id', resident.id);
  setText('scan-resident-barangay', resident.barangay);
  setText('wiz-resident-monogram', monogram);
  setText('wiz-resident-name', resident.name);
  setText('wiz-resident-id', resident.id);
  setText('wiz-resident-barangay', resident.barangay);
}

// Scanner-root visibility. The viewport only runs on the Scanner tab and
// only while no resident is verified.
function renderScanSurface() {
  const verified = isResidentVerified();
  const stage = el('scan-stage');
  if (stage) stage.hidden = verified || !scanSession.active;
  const demo = el('demo-resident-btn');
  if (demo) demo.hidden = verified;
  const hint = el('scan-hint');
  if (hint) hint.hidden = verified;
  const action = el('scan-root-action');
  if (action) action.hidden = !verified;
  el('scanned-resident-card')?.classList.toggle('active', verified);
  el('wiz-resident-card')?.classList.toggle('active', verified);
  const continueButton = el('scan-continue-btn');
  if (continueButton) continueButton.disabled = !verified;
  // The badge reports the session, so a paused viewport never claims to be
  // scanning. Verified residents never see the viewport at all.
  const badge = el('scan-badge');
  if (badge) badge.textContent = scanSession.active ? 'Demo scanner' : 'Scanner paused';
}

// Single refresh path for the Scanner tab and the wizard's resident summary.
function renderCollectorScanSurface() {
  renderVerifiedResident();
  renderScanSurface();
}

function enterWizardMode() {
  const screen = el('screen-collector-scan');
  if (!screen) return;
  screen.classList.add('wizard-mode');
  // The scanner viewport is left behind; the wizard consumes the resident
  // that was already verified on the Scanner tab.
  stopScanSession();
  if (screen.classList.contains('active')) document.body.classList.add('wizard-active');
}

// Continue Collection: the resident is already verified, so the wizard opens
// directly on Step 2 with Step 1 completed — no second scan, no camera.
function startDepositWizard() {
  if (!isResidentVerified()) {
    showToast('Verify a resident before continuing.', 'error');
    return;
  }
  if (el('screen-collector-scan')?.classList.contains('wizard-mode')) return;
  enterWizardMode();
  goToStep(2);
}

function resetDepositWizard() {
  clearVerifiedResident();
  selectedMaterial = null;
  depositPhotoDataUrl = null;
  depositPhotoFileName = '';
  currentStep = 1;
  currentWizardStep = 1;
  depositInFlight = false;
  AppState.collector.currentDeposit = {
    resident: null, material: null, weight: 0, points: 0,
    photoDataUrl: null, remarks: ''
  };

  renderCollectorScanSurface();

  document.querySelectorAll('.material-option').forEach(opt => {
    opt.classList.remove('selected');
    opt.setAttribute('aria-checked', 'false');
  });

  const weightInput = el('manual-weight-input');
  if (weightInput) weightInput.value = '';
  const remarksInput = el('deposit-remarks');
  if (remarksInput) remarksInput.value = '';

  clearWizardError('weight');
  clearWizardError('photo');
  resetDocPanel();

  const calcWarning = el('calc-weight-warning');
  if (calcWarning) calcWarning.hidden = true;
  const flagNote = el('summary-flag-note');
  if (flagNote) flagNote.hidden = true;

  const screen = el('screen-collector-scan');
  if (screen) screen.scrollTop = 0;

  goToStep(1);
}

function resetDocPanel() {
  const actions = el('doc-actions');
  if (actions) actions.style.display = '';
  const previewArea = el('photo-preview-area');
  if (previewArea) previewArea.classList.remove('active');
  const previewImg = el('photo-preview-img');
  if (previewImg) previewImg.removeAttribute('src');
  setText('photo-file-name', '');
  setText('photo-status', 'Required');
  const status = el('photo-status');
  if (status) status.className = 'status-pill status-required';
  const thumb = el('confirm-photo-thumb');
  if (thumb) {
    thumb.removeAttribute('src');
    thumb.style.display = 'none';
  }
  setText('confirm-photo-status', 'Not attached');
  clearWizardError('photo');
}

function goToStep(step) {
  if (step < 1 || step > 5) return;
  currentStep = step;
  currentWizardStep = step;

  for (let i = 1; i <= 5; i++) {
    const content = el('step-' + i + '-content');
    if (content) content.classList.toggle('active', i === step);
    const seg = el('step-dot-' + i);
    if (seg) {
      seg.classList.remove('active', 'done');
      if (i < step) seg.classList.add('done');
      else if (i === step) seg.classList.add('active');
    }
  }

  setText('wizard-step-count', 'Step ' + step + ' of 5');
  const progress = el('wizard-progress');
  if (progress) {
    progress.setAttribute('aria-valuenow', String(step));
    progress.setAttribute('aria-valuetext', 'Step ' + step + ' of 5: ' + WIZARD_STEP_LABELS[step - 1]);
  }

  if (step === 4 || step === 5) updateCalculation();
  if (step === 5) populateDepositSummary();

  syncWizardFooter();

  const screen = el('screen-collector-scan');
  if (screen) screen.scrollTop = 0;

  const heading = el('step-' + step + '-content')?.querySelector('.step-heading');
  if (heading && screen?.classList.contains('active')
      && screen.classList.contains('wizard-mode')
      && !document.body.classList.contains('deposit-success-open')) {
    requestAnimationFrame(() => heading.focus({ preventScroll: true }));
  }
}

function syncWizardFooter() {
  renderCollectorScanSurface();
  const back = el('wizard-back-btn');
  if (back) back.hidden = currentStep === 1;

  const next = el('wizard-next-btn');
  const label = el('wizard-next-label');
  const labels = {
    1: 'Continue to material',
    2: 'Continue',
    3: 'Continue to points',
    4: 'Review deposit',
    5: 'Confirm deposit'
  };
  if (label) label.textContent = depositInFlight ? 'Recording…' : (labels[currentStep] || 'Continue');
  if (next) {
    next.disabled = depositInFlight
      || (currentStep === 1 && !isResidentVerified())
      || (currentStep === 2 && !selectedMaterial);
    next.setAttribute('aria-disabled', next.disabled ? 'true' : 'false');
  }
}

function wizardNext() {
  if (depositInFlight) return;
  if (currentStep === 5) {
    confirmDeposit();
    return;
  }
  nextStep();
}

function nextStep() {
  if (currentStep === 1) {
    if (!isResidentVerified()) {
      showToast('Scan or select a resident first.', 'error');
      return;
    }
    goToStep(2);
    return;
  }

  if (currentStep === 2) {
    if (!selectedMaterial) {
      showToast('Select an accepted waste material.', 'error');
      return;
    }
    goToStep(3);
    return;
  }

  if (currentStep === 3) {
    const weight = validateWeight();
    if (weight === null) return;
    if (!depositPhotoDataUrl) {
      showWizardError('photo');
      el('doc-panel')?.scrollIntoView({ block: 'center' });
      return;
    }

    AppState.collector.currentDeposit.weight = weight;
    AppState.collector.currentDeposit.remarks = (el('deposit-remarks')?.value || '').trim();
    updateCalculation();
    goToStep(4);
    return;
  }

  if (currentStep === 4) {
    goToStep(5);
  }
}

function prevStep() {
  if (depositInFlight) return;
  if (currentStep > 1) goToStep(currentStep - 1);
}

function validateWeight() {
  const input = el('manual-weight-input');
  const weight = parseFloat(input?.value);
  if (!Number.isFinite(weight) || weight <= 0) {
    showWizardError('weight', 'Enter a weight greater than 0 kg.');
    input?.focus();
    return null;
  }
  clearWizardError('weight');
  return weight;
}

function showWizardError(kind, message) {
  const map = {
    weight: ['weight-error', 'Enter a weight greater than 0 kg.'],
    photo: ['photo-error', 'Attach a documentation photo to continue.']
  };
  const pair = map[kind];
  const node = el(pair[0]);
  if (!node) return;
  node.textContent = message || pair[1];
  node.hidden = false;
}

function clearWizardError(kind) {
  const id = kind === 'weight' ? 'weight-error' : kind === 'photo' ? 'photo-error' : null;
  const node = id ? el(id) : null;
  if (node) node.hidden = true;
}

function hasWizardData() {
  const weight = (el('manual-weight-input')?.value || '').trim();
  return !!(isResidentVerified() || selectedMaterial || depositPhotoDataUrl
    || weight || (el('deposit-remarks')?.value || '').trim() || currentStep > 1);
}

function wizardBack() {
  if (currentStep > 1) prevStep();
  else exitWizard();
}

function exitWizard(tab = 'scan') {
  if (depositInFlight || document.body.classList.contains('deposit-success-open')) return;
  wizardExitTab = tab;
  if (hasWizardData()) {
    openModal('modal-wizard-exit');
    return;
  }
  discardWizard();
}

function discardWizard() {
  if (depositInFlight) return;
  closeModal('modal-wizard-exit');
  el('screen-collector-scan')?.classList.remove('wizard-mode');
  document.body.classList.remove('wizard-active', 'deposit-success-open');
  resetDepositWizard();
  showCollectorTab(wizardExitTab);
  if (wizardExitTab === 'scan') el('scan-root-title')?.focus({ preventScroll: true });
}

function selectDemoResident() {
  // Local demo only. Never interpret an arbitrary QR payload as authorization.
  if (isResidentVerified() || depositInFlight) return;
  const resident = AppState.accounts.find(a => a.role === 'resident' && a.id === 'RES-2024-001');
  if (!resident) {
    showToast('Demo resident is unavailable.', 'error');
    return;
  }
  setVerifiedResident({ name: resident.name, id: resident.id, barangay: resident.barangay });
  // Verification pauses the scanning session and swaps the viewport for the
  // resident summary plus the two follow-up actions.
  stopScanSession();
  renderCollectorScanSurface();
  syncWizardFooter();
}

function resetResidentScan() {
  // Changing residents is always explicit. Inside the wizard it discards the
  // unfinished collection behind the existing guard; on the Scanner tab it
  // clears the verified resident and restarts scanning.
  if (el('screen-collector-scan')?.classList.contains('wizard-mode')) {
    exitWizard('scan');
    return;
  }
  clearVerifiedResident();
  startScanSession();
  renderCollectorScanSurface();
  syncWizardFooter();
}

function selectMaterial(materialId) {
  const material = AppState.wasteMaterials.find(m => m.id === materialId);
  if (!material) return;
  selectedMaterial = material;
  AppState.collector.currentDeposit.material = material;

  document.querySelectorAll('.material-option').forEach(opt => {
    const isSelected = opt.getAttribute('data-id') === materialId;
    opt.classList.toggle('selected', isSelected);
    opt.setAttribute('aria-checked', isSelected ? 'true' : 'false');
  });

  updateCalculation();
  syncWizardFooter();
}

function handlePhotoUpload(event) {
  const file = event?.target?.files?.[0];
  if (!file) return;

  if (!file.type || !file.type.startsWith('image/')) {
    showWizardError('photo', 'Choose an image file for documentation.');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showWizardError('photo', 'Photo must be under 5 MB.');
    if (event.target) event.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = e => {
    depositPhotoDataUrl = e.target.result;
    depositPhotoFileName = file.name || 'Documentation photo';
    AppState.collector.currentDeposit.photoDataUrl = depositPhotoDataUrl;

    const actions = el('doc-actions');
    if (actions) actions.style.display = 'none';
    const previewArea = el('photo-preview-area');
    if (previewArea) previewArea.classList.add('active');
    const img = el('photo-preview-img');
    if (img) img.src = depositPhotoDataUrl;
    setText('photo-file-name', depositPhotoFileName);
    setText('photo-status', 'Attached');
    const status = el('photo-status');
    if (status) status.className = 'status-pill status-attached';

    const thumb = el('confirm-photo-thumb');
    if (thumb) {
      thumb.src = depositPhotoDataUrl;
      thumb.style.display = 'block';
    }
    setText('confirm-photo-status', 'Attached');
    clearWizardError('photo');
    syncWizardFooter();
  };
  reader.readAsDataURL(file);
}

function removePhoto() {
  depositPhotoDataUrl = null;
  depositPhotoFileName = '';
  AppState.collector.currentDeposit.photoDataUrl = null;

  const input = el('photo-upload-input');
  if (input) input.value = '';

  resetDocPanel();
}

function triggerPhotoUpload() {
  el('photo-upload-input')?.click();
}

function updateCalculation() {
  const inputWeight = parseFloat(el('manual-weight-input')?.value);
  const storedWeight = AppState.collector.currentDeposit.weight;
  const weight = (Number.isFinite(inputWeight) && inputWeight > 0)
    ? inputWeight
    : (Number.isFinite(storedWeight) && storedWeight > 0 ? storedWeight : 0);
  const material = selectedMaterial || AppState.collector.currentDeposit.material;
  if (!material) return;

  const points = Math.round(weight * material.rate);
  AppState.collector.currentDeposit.points = points;

  setText('calc-material', material.name);
  setText('calc-weight', weight.toFixed(2) + ' kg');
  setText('calc-rate', material.rate + ' pts/kg');
  setText('calc-formula', weight.toFixed(2) + ' kg × ' + material.rate + ' pts/kg');
  setText('calc-points-val', points);

  const isHigh = weight > 15;
  const warning = el('calc-weight-warning');
  if (warning) warning.hidden = !isHigh;
  if (isHigh) {
    setText('calc-weight-warning-text',
      weight.toFixed(2) + ' kg is above the 15 kg review threshold. This deposit will be flagged for admin review.');
  }
}

function populateDepositSummary() {
  const d = AppState.collector.currentDeposit;
  const colAccount = currentCollectorAccount();
  const collectorName = colAccount?.name || 'Rodel Aguila';
  const remarks = (el('deposit-remarks')?.value || d.remarks || '').trim() || 'None';
  const weight = d.weight || 0;

  setText('summary-resident', d.resident?.name || '—');
  setText('summary-resident-id', d.resident?.id || '—');
  setText('summary-material', d.material?.name || '—');
  setText('summary-weight', weight.toFixed(2) + ' kg');
  setText('summary-rate', (d.material?.rate || 0) + ' pts/kg');
  setText('summary-collector', collectorName);
  setText('summary-remarks', remarks);
  setText('summary-total-pts', '+' + (d.points || 0) + ' pts');

  const thumb = el('confirm-photo-thumb');
  if (thumb) {
    if (d.photoDataUrl) {
      thumb.src = d.photoDataUrl;
      thumb.style.display = 'block';
    } else {
      thumb.removeAttribute('src');
      thumb.style.display = 'none';
    }
  }
  setText('confirm-photo-status', d.photoDataUrl ? 'Attached' : 'Not attached');

  const flagNote = el('summary-flag-note');
  if (flagNote) flagNote.hidden = !(weight > 15);
}

function confirmDeposit() {
  if (depositInFlight) return;

  const colAccount = currentCollectorAccount();
  const colRecord = AppState.collectors.find(c => c.id === 'COL-2024-007' || c.email === colAccount?.email);
  if (colRecord?.status === 'restricted') {
    showToast('Your account is restricted. You cannot submit deposits.', 'error');
    return;
  }

  const d = AppState.collector.currentDeposit;
  if (!d.resident || !d.material || !d.weight) {
    showToast('Incomplete deposit. Complete all steps first.', 'error');
    return;
  }
  if (!d.photoDataUrl) {
    goToStep(3);
    showWizardError('photo');
    el('doc-panel')?.scrollIntoView({ block: 'center' });
    return;
  }

  depositInFlight = true;
  syncWizardFooter();

  const pts = d.points || Math.round(d.weight * d.material.rate);
  const isHigh = d.weight > 15;
  const txId = 'DEP' + uid().substring(0, 6);
  const dateStr = collectorLocalDateKey(new Date());
  const colName = colAccount?.name || 'Rodel Aguila';

  const record = {
    id: txId,
    residentName: d.resident.name,
    residentId: d.resident.id,
    material: d.material.name,
    weight: parseFloat(d.weight.toFixed(2)),
    points: pts,
    date: dateStr,
    collector: colName,
    collectorId: 'COL-2024-007',
    barangay: d.resident.barangay,
    status: isHigh ? 'flagged' : 'verified',
    photoDataUrl: d.photoDataUrl,
    remarks: d.remarks || '',
    flagged: isHigh,
    flagReason: isHigh ? `Unusually high weight (${d.weight.toFixed(2)} kg) exceeds 15 kg threshold` : '',
    reviewStatus: isHigh ? 'pending' : null,
    reviewNotes: null,
    reviewOutcome: null
  };
  AppState.collectionRecords.unshift(record);

  // Update resident
  AppState.resident.points += pts;
  AppState.resident.lifetimePoints += pts;
  AppState.resident.kgRecycled = parseFloat((AppState.resident.kgRecycled + d.weight).toFixed(1));
  AppState.resident.deposits++;
  AppState.resident.transactions.unshift({
    id: txId,
    type: 'earned',
    label: d.material.name + ' Deposit',
    points: pts,
    date: dateStr,
    kg: d.weight,
    material: d.material.name,
    collector: colName,
    barangay: d.resident.barangay,
    status: isHigh ? 'pending' : 'verified',
    photoDataUrl: d.photoDataUrl
  });

  // Update collector statistics
  AppState.collector.kgToday = parseFloat((AppState.collector.kgToday + d.weight).toFixed(1));
  AppState.collector.txToday++;
  AppState.collector.ptsToday += pts;
  if (colRecord) {
    colRecord.totalWaste = parseFloat((colRecord.totalWaste + d.weight).toFixed(1));
    colRecord.totalDeposits++;
    colRecord.totalPoints += pts;
  }

  // Update admin statistics
  AppState.admin.totalWaste = parseFloat((AppState.admin.totalWaste + d.weight).toFixed(1));
  AppState.admin.pointsDistributed += pts;

  // Add notification alerts
  AppState.notifications.resident.unshift({
    id: 'RNOTIF' + uid(),
    title: 'EcoToken Credited',
    body: `You earned ${pts} EcoToken for your ${d.material.name} deposit (${d.weight.toFixed(2)} kg).`,
    time: nowStr(),
    read: false,
    link: 'wallet'
  });

  AppState.notifications.collector.unshift({
    id: 'CNOTIF' + uid(),
    title: 'Deposit Recorded',
    body: `Deposit ${txId} for ${d.resident.name} (${d.weight.toFixed(2)} kg ${d.material.name}) confirmed.`,
    time: nowStr(),
    read: false,
    link: 'records'
  });

  if (isHigh) {
    AppState.notifications.admin.unshift({
      id: 'ANOTIF' + uid(),
      title: 'Suspicious Deposit Flagged',
      body: `Deposit ${txId} (${d.weight.toFixed(2)} kg ${d.material.name}) auto-flagged for review.`,
      time: nowStr(),
      read: false,
      link: 'reports'
    });
  }

  AppState.auditLog.unshift({
    timestamp: nowStr(),
    action: isHigh ? 'Deposit flagged' : 'Deposit confirmed',
    detail: `${txId} — ${d.resident.name} — ${d.weight.toFixed(2)} kg ${d.material.name} — ${pts} pts`
  });

  saveState();
  updateCollectorUI();
  updateAdminUI();
  updateResidentUI();

  setText('ds-txid', txId);
  setText('ds-resident', d.resident.name);
  setText('ds-material', d.material.name);
  setText('ds-weight', d.weight.toFixed(2) + ' kg');
  setText('ds-points', '+' + pts);

  document.body.classList.add('deposit-success-open');
  openModal('modal-deposit-success');

  // Clear the finished draft behind the sheet so no stale scanner or photo
  // can leak through when it closes.
  depositInFlight = false;
  resetDepositWizard();

  const title = el('deposit-success-title');
  if (title) setTimeout(() => title.focus({ preventScroll: true }), 340);
}

function startAnotherCollection() {
  closeModal('modal-deposit-success');
  document.body.classList.remove('deposit-success-open');
  el('screen-collector-scan')?.classList.remove('wizard-mode');
  showCollectorTab('scan');
  el('scan-root-title')?.focus({ preventScroll: true });
}

function finishDepositSuccess() {
  closeModal('modal-deposit-success');
  document.body.classList.remove('deposit-success-open');
  el('screen-collector-scan')?.classList.remove('wizard-mode');
  showCollectorTab('records');
}

// --- COLLECTOR RECORDS & INVENTORY ---
function collectorLocalDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function renderCollectorRecords(filter = currentRecordFilter) {
  const container = el('records-list');
  if (!container) return;
  document.querySelectorAll('#records-material-chips .chip').forEach(chip => {
    const active = chip.dataset.mat === filter.material;
    chip.classList.toggle('active', active);
    chip.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('#records-date-filter button').forEach(button => {
    const active = button.dataset.date === filter.date;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const clear = el('records-search-clear');
  if (clear) clear.hidden = !el('collector-records-search')?.value;
  const source = AppState.collectionRecords;
  const empty = (title, message) => {
    const block = document.createElement('div');
    block.className = 'records-empty';
    const heading = document.createElement('h2');
    heading.textContent = title;
    const copy = document.createElement('p');
    copy.textContent = message;
    block.append(heading, copy);
    container.replaceChildren(block);
  };
  if (!Array.isArray(source)) {
    setText('records-result-note', 'Records unavailable');
    empty('Unable to display records', 'Collection data is unavailable in this demo session.');
    return;
  }
  let records = source;
  if (filter?.material && filter.material !== 'all') {
    records = records.filter(r => r.material.toLowerCase().includes(filter.material.toLowerCase()));
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    records = records.filter(r => r.residentName.toLowerCase().includes(q) || r.residentId.toLowerCase().includes(q) || r.id.toLowerCase().includes(q));
  }
  const now = new Date();
  const today = collectorLocalDateKey(now);
  // Calendar week is Monday–Sunday in local time, not a rolling UTC window.
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
  const nextMonday = new Date(monday);
  nextMonday.setDate(nextMonday.getDate() + 7);
  const start = collectorLocalDateKey(monday);
  const end = collectorLocalDateKey(nextMonday);
  const recordDay = r => /^\d{4}-\d{2}-\d{2}$/.test(r.date)
    ? r.date : collectorLocalDateKey(new Date(r.date));
  if (filter?.date === 'today') records = records.filter(r => recordDay(r) === today);
  else if (filter?.date === 'week') records = records.filter(r => recordDay(r) >= start && recordDay(r) < end);
  const range = filter.date === 'today' ? formatDate(today)
    : filter.date === 'week' ? 'This week · Mon–Sun' : 'All time';
  setText('records-result-note', `${records.length} ${records.length === 1 ? 'collection' : 'collections'} · ${range}`);
  if (!records.length) {
    if (!source.length) empty('No collections yet', 'Completed collections will appear here.');
    else if (filter.search) empty('No matching residents or IDs', 'Try another name or ID, or adjust your filters.');
    else if (filter.date !== 'all') empty(filter.date === 'today' ? 'No collections today' : 'No collections this week', 'No records match this date range and material selection.');
    else empty('No collections for this material', 'Choose another material to view its records.');
    return;
  }
  container.replaceChildren(...records.map(r => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'record-row';
    row.addEventListener('click', () => openTransactionDetail(r.id));
    const field = (className, text) => {
      const node = document.createElement('span');
      node.className = className;
      node.textContent = text;
      return node;
    };
    row.append(
      field('record-name', r.residentName),
      field('record-points', `+${r.points.toLocaleString()} pts`),
      field('record-material', `${r.material} · ${r.weight.toFixed(2)} kg`),
      field('record-status' + (r.flagged ? ' is-flagged' : ''), r.flagged ? 'For review' : r.status),
      field('record-meta', `${formatDate(recordDay(r))} · ${r.id}`)
    );
    return row;
  }));
}

function clearRecordSearch() {
  const input = el('collector-records-search');
  if (input) { input.value = ''; input.focus(); }
  filterRecords();
}

function filterRecords() {
  const search = (el('collector-records-search')?.value || el('records-search')?.value || '').toLowerCase().trim();
  currentRecordFilter.search = search;
  renderCollectorRecords(currentRecordFilter);
}

function setRecordMaterialFilter(mat, btn) {
  currentRecordFilter.material = mat;
  renderCollectorRecords(currentRecordFilter);
}

function setRecordDateFilter(d) {
  currentRecordFilter.date = d;
  renderCollectorRecords(currentRecordFilter);
}

function updateCollectorUI() {
  updateCollectorHomeUI();
  renderCollectorRecords(currentRecordFilter);
}

function updateCollectorHomeUI() {
  const colAccount = currentCollectorAccount();
  const name = colAccount?.name || 'Rodel Aguila';
  const barangay = colAccount?.barangay || 'Barangay San Gabriel';

  setText('collector-officer-name', 'Officer ' + name);
  setText('collector-officer-barangay', barangay);
  setText('collector-officer-id', colAccount?.id || 'COL-2024-007');
  setText('collector-officer-avatar', getInitials(name));

  setText('collector-kg-today', AppState.collector.kgToday.toFixed(1));
  setText('collector-tx-count', AppState.collector.txToday);
  setText('collector-pts-awarded', AppState.collector.ptsToday);
  setText('collector-types-count', AppState.wasteMaterials.filter(m => m.enabled).length);

  renderCollectorRecentDeposits();
  renderMaterialInventory();
  updateNotifBadge('collector');
}

function renderCollectorRecentDeposits() {
  const container = el('collector-recent-list');
  if (!container) return;

  const recent = AppState.collectionRecords.slice(0, 3);

  if (!recent.length) {
    const empty = document.createElement('div');
    empty.className = 'col-empty';
    empty.textContent = 'No collections recorded yet. Your first deposit will appear here.';
    container.replaceChildren(empty);
    return;
  }

  const rows = recent.map(r => {
    const row = document.createElement('div');
    row.className = 'col-row';
    row.setAttribute('role', 'button');
    row.tabIndex = 0;
    row.setAttribute('aria-label',
      `${r.residentName}, ${r.material}, ${r.weight.toFixed(1)} kilograms, ${formatDate(r.date)}, ${r.points} points, ${r.flagged ? 'for review' : r.status}`);
    row.addEventListener('click', () => openTransactionDetail(r.id));
    row.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openTransactionDetail(r.id);
      }
    });

    const icon = document.createElement('span');
    icon.className = 'col-row-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = getInitials(r.residentName);

    const main = document.createElement('div');
    main.className = 'col-row-main';
    const name = document.createElement('div');
    name.className = 'col-row-name';
    name.textContent = r.residentName;
    const meta = document.createElement('div');
    meta.className = 'col-row-meta';
    meta.textContent = `${r.material} · ${r.weight.toFixed(1)} kg`;
    const date = document.createElement('div');
    date.className = 'col-row-date';
    date.textContent = formatDate(r.date);
    main.append(name, meta, date);

    const end = document.createElement('div');
    end.className = 'col-row-end';
    const points = document.createElement('span');
    points.className = 'col-row-points';
    points.textContent = '+' + r.points + ' pts';
    const status = document.createElement('span');
    status.className = 'col-row-status' + (r.flagged ? ' is-flagged' : '');
    status.textContent = r.flagged ? 'For review' : r.status;
    end.append(points, status);

    row.append(icon, main, end);
    return row;
  });

  container.replaceChildren(...rows);
}

function renderMaterialInventory() {
  const container = el('material-inventory-table');
  if (!container) return;

  const summary = {};
  if (!Array.isArray(AppState.collectionRecords)) {
    container.textContent = 'Material inventory unavailable.';
    return;
  }
  AppState.collectionRecords.forEach(r => {
    if (!summary[r.material]) summary[r.material] = { kg: 0, count: 0, pts: 0 };
    summary[r.material].kg += r.weight;
    summary[r.material].count++;
    summary[r.material].pts += r.points;
  });

  container.replaceChildren(...Object.entries(summary).map(([mat, s]) => {
    const row = document.createElement('div');
    row.className = 'record-inventory-row';
    const name = document.createElement('span');
    name.textContent = mat;
    const value = document.createElement('span');
    value.textContent = `${s.kg.toFixed(1)} kg · ${s.count} deposits · ${s.pts.toLocaleString()} pts`;
    row.append(name, value);
    return row;
  }));
  if (!Object.keys(summary).length) container.textContent = 'No collected materials yet.';
}

function filterCollectorHistory() {
  const mat = el('cd-filter-material')?.value || 'all';
  const date = el('cd-filter-date')?.value || 'all';
  const histContainer = el('cd-history-list');
  if (!histContainer) return;

  let history = AppState.collectionRecords.filter(r => r.collectorId === currentViewingCollectorId);
  if (mat !== 'all') {
    history = history.filter(r => r.material === mat);
  }
  if (date === 'week') {
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    history = history.filter(r => r.date >= weekAgo);
  }

  histContainer.innerHTML = history.length ? history.map(r => `
    <div class="tx-item" onclick="openReportDetail('${r.id}')">
      <div class="tx-info">
        <div class="tx-title">${r.residentName}</div>
        <div class="tx-subtitle">${r.material} • ${r.weight.toFixed(2)} kg • ${formatDate(r.date)}</div>
      </div>
      <div style="text-align:right">
        <div class="tx-amount earned">+${r.points} pts</div>
        <span class="badge badge-${r.status==='verified'?'success':'warning'}">${r.status}</span>
      </div>
    </div>
  `).join('') : '<div style="padding:20px;text-align:center;color:#94A3B8;font-size:13px">No collection records matching filters.</div>';
}

// --- ADMIN DASHBOARD & AUDITS ---
function updateAdminUI() {
  const user = AppState.currentUser || AppState.accounts.find(a => a.role === 'admin');
  setText('admin-total-waste', AppState.admin.totalWaste.toFixed(1));
  setText('admin-residents', AppState.admin.registeredResidents);
  setText('admin-points-dist', AppState.admin.pointsDistributed.toLocaleString());
  setText('admin-vouchers-redeemed', AppState.admin.vouchersRedeemed);
  setText('admin-barangay-count', AppState.admin.barangays);
  setText('admin-home-office', ((user && user.barangay) || 'Tuguegarao City').replace(/^LGU\s+/i, ''));
  const avatar = el('admin-home-avatar');
  if (avatar) {
    const initials = (user && user.name || '')
      .split(/\s+/)
      .filter(w => /[a-z]/i.test(w))
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('');
    avatar.textContent = initials || 'AD';
  }

  _populateCollectorFilter();
  filterAdminReports();
  renderAuditLog();
  renderAdminTrends();
  renderAdminMaterialShare();
  renderAdminBarangayRankings();
  animateCharts();
  updateNotifBadge('admin');
}

function toggleBarangaySummary() {
  const list = el('admin-barangay-list');
  const row = el('admin-coverage-row');
  const card = list && list.closest('.admin-coverage');
  if (!list) return;
  const isOpen = !list.hidden;
  list.hidden = isOpen;
  if (row) row.setAttribute('aria-expanded', String(!isOpen));
  if (card) card.classList.toggle('open', !isOpen);
}

// --- REPORTS: render helpers ---

function _renderAdminTxRows(records) {
  if (!records.length) return '<div class="rpt-empty">No matching transactions.</div>';
  return records.map(r => `
    <button type="button" class="rpt-tx-row" onclick="openReportDetail('${r.id}')">
      <div class="rpt-tx-top">
        <span class="rpt-tx-name">${r.residentName}</span>
        <span class="rpt-tx-pts">+${r.points} pts</span>
      </div>
      <div class="rpt-tx-mid">
        <span class="rpt-tx-meta">${r.material} · ${r.weight.toFixed(2)} kg</span>
        <span class="badge badge-${r.status === 'verified' ? 'success' : 'pending'} rpt-tx-status">${r.status === 'verified' ? 'Verified' : r.status}</span>
      </div>
      <div class="rpt-tx-sub">${formatDate(r.date)} · ${r.id} · ${r.collector || '—'}</div>
    </button>
  `).join('<div class="rpt-divider"></div>');
}

function renderAdminTxList(filtered = getFilteredAdminRecords()) {
  const container = el('admin-tx-list');
  if (!container) return;
  const all = AppState.collectionRecords;
  const records = filtered.filter(r => !r.flagged);
  _updateReportsMeta(records, all);
  if (records.length) {
    container.innerHTML = _renderAdminTxRows(records);
  } else {
    const empty = document.createElement('div');
    empty.className = 'rpt-empty';
    empty.textContent = all.some(r => !r.flagged)
      ? 'No verified transactions match your search and filters.'
      : 'No verified transactions on record.';
    container.replaceChildren(empty);
  }
}

function renderSuspiciousActivity(filtered = getFilteredAdminRecords()) {
  const container = el('suspicious-activity-list');
  if (!container) return;

  const flagged = filtered.filter(r => r.flagged);

  // Update flagged count badge
  const flagBadge = el('reports-flagged-count');
  if (flagBadge) flagBadge.textContent = `${flagged.length} flagged`;

  if (!flagged.length) {
    const empty = document.createElement('div');
    empty.className = 'rpt-empty';
    empty.textContent = AppState.collectionRecords.some(r => r.flagged)
      ? 'No flagged deposits match your search and filters.'
      : 'No flagged or suspicious deposits on record.';
    container.replaceChildren(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  flagged.forEach((record, index) => {
    const row = document.createElement('div');
    row.className = 'rpt-flag-row';
    const top = document.createElement('div');
    top.className = 'rpt-flag-top';
    const heading = document.createElement('div');
    heading.className = 'rpt-flag-heading';
    const titleWrap = document.createElement('div');
    titleWrap.className = 'rpt-flag-title-wrap';
    titleWrap.innerHTML = '<svg class="rpt-warn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4M12 17h.01"/></svg>';
    const title = document.createElement('span');
    title.className = 'rpt-flag-title';
    title.textContent = `${record.id} · ${record.weight.toFixed(1)}\u00a0kg ${record.material}`;
    titleWrap.appendChild(title);
    const badgeWrap = document.createElement('div');
    badgeWrap.className = 'rpt-flag-badge-wrap';
    const badge = document.createElement('span');
    badge.className = 'badge rpt-pending-badge';
    badge.textContent = record.reviewStatus
      ? record.reviewStatus.charAt(0).toUpperCase() + record.reviewStatus.slice(1) : 'Pending';
    badgeWrap.appendChild(badge);
    heading.append(titleWrap, badgeWrap);
    const review = document.createElement('button');
    review.type = 'button';
    review.className = 'btn-report-review';
    review.textContent = 'Review';
    review.setAttribute('aria-label', `Review transaction ${record.id}`);
    review.addEventListener('click', () => openFraudReview(record.id));
    top.append(heading, review);
    const body = document.createElement('div');
    body.className = 'rpt-flag-body';
    const people = document.createElement('div');
    people.className = 'rpt-flag-people';
    people.textContent = [record.residentName, record.collector].filter(Boolean).join(' · ');
    const reason = document.createElement('div');
    reason.className = 'rpt-flag-reason';
    reason.textContent = record.flagReason || '';
    body.append(people, reason);
    row.append(top, body);
    if (index) {
      const divider = document.createElement('div');
      divider.className = 'rpt-divider';
      fragment.appendChild(divider);
    }
    fragment.appendChild(row);
  });
  container.replaceChildren(fragment);
}

function _updateReportsMeta(filtered, all) {
  const totalDeposits = all.length;
  const countEl = el('admin-reports-count');
  if (countEl) countEl.textContent = `${totalDeposits} deposit${totalDeposits !== 1 ? 's' : ''} on file`;

  const txCountEl = el('reports-tx-count');
  const nonFlagged = all.filter(r => !r.flagged);
  // Show "X of Y verified" when filtered; just "Y verified" at full view
  if (txCountEl) {
    txCountEl.textContent = filtered.length === nonFlagged.length
      ? `${nonFlagged.length} verified`
      : `${filtered.length} of ${nonFlagged.length} verified`;
  }
}

function _populateCollectorFilter() {
  const sel = el('report-filter-collector');
  if (!sel) return;
  const prev = sel.value;
  const collectors = [...new Set(AppState.collectionRecords.map(r => r.collector).filter(Boolean))].sort();
  // Keep existing options (first = "all")
  while (sel.options.length > 1) sel.remove(1);
  collectors.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    sel.appendChild(opt);
  });
  if (prev && collectors.includes(prev)) sel.value = prev;
}

function getAdminReportFilters() {
  return {
    query: (el('admin-tx-search')?.value || '').toLowerCase().trim(),
    material: el('report-filter-material')?.value || 'all',
    collector: el('report-filter-collector')?.value || 'all',
    date: el('report-filter-date')?.value || 'all'
  };
}

// Both report sections and every refresh use the same selected control values.
function getFilteredAdminRecords(filters = getAdminReportFilters()) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  if (filters.date === 'week') {
    start.setDate(start.getDate() - (start.getDay() + 6) % 7);
    end.setTime(start.getTime());
    end.setDate(end.getDate() + 7);
  } else if (filters.date === 'month') {
    start.setDate(1);
    end.setDate(1);
    end.setMonth(end.getMonth() + 1);
  } else {
    end.setDate(end.getDate() + 1);
  }
  const startKey = collectorLocalDateKey(start);
  const endKey = collectorLocalDateKey(end);

  return AppState.collectionRecords.filter(record => {
    if (filters.material !== 'all' && record.material !== filters.material) return false;
    if (filters.collector !== 'all' && record.collector !== filters.collector) return false;
    if (filters.query && ![record.residentName, record.residentId, record.id, record.material, record.collector]
      .some(value => String(value ?? '').toLowerCase().includes(filters.query))) return false;
    if (filters.date !== 'all') {
      // Date-only deposits retain their recorded day; timestamps use the local day.
      const day = /^\d{4}-\d{2}-\d{2}$/.test(record.date)
        ? record.date : collectorLocalDateKey(new Date(record.date));
      if (!(day >= startKey && day < endKey)) return false;
    }
    return true;
  });
}

function filterAdminReports() {
  const filters = getAdminReportFilters();

  // Show/hide search clear button
  const clearBtn = el('admin-tx-search-clear');
  if (clearBtn) clearBtn.style.display = filters.query ? '' : 'none';

  // Highlight active filter dropdowns
  ['material', 'collector', 'date'].forEach(key => {
    const sel = el(`report-filter-${key}`);
    const wrap = sel?.closest('.reports-select-wrap');
    if (wrap && sel) {
      wrap.classList.toggle('filter-active', sel.value !== 'all');
    }
  });

  // Show "Clear filters" link when any filter is active
  const hasFilter = Boolean(filters.query || filters.material !== 'all' || filters.collector !== 'all' || filters.date !== 'all');
  const actions = el('reports-filter-actions');
  if (actions) actions.hidden = !hasFilter;

  const records = getFilteredAdminRecords(filters);
  renderAdminTxList(records);
  renderSuspiciousActivity(records);
}

function clearAllReportFilters() {
  const inp = el('admin-tx-search');
  if (inp) inp.value = '';
  const mat = el('report-filter-material');
  if (mat) mat.value = 'all';
  const col = el('report-filter-collector');
  if (col) col.value = 'all';
  const date = el('report-filter-date');
  if (date) date.value = 'all';
  const clearSearchBtn = el('admin-tx-search-clear');
  if (clearSearchBtn) clearSearchBtn.style.display = 'none';
  filterAdminReports();
}

function clearAdminReportSearch() {
  const inp = el('admin-tx-search');
  if (inp) { inp.value = ''; inp.focus(); }
  filterAdminReports();
}

// legacy alias kept for any other callers
function searchAdminTx(query) { filterAdminReports(); }

function openReportDetail(recordId) {
  activeReportRecordId = recordId;
  const r = AppState.collectionRecords.find(x => x.id === recordId) || AppState.resident.transactions.find(x => x.id === recordId);
  if (!r) return;

  setText('report-detail-id', r.id);
  setText('rd-txid', r.id);
  setText('report-detail-resident', (r.residentName || 'Maria Santos') + (r.residentId ? ` (${r.residentId})` : ''));
  setText('rd-resident', (r.residentName || 'Maria Santos') + (r.residentId ? ` (${r.residentId})` : ''));
  setText('report-detail-material', r.material || '-');
  setText('rd-material', r.material || '-');
  setText('report-detail-weight', (r.weight ? r.weight.toFixed(2) : (r.kg ? r.kg.toFixed(2) : '0.00')) + ' kg');
  setText('rd-weight', (r.weight ? r.weight.toFixed(2) : (r.kg ? r.kg.toFixed(2) : '0.00')) + ' kg');
  setText('report-detail-points', '+' + r.points + ' pts');
  setText('rd-points', '+' + r.points + ' pts');
  setText('report-detail-date', formatDate(r.date));
  setText('rd-date', formatDate(r.date));
  setText('report-detail-collector', r.collector || 'Rodel Aguila');
  setText('rd-collector', r.collector || 'Rodel Aguila');
  setText('report-detail-status', r.status || 'verified');
  setText('rd-status', r.status || 'verified');

  const verifyBtn = el('rd-verify-btn');
  if (verifyBtn) {
    const canVerify = (r.status !== 'verified') && (r.flagged === true || r.status === 'pending' || r.status === 'flagged');
    verifyBtn.style.display = canVerify ? '' : 'none';
  }

  openModal('modal-report-detail');
}

function resolveFlag(recordId) {
  const id = recordId || activeReportRecordId;
  const r = AppState.collectionRecords.find(x => x.id === id);
  if (!r) return;

  r.flagged = false;
  r.status = 'verified';
  r.reviewStatus = 'cleared';
  r.reviewOutcome = 'Cleared';

  AppState.auditLog.unshift({
    timestamp: nowStr(),
    action: 'Flag resolved & verified',
    detail: `${id} — Manually verified by Admin`
  });

  saveState();
  closeModal('modal-report-detail');
  updateAdminUI();
  showToast(`Transaction ${id} verified and sign-off recorded`, 'success');
}

function openCorrection(recordId) {
  const id = recordId || activeReportRecordId;
  closeModal('modal-report-detail');
  const txInput = el('correction-tx-id');
  if (txInput) txInput.value = id;
  openModal('modal-correction');
}

function submitCorrection(event) {
  if (event && event.preventDefault) event.preventDefault();
  const txId = el('correction-tx-id')?.value || activeReportRecordId;
  const reason = el('correction-reason')?.value || 'Adjustment';
  const desc = el('correction-desc')?.value || '';

  AppState.auditLog.unshift({
    timestamp: nowStr(),
    action: 'Correction requested',
    detail: `${txId} — Reason: ${reason} (${desc})`
  });

  AppState.notifications.admin.unshift({
    id: 'ANOTIF' + uid(),
    title: 'Correction Filed',
    body: `Correction filed for transaction ${txId}: ${reason}`,
    time: nowStr(),
    read: false,
    link: 'reports'
  });

  saveState();
  closeModal('modal-correction');
  showToast(`Correction request filed for ${txId}`, 'success');
}

function appendAuditTokens(container, line) {
  const regex = /(\d[\d,.]*\s*pts)|([A-Za-z]{2,5}-\d{4}-\d+)|((?:DEP|COL|ADM|RES)[A-Z0-9-]{2,})|([A-Z0-9-]{7,})/gi;
  let lastIndex = 0;
  const text = String(line ?? '');
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const plain = document.createElement('span');
      plain.textContent = text.slice(lastIndex, match.index);
      container.appendChild(plain);
    }
    const span = document.createElement('span');
    if (match[1]) {
      span.className = 'rpt-audit-points';
      span.textContent = match[1];
    } else {
      span.className = 'rpt-audit-id';
      span.textContent = match[0];
    }
    container.appendChild(span);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    const plain = document.createElement('span');
    plain.textContent = text.slice(lastIndex);
    container.appendChild(plain);
  }
}
function parseAuditDetail(action, detail) {
  const value = String(detail ?? '').trim();
  if (!value) return [];
  const clean = value.replace(/\s+/g, ' ');

  if (/deposit confirmed/i.test(action)) {
    const match = clean.match(/^([A-Z0-9-]+)\s*[—-]\s*(.+?)\s*[—-]\s*([\d.]+)\s*kg\s+([A-Za-z /]+?)\s*[—-]\s*([\d,]+)\s*pts$/i);
    if (match) return [`${match[1]} · ${match[2]}`, `${match[3]} kg ${match[4]}`, `${match[5]} pts`];
    // Legacy resident-id format: id — weight — material — pts
    const legacy = clean.match(/^([A-Z0-9-]+)\s*[—-]\s*([\d.]+)\s*kg\s+([A-Za-z /]+?)\s*[—-]\s*([\d,]+)\s*pts$/i);
    if (legacy) return [legacy[1], `${legacy[2]} kg ${legacy[3]} · ${legacy[4]} pts`];
  }

  if (/voucher redeemed/i.test(action)) {
    const match = clean.match(/^(.+?)\s*[—-]\s*([\d,]+)\s*pts(?:\s*\((Code:\s*.+)\))?$/i);
    if (match) return [match[1], `${match[2]} pts`, match[3] ? match[3].replace(/[()]/g, '') : ''];
  }

  if (/deposit flagged/i.test(action)) {
    const match = clean.match(/^([A-Z0-9-]+)\s*[—-]\s*(.+)$/i);
    if (match) return [match[1], match[2]];
  }

  if (/account restricted/i.test(action)) {
    const match = clean.match(/^([^(]+)\s*\(([^)]+)\)\s*[—-]\s*(.+)$/i);
    if (match) return [`${match[1].trim()} · ${match[2]}`, match[3]];
  }

  if (/flag resolved/i.test(action)) {
    const match = clean.match(/^([A-Z0-9-]+)\s*[—-]\s*(.+)$/i);
    if (match) return [match[1], match[2]];
  }

  if (/correction requested/i.test(action)) {
    const match = clean.match(/^([A-Z0-9-]+)\s*[—-]\s*Reason:\s*(.+?)(?:\s*\((.*)\))?$/i);
    if (match) return [match[1], match[2], match[3] ? `Note: ${match[3]}` : ''];
  }

  if (/fraud review completed/i.test(action)) {
    const match = clean.match(/^([A-Z0-9-]+)\s*[—-]\s*Outcome:\s*(.+)$/i);
    if (match) return [match[1], `Outcome: ${match[2]}`];
  }

  if (/event proposal submitted/i.test(action)) {
    const match = clean.match(/^(.+?)\s+by\s+(.+)$/i);
    if (match) return [match[1], `Submitted by ${match[2]}`];
  }

  return [clean];
}
function formatAuditTimestamp(timestamp) {
  if (!timestamp) return 'Date unavailable';
  const value = String(timestamp).trim();
  // nowStr() stores UTC with the zone stripped; restore it before local formatting.
  const normalized = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(value)
    ? value.replace(' ', 'T') + 'Z' : value;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';
  return date.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
  });
}

function renderAuditLog() {
  const container = el('audit-log-list');
  const countEl = el('reports-audit-count');
  if (!container) return;

  const allLogs = AppState.auditLog || [];
  if (countEl) countEl.textContent = allLogs.length ? `${allLogs.length} events` : '';

  const logs = allLogs.slice(0, 8);
  if (!logs.length) {
    container.innerHTML = '<div class="rpt-empty">No system audit events recorded.</div>';
    return;
  }

  const fragment = document.createDocumentFragment();
  logs.forEach(log => {
    const row = document.createElement('div');
    row.className = 'rpt-audit-row';
    const main = document.createElement('div');
    main.className = 'rpt-audit-main';
    const action = document.createElement('div');
    action.className = 'rpt-audit-action';
    action.textContent = log.action;
    const detail = document.createElement('div');
    detail.className = 'rpt-audit-detail';
    const parsedDetail = parseAuditDetail(log.action, log.detail);
    if (parsedDetail.length) {
      parsedDetail.forEach((line, index) => {
        const detailLine = document.createElement('div');
        detailLine.className = 'rpt-audit-detail-line';
        if (index === 0) detailLine.classList.add('rpt-audit-detail-primary');
        appendAuditTokens(detailLine, line);
        detail.appendChild(detailLine);
      });
    } else {
      appendAuditTokens(detail, String(log.detail ?? ''));
    }
    const time = document.createElement('div');
    time.className = 'rpt-audit-time';
    time.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
    const timestamp = document.createElement('span');
    timestamp.textContent = formatAuditTimestamp(log.timestamp);
    time.appendChild(timestamp);
    main.append(action, detail);
    row.append(main, time);
    fragment.appendChild(row);
  });
  container.replaceChildren(fragment);
}

function animateCharts() {
  setTimeout(() => {
    document.querySelectorAll('.bar-fill').forEach(bar => {
      // transform-only fill: read the declared % (inline width), then scaleX it
      const declared = bar.getAttribute('data-target') || bar.style.width || '50%';
      const pct = Math.min(100, Math.max(0, parseFloat(declared) || 0));
      bar.style.width = '100%';
      bar.style.transform = `scaleX(${pct / 100})`;
    });
  }, 100);
}

// --- ADMIN DASHBOARD CHARTS (data-driven) ---
function renderAdminTrends() {
  const container = el('trends-chart');
  if (!container) return;
  const records = AppState.collectionRecords || [];
  const latest = records.reduce((acc, r) => (r.date > acc ? r.date : acc), '');
  const end = latest ? new Date(latest + 'T00:00:00') : new Date();
  const localKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    days.push({ key: localKey(d), label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), weight: 0 });
  }
  records.forEach(r => {
    const day = days.find(x => x.key === r.date);
    if (day) day.weight += (r.weight || 0);
  });
  const max = Math.max(1, ...days.map(d => d.weight));
  container.innerHTML = days.map(d => {
    const pct = Math.round((d.weight / max) * 100);
    return `<div class="trend-row">
      <span class="trend-label">${d.label}</span>
      <div class="bar-track"><div class="bar-fill" data-target="${pct}%"></div></div>
      <span class="trend-value">${d.weight.toFixed(1)} kg</span>
    </div>`;
  }).join('');
  const rangeEl = el('trends-range');
  if (rangeEl) rangeEl.textContent = `${days[0].label} – ${days[days.length-1].label}`;
  const summaryEl = el('trends-summary');
  if (summaryEl) {
    const total = days.reduce((s, d) => s + d.weight, 0);
    const count = records.filter(r => days.some(d => d.key === r.date)).length;
    summaryEl.textContent = `${total.toFixed(1)} kg across 7 days · ${count} deposits in the ledger.`;
  }
}

function renderAdminMaterialShare() {
  const container = el('material-share-chart');
  if (!container) return;
  const records = AppState.collectionRecords || [];
  const totals = {};
  records.forEach(r => { totals[r.material] = (totals[r.material] || 0) + (r.weight || 0); });
  const colors = { 'PET Plastic':'#146375', 'Paper/Cardboard':'#3C8D70', 'Aluminum':'#99CB5B', 'Tin/Steel':'#D4EA50', 'Glass':'#CBD5E0' };
  const entries = Object.keys(colors).map(m => ({ material: m, weight: totals[m] || 0 }));
  const total = entries.reduce((s, e) => s + e.weight, 0);
  const totalEl = el('material-share-total');
  if (totalEl) totalEl.textContent = `${total.toFixed(1)} kg recorded`;
  container.innerHTML = entries.map(e => {
    const pct = total ? Math.round((e.weight / total) * 100) : 0;
    const labelHtml = e.material.replace('/', '/<wbr>');
    return `<div class="bar-row">
      <span class="bar-label">${labelHtml}</span>
      <div class="bar-track"><div class="bar-fill" data-target="${pct}%" style="background:${colors[e.material]};"></div></div>
      <span class="bar-value">${e.weight.toFixed(1)} kg (${pct}%)</span>
    </div>`;
  }).join('');
}

function renderAdminBarangayRankings() {
  const container = el('barangay-rankings');
  if (!container) return;
  const records = AppState.collectionRecords || [];
  const totals = {};
  records.forEach(r => { totals[r.barangay] = (totals[r.barangay] || 0) + (r.weight || 0); });
  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((s, e) => s + e[1], 0) || 1;
  const totalBarangays = (AppState.admin && AppState.admin.barangays) || 5;
  const metaEl = el('barangay-rankings-meta');
  if (metaEl) {
    metaEl.textContent = `${entries.length} of ${totalBarangays} active`;
  }
  if (!entries.length) {
    container.innerHTML = '<div style="padding:12px;text-align:center;color:#9CA3AF;font-size:13px">No barangay data.</div>';
    return;
  }
  const rows = entries.map(([name, w], i) => {
    const pct = Math.round((w / total) * 100);
    const cls = i === 0 ? 'text-forest' : '';
    return `<div class="deposit-row" style="${i === entries.length-1 ? 'border-bottom:none;' : ''}">
      <span class="label">${i+1}. ${name.replace('Barangay ','')}</span>
      <span class="value ${cls}">${w.toFixed(1)} kg (${pct}%)</span>
    </div>`;
  }).join('');
  const note = entries.length < totalBarangays
    ? `<div class="bar-summary" style="margin-top:2px;padding:6px 0 2px;font-size:11.5px;color:var(--text-muted);border-top:1px solid var(--border-light);">${entries.length} of ${totalBarangays} participating barangays with recorded deposits.</div>`
    : '';
  container.innerHTML = rows + note;
}

// --- FRAUD REVIEW WORKFLOW ---
function openFraudReview(recordId) {
  currentFraudRecordId = recordId;
  const r = AppState.collectionRecords.find(x => x.id === recordId);
  if (!r) return;

  setText('fr-txid', r.id);
  setText('fr-collector', r.collector);
  setText('fr-resident', r.residentName);
  setText('fr-barangay', r.barangay);
  setText('fr-material', r.material);
  setText('fr-weight', r.weight.toFixed(2) + ' kg');
  setText('fr-points', r.points + ' pts');
  setText('fr-reason', r.flagReason);
  setText('fr-status', r.reviewStatus || 'Pending Review');

  const photoEl = el('fr-photo');
  const placeholderEl = el('fr-photo-placeholder');
  if (r.photoDataUrl) {
    if (photoEl) { photoEl.src = r.photoDataUrl; photoEl.style.display = 'block'; }
    if (placeholderEl) placeholderEl.style.display = 'none';
  } else {
    if (photoEl) photoEl.style.display = 'none';
    if (placeholderEl) placeholderEl.style.display = 'block';
  }

  const notesEl = el('fr-notes');
  if (notesEl) notesEl.value = r.reviewNotes || '';

  const outcomeEl = el('fr-outcome');
  if (outcomeEl) {
    if (r.reviewStatus === 'reviewed' && r.reviewOutcome) {
      outcomeEl.value = r.reviewOutcome;
    } else {
      outcomeEl.value = '';
    }
  }

  openModal('modal-fraud-review');
}

let fraudReviewInFlight = false;
function finishFraudReview() {
  if (fraudReviewInFlight) return;
  const r = AppState.collectionRecords.find(x => x.id === currentFraudRecordId);
  if (!r) return;
  if (r.reviewStatus === 'reviewed') {
    showToast('This deposit has already been reviewed.', 'info');
    closeModal('modal-fraud-review');
    return;
  }

  const notes = el('fr-notes')?.value || '';
  const outcome = el('fr-outcome')?.value || '';
  if (!outcome) {
    showToast('Select a review determination before finishing.', 'error');
    return;
  }
  fraudReviewInFlight = true;

  r.reviewStatus = 'reviewed';
  r.reviewNotes = notes;
  r.reviewOutcome = outcome;

  if (outcome === 'cleared' || outcome === 'Cleared') {
    r.status = 'verified';
    r.flagged = false;
    showToast('Transaction marked legitimate and points cleared', 'success');
  } else {
    r.status = 'flagged';
    r.flagged = true;
    showToast('Irregularity recorded. Points hold confirmed.', 'error');
  }

  AppState.auditLog.unshift({
    timestamp: nowStr(),
    action: 'Fraud review completed',
    detail: `${r.id} — Outcome: ${outcome}`
  });

  saveState();
  closeModal('modal-fraud-review');
  renderSuspiciousActivity();
  updateAdminUI();
  fraudReviewInFlight = false;
}

function cancelFraudReview() {
  fraudReviewInFlight = false;
  closeModal('modal-fraud-review');
}

// --- ADMIN MANAGEMENT TABS ---
function showManageTab(tab) {
  const tabs = ['categories', 'rewards', 'collectors', 'activities'];
  tabs.forEach(t => {
    const btn = el(`manage-tab-${t}`) || el(`manage-tab-btn-${t}`);
    const content = el(`manage-content-${t}`) || el(`manage-tab-${t}`);
    if (btn) btn.classList.toggle('active', t === tab);
    if (content) content.style.display = (t === tab) ? 'block' : 'none';
  });

  if (tab === 'categories') renderCategoriesManage();
  else if (tab === 'rewards') renderRewardsManage();
  else if (tab === 'collectors') renderCollectorsManage();
  else if (tab === 'activities') { renderActivitiesManage(); renderAdminEventProposals(); }
}

function renderManageSections() {
  renderCategoriesManage();
  renderRewardsManage();
  renderCollectorsManage();
  renderActivitiesManage();
  renderAdminEventProposals();
}

// 1. Waste Categories
function renderCategoriesManage() {
  const container = el('categories-manage-list');
  if (!container) return;

  const materials = AppState.wasteMaterials;
  const accepted = materials.filter(m => m.enabled).length;
  setText('categories-manage-count', `${materials.length} categories · ${accepted} accepted`);

  container.innerHTML = `<div class="manage-group">` + materials.map(m => `
    <div class="manage-row">
      <div class="manage-row-info">
        <div class="manage-row-name">${esc(m.name)}</div>
        <div class="manage-row-sub">${m.rate} pts per kg</div>
      </div>
      <div class="manage-row-actions">
        <span class="manage-status-pill${m.enabled ? '' : ' inactive'}">${m.enabled ? 'Active' : 'Inactive'}</span>
        <button class="btn-manage-edit" onclick="openCategoryEdit('${m.id}')" aria-label="Edit ${esc(m.name)}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
      </div>
    </div>
  `).join('') + `</div>`;
}

function toggleCategory(id) {
  const m = AppState.wasteMaterials.find(x => x.id === id);
  if (m) {
    m.enabled = !m.enabled;
    saveState();
    renderCategoriesManage();
    showToast(`${m.name} ${m.enabled ? 'enabled' : 'disabled'}`, 'info');
  }
}

function openCategoryEdit(id) {
  const m = id ? AppState.wasteMaterials.find(x => x.id === id) : null;
  const nameInp = el('edit-cat-name') || el('ce-name');
  const rateInp = el('edit-cat-rate') || el('ce-rate');
  const toggleInp = el('edit-cat-toggle') || el('ce-enabled');
  const idInp = el('edit-cat-id') || el('ce-id');

  if (nameInp) nameInp.value = m?.name || '';
  if (rateInp) rateInp.value = m?.rate || '';
  if (toggleInp) toggleInp.checked = m?.enabled !== false;
  if (idInp) idInp.value = id || '';

  openModal('modal-category-edit');
}

function saveCategoryEdit() {
  const nameInp = el('edit-cat-name') || el('ce-name');
  const rateInp = el('edit-cat-rate') || el('ce-rate');
  const toggleInp = el('edit-cat-toggle') || el('ce-enabled');
  const idInp = el('edit-cat-id') || el('ce-id');

  const id = idInp?.value;
  const name = nameInp?.value?.trim();
  const rate = parseFloat(rateInp?.value);
  const enabled = toggleInp ? toggleInp.checked : true;

  if (!name || isNaN(rate) || rate <= 0) {
    showToast('Please provide a valid category name and rate', 'error');
    return;
  }

  if (id) {
    const m = AppState.wasteMaterials.find(x => x.id === id);
    if (m) { m.name = name; m.rate = rate; m.enabled = enabled; }
  } else {
    AppState.wasteMaterials.push({
      id: 'MAT' + uid().substring(0, 4),
      name,
      rate,
      enabled
    });
  }

  saveState();
  closeModal('modal-category-edit');
  renderCategoriesManage();
  showToast('Category updated successfully', 'success');
}

// 2. Rewards Catalog
function renderRewardsManage() {
  const container = el('rewards-manage-list');
  if (!container) return;

  const rewards = AppState.rewards;
  const available = rewards.filter(r => r.available).length;
  setText('rewards-manage-count', `${rewards.length} rewards · ${available} available`);

  container.innerHTML = `<div class="manage-group">` + rewards.map(r => `
    <div class="manage-row">
      <div class="manage-row-info">
        <div class="manage-row-name">${esc(r.name)}</div>
        <div class="manage-row-sub">${esc(r.merchant)} • <span style="color:var(--color-teal);font-weight:700;">${r.points} pts</span> • Qty: ${r.qty}</div>
      </div>
      <div class="manage-row-actions">
        <span class="manage-status-pill${r.available ? '' : ' inactive'}">${r.available ? 'Available' : 'Unavailable'}</span>
        <button class="btn-manage-edit" onclick="openRewardEdit('${r.id}')" aria-label="Edit ${esc(r.name)}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
      </div>
    </div>
  `).join('') + `</div>`;
}

function toggleReward(id) {
  const r = AppState.rewards.find(x => x.id === id);
  if (r) {
    r.available = !r.available;
    saveState();
    renderRewardsManage();
    renderRewards();
    showToast(`${r.name} availability toggled`, 'info');
  }
}

function openRewardEdit(id) {
  const r = id ? AppState.rewards.find(x => x.id === id) : null;
  const nameInp = el('edit-rwd-name') || el('re-name');
  const merchInp = el('edit-rwd-merchant') || el('re-merchant');
  const ptsInp = el('edit-rwd-pts') || el('re-points');
  const qtyInp = el('edit-rwd-qty') || el('re-qty');
  const descInp = el('edit-rwd-desc') || el('re-desc');
  const idInp = el('edit-rwd-id') || el('re-id');

  if (nameInp) nameInp.value = r?.name || '';
  if (merchInp) merchInp.value = r?.merchant || '';
  if (ptsInp) ptsInp.value = r?.points || '';
  if (qtyInp) qtyInp.value = r?.qty || 25;
  if (descInp) descInp.value = r?.description || '';
  if (idInp) idInp.value = id || '';

  openModal('modal-reward-edit');
}

function saveRewardEdit(event) {
  if (event && event.preventDefault) event.preventDefault();
  const nameInp = el('edit-rwd-name') || el('re-name');
  const merchInp = el('edit-rwd-merchant') || el('re-merchant');
  const ptsInp = el('edit-rwd-pts') || el('re-points');
  const qtyInp = el('edit-rwd-qty') || el('re-qty');
  const descInp = el('edit-rwd-desc') || el('re-desc');
  const idInp = el('edit-rwd-id') || el('re-id');

  const id = idInp?.value;
  const name = nameInp?.value?.trim();
  const merchant = merchInp?.value?.trim();
  const points = parseInt(ptsInp?.value, 10);
  const qty = parseInt(qtyInp?.value, 10) || 20;
  const description = descInp?.value?.trim() || '';

  if (!name || !merchant || isNaN(points) || points <= 0) {
    showToast('Please fill all required reward details', 'error');
    return;
  }

  if (id) {
    const r = AppState.rewards.find(x => x.id === id);
    if (r) Object.assign(r, { name, merchant, points, qty, description });
  } else {
    AppState.rewards.push({
      id: 'RWD' + uid().substring(0, 4),
      name,
      merchant,
      points,
      qty,
      description,
      category: 'grocery',
      available: true
    });
  }

  saveState();
  closeModal('modal-reward-edit');
  renderRewardsManage();
  renderRewards();
  showToast('Reward item saved successfully', 'success');
}

// 3. Collectors Management
function renderCollectorsManage() {
  const cols = AppState.collectors;
  const activeCount = cols.filter(c => c.status === 'active').length;
  setText('col-total-count', cols.length);
  setText('col-active-count', activeCount);
  setText('col-restricted-count', cols.filter(c => c.status === 'restricted').length);
  setText('collectors-manage-count', `${cols.length} officers · ${activeCount} active`);

  const container = el('collectors-manage-list');
  if (!container) return;

  const searchVal = (el('collector-search')?.value || '').toLowerCase().trim();
  const brgyFilter = el('collector-barangay-filter')?.value || 'all';
  const statusFilter = el('collector-status-filter')?.value || 'all';

  let list = cols;
  if (searchVal) {
    list = list.filter(c => c.name.toLowerCase().includes(searchVal) || c.id.toLowerCase().includes(searchVal));
  }
  if (brgyFilter !== 'all' && brgyFilter) {
    list = list.filter(c => c.barangay === brgyFilter);
  }
  if (statusFilter !== 'all' && statusFilter) {
    list = list.filter(c => c.status === statusFilter);
  }

  container.innerHTML = `<div class="manage-group">` + list.map(c => {
    const initials = esc(c.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase());
    const isAct = c.status === 'active';
    return `
    <div class="collector-row">
      <div class="collector-row-avatar${isAct ? '' : ' collector-row-avatar-restricted'}">${initials}</div>
      <div class="collector-row-content">
        <div class="collector-row-top">
          <span class="collector-row-name">${esc(c.name)}</span>
          <span class="manage-status-pill${isAct ? '' : ' inactive'}">${isAct ? 'Active' : 'Restricted'}</span>
        </div>
        <div class="collector-row-sub">${esc(c.barangay)} • ${esc(c.id)}</div>
        <div class="collector-row-action-bar">
          <button class="btn-manage-action" onclick="openCollectorDetails('${c.id}')">View Details</button>
        </div>
      </div>
    </div>`;
  }).join('') + `</div>`;
}

function filterCollectors() {
  renderCollectorsManage();
}

function openCollectorDetails(collectorId) {
  currentViewingCollectorId = collectorId || 'COL-2024-007';
  currentCollectorId = currentViewingCollectorId;
  const c = AppState.collectors.find(x => x.id === currentViewingCollectorId) || AppState.collectors[0];
  if (!c) return;

  setText('cd-avatar', c.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase());
  setText('cd-name', c.name);
  setText('cd-id', c.id);
  setText('cd-barangay', c.barangay);
  setText('cd-email', c.email);
  setText('cd-phone', c.contact || c.phone || '09281234567');
  setText('cd-contact', c.contact || c.phone || '09281234567');
  setText('cd-created', formatDate(c.registeredDate || '2024-01-10'));
  setText('cd-date', formatDate(c.registeredDate || '2024-01-10'));
  setText('cd-total-waste', (c.totalWaste || 124.5).toFixed(1) + ' kg');
  setText('cd-total-deposits', c.totalDeposits || 48);
  setText('cd-total-points', (c.totalPoints || 3240).toLocaleString() + ' pts');

  const statusEl = el('cd-status');
  if (statusEl) {
    statusEl.textContent = c.status === 'active' ? 'Active Officer' : 'Restricted Officer';
    statusEl.className = 'badge badge-' + (c.status === 'active' ? 'active' : 'restricted');
  }

  const btnRestrict = el('btn-cd-restrict') || el('btn-restrict-collector');
  const btnRestore = el('btn-cd-restore') || el('btn-restore-collector');

  if (c.status === 'active') {
    if (btnRestrict) btnRestrict.style.display = 'block';
    if (btnRestore) btnRestore.style.display = 'none';
  } else {
    if (btnRestrict) btnRestrict.style.display = 'none';
    if (btnRestore) btnRestore.style.display = 'block';
  }

  // Populate history
  filterCollectorHistory();
  openModal('modal-collector-details');
}

function openRestrictCollector(id) {
  closeModal('modal-collector-details');
  const targetId = id || currentViewingCollectorId;
  currentViewingCollectorId = targetId;
  currentCollectorId = targetId;

  const c = AppState.collectors.find(x => x.id === targetId);
  if (!c) return;

  setText('rc-collector-name', c.name);
  const reasonInp = el('rc-reason') || el('restrict-reason');
  const notesInp = el('rc-notes') || el('restrict-notes');
  if (reasonInp) reasonInp.value = 'Suspicious Activity';
  if (notesInp) notesInp.value = '';

  openModal('modal-restrict-collector');
}

function confirmRestrictCollector() {
  const c = AppState.collectors.find(x => x.id === currentViewingCollectorId);
  if (!c) return;

  const reasonInp = el('rc-reason') || el('restrict-reason');
  const notesInp = el('rc-notes') || el('restrict-notes');
  const reason = reasonInp?.value || 'Administrative Review';
  const notes = notesInp?.value || '';

  c.status = 'restricted';
  c.restrictionReason = reason + (notes ? ': ' + notes : '');
  c.restrictionDate = new Date().toISOString().split('T')[0];
  if (!c.restrictionHistory) c.restrictionHistory = [];
  c.restrictionHistory.push({
    date: c.restrictionDate,
    reason: c.restrictionReason,
    admin: 'Engr. Josefina Reyes'
  });

  const acc = AppState.accounts.find(a => a.id === c.id || a.email === c.email);
  if (acc) acc.status = 'restricted';

  AppState.notifications.collector.unshift({
    id: 'CNOTIF' + uid(),
    title: 'Account Restricted',
    body: `Your collector authorization has been restricted by LGU Admin. Rationale: ${c.restrictionReason}`,
    time: nowStr(),
    read: false,
    link: null
  });

  AppState.auditLog.unshift({
    timestamp: nowStr(),
    action: 'Account restricted',
    detail: `${c.name} (${c.id}) — ${c.restrictionReason}`
  });

  saveState();
  closeModal('modal-restrict-collector');
  renderCollectorsManage();
  showToast(`Collector officer ${c.name} restricted.`, 'error');
  openCollectorDetails(currentViewingCollectorId);
}

function openRestoreCollector(id) {
  closeModal('modal-collector-details');
  const targetId = id || currentViewingCollectorId;
  currentViewingCollectorId = targetId;
  currentCollectorId = targetId;

  const c = AppState.collectors.find(x => x.id === targetId);
  if (!c) return;

  setText('rst-collector-name', c.name);
  setText('restore-collector-name', c.name);
  const notesInp = el('rst-notes');
  if (notesInp) notesInp.value = '';

  openModal('modal-restore-collector');
}

function confirmRestoreCollector() {
  const c = AppState.collectors.find(x => x.id === currentViewingCollectorId);
  if (!c) return;

  c.status = 'active';
  c.restrictionReason = null;
  c.restrictionDate = null;
  if (!c.restrictionHistory) c.restrictionHistory = [];
  c.restrictionHistory.push({
    date: new Date().toISOString().split('T')[0],
    reason: 'Account reinstated',
    admin: 'Engr. Josefina Reyes'
  });

  const acc = AppState.accounts.find(a => a.id === c.id || a.email === c.email);
  if (acc) acc.status = 'active';

  AppState.notifications.collector.unshift({
    id: 'CNOTIF' + uid(),
    title: 'Account Authorization Restored',
    body: 'Your collector account has been cleared and restored. You can now process resident deposits.',
    time: nowStr(),
    read: false,
    link: null
  });

  AppState.auditLog.unshift({
    timestamp: nowStr(),
    action: 'Account restored',
    detail: `${c.name} (${c.id})`
  });

  saveState();
  closeModal('modal-restore-collector');
  renderCollectorsManage();
  showToast(`Collector authorization restored for ${c.name}`, 'success');
  openCollectorDetails(currentViewingCollectorId);
}

function openCollectorEdit(id) {
  const c = id ? AppState.collectors.find(x => x.id === id) : null;
  const nameInp = el('edit-col-name');
  const idInp = el('edit-col-id');
  const brgyInp = el('edit-col-barangay');
  const emailInp = el('edit-col-email');
  const phoneInp = el('edit-col-phone');
  const statusInp = el('edit-col-status');

  if (nameInp) nameInp.value = c?.name || '';
  if (idInp) idInp.value = c?.id || '';
  if (brgyInp) brgyInp.value = c?.barangay || 'Barangay San Gabriel';
  if (emailInp) emailInp.value = c?.email || '';
  if (phoneInp) phoneInp.value = c?.contact || c?.phone || '';
  if (statusInp) statusInp.checked = c?.status === 'active';

  openModal('modal-collector-edit');
}

function saveCollectorEdit(event) {
  if (event && event.preventDefault) event.preventDefault();
  const name = el('edit-col-name')?.value?.trim();
  const id = el('edit-col-id')?.value?.trim();
  const barangay = el('edit-col-barangay')?.value;
  const email = el('edit-col-email')?.value?.trim();
  const phone = el('edit-col-phone')?.value?.trim();
  const isActive = el('edit-col-status')?.checked;

  if (!name || !email) {
    showToast('Name and email are required', 'error');
    return;
  }

  const existing = AppState.collectors.find(x => x.id === id || x.email === email);
  if (existing) {
    existing.name = name;
    existing.barangay = barangay;
    existing.contact = phone;
    existing.phone = phone;
    existing.status = isActive ? 'active' : 'restricted';
  } else {
    AppState.collectors.push({
      id: id || ('COL-2024-' + String(AppState.collectors.length + 1).padStart(3, '0')),
      name,
      barangay,
      email,
      contact: phone,
      phone,
      status: isActive ? 'active' : 'restricted',
      registeredDate: new Date().toISOString().split('T')[0],
      totalWaste: 0,
      totalDeposits: 0,
      totalPoints: 0,
      restrictionReason: null,
      restrictionDate: null,
      restrictionHistory: []
    });
  }

  saveState();
  closeModal('modal-collector-edit');
  renderCollectorsManage();
  showToast('Collector account saved', 'success');
}

// 4. Activities & Event Proposals
function renderActivitiesManage() {
  const container = el('approved-events-list');
  if (!container) return;

  const events = AppState.activities;
  setText('activities-manage-count', `${events.length} published`);
  container.innerHTML = `<div class="manage-group">` + events.map(a => `
    <div class="manage-card-row">
      <div class="manage-card-header">
        <div class="manage-card-title">${esc(a.name)}</div>
        <div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
          <span class="manage-status-pill">Approved</span>
          <button class="btn-manage-edit" onclick="openActivityEdit('${a.id}')" aria-label="Edit ${esc(a.name)}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
        </div>
      </div>
      <div class="manage-card-sub">${formatDate(a.date)} • ${esc(a.location)}</div>
      <div class="manage-card-desc">${esc(a.description)}</div>
      <div class="manage-card-meta">+${a.participationPts} EcoToken attendance reward</div>
    </div>
  `).join('') + `</div>`;
}

function openActivityEdit(id) {
  const a = id ? AppState.activities.find(x => x.id === id) : null;
  const nameInp = el('edit-act-name') || el('ae-name');
  const typeInp = el('edit-act-type') || el('ae-type');
  const dateInp = el('edit-act-date') || el('ae-date');
  const locInp = el('edit-act-location') || el('ae-location');
  const descInp = el('edit-act-desc') || el('ae-desc');
  const ptsInp = el('edit-act-pts') || el('ae-pts');
  const idInp = el('edit-act-id') || el('ae-id');

  if (nameInp) nameInp.value = a?.name || '';
  if (typeInp) typeInp.value = a?.type || 'cleanup';
  if (dateInp) dateInp.value = a?.date || '';
  if (locInp) locInp.value = a?.location || '';
  if (descInp) descInp.value = a?.description || '';
  if (ptsInp) ptsInp.value = a?.participationPts || 50;
  if (idInp) idInp.value = id || '';

  openModal('modal-activity-edit');
}

function saveActivityEdit(event) {
  if (event && event.preventDefault) event.preventDefault();
  const nameInp = el('edit-act-name') || el('ae-name');
  const typeInp = el('edit-act-type') || el('ae-type');
  const dateInp = el('edit-act-date') || el('ae-date');
  const locInp = el('edit-act-location') || el('ae-location');
  const descInp = el('edit-act-desc') || el('ae-desc');
  const ptsInp = el('edit-act-pts') || el('ae-pts');
  const idInp = el('edit-act-id') || el('ae-id');

  const id = idInp?.value;
  const name = nameInp?.value?.trim();
  const type = typeInp?.value || 'cleanup';
  const date = dateInp?.value?.trim();
  const location = locInp?.value?.trim() || 'Barangay Plaza';
  const description = descInp?.value?.trim() || '';
  const pts = parseInt(ptsInp?.value, 10) || 50;

  if (!name || !date) {
    showToast('Name and date are required', 'error');
    return;
  }

  if (id) {
    const a = AppState.activities.find(x => x.id === id);
    if (a) Object.assign(a, { name, type, date, location, description, participationPts: pts });
  } else {
    AppState.activities.push({
      id: 'ACT' + uid().substring(0, 4),
      name,
      type,
      date,
      location,
      description,
      participationPts: pts,
      status: 'approved',
      proposedBy: null
    });
  }

  saveState();
  closeModal('modal-activity-edit');
  renderActivitiesManage();
  updateResidentHomeUI();
  showToast('Activity published successfully', 'success');
}

function renderAdminEventProposals() {
  const container = el('event-proposals-admin-list');
  if (!container) return;

  const proposals = AppState.eventProposals;
  const pending = proposals.filter(p => p.status === 'pending').length;
  setText('proposals-manage-count', `${proposals.length} submitted · ${pending} pending`);
  if (!proposals.length) {
    container.innerHTML = '<div style="padding:20px;text-align:center;color:#9CA3AF;font-size:13px">No event proposals pending review.</div>';
    return;
  }

  container.innerHTML = `<div class="manage-group">` + proposals.map(p => `
    <div class="manage-card-row">
      <div class="manage-card-header">
        <div class="manage-card-title">${esc(p.title)}</div>
        <span class="manage-status-pill${p.status === 'pending' ? '' : ' inactive'}" style="text-transform: capitalize;">${p.status}</span>
      </div>
      <div class="manage-card-sub">${esc(p.barangay)} • ${formatDate(p.date)}</div>
      <div class="manage-card-sub">Proposed by: ${esc(p.proposedBy)}</div>
      <div class="manage-card-desc">${esc(p.description)}</div>
      <div class="manage-card-footer">
        <button class="btn-manage-action" onclick="openEventProposalReview('${p.id}')">Review Proposal</button>
      </div>
    </div>
  `).join('') + `</div>`;
}

function openEventProposalForm() {
  const form = el('modal-event-proposal')?.querySelector('form');
  if (form) form.reset();
  const brgyInp = el('prop-barangay');
  if (brgyInp) brgyInp.value = 'Barangay San Gabriel';
  openModal('modal-event-proposal');
}

function submitEventProposal(event) {
  if (event && event.preventDefault) event.preventDefault();

  const title = el('prop-title')?.value?.trim();
  const category = el('prop-category')?.value || 'Recycling Campaign';
  const desc = el('prop-desc')?.value?.trim() || '';
  const location = el('prop-location')?.value?.trim();
  const date = el('prop-date')?.value;
  const start = el('prop-start-time')?.value || '08:00';
  const end = el('prop-end-time')?.value || '12:00';
  const participants = parseInt(el('prop-participants')?.value, 10) || 50;
  const pts = parseInt(el('prop-points')?.value, 10) || 30;
  const remarks = el('prop-remarks')?.value?.trim() || '';

  if (!title || !date || !location) {
    showToast('Please fill out all required fields', 'error');
    return;
  }

  const colAcc = AppState.accounts.find(a => a.role === 'collector');
  const proposal = {
    id: 'PROP' + uid().substring(0, 4),
    title,
    category,
    description: desc,
    barangay: colAcc?.barangay || 'Barangay San Gabriel',
    location,
    date,
    startTime: start,
    endTime: end,
    participants,
    ecoPointReward: pts,
    remarks,
    proposedBy: colAcc?.name || 'Rodel Aguila',
    proposedById: colAcc?.id || 'COL-2024-007',
    status: 'pending',
    submittedDate: new Date().toISOString().split('T')[0],
    rejectionReason: null
  };

  AppState.eventProposals.unshift(proposal);

  AppState.notifications.collector.unshift({
    id: 'CNOTIF' + uid(),
    title: 'Event Proposal Submitted',
    body: `Your proposal "${title}" has been submitted for LGU review.`,
    time: nowStr(),
    read: false,
    link: null
  });

  AppState.notifications.admin.unshift({
    id: 'ANOTIF' + uid(),
    title: 'New Event Proposal',
    body: `${proposal.proposedBy} submitted "${title}" for budget and point allocation.`,
    time: nowStr(),
    read: false,
    link: 'manage'
  });

  AppState.auditLog.unshift({
    timestamp: nowStr(),
    action: 'Event proposal submitted',
    detail: `${title} by ${proposal.proposedBy}`
  });

  saveState();
  closeModal('modal-event-proposal');
  renderAdminEventProposals();
  updateNotifBadge('admin');
  updateNotifBadge('collector');
  showToast(`Proposal "${title}" submitted to LGU Admin!`, 'success');
}

let proposalActionInFlight = false;

function openEventProposalReview(proposalId) {
  currentProposalId = proposalId;
  const p = AppState.eventProposals.find(x => x.id === proposalId);
  if (!p) return;

  setText('epr-title', p.title);
  setText('epr-category', p.category);
  setText('epr-barangay', p.barangay);
  setText('epr-location', p.location);
  setText('epr-date-time', `${formatDate(p.date)} • ${p.startTime || ''} - ${p.endTime || ''}`);
  setText('epr-participants', p.participants + ' Residents');
  setText('epr-pts', (p.ecoPointReward || 50) + ' pts / participant');
  const totalBudget = (p.participants || 50) * (p.ecoPointReward || 50);
  setText('epr-budget-total', totalBudget.toLocaleString());
  setText('epr-desc', p.description);
  setText('epr-remarks', p.remarks || 'None specified');
  setText('epr-proposer', `Proposed by ${p.proposedBy} (${p.barangay})`);

  const statusEl = el('epr-status');
  if (statusEl) {
    statusEl.textContent = p.status.toUpperCase();
    statusEl.className = 'badge badge-' + (p.status === 'approved' ? 'success' : p.status === 'rejected' ? 'error' : 'pending');
  }

  const approveBtn = el('btn-approve-proposal') || document.querySelector('#modal-event-proposal-review .btn-primary');
  const rejectBox = el('epr-reject-box');
  const mainActions = el('epr-main-actions');
  if (rejectBox) rejectBox.style.display = 'none';
  if (mainActions) mainActions.style.display = 'flex';
  proposalActionInFlight = false;

  if (p.status === 'pending') {
    if (approveBtn) approveBtn.style.display = 'block';
  } else {
    if (approveBtn) approveBtn.style.display = 'none';
  }

  openModal('modal-event-proposal-review');
}

function showRevisionBox() {
  const box = el('epr-reject-box');
  const reasonInp = el('epr-reject-reason');
  const mainActions = el('epr-main-actions');
  if (box) box.style.display = 'block';
  if (mainActions) mainActions.style.display = 'none';
  if (reasonInp) { reasonInp.value = ''; reasonInp.focus(); }
}

function cancelRevisionRequest() {
  const box = el('epr-reject-box');
  const mainActions = el('epr-main-actions');
  if (box) box.style.display = 'none';
  if (mainActions) mainActions.style.display = 'flex';
}

function confirmRevisionRequest() {
  if (proposalActionInFlight) return;
  const reasonInp = el('epr-reject-reason');
  const reason = reasonInp?.value?.trim();
  if (!reason) {
    showToast('Please provide notes explaining what needs revision.', 'error');
    return;
  }
  rejectEventProposal();
}

function approveEventProposal(proposalId) {
  if (proposalActionInFlight) return;
  const id = proposalId || currentProposalId;
  const p = AppState.eventProposals.find(x => x.id === id);
  if (!p) return;

  proposalActionInFlight = true;
  p.status = 'approved';

  // Add into resident-facing activities list
  AppState.activities.push({
    id: 'ACT' + uid().substring(0, 4),
    name: p.title,
    type: p.category.toLowerCase().includes('clean') ? 'cleanup' : p.category.toLowerCase().includes('plant') ? 'planting' : 'seminar',
    date: p.date,
    location: p.location,
    description: p.description,
    participationPts: p.ecoPointReward || 50,
    status: 'approved',
    proposedBy: p.proposedBy
  });

  AppState.notifications.collector.unshift({
    id: 'CNOTIF' + uid(),
    title: 'Event Proposal Approved!',
    body: `Your proposal "${p.title}" was approved by LGU Admin. EcoToken budget has been allocated.`,
    time: nowStr(),
    read: false,
    link: null
  });

  AppState.notifications.resident.unshift({
    id: 'RNOTIF' + uid(),
    title: 'New Community Event',
    body: `${p.title} scheduled on ${formatDate(p.date)} at ${p.location}. Earn ${p.ecoPointReward || 50} EcoToken!`,
    time: nowStr(),
    read: false,
    link: 'home'
  });

  AppState.auditLog.unshift({
    timestamp: nowStr(),
    action: 'Event proposal approved',
    detail: `${p.title} (${p.barangay})`
  });

  saveState();
  closeModal('modal-event-proposal-review');
  renderAdminEventProposals();
  renderActivitiesManage();
  updateResidentHomeUI();
  updateNotifBadge('collector');
  updateNotifBadge('resident');

  showToast('Event proposal approved! EcoToken budget allocated.', 'success');
  proposalActionInFlight = false;
}

function rejectEventProposal() {
  if (proposalActionInFlight) return;
  const p = AppState.eventProposals.find(x => x.id === currentProposalId);
  if (!p) return;

  const rejectBox = el('epr-reject-box');
  const reasonInp = el('epr-reject-reason');

  if (rejectBox && rejectBox.style.display === 'none') {
    showRevisionBox();
    showToast('Please specify the revision notes before confirming return.', 'info');
    return;
  }

  const reason = reasonInp?.value?.trim() || 'Logistical coordination needed';
  proposalActionInFlight = true;
  p.status = 'rejected';
  p.rejectionReason = reason;

  AppState.notifications.collector.unshift({
    id: 'CNOTIF' + uid(),
    title: 'Event Proposal Revision Required',
    body: `Your proposal "${p.title}" was returned with notes: ${reason}`,
    time: nowStr(),
    read: false,
    link: null
  });

  AppState.auditLog.unshift({
    timestamp: nowStr(),
    action: 'Event proposal returned',
    detail: `${p.title} — Notes: ${reason}`
  });

  saveState();
  closeModal('modal-event-proposal-review');
  renderAdminEventProposals();
  updateNotifBadge('collector');
  showToast('Event proposal returned to collector officer with revision notes.', 'info');
  proposalActionInFlight = false;
}

function showCollectorEventsPanel() {
  openEventProposalForm();
}

function renderCollectorProposals() {
  renderAdminEventProposals();
}

// --- CSV EXPORT ---
function exportCSV() {
  const headers = ['Transaction_ID', 'Resident_Name', 'Resident_ID', 'Waste_Material', 'Weight_kg', 'EcoToken', 'Date', 'Collector_Officer', 'Barangay', 'Audit_Status'];
  const rows = AppState.collectionRecords.map(r => [
    `"${r.id}"`,
    `"${r.residentName}"`,
    `"${r.residentId}"`,
    `"${r.material}"`,
    r.weight,
    r.points,
    `"${r.date}"`,
    `"${r.collector}"`,
    `"${r.barangay}"`,
    `"${r.status}"`
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `rikna_transactions_audit_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('Audit CSV exported successfully!', 'success');
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  loadState();

  // Clear currentUser on fresh browser load to present Welcome screen
  AppState.currentUser = null;

  // Reset collector wizard variables
  currentStep = 1;
  currentWizardStep = 1;
  clearVerifiedResident();
  selectedMaterial = null;
  depositPhotoDataUrl = null;

  // Show Welcome screen initially
  showScreen('screen-welcome');
  initWelcomeInteractions();
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('page-hidden', document.hidden);
  });

  // Enable finger-tracking swipes between main tabs
  initSwipeNavigation();

  // Pre-render QR pattern for default resident
  renderQRGrid('qr-code-display', 'RES-2024-001');
  renderQRGrid('qr-code-display-modal', 'RES-2024-001');

  // Prepopulate Demo accounts in login screen if fields exist
  const emailInput = el('login-email');
  const passInput = el('login-password');
  if (emailInput && !emailInput.value) emailInput.value = 'rikna.resident.demo@gmail.com';
  if (passInput && !passInput.value) passInput.value = 'Resident123!';
});
