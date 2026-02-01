// swipe-banner-injector.js
(function() {
  if (document.querySelector('.swipe-banner')) return;
  var banner = document.createElement('div');
  banner.className = 'swipe-banner';
  banner.setAttribute('role', 'note');
  banner.setAttribute('aria-label', 'Scroll hint');
  banner.innerHTML = '<div class="swipe-pill"><span class="swipe-track" aria-hidden="true"></span><span class="swipe-text">Durch alle Services scrollen - Weiter zu Services &amp; mehr</span></div>';
  document.body.appendChild(banner);
})();
