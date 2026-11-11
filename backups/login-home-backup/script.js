// =============================================================================
// RIKNA - MOBILE RECYCLING REWARDS APP
// Vanilla JavaScript SPA - Complete Implementation
// =============================================================================

'use strict';

// --- INITIAL STATE TEMPLATE ---
const INITIAL_STATE = {
  currentUser: null,
  accounts: [
    { email: 'rikna.resident.demo@gmail.com', password: 'Resident123!', role: 'resident', name: 'Maria Santos', id: 'RES-2024-001', contact: '09171234567', barangay: 'Barangay San Isidro', municipality: 'Quezon City', registeredDate: '2024-03-15' },
    { email: 'rikna.collector.demo@gmail.com', password: 'Collector123!', role: 'collector', name: 'Rodel Aguila', id: 'COL-2024-007', contact: '09281234567', barangay: 'Barangay San Isidro', registeredDate: '2024-01-10', status: 'active', restrictionReason: null, restrictionDate: null },
    { email: 'rikna.admin.demo@gmail.com', password: 'Admin123!', role: 'admin', name: 'Engr. Josefina Reyes', id: 'ADM-2024-001', contact: '09391234567', barangay: 'LGU Quezon City', registeredDate: '2024-01-01' }
  ],
  resident: {
    points: 500, pendingPoints: 0, lifetimePoints: 1240, kgRecycled: 18.5, deposits: 12,
    transactions: [
      { id: 'TXN001', type: 'earned', label: 'PET Plastic Deposit', points: 90, date: '2026-11-05', kg: 3.0, material: 'PET Plastic', collector: 'Rodel Aguila', barangay: 'Barangay San Isidro', status: 'verified', photo: null, remarks: 'Clean and sorted' },
      { id: 'TXN002', type: 'earned', label: 'Aluminum Deposit', points: 120, date: '2026-11-02', kg: 2.0, material: 'Aluminum', collector: 'Rodel Aguila', barangay: 'Barangay San Isidro', status: 'verified', photo: null, remarks: 'Crushed soda cans' },
      { id: 'TXN003', type: 'spent', label: 'SM Supermarket ₱50 Voucher', points: -100, date: '2026-10-30', status: 'redeemed', merchant: 'SM Supermarket' },
      { id: 'TXN004', type: 'earned', label: 'Paper Deposit', points: 50, date: '2026-10-25', kg: 5.0, material: 'Paper/Cardboard', collector: 'Rodel Aguila', barangay: 'Barangay San Isidro', status: 'verified', photo: null, remarks: 'Folded cartons' },
      { id: 'TXN005', type: 'spent', label: 'Jollibee ₱30 Discount', points: -80, date: '2026-10-20', status: 'redeemed', merchant: 'Jollibee' },
      { id: 'TXN006', type: 'earned', label: 'Glass Deposit', points: 15, date: '2026-10-15', kg: 3.0, material: 'Glass', collector: 'Rodel Aguila', barangay: 'Barangay San Isidro', status: 'verified', photo: null, remarks: 'Bottles uncracked' },
      { id: 'TXN007', type: 'earned', label: 'Tin/Steel Deposit', points: 24, date: '2026-10-10', kg: 2.0, material: 'Tin/Steel', collector: 'Rodel Aguila', barangay: 'Barangay San Isidro', status: 'verified', photo: null, remarks: 'Washed food tins' },
      { id: 'TXN008', type: 'earned', label: 'PET Plastic Deposit', points: 60, date: '2026-10-05', kg: 2.0, material: 'PET Plastic', collector: 'Rodel Aguila', barangay: 'Barangay San Isidro', status: 'verified', photo: null, remarks: 'Standard drop' }
    ],
    vouchers: [
      { id: 'VCH001', name: 'SM Supermarket ₱50 Voucher', code: 'SM-RKN-5839', status: 'used', pointsSpent: 100, expiry: '2026-12-31', merchant: 'SM Supermarket', redeemedDate: '2026-10-30' },
      { id: 'VCH002', name: 'Jollibee ₱30 Discount', code: 'JB-RKN-2947', status: 'used', pointsSpent: 80, expiry: '2026-12-31', merchant: 'Jollibee', redeemedDate: '2026-10-20' }
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
    { id: 'RWD005', name: 'Grab ₱50 Ride Credit', merchant: 'Grab', points: 120, category: 'transport', available: true, qty: 25, description: '₱50 Grab ride credit automatically added to your Grab wallet.' },
    { id: 'RWD006', name: '7-Eleven ₱20 Credit', merchant: '7-Eleven', points: 50, category: 'grocery', available: true, qty: 50, description: '₱20 CLiQQ wallet credit redeemable at all 7-Eleven stores.' }
  ],
  collectionRecords: [
    { id: 'DEP001', residentName: 'Maria Santos', residentId: 'RES-2024-001', material: 'PET Plastic', weight: 3.0, points: 90, date: '2026-11-05', collector: 'Rodel Aguila', collectorId: 'COL-2024-007', barangay: 'Barangay San Isidro', status: 'verified', photoDataUrl: null, remarks: 'Verified by officer', flagged: false, flagReason: '', reviewStatus: null, reviewNotes: null, reviewOutcome: null },
    { id: 'DEP002', residentName: 'Jose Reyes', residentId: 'RES-2024-002', material: 'Aluminum', weight: 1.5, points: 90, date: '2026-11-05', collector: 'Rodel Aguila', collectorId: 'COL-2024-007', barangay: 'Barangay San Isidro', status: 'verified', photoDataUrl: null, remarks: 'Batch collection', flagged: false, flagReason: '', reviewStatus: null, reviewNotes: null, reviewOutcome: null },
    { id: 'DEP003', residentName: 'Ana Dela Cruz', residentId: 'RES-2024-003', material: 'Paper/Cardboard', weight: 4.2, points: 42, date: '2026-11-04', collector: 'Rodel Aguila', collectorId: 'COL-2024-007', barangay: 'Barangay San Isidro', status: 'verified', photoDataUrl: null, remarks: 'Folded paper bundles', flagged: false, flagReason: '', reviewStatus: null, reviewNotes: null, reviewOutcome: null },
    { id: 'DEP004', residentName: 'Pedro Lim', residentId: 'RES-2024-004', material: 'Glass', weight: 2.8, points: 14, date: '2026-11-04', collector: 'Rodel Aguila', collectorId: 'COL-2024-007', barangay: 'Barangay San Isidro', status: 'flagged', photoDataUrl: null, remarks: 'Frequent dropoffs', flagged: true, flagReason: 'Multiple deposits within 1 hour window', reviewStatus: 'pending', reviewNotes: null, reviewOutcome: null },
    { id: 'DEP005', residentName: 'Carmen Bautista', residentId: 'RES-2024-005', material: 'Tin/Steel', weight: 1.0, points: 12, date: '2026-11-03', collector: 'Rodel Aguila', collectorId: 'COL-2024-007', barangay: 'Barangay San Isidro', status: 'verified', photoDataUrl: null, remarks: '', flagged: false, flagReason: '', reviewStatus: null, reviewNotes: null, reviewOutcome: null },
    { id: 'DEP006', residentName: 'Rodrigo Mendoza', residentId: 'RES-2024-006', material: 'PET Plastic', weight: 25.0, points: 750, date: '2026-11-03', collector: 'Rodel Aguila', collectorId: 'COL-2024-007', barangay: 'Barangay San Isidro', status: 'flagged', photoDataUrl: null, remarks: 'Bulk commercial drop', flagged: true, flagReason: 'Unusually high weight (25.0 kg) exceeds 15 kg threshold', reviewStatus: 'pending', reviewNotes: null, reviewOutcome: null }
  ],
  collectors: [
    { id: 'COL-2024-007', name: 'Rodel Aguila', barangay: 'Barangay San Isidro', email: 'rikna.collector.demo@gmail.com', contact: '09281234567', phone: '09281234567', status: 'active', registeredDate: '2024-01-10', totalWaste: 124.5, totalDeposits: 48, totalPoints: 3240, restrictionReason: null, restrictionDate: null, restrictionHistory: [] },
    { id: 'COL-2024-008', name: 'Ligaya Santos', barangay: 'Barangay Pinyahan', email: 'ligaya.santos@brgy.gov.ph', contact: '09191234567', phone: '09191234567', status: 'active', registeredDate: '2024-02-20', totalWaste: 98.2, totalDeposits: 36, totalPoints: 2450, restrictionReason: null, restrictionDate: null, restrictionHistory: [] },
    { id: 'COL-2024-009', name: 'Ernesto Flores', barangay: 'Barangay Ugong', email: 'ernesto.flores@brgy.gov.ph', contact: '09301234567', phone: '09301234567', status: 'restricted', registeredDate: '2024-03-05', totalWaste: 56.7, totalDeposits: 22, totalPoints: 1120, restrictionReason: 'Suspicious deposit activity under review', restrictionDate: '2026-10-28', restrictionHistory: [{ date: '2026-10-28', reason: 'Suspicious deposit activity under review', admin: 'Engr. Josefina Reyes' }] }
  ],
  collectionCenters: [
    { id: 'CC001', name: 'Barangay San Isidro Eco Center', address: '123 Eco Street, Barangay San Isidro, Quezon City', hours: 'Mon–Sat 7:00 AM – 5:00 PM', contact: '(02) 1234-5678', materials: ['PET Plastic', 'Paper/Cardboard', 'Aluminum', 'Tin/Steel', 'Glass'] },
    { id: 'CC002', name: 'Barangay Pinyahan Drop-off Hub', address: '45 Green Avenue, Barangay Pinyahan, Quezon City', hours: 'Mon–Fri 8:00 AM – 4:00 PM', contact: '(02) 2345-6789', materials: ['PET Plastic', 'Paper/Cardboard', 'Glass'] }
  ],
  activities: [
    { id: 'ACT001', name: 'Barangay Clean-Up Drive', type: 'cleanup', date: '2026-11-15', location: 'Barangay San Isidro Plaza', description: 'Community cleanup of main streets and waterways. Bring gloves and eco bags.', participationPts: 50, status: 'approved', proposedBy: null },
    { id: 'ACT002', name: 'Tree Planting Initiative', type: 'planting', date: '2026-11-22', location: 'Barangay San Isidro Park', description: 'Plant 200 native trees in our barangay park. Seedlings provided.', participationPts: 75, status: 'approved', proposedBy: null }
  ],
  eventProposals: [
    { id: 'PROP001', title: 'Community Recycling Campaign', category: 'Recycling Campaign', description: 'A one-day recycling drive targeting households in Sitio Masagana.', barangay: 'Barangay San Isidro', location: 'Sitio Masagana Covered Court', date: '2026-12-05', startTime: '8:00 AM', endTime: '3:00 PM', participants: 50, ecoPointReward: 30, remarks: 'Please provide sorting bins.', proposedBy: 'Rodel Aguila', proposedById: 'COL-2024-007', status: 'pending', submittedDate: '2026-11-01', rejectionReason: null }
  ],
  notifications: {
    resident: [
      { id: 'RNOTIF001', title: 'EcoPoints Credited', body: 'You earned 90 EcoPoints for your PET Plastic deposit on Nov 5.', time: '2026-11-05 14:32', read: false, link: 'wallet' },
      { id: 'RNOTIF002', title: 'Deposit Verified', body: 'Your deposit DEP001 has been verified by Rodel Aguila.', time: '2026-11-05 14:33', read: false, link: 'wallet' },
      { id: 'RNOTIF003', title: 'Upcoming Event', body: 'Barangay Clean-Up Drive is on Nov 15. Earn 50 EcoPoints!', time: '2026-11-04 09:00', read: true, link: 'home' },
      { id: 'RNOTIF004', title: 'Voucher Expiring Soon', body: 'Your SM Supermarket ₱50 Voucher expires on Dec 31, 2026.', time: '2026-11-03 10:00', read: true, link: 'rewards' }
    ],
    collector: [
      { id: 'CNOTIF001', title: 'Deposit Recorded Successfully', body: 'Deposit DEP001 for Maria Santos (3.0 kg PET Plastic) has been confirmed.', time: '2026-11-05 14:32', read: false, link: 'records' },
      { id: 'CNOTIF002', title: 'New Environmental Program', body: 'LGU Quezon City launches the Green Barangay Challenge. Submit proposals by Nov 30.', time: '2026-11-04 08:00', read: true, link: null },
      { id: 'CNOTIF003', title: 'Event Proposal Under Review', body: 'Your Community Recycling Campaign proposal is currently under LGU review.', time: '2026-11-01 15:00', read: true, link: null }
    ],
    admin: [
      { id: 'ANOTIF001', title: 'New Event Proposal', body: 'Rodel Aguila submitted: Community Recycling Campaign (Barangay San Isidro).', time: '2026-11-01 15:00', read: false, link: 'manage' },
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
    localStorage.setItem('riknaAppState_v2', JSON.stringify(AppState));
  } catch(e) {
    console.warn('LocalStorage save error:', e);
  }
}

function loadState() {
  try {
    const s = localStorage.getItem('riknaAppState_v2');
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
  try { localStorage.removeItem('riknaAppState_v2'); } catch(e) {}
  selectedResident = null;
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
function showToast(message, type = 'info') {
  let toast = el('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    document.body.appendChild(toast);
  }
  if (!el('toast-styles')) {
    const s = document.createElement('style');
    s.id = 'toast-styles';
    s.textContent = `
      #app-toast {
        position: fixed;
        bottom: 84px;
        left: 50%;
        transform: translateX(-50%) translateY(24px) scale(0.9);
        padding: 12px 22px;
        border-radius: 16px;
        font-size: 13.5px;
        font-weight: 600;
        color: #ffffff;
        z-index: 99999;
        opacity: 0;
        transition: opacity 0.2s var(--ease-out), transform 0.35s var(--ease-bounce);
        pointer-events: none;
        white-space: normal;
        line-height: 1.4;
        max-width: min(90vw, 400px);
        text-align: center;
        box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
      }
      #app-toast.active {
        opacity: 1;
        transform: translateX(-50%) translateY(0) scale(1);
      }
      .toast-success { background: #166534 !important; }
      .toast-error { background: #991B1B !important; }
      .toast-info { background: #146375 !important; }
      .toast-warn, .toast-warning { background: #D97706 !important; }
      @media (prefers-reduced-motion: reduce) {
        #app-toast { transition: opacity 0.2s; transform: translateX(-50%); }
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
  toast._t = setTimeout(() => {
    toast.classList.remove('active');
  }, 3200);
}

// --- MODAL DIALOGS ---
function openModal(id) {
  const e = el(id);
  if (e) {
    e.classList.remove('closing'); // cancel an in-flight close, if any
    e.classList.add('active');
    e.setAttribute('aria-hidden', 'false');
  }
}

function closeModal(id) {
  const e = el(id);
  if (!e || !e.classList.contains('active')) return;
  e.classList.add('closing');
  e.setAttribute('aria-hidden', 'true');
  const done = () => {
    // If reopened mid-close, openModal cleared .closing — don't kill it.
    if (!e.classList.contains('closing')) return;
    e.classList.remove('active', 'closing');
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
    document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id));
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
let welcomeLeaving = false;

function showScreen(screenId, direction) {
  const current = document.querySelector('.screen.active');
  const target = el(screenId);
  if (!target) return;

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

  // Fade path (welcome/login/register, or reduced motion): finish any
  // in-flight glide instantly, then crossfade-free simple entrance.
  if (activeGlide) glideFinish();
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.classList.remove('screen-enter', 'entrance-dramatic');
  });
  target.classList.add('active', 'screen-enter');

  // Manage Bottom Navbars
  ['nav-resident', 'nav-collector', 'nav-admin'].forEach(id => {
    const nav = el(id);
    if (nav) nav.classList.remove('visible');
  });

  if (screenId === 'screen-welcome') {
    target.classList.remove('welcome-leaving');
    welcomeLeaving = false;
  }

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

// --- WELCOME EXIT (Get Started → login) -----------------------------------
// Dramatic lift-out: the whole welcome field rises like a curtain and
// fades, then login arrives with its own rise stagger. Reduced motion
// skips straight to the plain route.
function goToLogin() {
  const welcome = el('screen-welcome');
  if (welcomeLeaving || !welcome) return;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    showScreen('screen-login');
    return;
  }
  welcomeLeaving = true;
  welcome.classList.add('welcome-leaving');
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    showScreen('screen-login');
    const h = document.querySelector('#screen-login .login-title');
    if (h) h.focus({ preventScroll: true });
  };
  welcome.addEventListener('transitionend', finish, { once: true });
  setTimeout(finish, 700);
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
  resident: ['home', 'wallet', 'qr', 'rewards', 'profile', 'notifications'],
  collector: ['home', 'scan', 'records', 'notifications', 'profile'],
  admin: ['home', 'manage', 'reports', 'notifications', 'profile'],
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

function showCollectorTab(tab) {
  const map = {
    home: 'screen-collector-home',
    scan: 'screen-collector-scan',
    records: 'screen-collector-records',
    notifications: 'screen-collector-notifications',
    profile: 'screen-collector-profile'
  };
  if (!map[tab]) return;
  showScreen(map[tab], tabDirection('collector', tab));
  updateNavActive('nav-collector', 'navbtn-collector-' + tab);
  refreshTab('collector', tab);
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
    else if (tab === 'wallet') renderTransactions(walletTabFilter);
    else if (tab === 'qr') renderQRScreen();
    else if (tab === 'rewards') renderRewards();
    else if (tab === 'profile') renderProfileScreen();
    else if (tab === 'notifications') renderNotifications('resident');
  } else if (role === 'collector') {
    if (tab === 'home') updateCollectorHomeUI();
    else if (tab === 'scan') goToStep(1);
    else if (tab === 'records') renderCollectorRecords(currentRecordFilter);
    else if (tab === 'notifications') renderNotifications('collector');
    else if (tab === 'profile') renderCollectorProfileScreen();
  } else if (role === 'admin') {
    if (tab === 'home') updateAdminUI();
    else if (tab === 'manage') { renderManageSections(); showManageTab('categories'); }
    else if (tab === 'reports') { renderAdminTxList(); renderSuspiciousActivity(); renderAuditLog(); }
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
  const ctx = swipeScreenContext(screen);
  if (!ctx) return;
  // Never hijack touches inside horizontally scrollable children
  let n = e.target;
  while (n && n !== screen) {
    const ox = getComputedStyle(n).overflowX;
    if (ox === 'auto' || ox === 'scroll') return;
    n = n.parentElement;
  }
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

  // Arm the EcoPoints count-up for exactly this render, then disarm —
  // the count plays once, on login, and never on returning to Home.
  countUpArmed = true;
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
    barangay: barangay || 'Barangay San Isidro',
    municipality: 'Quezon City',
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
  if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
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
  showToast(`Loaded ${email.split('.')[1] || 'demo'} credentials`, 'info');
}

function toggleDemoPanel() {
  const body = el('demo-panel-body');
  const chevron = el('demo-chevron');
  if (!body) return;
  const isHidden = body.style.display === 'none' || body.style.display === '';
  body.style.display = isHidden ? 'flex' : 'none';
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
      <span class="activity-amount"><strong></strong><small>EcoPoints</small></span>`;
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
      <span class="home-event-footer"><span class="home-event-reward"></span><span class="home-event-link">Details <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14m-5-5 5 5-5 5"/></svg></span></span></span>`;
    const date = new Date(a.date + 'T00:00:00');
    const validDate = !Number.isNaN(date.getTime());
    card.querySelector('.home-event-month').textContent = validDate ? date.toLocaleDateString('en-US', { month: 'short' }) : 'Date';
    card.querySelector('.home-event-date strong').textContent = validDate ? date.getDate() : '—';
    card.querySelector('.home-event-year').textContent = validDate ? date.getFullYear() : 'To follow';
    card.querySelector('.home-event-copy > strong').textContent = a.name;
    card.querySelector('.home-event-location').textContent = a.location;
    card.querySelector('.home-event-time').textContent = a.startTime || a.time || '';
    const reward = card.querySelector('.home-event-reward');
    reward.textContent = a.participationPts > 0 ? '+' + a.participationPts.toLocaleString() + ' EcoPoints' : '';
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
  setText('event-detail-desc', a.description);
  setText('event-detail-pts', '+' + a.participationPts + ' EcoPoints for participation');
  openModal('modal-event-detail');
}

function renderProfileScreen() {
  const user = AppState.currentUser || AppState.accounts[0];
  const r = AppState.resident;
  const approvedEvents = (Array.isArray(AppState.activities) ? AppState.activities : [])
    .filter(a => a.status === 'approved').length;

  setText('profile-name', user.name);
  setText('profile-email', user.email);
  setText('profile-email-detail', user.email);
  setText('profile-member-since', 'Member since ' + formatDate(user.registeredDate || '2024-03-15'));
  setText('profile-id', user.id);
  setText('profile-display-phone', user.contact);
  setText('profile-barangay', user.barangay);
  setText('profile-barangay-detail', user.barangay);
  setText('profile-municipality', user.municipality || 'Quezon City');
  setText('profile-total-kg', r.kgRecycled.toFixed(1));
  setText('profile-total-deposits', String(r.deposits));
  setText('profile-lifetime-pts', r.lifetimePoints.toLocaleString());
  setText('profile-community-events', String(approvedEvents));

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
  const col = AppState.collectors.find(c => c.email === user.email) || AppState.collectors[0];
  setText('collector-profile-name', user.name);
  setText('collector-profile-email', user.email);
  setText('collector-profile-id', user.id || col?.id || 'COL-2024-007');
  setText('collector-profile-barangay', user.barangay || col?.barangay || '-');
  setText('collector-profile-contact', user.contact || col?.contact || '-');
  setText('collector-profile-since', 'Collector since ' + formatDate(user.registeredDate || col?.registeredDate || '2024-01-10'));
  setText('cp-kg-today', (AppState.collector.kgToday || 0).toFixed(1));
  setText('cp-tx-today', AppState.collector.txToday || 0);
  const statusEl = el('collector-profile-status');
  if (statusEl && col) {
    statusEl.textContent = col.status === 'active' ? 'Active' : 'Restricted';
    statusEl.className = 'badge ' + (col.status === 'active' ? 'badge-active' : 'badge-restricted');
  }
  const avatar = el('collector-profile-avatar');
  if (avatar) avatar.textContent = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

// --- ADMIN PROFILE SCREEN ---
function renderAdminProfileScreen() {
  const user = AppState.currentUser || AppState.accounts.find(a => a.role === 'admin');
  if (!user) return;
  setText('admin-profile-name', user.name);
  setText('admin-profile-email', user.email);
  setText('admin-profile-id', user.id || 'ADM-2024-001');
  setText('admin-profile-barangay', user.barangay || 'LGU Quezon City');
  setText('admin-profile-contact', user.contact || '-');
  setText('admin-profile-since', 'Administrator since ' + formatDate(user.registeredDate || '2024-01-01'));
  setText('ap-residents', AppState.admin.registeredResidents);
  setText('ap-collectors', AppState.collectors.length);
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
          ${detailRow('Transaction Type', tx.type === 'earned' ? '⬆ Points Earned' : '⬇ Points Redeemed')}
          ${detailRow('Date Recorded', formatDate(tx.date))}
          ${tx.material ? detailRow('Waste Material', tx.material) : ''}
          ${tx.kg ? detailRow('Measured Weight', tx.kg + ' kg') : ''}
          ${tx.weight ? detailRow('Measured Weight', tx.weight + ' kg') : ''}
          ${tx.collector ? detailRow('Collector Officer', tx.collector) : ''}
          ${tx.barangay ? detailRow('Barangay Drop-off', tx.barangay) : ''}
          ${detailRow('EcoPoints Impact', (tx.points > 0 ? '+' : '') + tx.points + ' pts')}
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
  essentials: 'Essentials',
  transport: 'Transport'
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
  ticket.setAttribute('aria-label', 'View ' + reward.name + ' — ' + reward.points.toLocaleString() + ' EcoPoints' +
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
    redeem.setAttribute('aria-label', 'Need ' + needed.toLocaleString() + ' more EcoPoints');
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
  setText('vd-pts-required', r.points.toLocaleString() + ' EcoPoints');
  setText('vd-user-pts', userPts.toLocaleString() + ' EcoPoints');

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
  setText('vc-pts-deduct', r.points + ' EcoPoints');
  setText('vc-pts-after', after.toLocaleString() + ' EcoPoints');
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
    body: `You redeemed ${r.name} for ${r.points} EcoPoints. Claim Code: ${code}`,
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
function goToStep(step) {
  if (step < 1 || step > 5) return;
  currentStep = step;
  currentWizardStep = step;

  for (let i = 1; i <= 5; i++) {
    const c = el('step-' + i + '-content');
    if (c) c.classList.toggle('active', i === step);
    const d = el('step-dot-' + i);
    if (d) {
      d.className = 'step-dot' + (i === step ? ' active' : i < step ? ' done' : '');
    }
  }

  if (step === 4 || step === 5) {
    updateCalculation();
  }
  if (step === 5) {
    populateDepositSummary();
  }
}

function nextStep() {
  if (currentStep === 1) {
    if (!selectedResident) {
      showToast('Please scan or select a resident first', 'error');
      return;
    }
  }
  if (currentStep === 2) {
    if (!selectedMaterial) {
      showToast('Please select an accepted waste material', 'error');
      return;
    }
  }
  if (currentStep === 3) {
    const weightEl = el('manual-weight-input');
    const w = parseFloat(weightEl?.value);
    const errEl = el('weight-error');
    if (!w || w <= 0 || isNaN(w)) {
      if (errEl) {
        errEl.textContent = 'Please enter a valid weight greater than 0 kg.';
        errEl.style.display = 'block';
      }
      showToast('Please enter a valid weight', 'error');
      return;
    }
    if (errEl) errEl.style.display = 'none';
    AppState.collector.currentDeposit.weight = w;
    AppState.collector.currentDeposit.remarks = el('deposit-remarks')?.value || '';
    updateCalculation();
  }

  if (currentStep < 5) {
    goToStep(currentStep + 1);
  }
}

function prevStep() {
  if (currentStep > 1) {
    goToStep(currentStep - 1);
  }
}

function selectDemoResident() {
  selectedResident = {
    name: 'Maria Santos',
    id: 'RES-2024-001',
    barangay: 'Barangay San Isidro'
  };
  AppState.collector.currentDeposit.resident = selectedResident;

  setText('scan-resident-name', selectedResident.name);
  setText('scan-resident-id', selectedResident.id);
  setText('scan-resident-barangay', selectedResident.barangay);

  const card = el('scanned-resident-card');
  if (card) card.style.display = 'block';
  const btn = el('btn-step1-continue');
  if (btn) btn.style.display = 'block';

  renderQRGrid('scanner-qr-preview', selectedResident.id);
  showToast('Scanned: Maria Santos (RES-2024-001)', 'success');
}

function selectMaterial(materialId) {
  selectedMaterial = AppState.wasteMaterials.find(m => m.id === materialId);
  AppState.collector.currentDeposit.material = selectedMaterial;

  document.querySelectorAll('.material-option').forEach(e => {
    e.classList.toggle('selected', e.getAttribute('data-id') === materialId || e.id === 'mat-' + materialId);
  });

  showToast(`Selected: ${selectedMaterial.name} (${selectedMaterial.rate} pts/kg)`, 'info');
  updateCalculation();
}

function handlePhotoUpload(event) {
  const file = event?.target?.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    depositPhotoDataUrl = e.target.result;
    AppState.collector.currentDeposit.photoDataUrl = depositPhotoDataUrl;

    const preview = el('photo-preview-area');
    const img = el('photo-preview-img');
    const confirmThumb = el('confirm-photo-thumb');
    const confirmNoPhoto = el('confirm-no-photo');
    const previewFull = el('photo-preview-full');

    if (preview) preview.style.display = 'block';
    if (img) img.src = depositPhotoDataUrl;
    if (confirmThumb) {
      confirmThumb.src = depositPhotoDataUrl;
      confirmThumb.style.display = 'inline-block';
    }
    if (confirmNoPhoto) confirmNoPhoto.style.display = 'none';
    if (previewFull) previewFull.src = depositPhotoDataUrl;

    showToast('Scale documentation photo attached!', 'success');
  };
  reader.readAsDataURL(file);
}

function removePhoto() {
  depositPhotoDataUrl = null;
  AppState.collector.currentDeposit.photoDataUrl = null;

  const preview = el('photo-preview-area');
  if (preview) preview.style.display = 'none';

  const input = el('photo-upload-input');
  if (input) input.value = '';

  const confirmThumb = el('confirm-photo-thumb');
  const confirmNoPhoto = el('confirm-no-photo');
  if (confirmThumb) confirmThumb.style.display = 'none';
  if (confirmNoPhoto) confirmNoPhoto.style.display = 'inline';

  showToast('Photo removed', 'info');
}

function triggerPhotoUpload() {
  const input = el('photo-upload-input');
  if (input) input.click();
}

function updateCalculation() {
  const w = AppState.collector.currentDeposit.weight || parseFloat(el('manual-weight-input')?.value) || 0;
  const mat = selectedMaterial || AppState.collector.currentDeposit.material;
  if (!mat) return;

  const pts = Math.round(w * mat.rate);
  AppState.collector.currentDeposit.points = pts;

  setText('calc-material', mat.name);
  setText('calc-weight', w.toFixed(2) + ' kg');
  setText('calc-rate', mat.rate + ' pts/kg');
  setText('calc-formula', `${w.toFixed(2)} kg × ${mat.rate} pts/kg`);
  setText('calc-weight-val', w.toFixed(2));
  setText('calc-rate-val', mat.rate);
  setText('calc-points-val', pts);
  setText('summary-total-pts', '+' + pts + ' pts');
}

function populateDepositSummary() {
  const d = AppState.collector.currentDeposit;
  const colName = AppState.accounts.find(a => a.role === 'collector')?.name || 'Rodel Aguila';
  const remarks = el('deposit-remarks')?.value || d.remarks || 'None';

  setText('summary-resident', d.resident?.name || 'Maria Santos');
  setText('summary-resident-id', d.resident?.id || 'RES-2024-001');
  setText('summary-material', d.material?.name || '-');
  setText('summary-weight', (d.weight || 0).toFixed(2) + ' kg');
  setText('summary-rate', (d.material?.rate || 0) + ' pts/kg');
  setText('summary-points', (d.points || 0) + ' EcoPoints');
  setText('summary-total-pts', '+' + (d.points || 0) + ' pts');
  setText('summary-collector', colName);
  setText('summary-remarks', remarks);

  const thumb = el('confirm-photo-thumb');
  const noPhoto = el('confirm-no-photo');
  if (d.photoDataUrl) {
    if (thumb) { thumb.src = d.photoDataUrl; thumb.style.display = 'inline-block'; }
    if (noPhoto) noPhoto.style.display = 'none';
  } else {
    if (thumb) thumb.style.display = 'none';
    if (noPhoto) noPhoto.style.display = 'inline';
  }
}

function confirmDeposit() {
  // Check restriction
  const colAcc = AppState.accounts.find(a => a.role === 'collector');
  const colRecord = AppState.collectors.find(c => c.id === 'COL-2024-007' || c.email === colAcc?.email);
  if (colRecord?.status === 'restricted') {
    showToast('Your account is restricted. You cannot submit deposits.', 'error');
    return;
  }

  const d = AppState.collector.currentDeposit;
  if (!d.resident || !d.material || !d.weight) {
    showToast('Incomplete deposit. Please complete all steps.', 'error');
    return;
  }

  const pts = d.points || Math.round(d.weight * d.material.rate);
  const isHigh = d.weight > 15;
  const txId = 'DEP' + uid().substring(0, 6);
  const dateStr = new Date().toISOString().split('T')[0];
  const colName = colAcc?.name || 'Rodel Aguila';

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
    title: 'EcoPoints Credited',
    body: `You earned ${pts} EcoPoints for your ${d.material.name} deposit (${d.weight.toFixed(2)} kg).`,
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

  // Populate success modal
  setText('ds-txid', txId);
  setText('ds-resident', d.resident.name);
  setText('ds-material', d.material.name);
  setText('ds-weight', d.weight.toFixed(2) + ' kg');
  setText('ds-points', '+' + pts + ' EcoPoints');

  saveState();
  updateCollectorUI();
  updateAdminUI();
  updateResidentUI();

  openModal('modal-deposit-success');

  // Reset scan wizard state after brief delay
  setTimeout(() => {
    selectedResident = null;
    selectedMaterial = null;
    depositPhotoDataUrl = null;
    AppState.collector.currentDeposit = { resident: null, material: null, weight: 0, points: 0, photoDataUrl: null, remarks: '' };

    const weightInput = el('manual-weight-input');
    if (weightInput) weightInput.value = '';
    const remarksInput = el('deposit-remarks');
    if (remarksInput) remarksInput.value = '';

    removePhoto();
    const card = el('scanned-resident-card');
    if (card) card.style.display = 'none';
    const btn = el('btn-step1-continue');
    if (btn) btn.style.display = 'none';

    document.querySelectorAll('.material-option').forEach(e => e.classList.remove('selected'));
    goToStep(1);
  }, 400);
}

// --- COLLECTOR RECORDS & INVENTORY ---
function renderCollectorRecords(filter) {
  const container = el('records-list');
  if (!container) return;

  let records = AppState.collectionRecords;
  if (filter?.material && filter.material !== 'all') {
    records = records.filter(r => r.material.toLowerCase().includes(filter.material.toLowerCase()));
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    records = records.filter(r => r.residentName.toLowerCase().includes(q) || r.residentId.toLowerCase().includes(q) || r.id.toLowerCase().includes(q));
  }
  if (filter?.date === 'today') {
    const today = new Date().toISOString().split('T')[0];
    records = records.filter(r => r.date === today);
  } else if (filter?.date === 'week') {
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    records = records.filter(r => r.date >= weekAgo);
  }

  if (!records.length) {
    container.innerHTML = '<div style="padding:32px;text-align:center;color:#9CA3AF;font-size:14px">No collection records matching filters.</div>';
    return;
  }

  container.innerHTML = records.map(r => `
    <div class="tx-item" onclick="openTransactionDetail('${r.id}')">
      <div class="tx-info">
        <div class="tx-title">${r.residentName} <span style="font-size:12px;font-weight:400;color:#94A3B8">(${r.id})</span></div>
        <div class="tx-subtitle">${r.material} • ${r.weight.toFixed(2)} kg • ${formatDate(r.date)}</div>
      </div>
      <div style="text-align:right">
        <div class="tx-amount earned">+${r.points} pts</div>
        <span class="badge badge-${r.status==='verified'?'success':r.status==='flagged'?'warning':'pending'}">${r.status}</span>
      </div>
    </div>
  `).join('');
}

function filterRecords() {
  const search = (el('collector-records-search')?.value || el('records-search')?.value || '').toLowerCase().trim();
  currentRecordFilter.search = search;
  renderCollectorRecords(currentRecordFilter);
}

function setRecordMaterialFilter(mat, btn) {
  currentRecordFilter.material = mat;
  document.querySelectorAll('#records-material-chips .chip').forEach(c => {
    const chipMat = c.getAttribute('data-mat') || '';
    c.classList.toggle('active', chipMat === mat);
  });
  renderCollectorRecords(currentRecordFilter);
}

function setRecordDateFilter(d) {
  currentRecordFilter.date = d;
  document.querySelectorAll('#records-date-filter .chip').forEach(c => {
    c.classList.toggle('active', c.getAttribute('data-date') === d || c.textContent.trim().toLowerCase() === d.toLowerCase());
  });
  renderCollectorRecords(currentRecordFilter);
}

function updateCollectorUI() {
  setText('collector-kg-today', AppState.collector.kgToday.toFixed(1) + ' kg');
  setText('collector-tx-count', AppState.collector.txToday);
  setText('collector-pts-awarded', AppState.collector.ptsToday + ' pts');

  renderCollectorRecentDeposits();
  renderCollectorRecords(currentRecordFilter);
  renderMaterialInventory();
  updateNotifBadge('collector');
}

function updateCollectorHomeUI() {
  setText('collector-kg-today', AppState.collector.kgToday.toFixed(1) + ' kg');
  setText('collector-tx-count', AppState.collector.txToday);
  setText('collector-pts-awarded', AppState.collector.ptsToday + ' pts');

  renderCollectorRecentDeposits();
  renderMaterialInventory();
  updateNotifBadge('collector');
}

function renderCollectorRecentDeposits() {
  const container = el('collector-recent-list');
  if (!container) return;

  const recent = AppState.collectionRecords.slice(0, 3);
  if (!recent.length) {
    container.innerHTML = '<div style="padding:16px;text-align:center;color:#9CA3AF;font-size:14px">No deposits recorded today.</div>';
    return;
  }

  container.innerHTML = recent.map(r => `
    <div class="tx-item" onclick="openTransactionDetail('${r.id}')">
      <div class="tx-info">
        <div class="tx-title">${r.residentName}</div>
        <div class="tx-subtitle">${r.material} • ${r.weight.toFixed(2)} kg</div>
      </div>
      <div style="text-align:right">
        <div class="tx-amount earned">+${r.points} pts</div>
        <span class="badge badge-${r.flagged ? 'warning' : 'success'}">${r.status}</span>
      </div>
    </div>
  `).join('');
}

function renderMaterialInventory() {
  const container = el('material-inventory-table');
  if (!container) return;

  const summary = {};
  AppState.collectionRecords.forEach(r => {
    if (!summary[r.material]) summary[r.material] = { kg: 0, count: 0, pts: 0 };
    summary[r.material].kg += r.weight;
    summary[r.material].count++;
    summary[r.material].pts += r.points;
  });

  container.innerHTML = Object.entries(summary).map(([mat, s]) => `
    <div class="tx-item" style="padding:10px 0;border-bottom:1px solid #EDF2F7">
      <div class="tx-info"><div class="tx-title" style="font-weight:600">${mat}</div></div>
      <div style="text-align:right;font-size:13px;color:#64748B">${s.kg.toFixed(1)} kg • ${s.count} deposits • ${s.pts.toLocaleString()} pts</div>
    </div>
  `).join('');
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
  setText('admin-total-waste', AppState.admin.totalWaste.toFixed(1) + ' kg');
  setText('admin-residents', AppState.admin.registeredResidents);
  setText('admin-points-dist', AppState.admin.pointsDistributed.toLocaleString());
  setText('admin-vouchers-redeemed', AppState.admin.vouchersRedeemed);

  renderAdminTxList();
  renderSuspiciousActivity();
  renderAuditLog();
  animateCharts();
  updateNotifBadge('admin');
}

function renderAdminTxList() {
  const container = el('admin-tx-list');
  if (!container) return;
  const records = AppState.collectionRecords.filter(r => !r.flagged);

  if (!records.length) {
    container.innerHTML = '<div style="padding:24px;text-align:center;color:#9CA3AF;font-size:14px">No verified transactions found.</div>';
    return;
  }

  container.innerHTML = records.map(r => `
    <div class="tx-item" onclick="openReportDetail('${r.id}')">
      <div class="tx-info">
        <div class="tx-title">${r.residentName} <span style="font-size:12px;color:#94A3B8">(${r.id})</span></div>
        <div class="tx-subtitle">${r.material} • ${r.weight.toFixed(2)} kg • ${formatDate(r.date)}</div>
      </div>
      <div style="text-align:right">
        <div class="tx-amount earned">+${r.points} pts</div>
        <span class="badge badge-${r.status==='verified'?'success':'pending'}">${r.status}</span>
      </div>
    </div>
  `).join('');
}

function renderSuspiciousActivity() {
  const container = el('suspicious-activity-list');
  if (!container) return;

  const flagged = AppState.collectionRecords.filter(r => r.flagged);
  if (!flagged.length) {
    container.innerHTML = '<div class="card" style="padding:16px;text-align:center;color:#64748B;font-size:13px">No pending suspicious activities or flagged deposits.</div>';
    return;
  }

  container.innerHTML = flagged.map(r => `
    <div class="card" style="border-left:4px solid #DC2626;margin:0 0 12px;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div>
          <span class="badge badge-warning" style="margin-bottom:6px">${r.reviewStatus || 'pending review'}</span>
          <div style="font-size:14.5px;font-weight:700;color:#1A2332">${r.id} • ${r.weight.toFixed(2)} kg ${r.material}</div>
          <div style="font-size:12.5px;color:#64748B;margin-top:3px">Resident: ${r.residentName} • Officer: ${r.collector}</div>
        </div>
        <button class="btn-leaf" style="font-size:12px;padding:6px 14px;width:auto;flex-shrink:0" onclick="openFraudReview('${r.id}')">Review</button>
      </div>
      <div style="font-size:13px;color:#991B1B;background:#FEF2F2;padding:6px 10px;border-radius:6px;margin-top:6px">
        ⚠️ ${r.flagReason}
      </div>
    </div>
  `).join('');
}

function searchAdminTx(query) {
  const q = (typeof query === 'string' ? query : (el('admin-tx-search')?.value || el('admin-search')?.value || '')).toLowerCase().trim();
  const container = el('admin-tx-list');
  if (!container) return;

  const records = AppState.collectionRecords.filter(r => !r.flagged && (
    r.residentName.toLowerCase().includes(q) ||
    r.residentId.toLowerCase().includes(q) ||
    r.material.toLowerCase().includes(q) ||
    r.id.toLowerCase().includes(q) ||
    (r.collector && r.collector.toLowerCase().includes(q))
  ));

  if (!records.length) {
    container.innerHTML = '<div style="padding:24px;text-align:center;color:#9CA3AF;font-size:14px">No transactions match your query.</div>';
    return;
  }

  container.innerHTML = records.map(r => `
    <div class="tx-item" onclick="openReportDetail('${r.id}')">
      <div class="tx-info">
        <div class="tx-title">${r.residentName} <span style="font-size:12px;color:#94A3B8">(${r.id})</span></div>
        <div class="tx-subtitle">${r.material} • ${r.weight.toFixed(2)} kg • ${formatDate(r.date)}</div>
      </div>
      <div style="text-align:right">
        <div class="tx-amount earned">+${r.points} pts</div>
        <span class="badge badge-success">${r.status}</span>
      </div>
    </div>
  `).join('');
}

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

function renderAuditLog() {
  const container = el('audit-log-list');
  if (!container) return;

  const logs = AppState.auditLog.slice(0, 8);
  if (!logs.length) {
    container.innerHTML = '<div style="padding:16px;text-align:center;color:#9CA3AF;font-size:13px">No system audit events recorded.</div>';
    return;
  }

  container.innerHTML = logs.map(l => `
    <div style="padding:10px 0;border-bottom:1px solid #EDF2F7;display:flex;justify-content:space-between;align-items:flex-start;font-size:13px">
      <div>
        <div style="font-weight:700;color:#1A2332">${l.action}</div>
        <div style="color:#64748B;font-size:12px;margin-top:2px">${l.detail}</div>
      </div>
      <div style="font-size:11px;color:#94A3B8;white-space:nowrap;margin-left:8px">${l.timestamp}</div>
    </div>
  `).join('');
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
  if (outcomeEl) outcomeEl.value = r.reviewOutcome || 'cleared';

  openModal('modal-fraud-review');
}

function finishFraudReview() {
  const r = AppState.collectionRecords.find(x => x.id === currentFraudRecordId);
  if (!r) return;

  const notes = el('fr-notes')?.value || '';
  const outcome = el('fr-outcome')?.value || 'cleared';

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
}

function cancelFraudReview() {
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

  container.innerHTML = AppState.wasteMaterials.map(m => `
    <div class="manage-item" style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:white;border-radius:12px;margin-bottom:8px;border:1px solid #E2E8F0">
      <div class="manage-item-info">
        <div class="manage-item-name" style="font-weight:700;color:#1A2332">${m.name}</div>
        <div class="manage-item-sub" style="font-size:12px;color:#64748B">${m.rate} pts/kg</div>
      </div>
      <div style="display:flex;align-items:center;gap:12px">
        <label class="toggle-switch">
          <input type="checkbox" ${m.enabled ? 'checked' : ''} onchange="toggleCategory('${m.id}')">
          <span class="toggle-slider"></span>
        </label>
        <button class="btn-icon" style="background:#F1F5F9;border:none;border-radius:8px;padding:6px;cursor:pointer" onclick="openCategoryEdit('${m.id}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
      </div>
    </div>
  `).join('');
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

  container.innerHTML = AppState.rewards.map(r => `
    <div class="manage-item" style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:white;border-radius:12px;margin-bottom:8px;border:1px solid #E2E8F0">
      <div class="manage-item-info">
        <div class="manage-item-name" style="font-weight:700;color:#1A2332">${r.name}</div>
        <div class="manage-item-sub" style="font-size:12px;color:#64748B">${r.points} pts • ${r.merchant} • Qty: ${r.qty}</div>
      </div>
      <div style="display:flex;align-items:center;gap:12px">
        <label class="toggle-switch">
          <input type="checkbox" ${r.available ? 'checked' : ''} onchange="toggleReward('${r.id}')">
          <span class="toggle-slider"></span>
        </label>
        <button class="btn-icon" style="background:#F1F5F9;border:none;border-radius:8px;padding:6px;cursor:pointer" onclick="openRewardEdit('${r.id}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
      </div>
    </div>
  `).join('');
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
  setText('col-total-count', cols.length);
  setText('col-active-count', cols.filter(c => c.status === 'active').length);
  setText('col-restricted-count', cols.filter(c => c.status === 'restricted').length);

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

  container.innerHTML = list.map(c => `
    <div class="collector-card" style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:white;border-radius:12px;margin-bottom:8px;border:1px solid #E2E8F0">
      <div class="collector-avatar-sm" style="width:36px;height:36px;border-radius:50%;background:#3C8D70;color:white;display:flex;align-items:center;justify-content:center;font-weight:700">
        ${c.name.charAt(0)}
      </div>
      <div class="collector-card-info" style="flex:1">
        <div class="collector-card-name" style="font-weight:700;color:#1A2332">${c.name}</div>
        <div class="collector-card-sub" style="font-size:12px;color:#64748B">${c.barangay} • ${c.id}</div>
        <span class="badge badge-${c.status === 'active' ? 'success' : 'restricted'}" style="margin-top:2px;font-size:10px">${c.status === 'active' ? 'Active' : 'Restricted'}</span>
      </div>
      <button class="btn-view-details" style="background:#F1F5F9;border:1px solid #CBD5E1;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer" onclick="openCollectorDetails('${c.id}')">View Details</button>
    </div>
  `).join('');
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
  if (brgyInp) brgyInp.value = c?.barangay || 'Barangay San Isidro';
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
  container.innerHTML = events.map(a => `
    <div class="proposal-card" style="padding:14px;background:white;border-radius:12px;border:1px solid #E2E8F0;margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div class="proposal-card-title" style="font-weight:700;font-size:15px;color:#1A2332">${a.name}</div>
          <div class="proposal-card-sub" style="font-size:12px;color:#64748B;margin-top:2px">${formatDate(a.date)} • ${a.location}</div>
        </div>
        <span class="badge badge-success">Approved</span>
      </div>
      <div style="font-size:13px;color:#475569;margin-top:8px;line-height:1.4">${a.description}</div>
      <div style="font-size:12px;color:#166534;margin-top:8px;font-weight:700">+${a.participationPts} EcoPoints attendance reward</div>
      <button class="btn-icon" style="margin-top:10px;background:#F1F5F9;border:1px solid #CBD5E1;border-radius:6px;padding:5px 12px;font-size:12px;cursor:pointer" onclick="openActivityEdit('${a.id}')">
        Edit Activity
      </button>
    </div>
  `).join('');
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
  if (!proposals.length) {
    container.innerHTML = '<div style="padding:20px;text-align:center;color:#9CA3AF;font-size:13px">No event proposals pending review.</div>';
    return;
  }

  container.innerHTML = proposals.map(p => `
    <div class="proposal-card" style="padding:14px;background:white;border-radius:12px;border:1px solid #E2E8F0;margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
        <div>
          <div class="proposal-card-title" style="font-weight:700;font-size:15px;color:#1A2332">${p.title}</div>
          <div class="proposal-card-sub" style="font-size:12px;color:#64748B">${p.barangay} • ${formatDate(p.date)}</div>
          <div class="proposal-card-sub" style="font-size:12px;color:#3C8D70;margin-top:2px">Proposed by: ${p.proposedBy}</div>
        </div>
        <span class="badge badge-${p.status === 'approved' ? 'success' : p.status === 'rejected' ? 'error' : 'pending'}">${p.status}</span>
      </div>
      <p style="font-size:13px;color:#475569;margin:8px 0;line-height:1.4">${p.description}</p>
      <button class="btn-leaf" style="font-size:12px;padding:6px 14px;width:auto;margin-top:4px" onclick="openEventProposalReview('${p.id}')">
        Review Proposal
      </button>
    </div>
  `).join('');
}

function openEventProposalForm() {
  const form = el('modal-event-proposal')?.querySelector('form');
  if (form) form.reset();
  const brgyInp = el('prop-barangay');
  if (brgyInp) brgyInp.value = 'Barangay San Isidro';
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
    barangay: colAcc?.barangay || 'Barangay San Isidro',
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
  if (rejectBox) rejectBox.style.display = 'none';

  if (p.status === 'pending') {
    if (approveBtn) approveBtn.style.display = 'block';
  } else {
    if (approveBtn) approveBtn.style.display = 'none';
  }

  openModal('modal-event-proposal-review');
}

function approveEventProposal(proposalId) {
  const id = proposalId || currentProposalId;
  const p = AppState.eventProposals.find(x => x.id === id);
  if (!p) return;

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
    body: `Your proposal "${p.title}" was approved by LGU Admin. EcoPoint budget has been allocated.`,
    time: nowStr(),
    read: false,
    link: null
  });

  AppState.notifications.resident.unshift({
    id: 'RNOTIF' + uid(),
    title: 'New Community Event',
    body: `${p.title} scheduled on ${formatDate(p.date)} at ${p.location}. Earn ${p.ecoPointReward || 50} EcoPoints!`,
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

  showToast('Event proposal approved! EcoPoint budget allocated.', 'success');
}

function rejectEventProposal() {
  const p = AppState.eventProposals.find(x => x.id === currentProposalId);
  if (!p) return;

  const rejectBox = el('epr-reject-box');
  const reasonInp = el('epr-reject-reason');

  if (rejectBox && rejectBox.style.display === 'none') {
    rejectBox.style.display = 'block';
    showToast('Please specify the revision notes before confirming rejection.', 'info');
    return;
  }

  const reason = reasonInp?.value?.trim() || 'Logistical coordination needed';
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
}

function showCollectorEventsPanel() {
  openEventProposalForm();
}

function renderCollectorProposals() {
  renderAdminEventProposals();
}

// --- CSV EXPORT ---
function exportCSV() {
  const headers = ['Transaction_ID', 'Resident_Name', 'Resident_ID', 'Waste_Material', 'Weight_kg', 'EcoPoints', 'Date', 'Collector_Officer', 'Barangay', 'Audit_Status'];
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
  selectedResident = null;
  selectedMaterial = null;
  depositPhotoDataUrl = null;

  // Show Welcome screen initially
  showScreen('screen-welcome');

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
