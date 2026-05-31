(function () {
  function setNavOpen(open) {
    document.body.classList.toggle("nav-open", open);
    var toggle = document.getElementById("nav-toggle");
    var backdrop = document.getElementById("nav-backdrop");
    if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (backdrop) backdrop.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
  }

  function initScrollSpy() {
    var path = location.pathname.replace(/\/$/, "") || "/";
    var isHome = path === "/" || path.endsWith("/index.html");
    if (!isHome) return;

    var sections = ["tentang", "pengalaman", "proyek", "prestasi", "keahlian", "kontak"]
      .map(function (id) {
        return document.getElementById(id);
      })
      .filter(Boolean);
    var navLinks = document.querySelectorAll(".nav-link[data-nav]");
    if (!sections.length || !navLinks.length) return;

    var activeId = "";
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) activeId = entry.target.id;
        });
        if (!activeId) return;
        navLinks.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("data-nav") === activeId);
        });
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  function initNav() {
    var toggle = document.getElementById("nav-toggle");
    var backdrop = document.getElementById("nav-backdrop");
    var header = document.getElementById("site-header");

    if (toggle) {
      toggle.addEventListener("click", function () {
        setNavOpen(!document.body.classList.contains("nav-open"));
      });
    }

    if (backdrop) {
      backdrop.addEventListener("click", function () {
        setNavOpen(false);
      });
    }

    document.querySelectorAll(".site-header__nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        setNavOpen(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setNavOpen(false);
    });

    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 8);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    initScrollSpy();

    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    var slot = document.getElementById("theme-slot");
    if (slot && window.PortfolioTheme) window.PortfolioTheme.mountToggle(slot);

    var langSlot = document.getElementById("lang-slot");
    if (langSlot && window.PortfolioI18n) window.PortfolioI18n.mountSwitcher(langSlot);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNav);
  } else {
    initNav();
  }
})();
