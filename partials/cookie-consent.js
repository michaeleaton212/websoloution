(function () {
  "use strict";

  var CONSENT_COOKIE = "ws_cookie_consent";
  var CONSENT_MAX_DAYS = 180;

  function setCookie(name, value, days) {
    var maxAge = days * 24 * 60 * 60;
    var cookie =
      encodeURIComponent(name) +
      "=" +
      encodeURIComponent(value) +
      "; Path=/; Max-Age=" +
      String(maxAge) +
      "; SameSite=Lax";

    if (location && location.protocol === "https:") {
      cookie += "; Secure";
    }

    document.cookie = cookie;
  }

  function getCookie(name) {
    var key = encodeURIComponent(name) + "=";
    var parts = (document.cookie || "").split(";");
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i].trim();
      if (part.indexOf(key) === 0) {
        return decodeURIComponent(part.substring(key.length));
      }
    }
    return null;
  }

  function pathDepth() {
    var pathname = (location && location.pathname) ? location.pathname : "/";
    var segments = pathname.split("/").filter(Boolean);

    // If last segment is a file name, ignore it.
    if (segments.length && /\.html?$/i.test(segments[segments.length - 1])) {
      segments.pop();
    }

    return segments.length;
  }

  function relPrefixToRoot() {
    var depth = pathDepth();
    return depth > 0 ? "../".repeat(depth) : "";
  }

  function isEmbedMode() {
    try {
      var qs = new URLSearchParams(location.search);
      if (qs.get("embed") === "1") return true;
    } catch (e) {}
    return document.body && document.body.classList && document.body.classList.contains("is-embed");
  }

  function ensureStyles(prefix) {
    if (document.querySelector('link[data-cookie-consent-style="1"]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = prefix + "partials/cookie-consent.css";
    link.setAttribute("data-cookie-consent-style", "1");
    document.head.appendChild(link);
  }

  function consentValue() {
    return getCookie(CONSENT_COOKIE);
  }

  function hasConsentForNonEssential() {
    return consentValue() === "accepted";
  }

  function hide(el) {
    if (!el) return;
    el.setAttribute("aria-hidden", "true");
    el.style.display = "none";
  }

  function showBanner() {
    if (document.querySelector(".cookie-consent")) return;

    var prefix = relPrefixToRoot();
    ensureStyles(prefix);

    var privacyHref = prefix + "home/index.html#imprint";

    var wrap = document.createElement("div");
    wrap.className = "cookie-consent";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-live", "polite");
    wrap.setAttribute("aria-label", "Cookie Hinweis");

    wrap.innerHTML =
      '<div class="cookie-consent__card">' +
      '  <div class="cookie-consent__row">' +
      '    <div class="cookie-consent__copy">' +
      '      <div class="cookie-consent__title">Cookies</div>' +
      '      <p class="cookie-consent__text">Wir verwenden essenzielle Cookies, um die Website sicher zu betreiben. Optionale Cookies helfen uns, Inhalte/Marketing zu verbessern. <a href="' + privacyHref + '">Mehr erfahren</a>.</p>' +
      '    </div>' +
      '    <div class="cookie-consent__actions">' +
      '      <button class="cookie-consent__btn" type="button" data-cc-action="reject">Nur essenzielle</button>' +
      '      <button class="cookie-consent__btn cookie-consent__btn--primary" type="button" data-cc-action="accept">Alle akzeptieren</button>' +
      '    </div>' +
      '  </div>' +
      '</div>';

    document.body.appendChild(wrap);

    function onAction(action) {
      if (action === "accept") {
        setCookie(CONSENT_COOKIE, "accepted", CONSENT_MAX_DAYS);
      } else {
        setCookie(CONSENT_COOKIE, "rejected", CONSENT_MAX_DAYS);
      }
      hide(wrap);
      document.dispatchEvent(new CustomEvent("ws:cookie-consent", { detail: { value: consentValue() } }));
    }

    wrap.addEventListener("click", function (e) {
      var target = e.target;
      if (!target || !target.getAttribute) return;
      var action = target.getAttribute("data-cc-action");
      if (!action) return;
      onAction(action);
    });
  }

  // Public API (optional): other scripts can check consent
  window.websolutionsCookieConsent = {
    get: consentValue,
    hasConsentForNonEssential: hasConsentForNonEssential,
    acceptAll: function () { setCookie(CONSENT_COOKIE, "accepted", CONSENT_MAX_DAYS); },
    rejectNonEssential: function () { setCookie(CONSENT_COOKIE, "rejected", CONSENT_MAX_DAYS); }
  };

  function init() {
    if (isEmbedMode()) return;
    // If already decided, do nothing.
    if (consentValue() === "accepted" || consentValue() === "rejected") return;
    showBanner();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
