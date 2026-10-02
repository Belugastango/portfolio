/**
 * DIVINE INTERIORS — Top Navigation & Shutter Page Transitions
 * Manages clean menu navigation and original Heron-style square line shutter animations.
 */
(function() {
  'use strict';

  // Manual scroll restoration on refresh or hash entry to prevent browser jump to top
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  function setShutterPercent(val) {
    const root = document.documentElement;
    root.style.setProperty('--trans-percent', val + '%');
    root.style.setProperty('--mask-percent', val + '%');
  }

  function playShutterTransition(onClosed, onOpen) {
    const start = Date.now();
    const halfDuration = 350;
    let closedDone = false;

    setShutterPercent(0);
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      if (elapsed <= halfDuration) {
        const t = elapsed / halfDuration;
        const ease = t * t * (3 - 2 * t);
        setShutterPercent(50 * ease);
      } else {
        if (!closedDone) {
          closedDone = true;
          setShutterPercent(50);
          if (onClosed) onClosed();
        }
        const t = Math.min(1, (elapsed - halfDuration) / halfDuration);
        const ease = t * t * (3 - 2 * t);
        setShutterPercent(50 * (1 - ease));
        if (t >= 1) {
          clearInterval(timer);
          setShutterPercent(0);
          if (onOpen) onOpen();
        }
      }
    }, 16);

    setTimeout(() => {
      clearInterval(timer);
      if (!closedDone && onClosed) onClosed();
      setShutterPercent(0);
      if (onOpen) onOpen();
    }, 850);
  }

  function playShutterClose(onComplete) {
    const start = Date.now();
    const duration = 350;
    let done = false;
    function finish() {
      if (done) return;
      done = true;
      clearInterval(timer);
      setShutterPercent(50);
      if (onComplete) onComplete();
    }
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const t = Math.min(1, elapsed / duration);
      const ease = t * t * (3 - 2 * t);
      setShutterPercent(50 * ease);
      if (t >= 1) finish();
    }, 16);
    setTimeout(finish, 450);
  }

  function playShutterOpen(onComplete) {
    const start = Date.now();
    const duration = 500;
    let done = false;
    function finish() {
      if (done) return;
      done = true;
      clearInterval(timer);
      setShutterPercent(0);
      if (onComplete) onComplete();
    }
    setShutterPercent(50);
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const t = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - t, 3);
      setShutterPercent(50 * (1 - ease));
      if (t >= 1) finish();
    }, 16);
    setTimeout(finish, 650);
  }

  // Export to window
  window.playShutterTransition = playShutterTransition;
  window.playShutterClose = playShutterClose;
  window.playShutterOpen = playShutterOpen;
  window.setShutterPercent = setShutterPercent;

  function getHeaderOffset() {
    const header = document.querySelector('.header');
    return header ? header.offsetHeight : 64;
  }

  function closeMobileMenuIfOpen() {
    const menuBtn = document.querySelector('.header-menu-btn');
    if (menuBtn && menuBtn.classList.contains('active')) {
      menuBtn.click();
    }
  }

  function updateActiveNav(activeKey) {
    const navItems = document.querySelectorAll('.header-menu .header-menu-item');
    navItems.forEach(item => {
      item.classList.remove('w--current');
    });

    let targetLink = null;
    if (activeKey === 'services') {
      targetLink = document.getElementById('nav-services-link') || document.querySelector('.header-menu a[href*="#services"]');
    } else if (activeKey === 'portfolio') {
      targetLink = document.getElementById('nav-portfolio-link') || document.querySelector('.header-menu a[href*="#portfolio"]');
    } else if (activeKey === 'about') {
      targetLink = document.getElementById('nav-about-link') || document.querySelector('.header-menu a[href*="#about"]');
    } else if (activeKey === 'home') {
      targetLink = document.getElementById('nav-home-link') || document.querySelector('.header-menu a[href*="#home"]');
    }

    if (targetLink) {
      targetLink.classList.add('w--current');
    }
  }

  function scrollToServices() {
    const s = document.getElementById('services') || document.querySelector('.home-problem-wrap') || document.querySelector('.home-problem');
    const mi = document.querySelector('.main-inner');
    if (!s) return;

    const offset = getHeaderOffset();
    let attempts = 0;
    const doScroll = () => {
      attempts++;
      if (window.lenis && typeof window.lenis.scrollTo === 'function') {
        try {
          window.lenis.scrollTo(s, { offset: -offset + 8, immediate: true });
        } catch (_) {}
      }
      s.scrollIntoView({ behavior: 'instant', block: 'start' });
      if (mi) {
        const miRect = mi.getBoundingClientRect();
        const sRect = s.getBoundingClientRect();
        const targetTop = mi.scrollTop + (sRect.top - miRect.top) - offset + 8;
        if (targetTop > 50) {
          mi.scrollTop = targetTop;
        }
      }
      const sRect = s.getBoundingClientRect();
      const winTarget = window.scrollY + sRect.top - offset + 8;
      if (winTarget > 50) {
        window.scrollTo(0, winTarget);
      }
      if (attempts < 15) {
        const remaining = s.getBoundingClientRect().top - offset;
        if (Math.abs(remaining) > 30) {
          setTimeout(doScroll, 80);
        }
      }
    };
    doScroll();
  }

  function scrollToPortfolio() {
    const p = document.querySelector('.di-portfolio-wrap') || document.getElementById('portfolio');
    const mi = document.querySelector('.main-inner');
    if (!p) return;

    const offset = getHeaderOffset();
    let attempts = 0;
    const doScroll = () => {
      attempts++;
      if (window.lenis && typeof window.lenis.scrollTo === 'function') {
        try {
          window.lenis.scrollTo(p, { offset: -offset + 8, immediate: true });
        } catch (_) {}
      }
      p.scrollIntoView({ behavior: 'instant', block: 'start' });
      if (mi) {
        const miRect = mi.getBoundingClientRect();
        const pRect = p.getBoundingClientRect();
        const targetTop = mi.scrollTop + (pRect.top - miRect.top) - offset + 8;
        if (targetTop > 100) {
          mi.scrollTop = targetTop;
        }
      }
      const pRect = p.getBoundingClientRect();
      const winTarget = window.scrollY + pRect.top - offset + 8;
      if (winTarget > 100) {
        window.scrollTo(0, winTarget);
      }
      if (attempts < 15) {
        const remaining = p.getBoundingClientRect().top - offset;
        if (Math.abs(remaining) > 30) {
          setTimeout(doScroll, 80);
        }
      }
    };
    doScroll();
  }

  function scrollToAbout() {
    const a = document.getElementById('about') || document.querySelector('.home-why');
    const mi = document.querySelector('.main-inner');
    if (!a) return;

    const offset = getHeaderOffset();
    let attempts = 0;
    const doScroll = () => {
      attempts++;
      if (window.lenis && typeof window.lenis.scrollTo === 'function') {
        try {
          window.lenis.scrollTo(a, { offset: -offset + 8, immediate: true });
        } catch (_) {}
      }
      a.scrollIntoView({ behavior: 'instant', block: 'start' });
      if (mi) {
        const miRect = mi.getBoundingClientRect();
        const aRect = a.getBoundingClientRect();
        const targetTop = mi.scrollTop + (aRect.top - miRect.top) - offset + 8;
        if (targetTop > 100) {
          mi.scrollTop = targetTop;
        }
      }
      const aRect = a.getBoundingClientRect();
      const winTarget = window.scrollY + aRect.top - offset + 8;
      if (winTarget > 100) {
        window.scrollTo(0, winTarget);
      }
      if (attempts < 15) {
        const remaining = a.getBoundingClientRect().top - offset;
        if (Math.abs(remaining) > 30) {
          setTimeout(doScroll, 80);
        }
      }
    };
    doScroll();
  }

  function scrollToHome() {
    const mi = document.querySelector('.main-inner');
    if (window.lenis && typeof window.lenis.scrollTo === 'function') {
      try {
        window.lenis.scrollTo(0, { immediate: true });
      } catch (_) {}
    }
    if (mi) mi.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  // Check if entering page after shutter transition
  function checkEntranceShutter() {
    const root = document.documentElement;
    const shouldOpen = sessionStorage.getItem('playShutterOpen') === 'true';
    const hash = window.location.hash;

    if (hash === '#services' || hash === '#portfolio' || hash === '#about') {
      const loader = document.querySelector('.loading');
      if (loader) {
        loader.style.display = 'none';
        loader.classList.add('loaded');
      }

      if (hash === '#services') {
        scrollToServices();
        updateActiveNav('services');
      } else if (hash === '#portfolio') {
        scrollToPortfolio();
        updateActiveNav('portfolio');
      } else if (hash === '#about') {
        scrollToAbout();
        updateActiveNav('about');
      }
    }

    if (shouldOpen) {
      sessionStorage.removeItem('playShutterOpen');
      setShutterPercent(50);
      const loader = document.querySelector('.loading');
      if (loader) {
        loader.style.display = 'none';
        loader.classList.add('loaded');
      }

      if (hash === '#services') {
        scrollToServices();
      } else if (hash === '#portfolio') {
        scrollToPortfolio();
      } else if (hash === '#about') {
        scrollToAbout();
      } else {
        scrollToHome();
      }
      playShutterOpen();
    } else {
      setShutterPercent(0);
    }
  }

  window.addEventListener('hashchange', function() {
    const hash = window.location.hash;
    if (hash === '#services') {
      scrollToServices();
      updateActiveNav('services');
    } else if (hash === '#portfolio') {
      scrollToPortfolio();
      updateActiveNav('portfolio');
    } else if (hash === '#about') {
      scrollToAbout();
      updateActiveNav('about');
    } else if (hash === '#home' || !hash) {
      scrollToHome();
      updateActiveNav('home');
    }
  });

  window.addEventListener('load', function() {
    const hash = window.location.hash;
    if (hash === '#services') {
      setTimeout(scrollToServices, 100);
      setTimeout(scrollToServices, 350);
      setTimeout(scrollToServices, 800);
      setTimeout(scrollToServices, 1500);
      updateActiveNav('services');
    } else if (hash === '#portfolio') {
      setTimeout(scrollToPortfolio, 100);
      setTimeout(scrollToPortfolio, 350);
      setTimeout(scrollToPortfolio, 800);
      setTimeout(scrollToPortfolio, 1500);
      updateActiveNav('portfolio');
    } else if (hash === '#about') {
      setTimeout(scrollToAbout, 100);
      setTimeout(scrollToAbout, 350);
      setTimeout(scrollToAbout, 800);
      setTimeout(scrollToAbout, 1500);
      updateActiveNav('about');
    }
  });

  function initNav() {
    checkEntranceShutter();

    const menu = document.querySelector('.header-menu');
    if (menu) {
      // Ensure all sections are completely visible without hidden attributes
      menu.querySelectorAll('.header-menu-item-wrap').forEach(wrap => {
        wrap.removeAttribute('hidden');
        wrap.style.display = '';
      });
    }

    // Services Shutter Transition Handler
    function handleServicesClick(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      closeMobileMenuIfOpen();

      const s = document.getElementById('services') || document.querySelector('.home-problem-wrap') || document.querySelector('.home-problem');
      if (s) {
        playShutterTransition(() => {
          scrollToServices();
          if (history.pushState) {
            history.pushState(null, null, '#services');
          }
          updateActiveNav('services');
        });
      } else {
        // If on another page like contact-us.html
        sessionStorage.setItem('playShutterOpen', 'true');
        playShutterClose(() => {
          window.location.href = 'index.html#services';
        });
      }
    }

    // Portfolio Shutter Transition Handler
    function handlePortfolioClick(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      closeMobileMenuIfOpen();

      const pWrap = document.querySelector('.di-portfolio-wrap') || document.getElementById('portfolio');
      if (pWrap) {
        playShutterTransition(() => {
          scrollToPortfolio();
          if (history.pushState) {
            history.pushState(null, null, '#portfolio');
          }
          updateActiveNav('portfolio');
        });
      } else {
        // If on another page like contact-us.html
        sessionStorage.setItem('playShutterOpen', 'true');
        playShutterClose(() => {
          window.location.href = 'index.html#portfolio';
        });
      }
    }

    // Home Shutter Transition Handler
    function handleHomeClick(e) {
      const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || !window.location.pathname.includes('.html');
      if (isIndex) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        closeMobileMenuIfOpen();
        playShutterTransition(() => {
          scrollToHome();
          if (history.pushState) {
            history.pushState(null, null, 'index.html');
          }
          updateActiveNav('home');
        });
      } else {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        closeMobileMenuIfOpen();
        sessionStorage.setItem('playShutterOpen', 'true');
        playShutterClose(() => {
          window.location.href = 'index.html';
        });
      }
    }

    // About Us Shutter Transition Handler
    function handleAboutClick(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      closeMobileMenuIfOpen();

      const a = document.getElementById('about') || document.querySelector('.home-why');
      if (a) {
        playShutterTransition(() => {
          scrollToAbout();
          if (history.pushState) {
            history.pushState(null, null, '#about');
          }
          updateActiveNav('about');
        });
      } else {
        sessionStorage.setItem('playShutterOpen', 'true');
        playShutterClose(() => {
          window.location.href = 'index.html#about';
        });
      }
    }

    // Contact Us Navigation with Shutter Transition
    function handleContactClick(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      closeMobileMenuIfOpen();
      const isContactPage = window.location.pathname.endsWith('contact-us.html') || window.location.pathname.endsWith('contact-us');
      if (isContactPage) return;
      sessionStorage.setItem('playShutterOpen', 'true');
      playShutterClose(() => {
        window.location.href = 'contact-us.html';
      });
    }

    // Bind services triggers
    const serviceLinks = document.querySelectorAll('#nav-services-link, a[href="#services"], a[href="index.html#services"], a[href$="#services"]');
    serviceLinks.forEach(link => {
      link.setAttribute('data-barba-prevent', '');
      link.addEventListener('click', handleServicesClick);
    });

    // Bind portfolio triggers
    const portfolioLinks = document.querySelectorAll('#nav-portfolio-link, a[href="#portfolio"], a[href="index.html#portfolio"], a[href$="#portfolio"]');
    portfolioLinks.forEach(link => {
      link.setAttribute('data-barba-prevent', '');
      link.addEventListener('click', handlePortfolioClick);
    });

    // Bind home triggers
    const homeLinks = document.querySelectorAll('#nav-home-link, a[href="#home"], a[href="index.html#home"], a[href="index.html"]');
    homeLinks.forEach(link => {
      if (!link.classList.contains('header-logo-item') && !link.closest('.footer-logo')) {
        link.setAttribute('data-barba-prevent', '');
        link.addEventListener('click', handleHomeClick);
      }
    });

    // Bind about triggers
    const aboutLinks = document.querySelectorAll('#nav-about-link, a[href="#about"], a[href="index.html#about"], a[href$="#about"]');
    aboutLinks.forEach(link => {
      link.setAttribute('data-barba-prevent', '');
      link.addEventListener('click', handleAboutClick);
    });

    // Bind contact triggers
    const contactLinks = document.querySelectorAll('#nav-contact-link, #nav-contact-mobile-link, a[href="contact-us.html"], a[href="/contact-us"], [data-open-contact="true"]');
    contactLinks.forEach(link => {
      link.setAttribute('data-barba-prevent', '');
      link.addEventListener('click', handleContactClick);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();
