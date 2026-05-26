(function () {
  var C = function () {
    return window.PortfolioCore;
  };
  var Ph = function () {
    return window.PortfolioPhotos;
  };

  function esc(s) {
    return C() ? C().esc(s) : String(s || "");
  }

  function splitItems(str) {
    return C() ? C().splitItems(str) : [];
  }

  function inferTags(exp) {
    var text = (exp.title + " " + (exp.bullets || []).join(" ")).toLowerCase();
    var tags = [];
    if (/network|mikrotik|infrastruktur|jaringan/i.test(text)) tags.push("Networking");
    if (/laravel|next|web|developer|programmer|full.?stack/i.test(text)) tags.push("Full Stack");
    if (/security|red team|penetration|nmap|metasploit/i.test(text)) tags.push("Security");
    if (/support|troubleshoot|lab/i.test(text)) tags.push("IT Support");
    if (/erp|pos|digital/i.test(text)) tags.push("Digitalisasi");
    if (!tags.length) tags.push("Professional");
    return tags.slice(0, 3);
  }

  function yearSpan(period) {
    if (!period) return "—";
    var m = String(period).match(/(\d{4})/g);
    if (!m) return period;
    if (m.length >= 2) return m[0] + " – " + m[m.length - 1];
    return m[0];
  }

  function renderProfile(p, expCount) {
    var el = document.getElementById("hero");
    if (!el || !p) return;
    if (C()) {
      C().setBrandName(p);
      C().updatePageMeta(p);
    }

    var photoAlt = p.name ? "Foto profil " + p.name : "Foto profil";
    var photos = Ph() ? Ph().galleryHtml(p.photos, { single: true, altPrefix: photoAlt }) : "";
    var bio = C() ? C().profileBio(p) : "";

    el.innerHTML =
      '<div class="hero__inner">' +
      '<div class="hero__copy">' +
      "<h1>Halo, saya " +
      esc(p.name) +
      "</h1>" +
      '<p class="hero__role">' +
      esc(p.tagline) +
      "</p>" +
      '<p class="hero__lead">' +
      esc(bio) +
      "</p>" +
      '<div class="hero__actions">' +
      '<a class="btn btn--primary" href="/about.html">Tentang saya</a>' +
      '<a class="btn btn--ghost" href="#pengalaman">Pengalaman</a>' +
      "</div>" +
      (p.location ? '<p class="hero__meta">' + esc(p.location) + (p.interests ? " · " + esc(p.interests) : "") + "</p>" : "") +
      "</div>" +
      (photos ? '<div class="hero__visual">' + photos + "</div>" : "") +
      "</div>";
    el.removeAttribute("aria-busy");
    if (Ph()) Ph().bindLightbox(el);
    if (C()) C().renderCta(p);
  }

  function renderWorkCard(e) {
    var tags = inferTags(e);
    var tagHtml = tags
      .map(function (t) {
        return '<span class="work-card__tag">' + esc(t) + "</span>";
      })
      .join("");
    var summary = e.bullets && e.bullets[0] ? esc(e.bullets[0]) : "";
    return (
      '<article class="work-card">' +
      '<p class="work-card__meta">' +
      esc(yearSpan(e.period)) +
      "</p>" +
      '<div class="work-card__tags">' +
      tagHtml +
      "</div>" +
      "<h3>" +
      esc(e.title) +
      "</h3>" +
      '<p class="work-card__company">' +
      esc(e.company) +
      "</p>" +
      "<p>" +
      summary +
      "</p>" +
      "</article>"
    );
  }

  function renderExperiences(list) {
    var featured = document.getElementById("experience-featured");
    var timeline = document.getElementById("experience-list");
    var expand = document.getElementById("timeline-expand");
    if (!featured) return;
    if (!list || !list.length) {
      featured.innerHTML = '<p class="muted">Belum ada pengalaman.</p>';
      if (expand) expand.hidden = true;
      return;
    }
    featured.innerHTML = list.slice(0, 3).map(renderWorkCard).join("");
    if (timeline) {
      timeline.innerHTML = list
        .map(function (e) {
          var photos = Ph() ? Ph().galleryHtml(e.photos, { compact: true, altPrefix: e.title + " — " }) : "";
          var bullets =
            e.bullets && e.bullets.length
              ? "<ul>" +
                e.bullets
                  .map(function (b) {
                    return "<li>" + esc(b) + "</li>";
                  })
                  .join("") +
                "</ul>"
              : "";
          return (
            '<article class="timeline__item">' +
            '<span class="timeline__dot" aria-hidden="true"></span>' +
            '<div class="timeline__body">' +
            (photos ? '<div class="timeline__photos">' + photos + "</div>" : "") +
            "<h3>" +
            esc(e.title) +
            "</h3>" +
            '<p class="timeline__meta">' +
            esc(e.company) +
            " · " +
            esc(e.period) +
            "</p>" +
            bullets +
            "</div></article>"
          );
        })
        .join("");
      if (Ph()) Ph().bindLightbox(timeline);
    }
    if (expand) expand.hidden = list.length <= 3;
  }

  function renderAchievements(a) {
    a = a || {};
    var sectionEl = document.getElementById("ach-section-photos");
    if (sectionEl && Ph()) {
      var main = Ph().galleryHtml(a.photos, { altPrefix: "Prestasi — " });
      sectionEl.innerHTML = main || "";
      sectionEl.hidden = !main;
      if (main) Ph().bindLightbox(sectionEl);
    }
    var blocks = [
      { id: "ach-competitions", title: "Kompetisi", items: a.competitions, photos: a.competitionPhotos },
      { id: "ach-certifications", title: "Sertifikasi", items: a.certifications, photos: a.certificationPhotos },
      { id: "ach-activities", title: "Aktivitas", items: a.activities, photos: a.activityPhotos }
    ];
    blocks.forEach(function (b) {
      var el = document.getElementById(b.id);
      if (!el) return;
      var gallery = Ph() ? Ph().galleryHtml(b.photos, { compact: true, altPrefix: b.title + " — " }) : "";
      var list =
        !b.items || !b.items.length
          ? ""
          : "<ul>" +
            b.items
              .map(function (x) {
                return "<li>" + esc(x) + "</li>";
              })
              .join("") +
            "</ul>";
      if (!gallery && !list) {
        el.innerHTML = "<h3>" + esc(b.title) + '</h3><p class="muted">—</p>';
        return;
      }
      el.innerHTML =
        "<h3>" + esc(b.title) + "</h3>" + (gallery ? '<div class="ach-card__photos">' + gallery + "</div>" : "") + list;
      if (Ph()) Ph().bindLightbox(el);
    });
  }

  function renderSkills(skills) {
    var el = document.getElementById("skills-grid");
    if (!el) return;
    if (!skills || !skills.length) {
      el.innerHTML = '<p class="muted">Belum ada keahlian.</p>';
      return;
    }
    el.innerHTML = skills
      .map(function (s) {
        var tags = splitItems(s.items)
          .map(function (t) {
            return '<span class="tag">' + esc(t) + "</span>";
          })
          .join("");
        return (
          '<div class="skill-card"><h3>' +
          esc(s.category) +
          '</h3><div class="skill-card__tags">' +
          tags +
          "</div></div>"
        );
      })
      .join("");
  }

  window.PortfolioApp = {
    render: function (data) {
      if (!data) return;
      var exps = data.experiences || [];
      renderProfile(data.profile, exps.length);
      if (window.PortfolioCounters) {
        window.PortfolioCounters.render(
          document.getElementById("stats-grid"),
          document.getElementById("stats"),
          data
        );
      }
      if (C()) C().renderAboutTeaser(data.about);
      renderExperiences(exps);
      renderAchievements(data.achievements);
      renderSkills(data.skills);
    },
    load: function () {
      return window.PortfolioApi.getPortfolio()
        .then(function (data) {
          window.PortfolioApp.render(data);
          return data;
        })
        .catch(function () {
          if (C()) C().showError("Gagal memuat portfolio. Pastikan API berjalan di server ini.");
        });
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("hero")) window.PortfolioApp.load();
  });
})();
