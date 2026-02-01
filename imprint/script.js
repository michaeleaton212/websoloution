(function () {
  // Optional: allow embedding the page as a clean section
  try {
    const qs = new URLSearchParams(location.search);
    if (qs.get('embed') === '1') document.body.classList.add('is-embed');
  } catch (e) {}
})();
