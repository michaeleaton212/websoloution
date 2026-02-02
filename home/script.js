// script.js - Refactored for CSS Scroll Snap ONLY (no wheel/scroll interception)
document.addEventListener('DOMContentLoaded', function () {
  // ===== Scroll-reveal animations (Services cards) =====
  (function initServicesCardReveal(){
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const scrollRoot = document.querySelector('main.page');
    const cards = Array.from(document.querySelectorAll('.services-feature-card'));
    if (!scrollRoot || cards.length === 0) return;

    // Mark as reveal-enabled (CSS keeps no-JS safe)
    cards.forEach(c => c.classList.add('reveal-ready'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal-in');
        observer.unobserve(entry.target);
      });
    }, {
      root: scrollRoot,
      threshold: 0.18,
      rootMargin: '0px 0px -10% 0px'
    });

    // Stagger a tiny bit for a premium feel
    cards.forEach((card, i) => {
      setTimeout(() => observer.observe(card), i * 60);
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
  const pageContainer = document.querySelector('main.page');
  const pricingSection = document.getElementById('pricing');

  // Smooth in-page anchor scrolling inside the main scroll container
  // (Needed because the page scrolls inside main.page, not the window.)
  if (pageContainer) {
    pageContainer.addEventListener('click', (e) => {
      const link = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!link) return;
      if (link.classList && link.classList.contains('nav-link')) return; // handled separately

      const href = link.getAttribute('href') || '';
      if (href === '#' || href.length < 2) return;

      const targetId = href.slice(1);
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      e.preventDefault();

      const containerRect = pageContainer.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      const targetTop = (targetRect.top - containerRect.top) + pageContainer.scrollTop;

      pageContainer.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  }

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

  // Navbar click handlers (scroll inside .page to the target section)
  // Only intercept in-page hash links; let normal navigation happen otherwise.
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href') || '';
      if (!href.startsWith('#')) return;

      e.preventDefault();

      const targetId = href.slice(1);
      const targetElement = document.getElementById(targetId);
      const container = document.querySelector('main.page');

      if (!targetElement || !container) return;

      // Scroll position of target relative to the scroll container
      const containerRect = container.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      const targetTop = (targetRect.top - containerRect.top) + container.scrollTop;

      container.scrollTo({ top: targetTop, behavior: 'smooth' });

      // If going to pricing/services, reset to first service
      if (targetId === 'pricing') {
        scrollToService(0);
      }

      // Update active state
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Optional: update active nav link on scroll (works when .page is scroll container)
  if (pageContainer) {
    const sections = Array.from(document.querySelectorAll('main.page > section'));

    const setActiveBySection = () => {
      const containerTop = pageContainer.getBoundingClientRect().top;

      let best = null;
      let bestDist = Infinity;

      sections.forEach(sec => {
        const r = sec.getBoundingClientRect();
        const dist = Math.abs(r.top - containerTop);
        if (dist < bestDist) {
          bestDist = dist;
          best = sec;
        }
      });

      if (!best) return;

      const id = best.getAttribute('id');
      if (!id) return;

      document.querySelectorAll('.nav-link').forEach(l => {
        const href = l.getAttribute('href');
        l.classList.toggle('active', href === `#${id}`);
      });
    };

    pageContainer.addEventListener('scroll', setActiveBySection, { passive: true });
    setActiveBySection();
  }

  // ===== Initialize =====
  updateAllServiceButtons(0);
  updateServiceContent(0);
});
