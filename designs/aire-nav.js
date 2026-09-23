(() => {
  // Past this much scroll the header condenses into the floating pill. The header
  // is sticky either way, so this only swaps a class: no measuring, no layout.
  const threshold = 60;
  let frame = 0;
  function mark() {
    frame = 0;
    document.body.classList.toggle('nav-pinned', scrollY > threshold);
  }
  addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(mark); }, { passive: true });
  mark();
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-navigation');
  if (!toggle || !nav) return;
  const mobile = matchMedia('(max-width: 900px)');
  document.body.classList.add('nav-enhanced');
  const close = () => {
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      close();
      toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.header-inner')) close();
  });
  document.querySelector('.header-inner').addEventListener('focusout', event => {
    if (!event.currentTarget.contains(event.relatedTarget)) close();
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
  mobile.addEventListener('change', close);
})();
