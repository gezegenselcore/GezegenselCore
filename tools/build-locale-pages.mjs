/**
 * Dil önekli statik sayfalar: yalnızca /tr/… ve /en/…
 * node tools/build-locale-pages.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MESSAGES } from "./i18n/messages/registry.mjs";
import { expandI18n } from "./i18n/expand.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const LOCALES = ["tr", "en"];
const ORIGIN = "https://gezegenselcore.com";

const read = (p) => fs.readFileSync(p, "utf8");
const write = (p, c) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, c, "utf8");
};

function hreflangBlock(logicalPath) {
  return [
    `  <link rel="alternate" hreflang="tr" href="${ORIGIN}/tr${logicalPath}" />`,
    `  <link rel="alternate" hreflang="en" href="${ORIGIN}/en${logicalPath}" />`,
    `  <link rel="alternate" hreflang="x-default" href="${ORIGIN}/en${logicalPath}" />`,
  ].join("\n");
}

function assetPrefix(relUnderLocale) {
  const parts = relUnderLocale.split("/").filter(Boolean);
  const dirCount = Math.max(0, parts.length - 1);
  return "../".repeat(dirCount + 1);
}

function homeIndexHref(relUnderLocale) {
  const parts = relUnderLocale.split("/").filter(Boolean);
  const dirCount = Math.max(0, parts.length - 1);
  return (dirCount ? "../".repeat(dirCount) : "./") + "index.html";
}

function prependSiteScriptsFlex(html) {
  return html.replace(
    /<script src="((?:\.\.\/)*)assets\/lang-boot\.js"><\/script>/,
    (_, rel) =>
      `<script src="${rel}assets/site-path.js"></script>\n  <script src="${rel}assets/lang-boot.js"></script>`
  );
}

/** Ortak tasarım katmanı (gezegensel.css hemen ardından). */
function injectDesignSystem(html, assetPrefix) {
  const href = `${assetPrefix}assets/gc-design-system.css`;
  if (html.includes("gc-design-system.css")) return html;
  return html.replace(
    /(<link rel="stylesheet" href="[^"]*gezegensel\.css">)/i,
    `$1\n  <link rel="stylesheet" href="${href}">`
  );
}

function injectDesignSystemAnimaRoot(html) {
  if (html.includes("gc-design-system.css")) return html;
  return html.replace(
    /(<link rel="stylesheet" href="\/assets\/gezegensel\.css">)/i,
    `$1\n  <link rel="stylesheet" href="/assets/gc-design-system.css">`
  );
}

/** Statik SEO: yalnızca tr | en; metin yönü her zaman LTR. */
function applyHtmlLocaleShell(html, locale) {
  const htmlLang = locale === "tr" ? "tr" : "en";
  return html.replace(/<html\s+[^>]*>/i, `<html lang="${htmlLang}" dir="ltr">`);
}

function ensureAnimaMasters() {
  const required = [
    "anima-privacy.master.html",
    "anima-terms.master.html",
    "anima-support.master.html",
  ];
  for (const name of required) {
    const tpl = path.join(ROOT, "tools", "templates", name);
    if (!fs.existsSync(tpl)) {
      throw new Error(
        "Missing " + name + ". Run: node tools/sync-anima-policies.mjs (Anima legal-public → site)"
      );
    }
  }
}

