(function () {
  var meta = document.querySelector('meta[name="portfolio-api"]');
  // Same-origin: nginx :9991 mem-proxy /api/* ke portfolio-api (jalan di IP server manapun).
  var def = location.protocol + "//" + location.host;
  window.PORTFOLIO_API = (meta && meta.getAttribute("content")) || def;
})();
