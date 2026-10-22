/* Samarth Sharma — Portfolio interactions (no dependencies). */
(function () {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme toggle (persisted, respects OS preference) ---------- */
  const toggle = document.getElementById('theme-toggle');
  const icon = toggle.querySelector('.material-symbols-rounded');
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    document.querySelector('meta[name="theme-color"]').setAttribute('content', theme === 'dark' ? '#131314' : '#0b57d0');
  }
  applyTheme(stored || (prefersDark ? 'dark' : 'light'));
  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });

  /* ---------- Top bar shadow on scroll ---------- */
  const bar = document.querySelector('.top-bar');
  const onScroll = () => bar.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Active nav link (scroll spy) ---------- */
  const navLinks = Array.from(document.querySelectorAll('.nav a'));
  const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => spy.observe(s));

  /* ---------- Reveal-on-scroll ---------- */
  const revealTargets = document.querySelectorAll('.card, .case, .tl-item, .skill-group, .quote, .edu-card, .stat');
  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 50}ms`;
  });
  const revealer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealer.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(el => revealer.observe(el));

  /* ---------- Count-up for hero stats ---------- */
  if (!reduceMotion) {
    const stats = document.querySelectorAll('.stat-value[data-count]');
    const counter = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        counter.unobserve(e.target);
        const el = e.target;
        const target = Number(el.dataset.count);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const duration = 1100;
        const start = performance.now();
        const tick = now => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = prefix + Math.round(target * eased) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    stats.forEach(s => counter.observe(s));
  }

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
