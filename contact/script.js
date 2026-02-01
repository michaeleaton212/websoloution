(function () {
  // Optional: allow embedding the page as a clean section
  try {
    const qs = new URLSearchParams(location.search);
    if (qs.get('embed') === '1') document.body.classList.add('is-embed');
  } catch (e) {}

  // EmailJS (optional). Falls EmailJS nicht geladen ist, nutzen wir ein mailto:-Fallback.
  const EMAILJS_PUBLIC_KEY = "PqPY56nEQgsXhzvaJ";
  const EMAILJS_SERVICE_ID = "service_6rczoex";
  const EMAILJS_TEMPLATE_ID = "template_bnv5z4o";

  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameEl = document.getElementById("name");
  const emailEl = document.getElementById("email");
  const msgEl = document.getElementById("message");
  const statusEl = document.getElementById("status-message");
  const sendBtn = document.getElementById("contactSendBtn");

  let emailjsInitialized = false;

  function setStatus(kind, text) {
    if (!statusEl) return;
    statusEl.classList.remove("is-ok", "is-err", "is-info");
    if (kind) statusEl.classList.add("is-" + kind);
    statusEl.textContent = text || "";
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function sendMessage() {
    const name = (nameEl?.value || "").trim();
    const email = (emailEl?.value || "").trim();
    const message = (msgEl?.value || "").trim();

    if (!name) {
      setStatus("err", "Bitte geben Sie Ihren Namen ein.");
      nameEl?.focus();
      return;
    }
    if (!email || !isValidEmail(email)) {
      setStatus("err", "Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      emailEl?.focus();
      return;
    }
    if (!message || message.length < 10) {
      setStatus("err", "Bitte schreiben Sie eine kurze Nachricht (mind. 10 Zeichen)." );
      msgEl?.focus();
      return;
    }

    if (sendBtn) sendBtn.disabled = true;
    setStatus("info", "Wird gesendet …");

    try {
      if (window.emailjs && typeof window.emailjs.send === "function") {
        if (!emailjsInitialized && typeof window.emailjs.init === "function") {
          window.emailjs.init(EMAILJS_PUBLIC_KEY);
          emailjsInitialized = true;
        }

        await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          from_name: name,
          from_email: email,
          message
        });

        setStatus("ok", "Gesendet! Vielen Dank.");
        form.reset();
        return;
      }

      const subject = encodeURIComponent("Kontaktanfrage Website");
      const body = encodeURIComponent(`Name: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}`);
      location.href = `mailto:info@websolutions.ch?subject=${subject}&body=${body}`;
      setStatus("ok", "Mailprogramm geöffnet – bitte senden Sie die E-Mail ab.");
    } catch (err) {
      console.error(err);
      setStatus("err", "Senden fehlgeschlagen. Bitte versuchen Sie es erneut oder schreiben Sie an info@websolutions.ch.");
    } finally {
      if (sendBtn) sendBtn.disabled = false;
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage();
  });
})();
