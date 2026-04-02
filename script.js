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
        const delay = entry.target._staggerDelay || 0;
        entry.target.style.transitionDelay = delay + 'ms';
        entry.target.classList.add('reveal-in');
        // Reset delay after animation so hover transitions aren't delayed
        setTimeout(() => { entry.target.style.transitionDelay = ''; }, delay + 600);
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.18,
      rootMargin: '0px 0px -10% 0px'
    });

    // Stagger with explicit CSS transition-delay for clean visual cascade
    cards.forEach((card, i) => {
      const delay = i * 110;
      setTimeout(() => {
        observer.observe(card);
      }, i * 40);
      // Store delay so the observer can apply it at reveal time
      card._staggerDelay = delay;
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
    // On mobile (bottom nav), no top offset needed
    if (window.innerWidth <= 600) return 0;
    const nav = document.querySelector('.navbar-container');
    const navH = nav ? nav.getBoundingClientRect().height : 0;
    return Math.ceil(navH + 16);
  }

  function scrollToId(targetId){
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 600;
    const headerOffset = isMobile ? 0 : (targetId === 'pricing' ? 0 : getFixedHeaderOffset());
    const top = window.scrollY + targetElement.getBoundingClientRect().top - headerOffset;

    // Enhanced smooth scrolling with easing
    if (prefersReducedMotion) {
      window.scrollTo({ top, behavior: 'auto' });
      return;
    }

    // Custom smooth scroll with easing for better feel
    const startY = window.scrollY;
    const targetY = top;
    const distance = targetY - startY;
    const duration = Math.min(Math.abs(distance) * 0.5, 1200); // Max 1.2s
    
    let startTime = null;

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    function animateScroll(currentTime) {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);
      
      window.scrollTo(0, startY + (distance * easedProgress));
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    }

    requestAnimationFrame(animateScroll);
  }

  // Mouse wheel / trackpad: native smooth scrolling only (no snap hijacking)

  // Touch/swipe: native smooth scrolling only (no snap hijacking)

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

  // ===== FAQ: slide-in from left on scroll =====
  (function initFaqReveal(){
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const items = Array.from(document.querySelectorAll('.faq-item'));
    if (items.length === 0) return;

    items.forEach((item, i) => {
      item.classList.add('reveal-ready');
      item.style.setProperty('--faq-delay', (i * 80) + 'ms');
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal-in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    items.forEach(item => observer.observe(item));
  })();

  // ===== FAQ: smooth height accordion =====
  (function initFaqAccordion(){
    const items = Array.from(document.querySelectorAll('.faq-item'));

    items.forEach(item => {
      const summary = item.querySelector('summary');
      const answer  = item.querySelector('.faq-answer');
      if (!summary || !answer) return;

      // Force block display so browser doesn't use display:none
      answer.style.display  = 'block';
      answer.style.overflow = 'hidden';
      answer.style.height   = '0px';
      item.removeAttribute('open');

      summary.addEventListener('click', e => {
        e.preventDefault();
        const isOpen = item.hasAttribute('open');

        if (!isOpen) {
          item.setAttribute('open', '');
          const h = answer.scrollHeight;
          answer.style.height = h + 'px';
          answer.addEventListener('transitionend', () => {
            if (item.hasAttribute('open')) answer.style.height = 'auto';
          }, { once: true });
        } else {
          // Snapshot current height before collapsing
          answer.style.height = answer.scrollHeight + 'px';
          requestAnimationFrame(() => {
            answer.style.height = '0px';
          });
          answer.addEventListener('transitionend', () => {
            item.removeAttribute('open');
          }, { once: true });
        }
      });
    });
  })();

  // ===== About section inner element reveals =====
  (function initAboutReveal(){
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const targets = Array.from(document.querySelectorAll(
      '.about-section .glass-card, .about-section .about-hero, .imprint-home-panel'
    ));
    if (targets.length === 0) return;

    targets.forEach((el, i) => {
      el.classList.add('about-reveal');
      el.style.setProperty('--reveal-delay', (i * 90) + 'ms');
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal-in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    targets.forEach(el => observer.observe(el));
  })();

  // ===== Scroll Progress Bar =====
  (function initScrollProgressBar(){
    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress at-top';
    progressBar.setAttribute('aria-hidden', 'true'); // Accessibility
    
    // Insert at the very beginning of body for top positioning
    document.body.insertBefore(progressBar, document.body.firstChild);

    // Calculate and update progress with improved accuracy
    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Prevent division by zero
      if (docHeight <= 0) {
        progressBar.style.width = '0%';
        return;
      }
      
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      // Show/hide progress bar based on scroll position
      if (scrollTop < 30) {
        progressBar.classList.add('at-top');
      } else {
        progressBar.classList.remove('at-top');
      }
      
      // Smooth progress update with better easing
      const clampedPercent = Math.min(Math.max(scrollPercent, 0), 100);
      progressBar.style.width = clampedPercent + '%';
    };

    // Optimized scroll listener with RAF throttling
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      requestAnimationFrame(updateScrollProgress);
    }, { passive: true });
    
    // Initial call after a short delay to ensure DOM is ready
    setTimeout(updateScrollProgress, 100);
  })();

  // ===== Enhanced Smooth Scroll Features =====
  
  // Smooth scroll to top button
  (function initScrollToTop(){
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.setAttribute('aria-label', 'Nach oben scrollen');
    scrollBtn.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      background: var(--accent-2);
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 20px;
      cursor: pointer;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
      transform: scale(0.8);
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;

    scrollBtn.addEventListener('click', () => {
      scrollToId('heroStage');
    });

    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
      const shouldShow = window.scrollY > 300;
      scrollBtn.style.opacity = shouldShow ? '1' : '0';
      scrollBtn.style.visibility = shouldShow ? 'visible' : 'hidden';
      scrollBtn.style.transform = shouldShow ? 'scale(1)' : 'scale(0.8)';
    }, { passive: true });

    document.body.appendChild(scrollBtn);
  })();

  // Enhanced keyboard navigation with smooth scroll performance optimization
  (function initKeyboardNavigation(){
    const sections = Array.from(document.querySelectorAll('main.page > section'));
    let currentSectionIndex = 0;
    let isScrolling = false;

    // Throttle scroll updates for better performance
    const throttle = (func, limit) => {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    };

    document.addEventListener('keydown', (e) => {
      // Alt + Arrow keys for section navigation
      if (e.altKey && !e.ctrlKey && !e.shiftKey) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          currentSectionIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
          const sectionId = sections[currentSectionIndex].getAttribute('id');
          if (sectionId) {
            isScrolling = true;
            scrollToId(sectionId);
            setTimeout(() => isScrolling = false, 1000); // Reset after animation
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          currentSectionIndex = Math.max(currentSectionIndex - 1, 0);
          const sectionId = sections[currentSectionIndex].getAttribute('id');
          if (sectionId) {
            isScrolling = true;
            scrollToId(sectionId);
            setTimeout(() => isScrolling = false, 1000); // Reset after animation
          }
        }
      }
    });

    // Use Intersection Observer for better performance
    const observer = new IntersectionObserver((entries) => {
      if (isScrolling) return; // Don't update during programmatic scrolling
      
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionIndex = sections.findIndex(s => s === entry.target);
          if (sectionIndex !== -1) {
            currentSectionIndex = sectionIndex;
          }
        }
      });
    }, {
      threshold: 0.6,
      rootMargin: '-80px 0px'
    });

    sections.forEach(section => observer.observe(section));
  })();
  updateAllServiceButtons(0);
  updateServiceContent(0);

  // ===== Language Switcher =====
  (function initLanguageSwitcher() {
    const translations = {
      en: {
        'hero.eyebrow': 'Websolutions',
        'hero.title.line1': 'Transform Your',
        'hero.title.line2': 'Digital Presence',
        'hero.title.line3': 'Into Growth',
        'hero.subtitle': 'We build high-performance websites that convert visitors into customers. Modern design, blazing-fast speeds, and SEO-optimized for maximum visibility.',
        'hero.cta.primary': 'Start Your Project',
        'hero.testimonial.text': '"Exceptional work! Our website traffic increased by 200% within three months."',
        'hero.testimonial.name': 'Gerry Freiburghaus, Jahrgänger Verein Spiez',
        'projects.eyebrow': 'Portfolio',
        'projects.title': 'Our Last Projects',
        'projects.description': 'Discover our latest work and see what we can create for you',
        'nav.home': 'Home',
        'nav.services': 'Services',
        'nav.references': 'References',
        'nav.seo': 'SEO & GEO',
        'nav.contact': 'Contact us',
        'nav.imprint': 'Imprint'
      },
      de: {
        'hero.eyebrow': 'Websolutions',
        'hero.title.line1': 'Verwandle Deine',
        'hero.title.line2': 'Digitale Präsenz',
        'hero.title.line3': 'In Wachstum',
        'hero.subtitle': 'Wir erstellen hochleistungsfähige Websites, die Besucher zu Kunden machen. Modernes Design, blitzschnelle Ladezeiten und SEO-optimiert für maximale Sichtbarkeit.',
        'hero.cta.primary': 'Projekt Starten',
        'hero.testimonial.text': '"Hervorragende Arbeit! Unser Website-Traffic stieg innerhalb von drei Monaten um 200%."',
        'hero.testimonial.name': 'Gerry Freiburghaus, Jahrgänger Verein Spiez',
        'projects.eyebrow': 'Portfolio',
        'projects.title': 'Unsere Letzten Projekte',
        'projects.description': 'Entdecke unsere neuesten Arbeiten und sieh, was wir für dich erstellen können',
        'nav.home': 'Startseite',
        'nav.services': 'Services',
        'nav.references': 'Referenzen',
        'nav.seo': 'SEO & GEO',
        'nav.contact': 'Kontakt',
        'nav.imprint': 'Impressum'
      },
      fr: {
        'hero.eyebrow': 'Websolutions',
        'hero.title.line1': 'Transformez Votre',
        'hero.title.line2': 'Présence Digitale',
        'hero.title.line3': 'En Croissance',
        'hero.subtitle': 'Nous créons des sites web performants qui convertissent les visiteurs en clients. Design moderne, vitesse ultra-rapide et optimisé SEO pour une visibilité maximale.',
        'hero.cta.primary': 'Démarrer Votre Projet',
        'hero.testimonial.text': '"Travail exceptionnel! Le trafic de notre site a augmenté de 200% en trois mois."',
        'hero.testimonial.name': 'Gerry Freiburghaus, Jahrgänger Verein Spiez',
        'projects.eyebrow': 'Portfolio',
        'projects.title': 'Nos Derniers Projets',
        'projects.description': 'Découvrez nos derniers travaux et voyez ce que nous pouvons créer pour vous',
        'nav.home': 'Accueil',
        'nav.services': 'Services',
        'nav.references': 'Références',
        'nav.seo': 'SEO & GEO',
        'nav.contact': 'Contact',
        'nav.imprint': 'Mentions légales'
      }
    };

    const langBtn = document.getElementById('langSwitcherBtn');
    const langDropdown = document.getElementById('langDropdown');
    const langCurrent = document.getElementById('langCurrent');
    const langOptions = document.querySelectorAll('.lang-option');

    if (!langBtn || !langDropdown) return;

    let currentLang = localStorage.getItem('ws-lang') || 'en';

    function updateLanguage(lang) {
      currentLang = lang;
      localStorage.setItem('ws-lang', lang);

      // Update current display
      langCurrent.textContent = lang.toUpperCase();

      // Update active state
      langOptions.forEach(opt => {
        opt.classList.toggle('lang-option--active', opt.dataset.lang === lang);
      });

      // Apply translations with animation
      const trans = translations[lang];
      if (!trans) return;

      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (trans[key]) {
          el.classList.remove('lang-animating');
          // Force reflow to restart animation
          void el.offsetWidth;
          el.textContent = trans[key];
          el.classList.add('lang-animating');
        }
      });

      // Update html lang attribute
      document.documentElement.lang = lang === 'de' ? 'de-CH' : lang === 'fr' ? 'fr-CH' : 'en';
    }

    function toggleDropdown() {
      const isOpen = langDropdown.classList.contains('active');
      langDropdown.classList.toggle('active', !isOpen);
      langBtn.setAttribute('aria-expanded', !isOpen);
    }

    function closeDropdown() {
      langDropdown.classList.remove('active');
      langBtn.setAttribute('aria-expanded', 'false');
    }

    // Event listeners
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown();
    });

    langOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        const lang = opt.dataset.lang;
        updateLanguage(lang);
        closeDropdown();
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.lang-switcher')) {
        closeDropdown();
      }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDropdown();
      }
    });

    // Initialize with saved language
    updateLanguage(currentLang);
  })();

  // ===== Referenzen Section Scroll Reveal =====
  (function initReferenzenReveal() {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const revealSections = document.querySelectorAll('.reveal-section');
    if (revealSections.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -10% 0px'
    });

    revealSections.forEach(section => observer.observe(section));
  })();

  // ===== Hero Windows Parallax Effect =====
  (function initHeroParallax() {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const windowsContainer = document.querySelector('.hero-windows-container');
    if (!windowsContainer) return;

    const windows = windowsContainer.querySelectorAll('.hero-window');
    
    windowsContainer.addEventListener('mousemove', (e) => {
      const rect = windowsContainer.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      windows.forEach((win, i) => {
        const factor = (i + 1) * 2;
        const rotateY = x * factor * 3;
        const rotateX = -y * factor * 2;
        
        win.style.transform = `${win.dataset.baseTransform || ''} rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
      });
    });

    windowsContainer.addEventListener('mouseleave', () => {
      windows.forEach(win => {
        win.style.transform = '';
      });
    });
  })();
});
