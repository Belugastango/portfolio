function applyHeroImage() {
  const heroImage = document.querySelector('.home-hero-img-inner > img');
  if (!heroImage) return;

  const targetSrc = 'assets/6a703ca7b25c47076637c631_4f993b1a199968429382e85294f3e6d1_Full.webp';
  if (heroImage.getAttribute('src') !== targetSrc) {
    heroImage.src = targetSrc;
  }
  heroImage.alt = 'Black and white architectural sketch of a modern concrete building with large windows and trees on each side.';
}

// Run immediately and on DOMContentLoaded
applyHeroImage();
document.addEventListener('DOMContentLoaded', applyHeroImage);

// Hook into Barba page transitions if active
if (window.barba && typeof window.barba.hooks?.after === 'function') {
  window.barba.hooks.after(applyHeroImage);
}

// Handle logo click: scroll smoothly to top
document.addEventListener('click', (e) => {
  const logoLink = e.target.closest('.header-logo a');
  if (!logoLink) return;
  const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
  if (isHomePage) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.lenis && typeof window.lenis.scrollTo === 'function') {
      window.lenis.scrollTo(0);
    }
  }
});
