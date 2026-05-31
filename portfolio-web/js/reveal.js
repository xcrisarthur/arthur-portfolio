(function () {
  var observer = null;

  function isInViewport(el) {
    var rect = el.getBoundingClientRect();
    var h = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < h - 40 && rect.bottom > 40;
  }

  function createObserver() {
    if (!("IntersectionObserver" in window)) return null;
    return new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
    );
  }

  function observeEl(el) {
    if (!el) return;
    var items = el.querySelectorAll(".reveal:not(.is-visible)");
    if (!items.length) {
      if (el.classList && el.classList.contains("reveal") && !el.classList.contains("is-visible")) {
        items = [el];
      } else {
        return;
      }
    }
    if (!observer) observer = createObserver();
    items.forEach(function (node, i) {
      node.style.setProperty("--reveal-delay", i * 0.07 + "s");
      if (isInViewport(node)) {
        node.classList.add("is-visible");
        if (observer) observer.unobserve(node);
        return;
      }
      if (!observer) {
        node.classList.add("is-visible");
        return;
      }
      observer.observe(node);
    });
  }

  function observeAll() {
    document.querySelectorAll("#hero, .section, .stats, .ach-grid").forEach(observeEl);
  }

  window.PortfolioReveal = {
    observe: observeEl,
    observeAll: observeAll
  };

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".section__title, .section__lead, .stat-item, .ach-card, .timeline-expand").forEach(function (el) {
      el.classList.add("reveal");
    });
    observeAll();
  });
})();
