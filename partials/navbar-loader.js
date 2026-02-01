// Navbar loader utility - includes navbar HTML from partials directory into any page
// Usage: Add <div id="navbar-placeholder"></div> and <script src="../partials/navbar-loader.js"></script>

(function() {
  // Determine relative path to partials based on current location
  var currentPath = window.location.pathname;
  var depth = (currentPath.match(/\//g) || []).length - 1;
  var relativePath = depth > 1 ? '../'.repeat(depth - 1) : './';
  
  // Adjust for file-based paths (containing .html)
  if (currentPath.includes('.html')) {
    var segments = currentPath.split('/').filter(Boolean);
    depth = segments.length - 1;
    relativePath = depth > 0 ? '../'.repeat(depth) : './';
  }
  
  var navbarPath = relativePath + 'partials/navbar.html';
  
  document.addEventListener('DOMContentLoaded', function() {
    var placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) {
      console.warn('navbar-loader.js: No element with id="navbar-placeholder" found');
      return;
    }
    
    fetch(navbarPath)
      .then(function(response) {
        if (!response.ok) throw new Error('Failed to load navbar: ' + response.status);
        return response.text();
      })
      .then(function(html) {
        placeholder.innerHTML = html;
        
        // After navbar is loaded, initialize it by running navbar.js manually
        var script = document.createElement('script');
        script.src = relativePath + 'partials/navbar.js';
        document.body.appendChild(script);
      })
      .catch(function(err) {
        console.error('navbar-loader.js error:', err);
        placeholder.innerHTML = '<p style="color: red;">Failed to load navigation</p>';
      });
  });
})();
