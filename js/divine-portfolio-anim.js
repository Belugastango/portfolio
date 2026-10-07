/**
 * Divine Interiors - Portfolio Building Ink-Mask Animation
 * Morphing wireframe building into concrete building with sun circle
 */
(function() {
  function initPortfolioBuildingAnim() {
    const card = document.getElementById('diPortfolioBuildingCard');
    const maskPath = document.getElementById('portfolioBuildingMaskPath');
    if (!card || !maskPath) return;

    let targetProgress = 0;
    let currentProgress = -1;
    let isHovering = false;

    function updateMaskPath(p) {
      const clamped = Math.max(0, Math.min(1, p));
      // Map 0 -> 1 to y positions with padding for turbulence distortion
      const y1 = -80 + (1180 - (-80)) * clamped;
      const yctrl = -80 + (1420 - (-80)) * clamped;
      const y2 = -80 + (1180 - (-80)) * clamped;
      maskPath.setAttribute('d', `M 0 ${y1.toFixed(1)} Q 500 ${yctrl.toFixed(1)} 1000 ${y2.toFixed(1)} L 1000 0 L 0 0 Z`);
    }

    function getScrollProgress() {
      const rect = card.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      // Start reveal when top of card is at 88% viewport, full reveal by 30% viewport
      const start = vh * 0.88;
      const end = vh * 0.30;
      const p = (start - rect.top) / (start - end);
      return Math.max(0, Math.min(1, p));
    }

    card.addEventListener('pointerenter', () => {
      isHovering = true;
    });

    card.addEventListener('pointermove', (e) => {
      isHovering = true;
      const rect = card.getBoundingClientRect();
      const relY = (e.clientY - rect.top) / rect.height;
      targetProgress = Math.max(0, Math.min(1, relY));
    });

    card.addEventListener('pointerleave', () => {
      isHovering = false;
    });

    card.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        const rect = card.getBoundingClientRect();
        const relY = (e.touches[0].clientY - rect.top) / rect.height;
        targetProgress = Math.max(0, Math.min(1, relY));
      }
    }, { passive: true });

    card.addEventListener('click', () => {
      targetProgress = targetProgress > 0.5 ? 0.05 : 0.95;
    });

    function tick() {
      const rect = card.getBoundingClientRect();
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
    document.addEventListener('DOMContentLoaded', initPortfolioBuildingAnim);
  } else {
    initPortfolioBuildingAnim();
  }
})();
