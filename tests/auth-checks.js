'use strict';

const preview = document.getElementById('auth-preview');
const output = document.getElementById('results');
const frame = () => new Promise(resolve => requestAnimationFrame(resolve));
const resize = value => {
  const [width, height] = value.split('×');
  preview.style.width = width + 'px';
  preview.style.height = height + 'px';
};
document.getElementById('size').onchange = event => resize(event.target.value);
for (const name of ['welcome', 'login', 'register']) {
  document.getElementById(name).onclick = () => preview.contentWindow.showScreen('screen-' + name);
}
document.getElementById('run').onclick = () => runAuthChecks();

async function runAuthChecks() {
  const button = document.getElementById('run');
  if (button.disabled) return [];
  button.disabled = true;
  const results = [];
  const assert = (ok, message) => { if (!ok) throw new Error(message); };
  const pass = message => results.push('PASS ' + message);
  // Fresh document tests the intro gate; a new document is a new application entry.
  await new Promise(resolve => { preview.onload = resolve; preview.src = '../index.html'; });
  const app = preview.contentWindow, doc = preview.contentDocument;
  const originalState = app.eval('AppState');
  const originalSave = app.saveState, originalMatchMedia = app.matchMedia;
  app.eval('AppState = JSON.parse(JSON.stringify(INITIAL_STATE)); AppState.currentUser = null;');
  app.saveState = () => {};
  const activeId = () => doc.querySelector('.screen.active')?.id;
  const visible = node => {
    if (!node.getClientRects().length) return false;
    let opacity = 1;
    for (let n = node; n instanceof app.Element; n = n.parentElement) {
      const style = app.getComputedStyle(n);
      if (style.visibility === 'hidden' || style.display === 'none') return false;
      opacity *= Number(style.opacity);
    }
    return opacity > 0.01;
  };
  const sample = () => {
    assert(doc.querySelectorAll('.screen.active').length === 1, 'Only one screen is active per animation frame');
    assert(!doc.querySelector('.handoff-mark'), 'No flying logo clone');
    const logos = [...doc.querySelectorAll('#screen-welcome img, #screen-login img, #screen-register img')].filter(visible);
    assert(logos.length <= 1, 'No frame shows duplicate auth logos');
    if (['screen-welcome', 'screen-login', 'screen-register'].includes(activeId())) {
      assert(app.getComputedStyle(doc.querySelector('.screen.active')).opacity === '1', 'Auth backgrounds never fade to the shell');
    }
    assert(doc.querySelectorAll('.auth-background').length <= 1, 'Background bridges do not accumulate');
  };
  const settle = async target => {
    const deadline = performance.now() + 2500;
    do {
      await frame();
      sample();
      assert(performance.now() < deadline, 'Navigation settles: ' + target);
    } while (app.eval('authTransition !== null || activeGlide !== null'));
    assert(activeId() === target, 'Requested route wins: ' + target);
    assert(!doc.querySelector('.auth-background'), 'Background bridge is removed');
  };
  const navigate = async name => {
    app.showScreen('screen-' + name);
    await settle('screen-' + name);
  };
  const layout = name => {
    const screen = doc.getElementById('screen-' + name);
    assert(screen.scrollWidth <= screen.clientWidth + 1, name + ': no horizontal overflow');
    assert(doc.documentElement.scrollWidth <= app.innerWidth, name + ': no page overflow');
    const controls = [...screen.querySelectorAll('button')].filter(visible);
    assert(controls.every(b => b.getBoundingClientRect().width >= 44 && b.getBoundingClientRect().height >= 44), name + ': 44px controls');
    if (app.innerHeight >= 568 && name !== 'register') {
      const primary = screen.querySelector(name === 'welcome' ? '.wlc-btn-start' : '.btn-secondary');
      assert(primary.getBoundingClientRect().bottom <= app.innerHeight, name + ': main actions visible without scrolling');
    }
    const last = controls.at(-1);
    last.scrollIntoView({ block: 'end', behavior: 'instant' });
    const rect = last.getBoundingClientRect();
    assert(rect.top >= 0 && rect.bottom <= app.innerHeight + 1, name + ': last action scrolls into reach');
    screen.scrollTop = 0;
  };
  try {
    await doc.fonts.ready;
    assert(doc.getElementById('screen-welcome').classList.contains('welcome-intro'), 'Fresh entry arms welcome intro');
    assert(app.getComputedStyle(doc.querySelector('.welcome-logo')).clipPath === 'none', 'Logo artwork is not masked');
    for (const line of doc.querySelectorAll('.wlc-line')) {
      assert(app.getComputedStyle(line).overflow === 'visible', 'Text reveal does not clip glyphs');
    }
    pass('First-entry intro, unmasked logo and headline');
    for (const size of ['320×568', '375×667', '390×844', '430×932', '320×480']) {
      resize(size);
      await frame();
      await navigate('welcome'); layout('welcome');
      await navigate('login'); layout('login');
      doc.getElementById('login-email').value = 'draft@example.test';
      doc.querySelector('#screen-login .btn-secondary').click();
      await settle('screen-register'); layout('register');
      doc.querySelector('#screen-register .login-back-btn').click();
      await settle('screen-login');
      assert(doc.getElementById('login-email').value === 'draft@example.test', 'Back preserves entered credentials');
      doc.querySelector('#screen-login .login-back-btn').click();
      await settle('screen-welcome');
      assert(!doc.querySelector('.welcome-intro'), 'Back never re-arms the intro');
      const foreground = doc.querySelectorAll('.welcome-mark, .welcome-brand, .wlc-line-in, .welcome-desc, .welcome-actions');
      assert([...foreground].every(n => app.getComputedStyle(n).opacity === '1' && n.getAnimations().length === 0), 'Welcome content is immediately settled on return');
      pass(size + ': all four auth routes, per-frame single logo/screen, readable return and reachable controls');
    }
    for (let i = 0; i < 6; i++) {
      app.goToLogin(); app.goToLogin(); app.goToRegister(); app.backToLogin();
      await settle('screen-login');
      app.goToRegister();
      while (activeId() !== 'screen-register') await frame();
      app.backToLogin();
      await settle('screen-login');
      await navigate('welcome');
    }
    pass('Repeated taps and reversals in both animation phases leave no stale work');
    await navigate('login');
    app.goToRegister();
    while (activeId() !== 'screen-register') await frame();
    app.backToLogin();
    while (activeId() !== 'screen-login') await frame();
    doc.getElementById('login-password').value = 'test';
    doc.querySelector('#screen-login .btn-icon-inline').click();
    doc.getElementById('login-email').focus();
    await settle('screen-login');
    assert(doc.getElementById('login-password').type === 'text', 'Controls respond during entrance');
    assert(doc.activeElement.id === 'login-email', 'Completion never steals input focus');
    app.togglePassword();
    pass('Controls stay responsive and typing focus survives completion');
    app.fillDemo('invalid@example.test', 'incorrect'); app.doLogin();
    assert(activeId() === 'screen-login' && visible(doc.getElementById('login-error')), 'Invalid credentials retain login and show error');
    for (const role of ['resident', 'collector', 'admin']) {
      await navigate('login');
      const account = app.eval('AppState.accounts').find(a => a.role === role);
      app.fillDemo(account.email, account.password);
      app.goToRegister();
      app.doLogin(); app.doLogin();
      await settle('screen-' + role + '-home');
      assert(app.eval('AppState.currentUser.role') === role, 'Demo role authenticated: ' + role);
      app.doLogout();
      assert(activeId() === 'screen-welcome' && !doc.querySelector('.welcome-intro'), 'Logout restores settled welcome');
    }
    pass('All three demo logins, invalid login, duplicate submit and navigation cancellation');
    await navigate('register');
    for (const [id, value] of Object.entries({ 'reg-name': 'Motion QA', 'reg-contact': '09170000000', 'reg-barangay': 'Barangay San Isidro', 'reg-email': 'motion-qa@example.test', 'reg-password': 'MotionQA123!' })) doc.getElementById(id).value = value;
    const count = app.eval('AppState.accounts.length');
    app.doRegister();
    await settle('screen-login');
    assert(app.eval('AppState.accounts.length') === count + 1 && doc.getElementById('login-email').value === 'motion-qa@example.test', 'Registration creates and prefills account');
    app.doLogin();
    await settle('screen-resident-home');
    pass('Registration and new-account login work without persisting fixtures');
    app.matchMedia = query => query === '(prefers-reduced-motion: reduce)' ? { matches: true } : originalMatchMedia.call(app, query);
    await navigate('welcome');
    for (const name of ['login', 'register', 'login', 'welcome']) {
      app.showScreen('screen-' + name);
      for (const animation of app.eval('authTransition.animations')) {
        assert(animation.effect.getKeyframes().every(f => !f.transform || f.transform === 'translateX(0)' || f.transform === 'translateX(0px)'), 'Reduced motion has no spatial movement');
      }
      await settle('screen-' + name);
    }
    pass('Reduced-motion routes use short non-spatial transitions');
    resize('390×320');
    await navigate('register');
    layout('register');
    pass('Keyboard-height viewport retains scrollable registration actions');
  } catch (error) {
    results.push('FAIL ' + error.message);
  } finally {
    app.cancelAuthTransition();
    app.AppState = originalState;
    app.eval('AppState = window.AppState;');
    delete app.AppState;
    app.saveState = originalSave;
    app.matchMedia = originalMatchMedia;
    resize(document.getElementById('size').value);
    app.showScreen('screen-welcome', undefined, true);
    output.textContent = results.join('\n');
    button.disabled = false;
  }
  return results;
}
