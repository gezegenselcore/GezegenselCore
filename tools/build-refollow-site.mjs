/**
 * ReFollow web sayfaları — uygulamadaki TÜM diller.
 *
 * Tek kaynak (yalnızca okunur): D:\GezegenselCore\ReFollow
 *   - src/i18n/locales/*.json  → ürün metinleri (about, welcome, premium, launchInfo, home, import)
 *                                 + settings.privacyPolicyContent / settings.termsOfUseContent
 *   - src/config/links.ts       → PLAY_STORE_URL, SUPPORT_EMAIL
 *   - package.json              → sürüm (JSON-LD softwareVersion)
 * Uygulamada karşılığı olmayan arayüz metinleri: tools/i18n/messages/refollow-site-ui.mjs
 *
 * Üretilen dosyalar (her dil için):
 *   {seg}/refollow/index.html
 *   {seg}/pages/refollow/policies/{privacy,terms,support}.html
 * Kök yönlendirme sayfaları: refollow/index.html, pages/refollow/policies/*.html
 * Yardımcı: assets/refollow-lang-hint.js
 *
 * node tools/build-refollow-site.mjs [path/to/ReFollow]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { REFOLLOW_LOCALES, SITE_LOCALES } from "./refollow-locales.mjs";
import { REFOLLOW_SITE_UI } from "./i18n/messages/refollow-site-ui.mjs";
import { REFOLLOW_STORE_LISTING } from "./i18n/messages/refollow-store-listing.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ORIGIN = "https://gezegenselcore.com";
const MARKER = 'data-gc-generated="refollow"';

const REFOLLOW_ROOT = path.resolve(process.argv[2] || path.join(ROOT, "..", "ReFollow"));

const write = (rel, content) => {
  const abs = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  const prev = fs.existsSync(abs) ? fs.readFileSync(abs, "utf8") : null;
  if (prev !== content) {
    fs.writeFileSync(abs, content, "utf8");
    console.log(prev == null ? "created" : "updated", rel);
  }
};

/* ---------- SSOT okuma ---------- */

function readAppLocale(file) {
  const p = path.join(REFOLLOW_ROOT, "src", "i18n", "locales", `${file}.json`);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function readLinks() {
  const src = fs.readFileSync(path.join(REFOLLOW_ROOT, "src", "config", "links.ts"), "utf8");
  const pick = (name) => {
    const m = src.match(new RegExp(`export\\s+const\\s+${name}\\s*=\\s*['"]([^'"]+)['"]`));
    if (!m) throw new Error(`${name} not found in links.ts`);
    return m[1];
  };
  return { play: pick("PLAY_STORE_URL"), email: pick("SUPPORT_EMAIL") };
}

function readVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.join(REFOLLOW_ROOT, "package.json"), "utf8"));
  return pkg.version;
}

function readStyleQuery() {
  const src = fs.readFileSync(path.join(__dirname, "apply-shared-chrome.mjs"), "utf8");
  const m = src.match(/const STYLE_QUERY = "([^"]+)"/);
  return m ? m[1] : "global15";
}

/* ---------- yardımcılar ---------- */

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function linkify(htmlEscaped) {
  return htmlEscaped.replace(
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
    '<a href="mailto:$1">$1</a>'
  );
}

/** Düz metin → güvenli HTML (satır sonu → <br>, e-postalar link). */
function rich(text) {
  return linkify(esc(String(text ?? "").trim())).replace(/\n/g, "<br>");
}

function get(obj, dotted) {
  const v = dotted.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
  if (typeof v !== "string") throw new Error(`Missing app string: ${dotted}`);
  return v;
}

const pageUrl = (seg, logical) => `${ORIGIN}/${seg}${logical}`;

/* ---------- politika metni → HTML ---------- */

/** Uygulama içi düz metin (paragraflar boş satırla ayrılmış) → h3/p. Tüm dillerde çalışır. */
function renderPolicy(raw) {
  const blocks = String(raw).replace(/\r\n/g, "\n").trim().split(/\n\s*\n+/);
  const out = [];
  for (const block of blocks) {
    const lines = block.trim().split("\n");
    if (!lines[0]) continue;
    const first = lines[0].trim();
    const looksLikeHeading =
      lines.length > 1 && first.length <= 90 && !/[.:;!?。।۔؟]$/.test(first);
    if (looksLikeHeading) {
      out.push(`      <h3>${esc(first)}</h3>`);
      out.push(`      <p>${rich(lines.slice(1).join("\n"))}</p>`);
    } else {
      out.push(`      <p>${rich(block)}</p>`);
    }
  }
  return out.join("\n");
}

