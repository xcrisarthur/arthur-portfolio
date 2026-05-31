(function () {
  var STORAGE_KEY = "portfolio-locale";
  var DEFAULT_LOCALE = "id";

  var MONTHS = {
    id: {
      Jan: "Jan", Feb: "Feb", Mar: "Mar", Apr: "Apr", Mei: "Mei", Jun: "Jun",
      Jul: "Jul", Agu: "Agu", Sep: "Sep", Okt: "Okt", Nov: "Nov", Des: "Des"
    },
    en: {
      Jan: "Jan", Feb: "Feb", Mar: "Mar", Apr: "Apr", Mei: "May", Jun: "Jun",
      Jul: "Jul", Agu: "Aug", Sep: "Sep", Okt: "Oct", Nov: "Nov", Des: "Dec"
    },
    ja: {
      Jan: "1月", Feb: "2月", Mar: "3月", Apr: "4月", Mei: "5月", Jun: "6月",
      Jul: "7月", Agu: "8月", Sep: "9月", Okt: "10月", Nov: "11月", Des: "12月"
    }
  };

  var MESSAGES = {
    id: {
      "nav.about": "Tentang",
      "nav.experience": "Pengalaman",
      "nav.projects": "Proyek",
      "nav.achievements": "Prestasi",
      "nav.skills": "Keahlian",
      "nav.contact": "Kontak",
      "nav.brand": "Portfolio",
      "nav.menu.open": "Buka menu",
      "nav.home": "Beranda portfolio",
      "hero.greeting": "Perkenalkan, saya",
      "hero.aboutBtn": "Profil lengkap",
      "hero.experienceBtn": "Riwayat pengalaman",
      "section.about": "Tentang Saya",
      "section.experience": "Pengalaman Terpilih",
      "section.experience.lead":
        "Peran dan proyek strategis yang membentuk pendekatan saya dalam merancang dan mengoperasikan sistem teknologi.",
      "section.projects": "Proyek & Aplikasi",
      "section.projects.lead":
        "Solusi perangkat lunak dan infrastruktur yang saya kembangkan — mulai dari ERP, POS, hingga homelab.",
      "section.achievements": "Prestasi & Sertifikasi",
      "section.skills": "Keahlian & Stack",
      "section.skills.lead":
        "Teknologi dan domain yang saya gunakan dalam pekerjaan sehari-hari.",
      "section.contact": "Kolaborasi & Kontak",
      "section.contact.lead":
        "Tertarik mendiskusikan proyek, konsultasi TI, atau kolaborasi teknis? Silakan hubungi saya.",
      "timeline.expand": "Lihat seluruh riwayat pengalaman",
      "loading": "Memuat…",
      "empty.experience": "Belum ada data pengalaman.",
      "empty.projects": "Belum ada proyek.",
      "empty.skills": "Belum ada data keahlian.",
      "ach.competitions": "Kompetisi",
      "ach.certifications": "Sertifikasi",
      "ach.activities": "Aktivitas",
      "about.teaser.link": "Baca profil lengkap →",
      "about.teaser.empty": "Profil sedang diperbarui.",
      "cta.email": "Kirim email",
      "cta.empty":
        "Informasi kontak belum tersedia. Silakan hubungi melalui jaringan profesional atau lengkapi data kontak melalui panel admin.",
      "error.load": "Gagal memuat portfolio. Pastikan API berjalan di server ini.",
      "lightbox.close": "Tutup",
      "period.present": "Sekarang",
      "status.live": "Produksi",
      "status.internal": "Internal",
      "status.demo": "Demo",
      "status.development": "Dalam pengembangan",
      "btn.demo": "Demo",
      "btn.github": "GitHub",
      "stat.years": "Tahun pengalaman TI & pengembangan",
      "stat.roles": "Peran & proyek tercatat",
      "stat.awards": "Penghargaan kompetisi web",
      "stat.gpa": "IPK Cum Laude · Teknik Informatika",
      "lang.label": "Bahasa",
      "lang.id": "Indonesia",
      "lang.en": "English",
      "lang.ja": "日本語",
      "default.bio":
        "Saya merancang dan mengoperasikan sistem yang stabil serta aman — mulai dari infrastruktur jaringan, pengembangan web, hingga keamanan siber — agar operasional tim dan bisnis berjalan tanpa hambatan teknis.",
      "photo.profile": "Foto profil",
      "photo.profileOf": "Foto profil —",
      "photo.count": "foto",
      "photo.viewAll": "foto profil — klik untuk melihat semua",
      "photo.viewN": "Lihat foto",
      "photo.enlarged": "Foto diperbesar",
      "photo.generic": "Foto",
      "ach.altPrefix": "Prestasi —",
      "tag.networking": "Networking",
      "tag.fullstack": "Full Stack",
      "tag.security": "Security",
      "tag.support": "IT Support",
      "tag.digital": "Digitalisasi",
      "tag.professional": "Professional",
      "theme.system": "Sistem",
      "theme.light": "Terang",
      "theme.dark": "Gelap",
      "theme.label": "Tema",
      "about.empty": "Belum ada konten.",
      "about.page.title": "Tentang Saya",
      "about.page.lead": "Perjalanan dari kampus hingga infrastruktur perusahaan — membangun sistem yang andal.",
      "about.principles.title": "Cara Saya Bekerja",
      "about.stack.title": "Stack & Keahlian",
      "about.stack.lead": "Teknologi dan domain yang saya gunakan sehari-hari.",
      "about.cta.title": "Mari Berkolaborasi",
      "about.cta.lead": "Tertarik diskusi proyek atau kolaborasi teknis?",
      "about.back": "← Kembali ke beranda",
      "about.sidebar.title": "Profil singkat",
      "about.sidebar.location": "Lokasi",
      "about.sidebar.focus": "Fokus",
      "about.sidebar.interests": "Minat",
      "about.loadError": "Gagal memuat halaman about.",
      "nav.homeLink": "Beranda"
    },
    en: {
      "nav.about": "About",
      "nav.experience": "Experience",
      "nav.projects": "Projects",
      "nav.achievements": "Achievements",
      "nav.skills": "Skills",
      "nav.contact": "Contact",
      "nav.brand": "Portfolio",
      "nav.menu.open": "Open menu",
      "nav.home": "Portfolio home",
      "hero.greeting": "Hi, I'm",
      "hero.aboutBtn": "About me",
      "hero.experienceBtn": "Experience",
      "section.about": "About Me",
      "section.experience": "Selected Experience",
      "section.experience.lead":
        "Roles and strategic projects that shaped how I design and operate technology systems.",
      "section.projects": "Projects & Applications",
      "section.projects.lead":
        "Software and infrastructure solutions I've built — from ERP and POS to homelab systems.",
      "section.achievements": "Achievements & Certifications",
      "section.skills": "Skills & Stack",
      "section.skills.lead":
        "Technologies and domains I work with day to day.",
      "section.contact": "Let's Collaborate",
      "section.contact.lead":
        "Interested in discussing a project, IT consulting, or technical collaboration? Get in touch.",
      "timeline.expand": "View full experience timeline",
      "loading": "Loading…",
      "empty.experience": "No experience entries yet.",
      "empty.projects": "No projects yet.",
      "empty.skills": "No skills listed yet.",
      "ach.competitions": "Competitions",
      "ach.certifications": "Certifications",
      "ach.activities": "Activities",
      "about.teaser.link": "Read full profile →",
      "about.teaser.empty": "Profile is being updated.",
      "cta.email": "Email me",
      "cta.empty":
        "Contact details are not available yet. Please reach out via professional networks or add email & LinkedIn through the admin panel.",
      "error.load": "Failed to load portfolio. Make sure the API is running on this server.",
      "lightbox.close": "Close",
      "period.present": "Present",
      "status.live": "Production",
      "status.internal": "Internal",
      "status.demo": "Demo",
      "status.development": "In development",
      "btn.demo": "Demo",
      "btn.github": "GitHub",
      "stat.years": "Years in IT & development",
      "stat.roles": "Recorded roles & projects",
      "stat.awards": "Web competition awards",
      "stat.gpa": "Cum Laude GPA · Computer Engineering",
      "lang.label": "Language",
      "lang.id": "Indonesia",
      "lang.en": "English",
      "lang.ja": "日本語",
      "default.bio":
        "I design and operate stable, secure systems — from network infrastructure and web development to cybersecurity — so teams and businesses can run without technical friction.",
      "photo.profile": "Profile photo",
      "photo.profileOf": "Profile photo —",
      "photo.count": "photos",
      "photo.viewAll": "profile photos — click to view all",
      "photo.viewN": "View photo",
      "photo.enlarged": "Enlarged photo",
      "photo.generic": "Photo",
      "ach.altPrefix": "Achievements —",
      "tag.networking": "Networking",
      "tag.fullstack": "Full Stack",
      "tag.security": "Security",
      "tag.support": "IT Support",
      "tag.digital": "Digitalization",
      "tag.professional": "Professional",
      "theme.system": "System",
      "theme.light": "Light",
      "theme.dark": "Dark",
      "theme.label": "Theme",
      "about.empty": "No content yet.",
      "about.page.title": "About Me",
      "about.page.lead": "From campus to enterprise infrastructure — building reliable systems.",
      "about.principles.title": "How I Work",
      "about.stack.title": "Stack & Skills",
      "about.stack.lead": "Technologies and domains I use day to day.",
      "about.cta.title": "Let's Collaborate",
      "about.cta.lead": "Interested in discussing a project or technical collaboration?",
      "about.back": "← Back to home",
      "about.sidebar.title": "Quick profile",
      "about.sidebar.location": "Location",
      "about.sidebar.focus": "Focus",
      "about.sidebar.interests": "Interests",
      "about.loadError": "Failed to load about page.",
      "nav.homeLink": "Home"
    },
    ja: {
      "nav.about": "プロフィール",
      "nav.experience": "経歴",
      "nav.projects": "プロジェクト",
      "nav.achievements": "実績",
      "nav.skills": "スキル",
      "nav.contact": "連絡先",
      "nav.brand": "Portfolio",
      "nav.menu.open": "メニューを開く",
      "nav.home": "ポートフォリオホーム",
      "hero.greeting": "はじめまして、",
      "hero.aboutBtn": "詳細プロフィール",
      "hero.experienceBtn": "経歴を見る",
      "section.about": "自己紹介",
      "section.experience": "主な経歴",
      "section.experience.lead":
        "システム設計・運用の考え方を形づくった主要な役割とプロジェクト。",
      "section.projects": "プロジェクト & アプリ",
      "section.projects.lead":
        "ERP・POS・ホームラボなど、構築したソフトウェアとインフラ。",
      "section.achievements": "実績 & 資格",
      "section.skills": "スキル & スタック",
      "section.skills.lead":
        "日々の業務で使用している技術と領域。",
      "section.contact": "コラボレーション",
      "section.contact.lead":
        "プロジェクトの相談、ITコンサル、技術協力にご興味がありますか？お気軽にご連絡ください。",
      "timeline.expand": "すべての経歴を見る",
      "loading": "読み込み中…",
      "empty.experience": "経歴データがありません。",
      "empty.projects": "プロジェクトがありません。",
      "empty.skills": "スキルデータがありません。",
      "ach.competitions": "コンペティション",
      "ach.certifications": "資格",
      "ach.activities": "活動",
      "about.teaser.link": "プロフィール全文を読む →",
      "about.teaser.empty": "プロフィールを更新中です。",
      "cta.email": "メールを送る",
      "cta.empty":
        "連絡先情報が未設定です。プロフェッショナルネットワーク経由でご連絡いただくか、管理画面からメール・LinkedInを追加してください。",
      "error.load": "ポートフォリオの読み込みに失敗しました。APIが稼働しているか確認してください。",
      "lightbox.close": "閉じる",
      "period.present": "現在",
      "status.live": "本番",
      "status.internal": "社内",
      "status.demo": "デモ",
      "status.development": "開発中",
      "btn.demo": "デモ",
      "btn.github": "GitHub",
      "stat.years": "IT・開発経験年数",
      "stat.roles": "記録された役割・プロジェクト",
      "stat.awards": "Webコンペ受賞",
      "stat.gpa": "優等卒 GPA · 情報工学",
      "lang.label": "言語",
      "lang.id": "Indonesia",
      "lang.en": "English",
      "lang.ja": "日本語",
      "default.bio":
        "ネットワークインフラ、Web開発、サイバーセキュリティまで — 安定かつ安全なシステムを設計・運用し、チームとビジネスの技術的障害を最小化します。",
      "photo.profile": "プロフィール写真",
      "photo.profileOf": "プロフィール写真 —",
      "photo.count": "枚",
      "photo.viewAll": "プロフィール写真 — クリックですべて表示",
      "photo.viewN": "写真を見る",
      "photo.enlarged": "拡大写真",
      "photo.generic": "写真",
      "ach.altPrefix": "実績 —",
      "tag.networking": "Networking",
      "tag.fullstack": "Full Stack",
      "tag.security": "Security",
      "tag.support": "IT Support",
      "tag.digital": "デジタル化",
      "tag.professional": "Professional",
      "theme.system": "システム",
      "theme.light": "ライト",
      "theme.dark": "ダーク",
      "theme.label": "テーマ",
      "about.empty": "コンテンツがありません。",
      "about.page.title": "自己紹介",
      "about.page.lead": "キャンパスから企業インフラまで — 信頼できるシステムを構築。",
      "about.principles.title": "仕事の進め方",
      "about.stack.title": "スタック & スキル",
      "about.stack.lead": "日々使用している技術と領域。",
      "about.cta.title": "コラボレーション",
      "about.cta.lead": "プロジェクトや技術協力について話しませんか？",
      "about.back": "← ホームに戻る",
      "about.sidebar.title": "プロフィール概要",
      "about.sidebar.location": "所在地",
      "about.sidebar.focus": "専門",
      "about.sidebar.interests": "趣味",
      "about.loadError": "Aboutページの読み込みに失敗しました。",
      "nav.homeLink": "ホーム"
    }
  };

  var currentLocale = DEFAULT_LOCALE;
  var portfolioData = null;

  function getStoredLocale() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored && MESSAGES[stored]) return stored;
    } catch (e) {}
    return DEFAULT_LOCALE;
  }

  function t(key) {
    var pack = MESSAGES[currentLocale] || MESSAGES[DEFAULT_LOCALE];
    return pack[key] || MESSAGES[DEFAULT_LOCALE][key] || key;
  }

  function translateMonths(str) {
    var map = MONTHS[currentLocale] || MONTHS.id;
    return String(str).replace(
      /\b(Jan|Feb|Mar|Apr|Mei|Jun|Jul|Agu|Sep|Okt|Nov|Des)\b/g,
      function (m) {
        return map[m] || m;
      }
    );
  }

  function formatPeriod(period) {
    if (!period) return "—";
    var s = String(period)
      .replace(/Sekarang/gi, t("period.present"))
      .replace(/Present/gi, t("period.present"))
      .replace(/現在/g, t("period.present"));
    return translateMonths(s);
  }

  function localizeData(data) {
    if (!data || currentLocale === "id") return data;
    var overlay = window.PortfolioContent && window.PortfolioContent[currentLocale];
    if (!overlay) return data;
    var out = JSON.parse(JSON.stringify(data));
    if (overlay.profile && out.profile) {
      Object.keys(overlay.profile).forEach(function (k) {
        out.profile[k] = overlay.profile[k];
      });
    }
    if (overlay.about) out.about = overlay.about.slice();
    if (overlay.experiences && out.experiences) {
      out.experiences = out.experiences.map(function (e) {
        var t = overlay.experiences[e.id];
        return t ? Object.assign({}, e, t) : e;
      });
    }
    if (overlay.skills && out.skills) {
      out.skills = out.skills.map(function (s) {
        var t = overlay.skills[s.id];
        return t ? Object.assign({}, s, t) : s;
      });
    }
    if (overlay.projects && out.projects) {
      out.projects = out.projects.map(function (p) {
        var t = overlay.projects[p.id];
        return t ? Object.assign({}, p, t) : p;
      });
    }
    if (overlay.achievements && out.achievements) {
      out.achievements = Object.assign({}, out.achievements, overlay.achievements);
    }
    return out;
  }

  function getPrinciples() {
    if (currentLocale === "id") return null;
    var overlay = window.PortfolioContent && window.PortfolioContent[currentLocale];
    return overlay && overlay.principles ? overlay.principles : null;
  }

  function applyStatic() {
    document.documentElement.lang = currentLocale === "ja" ? "ja" : currentLocale === "en" ? "en" : "id";
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (key) el.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      var spec = el.getAttribute("data-i18n-attr");
      if (!spec) return;
      spec.split(";").forEach(function (pair) {
        var parts = pair.split(":");
        if (parts.length === 2) el.setAttribute(parts[0].trim(), t(parts[1].trim()));
      });
    });
    document.querySelectorAll(".lang-switch__btn").forEach(function (btn) {
      var loc = btn.getAttribute("data-locale");
      btn.classList.toggle("is-active", loc === currentLocale);
      btn.setAttribute("aria-pressed", loc === currentLocale ? "true" : "false");
    });
    if (window.PortfolioTheme && window.PortfolioTheme.apply) {
      window.PortfolioTheme.apply(window.PortfolioTheme.getMode());
    }
  }

  function mountSwitcher(container) {
    if (!container) return;
    container.innerHTML =
      '<div class="lang-switch" role="group" aria-label="' +
      t("lang.label") +
      '">' +
      ['id', 'en', 'ja']
        .map(function (loc) {
          return (
            '<button type="button" class="lang-switch__btn" data-locale="' +
            loc +
            '" aria-pressed="false" title="' +
            t("lang." + loc) +
            '">' +
            loc.toUpperCase() +
            "</button>"
          );
        })
        .join("") +
      "</div>";

    container.querySelectorAll(".lang-switch__btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        window.PortfolioI18n.setLocale(btn.getAttribute("data-locale"));
      });
    });
    applyStatic();
  }

  function setLocale(locale) {
    if (!MESSAGES[locale] || locale === currentLocale) return;
    currentLocale = locale;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch (e) {}
    applyStatic();
    if (portfolioData) {
      if (window.PortfolioApp && document.getElementById("hero")) {
        window.PortfolioApp.render(portfolioData);
      }
      if (window.PortfolioAbout && document.getElementById("about-story")) {
        window.PortfolioAbout.render(portfolioData);
      }
    }
  }

  function init() {
    currentLocale = getStoredLocale();
    applyStatic();
  }

  window.PortfolioI18n = {
    t: t,
    formatPeriod: formatPeriod,
    localizeData: localizeData,
    getPrinciples: getPrinciples,
    getLocale: function () {
      return currentLocale;
    },
    setLocale: setLocale,
    applyStatic: applyStatic,
    mountSwitcher: mountSwitcher,
    setData: function (data) {
      portfolioData = data;
    },
    init: init
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
