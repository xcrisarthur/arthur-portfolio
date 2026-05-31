(function () {
  var MAX = window.PortfolioPhotos ? window.PortfolioPhotos.MAX : 10;

  function readFileAsDataUrl(file) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () { resolve(r.result); };
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  function mountPhotoEditor(container, photos, opts) {
    opts = opts || {};
    var list = window.PortfolioPhotos.normalizeList(photos).slice();
    container._photos = list;
    var label = opts.label || "Foto";
    var hint = opts.hint || "Maks. " + MAX + " foto · JPG, PNG, WebP, GIF";

    function sync() {
      container._photos.length = 0;
      list.forEach(function (p) { container._photos.push(p); });
    }

    function render() {
      list = window.PortfolioPhotos.normalizeList(list);
      sync();
      container.innerHTML =
        '<div class="photo-editor">' +
        '<div class="photo-editor__head"><span class="photo-editor__label">' +
        label +
        '</span><span class="photo-editor__count">' +
        list.length +
        "/" +
        MAX +
        "</span></div>" +
        '<p class="hint photo-editor__hint">' +
        hint +
        "</p>" +
        '<div class="photo-editor__grid" data-grid></div>' +
        '<label class="photo-editor__upload' +
        (list.length >= MAX ? " is-disabled" : "") +
        '"><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" data-file hidden' +
        (list.length >= MAX ? " disabled" : "") +
        '><span>+ Tambah foto</span></label></div>';
      var grid = container.querySelector("[data-grid]");
      list.forEach(function (p) {
        var cell = document.createElement("div");
        cell.className = "photo-editor__thumb";
        cell.innerHTML =
          '<img src="' +
          window.PortfolioPhotos.mediaUrl(p.id) +
          '" alt=""><button type="button" class="photo-editor__del" data-id="' +
          p.id +
          '" title="Hapus foto">×</button>';
        grid.appendChild(cell);
      });
      bindEvents();
    }

    function bindEvents() {
      var input = container.querySelector("[data-file]");
      if (input) {
        input.addEventListener("change", function () {
          var file = input.files && input.files[0];
          input.value = "";
          if (!file) return;
          if (list.length >= MAX) {
            opts.onError && opts.onError("Maksimum " + MAX + " foto.");
            return;
          }
          readFileAsDataUrl(file)
            .then(function (dataUrl) {
              return window.PortfolioApi.uploadMedia(dataUrl);
            })
            .then(function (res) {
              list.push({ id: res.id });
              render();
              opts.onChange && opts.onChange(container._photos);
            })
            .catch(function (err) {
              var msg = (err.data && err.data.error) || err.message || "Gagal mengunggah.";
              opts.onError && opts.onError(msg);
            });
        });
      }
      container.querySelectorAll(".photo-editor__del").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var id = btn.getAttribute("data-id");
          if (!id || !confirm("Hapus foto ini?")) return;
          window.PortfolioApi.deleteMedia(id)
            .then(function () {
              list = list.filter(function (x) { return x.id !== id; });
              render();
              opts.onChange && opts.onChange(container._photos);
            })
            .catch(function () {
              opts.onError && opts.onError("Gagal menghapus foto.");
            });
        });
      });
    }

    render();
    return {
      getPhotos: function () {
        return container._photos.slice();
      }
    };
  }

  window.PortfolioPhotoEditor = { mount: mountPhotoEditor };
})();