/* ---------- ortak parçalar ---------- */

function gtagSnippet() {
  return `  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18302657879"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'AW-18302657879');
  </script>
  <script>
    function gtag_report_conversion(url) {
      try {
        if (typeof gtag === 'function') {
          gtag('event', 'conversion', {
            'send_to': 'AW-18302657879/RsCVCOjIhPkcENfKsZdE'
          });
        }
      } catch (e) {}
      if (typeof url !== 'undefined' && url) {
        window.location.href = url;
      }
      return false;
    }
  </script>
`;
}

function hreflangLinks(logical) {
  const lines = REFOLLOW_LOCALES.map(
    (l) => `  <link rel="alternate" hreflang="${l.hreflang}" href="${pageUrl(l.seg, logical)}" />`
  );
  lines.push(`  <link rel="alternate" hreflang="x-default" href="${pageUrl("en", logical)}" />`);
  return lines.join("\n");
}

function head({ loc, logical, title, description, styleQuery, jsonLd }) {
  const canonical = pageUrl(loc.seg, logical);
  const ogLocale = loc.hreflang.replace("-", "_");
  return `<head>
  <meta charset="utf-8">
${gtagSnippet()}
  <script src="/assets/site-path.js"></script>
  <script src="/assets/lang-boot.js"></script>
  <script src="/assets/theme-boot.js"></script>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="/favicon.ico" type="image/x-icon">
  <link rel="icon" type="image/png" sizes="192x192" href="/assets/icon-192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="/assets/icon-512.png">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <link rel="shortcut icon" href="/favicon.ico">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="stylesheet" href="/style.css?v=${styleQuery}">
  <link rel="canonical" href="${canonical}" />
${hreflangLinks(logical)}
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="GezegenselCore" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image" content="${ORIGIN}/assets/icons/ReFollow_icon.png" />
  <meta property="og:locale" content="${ogLocale}" />
${jsonLd ? `  <script type="application/ld+json">\n${jsonLd}\n  </script>\n` : ""}</head>`;
}

function themeSwitch(app) {
  const t = (k) => esc(get(app, k));
  return `        <div class="gc-theme-switch" role="group" aria-label="${t("settings.themeTitle")}">
          <button type="button" class="gc-theme-switch__btn" data-gc-theme="light" aria-pressed="false">${t("settings.themePaletteLight")}</button>
          <span class="gc-theme-switch__sep" aria-hidden="true">|</span>
          <button type="button" class="gc-theme-switch__btn" data-gc-theme="dark" aria-pressed="false">${t("settings.themePaletteDark")}</button>
        </div>`;
}

function langSelect(loc, logical, ui) {
  const options = REFOLLOW_LOCALES.map(
    (l) =>
      `            <option value="${l.seg}" lang="${l.hreflang}"${l.seg === loc.seg ? " selected" : ""}>${esc(l.name)}</option>`
  ).join("\n");
  const fallback = REFOLLOW_LOCALES.map(
    (l) => `<a href="${pageUrl(l.seg, logical)}" lang="${l.hreflang}">${esc(l.name)}</a>`
  ).join(" · ");
  const code = loc.seg.split("-")[0].toUpperCase();
  return `        <div class="gc-lang-switch gc-lang-switch--menu">
          <label class="gc-lang-select-wrap" title="${esc(ui.lang)}">
            <span class="gc-visually-hidden">${esc(ui.lang)}</span>
            <span class="gc-lang-select-face" aria-hidden="true">🌐 ${code}</span>
            <select class="gc-lang-select" data-gc-lang-select aria-label="${esc(ui.lang)}">
${options}
            </select>
          </label>
          <noscript><p class="gc-lang-fallback">${fallback}</p></noscript>
        </div>`;
}

