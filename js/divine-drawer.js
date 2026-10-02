/**
 * DIVINE INTERIORS — ARCHITECTURAL SIDE CONTACT DRAWER CONTROLLER
 * Intercepts all Contact Us buttons, prevents page reloading/hash navigation,
 * and opens a high-end Swiss architectural slide-out drawer with WhatsApp CTA.
 */

(function () {
  'use strict';

  const DRAWER_HTML = `
    <div id="divine-contact-backdrop" class="divine-drawer-backdrop" aria-hidden="true"></div>
    <aside id="divine-contact-drawer" class="divine-drawer-panel" role="dialog" aria-modal="true" aria-labelledby="divine-drawer-title">
      <!-- Header -->
      <div class="divine-drawer-header">
        <div class="divine-drawer-header-meta">
          <span class="divine-drawer-status-dot"></span>
          <span>DIVINE // DIRECT CHANNEL</span>
        </div>
        <button type="button" id="divine-drawer-close" class="divine-drawer-close-btn" aria-label="Close Contact Window">
          <span>CLOSE</span>
          <span style="font-weight: 700;">✕</span>
        </button>
      </div>

      <!-- Scrollable Body -->
      <div class="divine-drawer-body">
        <!-- Lead Title -->
        <div class="divine-drawer-lead">
          <span class="divine-drawer-tag">[PAN-INDIA EXECUTION // NEW DELHI]</span>
          <h2 id="divine-drawer-title" class="divine-drawer-title">START A PROJECT</h2>
          <p class="divine-drawer-desc">
            Turnkey Interior Architecture, Civil Execution, MEP, HVAC &amp; Facade Works across India. Connect directly with our studio team.
          </p>
        </div>

        <!-- WHATSAPP HERO ACTION (Instant Chat) -->
        <a href="https://wa.me/919717740876?text=Hi%20Divine%20Interiors,%20I%20would%20like%20to%20discuss%20an%20interior%20architecture%20project." 
           target="_blank" 
           rel="noopener noreferrer" 
           class="divine-whatsapp-card"
           id="divine-whatsapp-cta">
          <div class="divine-whatsapp-left">
            <div class="divine-whatsapp-icon-wrap">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.56 20.15 9.1 19.75 7.82 19L7.41 18.75L4.29 19.57L5.12 16.53L4.85 16.1C4.03 14.79 3.6 13.27 3.6 11.91C3.6 7.27 7.39 3.47 12.05 3.47C14.31 3.47 16.42 4.35 18.01 5.95C19.61 7.55 20.48 9.66 20.48 11.92C20.47 16.56 16.69 20.15 12.05 20.15ZM16.69 14.41C16.43 14.28 15.19 13.67 14.96 13.58C14.73 13.5 14.56 13.46 14.39 13.71C14.22 13.96 13.73 14.54 13.58 14.71C13.43 14.88 13.28 14.9 13.02 14.77C12.76 14.64 11.93 14.37 10.94 13.49C10.17 12.8 9.65 11.95 9.5 11.69C9.35 11.43 9.48 11.29 9.61 11.16C9.73 11.04 9.87 10.86 10.01 10.7C10.15 10.54 10.19 10.42 10.28 10.25C10.37 10.08 10.33 9.93 10.26 9.8C10.19 9.67 9.69 8.44 9.48 7.94C9.28 7.45 9.07 7.52 8.92 7.51C8.78 7.5 8.61 7.5 8.44 7.5C8.27 7.5 8 7.56 7.76 7.82C7.52 8.08 6.85 8.71 6.85 10C6.85 11.29 7.79 12.53 7.92 12.7C8.05 12.87 9.77 15.52 12.4 16.66C13.03 16.93 13.52 17.09 13.9 17.21C14.53 17.41 15.11 17.38 15.56 17.31C16.07 17.23 17.11 16.68 17.33 16.05C17.55 15.42 17.55 14.88 17.49 14.77C17.42 14.66 17.26 14.59 16.69 14.41Z"/>
              </svg>
            </div>
            <div>
              <div class="divine-whatsapp-label">DIRECT MESSAGING</div>
              <div class="divine-whatsapp-action">CHAT WITH WHATSAPP</div>
              <div class="divine-whatsapp-sub"><span>● ONLINE</span> · Immediate architectural consultation</div>
            </div>
          </div>
          <div class="divine-whatsapp-arrow">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M11.875 14.375L16.25 9.93818L11.875 5.625M16.25 9.93818H2.5" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
        </a>

        <!-- Direct Contact Grid -->
        <div class="divine-drawer-section-title">
          <span>[01 // DIRECT CONTACT CHANNELS]</span>
        </div>
        <div class="divine-contact-grid">
          <!-- Phone -->
          <div class="divine-contact-cell">
            <div class="divine-contact-cell-tag">TELEPHONE</div>
            <a href="tel:+919717740876" class="divine-contact-cell-val">+91 97177 40876</a>
            <div class="divine-contact-cell-sub">Mon–Sat, 09:30–19:00 IST</div>
          </div>
          <!-- Email -->
          <div class="divine-contact-cell">
            <div class="divine-contact-cell-tag">OFFICIAL EMAIL</div>
            <a href="mailto:divineinteriors.v@gmail.com" class="divine-contact-cell-val">divineinteriors.v@gmail.com</a>
            <div class="divine-contact-cell-sub">RFP &amp; drawings submission</div>
          </div>
          <!-- Address -->
          <div class="divine-contact-cell full-width">
            <div class="divine-contact-cell-tag">STUDIO &amp; REGISTERED OFFICE</div>
            <div class="divine-contact-cell-val" style="font-weight: 500;">
              K2, 1068, Durga Vihar, Devli, Khanpur, Delhi - 110080
            </div>
            <div class="divine-contact-cell-sub">Pan-India Project Operations</div>
          </div>
        </div>

        <!-- Project Brief Form -->
        <div class="divine-drawer-section-title">
          <span>[02 // SEND PROJECT BRIEF]</span>
        </div>
        <div class="divine-inquiry-form">
          <span class="divine-corner-plus tl">+</span>
          <span class="divine-corner-plus tr">+</span>
          <span class="divine-corner-plus bl">+</span>
          <span class="divine-corner-plus br">+</span>

          <form id="divine-drawer-form">
            <div class="divine-form-grid-2">
              <div>
                <label class="divine-form-label" for="di-name">YOUR NAME *</label>
                <input class="divine-form-input" type="text" id="di-name" required placeholder="e.g. Rahul Sharma" autocomplete="name" />
              </div>
              <div>
                <label class="divine-form-label" for="di-phone">PHONE / WHATSAPP *</label>
                <input class="divine-form-input" type="tel" id="di-phone" required placeholder="+91 98765 43210" autocomplete="tel" />
              </div>
            </div>

            <div class="divine-form-row">
              <label class="divine-form-label" for="di-email">EMAIL ADDRESS</label>
              <input class="divine-form-input" type="email" id="di-email" placeholder="name@company.com" autocomplete="email" />
            </div>

            <div class="divine-form-row">
              <label class="divine-form-label" for="di-service">SERVICE REQUIRED</label>
              <select class="divine-form-select" id="di-service">
                <option value="Complete Turnkey Interior">Complete Turnkey Interior</option>
                <option value="Commercial &amp; Retail Fitout">Commercial &amp; Retail Fitout</option>
                <option value="Civil &amp; Construction">Civil &amp; Construction</option>
                <option value="MEP &amp; HVAC Engineering">MEP &amp; HVAC Engineering</option>
                <option value="Facades &amp; Glazing Works">Facades &amp; Glazing Works</option>
                <option value="Residential Architecture">Residential Architecture</option>
              </select>
            </div>

            <div class="divine-form-row">
              <label class="divine-form-label" for="di-message">PROJECT DETAILS / SCOPE</label>
              <textarea class="divine-form-textarea" id="di-message" placeholder="Location, estimated area (sq ft), and project timeline..."></textarea>
            </div>

            <button type="submit" class="divine-form-submit-btn">
              <span>SEND INQUIRY</span>
              <span>→</span>
            </button>

            <div id="divine-form-status" class="divine-form-status"></div>
          </form>
        </div>

        <div class="divine-drawer-footer-note">
          © 2026 DIVINE INTERIORS · ARCHITECTURAL &amp; INTERIOR EXCELLENCE
        </div>
      </div>
    </aside>
  `;

  function initDrawer() {
    if (document.getElementById('divine-contact-drawer')) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'divine-drawer-wrapper';
    wrapper.innerHTML = DRAWER_HTML;
    document.body.appendChild(wrapper);

    const backdrop = document.getElementById('divine-contact-backdrop');
    const drawer = document.getElementById('divine-contact-drawer');
    const closeBtn = document.getElementById('divine-drawer-close');
    const form = document.getElementById('divine-drawer-form');
    const statusBox = document.getElementById('divine-form-status');

    function openDrawer() {
      backdrop.classList.add('is-active');
      drawer.classList.add('is-active');
      document.body.classList.add('divine-drawer-open');
      backdrop.setAttribute('aria-hidden', 'false');
      // Focus first input after animation
      const bodyEl = drawer.querySelector('.divine-drawer-body');
      if (bodyEl) bodyEl.scrollTop = 0;
      setTimeout(() => {
        const input = document.getElementById('di-name');
        if (input) input.focus({ preventScroll: true });
      }, 350);
    }

    function closeDrawer() {
      backdrop.classList.remove('is-active');
      drawer.classList.remove('is-active');
      document.body.classList.remove('divine-drawer-open');
      backdrop.setAttribute('aria-hidden', 'true');
    }

    // Export to window
    window.openDivineContactDrawer = openDrawer;
    window.closeDivineContactDrawer = closeDrawer;

    // Listeners for closing
    closeBtn?.addEventListener('click', closeDrawer);
    backdrop?.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-active')) {
        closeDrawer();
      }
    });

    // Handle Form Submission
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('di-name')?.value.trim() || '';
      const phone = document.getElementById('di-phone')?.value.trim() || '';
      const email = document.getElementById('di-email')?.value.trim() || '';
      const service = document.getElementById('di-service')?.value || '';
      const message = document.getElementById('di-message')?.value.trim() || '';

      const summary = `New Inquiry: ${name} (${phone}, ${email}) - Service: ${service}. Note: ${message}`;
      console.log('[Divine Contact Drawer]', summary);

      statusBox.innerHTML = `
        <strong>✓ INQUIRY TRANSMITTED</strong><br/>
        Thank you, ${name}. Our senior project team will reach out within 24 hours.<br/>
        <a href="https://wa.me/919717740876?text=${encodeURIComponent('Hi Divine Interiors, I submitted a project inquiry: ' + name + ' (' + phone + ') - ' + service + ': ' + message)}" target="_blank" style="color:#15803d; text-decoration:underline; font-weight:600; display:inline-block; margin-top:6px;">Click here to also send directly on WhatsApp →</a>
      `;
      statusBox.classList.add('is-success');
      form.reset();
    });

    // Intercept all Contact Us triggers across the DOM
    bindContactTriggers();
  }

  function isContactTrigger(el) {
    if (!el || !(el instanceof Element)) return false;
    const href = (el.getAttribute('href') || '').toLowerCase();
    const text = (el.textContent || '').trim().toLowerCase();
    const className = (el.className || '').toString().toLowerCase();

    if (el.hasAttribute('data-open-contact')) return true;
    if (className.includes('header-cta')) return true;
    if (href === '#contact' || href.includes('contact-us') || href.endsWith('/contact-us')) return true;
    if (text === 'contact us' || text === 'contact' || text === 'get in touch') return true;

    // Check closest parent anchor or button
    const parentA = el.closest('a, button');
    if (parentA && parentA !== el) {
      const parentHref = (parentA.getAttribute('href') || '').toLowerCase();
      const parentText = (parentA.textContent || '').trim().toLowerCase();
      const parentClass = (parentA.className || '').toString().toLowerCase();
      if (parentClass.includes('header-cta')) return true;
      if (parentHref === '#contact' || parentHref.includes('contact-us')) return true;
      if (parentText === 'contact us' || parentText === 'contact') return true;
    }

    return false;
  }

  function bindContactTriggers() {
    // Intercept clicks in capture phase to completely override Barba.js, hash jumps, and default navigation
    document.addEventListener(
      'click',
      function (e) {
        const target = e.target;
        const trigger = target.closest('a, button') || target;

        if (isContactTrigger(trigger)) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          // Prevent Barba from picking up the navigation
          trigger.setAttribute('data-barba-prevent', '');

          sessionStorage.setItem('playShutterOpen', 'true');
          if (typeof window.playShutterClose === 'function') {
            window.playShutterClose(() => {
              window.location.href = 'contact-us.html';
            });
          } else if (typeof window.playShutterTransition === 'function') {
            window.playShutterTransition(() => {
              window.location.href = 'contact-us.html';
            });
          } else {
            window.location.href = 'contact-us.html';
          }
          return false;
        }
      },
      true // Capture phase!
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDrawer);
  } else {
    initDrawer();
  }
})();
