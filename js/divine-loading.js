/**
 * DIVINE INTERIORS — Website Loading Animation & Shutter Reveal Engine
 * Features:
 * - Real-time progress bar (0% to 100%)
 * - Dynamic CAD pixel measurement coordinate tracker (X / Y)
 * - Progressive illumination of the 10 Divine Interiors architectural execution stages
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

    // Make sure loader and ruler are active
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

    const tracker = { progress: 0 };
    const duration = 2.2; // 2.2 seconds: smooth, elegant architectural scan

    function updateDisplay() {
      const p = Math.round(tracker.progress);
      if (percentEl) percentEl.textContent = p;
      if (progressBar) progressBar.style.width = tracker.progress + '%';
      if (loadingProgress) {
        const scanTop = 72 - (tracker.progress / 100) * 25.5;
        loadingProgress.style.top = scanTop + '%';
      }

      // Update CAD measurement coordinates with realistic architectural layout numbers
      if (coordX) {
        const xVal = Math.round(1131 + (tracker.progress / 100) * 450 + (Math.sin(tracker.progress * 0.35) * 18));
        coordX.textContent = xVal;
      }
      if (coordY) {
        const yVal = Math.round(620 + (tracker.progress / 100) * 270 + (Math.cos(tracker.progress * 0.35) * 14));
        coordY.textContent = yVal;
      }

      // Animate dots in JUST A SEC..... (progressively 1 to 5 dots)
      if (titleEl) {
        const dotCount = Math.min(5, 1 + Math.floor((tracker.progress / 100) * 5));
        titleEl.textContent = 'JUST A SEC' + '.'.repeat(dotCount);
      }
    }

    function onLoadingFinished() {
      tracker.progress = 100;
      updateDisplay();

      // Brief pause at 100% before shutter transition
      setTimeout(() => {
        // Prepare shutter lines at center (50%)
        if (typeof window.setShutterPercent === 'function') {
          window.setShutterPercent(50);
        }

        // Fade out loader smoothly
        loader.classList.add('loaded');
        if (typeof gsap !== 'undefined') {
          gsap.to(loader, {
            opacity: 0,
            duration: 0.45,
            ease: 'power2.inOut',
            onComplete: () => {
              loader.style.display = 'none';
              loader.style.pointerEvents = 'none';
            }
          });
        } else {
          loader.style.opacity = '0';
          setTimeout(() => {
            loader.style.display = 'none';
            loader.style.pointerEvents = 'none';
          }, 450);
        }

        // Trigger the square shutter opening animation outward from 50% to 0%
        setTimeout(() => {
          if (typeof window.playShutterOpen === 'function') {
            window.playShutterOpen();
          } else if (typeof window.setShutterPercent === 'function') {
            window.setShutterPercent(0);
          }
        }, 60);
      }, 160);
    }

    if (typeof gsap !== 'undefined') {
      gsap.to(tracker, {
        progress: 100,
        duration: duration,
        ease: 'power1.inOut',
        onUpdate: updateDisplay,
        onComplete: onLoadingFinished
      });
    } else {
      let start = null;
      function step(timestamp) {
        if (!start) start = timestamp;
        const elapsed = (timestamp - start) / 1000;
        tracker.progress = Math.min(100, (elapsed / duration) * 100);
        updateDisplay();
        if (tracker.progress < 100) {
          requestAnimationFrame(step);
        } else {
          onLoadingFinished();
        }
      }
      requestAnimationFrame(step);
    }
  }

  // Ensure shutter percent is initialized to 0% if bypassed
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
