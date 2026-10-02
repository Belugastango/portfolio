document.addEventListener('DOMContentLoaded', () => {
  const introSource = 'assets/6a63248e9e2e27200fb0efcf_609974a6d6c317e394b965e56b552669_image%20330.avif';
  const setIntroArtwork = () => {
    document.querySelectorAll('.home-intro-img .ink-mask-img.main img').forEach((image) => {
      image.style.display = 'none';
    });
    document.querySelectorAll('.home-intro-img image').forEach((image) => {
      image.setAttribute('href', introSource);
    });
  };

  setIntroArtwork();
  new MutationObserver(setIntroArtwork).observe(document.body, { childList: true, subtree: true });

  const heroImage = document.querySelector('.home-hero-img-inner > img');
  if (!heroImage) return;

  heroImage.src = 'assets/6a703ca7b25c47076637c631_4f993b1a199968429382e85294f3e6d1_Full.webp';
  heroImage.alt = 'Black and white architectural sketch of a modern concrete building with large windows and trees on each side.';
});
