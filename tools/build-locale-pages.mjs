/**
 * Dil önekli statik sayfalar: /{tr|en|de|fr|es|it|pt-br|ar}/…
 * node tools/build-locale-pages.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const LOCALES = ["tr", "en", "de", "fr", "es", "it", "pt-br", "ar"];
const ORIGIN = "https://gezegenselcore.com";

const read = (p) => fs.readFileSync(p, "utf8");
const write = (p, c) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, c, "utf8");
};

function hreflangBlock(logicalPath) {
  const lines = LOCALES.map((loc) => {
    const hreflang = loc === "pt-br" ? "pt-BR" : loc;
    return `  <link rel="alternate" hreflang="${hreflang}" href="${ORIGIN}/${loc}${logicalPath}" />`;
  });
  lines.push(`  <link rel="alternate" hreflang="x-default" href="${ORIGIN}/en${logicalPath}" />`);
  return lines.join("\n");
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

/** Statik SEO + RTL: her locale için <html lang> ve dir. */
function applyHtmlLocaleShell(html, locale) {
  const htmlLang = locale === "pt-br" ? "pt-BR" : locale;
  const dir = locale === "ar" ? "rtl" : "ltr";
  return html.replace(/<html\s+[^>]*>/i, `<html lang="${htmlLang}" dir="${dir}">`);
}

function ensureAuraMasters() {
  const pairs = [
    ["aura-privacy.master.html", path.join(ROOT, "aura", "privacy-policy.html")],
    ["aura-terms.master.html", path.join(ROOT, "aura", "terms-of-use.html")],
    ["aura-support.master.html", path.join(ROOT, "pages", "aura", "support.html")],
  ];
  for (const [name, livePath] of pairs) {
    const tpl = path.join(ROOT, "tools", "templates", name);
    if (!fs.existsSync(tpl)) {
      if (!fs.existsSync(livePath)) {
        throw new Error("Missing " + livePath + " (need full HTML before first build)");
      }
      const body = read(livePath);
      if (body.length < 500 || body.includes("legacy-path-redirect")) {
        throw new Error("Refusing to seed template from redirect stub: " + livePath);
      }
      write(tpl, body);
      console.log("Saved master template:", name);
    }
  }
}

