/* =========================================================
   VC Home Solutions — interactions (static demo, no backend)
   Classic script (works from file:// and GitHub Pages).
   Motion (motion.dev) is loaded on demand for orchestrated
   moments; everything degrades gracefully without it.
   ========================================================= */
(() => {
  window.__vcReady = true;

  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EASE = [0.16, 1, 0.3, 1];

  let Motion = null;
  const motionReady = import('https://cdn.jsdelivr.net/npm/motion@11.11.13/+esm')
    .then((m) => (Motion = m))
    .catch(() => null);

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  function tween(from, to, duration, onUpdate, ease = easeOutExpo) {
    let raf, start;
    const p = new Promise((resolve) => {
      const tick = (now) => {
        start ??= now;
        const t = Math.min(1, (now - start) / duration);
        onUpdate(from + (to - from) * ease(t));
        t < 1 ? (raf = requestAnimationFrame(tick)) : resolve();
      };
      raf = requestAnimationFrame(tick);
    });
    p.cancel = () => cancelAnimationFrame(raf);
    return p;
  }

  /* ---------- Job files (swap images for real photos here) ---------- */
  const PROJECTS = [
    { no: '0412', title: 'Kitchen remodel', place: 'Scottsdale, AZ', time: '5 weeks', category: 'remodel', trade: 'Remodel',
      scope: ['Gutted to the studs, new layout', 'Charcoal shaker cabinets and quartz tops', 'Subway tile, counter to ceiling', 'Floating oak shelves', 'New drum pendant and fixtures'],
      materials: [['Charcoal shaker cabinetry', 'charcoal'], ['White quartz', 'quartz'], ['3×6 ceramic tile', 'tile'], ['Oak shelving', 'oak']],
      before: 'images/projects/kitchen-before.webp', after: 'images/projects/kitchen-after.webp' },
    { no: '0398', title: 'Primary bathroom', place: 'Phoenix, AZ', time: '3 weeks', category: 'remodel', trade: 'Remodel',
      scope: ['Old tub and surround torn out', 'Freestanding soaking tub', 'Floating vanity, vessel sink', 'Wall-mounted fixtures, new tile'],
      materials: [['Large-format porcelain tile', 'tile'], ['Solid-surface tub and basin', 'quartz'], ['Brushed fixtures', 'brass']],
      before: 'images/projects/bathroom-before.webp', after: 'images/projects/bathroom-after.webp' },
    { no: '0377', title: 'Living room hardwood', place: 'Chandler, AZ', time: '4 days', category: 'flooring', trade: 'Flooring',
      scope: ['Worn floor pulled up', 'Subfloor leveled', 'Engineered hardwood installed', 'Walls patched and repainted'],
      materials: [['Engineered oak, 7½" planks', 'oak'], ['Matte white wall paint', 'enamel']],
      before: 'images/projects/living-hardwood-before.webp', after: 'images/projects/living-hardwood-after.webp' },
    { no: '0369', title: 'Bedroom flooring', place: 'Gilbert, AZ', time: '3 days', category: 'flooring', trade: 'Flooring',
      scope: ['Scratched floor removed', 'Moisture barrier laid', 'Wide-plank LVP installed', 'Baseboards reset and caulked'],
      materials: [['Waterproof LVP, walnut tone', 'walnut'], ['Painted baseboards', 'enamel']],
      before: 'images/projects/bedroom-before.webp', after: 'images/projects/bedroom-after.webp' },
    { no: '0355', title: 'Water damage repair', place: 'Mesa, AZ', time: '2 weeks', category: 'restoration', trade: 'Restoration',
      scope: ['Stained drywall cut out', 'Structure dried and checked', 'Drywall, texture and paint matched', 'Floor cleaned and refinished'],
      materials: [['Moisture-resistant drywall', 'drywall'], ['Low-VOC paint', 'paint'], ['Refinished wood floor', 'oak']],
      before: 'images/projects/water-before.webp', after: 'images/projects/water-after.webp' },
    { no: '0341', title: 'Built-ins and lighting', place: 'Tempe, AZ', time: '6 days', category: 'upgrade', trade: 'Upgrades',
      scope: ['Built-in media shelving', 'Pendant and recessed lighting', 'New window trim', 'Walls repainted'],
      materials: [['Black built-in cabinetry', 'black'], ['Warm LED fixtures', 'brass'], ['Painted poplar trim', 'enamel']],
      before: 'images/projects/upgrades-before.webp', after: 'images/projects/upgrades-after.webp' },
  ];

  /* ---------- Compare slider ---------- */
  function setPos(el, pct) {
    pct = clamp(pct, 0, 100);
    el.style.setProperty('--pos', pct + '%');
    el.dataset.side = pct < 10 ? 'after' : pct > 90 ? 'before' : '';
    el.querySelector('.compare__handle').setAttribute('aria-valuenow', Math.round(pct));
    el._pos = pct;
  }
  function wipe(el, from = 100, to = 50, duration = 1400) {
    el._wipe?.cancel();
    if (reduced) return setPos(el, to);
    setPos(el, from);
    el._wipe = tween(from, to, duration, (v) => setPos(el, v));
    return el._wipe;
  }
  function initCompare(el) {
    el._pos = parseFloat(el.style.getPropertyValue('--pos')) || 50;
    const handle = el.querySelector('.compare__handle');
    let active = null;
    const pctFrom = (e) => { const r = el.getBoundingClientRect(); return ((e.clientX - r.left) / r.width) * 100; };
    const stopAuto = () => { el._wipe?.cancel(); el._interacted = true; };

    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      stopAuto();
      active = e.pointerId;
      el.setPointerCapture(e.pointerId);
      el.classList.add('is-dragging');
      if (e.pointerType === 'mouse') { const from = el._pos; el._wipe = reduced ? null : tween(from, pctFrom(e), 280, (v) => setPos(el, v)); if (reduced) setPos(el, pctFrom(e)); }
    });
    el.addEventListener('pointermove', (e) => { if (active === e.pointerId) { el._wipe?.cancel(); setPos(el, pctFrom(e)); } });
    const end = (e) => { if (active === e.pointerId) { active = null; el.classList.remove('is-dragging'); } };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);

    handle.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 10 : 4;
      const map = { ArrowLeft: -step, ArrowDown: -step, ArrowRight: step, ArrowUp: step };
      if (e.key in map) { e.preventDefault(); stopAuto(); setPos(el, el._pos + map[e.key]); }
      if (e.key === 'Home') { e.preventDefault(); stopAuto(); setPos(el, 0); }
      if (e.key === 'End') { e.preventDefault(); stopAuto(); setPos(el, 100); }
    });
  }
  $$('[data-compare]').forEach(initCompare);

  /* ---------- Hero intro: the renovation wipe ---------- */
  const heroCompare = $('[data-hero-compare]');
  function startHero() {
    if (root.classList.contains('hero-started')) return;
    root.classList.add('hero-started');
    setPos(heroCompare, reduced ? 50 : 100);
    root.classList.add('is-ready');
    if (!reduced) wait(500).then(() => { if (!heroCompare._interacted) wipe(heroCompare, 100, 50, 1600); });
  }
  Promise.race([document.fonts?.ready ?? Promise.resolve(), wait(500)]).then(() => requestAnimationFrame(startHero));

  /* ---------- Job files viewer ---------- */
  const viewer = $('[data-viewer]');
  const vAfter = $('[data-after]', viewer);
  const vBefore = $('[data-before]', viewer);
  const spec = $('[data-spec]');
  const strip = $('[data-strip]');
  let current = 0;

  // Material chips: cropped from the stock photos where a real texture exists, flat paint-chip colour otherwise
  const SWATCH = {
    oak: 'background-image:url(images/stock/flooring.webp);background-size:900%;background-position:50% 94%',
    walnut: 'background-image:url(images/stock/living.webp);background-size:900%;background-position:86% 32%',
    tile: 'background-image:url(images/stock/bathroom.webp);background-size:700%;background-position:22% 38%',
    paint: 'background-image:url(images/stock/paint.webp);background-size:500%;background-position:62% 12%',
    olive: 'background-color:#56653E', charcoal: 'background-color:#3B403D', quartz: 'background-color:#ECE9E2', glass: 'background-color:#D8E2DF',
    black: 'background-color:#24231F', ash: 'background-color:#9C978D', drywall: 'background-color:#E6E2D9',
    enamel: 'background-color:#F5F2EA', brass: 'background-color:#B08D4A',
  };
  function specMarkup(p) {
    return `
      <div class="sheet-spec__body">
        <div class="sheet-spec__head">
          <h3 class="sheet-spec__title">${p.title}</h3>
          <p class="sheet-spec__no">No. ${p.no}</p>
        </div>
        <dl>
          <div><dt>Where</dt><dd>${p.place}</dd></div>
          <div><dt>Trade</dt><dd>${p.trade}</dd></div>
          <div><dt>On site</dt><dd>${p.time}</dd></div>
          <div><dt>Scope</dt><dd><ul>${p.scope.map((s) => `<li>${s}</li>`).join('')}</ul></dd></div>
          <div><dt>Materials</dt><dd><ul class="swatches">${p.materials.map(([label, k]) => `<li class="swatch"><span class="swatch__chip" style="${SWATCH[k]}" aria-hidden="true"></span>${label}</li>`).join('')}</ul></dd></div>
        </dl>
      </div>`;
  }

  strip.innerHTML = PROJECTS.map((p, i) => `
    <li data-category="${p.category}">
      <button class="strip__btn" type="button" data-index="${i}" aria-pressed="${i === 0}" aria-label="Show job ${p.no}: ${p.title}, ${p.place}">
        <span class="strip__img"><img src="${p.after}" alt="" loading="lazy" width="1200" height="800" /></span>
        <span class="strip__title">${p.title}</span>
        <span class="strip__meta">${p.place.replace(', AZ', '')} · ${p.time}</span>
      </button>
    </li>`).join('');

  function applyProject(p) {
    vAfter.src = p.after; vAfter.alt = `${p.title} after`;
    vBefore.src = p.before; vBefore.alt = `${p.title} before`;
    viewer.querySelector('.compare__handle').setAttribute('aria-label', `${p.title}, before and after`);
  }
  spec.innerHTML = specMarkup(PROJECTS[0]);
  applyProject(PROJECTS[0]);

  async function selectProject(i, { scroll = false } = {}) {
    if (i === current) return;
    current = i;
    const p = PROJECTS[i];
    $$('.strip__btn', strip).forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.index === i)));

    if (scroll) {
      const r = viewer.getBoundingClientRect();
      if (r.top < 60 || r.bottom > innerHeight) viewer.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
    }

    if (reduced) { applyProject(p); spec.innerHTML = specMarkup(p); setPos(viewer, 50); return; }

    viewer.classList.add('is-swapping');
    spec.classList.add('is-swapping');
    await wait(260);
    applyProject(p);
    spec.innerHTML = specMarkup(p);
    await Promise.all([vAfter, vBefore].map((img) => (img.decode ? img.decode().catch(() => {}) : null)));
    setPos(viewer, 100);
    spec.classList.add('is-swapping');
    requestAnimationFrame(() => {
      viewer.classList.remove('is-swapping');
      spec.classList.remove('is-swapping');
      viewer._interacted = false;
      wipe(viewer, 100, 50, 1200);
    });
  }
  strip.addEventListener('click', (e) => {
    const b = e.target.closest('.strip__btn');
    if (b) selectProject(+b.dataset.index, { scroll: true });
  });

  /* Filters */
  const filterTabs = $$('[data-filter] button');
  filterTabs.forEach((tab) => tab.addEventListener('click', () => {
    filterTabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
    const v = tab.dataset.value;
    const items = $$('li', strip);
    items.forEach((li) => (li.hidden = !(v === 'all' || li.dataset.category === v)));
    const visible = items.filter((li) => !li.hidden);
    if (Motion && !reduced) {
      Motion.animate(visible, { opacity: [0, 1], transform: ['translateY(10px)', 'translateY(0px)'] }, { duration: 0.5, ease: EASE, delay: Motion.stagger(0.05) });
    }
    if (items[current].hidden && visible[0]) selectProject(+visible[0].querySelector('.strip__btn').dataset.index);
  }));

  /* ---------- Scope of work: photo follows the row ---------- */
  const scope = $('[data-scope]');
  const photo = $('.scope__photo', scope);
  const imgBase = $('[data-scope-img]', scope);
  const imgNext = $('[data-scope-img-next]', scope);
  let swapAnim = null;
  let swapToken = 0;
  async function activateRow(row) {
    if (row.classList.contains('is-active')) return;
    $$('.scope__row', scope).forEach((r) => r.classList.toggle('is-active', r === row));
    const src = row.dataset.photo;
    const token = ++swapToken;
    // A swap already in flight lands instantly so the next one starts from a clean frame
    if (swapAnim) { swapAnim.finish(); }
    if (reduced || !imgNext.animate) { imgBase.src = src; return; }
    imgNext.src = src;
    try { await imgNext.decode(); } catch (e) { /* still animate */ }
    if (token !== swapToken) return;
    const anim = imgNext.animate(
      [{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)' }],
      { duration: 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
    );
    swapAnim = anim;
    anim.onfinish = () => {
      imgBase.src = src;
      const done = () => { anim.cancel(); if (swapAnim === anim) swapAnim = null; };
      imgBase.decode ? imgBase.decode().then(done, done) : done();
    };
  }
  $$('.scope__row', scope).forEach((row) => {
    row.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && activateRow(row));
    row.addEventListener('focus', () => activateRow(row));
    row.addEventListener('click', () => activateRow(row));
  });

  /* ---------- How a job runs: step through ---------- */
  const STEPS = [
    { title: 'Work order', when: 'Day 1', desc: 'You send the scope and a few photos. We reply within one business day.' },
    { title: 'In-home estimate', when: 'Days 2–5', desc: 'We measure, talk through options and leave a written, itemized quote.' },
    { title: 'Build', when: 'Weeks 1–6', desc: 'One project lead on site, daily clean-up, progress photos by text.' },
    { title: 'Walkthrough', when: 'Final week', desc: 'We walk every room together and close out only when the punch list is signed off.' },
  ];
  const runner = $('[data-runner]');
  if (runner) {
    const segs = $$('.runner__seg', runner);
    const detail = $('[data-runner-detail]', runner);
    const prev = $('[data-runner-prev]', runner);
    const next = $('[data-runner-next]', runner);
    const nextLabel = $('[data-runner-next-label]', runner);
    let step = 0;
    const paint = () => {
      const st = STEPS[step];
      $('[data-runner-count]', runner).textContent = `Step ${step + 1} of ${STEPS.length}`;
      $('[data-runner-when]', runner).textContent = st.when;
      $('[data-runner-title]', runner).textContent = st.title;
      $('[data-runner-desc]', runner).textContent = st.desc;
      runner.style.setProperty('--p', segs[step].style.getPropertyValue('--to'));
      segs.forEach((g, i) => (i === step ? g.setAttribute('aria-current', 'step') : g.removeAttribute('aria-current')));
      prev.disabled = step === 0;
      nextLabel.textContent = step < STEPS.length - 1 ? `Next: ${STEPS[step + 1].title}` : 'Open a work order';
    };
    const go = (i) => {
      i = Math.max(0, Math.min(STEPS.length - 1, i));
      if (i === step) return;
      const dir = i > step ? 1 : -1;
      step = i;
      if (reduced || !detail.animate) return paint();
      detail.getAnimations().forEach((a) => a.cancel());
      const out = detail.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-12 * dir}px)` }], { duration: 160, easing: 'ease-in', fill: 'forwards' });
      out.onfinish = () => {
        paint(); out.cancel();
        detail.animate([{ opacity: 0, transform: `translateX(${16 * dir}px)` }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
      };
    };
    next.addEventListener('click', () => (step < STEPS.length - 1 ? go(step + 1) : contact.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })));
    prev.addEventListener('click', () => go(step - 1));
    segs.forEach((g, i) => g.addEventListener('click', () => go(i)));
    runner.addEventListener('keydown', (e) => {
      if (!e.target.closest('.runner__seg')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(step + 1); segs[step].focus(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(step - 1); segs[step].focus(); }
    });
    paint();
  }

  /* ---------- Reveals ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.filter((e) => e.isIntersecting).forEach((e, i) => {
        e.target.style.setProperty('--d', Math.min(i * 90, 360) + 'ms');
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
    $$('[data-reveal], [data-schedule]').forEach((el) => io.observe(el));
  } else {
    $$('[data-reveal], [data-schedule]').forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Scroll: band parallax + scroll-spy ---------- */
  const bandImg = $('.band img');
  const band = $('.band');
  const spyLinks = $$('.nav__links a');
  const spyTargets = spyLinks.map((a) => $(a.getAttribute('href')));
  const contact = $('#contact');
  let ticking = false;
  function onScroll() {
    ticking = false;
    const vh = innerHeight;
    if (!reduced && bandImg) {
      const r = band.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) {
        const p = clamp((vh - r.top) / (vh + r.height));
        bandImg.style.transform = `translate3d(0, ${(-p * 15).toFixed(2)}%, 0)`;
      }
    }
    let active = -1;
    spyTargets.forEach((t, i) => { if (t && t.getBoundingClientRect().top <= vh * 0.35) active = i; });
    if (contact.getBoundingClientRect().top <= vh * 0.35) active = -1;
    spyLinks.forEach((a, i) => a.classList.toggle('is-active', i === active));
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('[data-menu-btn]');
  const sheet = $('[data-sheet]');
  $$('.sheet__links a', sheet).forEach((a, i) => a.style.setProperty('--i', i));
  let sheetTimer;
  function openSheet() {
    clearTimeout(sheetTimer);
    sheet.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add('is-open')));
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Close menu');
  }
  function closeSheet() {
    sheet.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
    sheetTimer = setTimeout(() => (sheet.hidden = true), 380);
  }
  menuBtn.addEventListener('click', () => (menuBtn.getAttribute('aria-expanded') === 'true' ? closeSheet() : openSheet()));
  $$('a', sheet).forEach((a) => a.addEventListener('click', closeSheet));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && !sheet.hidden && closeSheet());
  document.addEventListener('pointerdown', (e) => { if (!sheet.hidden && !sheet.contains(e.target) && !menuBtn.contains(e.target)) closeSheet(); });

  /* ---------- Toast ---------- */
  const toast = $('[data-toast]');
  function showToast(text) {
    toast.textContent = text;
    toast.classList.add('is-shown');
    clearTimeout(showToast.t);
    showToast.t = setTimeout(() => toast.classList.remove('is-shown'), 3400);
  }

  /* ---------- Work order ---------- */
  const form = $('[data-form]');
  const success = $('[data-success]');
  const submitBtn = $('[data-submit]');
  const photos = $('#f-photos');
  const today = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date());
  const newNumber = () => 'WO-' + (24000 + Math.floor(Math.random() * 9000));
  $('[data-wo-no]').textContent = newNumber();
  $('[data-wo-date]').textContent = today;

  const digitsOnly = (input, max) => input.addEventListener('input', () => { input.value = input.value.replace(/\D/g, '').slice(0, max); });
  digitsOnly($('#f-zip'), 5);
  const phone = $('#f-phone');
  phone.addEventListener('input', () => {
    const d = phone.value.replace(/\D/g, '').slice(0, 10);
    phone.value = d.length > 6 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : d.length > 3 ? `(${d.slice(0, 3)}) ${d.slice(3)}` : d ? `(${d}` : '';
  });
  photos.addEventListener('change', () => {
    const n = photos.files.length;
    $('[data-upload-text]').textContent = n ? `${n} photo${n > 1 ? 's' : ''} attached` : 'Attach photos of the space';
    photos.closest('.upload').classList.toggle('has-files', n > 0);
  });

  const validators = {
    name: (v) => (v.trim().length >= 2 ? '' : 'Add your name.'),
    phone: (v) => (v.replace(/\D/g, '').length === 10 ? '' : 'Enter a 10-digit phone number.'),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'That email looks incomplete.'),
    zip: (v) => (/^\d{5}$/.test(v) ? '' : 'Enter a 5-digit ZIP.'),
    message: (v) => (v.trim().length >= 10 ? '' : 'Add a few words about the job.'),
  };
  function setError(field, msg) {
    field.classList.toggle('is-invalid', !!msg);
    const err = $('.field__error', field);
    if (err) err.textContent = msg;
    $$('input:not([type="checkbox"]), select, textarea', field).forEach((i) => i.setAttribute('aria-invalid', msg ? 'true' : 'false'));
  }
  const fieldOf = (name) => form.elements[name].closest('.field');
  function validateField(name) { const msg = validators[name](form.elements[name].value); setError(fieldOf(name), msg); return !msg; }
  const scopeField = $('[data-checks]').closest('.field');
  function validateScope() { const ok = $$('input[name="scope"]:checked', form).length > 0; setError(scopeField, ok ? '' : 'Tick at least one.'); return ok; }

  Object.keys(validators).forEach((name) => {
    const input = form.elements[name];
    input.addEventListener('blur', () => input.value && validateField(name));
    input.addEventListener('input', () => fieldOf(name).classList.contains('is-invalid') && validateField(name));
  });
  $$('input[name="scope"]', form).forEach((c) => c.addEventListener('change', () => scopeField.classList.contains('is-invalid') && validateScope()));

  function shake(el) {
    if (reduced) return;
    if (Motion) Motion.animate(el, { transform: ['translateX(0px)', 'translateX(-6px)', 'translateX(5px)', 'translateX(-3px)', 'translateX(0px)'] }, { duration: 0.38 });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const ok = [...Object.keys(validators).map(validateField), validateScope()];
    if (ok.includes(false)) {
      const bad = $$('.field.is-invalid', form);
      bad.forEach(shake);
      bad[0].scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
      $('input, select, textarea', bad[0])?.focus({ preventScroll: true });
      return;
    }
    submitBtn.classList.add('is-loading');
    submitBtn.setAttribute('aria-busy', 'true');
    await wait(1400); // simulated network request

    const data = new FormData(form);
    const scopeList = data.getAll('scope');
    const ref = $('[data-wo-no]').textContent;
    const record = {
      ref, date: today, name: data.get('name'), phone: data.get('phone'), email: data.get('email'), zip: data.get('zip'),
      scope: scopeList, timeline: data.get('timeline'), budget: data.get('budget'), notes: data.get('message'), photos: photos.files.length,
    };
    try {
      const all = JSON.parse(localStorage.getItem('vc_work_orders') || '[]');
      all.push(record);
      localStorage.setItem('vc_work_orders', JSON.stringify(all));
    } catch { /* storage unavailable: demo still works */ }
    console.info('[Demo] Work order captured:', record);

    $('[data-success-name]').textContent = String(record.name).trim().split(/\s+/)[0];
    $('[data-success-ref]').textContent = ref;
    $('[data-success-scope]').textContent = scopeList.join(', ');
    $('[data-success-zip]').textContent = record.zip;
    $('[data-stamp-date]').textContent = today;

    await swap(form, success);
    submitBtn.classList.remove('is-loading');
    submitBtn.removeAttribute('aria-busy');
    showToast(`Work order ${ref} sent.`);
  });

  $('[data-reset]').addEventListener('click', async () => {
    form.reset();
    $$('.field', form).forEach((f) => setError(f, ''));
    photos.dispatchEvent(new Event('change'));
    $('[data-wo-no]').textContent = newNumber();
    await swap(success, form);
    form.elements.name.focus({ preventScroll: true });
  });

  const EASE_CSS = 'cubic-bezier(0.16, 1, 0.3, 1)';
  let swapping = false;
  async function swap(from, to) {
    if (swapping) return;
    swapping = true;
    const card = $('[data-wo]');
    const stamp = $('.stamp', to);
    const animate = !reduced && !!card.animate;
    try {
      if (animate) {
        const h0 = card.offsetHeight;
        const out = from.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-6px)' }], { duration: 200, easing: EASE_CSS, fill: 'forwards' });
        await out.finished;
        from.hidden = true; to.hidden = false;
        out.cancel();
        const h1 = card.offsetHeight;
        card.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: 500, easing: EASE_CSS });
        const kids = [...to.children].filter((k) => k !== stamp);
        if (stamp) stamp.animate([{ opacity: 0, transform: 'scale(1.7)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 320, delay: 120, easing: 'cubic-bezier(0.3, 0, 0.2, 1)', fill: 'backwards' });
        const anims = kids.map((k, i) => k.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }],
          { duration: 550, delay: (stamp ? 380 : 60) + i * 60, easing: EASE_CSS, fill: 'backwards' }));
        await Promise.all(anims.map((a) => a.finished.catch(() => {})));
      } else {
        from.hidden = true; to.hidden = false;
      }
    } finally {
      // never leave either view stuck in an animated state
      if (from.getAnimations) from.getAnimations().forEach((a) => a.cancel());
      if (to.getAnimations) to.getAnimations({ subtree: true }).forEach((a) => a.cancel());
      swapping = false;
    }
    if (to === success) {
      success.focus({ preventScroll: true });
      const r = card.getBoundingClientRect();
      if (r.top < 0) card.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' });
    }
  }

  /* ---------- Hero estimate slip → work order ---------- */
  const starter = $('[data-starter]');
  starter.zip.addEventListener('input', () => { starter.zip.value = starter.zip.value.replace(/\D/g, '').slice(0, 5); });
  starter.addEventListener('submit', (e) => {
    e.preventDefault();
    const picked = $$('input[name="scope"]:checked', starter).map((c) => c.value);
    const zip = starter.zip.value;
    if (!picked.length) { shake(starter); showToast('Pick at least one thing that needs work.'); return; }
    if (zip && zip.length !== 5) { shake(starter); showToast('ZIP codes have 5 digits.'); starter.zip.focus(); return; }

    if (!success.hidden) { success.hidden = true; form.hidden = false; }
    $$('input[name="scope"]', form).forEach((c) => (c.checked = picked.includes(c.value)));
    if (zip) form.elements.zip.value = zip;
    setError(scopeField, '');
    contact.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    setTimeout(() => form.elements.name.focus({ preventScroll: true }), reduced ? 0 : 700);
    showToast('Scope added to your work order. Just add your details.');
  });

  $('[data-year]').textContent = new Date().getFullYear();
})();
