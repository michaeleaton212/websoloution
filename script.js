// script.js - CSS Scroll Snap + optional mouse-wheel section snapping
document.addEventListener('DOMContentLoaded', function () {
  // Mobile keyboard: expose keyboard height to CSS via VisualViewport.
  // This lets us reserve bottom space so the contact form doesn't get covered or jump.
  (function initKeyboardViewportVars(){
    if (!window.visualViewport) return;

    const vv = window.visualViewport;

    const setKbVar = () => {
      // Approximate keyboard height (works well for iOS Safari/Chrome Android)
      const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      document.documentElement.style.setProperty('--kb', kb.toFixed(0) + 'px');
    };

    vv.addEventListener('resize', setKbVar, { passive: true });
    vv.addEventListener('scroll', setKbVar, { passive: true });
    window.addEventListener('orientationchange', setKbVar, { passive: true });
    setKbVar();
  })();

  // Hide the persistent swipe hint when the contact form is on screen
  // (prevents it covering the send button, especially on mobile)
  (function initSwipeHintVisibilityBySection(){
    const swipeHint = document.getElementById('swipeHint');
    const contactSection = document.getElementById('contact-us');
    if (!swipeHint || !contactSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target !== contactSection) return;
        // If contact is meaningfully visible, hide the hint
        const shouldHide = entry.isIntersecting && entry.intersectionRatio >= 0.35;
        document.body.classList.toggle('hide-swipehint', shouldHide);
      });
    }, {
      threshold: [0, 0.2, 0.35, 0.6]
    });

    observer.observe(contactSection);
  })();

  // Disable scroll-snap while typing (helps iOS Safari / Android Chrome keyboard behavior)
  (function initTypingMode(){
    let blurTimer;
    document.addEventListener('focusin', (e) => {
      const t = e.target;
      if (!t || !(t instanceof HTMLElement)) return;
      if (!t.closest || !t.closest('#contact-form')) return;
      document.body.classList.add('is-typing');
      document.documentElement.classList.add('is-typing');

      // Ensure the focused control is visible (avoid it being hidden behind keyboard)
      // Use a small delay so iOS has time to open the keyboard.
      window.setTimeout(() => {
        try {
          t.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
        } catch (_) {}
      }, 60);
      if (blurTimer) window.clearTimeout(blurTimer);
    });

    document.addEventListener('focusout', (e) => {
      const t = e.target;
      if (!t || !(t instanceof HTMLElement)) return;
      if (!t.closest || !t.closest('#contact-form')) return;
      if (blurTimer) window.clearTimeout(blurTimer);
      blurTimer = window.setTimeout(() => {
        // Only remove if nothing inside the form is focused anymore
        const form = document.getElementById('contact-form');
        const active = document.activeElement;
        if (form && active && form.contains(active)) return;
        document.body.classList.remove('is-typing');
        document.documentElement.classList.remove('is-typing');
      }, 80);
    });
  })();

  // ===== Scroll-reveal animations (Services cards) =====
  (function initServicesCardReveal(){
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cards = Array.from(document.querySelectorAll('.services-feature-card'));
    if (cards.length === 0) return;

    // Mark as reveal-enabled (CSS keeps no-JS safe)
    cards.forEach(c => c.classList.add('reveal-ready'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal-in');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.18,
      rootMargin: '0px 0px -10% 0px'
    });

    // Stagger a tiny bit for a premium feel
    cards.forEach((card, i) => {
      setTimeout(() => observer.observe(card), i * 60);
    });
  })();

  // ===== Scroll-reveal animations (Sections) =====
  (function initSectionReveal(){
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const sections = Array.from(document.querySelectorAll('main.page > section'));
    if (sections.length === 0) return;

    // Activate reveal styles only when JS is available
    sections.forEach(sec => sec.classList.add('reveal-ready'));

    // Keep hero visible immediately (first paint should not look "missing")
    const hero = document.getElementById('heroStage');
    if (hero) hero.classList.add('reveal-in');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal-in');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.18,
      rootMargin: '0px 0px -12% 0px'
    });

    sections.forEach(sec => {
      if (sec === hero) return;
      observer.observe(sec);
    });
  })();

  // Animierte Scrollbar: body bekommt beim Scrollen kurz die Klasse 'scrolling'
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    document.body.classList.add('scrolling');
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      document.body.classList.remove('scrolling');
    }, 400);
  });

  // ===== Service Data =====
  const serviceData = [
    {
      name: "Websites, die konvertieren",
      sub: "Hochleistungs-Landingpages & Corporate Sites",
      badge1: "Kernleistung",
      badge2: "Webdesign",
      stat1: { key: "LIEFERZEIT", val: "7-14 Tage" },
      stat2: { key: "LEISTUNGSZIEL", val: "90+ Lighthouse" },
      stat3: { key: "KONVERSIONSFOKUS", val: "CRO-bereit" },
      chips: ["ENTHALTEN", "Responsives UI", "Analytics-Setup", "SEO-Grundlagen"],
      preview: { title: "Case-Vorschau", sub: "B2B landing page: +28% qualified leads in 30 days (placeholder)" }
    },
    {
      name: "Markenidentität & Design",
      sub: "Logo, Styleguide & visuelle Konzepte",
      badge1: "Kreativ",
      badge2: "Branding",
      stat1: { key: "LIEFERZEIT", val: "5-10 Tage" },
      stat2: { key: "REVISIONEN", val: "3 Runden" },
      stat3: { key: "DATEIFORMATE", val: "Alle gängigen" },
      chips: ["ENTHALTEN", "Logo-Design", "Farbpalette", "Typografie", "Brand Guide"],
      preview: { title: "Case-Vorschau", sub: "Startup rebrand: 40% mehr Markenbekanntheit (placeholder)" }
    },
    {
      name: "Suchmaschinenoptimierung",
      sub: "Technisches & On-Page SEO",
      badge1: "Performance",
      badge2: "SEO",
      stat1: { key: "LIEFERZEIT", val: "Fortlaufend" },
      stat2: { key: "RANKING-BOOST", val: "Top 10 Ziel" },
      stat3: { key: "REPORTING", val: "Monatlich" },
      chips: ["ENTHALTEN", "Keyword-Recherche", "On-Page SEO", "Technical Audit", "Link Building"],
      preview: { title: "Case-Vorschau", sub: "E-Commerce: 150% organischer Traffic in 6 Monaten (placeholder)" }
    },
    {
      name: "E-Commerce Lösungen",
      sub: "Shopify, WooCommerce & Custom Shops",
      badge1: "Verkauf",
      badge2: "E-Commerce",
      stat1: { key: "LIEFERZEIT", val: "14-30 Tage" },
      stat2: { key: "PLATTFORMEN", val: "Alle gängigen" },
      stat3: { key: "CONVERSION", val: "Optimiert" },
      chips: ["ENTHALTEN", "Shop-Setup", "Payment Integration", "Produkt-Upload", "Mobile-optimiert"],
      preview: { title: "Case-Vorschau", sub: "Fashion Store: €50k Umsatz im ersten Monat (placeholder)" }
    },
    {
      name: "Website-Wartung & Support",
      sub: "Updates, Backups & technischer Support",
      badge1: "Service",
      badge2: "Wartung",
      stat1: { key: "REAKTIONSZEIT", val: "< 24h" },
      stat2: { key: "VERFÜGBARKEIT", val: "99.9% SLA" },
      stat3: { key: "BACKUPS", val: "Täglich" },
      chips: ["ENTHALTEN", "Updates", "Security Monitoring", "Performance Check", "24/7 Support"],
      preview: { title: "Case-Vorschau", sub: "Enterprise Client: 100% Uptime über 2 Jahre (placeholder)" }
    }
  ];

  // ===== References =====
  const pricingSection = document.getElementById('pricing');

  function getFixedHeaderOffset(){
    const nav = document.querySelector('.navbar-container');
    const navH = nav ? nav.getBoundingClientRect().height : 0;
    return Math.ceil(navH + 16);
  }

  // CSS Scroll Snap is great for manual scrolling, but it can fight with
  // programmatic smooth scrolling (anchor clicks / wheel assist) and cause
  // an extra "snap" jump. We temporarily disable snap during those scrolls.
  function temporarilyDisableScrollSnap(durationMs){
    const root = document.documentElement;
    root.classList.add('snap-disabled');
    if (temporarilyDisableScrollSnap._t) window.clearTimeout(temporarilyDisableScrollSnap._t);
    temporarilyDisableScrollSnap._t = window.setTimeout(() => {
      root.classList.remove('snap-disabled');
    }, Math.max(0, durationMs || 0));
  }

  function scrollToId(targetId){
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Most sections should land below the fixed navbar.
    // Services (#pricing) should land at the real viewport top (no previous section visible).
    const headerOffset = targetId === 'pricing' ? 0 : getFixedHeaderOffset();
    const top = window.scrollY + targetElement.getBoundingClientRect().top - headerOffset;

    // Prevent snap from overriding the intended landing position.
    temporarilyDisableScrollSnap(prefersReducedMotion ? 0 : 900);
    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }

  // Mouse wheel assist: one wheel step -> next/prev section (keeps scrolling comfortable)
  // Applies mainly to classic mouse wheels (deltaMode === 1). Trackpads keep native scrolling.
  (function initMouseWheelSnapAssist(){
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let isAutoScrolling = false;
    let autoScrollTimer = 0;

    function getSections(){
      return Array.from(document.querySelectorAll('main.page > section'));
    }

    function getCurrentSection(sections){
      const y = window.scrollY + getFixedHeaderOffset() + 2;
      let current = sections[0] || null;
      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        if (sec.offsetTop <= y) current = sec;
        else break;
      }
      return current;
    }

    function sectionTopY(section){
      return window.scrollY + section.getBoundingClientRect().top;
    }

    function findTargetIndex(list, dir, headerOffset){
      const y = window.scrollY + (typeof headerOffset === 'number' ? headerOffset : getFixedHeaderOffset()) + 2;

      if (dir > 0) {
        const idx = list.findIndex(sec => sec.offsetTop > y);
        return idx === -1 ? (list.length - 1) : idx;
      }

      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].offsetTop < (y - 10)) return i;
      }
      return 0;
    }

    function scrollToSection(section){
      const headerOffset = section.id === 'pricing' ? 0 : getFixedHeaderOffset();
      const top = sectionTopY(section) - headerOffset;

      // Prevent snap from adding a second jump after the smooth scroll.
      temporarilyDisableScrollSnap(prefersReducedMotion ? 0 : 900);
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }

    window.addEventListener('wheel', (e) => {
      // Let browser zoom gestures pass through
      if (e.ctrlKey) return;

      // Disable while typing (mobile keyboard) or inside form fields
      if (document.body.classList.contains('is-typing') || document.documentElement.classList.contains('is-typing')) return;
      const targetEl = (e.target instanceof Element) ? e.target : null;
      const interactiveEl = targetEl ? targetEl.closest('input, textarea, select, [contenteditable="true"]') : null;
      if (interactiveEl) {
        // If the control is focused (user is typing) or it can scroll internally,
        // don't hijack the wheel.
        const isFocused = document.activeElement === interactiveEl;
        const canScrollInternally = (
          interactiveEl instanceof HTMLElement &&
          interactiveEl.scrollHeight > (interactiveEl.clientHeight + 2)
        );
        if (isFocused || canScrollInternally) return;
      }

      // Only activate for mouse wheels (line-based) or very large deltas
      const isMouseWheel = e.deltaMode === 1;
      const isLargeDelta = Math.abs(e.deltaY) >= 80;
      if (!isMouseWheel && !isLargeDelta) return;

      const sections = getSections();
      if (sections.length < 2) return;

      const currentSection = getCurrentSection(sections);
      const currentHeaderOffset = (currentSection && currentSection.id === 'pricing') ? 0 : getFixedHeaderOffset();
      if (currentSection) {
        // If a section is taller than the viewport, allow normal scrolling inside it.
        const tooTall = currentSection.scrollHeight > (window.innerHeight + 24);
        const isImprintArea = currentSection.id === 'imprint';

        // Never force snap-jumps in the imprint area.
        // Contact stays enabled so one mouse-wheel step can move to the next section.
        if (isImprintArea) return;

        // If a section is taller than the viewport (common when padding/fonts vary),
        // we still want the "one wheel step -> next section" behavior when the
        // section is currently aligned at the top (i.e. user is at the start).
        // Otherwise, let the browser do normal scrolling within the tall section.
        if (tooTall) {
          const rect = currentSection.getBoundingClientRect();
          // A section can be considered "top aligned" in two valid states:
          // 1) Our programmatic scroll lands it just below the fixed navbar (offset).
          // 2) The initial page load at scrollY=0 where the first section starts at 0.
          const offset = getFixedHeaderOffset();
          const topAligned =
            Math.min(
              Math.abs(rect.top - offset),
              Math.abs(rect.top)
            ) <= 14;
          if (!topAligned) return;
        }
      }

      // Throttle during smooth scroll so we don't queue multiple jumps
      if (isAutoScrolling) {
        e.preventDefault();
        return;
      }

      const dir = e.deltaY > 0 ? 1 : -1;
      const idx = findTargetIndex(sections, dir, currentHeaderOffset);
      const section = sections[idx];
      if (!section) return;

      e.preventDefault();
      isAutoScrolling = true;
      scrollToSection(section);

      if (autoScrollTimer) window.clearTimeout(autoScrollTimer);
      autoScrollTimer = window.setTimeout(() => {
        isAutoScrolling = false;
      }, prefersReducedMotion ? 200 : 700);
    }, { passive: false });
  })();

  // Touch/Swipe assist (mobile): one vertical swipe -> next/prev section.
  // We do NOT block native scrolling; we only "finish" the gesture by snapping
  // to the next/previous section after the swipe ends.
  (function initTouchSwipeSnapAssist(){
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let isAutoScrolling = false;
    let autoScrollTimer = 0;

    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let pointerActive = false;

    function getSections(){
      return Array.from(document.querySelectorAll('main.page > section'));
    }

    function getCurrentSection(sections){
      const y = window.scrollY + getFixedHeaderOffset() + 2;
      let current = sections[0] || null;
      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        if (sec.offsetTop <= y) current = sec;
        else break;
      }
      return current;
    }

    function sectionTopY(section){
      return window.scrollY + section.getBoundingClientRect().top;
    }

    function findTargetIndex(list, dir, headerOffset){
      const y = window.scrollY + (typeof headerOffset === 'number' ? headerOffset : getFixedHeaderOffset()) + 2;

      if (dir > 0) {
        const idx = list.findIndex(sec => sec.offsetTop > y);
        return idx === -1 ? (list.length - 1) : idx;
      }

      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].offsetTop < (y - 10)) return i;
      }
      return 0;
    }

    function scrollToSection(section){
      const headerOffset = section.id === 'pricing' ? 0 : getFixedHeaderOffset();
      const top = sectionTopY(section) - headerOffset;
      temporarilyDisableScrollSnap(900);
      window.scrollTo({ top, behavior: 'smooth' });
    }

    function isBusyTyping(){
      return document.body.classList.contains('is-typing') || document.documentElement.classList.contains('is-typing');
    }

    function shouldIgnoreStartTarget(target){
      const targetEl = (target instanceof Element) ? target : null;
      if (!targetEl) return false;
      const interactiveEl = targetEl.closest('input, textarea, select, [contenteditable="true"]');
      if (!interactiveEl) return false;

      const isFocused = document.activeElement === interactiveEl;
      const canScrollInternally = (
        interactiveEl instanceof HTMLElement &&
        interactiveEl.scrollHeight > (interactiveEl.clientHeight + 2)
      );

      return isFocused || canScrollInternally;
    }

    function maybeSnapBySwipe(dir){
      const sections = getSections();
      if (sections.length < 2) return;

      const currentSection = getCurrentSection(sections);
      if (!currentSection) return;

      // Never force snap-jumps in the imprint area.
      if (currentSection.id === 'imprint') return;

      // If a section is taller than the viewport, allow normal scrolling inside it
      // unless it's currently aligned at the top.
      const currentHeaderOffset = (currentSection.id === 'pricing') ? 0 : getFixedHeaderOffset();
      const tooTall = currentSection.scrollHeight > (window.innerHeight + 24);
      if (tooTall) {
        const rect = currentSection.getBoundingClientRect();
        const offset = getFixedHeaderOffset();
        const topAligned = Math.min(Math.abs(rect.top - offset), Math.abs(rect.top)) <= 14;
        if (!topAligned) return;
      }

      if (isAutoScrolling) return;

      const idx = findTargetIndex(sections, dir, currentHeaderOffset);
      const section = sections[idx];
      if (!section) return;

      isAutoScrolling = true;
      scrollToSection(section);

      if (autoScrollTimer) window.clearTimeout(autoScrollTimer);
      autoScrollTimer = window.setTimeout(() => {
        isAutoScrolling = false;
      }, 800);
    }

    // Prefer Pointer Events when available (covers most modern mobile browsers)
    const supportsPointer = 'PointerEvent' in window;

    if (supportsPointer) {
      window.addEventListener('pointerdown', (e) => {
        if (!e || e.pointerType !== 'touch') return;
        if (e.ctrlKey) return;
        if (isBusyTyping()) return;
        if (shouldIgnoreStartTarget(e.target)) return;

        pointerActive = true;
        startX = e.clientX;
        startY = e.clientY;
        startTime = performance.now();
      }, { passive: true });

      window.addEventListener('pointerup', (e) => {
        if (!pointerActive) return;
        pointerActive = false;

        if (!e || e.pointerType !== 'touch') return;
        if (isBusyTyping()) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const dt = Math.max(1, performance.now() - startTime);

        // Only treat as a vertical swipe if mostly vertical and meaningful.
        if (Math.abs(dy) < 52) return;
        if (Math.abs(dy) < Math.abs(dx) * 1.35) return;

        // Avoid very slow drags (let native scroll-snap do its thing)
        const speed = Math.abs(dy) / dt; // px/ms
        if (speed < 0.18) return;

        const dir = dy < 0 ? 1 : -1; // swipe up -> scroll down
        // Let the native scroll settle for a tick, then snap to target.
        requestAnimationFrame(() => maybeSnapBySwipe(dir));
      }, { passive: true });

      window.addEventListener('pointercancel', () => {
        pointerActive = false;
      }, { passive: true });
    } else {
      // Fallback: Touch Events
      window.addEventListener('touchstart', (e) => {
        const t = e.changedTouches && e.changedTouches[0];
        if (!t) return;
        if (isBusyTyping()) return;
        if (shouldIgnoreStartTarget(e.target)) return;
        startX = t.clientX;
        startY = t.clientY;
        startTime = performance.now();
      }, { passive: true });

      window.addEventListener('touchend', (e) => {
        const t = e.changedTouches && e.changedTouches[0];
        if (!t) return;
        if (isBusyTyping()) return;

        const dx = t.clientX - startX;
        const dy = t.clientY - startY;
        const dt = Math.max(1, performance.now() - startTime);

        if (Math.abs(dy) < 52) return;
        if (Math.abs(dy) < Math.abs(dx) * 1.35) return;
        const speed = Math.abs(dy) / dt;
        if (speed < 0.18) return;

        const dir = dy < 0 ? 1 : -1;
        requestAnimationFrame(() => maybeSnapBySwipe(dir));
      }, { passive: true });
    }
  })();

  // ===== Service Navigation =====
  let currentServiceIndex = 0;
  const totalServices = serviceData.length;

  // Update service content dynamically
  function updateServiceContent(index) {
    const service = serviceData[index];
    if (!service) return;

    const productName = document.getElementById('productName');
    const productSub = document.getElementById('productSub');
    const badgeLeft = document.getElementById('badgeLeft');
    const badgeRight = document.getElementById('badgeRight');
    const serviceProgress = document.getElementById('serviceProgress');

    const stat1Key = document.getElementById('stat1Key');
    const stat1Val = document.getElementById('stat1Val');
    const stat2Key = document.getElementById('stat2Key');
    const stat2Val = document.getElementById('stat2Val');
    const stat3Key = document.getElementById('stat3Key');
    const stat3Val = document.getElementById('stat3Val');

    const chipsContainer = document.getElementById('chips');

    const previewTitle = document.getElementById('previewTitle');
    const previewSub = document.getElementById('previewSub');

    const mainCard = document.querySelector('.main-card');
    if (!mainCard) return;

    mainCard.style.transition = 'opacity 0.25s ease-in-out';
    mainCard.style.opacity = '0.6';

    setTimeout(() => {
      if (productName) productName.textContent = service.name;
      if (productSub) productSub.textContent = service.sub;
      if (badgeLeft) badgeLeft.textContent = service.badge1;
      if (badgeRight) badgeRight.textContent = service.badge2;
      if (serviceProgress) serviceProgress.textContent = `${index + 1}/${totalServices}`;

      if (stat1Key) stat1Key.textContent = service.stat1.key;
      if (stat1Val) stat1Val.textContent = service.stat1.val;
      if (stat2Key) stat2Key.textContent = service.stat2.key;
      if (stat2Val) stat2Val.textContent = service.stat2.val;
      if (stat3Key) stat3Key.textContent = service.stat3.key;
      if (stat3Val) stat3Val.textContent = service.stat3.val;

      if (chipsContainer) {
        chipsContainer.innerHTML = service.chips.map((chip, i) => {
          const className = i === 0 ? 'chip chip-strong' : 'chip';
          return `<span class="${className}">${chip}</span>`;
        }).join('');
      }

      if (previewTitle) previewTitle.textContent = service.preview.title;
      if (previewSub) previewSub.textContent = service.preview.sub;

      mainCard.style.opacity = '1';
    }, 140);
  }

  function updateAllServiceButtons(activeIndex) {
    document.querySelectorAll('.left-item').forEach(btn => {
      const industryId = Number(btn.getAttribute('data-industry'));
      if (industryId === activeIndex) btn.classList.add('is-active');
      else btn.classList.remove('is-active');
    });
  }

  function scrollToService(index) {
    if (index < 0 || index >= totalServices) return;
    currentServiceIndex = index;
    updateAllServiceButtons(index);
    updateServiceContent(index);
  }

  // Bind service navigation buttons
  document.querySelectorAll('.left-item').forEach(btn => {
    btn.addEventListener('click', function () {
      const industryId = Number(this.getAttribute('data-industry'));
      scrollToService(industryId);
    });
  });

  // Prev/Next buttons
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      if (currentServiceIndex > 0) scrollToService(currentServiceIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      if (currentServiceIndex < totalServices - 1) scrollToService(currentServiceIndex + 1);
    });
  }

  // In-page hash links: use window scrolling with a fixed-header offset
  document.addEventListener('click', (e) => {
    const link = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!link) return;

    const href = link.getAttribute('href') || '';
    if (href === '#' || href.length < 2) return;

    const targetId = href.slice(1);
    if (!document.getElementById(targetId)) return;

    e.preventDefault();
    scrollToId(targetId);

    if (targetId === 'pricing') {
      scrollToService(0);
    }

    // Update active state immediately
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    if (link.classList && link.classList.contains('nav-link')) {
      link.classList.add('active');
    }
  });

  // Update active nav link on window scroll
  (function initActiveNavOnScroll(){
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const sections = Array.from(document.querySelectorAll('main.page > section'));
    if (navLinks.length === 0 || sections.length === 0) return;

    let ticking = false;
    const setActiveBySection = () => {
      ticking = false;
      const offsetTop = getFixedHeaderOffset();

      let best = null;
      let bestDist = Infinity;
      sections.forEach(sec => {
        const r = sec.getBoundingClientRect();
        const dist = Math.abs(r.top - offsetTop);
        if (dist < bestDist) {
          bestDist = dist;
          best = sec;
        }
      });

      const id = best && best.getAttribute('id');
      if (!id) return;

      navLinks.forEach(l => {
        const href = l.getAttribute('href');
        l.classList.toggle('active', href === `#${id}`);
      });
    };

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(setActiveBySection);
    }, { passive: true });

    setActiveBySection();
  })();

  // ===== Initialize =====
  updateAllServiceButtons(0);
  updateServiceContent(0);
});
