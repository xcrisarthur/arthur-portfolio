(function () {
  var MAX_PHOTOS = 10;

  function apiBase() {
    return (window.PORTFOLIO_API || "").replace(/\/+$/, "");
  }

  function mediaUrl(id) {
    return apiBase() + "/api/media/" + encodeURIComponent(id);
  }

  function normalizeList(list) {
    if (!Array.isArray(list)) return [];
    return list
      .map(function (p) {
        if (typeof p === "string") return { id: p };
        return p && p.id ? { id: String(p.id) } : null;
      })
      .filter(Boolean)
      .slice(0, MAX_PHOTOS);
  }

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function galleryHtml(photos, opts) {
    opts = opts || {};
    var list = normalizeList(photos);
    if (!list.length) return "";
    var cls = "photo-gallery";
    if (opts.compact) cls += " photo-gallery--compact";
    if (opts.single) cls += " photo-gallery--single";
    var html = '<div class="' + cls + '">';
    list.forEach(function (p, i) {
      var alt = esc((opts.altPrefix || "Foto") + (i + 1));
      html +=
        '<button type="button" class="photo-gallery__item" data-lightbox="' +
        esc(p.id) +
        '" aria-label="Lihat foto ' +
        (i + 1) +
        '"><img src="' +
        esc(mediaUrl(p.id)) +
        '" alt="' +
        alt +
        '" loading="lazy" decoding="async"></button>';
    });
    return html + "</div>";
  }

  function bindLightbox(root) {
    if (!root) return;
    var dlg = document.getElementById("lightbox");
    var img = document.getElementById("lightbox-img");
    if (!dlg || !img) return;
    root.querySelectorAll("[data-lightbox]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        img.src = mediaUrl(btn.getAttribute("data-lightbox"));
        dlg.showModal();
      });
    });
    var close = document.getElementById("lightbox-close");
    if (close) close.addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg) dlg.close();
    });
  }

  window.PortfolioPhotos = {
    MAX: MAX_PHOTOS,
    mediaUrl: mediaUrl,
    normalizeList: normalizeList,
    galleryHtml: galleryHtml,
    bindLightbox: bindLightbox
  };
})();
