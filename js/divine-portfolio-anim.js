/**
 * DIVINE INTERIORS - Heron AI Building Ink-Mask Animation
 * Smoothly morphs base outline building into full concrete building with orange sun circle on scroll
 * Faithfully matches original Heron AI ink-mask algorithm and scroll trajectory
 */
(function() {
  function initBuildingAnim() {
    const container = document.getElementById('homeIntroBuildingAnim') || document.querySelector('.home-intro-img');
    if (!container) return;

    const mainWrap = container.querySelector('.ink-mask-img.main');
    const mainImg = mainWrap ? mainWrap.querySelector('img') : null;
    const svg = container.querySelector('svg');
    const maskPath = document.getElementById('homeIntroMaskPath') || (svg ? svg.querySelector('path.mask') : null);

    if (!svg || !maskPath) return;

    // Ensure base outline image is explicitly visible at all times
    if (mainImg) {
      mainImg.style.display = 'block';
      mainImg.style.opacity = '1';
      mainImg.style.visibility = 'visible';
    }

    const dataStart = parseFloat(mainWrap ? mainWrap.getAttribute('data-start') : '35') || 35;
    const dataEnd = parseFloat(mainWrap ? mainWrap.getAttribute('data-end') : '55') || 55;

    let targetProgress = 0;
    let currentProgress = -1;

    function getMetrics() {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const elHeight = container.offsetHeight || rect.height;
      const elWidth = container.offsetWidth || rect.width;

      const s = 1000;
      const o = elWidth > 0 ? (elHeight / elWidth) * s : s;
      svg.setAttribute('viewBox', `0 0 ${s} ${o.toFixed(1)}`);

      // Heron AI scroll calculation:
      // startPx: when top of element enters at dataStart% from viewport top
      // endPx: when top of element reaches dataEnd% from viewport top
      const startPx = (dataStart / 100) * vh;
      const endPx = (dataEnd / 100) * vh;
      const scrollRange = (startPx - endPx) + elHeight;

      const r = startPx - rect.top;
      const progress = scrollRange > 0 ? Math.max(0, Math.min(1, r / scrollRange)) : 0;
      return { progress, o, s };
    }

    function updateMask(progress, maxO) {
      const p = Math.max(0, Math.min(1, progress));
      const o = maxO || 1000;

      // Start: M 0 1 Q 500 2 1000 1 L 1000 0 L 0 0 Z (0% revealed, only outline visible)
      // End:   M 0 o Q 500 (o*1.25) 1000 o L 1000 0 L 0 0 Z (100% revealed, fully colored)
      const ySides = 1 + (o - 1) * p;
      const yCurve = 2 + (o * 1.25 - 2) * p;

      maskPath.setAttribute('d', `M 0 ${ySides.toFixed(1)} Q 500 ${yCurve.toFixed(1)} 1000 ${ySides.toFixed(1)} L 1000 0 L 0 0 Z`);
    }

    function onScrollOrTick() {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      // Only process when near viewport
      if (rect.bottom < -150 || rect.top > vh + 150) return;

      const { progress, o } = getMetrics();
      targetProgress = progress;

      if (currentProgress < 0) {
        currentProgress = targetProgress;
      } else {
        currentProgress += (targetProgress - currentProgress) * 0.18;
        if (Math.abs(targetProgress - currentProgress) < 0.001) {
          currentProgress = targetProgress;
        }
      }

      updateMask(currentProgress, o);
    }

    function loop() {
      onScrollOrTick();
      requestAnimationFrame(loop);
    }

    // Initialize mask to current progress
    const initial = getMetrics();
    currentProgress = initial.progress;
    updateMask(currentProgress, initial.o);
    requestAnimationFrame(loop);

    window.addEventListener('scroll', onScrollOrTick, { passive: true });
    window.addEventListener('resize', onScrollOrTick, { passive: true });
    if (window.lenis && typeof window.lenis.on === 'function') {
      window.lenis.on('scroll', onScrollOrTick);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBuildingAnim);
  } else {
    initBuildingAnim();
  }
})();
