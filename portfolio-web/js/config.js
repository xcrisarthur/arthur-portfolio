(function () {
  var meta = document.querySelector('meta[name="portfolio-api"]');
  var host = location.hostname;
  var def = location.protocol + "//" + location.host;
  /** HTTPS + sertifikat valid (sslip.io) — diperlukan agar GitHub Pages bisa fetch API */
  var GITHUB_PAGES_API = "https://103-144-126-90.sslip.io/portfolio-api";

  if (host === "xcrisarthur.github.io") {
    window.PORTFOLIO_API = (meta && meta.getAttribute("content")) || GITHUB_PAGES_API;
  } else {
    window.PORTFOLIO_API = (meta && meta.getAttribute("content")) || def;
  }
})();