function header(loc, logical, ui, app) {
  const siteSeg = SITE_LOCALES.includes(loc.seg) ? loc.seg : "en";
  const hub = `/${siteSeg}/index.html`;
  const links = [
    ["ust", ui.home],
    ["hakkinda", ui.about],
    ["urunler", ui.products],
    ["iletisim", ui.contact],
  ]
    .map(([hash, label]) => `          <a href="${hub}#${hash}">${esc(label)}</a>`)
    .join("\n");
  return `  <header class="site-header">
    <div class="site-header__inner">
      <a class="brand" href="${hub}#ust">GezegenselCore</a>
      <div class="site-header__tail">
${themeSwitch(app)}
${langSelect(loc, logical, ui)}
        <input type="checkbox" id="nav-open" class="nav-toggle">
        <label for="nav-open" class="nav-burger" aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </label>
        <nav class="nav-desktop" aria-label="GezegenselCore">
${links}
        </nav>
        <div class="nav-panel" id="nav-panel">
${links.replace(/^ {10}/gm, "          ")}
        </div>
      </div>
    </div>
  </header>`;
}

const ICONS = {
  lock: '<svg class="gc-footer-nav__icon gc-footer-nav__icon--stroke" viewBox="0 0 24 24" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  headset:
    '<svg class="gc-footer-nav__icon gc-footer-nav__icon--stroke" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 14v3a1 1 0 0 0 1 1h1"/><path d="M21 14v3a1 1 0 0 1-1 1h-1"/><path d="M3 14v-4a9 9 0 0 1 18 0v4"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
  mail: '<svg class="gc-footer-nav__icon gc-footer-nav__icon--stroke" viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  ig: '<svg class="gc-footer-nav__icon gc-footer-nav__icon--brand" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.354 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg>',
  x: '<svg class="gc-footer-nav__icon gc-footer-nav__icon--brand" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
};

function footer(loc, ui) {
  const siteSeg = SITE_LOCALES.includes(loc.seg) ? loc.seg : "en";
  return `  <footer class="site-footer">
    <nav class="gc-footer-nav" aria-label="GezegenselCore">
      <a href="/${siteSeg}/privacy.html">
        ${ICONS.lock}
        ${esc(ui.privacyHub)}
      </a>
      <a href="/${siteSeg}/support.html">
        ${ICONS.headset}
        ${esc(ui.supportHub)}
      </a>
      <a href="/${siteSeg}/index.html#iletisim">
        ${ICONS.mail}
        ${esc(ui.contact)}
      </a>
      <a href="https://www.instagram.com/gezegenselcore/" target="_blank" rel="noopener noreferrer">
        ${ICONS.ig}
        Instagram
      </a>
      <a href="https://x.com/gezegenselcore" target="_blank" rel="noopener noreferrer" aria-label="X">
        ${ICONS.x}
      </a>
    </nav>
    <p class="site-footer__legal">${esc(ui.rights)}</p>
  </footer>`;
}

function shell({ loc, logical, title, description, styleQuery, jsonLd, ui, app, main }) {
  return `<!DOCTYPE html>
<html lang="${loc.hreflang}" dir="${loc.dir}" ${MARKER}>
<!-- Bu dosya otomatik üretilir: node tools/build-refollow-site.mjs — elle düzenlemeyin. -->
${head({ loc, logical, title, description, styleQuery, jsonLd })}
<body id="top" class="gc-inner">
  <a class="skip-link" href="#icerik">${esc(ui.skip)}</a>
  <div class="gc-tech-bg" aria-hidden="true">
    <div class="gc-tech-bg__layer gc-tech-bg__layer--grid"></div>
    <div class="gc-tech-bg__layer gc-tech-bg__layer--schema"></div>
  </div>
${header(loc, logical, ui, app)}
${main}
${footer(loc, ui)}
  <script src="/assets/theme.js" defer></script>
  <script src="/assets/gc-home-parallax.js" defer></script>
  <script src="/assets/refollow-lang-hint.js" defer></script>
</body>
</html>
`;
}

function playButton(ui, play) {
  return `<a class="btn-play" href="${play}" target="_blank" rel="noopener noreferrer" onclick="gtag_report_conversion('${play}'); return false;">${esc(ui.play)}</a>`;
}

/* ---------- SSS ---------- */

