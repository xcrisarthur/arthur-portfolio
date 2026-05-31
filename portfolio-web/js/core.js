(function () {
  var Ph = function () {
    return window.PortfolioPhotos;
  };

  var DEFAULT_BIO = function () {
    var I = window.PortfolioI18n;
    return I ? I.t("default.bio") : "Saya merancang dan mengoperasikan sistem yang stabil serta aman — mulai dari infrastruktur jaringan, pengembangan web, hingga keamanan siber — agar operasional tim dan bisnis berjalan tanpa hambatan teknis.";
  };

  function tr(key) {
    var I = window.PortfolioI18n;
    return I ? I.t(key) : key;
  }

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function splitItems(str) {
    return String(str || "")
      .split(/·|\|/)
      .map(function (x) {
        return x.trim();
      })
      .filter(Boolean);
  }

  function setBrandName(profile) {
    var brand = document.getElementById("nav-brand");
    var footerName = document.getElementById("footer-name");
    var footerLocation = document.getElementById("footer-location");
    if (!profile) return;
    if (brand) brand.textContent = profile.nickname || profile.name.split(" ")[0] || "Portfolio";
    if (footerName) footerName.textContent = profile.name;
    if (footerLocation) footerLocation.textContent = profile.location || "Indonesia";
  }

  function profileBio(profile) {
    if (!profile) return DEFAULT_BIO();
    return String(profile.bio || "").trim() || DEFAULT_BIO();
  }

  function hasContact(profile) {
    if (!profile) return false;
    return !!(profile.email || profile.phone || profile.linkedin || profile.github);
  }

  function renderCta(p, containerId) {
    var actions = document.getElementById(containerId || "cta-actions");
    if (!actions || !p) return;
    var html = "";
    if (p.email) html += '<a class="btn btn--primary" href="mailto:' + esc(p.email) + '">' + esc(tr("cta.email")) + "</a>";
    if (p.linkedin) html += '<a class="btn btn--ghost" href="' + esc(p.linkedin) + '" target="_blank" rel="noopener noreferrer">LinkedIn</a>';
    if (p.github) html += '<a class="btn btn--ghost" href="' + esc(p.github) + '" target="_blank" rel="noopener noreferrer">GitHub</a>';
    if (p.phone) html += '<a class="btn btn--ghost" href="tel:' + esc(p.phone) + '">' + esc(p.phone) + "</a>";
    if (!html) {
      html =
        '<p class="cta-empty">' + esc(tr("cta.empty")) + "</p>";
    }
    actions.innerHTML = html;
  }

  function setMeta(name, content, isProperty) {
    if (!content) return;
    var sel = isProperty ? 'meta[property="' + name + '"]' : 'meta[name="' + name + '"]';
    var el = document.querySelector(sel);
    if (!el) {
      el = document.createElement("meta");
      if (isProperty) el.setAttribute("property", name);
      else el.setAttribute("name", name);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function updatePageMeta(profile) {
    if (!profile) return;
    var title = (profile.name ? profile.name + " — " : "") + "Portfolio";
    document.title = title;
    var desc =
      (profile.tagline || "") +
      (profile.location ? " · " + profile.location : "");
    setMeta("description", desc.trim());
    setMeta("og:title", title, true);
    setMeta("og:description", desc.trim(), true);
  }

  function aboutParagraphsHtml(paragraphs) {
    if (!paragraphs || !paragraphs.length) return '<p class="muted">' + esc(tr("about.empty")) + "</p>";
    return paragraphs
      .map(function (p) {
        return "<p>" + esc(p) + "</p>";
      })
      .join("");
  }

  function renderAboutTeaser(paragraphs) {
    var el = document.getElementById("about-teaser");
    if (!el) return;
    var first = paragraphs && paragraphs[0] ? esc(paragraphs[0]) : tr("about.teaser.empty");
    el.innerHTML =
      '<p class="about-teaser__text reveal">' +
      first +
      '</p><a class="about-block__link reveal" href="/about.html">' +
      esc(tr("about.teaser.link")) +
      "</a>";
    if (window.PortfolioReveal) window.PortfolioReveal.observe(el);
  }

  function renderAboutFull(paragraphs, aboutPhotos, profile) {
    var story = document.getElementById("about-story");
    var side = document.getElementById("about-sidebar");
    if (!story) return;

    var gallery = Ph()
      ? Ph().galleryHtml(aboutPhotos, { single: true, altPrefix: profile && profile.name ? profile.name + " — " : "" })
      : "";
    story.innerHTML =
      (gallery ? '<div class="about-page__photo">' + gallery + "</div>" : "") +
      '<div class="about-page__story">' +
      aboutParagraphsHtml(paragraphs) +
      "</div>";

    if (side && profile) {
      side.innerHTML =
        '<div class="about-sidebar__card">' +
        "<h3>" + esc(tr("about.sidebar.title")) + "</h3>" +
        "<ul>" +
        (profile.location ? "<li><span>" + esc(tr("about.sidebar.location")) + "</span><strong>" + esc(profile.location) + "</strong></li>" : "") +
        (profile.tagline ? "<li><span>" + esc(tr("about.sidebar.focus")) + "</span><strong>" + esc(profile.tagline) + "</strong></li>" : "") +
        (profile.interests ? "<li><span>" + esc(tr("about.sidebar.interests")) + "</span><strong>" + esc(profile.interests) + "</strong></li>" : "") +
        "</ul></div>";
    }
    if (Ph()) Ph().bindLightbox(story);
  }

  function renderPrinciples() {
    var el = document.getElementById("about-principles");
    if (!el) return;
    var I = window.PortfolioI18n;
    var localized = I && I.getPrinciples ? I.getPrinciples() : null;
    var items = localized || [
      {
        title: "Stabilitas di atas fitur",
        text: "Sistem harus andal dulu — downtime dan data korup lebih mahal daripada fitur baru yang terburu-buru."
      },
      {
        title: "Kejelasan di atas kompleksitas",
        text: "Kode dan infrastruktur yang mudah dipahami tim mengurangi onboarding dan risiko saat scaling."
      },
      {
        title: "Konteks bisnis penting",
        text: "Keputusan teknis selalu saya hubungkan dengan dampak operasional: kecepatan tim, biaya, dan keamanan."
      },
      {
        title: "Belajar terus-menerus",
        text: "TI berubah cepat — dari red team hingga ERP, saya terus mengasah skill agar solusi tetap relevan."
      }
    ];
    el.innerHTML = items
      .map(function (it) {
        return (
          '<article class="principle-card"><h3>' +
          esc(it.title) +
          "</h3><p>" +
          esc(it.text) +
          "</p></article>"
        );
      })
      .join("");
  }

  function renderStackCloud(skills) {
    var el = document.getElementById("about-stack");
    if (!el) return;
    if (!skills || !skills.length) {
      el.innerHTML = '<p class="muted">—</p>';
      return;
    }
    var tags = [];
    skills.forEach(function (s) {
      splitItems(s.items).forEach(function (t) {
        if (tags.indexOf(t) < 0) tags.push(t);
      });
    });
    el.innerHTML = tags
      .map(function (t) {
        return '<span class="tag tag--lg">' + esc(t) + "</span>";
      })
      .join("");
  }

  function showError(msg) {
    var el = document.getElementById("load-error");
    if (el) {
      el.hidden = false;
      el.textContent = msg;
    }
    var hero = document.getElementById("hero");
    if (hero) hero.removeAttribute("aria-busy");
  }

  window.PortfolioCore = {
    esc: esc,
    splitItems: splitItems,
    setBrandName: setBrandName,
    profileBio: profileBio,
    hasContact: hasContact,
    renderCta: renderCta,
    updatePageMeta: updatePageMeta,
    renderAboutTeaser: renderAboutTeaser,
    renderAboutFull: renderAboutFull,
    renderPrinciples: renderPrinciples,
    renderStackCloud: renderStackCloud,
    showError: showError
  };
})();
