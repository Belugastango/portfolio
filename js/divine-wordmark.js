document.addEventListener('DOMContentLoaded', () => {
  const symbol = document.querySelector('.header-logo-item:not(.item-txt)');
  if (symbol) symbol.style.display = 'none';

  const logoItem = document.querySelector('.header-logo-item.item-txt');
  if (logoItem) {
    logoItem.style.width = 'auto';
    logoItem.style.maxWidth = 'none';
    logoItem.style.whiteSpace = 'nowrap';
    logoItem.style.transform = 'none';
  }

  const wordmark = document.querySelector('.header-logo-item.item-txt .embed-ic');
  if (wordmark) {
    wordmark.replaceChildren();
    const label = document.createElement('span');
    label.textContent = 'DIVINE INTERIORS';
    label.style.display = 'inline-block';
    label.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    label.style.fontSize = '18px';
    label.style.fontWeight = '800';
    label.style.color = '#1a1a1a';
    label.style.letterSpacing = '0.08em';
    label.style.lineHeight = '1';
    label.style.textTransform = 'uppercase';
    label.style.whiteSpace = 'nowrap';
    wordmark.appendChild(label);
  }

  // Active scroll guard: Keep Divine Interiors logo completely still and top bar intact
  const freezeNavbarAndLogo = () => {
    const h = document.querySelector('.header');
    const hInner = document.querySelector('.header-inner');
    const logoTxt = document.querySelector('.header-logo-item.item-txt');
    if (h && h.classList.contains('on-hide')) {
      h.classList.remove('on-hide');
    }
    if (hInner && hInner.style.transform && hInner.style.transform !== 'none') {
      hInner.style.transform = 'none';
    }
    if (logoTxt && logoTxt.style.transform && logoTxt.style.transform !== 'none') {
      logoTxt.style.transform = 'none';
    }
  };

  window.addEventListener('scroll', freezeNavbarAndLogo, { passive: true });
  window.addEventListener('resize', freezeNavbarAndLogo, { passive: true });
  requestAnimationFrame(function poll() {
    freezeNavbarAndLogo();
    requestAnimationFrame(poll);
  });
});
