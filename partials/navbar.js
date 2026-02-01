// Language dropdown handler for navbar// Language dropdown handler for navbar// Minimal standalone JS for the navbar partial.

// Works with translations.js for language switching

// Works with translations.js for language switching via localStorage// Provides language dropdown behavior and path switching when opening the HTML file directly.

document.addEventListener('DOMContentLoaded', function () {

  const selectWrap = document.querySelector('.select-wrap');

  if (!selectWrap) return;

document.addEventListener('DOMContentLoaded', function () {(function () {

  const langBtn = selectWrap.querySelector('.lang-btn');

  const options = selectWrap.querySelectorAll('.option');  const selectWrap = document.querySelector('.select-wrap');  function normalize(p) {



  // Toggle dropdown on button click  if (!selectWrap) return;    let x = p.startsWith('/') ? p : '/' + p;

  if (langBtn) {

    langBtn.addEventListener('click', function (e) {    x = x.replace(/\/index\.html?$/i, '');

      e.preventDefault();

      e.stopPropagation();  const langBtn = selectWrap.querySelector('.lang-btn');    if (x.length > 1) x = x.replace(/\/+$/, '');

      selectWrap.classList.toggle('open');

    });  const options = selectWrap.querySelectorAll('.option');    return x || '/';

  }

  }

  // Open dropdown on mouse enter

  selectWrap.addEventListener('mouseenter', function () {  // Toggle dropdown on button click

    selectWrap.classList.add('open');

  });  langBtn.addEventListener('click', function (e) {  function pathForLocale(p, loc) {



  // Close dropdown on mouse leave    e.preventDefault();    if (loc === 'de') {

  selectWrap.addEventListener('mouseleave', function () {

    selectWrap.classList.remove('open');    e.stopPropagation();      if (p === '/de' || p.startsWith('/de/')) return p;

  });

    selectWrap.classList.toggle('open');      return p === '/' ? '/de' : '/de' + p;

  // Close dropdown when clicking elsewhere on page

  document.addEventListener('click', function (e) {  });    } else {

    if (!selectWrap.contains(e.target)) {

      selectWrap.classList.remove('open');      if (!p.startsWith('/de')) return p;

    }

  });  // Open dropdown on mouse enter      if (p === '/de') return '/';



  // Handle language selection  selectWrap.addEventListener('mouseenter', function () {      return p.substring(3) || '/';

  options.forEach(function (opt) {

    opt.addEventListener('click', function (e) {    selectWrap.classList.add('open');    }

      e.preventDefault();

      e.stopPropagation();  });  }



      const locale = opt.getAttribute('data-locale');

      const lang = locale === 'de' ? 'de' : 'en';

  // Close dropdown on mouse leave  function getLocaleFromPath(path) {

      // Call translations.js function to change language

      if (typeof setLanguage === 'function') {  selectWrap.addEventListener('mouseleave', function () {    return /^\/de(\/|$)/.test(normalize(path)) ? 'de' : 'en-US';

        setLanguage(lang);

      }    selectWrap.classList.remove('open');  }



      // Update visual selection  });

      options.forEach(function (o) {

        o.classList.toggle('selected', o === opt);  document.addEventListener('DOMContentLoaded', function () {

      });

  // Close dropdown when clicking elsewhere on page    var selectWrap = document.querySelector('.select-wrap');

      // Close dropdown

      selectWrap.classList.remove('open');  document.addEventListener('click', function (e) {    if (!selectWrap) return;

    });

  });    if (!selectWrap.contains(e.target)) {



  // Set initial selected state based on current language      selectWrap.classList.remove('open');    var langBtn = selectWrap.querySelector('.lang-btn');

  if (typeof getCurrentLanguage === 'function') {

    const currentLang = getCurrentLanguage();    }    var langBtnSpan = langBtn && langBtn.querySelector('span');

    options.forEach(function (opt) {

      const locale = opt.getAttribute('data-locale');  });    var options = selectWrap.querySelectorAll('.option');

      const lang = locale === 'de' ? 'de' : 'en';

      opt.classList.toggle('selected', lang === currentLang);    var arrow = selectWrap.querySelector('.arrow');

    });

  }  // Handle language selection

});

  options.forEach(function (opt) {    // Set initial selected locale visually

    opt.addEventListener('click', function (e) {    var selectedLocale = getLocaleFromPath(location.pathname);

      e.preventDefault();    options.forEach(function (opt) {

      e.stopPropagation();      var locale = opt.getAttribute('data-locale') || (opt.textContent || '').trim().toLowerCase();

      if ((locale === 'de' && selectedLocale === 'de') || (locale === 'english' && selectedLocale !== 'de') || (locale === 'en-us' && selectedLocale !== 'de')) {

      const locale = opt.getAttribute('data-locale');        opt.classList.add('selected');

      const lang = locale === 'de' ? 'de' : 'en';      } else {

        opt.classList.remove('selected');

      // Call translations.js function to change language      }

      if (typeof setLanguage === 'function') {    });

        setLanguage(lang);

      }    // If the HTML contains raw Angular interpolation (e.g. "{{ selectedLocale ... }}")

    // replace it for standalone usage and ensure the visible label is correct.

      // Update visual selection    try {

      options.forEach(function (o) {      var labelText = selectedLocale === 'de' ? 'Deutsch' : 'English';

        o.classList.toggle('selected', o === opt);      if (langBtnSpan) {

      });        // If it contains interpolation braces, replace entire text

        if (/\{\{.*\}\}/.test(langBtnSpan.textContent || '')) {

      // Close dropdown          langBtnSpan.textContent = labelText;

      selectWrap.classList.remove('open');        } else if (!langBtnSpan.textContent.trim()) {

    });          langBtnSpan.textContent = labelText;

  });        }

      }

  // Set initial selected state based on current language      // also search and replace any stray interpolation nodes anywhere in the nav

  if (typeof getCurrentLanguage === 'function') {      document.querySelectorAll('span,div').forEach(function (el) {

    const currentLang = getCurrentLanguage();        if (/\{\{.*\}\}/.test(el.textContent || '')) {

    options.forEach(function (opt) {          el.textContent = (selectedLocale === 'de' ? 'Deutsch' : 'English');

      const locale = opt.getAttribute('data-locale');        }

      const lang = locale === 'de' ? 'de' : 'en';      });

      opt.classList.toggle('selected', lang === currentLang);    } catch (e) {

    });      // ignore errors in older browsers

  }    }

});

    // open/close handlers
    function open() { selectWrap.classList.add('open'); }
    function close() { selectWrap.classList.remove('open'); }

    selectWrap.addEventListener('mouseenter', open);
    selectWrap.addEventListener('mouseleave', close);
    langBtn.addEventListener('click', function (e) {
      e.preventDefault();
      selectWrap.classList.toggle('open');
    });

    options.forEach(function (opt) {
      // store locale on each option for standalone use
      if (!opt.hasAttribute('data-locale')) {
        var txt = (opt.textContent || '').trim().toLowerCase();
        if (txt === 'deutsch' || txt === 'de') opt.setAttribute('data-locale', 'de');
        else opt.setAttribute('data-locale', 'en-US');
      }

      opt.addEventListener('click', function (ev) {
        var locale = opt.getAttribute('data-locale');
        var normalized = locale === 'de' ? 'de' : 'en-US';

        if (normalized === selectedLocale) {
          close();
          return;
        }

        selectedLocale = normalized;
        // update visual selection
        options.forEach(function (o) { o.classList.toggle('selected', o === opt); });

        var currentPath = normalize(location.pathname);
        var newPath = pathForLocale(currentPath, normalized);
        if (currentPath !== newPath) {
          location.assign(newPath + location.search + location.hash);
        }
      });
    });
  });
})();
import { Component, Inject } from '@angular/core';
import { DOCUMENT, CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {
  selectedLocale;
  isDropdownOpen = false;
  isUserDropdownOpen = false;

  // User state
  isLoggedIn = false;
  userName = '';
  userEmail = '';

  constructor(@Inject(DOCUMENT) doc, router) {
    this.doc = doc;
    this.router = router;

    this.selectedLocale = this.getLocaleFromPath(this.doc.location.pathname);
  }

  ngOnInit() {
    this.selectedLocale = this.getLocaleFromPath(this.doc.location.pathname);
    this.checkUserSession();

    // Listen to route changes to update user state
    this.router.events.subscribe(() => {
      this.checkUserSession();
    });
  }

  checkUserSession() {
    const userId = sessionStorage.getItem('userId');
    const userName = sessionStorage.getItem('userName');
    const userEmail = sessionStorage.getItem('userEmail');

    this.isLoggedIn = !!(userId && userName && userEmail);
    this.userName = userName || '';
    this.userEmail = userEmail || '';
  }

  onLangChange(locale) {
    const normalized = locale === 'de' ? 'de' : 'en-US';

    if (this.selectedLocale === normalized) {
      this.isDropdownOpen = false;
      return;
    }

    this.selectedLocale = normalized;

    const url = new URL(this.doc.location.href);
    const currentPath = this.normalize(url.pathname);
    const newPath = this.pathForLocale(currentPath, normalized);

    if (currentPath !== newPath) {
      this.doc.location.assign(newPath + url.search + url.hash);
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  logout() {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userEmail');
    this.isLoggedIn = false;
    this.userName = '';
    this.userEmail = '';
    this.isUserDropdownOpen = false;
    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToDashboard() {
    this.isUserDropdownOpen = false;
    this.router.navigate(['/dashboard']);
  }

  goToWriteReview() {
    this.isUserDropdownOpen = false;
    this.router.navigate(['/reviews'], { queryParams: { write: 'true' } });
  }

  getLocaleFromPath(path) {
    return /^\/de(\/|$)/.test(this.normalize(path)) ? 'de' : 'en-US';
  }

  normalize(p) {
    let x = p.startsWith('/') ? p : '/' + p;
    x = x.replace(/\/index\.html?$/i, '');
    if (x.length > 1) x = x.replace(/\/+$/, '');
    return x || '/';
  }

  pathForLocale(p, loc) {
    if (loc === 'de') {
      if (p === '/de' || p.startsWith('/de/')) return p;
      return p === '/' ? '/de' : '/de' + p;
    } else {
      if (!p.startsWith('/de')) return p;
      if (p === '/de') return '/';
      return p.substring(3);
    }
  }
}
