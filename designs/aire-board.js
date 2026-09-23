(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('.board-card').forEach(card => {
    let frame = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      card.style.removeProperty('--rx');
      for (const key of ['--ry','--px','--py','--glow-x','--glow-y']) card.style.removeProperty(key);
    };
    card.addEventListener('pointermove', event => {
      if (motion.matches || !pointer.matches || event.pointerType === 'touch') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = card.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX-box.left)/box.width));
        const y = Math.max(0, Math.min(1, (event.clientY-box.top)/box.height));
        card.style.setProperty('--px', `${(x-.5)*16}px`);
        card.style.setProperty('--py', `${(y-.5)*12}px`);
        card.style.setProperty('--glow-x', `${x*100}%`);
        card.style.setProperty('--glow-y', `${y*100}%`);
        card.style.setProperty('--rx', `${(0.5-y)*14}deg`);
        card.style.setProperty('--ry', `${(x-0.5)*14}deg`);
      });
    });
    card.addEventListener('pointerleave',reset);
    card.addEventListener('pointercancel',reset);
    motion.addEventListener('change',reset);
    pointer.addEventListener('change',reset);
  });
})();
