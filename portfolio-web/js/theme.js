(function () {
  var KEY = "portfolio_theme";

  function resolveTheme(mode) {
    if (mode === "light" || mode === "dark") return mode;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    return "light";
  }

  function getMode() {
    try {
      return localStorage.getItem(KEY) || "dark";
    } catch {
      return "dark";
    }
  }

  function apply(mode) {
    var resolved = resolveTheme(mode);
    document.documentElement.setAttribute("data-theme", resolved);
    document.documentElement.setAttribute("data-theme-mode", mode);
    var I = window.PortfolioI18n;
    var label =
      mode === "system"
        ? I
          ? I.t("theme.system")
          : "Sistem"
        : mode === "light"
          ? I
            ? I.t("theme.light")
            : "Terang"
          : I
            ? I.t("theme.dark")
            : "Gelap";
    var prefix = I ? I.t("theme.label") : "Tema";
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.setAttribute("aria-label", prefix + ": " + label);
      btn.setAttribute("title", prefix + ": " + label);
    });
  }

  function cycle() {
    var order = ["dark", "light", "system"];
    var cur = getMode();
    var next = order[(order.indexOf(cur) + 1) % order.length];
    try {
      localStorage.setItem(KEY, next);
    } catch (_) {}
    apply(next);
  }

  function mountToggle(container) {
    if (!container || container.querySelector("[data-theme-toggle]")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    btn.setAttribute("data-theme-toggle", "1");
    btn.innerHTML =
      '<span class="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">☀</span>' +
      '<span class="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">☾</span>';
    btn.addEventListener("click", cycle);
    container.appendChild(btn);
    apply(getMode());
  }

  apply(getMode());

  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
      if (getMode() === "system") apply("system");
    });
  }

  window.PortfolioTheme = { apply: apply, cycle: cycle, getMode: getMode, mountToggle: mountToggle };
})();