function processInnerPage(html, relUnderLocale, locale, logicalPath) {
  const assetPx = assetPrefix(relUnderLocale);
  const canonicalUrl = `${ORIGIN}/${locale}${logicalPath}`;
  let h = html.includes("site-path.js") ? html : prependSiteScriptsFlex(html);
  h = h.replace(/(href|src)="assets\//g, `$1="${assetPx}assets/`);
  h = injectDesignSystem(h, assetPx);
  h = h.replace(
    /<a class="navbar-brand" href="\/">/g,
    `<a class="navbar-brand" href="${homeIndexHref(relUnderLocale)}">`
  );
  h = h.replace(/href="\/#apps"/g, `href="${homeIndexHref(relUnderLocale)}#apps"`);
  h = h.replace(/href="\/#policies"/g, `href="${homeIndexHref(relUnderLocale)}#policies"`);
  h = h.replace(/href="\/#about"/g, `href="${homeIndexHref(relUnderLocale)}#about"`);
  h = h.replace(/href="\/" class="gc-breadcrumb-home"/g, `href="${homeIndexHref(relUnderLocale)}" class="gc-breadcrumb-home"`);
  h = h.replace(/<a href="\/">/g, `<a href="${homeIndexHref(relUnderLocale)}">`);
  if (!h.includes('hreflang="tr"')) {
    h = h.replace(/(<meta name="viewport"[^>]*>)/i, "$1\n  " + hreflangBlock(logicalPath).replace(/\n/g, "\n  "));
  }
  if (/<link rel="canonical"/i.test(h)) {
    h = h.replace(/<link rel="canonical" href="[^"]*" ?\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
  } else {
    h = h.replace(
      /(<meta name="viewport"[^>]*>)/i,
      `$1\n  <link rel="canonical" href="${canonicalUrl}" />`
    );
  }
  if (/<meta property="og:url"/i.test(h)) {
    h = h.replace(/<meta property="og:url"[^>]*>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
  } else {
    h = h.replace(
      /(<link rel="canonical" href="[^"]+" ?\/?>)/i,
      `$1\n  <meta property="og:url" content="${canonicalUrl}" />\n  <meta property="og:type" content="website" />`
    );
  }
  return applyHtmlLocaleShell(h, locale);
}

function animaAssetPrefix(logicalPath) {
  const depth = logicalPath.split("/").filter(Boolean).length;
  return "../".repeat(depth);
}

function animaLangSwitchHtml(locale, logicalPath) {
  const other = locale === "tr" ? "en" : "tr";
  const px = animaAssetPrefix(logicalPath);
  const otherHref = `${px}${other}${logicalPath}`;
  if (locale === "tr") {
    return [
      '          <span class="gc-lang-switch__current" aria-current="true">TR</span>',
      '          <span class="gc-lang-switch__sep" aria-hidden="true">|</span>',
      `          <a href="${otherHref}">EN</a>`,
    ].join("\n");
  }
  return [
    `          <a href="${otherHref}">TR</a>`,
    '          <span class="gc-lang-switch__sep" aria-hidden="true">|</span>',
    '          <span class="gc-lang-switch__current" aria-current="true">EN</span>',
  ].join("\n");
}

function processAnimaLegal(html, locale, logicalPath) {
  const other = locale === "tr" ? "en" : "tr";
  const assetPx = animaAssetPrefix(logicalPath);
  const canonicalUrl = `${ORIGIN}/${locale}${logicalPath}`;
  let h = expandI18n(html, locale, MESSAGES);
  h = h.replace(/\{\{locale\}\}/g, locale);
  h = h.replace(/\{\{localeOther\}\}/g, other);
  h = h.replace(/\{\{assetPrefix\}\}/g, assetPx);
  h = h.replace("<!--ANIMA_LANG_SWITCH-->", animaLangSwitchHtml(locale, logicalPath));
  /* Locale sayfasında doğru dil bloğu görünür olsun (JS yüklenmeden Türkçe FOUC olmasın). */
  h = h
    .replace(/<article id="anima-block-tr"([^>]*)>/gi, (_, attrs) => {
      const clean = attrs.replace(/\s*\bhidden\b/gi, "");
      return locale === "tr"
        ? `<article id="anima-block-tr"${clean}>`
        : `<article id="anima-block-tr"${clean} hidden>`;
    })
    .replace(/<article id="anima-block-en"([^>]*)>/gi, (_, attrs) => {
      const clean = attrs.replace(/\s*\bhidden\b/gi, "");
      return locale === "en"
        ? `<article id="anima-block-en"${clean}>`
        : `<article id="anima-block-en"${clean} hidden>`;
    });
  h = prependSiteScriptsFlex(h);
  if (/<link rel="canonical"/i.test(h)) {
    h = h.replace(/<link rel="canonical" href="[^"]*" ?\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
  } else {
    h = h.replace(
      /(<meta name="viewport"[^>]*>)/i,
      `$1\n  <link rel="canonical" href="${canonicalUrl}" />`
    );
  }
  h = h.replace(
    /https:\/\/gezegenselcore\.com\/\{\{locale\}\}/g,
    `${ORIGIN}/${locale}`
  );
  h = h.replace(
    /https:\/\/gezegenselcore\.com\/aura\/(privacy-policy|terms-of-use)\.html/g,
    `${ORIGIN}/${locale}/anima/$1.html`
  );
  h = h.replace(
    /https:\/\/gezegenselcore\.com\/(?:tr|en)\/aura\/(privacy-policy|terms-of-use)\.html/g,
    `${ORIGIN}/${locale}/anima/$1.html`
  );
  h = h.replace(
    /https:\/\/gezegenselcore\.com\/pages\/aura\/support\.html/g,
    `${ORIGIN}/${locale}/pages/anima/support.html`
  );
  h = h.replace(/<link rel="alternate" hreflang="[^"]+"[^>]*>\s*/gi, "");
  const hreflang = hreflangBlock(logicalPath).replace(/\n/g, "\n  ");
  h = h.replace(/(<meta name="viewport"[^>]*>)/i, `$1\n  ${hreflang}`);
  if (!h.includes("style.css?v=global1") && !h.includes('class="gc-inner"')) {
    h = injectDesignSystemAnimaRoot(h);
  }
  return applyHtmlLocaleShell(h, locale);
}

function refollowForLocale(rawHtml) {
  return rawHtml.replace(/\.\.\/\.\.\/\.\.\/assets\//g, "../../../../assets/");
}

/** ReFollow politika: yalnızca sayfa dilindeki gövde + yerelleştirilmiş başlık/breadcrumb. */
function localizeRefollowPolicyPage(html, locale, logicalPath) {
  const en = locale === "en";
  const msg = (key) => {
    const m = MESSAGES[key];
    if (!m) return "";
    return en ? m.en : m.tr;
  };

  let pageKey = "privacy";
  if (logicalPath.includes("terms")) pageKey = "terms";
  else if (logicalPath.includes("support")) pageKey = "support";

  const titleKey = `refollow_${pageKey}.meta_title`;
  const h1Key = `refollow.${pageKey}_h2`;

  let h = html;

  if (en) {
    h = h.replace(
      /<div class="policy-locale-tr(?:\s+lang-block)?">[\s\S]*?(?=<div class="policy-locale-en(?:\s+lang-block)?">)/,
      ""
    );
  } else {
    h = h.replace(
      /<div class="policy-locale-en(?:\s+lang-block)?">[\s\S]*?(?=<p class="gc-updated">)/,
      ""
    );
  }

  h = h.replace(/<h2>Türkçe<\/h2>\s*/g, "");
  h = h.replace(/<h2>English<\/h2>\s*/g, "");
  h = h.replace(/\s*lang-block/g, "");

  const title = msg(titleKey);
  const h1 = msg(h1Key);
  const home = msg("refollow.breadcrumb_home");
  const skip = en ? "Skip to content" : "İçeriğe atla";
  const play = msg("refollow.play_store");

  if (title) {
    h = h.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);
  }
  if (h1) {
    h = h.replace(/<h1>[^<]*<\/h1>/i, `<h1>${h1}</h1>`);
  }
  h = h.replace(/(<a class="skip-link"[^>]*>)[^<]*(<\/a>)/i, `$1${skip}$2`);
  h = h.replace(
    /(<p class="gc-crumb"><a href="[^"]*">)[^<]*(<\/a>\s*·\s*ReFollow<\/p>)/i,
    `$1${home}$2`
  );
  h = h.replace(
    /(Google Play'de İndir|Get it on Google Play)/g,
    play || (en ? "Get it on Google Play" : "Google Play'de İndir")
  );

  /* Güncelleme satırı: TR "Son güncelleme", EN "Last updated" + ay adları */
  const TR_MONTHS = {
    ocak: "January",
    şubat: "February",
    subat: "February",
    mart: "March",
    nisan: "April",
    mayıs: "May",
    mayis: "May",
    haziran: "June",
    temmuz: "July",
    ağustos: "August",
    agustos: "August",
    eylül: "September",
    eylul: "September",
    ekim: "October",
    kasım: "November",
    kasim: "November",
    aralık: "December",
    aralik: "December",
  };
  h = h.replace(/<p class="gc-updated">([^<]*)<\/p>/i, (_, text) => {
    let t = text.trim();
    if (en) {
      t = t.replace(/^Son güncelleme:\s*/i, "Last updated: ");
      t = t.replace(/(\d+)\s+([A-Za-zÇĞİÖŞÜçğıöşü]+)\s+(\d{4})/i, (m, d, mon, y) => {
        const key = mon
          .toLocaleLowerCase("tr-TR")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/ı/g, "i");
        const eng =
          TR_MONTHS[mon.toLocaleLowerCase("tr-TR")] ||
          TR_MONTHS[key] ||
          TR_MONTHS[mon.toLowerCase()];
        return eng ? `${eng} ${d}, ${y}` : m;
      });
    } else {
      t = t.replace(/^Last updated:\s*/i, "Son güncelleme: ");
    }
    return `<p class="gc-updated">${t}</p>`;
  });

  return h;
}

function rootRedirectStub(title, logical) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,follow" />
  <title>${title.replace(/—/g, "-")}</title>
  <link rel="canonical" href="${ORIGIN}/en${logical}" />
  <script src="/assets/site-path.js"></script>
  <script src="/assets/lang-boot.js"></script>
  <script src="/assets/legacy-path-redirect.js" data-logical="${logical}"></script>
</head>
<body>
  <p><a href="${ORIGIN}/tr${logical}">Türkçe</a> · <a href="${ORIGIN}/en${logical}">English</a></p>
  <noscript><p><a href="${ORIGIN}/en${logical}">Continue (English)</a></p></noscript>
</body>
</html>`;
}

function rootIndexRedirect() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>GezegenselCore</title>
  <link rel="canonical" href="${ORIGIN}/en/index.html" />
  <script src="/assets/site-path.js"></script>
  <script src="/assets/lang-boot.js"></script>
  <script src="/assets/root-locale-redirect.js"></script>
</head>
<body>
  <p><a href="${ORIGIN}/en/index.html">GezegenselCore</a></p>
  <noscript><p><a href="${ORIGIN}/en/index.html">GezegenselCore (English)</a></p></noscript>
</body>
</html>`;
}

const SITEMAP_LOGICAL_PATHS = [
  "/index.html",
  "/privacy.html",
  "/support.html",
  "/anima/privacy-policy.html",
  "/anima/terms-of-use.html",
  "/pages/anima/support.html",
  "/pages/refollow/policies/privacy.html",
  "/pages/refollow/policies/terms.html",
  "/pages/refollow/policies/support.html",
];

function escapeXmlLoc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function writeSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const entries = [];
  const push = (loc, changefreq, priority) => {
    entries.push({ loc, changefreq, priority });
  };
  push(`${ORIGIN}/`, "weekly", "1.0");
  for (const loc of LOCALES) {
    for (const log of SITEMAP_LOGICAL_PATHS) {
      const pri = log.includes("/anima/") ? "0.95" : log.includes("refollow") ? "0.82" : "0.9";
      push(`${ORIGIN}/${loc}${log}`, "monthly", pri);
    }
  }
  const seen = new Set();
  const unique = entries.filter((e) => {
    if (seen.has(e.loc)) return false;
    seen.add(e.loc);
    return true;
  });
  const body = unique
    .map(
      (e) =>
        `  <url>\n    <loc>${escapeXmlLoc(e.loc)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`
    )
    .join("\n");
  write(
    path.join(ROOT, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
  );
}

function main() {
  ensureAnimaMasters();

  const animaPrivacy = read(path.join(ROOT, "tools", "templates", "anima-privacy.master.html"));
  const animaTerms = read(path.join(ROOT, "tools", "templates", "anima-terms.master.html"));
  const animaSupport = read(path.join(ROOT, "tools", "templates", "anima-support.master.html"));
  const rfPrivacy = read(path.join(ROOT, "pages", "refollow", "policies", "privacy.html"));
  const rfTerms = read(path.join(ROOT, "pages", "refollow", "policies", "terms.html"));
  const rfSupport = read(path.join(ROOT, "pages", "refollow", "policies", "support.html"));

  for (const loc of LOCALES) {
    /* Hub pages use style.css chrome — hand-maintained; do not overwrite from legacy Freelancer masters. */
    // index.html, privacy.html, support.html skipped intentionally

    write(path.join(ROOT, loc, "anima", "privacy-policy.html"), processAnimaLegal(animaPrivacy, loc, "/anima/privacy-policy.html"));
    write(path.join(ROOT, loc, "anima", "terms-of-use.html"), processAnimaLegal(animaTerms, loc, "/anima/terms-of-use.html"));
    write(path.join(ROOT, loc, "pages", "anima", "support.html"), processAnimaLegal(animaSupport, loc, "/pages/anima/support.html"));

    const rfP = processInnerPage(
      expandI18n(
        localizeRefollowPolicyPage(refollowForLocale(rfPrivacy), loc, "/pages/refollow/policies/privacy.html"),
        loc,
        MESSAGES
      ),
      "pages/refollow/policies/privacy.html",
      loc,
      "/pages/refollow/policies/privacy.html"
    );
    const rfT = processInnerPage(
      expandI18n(
        localizeRefollowPolicyPage(refollowForLocale(rfTerms), loc, "/pages/refollow/policies/terms.html"),
        loc,
        MESSAGES
      ),
      "pages/refollow/policies/terms.html",
      loc,
      "/pages/refollow/policies/terms.html"
    );
    const rfS = processInnerPage(
      expandI18n(
        localizeRefollowPolicyPage(refollowForLocale(rfSupport), loc, "/pages/refollow/policies/support.html"),
        loc,
        MESSAGES
      ),
      "pages/refollow/policies/support.html",
      loc,
      "/pages/refollow/policies/support.html"
    );
    write(path.join(ROOT, loc, "pages", "refollow", "policies", "privacy.html"), rfP);
    write(path.join(ROOT, loc, "pages", "refollow", "policies", "terms.html"), rfT);
    write(path.join(ROOT, loc, "pages", "refollow", "policies", "support.html"), rfS);
  }

  write(path.join(ROOT, "index.html"), rootIndexRedirect());
  write(path.join(ROOT, "privacy.html"), rootRedirectStub("Privacy — GezegenselCore", "/privacy.html"));
  write(path.join(ROOT, "support.html"), rootRedirectStub("Support — GezegenselCore", "/support.html"));
  write(path.join(ROOT, "anima", "privacy-policy.html"), rootRedirectStub("Privacy Policy — Anima", "/anima/privacy-policy.html"));
  write(path.join(ROOT, "anima", "terms-of-use.html"), rootRedirectStub("Terms of Use — Anima", "/anima/terms-of-use.html"));
  write(path.join(ROOT, "pages", "anima", "support.html"), rootRedirectStub("Anima — Support", "/pages/anima/support.html"));
  for (const [legacyPath, logical] of [
    ["pages/anima/policies/privacy.html", "/anima/privacy-policy.html"],
    ["pages/anima/policies/privacy-policy.html", "/anima/privacy-policy.html"],
    ["pages/anima/policies/terms.html", "/anima/terms-of-use.html"],
    ["refollow-policies/privacy.html", "/pages/refollow/policies/privacy.html"],
    ["refollow-policies/support.html", "/pages/refollow/policies/support.html"],
    ["refollow-policies/terms.html", "/pages/refollow/policies/terms.html"],
  ]) {
    const title = logical.includes("privacy")
      ? logical.includes("refollow")
        ? "Privacy Policy — ReFollow"
        : "Privacy Policy — Anima"
      : logical.includes("support")
        ? logical.includes("refollow")
          ? "Support — ReFollow"
          : "Anima — Support"
        : logical.includes("refollow")
          ? "Terms of Use — ReFollow"
          : "Terms of Use — Anima";
    write(path.join(ROOT, legacyPath), rootRedirectStub(title, logical));
  }
  write(path.join(ROOT, "aura", "privacy-policy.html"), rootRedirectStub("Privacy Policy — Anima", "/anima/privacy-policy.html"));
  write(path.join(ROOT, "aura", "terms-of-use.html"), rootRedirectStub("Terms of Use — Anima", "/anima/terms-of-use.html"));
  write(path.join(ROOT, "pages", "aura", "support.html"), rootRedirectStub("Anima — Support", "/pages/anima/support.html"));
  for (const loc of LOCALES) {
    write(path.join(ROOT, loc, "aura", "index.html"), rootRedirectStub("Anima", "/anima/index.html"));
    write(path.join(ROOT, loc, "aura", "privacy-policy.html"), rootRedirectStub("Privacy Policy — Anima", "/anima/privacy-policy.html"));
    write(path.join(ROOT, loc, "aura", "terms-of-use.html"), rootRedirectStub("Terms of Use — Anima", "/anima/terms-of-use.html"));
    write(path.join(ROOT, loc, "pages", "aura", "support.html"), rootRedirectStub("Anima — Support", "/pages/anima/support.html"));
  }

  writeSitemap();
  console.log("Done. Locales:", LOCALES.join(", "));
}

main();
