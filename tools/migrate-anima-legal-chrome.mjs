/**
 * Anima hukuk/destek sayfalarını site kabuğuna (style.css + site-header + gc-doc) taşır.
 * node tools/migrate-anima-legal-chrome.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const TARGETS = [
  { file: "tr/anima/privacy-policy.html", locale: "tr", heroTr: "Gizlilik Politikası — Anima", heroEn: "Privacy Policy — Anima", crumbTr: "Gizlilik Politikası", crumbEn: "Privacy Policy" },
  { file: "en/anima/privacy-policy.html", locale: "en", heroTr: "Gizlilik Politikası — Anima", heroEn: "Privacy Policy — Anima", crumbTr: "Gizlilik Politikası", crumbEn: "Privacy Policy" },
  { file: "tr/anima/terms-of-use.html", locale: "tr", heroTr: "Kullanım Koşulları — Anima", heroEn: "Terms of Use — Anima", crumbTr: "Kullanım Koşulları", crumbEn: "Terms of Use" },
  { file: "en/anima/terms-of-use.html", locale: "en", heroTr: "Kullanım Koşulları — Anima", heroEn: "Terms of Use — Anima", crumbTr: "Kullanım Koşulları", crumbEn: "Terms of Use" },
  { file: "tr/pages/anima/support.html", locale: "tr", heroTr: "Anima — Destek", heroEn: "Anima — Support", crumbTr: "Destek", crumbEn: "Support" },
  { file: "en/pages/anima/support.html", locale: "en", heroTr: "Anima — Destek", heroEn: "Anima — Support", crumbTr: "Destek", crumbEn: "Support" },
];

const ORIGIN = "https://gezegenselcore.com";

function relToRoot(fromFile) {
  const parts = fromFile.split("/").filter(Boolean);
  return "../".repeat(parts.length - 1);
}

function otherLocaleFile(fromFile) {
  if (fromFile.startsWith("tr/")) return fromFile.replace(/^tr\//, "en/");
  if (fromFile.startsWith("en/")) return fromFile.replace(/^en\//, "tr/");
  return null;
}

function extractArticles(html) {
  const m = html.match(
    /<article id="anima-block-tr"[\s\S]*?<\/article>\s*<article id="anima-block-en"[\s\S]*?<\/article>/
  );
  if (!m) throw new Error("Could not extract anima-block articles");
  return m[0];
}

function extractAttr(html, name) {
  const m = html.match(new RegExp(`<body[^>]*\\s${name}="([^"]*)"`, "i"));
  return m ? m[1] : "";
}

function extractTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].trim() : "";
}

function extractDescription(html) {
  const m = html.match(/<meta name="description" content="([^"]*)"/i);
  return m ? m[1].trim() : "";
}

function seoUrls(file) {
  const posix = file.replace(/\\/g, "/");
  const trPath = posix.startsWith("en/") ? `/tr/${posix.slice(3)}` : `/${posix}`;
  const enPath = posix.startsWith("tr/") ? `/en/${posix.slice(3)}` : `/${posix}`;
  return {
    canonical: `${ORIGIN}/${posix}`,
    hrefTr: `${ORIGIN}${trPath}`,
    hrefEn: `${ORIGIN}${enPath}`,
  };
}

function policyNav(locale, pre) {
  const en = locale === "en";
  const L = en
    ? { privacy: "Privacy Policy", terms: "Terms of Use", support: "Support", launch: "Anima overview" }
    : { privacy: "Gizlilik Politikası", terms: "Kullanım Koşulları", support: "Destek", launch: "Anima tanıtım" };
  const launch = `${pre}${locale}/anima/`;
  const priv = `${pre}${locale}/anima/privacy-policy.html`;
  const terms = `${pre}${locale}/anima/terms-of-use.html`;
  const sup = `${pre}${locale}/pages/anima/support.html`;
  return `        <nav class="gc-anima-legal-nav" aria-label="${en ? "Anima policies" : "Anima politikaları"}">
          <a class="btn-ghost" href="${launch}">${L.launch}</a>
          <a class="btn-ghost" href="${priv}">${L.privacy}</a>
          <a class="btn-ghost" href="${terms}">${L.terms}</a>
          <a class="btn-ghost" href="${sup}">${L.support}</a>
        </nav>`;
}

function buildPage(cfg, articles, meta) {
  const { file, locale, heroTr, heroEn, crumbTr, crumbEn } = cfg;
  const en = locale === "en";
  const pre = relToRoot(file);
  const seo = seoUrls(file);
  const otherHref = `${pre}${otherLocaleFile(file)}`;

  const hub = `${pre}${locale}/index.html`;
  const hero = en ? heroEn : heroTr;
  const crumb = en ? crumbEn : crumbTr;
  const homeCrumb = en ? "Home" : "Ana sayfa";
  const auraLaunch = `${pre}${locale}/anima/`;

  const langBlock = en
    ? `          <a href="${otherHref}">TR</a>
          <span class="gc-lang-switch__sep" aria-hidden="true">|</span>
          <span class="gc-lang-switch__current" aria-current="true">EN</span>`
    : `          <span class="gc-lang-switch__current" aria-current="true">TR</span>
          <span class="gc-lang-switch__sep" aria-hidden="true">|</span>
          <a href="${otherHref}">EN</a>`;

  const L = en
    ? {
        skip: "Skip to content",
        burger: "Open or close menu",
        nav: "Main menu",
        home: "Home",
        about: "About",
        products: "Products",
        contact: "Contact",
        langAria: "Language",
        footer: "© 2024 GezegenselCore. All rights reserved.",
        navAria: "Site",
        privacy: "Privacy",
        support: "Support",
        contactF: "Contact",
      }
    : {
        skip: "İçeriğe atla",
        burger: "Menüyü aç veya kapat",
        nav: "Ana menü",
        home: "Anasayfa",
        about: "Hakkında",
        products: "Ürünler",
        contact: "İletişim",
        langAria: "Dil",
        footer: "© 2024 GezegenselCore. Tüm hakları saklıdır.",
        navAria: "Site",
        privacy: "Gizlilik",
        support: "Destek",
        contactF: "İletişim",
      };

  const privacyHref = `${pre}${locale}/privacy.html`;
  const supportHref = `${pre}${locale}/support.html`;
  const parallax = `${pre}assets/gc-home-parallax.js`;

  return `<!DOCTYPE html>
<html lang="${locale}" dir="ltr">
<head>
  <meta charset="utf-8">
  <script src="${pre}assets/site-path.js"></script>
  <script src="${pre}assets/lang-boot.js"></script>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="canonical" href="${seo.canonical}" />
  <link rel="alternate" hreflang="tr" href="${seo.hrefTr}" />
  <link rel="alternate" hreflang="en" href="${seo.hrefEn}" />
  <link rel="alternate" hreflang="x-default" href="${seo.hrefEn}" />
  <link rel="icon" href="/favicon.ico" type="image/x-icon">
  <link rel="icon" type="image/png" sizes="192x192" href="/assets/icon-192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="/assets/icon-512.png">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <link rel="shortcut icon" href="/favicon.ico">
  <meta name="description" content="${meta.description.replace(/"/g, "&quot;")}">
  <title>${meta.title.replace(/</g, "&lt;")}</title>
  <link rel="stylesheet" href="${pre}style.css?v=global1">
  <link rel="stylesheet" href="${pre}assets/anima-legal-pages.css">
</head>
<body id="top" class="gc-inner anima-legal-page" data-title-tr="${meta.titleTr.replace(/"/g, "&quot;")}" data-title-en="${meta.titleEn.replace(/"/g, "&quot;")}">
  <a class="skip-link" href="#icerik">${L.skip}</a>
  <div class="gc-tech-bg" aria-hidden="true">
    <div class="gc-tech-bg__layer gc-tech-bg__layer--grid"></div>
    <div class="gc-tech-bg__layer gc-tech-bg__layer--schema"></div>
  </div>
  <header class="site-header">
    <div class="site-header__inner">
      <a class="brand" href="${hub}#ust">GezegenselCore</a>
      <div class="site-header__tail">
        <div class="gc-lang-switch" aria-label="${L.langAria}">
${langBlock}
        </div>
        <input type="checkbox" id="nav-open" class="nav-toggle">
        <label for="nav-open" class="nav-burger" aria-label="${L.burger}">
          <span></span>
          <span></span>
          <span></span>
        </label>
        <nav class="nav-desktop" aria-label="${L.nav}">
          <a href="${hub}#ust">${L.home}</a>
          <a href="${hub}#hakkinda">${L.about}</a>
          <a href="${hub}#urunler">${L.products}</a>
          <a href="${hub}#iletisim">${L.contact}</a>
        </nav>
        <div class="nav-panel" id="nav-panel">
          <a href="${hub}#ust">${L.home}</a>
          <a href="${hub}#hakkinda">${L.about}</a>
          <a href="${hub}#urunler">${L.products}</a>
          <a href="${hub}#iletisim">${L.contact}</a>
        </div>
      </div>
    </div>
  </header>
  <main id="icerik">
    <header class="gc-page-hero">
      <p class="gc-crumb"><a href="${hub}#ust">${homeCrumb}</a> · <a href="${auraLaunch}">Anima</a> · ${crumb}</p>
      <h1>${hero}</h1>
    </header>
    <div class="gc-doc">
${policyNav(locale, pre)}
      <p id="anima-legal-fallback-banner" class="anima-legal-fallback-banner" hidden></p>
${articles}
    </div>
  </main>
  <footer class="site-footer">
    <nav class="gc-footer-nav" aria-label="${L.navAria}">
      <a href="${privacyHref}">
        <svg class="gc-footer-nav__icon gc-footer-nav__icon--stroke" viewBox="0 0 24 24" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        ${L.privacy}
      </a>
      <a href="${supportHref}">
        <svg class="gc-footer-nav__icon gc-footer-nav__icon--stroke" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 14v3a1 1 0 0 0 1 1h1"/><path d="M21 14v3a1 1 0 0 1-1 1h-1"/><path d="M3 14v-4a9 9 0 0 1 18 0v4"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
        ${L.support}
      </a>
      <a href="${hub}#iletisim">
        <svg class="gc-footer-nav__icon gc-footer-nav__icon--stroke" viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        ${L.contactF}
      </a>
      <a href="https://github.com/GezegenselCore" target="_blank" rel="noopener noreferrer">
        <svg class="gc-footer-nav__icon gc-footer-nav__icon--brand" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
        GitHub
      </a>
      <a href="https://www.instagram.com/gezegenselcore/" target="_blank" rel="noopener noreferrer">
        <svg class="gc-footer-nav__icon gc-footer-nav__icon--brand" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.354 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg>
        Instagram
      </a>
      <a href="https://www.linkedin.com/in/cprkdr" target="_blank" rel="noopener noreferrer">
        <svg class="gc-footer-nav__icon gc-footer-nav__icon--brand" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        LinkedIn
      </a>
      <a href="https://x.com/gezegenselcore" target="_blank" rel="noopener noreferrer" aria-label="X">
        <svg class="gc-footer-nav__icon gc-footer-nav__icon--brand" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
    </nav>
    <p class="site-footer__legal">${L.footer}</p>
  </footer>
  <a class="scroll-top" href="#top" aria-label="${en ? "Back to top" : "Yukarı çık"}">↑</a>
  <script src="${parallax}" defer></script>
  <script src="${pre}assets/anima-legal-pages.js" defer></script>
</body>
</html>`;
}

function main() {
  for (const cfg of TARGETS) {
    const abs = path.join(ROOT, cfg.file);
    const html = fs.readFileSync(abs, "utf8");
    const articles = extractArticles(html);
    const meta = {
      title: extractTitle(html),
      description: extractDescription(html),
      titleTr: extractAttr(html, "data-title-tr") || cfg.heroTr,
      titleEn: extractAttr(html, "data-title-en") || cfg.heroEn,
    };
    const out = buildPage(cfg, articles, meta);
    fs.writeFileSync(abs, out.replace(/<motion/g, "<div").replace(/<\/motion>/g, "</div>"), "utf8");
    console.log("migrated", cfg.file);
  }
  console.log("Done.");
}

main();
