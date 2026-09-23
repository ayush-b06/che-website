(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('.board-card').forEach(card => {
    let frame = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      card.style.removeProperty('--rx');
      card.style.removeProperty('--ry');
    };
    card.addEventListener('pointermove', event => {
      if (motion.matches || !pointer.matches || event.pointerType === 'touch') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = card.getBoundingClientRect();
        card.style.setProperty('--rx', `${(0.5 - (event.clientY-box.top)/box.height)*4}deg`);
        card.style.setProperty('--ry', `${((event.clientX-box.left)/box.width-0.5)*4}deg`);
      });
    });
    card.addEventListener('pointerleave',reset);
    card.addEventListener('pointercancel',reset);
    motion.addEventListener('change',reset);
    pointer.addEventListener('change',reset);
  });
})();
