// Pricing Page JavaScript
console.log('Pricing page loaded');

document.addEventListener('DOMContentLoaded', function() {
  const pricingCards = document.querySelectorAll('.pricing-card');
  const selectBtns = document.querySelectorAll('.select-plan-btn');

  // Animate cards on load
  pricingCards.forEach(function(card, index) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    
    setTimeout(function() {
      card.style.transition = 'all 0.6s ease-out';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 200 + (index * 150));
  });

  // Handle plan selection
  selectBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      const card = e.target.closest('.pricing-card');
      const planName = card.querySelector('h3').textContent;
      const price = card.querySelector('.amount').textContent;
      
      alert('You selected the ' + planName + ' plan at €' + price + '/month\n\nThis would redirect to checkout in a production environment.');
    });
  });

  // Add parallax effect on scroll
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    pricingCards.forEach(function(card, index) {
      const speed = 0.1 + (index * 0.05);
      card.style.transform = 'translateY(' + (scrolled * speed * -0.1) + 'px)';
    });
  }, { passive: true });
});
