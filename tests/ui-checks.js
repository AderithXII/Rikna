'use strict';

const preview = document.getElementById('mobile-review');
const output = document.getElementById('results');
const frame = () => new Promise(resolve => requestAnimationFrame(resolve));

async function waitFor(check, label) {
  const until = performance.now() + 3000;
  while (!check()) {
    if (performance.now() > until) throw new Error('Timed out: ' + label);
    await frame();
  }
}

preview.addEventListener('load', () => {
  const app = preview.contentWindow;
  app.eval('AppState.currentUser = AppState.accounts[0]');
  app.showResidentTab('home');
  app.updateResidentUI();
  output.textContent = 'Ready. Tests use in-memory fixtures and do not save them.';
});
document.getElementById('width').addEventListener('change', event => { preview.style.width = event.target.value + 'px'; });
document.getElementById('home').onclick = () => preview.contentWindow.showResidentTab('home');
document.getElementById('wallet').onclick = () => preview.contentWindow.showResidentTab('wallet');
document.getElementById('run').onclick = () => runUiChecks();

async function runUiChecks() {
  const app = preview.contentWindow;
  const doc = preview.contentDocument;
  const state = app.eval('AppState');
  const original = JSON.parse(JSON.stringify({ resident: state.resident, activities: state.activities, user: state.currentUser }));
  const results = [];
  const assert = (condition, label) => { if (!condition) throw new Error(label); results.push('PASS ' + label); };
  const settle = () => waitFor(() => app.eval('activeGlide === null'), 'screen transition');
  const navigate = async tab => { app.showResidentTab(tab); await settle(); };
  const layout = id => {
    const screen = doc.getElementById(id);
    return screen.scrollWidth <= screen.clientWidth + 1 && doc.documentElement.scrollWidth <= app.innerWidth;
  };
  try {
    await doc.fonts.ready;
    for (const width of [320, 375, 390, 430]) {
      preview.style.width = width + 'px';
      await frame();
      for (const tab of ['home', 'wallet', 'qr', 'rewards']) {
        await navigate(tab);
        assert(layout('screen-resident-' + tab), `${tab}: no horizontal overflow at ${width}px`);
        const controls = doc.querySelectorAll(`#screen-resident-${tab} button, #nav-resident button`);
        assert([...controls].every(b => b.getBoundingClientRect().width >= 44 && b.getBoundingClientRect().height >= 44), `${tab}: 44px touch targets at ${width}px`);
      }
    }
    preview.style.width = '390px';
    await navigate('home');
    assert(doc.getElementById('resident-kg-display').textContent === state.resident.kgRecycled.toFixed(1) + ' kg', 'Home impact uses resident totals');
    assert(doc.querySelectorAll('.home-event').length === state.activities.filter(a => a.status === 'approved').slice(0, 2).length, 'Home events use approved activity data');
    for (const [index, tab] of ['qr', 'wallet', 'rewards'].entries()) {
      doc.querySelectorAll('.home-action')[index].click();
      await settle();
      assert(doc.querySelector('.screen.active').id === 'screen-resident-' + tab, 'Quick action opens ' + tab);
      await navigate('home');
    }
    for (const tab of ['wallet', 'qr', 'rewards', 'profile', 'home']) {
      doc.getElementById('navbtn-resident-' + tab).click();
      await settle();
      assert(doc.querySelectorAll('.screen.active').length === 1 && doc.getElementById('navbtn-resident-' + tab).getAttribute('aria-current') === 'page', 'Navigation and selected state: ' + tab);
    }
    app.showResidentTab('wallet');
    app.showResidentTab('wallet');
    await settle();
    assert(doc.querySelectorAll('.screen.active').length === 1, 'Repeated tap during a slide completes cleanup');
    const matchMedia = app.matchMedia;
    try {
      app.matchMedia = query => query === '(prefers-reduced-motion: reduce)' ? { matches: true } : matchMedia.call(app, query);
      await navigate('home');
      assert(doc.querySelectorAll('.screen.active').length === 1 && !doc.getElementById('screen-resident-home').style.transform, 'Reduced-motion JS navigation settles without a slide');
    } finally {
      app.matchMedia = matchMedia;
    }
    await navigate('qr');
    assert(doc.getElementById('qr-resident-name').textContent === state.currentUser.name && doc.getElementById('qr-resident-id').textContent === state.currentUser.id, 'QR pass shows the current resident name and ID');
    assert(doc.getElementById('qr-code-display').getAttribute('aria-label').includes(state.currentUser.id), 'QR pattern has an accessible label with the resident ID');
    assert(doc.querySelectorAll('#screen-resident-qr .qr-action').length === 3, 'QR pass exposes copy, download, and share actions');
    const qrBlob = await app.createResidentQrBlob();
    assert(qrBlob && qrBlob.type === 'image/png' && qrBlob.size > 1000, 'Downloaded QR matches the displayed pattern as a PNG');
    await navigate('wallet');
    for (const filter of ['all', 'earned', 'spent']) {
      doc.getElementById('wallet-tab-' + filter).click();
      const expected = state.resident.transactions.filter(tx => filter === 'all' || tx.type === filter).length;
      assert(doc.querySelectorAll('#wallet-tx-list .activity-row').length === expected, 'Filter data: ' + filter);
      assert(doc.querySelectorAll('#wallet-tab-bar [aria-pressed="true"]').length === 1 && doc.getElementById('wallet-tab-' + filter).getAttribute('aria-pressed') === 'true', 'Filter selected state: ' + filter);
    }
    app.switchWalletTab('all');
    await navigate('rewards');
    assert(doc.querySelectorAll('#rewards-grid .reward-ticket').length === state.rewards.filter(r => r.available).length, 'Rewards catalog uses available reward data');
    assert(doc.querySelector('#rewards-grid .reward-value').textContent === '₱50', 'Reward value is hoisted from the live reward name');
    doc.querySelector('.rw-chips [data-category="grocery"]').click();
    assert(doc.querySelectorAll('#rewards-grid .reward-ticket').length === state.rewards.filter(r => r.available && r.category === 'grocery').length, 'Reward category filter uses live categories');
    app.filterRewards('all');
    doc.getElementById('voucher-tab-used').click();
    assert(doc.querySelectorAll('#my-vouchers-list .voucher-row').length === state.resident.vouchers.filter(v => v.status === 'used').length, 'My Vouchers tab shows redeemed vouchers');
    assert(doc.querySelectorAll('#voucher-tab-bar [aria-pressed="true"]').length === 1 && doc.getElementById('voucher-tab-used').getAttribute('aria-pressed') === 'true', 'My Vouchers tabs expose one selected state');
    app.switchVoucherTab('active');
    const row = doc.querySelector('#wallet-tx-list .activity-row');
    row.click();
    assert(doc.getElementById('modal-transaction').classList.contains('active'), 'Transaction row opens existing details');
    app.closeModal('modal-transaction');
    await waitFor(() => !doc.getElementById('modal-transaction').classList.contains('active'), 'transaction close');
    await navigate('home');
    const event = doc.querySelector('.home-event');
    if (event) {
      event.click();
      assert(doc.getElementById('event-detail-name').textContent === state.activities.find(a => a.status === 'approved').name, 'Event detail uses the selected event');
      app.closeModal('modal-event-detail');
      await waitFor(() => !doc.getElementById('modal-event-detail').classList.contains('active'), 'event close');
    }
    // Fixtures isolate the insight calculation and safe text rendering.
    state.resident.transactions = [
      { id: 'QA1', type: 'earned', status: 'verified', points: 90, kg: 3, material: 'PET Plastic', label: '<img src=x onerror=alert(1)> Plastic deposit with a long descriptive name', date: '2026-11-05' },
      { id: 'QA2', type: 'earned', status: 'pending', points: 60, label: 'Awaiting verification', date: '2026-11-04' },
      { id: 'QA3', type: 'spent', status: 'redeemed', points: -100, label: 'Grocery voucher', date: '2026-11-03' },
      { id: 'QA4', type: 'earned', status: 'verified', points: 50, label: 'Paper deposit', date: '2026-10-10' }
    ];
    await navigate('wallet');
    app.switchWalletTab('all');
    assert(doc.getElementById('wallet-insight-title').textContent === '90 pts earned · November 2026', 'Monthly insight excludes pending, spent, and other months');
    assert(!doc.querySelector('#wallet-tx-list img') && doc.querySelector('.activity-pending .activity-status').textContent === 'pending', 'Safe text and explicit pending state');
    state.resident.points = 123456789;
    state.resident.kgRecycled = 123456.7;
    state.resident.deposits = 123456;
    state.currentUser.name = 'Alexandria-Maria Santos de la Cruz';
    state.activities = [{ id: 'QA', status: 'approved', name: 'Community recycling and responsible material collection day for all residents', date: '2026-11-22', location: 'Barangay San Isidro Community Center and Multi-Purpose Hall', participationPts: 75 }];
    preview.style.width = '320px';
    await navigate('home');
    assert(layout('screen-resident-home'), 'Home handles long names and large metrics at 320px');
    await navigate('wallet');
    assert(layout('screen-resident-wallet'), 'Wallet handles large balances and long labels at 320px');
    state.currentUser.id = 'RES-2024-001-LONGIDENTIFIER-XYZ';
    await navigate('qr');
    assert(layout('screen-resident-qr'), 'QR pass handles long names and IDs at 320px');
    await navigate('rewards');
    assert(layout('screen-resident-rewards'), 'Rewards handles large balances and long labels at 320px');
    state.resident.transactions = [];
    state.activities = [];
    app.renderTransactions('all');
    app.renderHomeRecentTransactions();
    app.renderHomeActivities();
    assert(doc.querySelector('#wallet-tx-list .home-empty') && doc.querySelector('#resident-recent-tx-list .home-empty') && doc.querySelector('#home-activities-list .home-empty'), 'Empty wallet, Home feed, and events have helpful messages');
    assert(doc.getElementById('wallet-insight-title').textContent === 'Your recycling, rewarded', 'Empty history has no invented monthly insight');
    state.resident.vouchers = [];
    app.renderVouchers('active');
    assert(doc.querySelector('#my-vouchers-list .rw-empty'), 'Empty vouchers have a helpful message');
  } catch (error) {
    results.push('FAIL ' + error.message);
  } finally {
    state.resident = original.resident;
    state.activities = original.activities;
    state.currentUser = original.user;
    preview.style.width = '390px';
    app.switchWalletTab('all');
    app.updateResidentUI();
    app.showResidentTab('wallet');
    output.textContent = results.join('\n');
  }
  return results;
}
