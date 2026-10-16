/* ============================================================
   BIN KAMAL BUILDERS — site interactions
   ============================================================ */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header state ---------- */
  var navbar = document.querySelector('.navbar-bkb');
  function onScrollHeader() {
    if (!navbar) return;
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Hero reveal + parallax ---------- */
  var hero = document.querySelector('.hero');
  if (hero) {
    window.requestAnimationFrame(function () { hero.classList.add('loaded'); });
    var heroBg = hero.querySelector('.hero-bg');
    if (heroBg && !prefersReduced) {
      window.addEventListener('scroll', function () {
        var y = window.scrollY;
        if (y > window.innerHeight) return;
        heroBg.style.transform = 'translateY(' + y * 0.28 + 'px)';
      }, { passive: true });
    }
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    var links = menu.querySelectorAll('a.m-menu-link');
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.classList.toggle('active', open);
      document.body.style.overflow = open ? 'hidden' : '';
      links.forEach(function (a, i) {
        a.style.transitionDelay = open ? (0.1 + i * 0.06) + 's' : '0s';
      });
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if ('IntersectionObserver' in window && !prefersReduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Floor plan tabs ---------- */
  document.querySelectorAll('.floor-tabs[data-floor-group]').forEach(function (group) {
    var key = group.dataset.floorGroup;
    var tabs = group.querySelectorAll('.floor-tab');
    var panels = document.querySelectorAll('.floor-panel[data-floor-group="' + key + '"]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        panels.forEach(function (p) { p.classList.remove('active'); });
        var target = document.querySelector('.floor-panel[data-floor-group="' + key + '"][data-floor="' + tab.dataset.floor + '"]');
        if (target) target.classList.add('active');
      });
    });
  });

  /* ---------- Lightbox ---------- */
  var lb = document.querySelector('.lightbox');
  var lbImg = lb ? lb.querySelector('img') : null;
  var lbCap = lb ? lb.querySelector('.lb-caption') : null;
  function openLightbox(src, cap) {
    if (!lb || !lbImg) return;
    lbImg.src = src;
    if (lbCap) lbCap.textContent = cap || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lb) return;
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-lightbox]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openLightbox(el.dataset.lightbox, el.dataset.caption || el.getAttribute('aria-label'));
    });
    el.style.cursor = 'zoom-in';
  });
  if (lb) {
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-close')) closeLightbox(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLightbox(); });
  }

  /* ---------- Forms → POST /api/send (Google SMTP mailer) ---------- */
  function collectFields(form) {
    var data = {};
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      if (el.type === 'submit' || el.type === 'button' || el.type === 'file') return;
      if (el.name === '_gotcha' || el.name === '_honey') return;
      var key = el.name || el.getAttribute('aria-label') || el.placeholder || el.type;
      if (el.type === 'checkbox') { data[key] = el.checked ? 'Yes' : 'No'; return; }
      data[key] = (el.value || '').trim();
    });
    return data;
  }

  function setError(form, message) {
    var box = form.querySelector('.form-error');
    if (!box) {
      box = document.createElement('div');
      box.className = 'form-error';
      if (form.classList.contains('bg-white') || form.classList.contains('bg-light')) box.classList.add('light');
      form.appendChild(box);
    }
    box.textContent = message;
    box.classList.add('show');
  }
  function clearError(form) {
    var box = form.querySelector('.form-error');
    if (box) box.classList.remove('show');
  }

  document.querySelectorAll('form[data-ajax]').forEach(function (form) {
    var success = form.querySelector('.form-success');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearError(form);
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var btn = form.querySelector('[type="submit"]');
      var original = btn ? (btn.dataset.original || btn.textContent) : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      if (success) success.classList.remove('show');

      var honey = form.querySelector('[name="_gotcha"]');

      fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: form.dataset.form || 'Website Enquiry',
          page: location.pathname + location.search,
          _gotcha: honey ? honey.value : '',
          fields: collectFields(form)
        })
      })
        .then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, body: j }; });
        })
        .then(function (res) {
          if (res.ok && res.body && res.body.ok) {
            if (form.id === 'brochure-form') {
              var dl = document.querySelector('.brochure-download');
              if (dl) dl.classList.remove('d-none');
              if (success) success.classList.add('show');
              form.querySelectorAll('input').forEach(function (i) { i.value = ''; });
            } else {
              if (success) success.classList.add('show');
              form.reset();
            }
          } else {
            setError(form, (res.body && res.body.error) || 'Something went wrong. Please try again, or WhatsApp us on 0332-4448445.');
          }
        })
        .catch(function () {
          setError(form, 'Network error. Please check your connection and try again, or WhatsApp us on 0332-4448445.');
        })
        .then(function () {
          if (btn && !form.classList.contains('d-none')) {
            btn.disabled = false;
            btn.textContent = original;
          }
        });
    });
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();