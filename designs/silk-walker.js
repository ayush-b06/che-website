(() => {
  const rail = document.querySelector('.walker-rail');
  const stage = document.querySelector('.walker-stage');
  const status = document.querySelector('.walker-status');
  const layout = document.querySelector('.impact-layout');
  const pin = document.querySelector('.impact-pin');
  const timeline = document.querySelector('.timeline');
  const track = document.querySelector('.impact .numbers');
  const stats = [...document.querySelectorAll('.impact .stat')];
  const count = document.querySelector('.timeline-count');
  const pad = n => String(n).padStart(2, '0');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // One stride cycle per this much page scroll. The pose comes from the window's
  // scroll position rather than the rail's own travel, so the walk keeps pace
  // even while the numbers are far outside the viewport. Standing still on the
  // page leaves the figure standing still too: there is no clock-based playback.
  const scrollPerCycle = 560;
  let walker, pose = null, frame = 0, loading = false;

  function silk() {
    return document.body.classList.contains('motion-silk');
  }
  function frozen() {
    return reduced.matches || document.body.classList.contains('motion-paused');
  }
  // How far through the pinned section we are, 0 as it locks and 1 as it is about
  // to release. CSS sticky does the pinning; this only reads it back.
  function pinProgress() {
    const travel = layout.offsetHeight - pin.offsetHeight;
    if (travel <= 0) return 0;
    const start = layout.getBoundingClientRect().top + scrollY;
    return Math.max(0, Math.min(1, (scrollY - start) / travel));
  }
  // Hold each fact in the centre, then briefly crossfade to the next one.
  // A small sideways motion retains the walking rhythm without empty intervals.
  function advanceTimeline() {
    if (!layout.hasAttribute('data-reveal')) return;
    const progress = pinProgress();
    const raw = progress * Math.max(0, stats.length - 1);
    const step = Math.floor(raw);
    const transition = Math.max(0, Math.min(1, (raw - step - .38) / .24));
    const position = step + transition * transition * (3 - 2 * transition);
    const current = Math.round(position);
    stats.forEach((stat, i) => {
      const distance = i - position;
      stat.style.setProperty('--visibility', Math.max(0, 1 - Math.abs(distance)).toFixed(4));
      stat.style.setProperty('--offset', `${(distance * 28).toFixed(2)}px`);
      stat.classList.toggle('is-current', i === current);
    });
    // The walking line doubles as the progress bar; its :after fill scales by this.
    timeline.style.setProperty('--progress', progress.toFixed(4));
    const counter = `${pad(current + 1)} / ${pad(stats.length)}`;
    if (count.textContent !== counter) count.textContent = counter;
    layout.dataset.pinProgress = progress.toFixed(4);
    layout.dataset.chapter = String(current + 1);
  }
  function syncReveal() {
    if (silk() && !reduced.matches) {
      layout.setAttribute('data-reveal', '');
    } else {
      layout.removeAttribute('data-reveal');
      track.style.removeProperty('--shift');
      timeline.style.removeProperty('--progress');
      stats.forEach(stat => {
        stat.classList.remove('is-current');
        stat.style.removeProperty('--visibility');
        stat.style.removeProperty('--offset');
      });
    }
    advanceTimeline();
  }
  function update() {
    frame = 0;
    advanceTimeline();
    if (!walker) return;
    const cycles = scrollY / scrollPerCycle;
    const next = frozen() ? (pose ?? 0) : ((cycles % 1) + 1) % 1 * walker.duration;
    if (next === pose) return;
    pose = next;
    walker.render(pose);
    rail.dataset.animationTime = pose.toFixed(4);
    rail.dataset.cycleProgress = (pose / walker.duration).toFixed(4);
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  function fail() {
    rail.dataset.viewerState = 'unavailable';
    status.hidden = false;
    status.textContent = 'Our walking companion needs WebGL, which this browser has turned off.';
  }
  function load() {
    if (loading || !silk()) return;
    loading = true;
    const script = document.createElement('script');
    script.src = 'walker-renderer.js';
    script.onload = () => CHEWalker.create(stage).then(instance => {
      walker = instance;
      rail.dataset.viewerState = 'ready';
      status.hidden = true;
      new ResizeObserver(() => walker.resize()).observe(stage);
      update();
    }).catch(fail);
    script.onerror = fail;
    document.head.append(script);
  }

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  // Panel widths follow the timeline's width, so re-measure when it changes.
  new ResizeObserver(() => advanceTimeline()).observe(timeline);
  reduced.addEventListener('change', () => { syncReveal(); schedule(); });
  document.addEventListener('aire:motionchange', () => { syncReveal(); load(); schedule(); });
  document.querySelector('.motion-toggle')?.addEventListener('click', schedule);
  syncReveal();
  // Load once the page settles: the figure has to be ready to walk before the
  // timeline scrolls into view, so this is not gated on the rail being visible.
  (window.requestIdleCallback || (fn => setTimeout(fn, 400)))(load);
})();
