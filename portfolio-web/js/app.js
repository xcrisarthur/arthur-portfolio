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
    if (/network|mikrotik|infrastruktur|jaringan/i.test(text)) tags.push(tr("tag.networking"));
    if (/laravel|next|web|developer|programmer|full.?stack/i.test(text)) tags.push(tr("tag.fullstack"));
    if (/security|red team|penetration|nmap|metasploit/i.test(text)) tags.push(tr("tag.security"));
    if (/support|troubleshoot|lab/i.test(text)) tags.push(tr("tag.support"));
    if (/erp|pos|digital/i.test(text)) tags.push(tr("tag.digital"));
    if (!tags.length) tags.push(tr("tag.professional"));
    return tags.slice(0, 3);
  }

  function formatPeriod(period) {
    var I = window.PortfolioI18n;
    return I ? I.formatPeriod(period) : period || "—";
  }

  function tr(key) {
    var I = window.PortfolioI18n;
    return I ? I.t(key) : key;
  }

  function renderProfile(p, expCount) {
    var el = document.getElementById("hero");
    if (!el || !p) return;
    if (C()) {
      C().setBrandName(p);
      C().updatePageMeta(p);
    }

    var photoAlt = p.name ? tr("photo.profile") + " " + p.name : tr("photo.profile");
    var photos = Ph()
      ? Ph().stackHtml(p.photos, { altPrefix: photoAlt, albumTitle: tr("photo.profileOf") + " " + (p.name || "") })
      : "";
    var bio = C() ? C().profileBio(p) : "";

    el.innerHTML =
      '<div class="hero__inner reveal">' +
      '<div class="hero__copy">' +
      "<h1>" +
      esc(tr("hero.greeting")) +
      " " +
      esc(p.name) +
      "</h1>" +
      '<p class="hero__role">' +
      esc(p.tagline) +
      "</p>" +
      '<p class="hero__lead">' +
      esc(bio) +
      "</p>" +
      '<div class="hero__actions">' +
      '<a class="btn btn--primary" href="/about.html">' +
      esc(tr("hero.aboutBtn")) +
      "</a>" +
      '<a class="btn btn--ghost" href="#pengalaman">' +
      esc(tr("hero.experienceBtn")) +
      "</a>" +
      "</div>" +
      (p.location ? '<p class="hero__meta">' + esc(p.location) + (p.interests ? " · " + esc(p.interests) : "") + "</p>" : "") +
      "</div>" +
      (photos ? '<div class="hero__visual">' + photos + "</div>" : "") +
      "</div>";
    el.removeAttribute("aria-busy");
    if (Ph()) Ph().bindLightbox(el);
    if (C()) C().renderCta(p);
    if (window.PortfolioReveal) window.PortfolioReveal.observe(el);
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
      '<article class="work-card reveal">' +
      '<p class="work-card__meta">' +
      esc(formatPeriod(e.period)) +
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
      featured.innerHTML = '<p class="muted">' + esc(tr("empty.experience")) + "</p>";
      if (expand) expand.hidden = true;
      return;
    }
    featured.innerHTML = list.slice(0, 3).map(renderWorkCard).join("");
    if (window.PortfolioReveal) window.PortfolioReveal.observe(featured);
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
            esc(formatPeriod(e.period)) +
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
      var main = Ph().galleryHtml(a.photos, { altPrefix: tr("ach.altPrefix") + " " });
      sectionEl.innerHTML = main || "";
      sectionEl.hidden = !main;
      if (main) Ph().bindLightbox(sectionEl);
    }
    var blocks = [
      { id: "ach-competitions", title: tr("ach.competitions"), items: a.competitions, photos: a.competitionPhotos },
      { id: "ach-certifications", title: tr("ach.certifications"), items: a.certifications, photos: a.certificationPhotos },
      { id: "ach-activities", title: tr("ach.activities"), items: a.activities, photos: a.activityPhotos }
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
      el.innerHTML = '<p class="muted">' + esc(tr("empty.skills")) + "</p>";
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
          '<div class="skill-card reveal"><h3>' +
          esc(s.category) +
          '</h3><div class="skill-card__tags">' +
          tags +
          "</div></div>"
        );
      })
      .join("");
    if (window.PortfolioReveal) window.PortfolioReveal.observe(el);
  }

  function projectStatusLabel(status) {
    var map = {
      live: tr("status.live"),
      internal: tr("status.internal"),
      demo: tr("status.demo"),
      development: tr("status.development")
    };
    return map[status] || tr("status.live");
  }

  function renderProjectCard(p) {
    var tags = splitItems(p.tags);
    var tagHtml = tags
      .map(function (t) {
        return '<span class="work-card__tag">' + esc(t) + "</span>";
      })
      .join("");
    var actions = "";
    if (p.urlDemo) {
      actions +=
        '<a class="btn btn--ghost btn--sm" href="' +
        esc(p.urlDemo) +
        '" target="_blank" rel="noopener noreferrer">' +
        esc(tr("btn.demo")) +
        "</a>";
    }
    if (p.repo) {
      actions +=
        '<a class="btn btn--ghost btn--sm" href="' +
        esc(p.repo) +
        '" target="_blank" rel="noopener noreferrer">' +
        esc(tr("btn.github")) +
        "</a>";
    }
  return (
      '<article class="work-card project-card reveal">' +
      '<div class="project-card__head">' +
      '<span class="project-card__status project-card__status--' +
      esc(p.status || "live") +
      '">' +
      esc(projectStatusLabel(p.status)) +
      "</span>" +
      "</div>" +
      (tagHtml ? '<div class="work-card__tags">' + tagHtml + "</div>" : "") +
      "<h3>" +
      esc(p.title) +
      "</h3>" +
      "<p>" +
      esc(p.summary || "") +
      "</p>" +
      (actions ? '<div class="project-card__actions">' + actions + "</div>" : "") +
      "</article>"
    );
  }

  function renderProjects(list) {
    var el = document.getElementById("projects-grid");
    if (!el) return;
    if (!list || !list.length) {
      el.innerHTML = '<p class="muted">' + esc(tr("empty.projects")) + "</p>";
      return;
    }
    var featured = list.filter(function (p) {
      return p.featured;
    });
    var visible = (featured.length ? featured : list).slice().sort(function (a, b) {
      return (a.order || 0) - (b.order || 0);
    });
    el.innerHTML = visible.map(renderProjectCard).join("");
    if (window.PortfolioReveal) window.PortfolioReveal.observe(el);
  }

  window.PortfolioApp = {
    render: function (data) {
      if (!data) return;
      if (window.PortfolioI18n) window.PortfolioI18n.setData(data);
      var view = window.PortfolioI18n ? window.PortfolioI18n.localizeData(data) : data;
      var exps = view.experiences || [];
      renderProfile(view.profile, exps.length);
      if (window.PortfolioCounters) {
        window.PortfolioCounters.render(
          document.getElementById("stats-grid"),
          document.getElementById("stats"),
          view
        );
      }
      if (C()) C().renderAboutTeaser(view.about);
      renderExperiences(exps);
      renderProjects(view.projects);
      renderAchievements(view.achievements);
      renderSkills(view.skills);
      if (window.PortfolioReveal) {
        window.PortfolioReveal.observe(document.getElementById("ach-grid"));
        window.PortfolioReveal.observe(document.getElementById("skills-grid"));
        window.PortfolioReveal.observeAll();
      }
    },
    load: function () {
      return window.PortfolioApi.getPortfolio()
        .then(function (data) {
          window.PortfolioApp.render(data);
          return data;
        })
        .catch(function () {
          if (C()) C().showError(tr("error.load"));
        });
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("hero")) window.PortfolioApp.load();
  });
})();
