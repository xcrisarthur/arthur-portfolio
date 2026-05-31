(function () {
  var MAX_PHOTOS = 10;

  function tr(key) {
    var I = window.PortfolioI18n;
    return I ? I.t(key) : key;
  }

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

  function stackHtml(photos, opts) {
    opts = opts || {};
    var list = normalizeList(photos);
    if (!list.length) return "";
    if (list.length === 1) {
      return galleryHtml(list, { single: true, altPrefix: opts.altPrefix });
    }
    var maxCards = Math.min(4, list.length);
    var ids = list.map(function (p) {
      return p.id;
    });
    var label = list.length + " " + tr("photo.viewAll");
    var html =
      '<button type="button" class="photo-stack" data-photo-stack="' +
      esc(JSON.stringify(ids)) +
      '" data-stack-label="' +
      esc(opts.albumTitle || tr("photo.profile")) +
      '" aria-label="' +
      esc(label) +
      '">';
    for (var i = 0; i < maxCards; i++) {
      var p = list[i];
      html +=
        '<span class="photo-stack__card" style="--depth:' +
        i +
        '" aria-hidden="true"><img src="' +
        esc(mediaUrl(p.id)) +
        '" alt="" loading="lazy" decoding="async"></span>';
    }
    html +=
      '<span class="photo-stack__badge" aria-hidden="true">' +
      list.length +
      " " +
      tr("photo.count") +
      "</span></button>";
    return html;
  }

  function openLightboxAlbum(ids, title) {
    var dlg = document.getElementById("lightbox");
    var single = document.getElementById("lightbox-single");
    var album = document.getElementById("lightbox-album");
    var grid = document.getElementById("lightbox-album-grid");
    var titleEl = document.getElementById("lightbox-album-title");
    if (!dlg || !album || !grid) return;
    if (single) single.hidden = true;
    album.hidden = false;
    if (titleEl) titleEl.textContent = title || tr("photo.profile");
    grid.innerHTML = ids
      .map(function (id, i) {
        return (
          '<button type="button" class="lightbox__album-item" data-lightbox="' +
          esc(id) +
          '" aria-label="' +
          tr("photo.viewN") +
          " " +
          (i + 1) +
          '"><img src="' +
          esc(mediaUrl(id)) +
          '" alt=""></button>'
        );
      })
      .join("");
    grid.querySelectorAll("[data-lightbox]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        openLightboxSingle(btn.getAttribute("data-lightbox"));
      });
    });
    dlg.showModal();
  }

  function openLightboxSingle(id) {
    var dlg = document.getElementById("lightbox");
    var img = document.getElementById("lightbox-img");
    var single = document.getElementById("lightbox-single");
    var album = document.getElementById("lightbox-album");
    if (!dlg || !img) return;
    if (album) album.hidden = true;
    if (single) single.hidden = false;
    img.src = mediaUrl(id);
    dlg.showModal();
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
      var alt = esc((opts.altPrefix || tr("photo.generic")) + (i + 1));
      html +=
        '<button type="button" class="photo-gallery__item" data-lightbox="' +
        esc(p.id) +
        '" aria-label="' +
        tr("photo.viewN") +
        " " +
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
    if (!dlg) return;
    root.querySelectorAll("[data-photo-stack]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var raw = btn.getAttribute("data-photo-stack");
        var ids = [];
        try {
          ids = JSON.parse(raw || "[]");
        } catch (_) {
          ids = [];
        }
        if (!ids.length) return;
        openLightboxAlbum(ids, btn.getAttribute("data-stack-label") || tr("photo.profile"));
      });
    });
    root.querySelectorAll("[data-lightbox]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openLightboxSingle(btn.getAttribute("data-lightbox"));
      });
    });
    var close = document.getElementById("lightbox-close");
    if (close) close.addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg) dlg.close();
    });
    dlg.addEventListener("close", function () {
      var album = document.getElementById("lightbox-album");
      var single = document.getElementById("lightbox-single");
      if (album) album.hidden = true;
      if (single) single.hidden = false;
    });
  }

  window.PortfolioPhotos = {
    MAX: MAX_PHOTOS,
    mediaUrl: mediaUrl,
    normalizeList: normalizeList,
    galleryHtml: galleryHtml,
    stackHtml: stackHtml,
    bindLightbox: bindLightbox
  };
})();
