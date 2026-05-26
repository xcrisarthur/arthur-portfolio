(function () {
  var state = null;
  var editors = { profile: null, about: null, ach: {} };

  function $(id) {
    return document.getElementById(id);
  }

  function uid(prefix) {
    return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
  }

  function linesToArray(text) {
    return String(text || "")
      .split("\n")
      .map(function (l) {
        return l.replace(/^\s*[-•]\s*/, "").trim();
      })
      .filter(Boolean);
  }

  function arrayToLines(arr) {
    return (arr || []).join("\n");
  }

  function photoErr(msg) {
    toast(msg, false);
  }

  function collectFromForm() {
    var ach = state && state.achievements ? state.achievements : {};
    return {
      profile: {
        name: $("f-name").value.trim(),
        nickname: $("f-nickname").value.trim(),
        tagline: $("f-tagline").value.trim(),
        interests: $("f-interests").value.trim(),
        bio: $("f-bio").value.trim(),
        email: $("f-email").value.trim(),
        phone: $("f-phone").value.trim(),
        location: $("f-location").value.trim(),
        linkedin: $("f-linkedin").value.trim(),
        github: $("f-github").value.trim(),
        photos: editors.profile ? editors.profile.getPhotos() : []
      },
      about: linesToArray($("f-about").value),
      aboutPhotos: editors.about ? editors.about.getPhotos() : [],
      experiences: readExperiences(),
      achievements: {
        photos: editors.ach.main ? editors.ach.main.getPhotos() : ach.photos || [],
        competitions: linesToArray($("f-competitions").value),
        competitionPhotos: editors.ach.competitions ? editors.ach.competitions.getPhotos() : [],
        certifications: linesToArray($("f-certifications").value),
        certificationPhotos: editors.ach.certifications ? editors.ach.certifications.getPhotos() : [],
        activities: linesToArray($("f-activities").value),
        activityPhotos: editors.ach.activities ? editors.ach.activities.getPhotos() : []
      },
      skills: readSkills()
    };
  }

  function fillForm(data) {
    state = data;
    var p = data.profile || {};
    $("f-name").value = p.name || "";
    $("f-nickname").value = p.nickname || "";
    $("f-tagline").value = p.tagline || "";
    $("f-bio").value = p.bio || "";
    $("f-interests").value = p.interests || "";
    $("f-email").value = p.email || "";
    $("f-phone").value = p.phone || "";
    $("f-location").value = p.location || "";
    $("f-linkedin").value = p.linkedin || "";
    $("f-github").value = p.github || "";
    $("f-about").value = arrayToLines(data.about);
    var ach = data.achievements || {};
    $("f-competitions").value = arrayToLines(ach.competitions);
    $("f-certifications").value = arrayToLines(ach.certifications);
    $("f-activities").value = arrayToLines(ach.activities);

    editors.profile = window.PortfolioPhotoEditor.mount($("photo-profile"), p.photos || [], {
      label: "Foto profil / hero",
      onError: photoErr
    });
    editors.about = window.PortfolioPhotoEditor.mount($("photo-about"), data.aboutPhotos || [], {
      label: "Foto tentang saya",
      onError: photoErr
    });
    editors.ach.main = window.PortfolioPhotoEditor.mount($("photo-ach-main"), ach.photos || [], {
      label: "Foto bagian prestasi (umum)",
      onError: photoErr
    });
    editors.ach.competitions = window.PortfolioPhotoEditor.mount($("photo-ach-comp"), ach.competitionPhotos || [], {
      label: "Foto kompetisi",
      onError: photoErr
    });
    editors.ach.certifications = window.PortfolioPhotoEditor.mount($("photo-ach-cert"), ach.certificationPhotos || [], {
      label: "Foto sertifikasi",
      onError: photoErr
    });
    editors.ach.activities = window.PortfolioPhotoEditor.mount($("photo-ach-act"), ach.activityPhotos || [], {
      label: "Foto aktivitas",
      onError: photoErr
    });

    renderExperienceEditor(data.experiences || []);
    renderSkillsEditor(data.skills || []);
  }

  function renderExperienceEditor(list) {
    var root = $("exp-list");
    root.innerHTML = "";
    list.forEach(function (exp, idx) {
      root.appendChild(expCard(exp, idx));
    });
  }

  function expCard(exp, idx) {
    var card = document.createElement("div");
    card.className = "editor-card";
    card.dataset.idx = String(idx);
    card.dataset.expId = exp.id || uid("exp");
    card.innerHTML =
      '<div class="editor-card__head">' +
      "<strong>Pengalaman #" +
      (idx + 1) +
      '</strong><button type="button" class="btn danger btn--sm" data-del-exp>Hapus</button></div>' +
      '<div class="photo-slot" data-photo-slot></div>' +
      '<label class="field"><span>Judul peran</span><input data-f="title" value="' +
      escAttr(exp.title) +
      '"></label>' +
      '<label class="field"><span>Perusahaan / institusi</span><input data-f="company" value="' +
      escAttr(exp.company) +
      '"></label>' +
      '<label class="field"><span>Periode</span><input data-f="period" value="' +
      escAttr(exp.period) +
      '"></label>' +
      '<label class="field field--full"><span>Poin kerja (satu baris = satu bullet)</span><textarea data-f="bullets" rows="4">' +
      escText(exp.bullets ? exp.bullets.join("\n") : "") +
      "</textarea></label>";
    card._photoEditor = window.PortfolioPhotoEditor.mount(card.querySelector("[data-photo-slot]"), exp.photos || [], {
      label: "Foto pengalaman",
      onError: photoErr
    });
    card.querySelector("[data-del-exp]").addEventListener("click", function () {
      card.remove();
    });
    return card;
  }

  function readExperiences() {
    var cards = $("exp-list").querySelectorAll(".editor-card");
    var out = [];
    cards.forEach(function (card) {
      out.push({
        id: card.dataset.expId || uid("exp"),
        title: card.querySelector('[data-f="title"]').value.trim(),
        company: card.querySelector('[data-f="company"]').value.trim(),
        period: card.querySelector('[data-f="period"]').value.trim(),
        bullets: linesToArray(card.querySelector('[data-f="bullets"]').value),
        photos: card._photoEditor ? card._photoEditor.getPhotos() : []
      });
    });
    return out;
  }

  function renderSkillsEditor(list) {
    var root = $("skill-list");
    root.innerHTML = "";
    list.forEach(function (sk, idx) {
      root.appendChild(skillCard(sk, idx));
    });
  }

  function skillCard(sk, idx) {
    var card = document.createElement("div");
    card.className = "editor-card";
    card.dataset.skillId = sk.id || uid("sk");
    card.innerHTML =
      '<div class="editor-card__head"><strong>Keahlian #' +
      (idx + 1) +
      '</strong><button type="button" class="btn danger btn--sm" data-del-skill>Hapus</button></div>' +
      '<label class="field"><span>Kategori</span><input data-f="category" value="' +
      escAttr(sk.category) +
      '"></label>' +
      '<label class="field field--full"><span>Item (pisahkan dengan ·)</span><textarea data-f="items" rows="2">' +
      escText(sk.items) +
      "</textarea></label>";
    card.querySelector("[data-del-skill]").addEventListener("click", function () {
      card.remove();
    });
    return card;
  }

  function readSkills() {
    var cards = $("skill-list").querySelectorAll(".editor-card");
    var out = [];
    cards.forEach(function (card) {
      out.push({
        id: card.dataset.skillId || uid("sk"),
        category: card.querySelector('[data-f="category"]').value.trim(),
        items: card.querySelector('[data-f="items"]').value.trim()
      });
    });
    return out;
  }

  function escAttr(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }

  function escText(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }

  function toast(msg, ok) {
    var t = $("toast");
    t.textContent = msg;
    t.className = "toast toast--show" + (ok === false ? " toast--err" : " toast--ok");
    clearTimeout(toast._tm);
    toast._tm = setTimeout(function () {
      t.className = "toast";
    }, 3200);
  }

  function showLogin() {
    $("login-screen").hidden = false;
    $("admin-screen").hidden = true;
  }

  function showAdmin() {
    $("login-screen").hidden = true;
    $("admin-screen").hidden = false;
  }

  function bindTabs() {
    document.querySelectorAll("[data-tab]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var tab = btn.getAttribute("data-tab");
        document.querySelectorAll("[data-tab]").forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });
        document.querySelectorAll("[data-panel]").forEach(function (p) {
          p.hidden = p.getAttribute("data-panel") !== tab;
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    bindTabs();

    $("login-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var user = $("login-user").value.trim();
      var pass = $("login-pass").value;
      $("login-btn").disabled = true;
      window.PortfolioApi.login(user, pass)
        .then(function () {
          return window.PortfolioApi.getPortfolio();
        })
        .then(function (data) {
          fillForm(data);
          showAdmin();
          toast("Login berhasil.");
        })
        .catch(function () {
          toast("Username atau password salah.", false);
        })
        .finally(function () {
          $("login-btn").disabled = false;
        });
    });

    $("btn-logout").addEventListener("click", function () {
      window.PortfolioApi.logout();
      showLogin();
    });

    $("btn-save").addEventListener("click", function () {
      var data = collectFromForm();
      $("btn-save").disabled = true;
      window.PortfolioApi.savePortfolio(data)
        .then(function () {
          state = data;
          toast("Perubahan disimpan.");
        })
        .catch(function (err) {
          toast(err.status === 401 ? "Sesi habis, login ulang." : "Gagal menyimpan.", false);
          if (err.status === 401) showLogin();
        })
        .finally(function () {
          $("btn-save").disabled = false;
        });
    });

    $("btn-add-exp").addEventListener("click", function () {
      $("exp-list").appendChild(
        expCard({ id: uid("exp"), title: "", company: "", period: "", bullets: [], photos: [] }, $("exp-list").children.length)
      );
    });

    $("btn-add-skill").addEventListener("click", function () {
      $("skill-list").appendChild(skillCard({ id: uid("sk"), category: "", items: "" }, $("skill-list").children.length));
    });

    if (window.PortfolioApi.getToken()) {
      window.PortfolioApi.checkAuth()
        .then(function () {
          return window.PortfolioApi.getPortfolio();
        })
        .then(function (data) {
          fillForm(data);
          showAdmin();
        })
        .catch(function () {
          window.PortfolioApi.logout();
          showLogin();
        });
    } else {
      showLogin();
    }
  });
})();
