(function () {
  function parseStatValue(raw) {
    var s = String(raw || "0");
    var match = s.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
    if (!match) return { prefix: "", num: 0, suffix: s, decimals: 0 };
    var numStr = match[2];
    var decimals = numStr.indexOf(".") >= 0 ? numStr.split(".")[1].length : 0;
    return { prefix: match[1], num: parseFloat(numStr), suffix: match[3], decimals: decimals };
  }

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateEl(el, duration) {
    var target = el.getAttribute("data-count-target");
    if (!target) return;
    var parsed = parseStatValue(target);
    if (parsed.num === null || isNaN(parsed.num)) return;
    var start = performance.now();
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-div: reduce)").matches;

    function frame(now) {
      var t = Math.min(1, (now - start) / duration);
      var val = parsed.num * easeOutQuart(t);
      var text =
        parsed.prefix +
        (parsed.decimals ? val.toFixed(parsed.decimals) : Math.round(val)) +
        parsed.suffix;
      el.textContent = text;
      if (t < 1 && !reduced) requestAnimationFrame(frame);
      else el.textContent = target;
    }
    if (reduced) {
      el.textContent = target;
      return;
    }
    el.textContent = parsed.prefix + (parsed.decimals ? "0." + "0".repeat(parsed.decimals) : "0") + parsed.suffix;
    requestAnimationFrame(frame);
  }

  function mountStatsGrid(container, items) {
    if (!container) return;
    container.innerHTML = items
      .map(function (it) {
        return (
          '<div class="stat-item reveal">' +
          '<div class="stat-item__value" data-count-target="' +
          String(it.value).replace(/"/g, "&quot;") +
          '">0</div>' +
          '<div class="stat-item__label">' +
          String(it.label).replace(/</g, "&lt;") +
          "</div></div>"
        );
      })
      .join("");
  }

  function observeAndAnimate(root) {
    if (!root) return;
    var values = root.querySelectorAll("[data-count-target]");
    if (!values.length) return;

    if (!("IntersectionObserver" in window)) {
      values.forEach(function (el) {
        el.textContent = el.getAttribute("data-count-target");
      });
      return;
    }

    var done = false;
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || done) return;
          done = true;
          obs.disconnect();
          values.forEach(function (el, i) {
            setTimeout(function () {
              animateEl(el, 1400);
            }, i * 80);
          });
        });
      },
      { threshold: 0.25 }
    );
    obs.observe(root);
  }

  function yearsFromExperiences(experiences) {
    var years = [];
    (experiences || []).forEach(function (e) {
      var m = String(e.period || "").match(/\d{4}/g);
      if (m) m.forEach(function (y) { years.push(parseInt(y, 10)); });
    });
    if (!years.length) return "3+";
    var min = Math.min.apply(null, years);
    var span = new Date().getFullYear() - min;
    if (span <= 0) return "1";
    return span + "+";
  }

  window.PortfolioCounters = {
    buildItems: function (data) {
      var I = window.PortfolioI18n;
      var t = I ? I.t.bind(I) : function (k) { return k; };
      var exps = data.experiences || [];
      var comps = ((data.achievements && data.achievements.competitions) || []).length;
      return [
        { value: yearsFromExperiences(exps), label: t("stat.years") },
        { value: String(exps.length), label: t("stat.roles") },
        { value: String(comps), label: t("stat.awards") },
        { value: "3.67", label: t("stat.gpa") }
      ];
    },
    render: function (gridEl, sectionEl, data) {
      if (!gridEl) return;
      var items = window.PortfolioCounters.buildItems(data);
      mountStatsGrid(gridEl, items);
      if (sectionEl) sectionEl.hidden = false;
      observeAndAnimate(sectionEl || gridEl);
      if (window.PortfolioReveal) window.PortfolioReveal.observe(gridEl);
    }
  };
})();
