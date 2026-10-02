/**
 * DIVINE INTERIORS — Clients Infinite Sliding Marquee & Architectural Enclosure
 */
(function() {
  'use strict';

  function initDivinePartners() {
    const wrap = document.querySelector('.home-intro-partner-wrap');
    const partner = document.querySelector('.home-intro-partner');
    const inner = document.querySelector('.home-intro-partner-inner');
    const desc = document.querySelector('.home-intro-desc');
    const labelWrap = document.querySelector('.home-intro-partner-label-wrap');
    if (!partner || !inner) return;

    // 1. Ensure the enclosing architectural border box is 100% formed
    // Ensure right vertical line on wrapper
    if (wrap && !wrap.querySelector(':scope > .line.line-vertical.top.right')) {
      const rightLine = document.createElement('div');
      rightLine.className = 'line line-vertical top right';
      wrap.appendChild(rightLine);
    }

    // Ensure bottom horizontal line on footer desc
    if (desc && !desc.querySelector(':scope > .line.line-horizital.bot.left.right')) {
      const botLine = document.createElement('div');
      botLine.className = 'line line-horizital bot left right';
      desc.appendChild(botLine);
    }

    // Ensure header title is "CLIENTS"
    const headingTxt = document.querySelector('.home-intro-partner-label .txt');
    if (headingTxt) {
      headingTxt.textContent = 'CLIENTS';
    }

    // 2. Setup crisp navigation controls
    const ctrls = document.querySelector('.home-intro-partner-ctrls');
    let prevBtn = document.querySelector('.home-intro-control.item-prev');
    let nextBtn = document.querySelector('.home-intro-control.item-next');

    if (ctrls) {
      ctrls.innerHTML = `
        <div class="line line-vertical left top"></div>
        <div class="home-intro-control item-prev" role="button" aria-label="Slide Left" title="Slide Left">
          <div class="home-intro-control-arrow">
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.125 5.625L3.75 10.0618L8.125 14.375M3.75 10.0618H17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="line line-vertical left top"></div>
        <div class="home-intro-control item-next" role="button" aria-label="Slide Right" title="Slide Right">
          <div class="home-intro-control-arrow">
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.875 14.375L16.25 9.93818L11.875 5.625M16.25 9.93818H2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      `;
      prevBtn = ctrls.querySelector('.item-prev');
      nextBtn = ctrls.querySelector('.item-next');
    }

    // 3. Client Brands Data — Always Full Color
    const clients = [
      { name: 'Polo Ralph Lauren', image: 'assets/logo-ralph-lauren-clean.png' },
      { name: 'Aditya Birla Group', image: 'assets/logo-aditya-birla-clean.png' },
      { name: 'MANGO', image: 'assets/logo-mango-clean.png' },
      { name: 'PeopleStrong', image: 'assets/logo-peoplestrong-clean.svg' },
      { name: "Domino's Pizza", image: 'assets/logo-dominos-clean.png' },
      { name: 'Godrej Interio', image: 'assets/logo-godrej-clean.png' },
      { name: 'Tim Hortons', image: 'assets/logo-tim-hortons-clean.png' },
      { name: 'Swarovski', image: 'assets/logo-swarovski.svg' },
      { name: 'Antony Morato', image: 'assets/logo-antony-morato-clean.png' },
      { name: 'Roslyn Cafe', image: 'assets/logo-roslyn-cafe.svg' }
    ];

    // 4. Build Infinite Marquee DOM
    inner.innerHTML = '';
    const ticker = document.createElement('div');
    ticker.className = 'divine-partner-ticker';

    const track = document.createElement('div');
    track.className = 'divine-partner-track';

    // Duplicate client list (2 sets for seamless mathematical infinite wrap)
    const renderList = [...clients, ...clients, ...clients];

    renderList.forEach((client, idx) => {
      const cell = document.createElement('div');
      cell.className = 'divine-partner-cell';
      cell.dataset.index = idx;

      const img = document.createElement('img');
      img.className = 'divine-partner-logo';
      img.src = client.image;
      img.alt = client.name;
      img.title = client.name;
      img.loading = 'eager';
      img.decoding = 'async';

      cell.appendChild(img);
      track.appendChild(cell);
    });

    ticker.appendChild(track);
    inner.appendChild(ticker);

    // 5. Infinite Sliding Physics & Animation Engine
    let currentX = 0;
    let targetX = 0;
    let baseSpeed = 0.75; // Smooth, continuous leftward glide (pixels per frame)
    let isHovered = false;
    let isDragging = false;
    let startDragX = 0;
    let dragStartX = 0;
    let animationFrameId = null;

    function getSetWidth() {
      // Width of 1 complete sequence of clients
      const singleCell = track.querySelector('.divine-partner-cell');
      const cellWidth = singleCell ? singleCell.getBoundingClientRect().width : 210;
      return cellWidth * clients.length;
    }

    function tick() {
      const setWidth = getSetWidth();

      if (!isDragging) {
        if (!isHovered) {
          // Automatic continuous slide to the left
          targetX -= baseSpeed;
        }

        // Smooth interpolation towards targetX for buttery motion on clicks/nudges
        currentX += (targetX - currentX) * 0.12;
      } else {
        targetX = currentX;
      }

      // Infinite wrapping logic
      if (setWidth > 0) {
        while (currentX <= -setWidth) {
          currentX += setWidth;
          targetX += setWidth;
        }
        while (currentX > 0) {
          currentX -= setWidth;
          targetX -= setWidth;
        }
      }

      track.style.transform = `translate3d(${currentX.toFixed(2)}px, 0, 0)`;
      animationFrameId = requestAnimationFrame(tick);
    }

    animationFrameId = requestAnimationFrame(tick);

    // 6. Interactive Events: Hover Pause
    inner.addEventListener('mouseenter', () => {
      isHovered = true;
    });

    inner.addEventListener('mouseleave', () => {
      isHovered = false;
      isDragging = false;
    });

    // 7. Interactive Events: Prev & Next Arrow Controls
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const singleCell = track.querySelector('.divine-partner-cell');
        const shift = singleCell ? singleCell.getBoundingClientRect().width : 210;
        // Slide left (advance ticker leftward)
        targetX -= shift;
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const singleCell = track.querySelector('.divine-partner-cell');
        const shift = singleCell ? singleCell.getBoundingClientRect().width : 210;
        // Slide right (reverse ticker rightward)
        targetX += shift;
      });
    }

    // 8. Touch & Mouse Drag Gesture Support
    function onPointerDown(e) {
      isDragging = true;
      startDragX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      dragStartX = currentX;
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const deltaX = clientX - startDragX;
      currentX = dragStartX + deltaX;
      targetX = currentX;
    }

    function onPointerUp() {
      isDragging = false;
    }

    track.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    track.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDivinePartners);
  } else {
    initDivinePartners();
  }
})();