function processInnerPage(html, relUnderLocale, locale, logicalPath) {
  const assetPx = assetPrefix(relUnderLocale);
  const canonicalUrl = `${ORIGIN}/${locale}${logicalPath}`;
  let h = html.includes("site-path.js") ? html : prependSiteScriptsFlex(html);
  h = h.replace(/(href|src)="assets\//g, `$1="${assetPx}assets/`);
  h = h.replace(/<a class="navbar-brand" href="\/"/g, `<a class="navbar-brand" href="${homeIndexHref(relUnderLocale)}">`);
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

function processAuraLegal(html, locale, logicalPath) {
  const canonicalUrl = `${ORIGIN}/${locale}${logicalPath}`;
  let h = html;
  h = h.replace(/<link rel="canonical" href="[^"]*" ?\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
  if (!h.includes('hreflang="tr"')) {
    h = h.replace(
      /(<meta name="viewport"[^>]*>)/i,
      "$1\n  " + hreflangBlock(logicalPath).replace(/\n/g, "\n  ")
    );
  }
  h = h.replace(
    /<script src="\/assets\/lang-boot\.js"><\/script>/,
    `<script src="/assets/site-path.js"></script>\n  <script src="/assets/lang-boot.js"></script>`
  );
  h = h.replace(
    /https:\/\/gezegenselcore\.com\/aura\/(privacy-policy|terms-of-use)\.html/g,
    `${ORIGIN}/${locale}/aura/$1.html`
  );
  h = h.replace(
    /https:\/\/gezegenselcore\.com\/pages\/aura\/support\.html/g,
    `${ORIGIN}/${locale}/pages/aura/support.html`
  );
  return applyHtmlLocaleShell(h, locale);
}

function refollowForLocale(rawHtml) {
  return rawHtml.replace(/\.\.\/\.\.\/\.\.\/assets\//g, "../../../../assets/");
}

function rootRedirectStub(title, logical) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title.replace(/—/g, "-")}</title>
  <link rel="canonical" href="${ORIGIN}/en${logical}" />
  <script src="/assets/site-path.js"></script>
  <script src="/assets/lang-boot.js"></script>
  <script src="/assets/legacy-path-redirect.js" data-logical="${logical}"></script>
</head>
<body>
  <p><a href="${ORIGIN}/en${logical}">Continue</a></p>
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
  <title>Gezegensel Core</title>
  <link rel="canonical" href="${ORIGIN}/en/index.html" />
  <script src="/assets/site-path.js"></script>
  <script src="/assets/lang-boot.js"></script>
  <script src="/assets/root-locale-redirect.js"></script>
</head>
<body>
  <p><a href="${ORIGIN}/en/index.html">Gezegensel Core</a></p>
  <noscript><p><a href="${ORIGIN}/en/index.html">Gezegensel Core (English)</a></p></noscript>
</body>
</html>`;
}

const SITEMAP_LOGICAL_PATHS = [
  "/index.html",
  "/privacy.html",
  "/support.html",
  "/aura/privacy-policy.html",
  "/aura/terms-of-use.html",
  "/pages/aura/support.html",
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
  for (const p of [
    "/privacy.html",
    "/support.html",
    "/pages/aura/support.html",
    "/aura/privacy-policy.html",
    "/aura/terms-of-use.html",
  ]) {
    push(ORIGIN + p, "monthly", "0.85");
  }
  for (const loc of LOCALES) {
    for (const log of SITEMAP_LOGICAL_PATHS) {
      const pri = log.includes("/aura/") ? "0.95" : log.includes("refollow") ? "0.82" : "0.9";
      push(`${ORIGIN}/${loc}${log}`, "monthly", pri);
    }
  }
  for (const p of ["/pages/refollow/policies/privacy.html", "/pages/refollow/policies/terms.html", "/pages/refollow/policies/support.html"]) {
    push(ORIGIN + p, "monthly", "0.8");
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
  ensureAuraMasters();

  const indexMaster = read(path.join(ROOT, "tools", "templates", "index.master.html"));
  const privacyMaster = read(path.join(ROOT, "tools", "templates", "privacy.master.html"));
  const supportMaster = read(path.join(ROOT, "tools", "templates", "support.master.html"));
  const auraPrivacy = read(path.join(ROOT, "tools", "templates", "aura-privacy.master.html"));
  const auraTerms = read(path.join(ROOT, "tools", "templates", "aura-terms.master.html"));
  const auraSupport = read(path.join(ROOT, "tools", "templates", "aura-support.master.html"));
  const rfPrivacy = read(path.join(ROOT, "pages", "refollow", "policies", "privacy.html"));
  const rfTerms = read(path.join(ROOT, "pages", "refollow", "policies", "terms.html"));
  const rfSupport = read(path.join(ROOT, "pages", "refollow", "policies", "support.html"));

  for (const loc of LOCALES) {
    let indexOut = processInnerPage(indexMaster, "index.html", loc, "/index.html");
    indexOut = indexOut.replace(/data-lang="pt-BR"/g, 'data-lang="pt-br"');
    write(path.join(ROOT, loc, "index.html"), indexOut);

    let priv = processInnerPage(privacyMaster, "privacy.html", loc, "/privacy.html");
    priv = priv.replace(/data-lang="pt-BR"/g, 'data-lang="pt-br"');
    write(path.join(ROOT, loc, "privacy.html"), priv);

    let sup = processInnerPage(supportMaster, "support.html", loc, "/support.html");
    sup = sup.replace(/data-lang="pt-BR"/g, 'data-lang="pt-br"');
    write(path.join(ROOT, loc, "support.html"), sup);

    write(path.join(ROOT, loc, "aura", "privacy-policy.html"), processAuraLegal(auraPrivacy, loc, "/aura/privacy-policy.html"));
    write(path.join(ROOT, loc, "aura", "terms-of-use.html"), processAuraLegal(auraTerms, loc, "/aura/terms-of-use.html"));
    write(path.join(ROOT, loc, "pages", "aura", "support.html"), processAuraLegal(auraSupport, loc, "/pages/aura/support.html"));

    const rfP = processInnerPage(refollowForLocale(rfPrivacy), "pages/refollow/policies/privacy.html", loc, "/pages/refollow/policies/privacy.html").replace(/data-lang="pt-BR"/g, 'data-lang="pt-br"');
    const rfT = processInnerPage(refollowForLocale(rfTerms), "pages/refollow/policies/terms.html", loc, "/pages/refollow/policies/terms.html").replace(/data-lang="pt-BR"/g, 'data-lang="pt-br"');
    const rfS = processInnerPage(refollowForLocale(rfSupport), "pages/refollow/policies/support.html", loc, "/pages/refollow/policies/support.html").replace(/data-lang="pt-BR"/g, 'data-lang="pt-br"');
    write(path.join(ROOT, loc, "pages", "refollow", "policies", "privacy.html"), rfP);
    write(path.join(ROOT, loc, "pages", "refollow", "policies", "terms.html"), rfT);
    write(path.join(ROOT, loc, "pages", "refollow", "policies", "support.html"), rfS);
  }

  write(path.join(ROOT, "index.html"), rootIndexRedirect());
  write(path.join(ROOT, "privacy.html"), rootRedirectStub("Privacy — Gezegensel Core", "/privacy.html"));
  write(path.join(ROOT, "support.html"), rootRedirectStub("Support — Gezegensel Core", "/support.html"));
  write(path.join(ROOT, "aura", "privacy-policy.html"), rootRedirectStub("Privacy Policy — AURA", "/aura/privacy-policy.html"));
  write(path.join(ROOT, "aura", "terms-of-use.html"), rootRedirectStub("Terms of Use — AURA", "/aura/terms-of-use.html"));
  write(path.join(ROOT, "pages", "aura", "support.html"), rootRedirectStub("AURA — Support", "/pages/aura/support.html"));

  writeSitemap();
  console.log("Done. Locales:", LOCALES.join(", "));
}

main();
