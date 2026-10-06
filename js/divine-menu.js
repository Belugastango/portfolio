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
    if (typeof window.closeDivineMobileNav === 'function') {
      window.closeDivineMobileNav();
    }
    const menuBtn = document.querySelector('.header-menu-btn');
    if (menuBtn && menuBtn.classList.contains('active')) {
      menuBtn.classList.remove('active');
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

  function scrollToPartnership() {
    const p = document.getElementById('partnership') || document.querySelector('.simta-partnership');
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
      p.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

    if (hash === '#services' || hash === '#portfolio' || hash === '#about' || hash === '#partnership') {
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
      } else if (hash === '#partnership') {
        scrollToPartnership();
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
      } else if (hash === '#partnership') {
        scrollToPartnership();
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
    } else if (hash === '#partnership') {
      scrollToPartnership();
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
    } else if (hash === '#partnership') {
      setTimeout(scrollToPartnership, 100);
      setTimeout(scrollToPartnership, 350);
      setTimeout(scrollToPartnership, 800);
      setTimeout(scrollToPartnership, 1500);
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

    // Partnership Shutter Transition Handler
    function handlePartnershipClick(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      closeMobileMenuIfOpen();

      const p = document.getElementById('partnership') || document.querySelector('.simta-partnership');
      if (p) {
        playShutterTransition(() => {
          scrollToPartnership();
          if (history.pushState) {
            history.pushState(null, null, '#partnership');
          }
        });
      } else {
        sessionStorage.setItem('playShutterOpen', 'true');
        playShutterClose(() => {
          window.location.href = 'index.html#partnership';
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

    // Bind partnership triggers
    const partnershipLinks = document.querySelectorAll('a[href="#partnership"], a[href="index.html#partnership"], a[href$="#partnership"]');
    partnershipLinks.forEach(link => {
      link.setAttribute('data-barba-prevent', '');
      link.addEventListener('click', handlePartnershipClick);
    });

    // Bind contact triggers
    const contactLinks = document.querySelectorAll('#nav-contact-link, #nav-contact-mobile-link, a[href="contact-us.html"], a[href="/contact-us"], [data-open-contact="true"]');
    contactLinks.forEach(link => {
      link.setAttribute('data-barba-prevent', '');
      link.addEventListener('click', handleContactClick);
    });

    // Initialize Mobile Navigation Drawer & Hamburger Trigger
    initMobileNav({
      handleHomeClick,
      handleServicesClick,
      handlePortfolioClick,
      handlePartnershipClick,
      handleAboutClick,
      handleContactClick
    });
  }

  const MOBILE_NAV_HTML = `
    <div id="divine-mobile-nav" class="divine-mobile-nav" aria-hidden="true">
      <div class="divine-mobile-nav-backdrop" id="divine-mobile-backdrop"></div>
      <div class="divine-mobile-nav-panel" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
        <div class="divine-mobile-nav-top">
          <div class="divine-mobile-nav-status">
            <span class="divine-mobile-nav-dot"></span>
            <span>STUDIO DIRECT // NEW DELHI</span>
          </div>
          <button type="button" class="divine-mobile-nav-close" id="divine-mobile-close" aria-label="Close Navigation">
            <span>CLOSE</span>
            <span style="font-weight: 700;">✕</span>
          </button>
        </div>

        <nav class="divine-mobile-nav-list">
          <a href="#home" class="divine-mobile-nav-link" data-mobile-target="home">
            <span class="divine-mobile-nav-num">[01]</span>
            <span class="divine-mobile-nav-txt">HOME</span>
            <span class="divine-mobile-nav-arr">→</span>
          </a>
          <a href="#services" class="divine-mobile-nav-link" data-mobile-target="services">
            <span class="divine-mobile-nav-num">[02]</span>
            <span class="divine-mobile-nav-txt">SERVICES</span>
            <span class="divine-mobile-nav-arr">→</span>
          </a>
          <a href="#portfolio" class="divine-mobile-nav-link" data-mobile-target="portfolio">
            <span class="divine-mobile-nav-num">[03]</span>
            <span class="divine-mobile-nav-txt">PORTFOLIO</span>
            <span class="divine-mobile-nav-arr">→</span>
          </a>
          <a href="#partnership" class="divine-mobile-nav-link" data-mobile-target="partnership">
            <span class="divine-mobile-nav-num">[04]</span>
            <span class="divine-mobile-nav-txt">SIMTA ASTRIX</span>
            <span class="divine-mobile-nav-badge">PARTNER</span>
            <span class="divine-mobile-nav-arr">→</span>
          </a>
          <a href="#about" class="divine-mobile-nav-link" data-mobile-target="about">
            <span class="divine-mobile-nav-num">[05]</span>
            <span class="divine-mobile-nav-txt">ABOUT US</span>
            <span class="divine-mobile-nav-arr">→</span>
          </a>
          <a href="contact-us.html" class="divine-mobile-nav-link" data-mobile-target="contact">
            <span class="divine-mobile-nav-num">[06]</span>
            <span class="divine-mobile-nav-txt">CONTACT US</span>
            <span class="divine-mobile-nav-arr">→</span>
          </a>
        </nav>

        <div class="divine-mobile-nav-actions">
          <a href="tel:+919717740876" class="divine-mobile-action-btn action-call">
            <span class="action-btn-tag">CALL STUDIO</span>
            <span class="action-btn-val">+91 97177 40876</span>
          </a>
          <a href="https://wa.me/919717740876?text=Hi%20Divine%20Interiors,%20I%20would%20like%20to%20discuss%20an%20interior%20architecture%20project." target="_blank" rel="noopener noreferrer" class="divine-mobile-action-btn action-wa">
            <span class="action-btn-tag">WHATSAPP</span>
            <span class="action-btn-val">Instant Chat ↗</span>
          </a>
        </div>

        <div class="divine-mobile-nav-footer">
          <span>PAN-INDIA FIT-OUTS</span>
          <span>[28.5080° N, 77.2280° E]</span>
        </div>
      </div>
    </div>
  `;

  function initMobileNav(handlers) {
    if (!document.getElementById('divine-mobile-nav')) {
      const container = document.createElement('div');
      container.innerHTML = MOBILE_NAV_HTML.trim();
      document.body.appendChild(container.firstElementChild);
    }

    const mobileNav = document.getElementById('divine-mobile-nav');
    const menuBtn = document.querySelector('.header-menu-btn');
    const closeBtn = document.getElementById('divine-mobile-close');
    const backdrop = document.getElementById('divine-mobile-backdrop');

    function openNav() {
      if (!mobileNav) return;
      mobileNav.classList.add('is-open');
      mobileNav.setAttribute('aria-hidden', 'false');
      if (menuBtn) menuBtn.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      if (!mobileNav) return;
      mobileNav.classList.remove('is-open');
      mobileNav.setAttribute('aria-hidden', 'true');
      if (menuBtn) menuBtn.classList.remove('active');
      document.body.style.overflow = '';
    }

    function toggleNav(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (mobileNav && mobileNav.classList.contains('is-open')) {
        closeNav();
      } else {
        openNav();
      }
    }

    if (menuBtn) {
      menuBtn.addEventListener('click', toggleNav);
    }
    if (closeBtn) closeBtn.addEventListener('click', closeNav);
    if (backdrop) backdrop.addEventListener('click', closeNav);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('is-open')) {
        closeNav();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 991 && mobileNav && mobileNav.classList.contains('is-open')) {
        closeNav();
      }
    });

    const links = mobileNav.querySelectorAll('[data-mobile-target]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeNav();

        const target = link.getAttribute('data-mobile-target');
        if (target === 'home' && handlers && handlers.handleHomeClick) handlers.handleHomeClick();
        else if (target === 'services' && handlers && handlers.handleServicesClick) handlers.handleServicesClick();
        else if (target === 'portfolio' && handlers && handlers.handlePortfolioClick) handlers.handlePortfolioClick();
        else if (target === 'partnership' && handlers && handlers.handlePartnershipClick) handlers.handlePartnershipClick();
        else if (target === 'about' && handlers && handlers.handleAboutClick) handlers.handleAboutClick();
        else if (target === 'contact' && handlers && handlers.handleContactClick) handlers.handleContactClick();
      });
    });

    window.openDivineMobileNav = openNav;
    window.closeDivineMobileNav = closeNav;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();
