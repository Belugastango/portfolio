/**
 * DIVINE INTERIORS — Website Loading Animation & Shutter Reveal Engine
 * Features:
 * - Real-time progress bar (0% to 100%)
 * - Dynamic CAD pixel measurement coordinate tracker (X / Y)
 * - Animated "JUST A SEC....."
 * - High-precision timer that runs smoothly in all tab states (active or background)
 * - Hard failsafe timeout ensuring screen reveals under 2.4s
 * - Smooth transition to the signature square shutter opening animation on complete
 * - Automatic bypass on direct deep links (#services, #portfolio, #about, #contact)
 */
(function() {
  'use strict';

  function initDivineLoader() {
    const loader = document.querySelector('.loading');
    if (!loader) return;

    const hash = window.location.hash;
    const isTransitioning = sessionStorage.getItem('playShutterOpen') === 'true';

    // If entering directly to an in-page anchor section or cross-page shutter navigation, skip the loader
    if (isTransitioning || hash === '#services' || hash === '#portfolio' || hash === '#about' || hash === '#contact') {
      loader.classList.add('loaded');
      loader.style.display = 'none';
      loader.style.pointerEvents = 'none';
      return;
    }

    const percentEl = document.querySelector('.loading-progress-txt-percent');
    const progressBar = document.querySelector('.loading-progress-item-wrap');
    const loadingProgress = document.querySelector('.loading-progress');
    const coordX = document.querySelector('[data-loading-control="x"]');
    const coordY = document.querySelector('[data-loading-control="y"]');
    const ruler = document.querySelector('.loading-ruler');
    const titleEl = document.querySelector('.loading-content-title .heading');

    loader.classList.add('active');
    loader.classList.remove('loaded');
    loader.style.display = 'flex';
    loader.style.opacity = '1';
    loader.style.pointerEvents = 'auto';

    if (ruler) {
      ruler.classList.add('active');
      ruler.style.opacity = '1';
    }

    if (progressBar) progressBar.style.width = '0%';
    if (percentEl) percentEl.textContent = '0';
    if (loadingProgress) loadingProgress.style.top = '72%';
    if (titleEl) titleEl.textContent = 'JUST A SEC.';

    let currentProgress = 0;
    const totalDuration = 2000; // 2.0 seconds
    const startTime = Date.now();
    let finished = false;

    function updateDisplay(p) {
      const pInt = Math.round(p);
      if (percentEl) percentEl.textContent = pInt;
      if (progressBar) progressBar.style.width = p + '%';
      if (loadingProgress) {
        const scanTop = 72 - (p / 100) * 25.5;
        loadingProgress.style.top = scanTop + '%';
      }

      if (coordX) {
        const xVal = Math.round(1131 + (p / 100) * 450 + (Math.sin(p * 0.35) * 18));
        coordX.textContent = xVal;
      }
      if (coordY) {
        const yVal = Math.round(620 + (p / 100) * 270 + (Math.cos(p * 0.35) * 14));
        coordY.textContent = yVal;
      }

      if (titleEl) {
        const dotCount = Math.min(5, 1 + Math.floor((p / 100) * 5));
        titleEl.textContent = 'JUST A SEC' + '.'.repeat(dotCount);
      }
    }

    function onLoadingFinished() {
      if (finished) return;
      finished = true;
      updateDisplay(100);

      setTimeout(() => {
        if (typeof window.setShutterPercent === 'function') {
          window.setShutterPercent(50);
        }

        loader.classList.add('loaded');
        loader.style.transition = 'opacity 0.45s ease';
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.style.display = 'none';
          loader.style.pointerEvents = 'none';
        }, 450);

        setTimeout(() => {
          if (typeof window.playShutterOpen === 'function') {
            window.playShutterOpen();
          } else if (typeof window.setShutterPercent === 'function') {
            window.setShutterPercent(0);
          }
        }, 60);
      }, 160);
    }

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      currentProgress = Math.min(100, (elapsed / totalDuration) * 100);
      updateDisplay(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        onLoadingFinished();
      }
    }, 25);

    // Hard failsafe timeout
    setTimeout(() => {
      clearInterval(interval);
      onLoadingFinished();
    }, 2400);
  }

  if (window.location.hash && window.location.hash !== '#home') {
    if (typeof window.setShutterPercent === 'function') {
      window.setShutterPercent(0);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDivineLoader);
  } else {
    initDivineLoader();
  }
})();
