// About Us Page JavaScript
console.log('About Us page loaded');

document.addEventListener('DOMContentLoaded', function() {
  // Animate sections on scroll
  const sections = document.querySelectorAll('.mission-section, .values-section, .stats-section, .team-section, .cta-section');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  sections.forEach(function(section) {
    section.style.opacity = '0';
    section.style.transform = 'translateY(40px)';
    section.style.transition = 'all 0.8s ease-out';
    observer.observe(section);
  });

  // Animate stat numbers
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateStats();
      }
    });
  }, { threshold: 0.5 });

  if (statNumbers.length > 0) {
    statsObserver.observe(document.querySelector('.stats-section'));
  }

  function animateStats() {
    statNumbers.forEach(function(stat) {
      const text = stat.textContent;
      const hasPlus = text.includes('+');
      const hasPercent = text.includes('%');
      const hasSlash = text.includes('/');
      
      // Extract number
      let targetStr = text.replace(/[^\d.]/g, '');
      let target = parseFloat(targetStr);
      
      if (isNaN(target)) return;

      let current = 0;
      const increment = target / 50;
      const duration = 2000;
      const stepTime = duration / 50;

      stat.textContent = '0';

      const timer = setInterval(function() {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }

        let displayValue = Math.floor(current);
        if (target >= 1000000) {
          displayValue = (current / 1000000).toFixed(1) + 'M';
        } else if (target >= 1000) {
          displayValue = Math.floor(current / 1000) + 'K';
        }

        if (hasPlus) displayValue += '+';
        if (hasPercent) displayValue += '%';
        if (hasSlash) displayValue = text; // Keep original for special formats like "24/7"

        stat.textContent = displayValue;
      }, stepTime);
    });
  }

  // Add hover effects to team avatars
  const teamCards = document.querySelectorAll('.team-card');
  teamCards.forEach(function(card) {
    const avatar = card.querySelector('.team-avatar');
    
    card.addEventListener('mouseenter', function() {
      avatar.style.transform = 'scale(1.1) rotate(5deg)';
      avatar.style.transition = 'all 0.3s ease';
    });

    card.addEventListener('mouseleave', function() {
      avatar.style.transform = 'scale(1) rotate(0deg)';
    });
  });
});
