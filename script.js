// Premium portfolio interactions: mobile menu, reveal-on-scroll and skill meters.
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const row = entry.target;
        row.style.setProperty('--level', `${row.dataset.level}%`);
        row.classList.add('in-view');
        skillObserver.unobserve(row);
      }
    });
  }, { threshold: 0.45 });
  document.querySelectorAll('.skill-row').forEach(row => skillObserver.observe(row));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  document.querySelectorAll('.skill-row').forEach(row => row.style.setProperty('--level', `${row.dataset.level}%`));
}

// Side menu opened by clicking the P logo.
(() => {
  const toggle = document.querySelector('.side-toggle');
  const side = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!toggle || !side) return;
  const setOpen = open => {
    document.body.classList.toggle('side-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    side.setAttribute('aria-hidden', String(!open));
  };
  toggle.addEventListener('click', () => setOpen(!document.body.classList.contains('side-open')));
  overlay?.addEventListener('click', () => setOpen(false));
  side.querySelector('.sidebar-close')?.addEventListener('click', () => setOpen(false));
  side.querySelectorAll('.sidebar-links a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
})();
