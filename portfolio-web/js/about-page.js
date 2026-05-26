(function () {
  var C = function () {
    return window.PortfolioCore;
  };

  window.PortfolioAbout = {
    render: function (data) {
      if (!data) return;
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
      if (title && p) title.textContent = "Tentang — " + p.name;
      document.title = (p && p.name ? "Tentang — " + p.name : "Tentang") + " · Portfolio";
    },
    load: function () {
      return window.PortfolioApi.getPortfolio()
        .then(function (data) {
          window.PortfolioAbout.render(data);
          return data;
        })
        .catch(function () {
          if (C()) C().showError("Gagal memuat halaman about.");
        });
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("about-story")) window.PortfolioAbout.load();
  });
})();