function faqItems(app, ui, sl) {
  return [
    { q: ui.q1, a: sl.intro },
    {
      q: ui.q2,
      a: `${get(app, "launchInfo.differenceBody")}\n\n${get(app, "welcome.welcomeTrustLine1")} ${get(app, "welcome.welcomeNoteLocal")}`,
    },
    {
      q: ui.q3,
      a: `${get(app, "home.zipCreateSteps")}\n${get(app, "home.zipDownloadSteps")}\n\n${get(app, "home.uploadFileHintHowToBold")}`,
    },
    { q: ui.q4, a: `${get(app, "import.htmlHelpBody")}\n\n${get(app, "import.htmlHelpStep2")}` },
    { q: ui.q5, a: `${sl.freeNote}\n\n${sl.proNote}` },
  ];
}

function faqHtml(items, indent = "        ") {
  return items
    .map(
      (it) => `${indent}<details class="rf-faq__item">
${indent}  <summary>${esc(it.q)}</summary>
${indent}  <div>${rich(it.a)}</div>
${indent}</details>`
    )
    .join("\n");
}

/* ---------- ürün sayfası ---------- */

/** Play mağaza metni v5 (Ücretsiz / Pro listeleri, giriş, gizlilik) — uygulamadaki eski "Hakkında" listesi yerine. */
function storeListing(loc) {
  const sl = REFOLLOW_STORE_LISTING[loc.seg];
  if (!sl) throw new Error(`REFOLLOW_STORE_LISTING missing for ${loc.seg}`);
  return sl;
}

