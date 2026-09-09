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
})();
