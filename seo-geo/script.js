(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function animateNumber(el) {
    const target = Number(el.getAttribute("data-count") || "0");
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 850;

    if (!Number.isFinite(target) || target <= 0) return;

    if (prefersReducedMotion) {
      el.textContent = String(target) + suffix;
      return;
    }

    const start = performance.now();
    const from = 0;

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(from + (target - from) * eased);
      el.textContent = String(value) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function initStats() {
    const root = document.getElementById("sg-stats");
    if (!root) return;

    const nums = Array.from(root.querySelectorAll(".sg-num"));
    if (nums.length === 0) return;

    let ran = false;

    const run = () => {
      if (ran) return;
      ran = true;
      nums.forEach(animateNumber);
    };

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      run();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            run();
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.35 }
    );

    io.observe(root);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initStats();

    // Lightweight local language label only (no content swapping)
    const options = document.querySelectorAll(".option[data-locale]");
    const label = document.getElementById("lang-label");
    const wrap = document.querySelector(".select-wrap");

    if (label && options.length) {
      options.forEach((opt) => {
        opt.addEventListener("click", () => {
          const loc = opt.getAttribute("data-locale");
          label.textContent = loc === "de" ? "Deutsch" : "English";
          options.forEach((o) => o.classList.toggle("selected", o === opt));
          if (wrap) wrap.classList.remove("open");
        });
      });

      // Default selection
      const deOpt = Array.from(options).find((o) => o.getAttribute("data-locale") === "de");
      if (deOpt) deOpt.classList.add("selected");
    }
  });
})();