function productPage(loc, app, ui, ctx) {
  const logical = "/refollow/";
  const t = (k) => get(app, k);
  const policy = (name) => `/${loc.seg}/pages/refollow/policies/${name}.html`;
  const sl = storeListing(loc);
  const faq = faqItems(app, ui, sl);
  const features = [...sl.free, ...sl.pro];
  const canonical = pageUrl(loc.seg, logical);

  const video =
    loc.seg === "tr" || loc.seg === "en"
      ? `
        <div class="rf-page__video-wrap">
          <video class="rf-page__video" controls playsinline preload="metadata" poster="/assets/refollow/kadin-${loc.seg}.jpg?v=20260915" title="ReFollow">
            <source src="/assets/refollow/kadin-${loc.seg}.mp4?v=20260915" type="video/mp4">
          </video>
        </div>`
      : "";

  const card = (emoji, title, body) => `          <li class="rf-page__card">
            <span class="rf-page__emoji" aria-hidden="true">${emoji}</span>${title ? `\n            <h3>${esc(title)}</h3>` : ""}
            ${body}
          </li>`;

  const main = `  <main id="icerik">
    <section class="rf-page" aria-labelledby="rf-title">
      <div class="section-inner">
        <div class="rf-lang-hint" data-rf-lang-hint hidden></div>
        <img class="rf-page__icon" src="/assets/icons/ReFollow_icon.png?v=20260915" width="120" height="120" alt="ReFollow">
        <h1 class="products__heading" id="rf-title">ReFollow</h1>
        <p class="rf-page__lead">${esc(t("welcome.welcomeSubtitle"))}</p>${video}
        <div class="rf-page__cta">
          ${playButton(ui, ctx.play)}
        </div>
        <p class="rf-page__prose"><strong>${esc(sl.tagline)}</strong></p>
        <p class="rf-page__prose">${rich(sl.intro)}</p>
        <ul class="rf-page__grid">
${card("🔑", "", `<p>${rich(t("welcome.welcomeTrustLine1"))}</p>`)}
${card("📦", "", `<p>${rich(t("welcome.welcomeTrustLine2"))}</p>`)}
${card("📱", "", `<p>${rich(t("welcome.welcomeTrustLine3"))}</p>`)}
${card("🚫", "", `<p>${rich(t("welcome.welcomeNoteLocal"))}</p>`)}
        </ul>

        <h2 class="rf-page__heading">${esc(sl.freeTitle)}</h2>
        <ul class="rf-page__list">
${sl.free.map((f) => `          <li>${esc(f)}</li>`).join("\n")}
        </ul>
        <p class="rf-page__note">${esc(sl.freeNote)}</p>

        <h2 class="rf-page__heading">${esc(sl.proTitle)}</h2>
        <ul class="rf-page__list">
${sl.pro.map((f) => `          <li>${esc(f)}</li>`).join("\n")}
        </ul>
        <p class="rf-page__note">${esc(sl.proNote)}</p>

        <h2 class="rf-page__heading">${esc(t("about.howToUseTitle"))}</h2>
        <ol class="rf-page__grid rf-page__grid--steps">
${card("📲", t("home.zipCreateSectionTitle"), `<p>${rich(t("home.zipCreateSteps"))}</p>`)}
${card("📂", t("home.zipDownloadSectionTitle"), `<p>${rich(t("home.zipDownloadSteps"))}</p>`)}
${card("✨", t("home.analyze"), `<p>${rich(t("about.howToUseFooter"))}</p>`)}
        </ol>
        <p class="rf-page__note"><strong>${esc(t("home.zipImportantLabel"))}:</strong> ${rich(t("home.uploadFileHintHowToBold"))}</p>

        <h2 class="rf-page__heading">${esc(t("launchInfo.title"))}</h2>
        <p class="rf-page__prose">${rich(t("launchInfo.subtitle"))}</p>
        <ul class="rf-page__grid">
${card("⚠️", t("launchInfo.passwordAppsTitle"), `<p>${rich(t("launchInfo.passwordAppsBody"))}</p>`)}
${card(
  "🚨",
  t("launchInfo.risksTitle"),
  `<ul>\n${["launchInfo.risk1", "launchInfo.risk2", "launchInfo.risk3"]
    .map((k) => `              <li>${rich(t(k))}</li>`)
    .join("\n")}\n            </ul>`
)}
${card("🛡️", t("launchInfo.differenceTitle"), `<p>${rich(t("launchInfo.differenceBody"))}</p>`)}
${card("⏱️", "", `<p>${rich(t("launchInfo.footer"))}</p>`)}
        </ul>

        <h2 class="rf-page__heading">${esc(t("about.privacyTitle"))}</h2>
        <p class="rf-page__prose">${esc(sl.privacy)}</p>

        <h2 class="rf-page__heading" id="faq">${esc(ui.faqTitle)}</h2>
        <div class="rf-faq">
${faqHtml(faq, "          ")}
        </div>

        <div class="rf-page__cta">
          ${playButton(ui, ctx.play)}
        </div>

        <h2 class="rf-page__heading">${esc(ui.linksTitle)}</h2>
        <div class="gc-btn-stack">
          <a class="btn-ghost" href="${policy("support")}">${esc(t("support.title"))}</a>
          <a class="btn-ghost" href="${policy("privacy")}">${esc(t("settings.privacyPolicy"))}</a>
          <a class="btn-ghost" href="${policy("terms")}">${esc(t("settings.termsOfUse"))}</a>
        </div>
        <p class="rf-page__note">${esc(ui.email)}: <a href="mailto:${ctx.email}">${ctx.email}</a></p>
      </div>
    </section>
  </main>`;

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MobileApplication",
        "@id": `${ORIGIN}/#refollow-app`,
        name: "ReFollow",
        alternateName: "ReFollow Unfollowers",
        operatingSystem: "Android",
        applicationCategory: "UtilitiesApplication",
        description: sl.intro,
        url: canonical,
        installUrl: ctx.play,
        downloadUrl: ctx.play,
        softwareVersion: ctx.version,
        image: `${ORIGIN}/assets/icons/ReFollow_icon.png`,
        inLanguage: REFOLLOW_LOCALES.map((l) => l.hreflang),
        featureList: features,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@type": "Organization", name: "GezegenselCore", url: ORIGIN, email: ctx.email },
      },
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: ui.metaTitle,
        description: sl.tagline,
        inLanguage: loc.hreflang,
        about: { "@id": `${ORIGIN}/#refollow-app` },
      },
      {
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        inLanguage: loc.hreflang,
        mainEntity: faq.map((it) => ({
          "@type": "Question",
          name: it.q,
          acceptedAnswer: { "@type": "Answer", text: it.a },
        })),
      },
    ],
  };
  const jsonLd = JSON.stringify(ld, null, 2)
    .replace(/</g, "\\u003c")
    .split("\n")
    .map((l) => "  " + l)
    .join("\n");

  return shell({
    loc,
    logical,
    title: ui.metaTitle,
    description: sl.tagline,
    styleQuery: ctx.styleQuery,
    jsonLd,
    ui,
    app,
    main,
  });
}

