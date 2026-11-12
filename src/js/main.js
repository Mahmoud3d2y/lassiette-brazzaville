/* L'Assiette — progressive enhancement. No dependencies. */
(() => {
  'use strict';
  const d = document, body = d.body, lang = body.dataset.lang || 'fr';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Header shadow on scroll */
  const header = d.querySelector('[data-header]');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* Hero entrance safety net: settle final state even if animations were throttled */
  setTimeout(() => body.classList.add('hero-settled'), 2300);

  /* Mobile navigation */
  const toggle = d.querySelector('[data-nav-toggle]');
  const nav = d.querySelector('[data-nav]');
  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      body.classList.toggle('nav-open', open);
      toggle.querySelector('[data-label-open]').hidden = open;
      toggle.querySelector('[data-label-close]').hidden = !open;
      if (open) nav.querySelector('a')?.focus({ preventScroll: true });
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape' && body.classList.contains('nav-open')) { setOpen(false); toggle.focus(); } });
    matchMedia('(min-width: 64em)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });
  }

  /* Remember language choice (used by the root redirect) */
  d.querySelectorAll('[data-lang-switch]').forEach((a) => a.addEventListener('click', () => { try { localStorage.setItem('lang', a.dataset.langSwitch); } catch {} }));
  try { localStorage.setItem('lang', lang); } catch {}

  /* Image + text reveal on scroll */
  const reveals = d.querySelectorAll('.reveal, .fade-up');
  if (reveals.length && 'IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.15 });
    reveals.forEach((el) => io.observe(el));
  } else reveals.forEach((el) => el.classList.add('is-visible'));

  /* Subtle parallax on full-bleed media (transform only, rAF-throttled) */
  const px = [...d.querySelectorAll('[data-parallax]')];
  if (px.length && !reduceMotion) {
    let ticking = false;
    const update = () => {
      const vh = innerHeight;
      px.forEach((el) => { const r = el.parentElement.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) return; const p = (r.top + r.height / 2 - vh / 2) / vh; el.style.transform = `translate3d(0, ${(-p * Number(el.dataset.parallax || .1) * 100).toFixed(2)}%, 0) scale(1.15)`; });
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true }); update();
  }

  /* Mobile action bar: hide while scrolling down, show when scrolling up or near the top */
  const bar = d.querySelector('[data-action-bar]');
  if (bar) {
    let last = scrollY;
    addEventListener('scroll', () => { const y = scrollY; bar.classList.toggle('is-hidden', y > last && y > 240); last = y; }, { passive: true });
  }

  /* Map: load Google Maps iframe on demand */
  d.querySelectorAll('[data-map]').forEach((map) => {
    map.querySelector('[data-map-load]')?.addEventListener('click', () => {
      const f = d.createElement('iframe');
      f.src = map.dataset.src; f.title = map.dataset.title; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade'; f.allowFullscreen = true;
      map.querySelector('.map__placeholder').remove(); map.appendChild(f);
    });
  });

  /* Menu: scroll spy */
  const menuNav = d.querySelector('[data-menu-nav]');
  if (menuNav && 'IntersectionObserver' in window) {
    const links = [...menuNav.querySelectorAll('a[href^="#"]')];
    const secs = links.map((a) => d.getElementById(a.hash.slice(1))).filter(Boolean);
    const setCurrent = (id) => links.forEach((a) => { const cur = a.hash === '#' + id; a.toggleAttribute('aria-current', cur); if (cur) a.setAttribute('aria-current', 'true'); if (cur && menuNav.scrollWidth > menuNav.clientWidth) a.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduceMotion ? 'auto' : 'smooth' }); });
    const io = new IntersectionObserver((entries) => { const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top); if (vis[0]) setCurrent(vis[0].target.id); }, { rootMargin: '-30% 0px -60% 0px' });
    secs.forEach((s) => io.observe(s));
  }

  /* Gallery: filters + lightbox */
  const gallery = d.querySelector('[data-gallery]');
  if (gallery) {
    const items = [...gallery.querySelectorAll('.masonry__item')];
    d.querySelectorAll('[data-filter]').forEach((btn) => btn.addEventListener('click', () => {
      d.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      const f = btn.dataset.filter;
      items.forEach((li) => { li.hidden = f !== 'all' && li.dataset.cat !== f; });
    }));
    const dlg = d.querySelector('[data-lightbox]');
    if (dlg && typeof dlg.showModal === 'function') {
      const imgEl = dlg.querySelector('[data-lightbox-img]'), cap = dlg.querySelector('[data-lightbox-caption]');
      let current = 0, opener = null;
      const visible = () => items.filter((li) => !li.hidden).map((li) => li.querySelector('[data-lightbox-open]'));
      const show = (btn) => { imgEl.src = btn.dataset.full; imgEl.alt = btn.dataset.alt; cap.textContent = btn.dataset.alt; current = visible().indexOf(btn); };
      const step = (n) => { const v = visible(); if (!v.length) return; show(v[(current + n + v.length) % v.length]); };
      items.forEach((li) => li.querySelector('[data-lightbox-open]').addEventListener('click', (e) => { opener = e.currentTarget; show(opener); dlg.showModal(); }));
      dlg.querySelector('[data-lightbox-close]').addEventListener('click', () => dlg.close());
      dlg.querySelector('[data-lightbox-prev]').addEventListener('click', () => step(-1));
      dlg.querySelector('[data-lightbox-next]').addEventListener('click', () => step(1));
      dlg.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });
      dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
      dlg.addEventListener('close', () => { imgEl.src = ''; opener?.focus(); });
    }
  }

  /* Reservation form */
  const form = d.querySelector('[data-reservation]');
  if (form) {
    const endpoint = form.dataset.endpoint, wa = form.dataset.whatsapp, tpl = form.dataset.template;
    const success = d.querySelector('[data-form-success]'), submit = form.querySelector('[data-submit]'), netErr = form.querySelector('[data-form-error]');
    const dateEl = form.elements.date, today = new Date();
    const iso = (dt) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
    dateEl.min = iso(today);
    const max = new Date(today); max.setMonth(max.getMonth() + 6); dateEl.max = iso(max);

    const fmtDate = (s) => { const [y, m, dd] = s.split('-').map(Number); return new Date(y, m - 1, dd).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); };
    const fmtTime = (s) => lang === 'fr' ? s.replace(':', 'h') : s;
    const field = (name) => form.elements[name]?.closest('.field');
    const flag = (name, bad) => { const f = field(name); if (!f) return; f.classList.toggle('is-invalid', bad); form.elements[name].setAttribute('aria-invalid', String(bad)); };
    const validate = () => {
      const v = Object.fromEntries(new FormData(form).entries());
      const checks = {
        name: (v.name || '').trim().length >= 2,
        phone: /^\+?[0-9 ().-]{7,20}$/.test((v.phone || '').trim()),
        date: !!v.date && v.date >= dateEl.min && v.date <= dateEl.max,
        time: !!v.time && v.time >= form.dataset.minTime && v.time <= form.dataset.maxTime,
        guests: Number(v.guests) >= 1 && Number(v.guests) <= 12,
        consent: form.elements.consent.checked,
      };
      let firstBad = null;
      for (const [k, ok] of Object.entries(checks)) { flag(k, !ok); if (!ok && !firstBad) firstBad = k; }
      if (firstBad) form.elements[firstBad].focus();
      return !firstBad ? v : null;
    };
    ['name', 'phone', 'date', 'time', 'guests', 'consent'].forEach((n) => form.elements[n]?.addEventListener('input', () => flag(n, false)));

    /* Live reservation summary */
    const sum = d.querySelector('[data-summary]'), sumLine = sum?.querySelector('[data-summary-line]');
    const emptyText = sumLine?.textContent;
    const refreshSummary = () => {
      if (!sum) return;
      const dv = form.elements.date.value, tv = form.elements.time.value, g = Number(form.elements.guests.value);
      if (!dv || !tv) { sumLine.textContent = emptyText; sumLine.classList.add('is-empty'); return; }
      const guests = `${g} ${g === 1 ? sum.dataset.one : sum.dataset.other}`;
      sumLine.textContent = sum.dataset.template.replace('{date}', fmtDate(dv)).replace('{time}', fmtTime(tv)).replace('{guests}', guests);
      sumLine.classList.remove('is-empty');
    };
    ['date', 'time', 'guests'].forEach((n) => form.elements[n].addEventListener('input', refreshSummary));

    const showSuccess = (mode, link) => {
      const t = success.querySelector('[data-success-title]'), p = success.querySelector('[data-success-text]'), a = success.querySelector('[data-whatsapp-link]');
      t.textContent = t.dataset['title' + mode]; p.textContent = p.dataset['text' + mode];
      if (link) { a.href = link; a.hidden = false; } else a.hidden = true;
      form.hidden = true; success.hidden = false; success.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' }); t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true });
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      netErr.hidden = true;
      if (form.elements._gotcha.value) return; // honeypot
      const v = validate(); if (!v) return;
      if (endpoint) {
        submit.setAttribute('aria-busy', 'true'); submit.disabled = true; submit.textContent = submit.dataset.labelBusy;
        try {
          const fd = new FormData(form); fd.delete('_gotcha'); fd.set('date', fmtDate(v.date)); fd.set('time', fmtTime(v.time));
          const res = await fetch(endpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
          if (!res.ok) throw new Error(res.status);
          showSuccess('Endpoint');
        } catch { netErr.hidden = false; }
        finally { submit.removeAttribute('aria-busy'); submit.disabled = false; submit.textContent = submit.dataset.labelDefault; }
      } else {
        const msg = tpl.replace('{name}', v.name.trim()).replace('{phone}', v.phone.trim()).replace('{date}', fmtDate(v.date)).replace('{time}', fmtTime(v.time)).replace('{guests}', v.guests).replace('{message}', (v.message || '').trim() || '—');
        const url = `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank', 'noopener');
        showSuccess('Whatsapp', url);
      }
    });
  }

  d.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
