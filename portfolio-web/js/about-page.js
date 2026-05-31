(function () {
  var C = function () {
    return window.PortfolioCore;
  };

  function tr(key) {
    var I = window.PortfolioI18n;
    return I ? I.t(key) : key;
  }

  window.PortfolioAbout = {
    render: function (data) {
      if (!data) return;
      if (window.PortfolioI18n) {
        window.PortfolioI18n.setData(data);
        data = window.PortfolioI18n.localizeData(data);
      }
      var p = data.profile;
      if (C()) {
        C().setBrandName(p);
        C().updatePageMeta(p);
        C().renderAboutFull(data.about, data.aboutPhotos, p);
        C().renderPrinciples();
        C().renderStackCloud(data.skills);
        C().renderCta(p, "about-cta");
      }
      var title = document.getElementById("about-page-title");
      if (title && p) title.textContent = tr("about.page.title");
      document.title = tr("about.page.title") + (p && p.name ? " — " + p.name : "") + " · Portfolio";
      if (window.PortfolioI18n) window.PortfolioI18n.applyStatic();
    },
    load: function () {
      return window.PortfolioApi.getPortfolio()
        .then(function (data) {
          window.PortfolioAbout.render(data);
          return data;
        })
        .catch(function () {
          if (C()) C().showError(tr("about.loadError"));
        });
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("about-story")) window.PortfolioAbout.load();
  });
})();