/* ---------- politika / destek sayfaları ---------- */

function policyShell(loc, app, ui, ctx, name, titleKey, bodyHtml) {
  const logical = `/pages/refollow/policies/${name}.html`;
  const t = (k) => get(app, k);
  const policy = (n) => `/${loc.seg}/pages/refollow/policies/${n}.html`;
  const pageTitle = t(titleKey);
  const others = [
    ["support", "support.title"],
    ["privacy", "settings.privacyPolicy"],
    ["terms", "settings.termsOfUse"],
  ]
    .filter(([n]) => n !== name)
    .map(([n, k]) => `          <a class="btn-ghost" href="${policy(n)}">${esc(t(k))}</a>`)
    .join("\n");
  const main = `  <main id="icerik">
    <header class="gc-page-hero">
      <p class="gc-crumb"><a href="/${loc.seg}/refollow/">ReFollow</a></p>
      <h1>ReFollow — ${esc(pageTitle)}</h1>
    </header>
    <div class="gc-doc">
      <div class="rf-lang-hint" data-rf-lang-hint hidden></div>
${bodyHtml}
      <div class="gc-btn-stack">
          <a class="btn-ghost" href="/${loc.seg}/refollow/">ReFollow</a>
${others}
      </div>
      <div class="rf-page__cta">
        ${playButton(ui, ctx.play)}
      </div>
    </div>
  </main>`;
  return shell({
    loc,
    logical,
    title: `ReFollow — ${pageTitle} | GezegenselCore`,
    description: `ReFollow — ${pageTitle}. ${storeListing(loc).tagline}`,
    styleQuery: ctx.styleQuery,
    jsonLd: null,
    ui,
    app,
    main,
  });
}

function supportBody(loc, app, ui, ctx) {
  const t = (k) => get(app, k);
  const faq = faqItems(app, ui, storeListing(loc)).slice(1); // güvenlik, JSON, ücret… (ilk soru ürün açıklaması)
  return `      <h2>${esc(t("home.zipInstructionCardTitle"))}</h2>
      <h3>${esc(t("home.zipCreateSectionTitle"))}</h3>
      <p>${rich(t("home.zipCreateSteps"))}</p>
      <h3>${esc(t("home.zipDownloadSectionTitle"))}</h3>
      <p>${rich(t("home.zipDownloadSteps"))}</p>
      <p><strong>${esc(t("home.zipImportantLabel"))}:</strong> ${rich(t("home.uploadFileHintHowToBold"))}</p>

      <h2>${esc(t("import.htmlHelpTitle"))}</h2>
      <p>${rich(t("import.htmlHelpBody"))}</p>
      <ol>
        <li>${rich(t("import.htmlHelpStep1"))}</li>
        <li>${rich(t("import.htmlHelpStep2"))}</li>
        <li>${rich(t("import.htmlHelpStep3"))}</li>
      </ol>

      <h2>${esc(ui.faqTitle)}</h2>
      <div class="rf-faq">
${faqHtml(faq, "        ")}
      </div>

      <h2>${esc(t("support.contactTitle"))}</h2>
      <p>${esc(ui.email)}: <a href="mailto:${ctx.email}">${ctx.email}</a></p>
      <p>${esc(t("settings.deleteData"))}: ${rich(t("settings.deleteDataConfirm"))}</p>`;
}

/* ---------- kök yönlendirmeler ---------- */

function redirectStub(title, logical) {
  const links = REFOLLOW_LOCALES.map(
    (l) => `    <li><a href="${pageUrl(l.seg, logical)}" lang="${l.hreflang}">${esc(l.name)}</a></li>`
  ).join("\n");
  return `<!DOCTYPE html>
<html lang="en" ${MARKER}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,follow" />
  <title>${esc(title)}</title>
  <link rel="canonical" href="${pageUrl("en", logical)}" />
  <script src="/assets/site-path.js"></script>
  <script src="/assets/lang-boot.js"></script>
  <script src="/assets/legacy-path-redirect.js" data-logical="${logical}"></script>
</head>
<body>
  <ul>
${links}
  </ul>
</body>
</html>
`;
}

