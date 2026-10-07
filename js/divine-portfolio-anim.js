/**
 * DIVINE INTERIORS - Landing Page Building Ink-Mask Animation
 * Smoothly morphs wireframe building sketch into concrete building with orange sun circle on scroll & hover
 */
(function() {
  function initBuildingAnim() {
    const container = document.getElementById('homeIntroBuildingAnim') || document.querySelector('.home-intro-img');
    const maskPath = document.getElementById('homeIntroMaskPath') || (container ? container.querySelector('path.mask') : null);
    if (!container || !maskPath) return;

    let targetProgress = 0;
    let currentProgress = -1;
    let isHovering = false;

    function updateMaskPath(p) {
      const clamped = Math.max(0, Math.min(1, p));
      // Map 0 -> 1 to y coordinates with comfortable padding for turbulence distortion
      const y1 = -80 + (1180 - (-80)) * clamped;
      const yctrl = -80 + (1420 - (-80)) * clamped;
      const y2 = -80 + (1180 - (-80)) * clamped;
      maskPath.setAttribute('d', `M 0 ${y1.toFixed(1)} Q 500 ${yctrl.toFixed(1)} 1000 ${y2.toFixed(1)} L 1000 0 L 0 0 Z`);
    }

    function getScrollProgress() {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      // Start revealing when top of intro image enters around 85% of viewport
      // Complete reveal when top is around 25% of viewport
      const start = vh * 0.85;
      const end = vh * 0.25;
      const p = (start - rect.top) / (start - end);
      return Math.max(0, Math.min(1, p));
    }

    container.addEventListener('pointerenter', () => {
      isHovering = true;
    });

    container.addEventListener('pointermove', (e) => {
      isHovering = true;
      const rect = container.getBoundingClientRect();
      const relY = (e.clientY - rect.top) / rect.height;
      targetProgress = Math.max(0, Math.min(1, relY));
    });

    container.addEventListener('pointerleave', () => {
      isHovering = false;
    });

    container.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        const rect = container.getBoundingClientRect();
        const relY = (e.touches[0].clientY - rect.top) / rect.height;
        targetProgress = Math.max(0, Math.min(1, relY));
      }
    }, { passive: true });

    container.addEventListener('click', () => {
      targetProgress = targetProgress > 0.5 ? 0.05 : 0.95;
    });

    function tick() {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const inView = rect.bottom > -100 && rect.top < vh + 100;

      if (inView) {
        if (!isHovering) {
          targetProgress = getScrollProgress();
        }

        if (currentProgress < 0) {
          currentProgress = targetProgress;
        } else {
          currentProgress += (targetProgress - currentProgress) * 0.12;
        }
        updateMaskPath(currentProgress);
      }

      requestAnimationFrame(tick);
    }

    currentProgress = getScrollProgress();
    updateMaskPath(currentProgress);
    requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBuildingAnim);
  } else {
    initBuildingAnim();
  }
})();