function langHintScript() {
  const view = {};
  const dirs = {};
  for (const l of REFOLLOW_LOCALES) {
    view[l.seg] = REFOLLOW_SITE_UI[l.seg].viewIn;
    dirs[l.seg] = l.dir;
  }
  return `/* Otomatik üretilir: node tools/build-refollow-site.mjs — elle düzenlemeyin.
 * ReFollow sayfaları: tarayıcı dili sayfa dilinden farklıysa "bu sayfayı X dilinde görüntüle" önerisi.
 * Otomatik yönlendirme YOK (arama motorları ve paylaşılan linkler için); kullanıcı tek tıkla geçer. */
(function () {
  var VIEW_IN = ${JSON.stringify(view)};
  var DIRS = ${JSON.stringify(dirs)};
  var SP = window.GezegenselSitePath;
  if (!SP || !SP.navigatorSegment) return;
  var el = document.querySelector("[data-rf-lang-hint]");
  if (!el) return;
  try {
    if (localStorage.getItem("gezegensel-lang-explicit") === "1") return;
    if (sessionStorage.getItem("rf-lang-hint-dismissed") === "1") return;
  } catch (e) {}
  var cur = SP.getLocaleSegmentFromPathname(location.pathname);
  var want = SP.navigatorSegment();
  if (!cur || !want || want === cur || !VIEW_IN[want]) return;
  var href = SP.buildAbsoluteUrl(want, SP.getLogicalPath(location.pathname));
  var a = document.createElement("a");
  a.href = href;
  a.setAttribute("dir", DIRS[want] || "ltr");
  a.textContent = "\\uD83C\\uDF10 " + VIEW_IN[want];
  a.addEventListener("click", function (ev) {
    ev.preventDefault();
    SP.navigateToLocaleSegment(want);
  });
  var b = document.createElement("button");
  b.type = "button";
  b.setAttribute("aria-label", "\\u00D7");
  b.textContent = "\\u00D7";
  b.addEventListener("click", function () {
    try { sessionStorage.setItem("rf-lang-hint-dismissed", "1"); } catch (e) {}
    el.hidden = true;
  });
  el.appendChild(a);
  el.appendChild(b);
  el.hidden = false;
})();
`;
}

/* ---------- main ---------- */

function main() {
  if (!fs.existsSync(REFOLLOW_ROOT)) throw new Error("ReFollow repo not found: " + REFOLLOW_ROOT);
  const links = readLinks();
  const ctx = { ...links, version: readVersion(), styleQuery: readStyleQuery() };

  for (const loc of REFOLLOW_LOCALES) {
    const ui = REFOLLOW_SITE_UI[loc.seg];
    if (!ui) throw new Error("Missing UI strings for " + loc.seg);
    const app = readAppLocale(loc.app);
    const s = app.settings;
    const withEmail = (txt) =>
      String(txt).replace(/gezegenselcore@gmail\.com|support@gezegenselcore\.com/g, ctx.email);

    write(`${loc.seg}/refollow/index.html`, productPage(loc, app, ui, ctx));
    write(
      `${loc.seg}/pages/refollow/policies/privacy.html`,
      policyShell(loc, app, ui, ctx, "privacy", "settings.privacyPolicy", renderPolicy(withEmail(s.privacyPolicyContent)))
    );
    write(
      `${loc.seg}/pages/refollow/policies/terms.html`,
      policyShell(loc, app, ui, ctx, "terms", "settings.termsOfUse", renderPolicy(withEmail(s.termsOfUseContent)))
    );
    write(
      `${loc.seg}/pages/refollow/policies/support.html`,
      policyShell(loc, app, ui, ctx, "support", "support.title", supportBody(loc, app, ui, ctx))
    );
  }

  write("refollow/index.html", redirectStub("ReFollow", "/refollow/"));
  write("pages/refollow/policies/privacy.html", redirectStub("ReFollow — Privacy Policy", "/pages/refollow/policies/privacy.html"));
  write("pages/refollow/policies/terms.html", redirectStub("ReFollow — Terms of Use", "/pages/refollow/policies/terms.html"));
  write("pages/refollow/policies/support.html", redirectStub("ReFollow — Support", "/pages/refollow/policies/support.html"));
  write("assets/refollow-lang-hint.js", langHintScript());

  console.log("Done. ReFollow locales:", REFOLLOW_LOCALES.map((l) => l.seg).join(", "), "· app", ctx.version);
}

main();
