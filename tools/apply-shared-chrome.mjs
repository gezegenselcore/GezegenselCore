/**
 * Ortak kabuk: gc-tech-bg, ana sayfa ile aynı header (tail + dil), ikonlu footer, parallax.
 * node tools/apply-shared-chrome.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dirname as posixDirname, relative as posixRelative } from "node:path/posix";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const SKIP_FILES = new Set(["tr/index.html", "en/index.html"]);

/** Tüm HTML’lerde style önbürücüsü (tek tip). */
const STYLE_QUERY = "global1";

const FONT_AWESOME_LINK = `  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer">
`;

const TECH_BG = `  <div class="gc-tech-bg" aria-hidden="true">
    <div class="gc-tech-bg__layer gc-tech-bg__layer--grid"></div>
    <div class="gc-tech-bg__layer gc-tech-bg__layer--schema"></div>
  </div>
`;

const ICONS = {
  lock: `<svg class="gc-footer-nav__icon gc-footer-nav__icon--stroke" viewBox="0 0 24 24" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  headset: `<svg class="gc-footer-nav__icon gc-footer-nav__icon--stroke" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 14v3a1 1 0 0 0 1 1h1"/><path d="M21 14v3a1 1 0 0 1-1 1h-1"/><path d="M3 14v-4a9 9 0 0 1 18 0v4"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>`,
  mail: `<svg class="gc-footer-nav__icon gc-footer-nav__icon--stroke" viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  gh: `<svg class="gc-footer-nav__icon gc-footer-nav__icon--brand" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
  ig: `<svg class="gc-footer-nav__icon gc-footer-nav__icon--brand" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.354 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg>`,
};

function posix(rel) {
  return rel.split(path.sep).join("/");
}

function relHref(fromFile, toFile) {
  const fromDir = posixDirname(fromFile) || ".";
  let r = posixRelative(fromDir === "" ? "." : fromDir, toFile);
  if (!r) r = ".";
  r = r.replace(/\\/g, "/");
  if (!r.startsWith(".") && !r.startsWith("/")) r = `./${r}`;
  return r;
}

function otherLocaleFile(fromFile) {
  if (fromFile.startsWith("tr/")) return fromFile.replace(/^tr\//, "en/");
  if (fromFile.startsWith("en/")) return fromFile.replace(/^en\//, "tr/");
  if (fromFile === "privacy.html") return "en/privacy.html";
  if (fromFile === "support.html") return "en/support.html";
  const pairs = [
    ["privacy.html", "en/privacy.html"],
    ["support.html", "en/support.html"],
    ["aura/privacy-policy.html", "en/aura/privacy-policy.html"],
    ["aura/terms-of-use.html", "en/aura/terms-of-use.html"],
    ["pages/aura/support.html", "en/pages/aura/support.html"],
    ["pages/refollow/policies/privacy.html", "en/pages/refollow/policies/privacy.html"],
    ["pages/refollow/policies/terms.html", "en/pages/refollow/policies/terms.html"],
    ["pages/refollow/policies/support.html", "en/pages/refollow/policies/support.html"],
  ];
  for (const [a, b] of pairs) {
    if (fromFile === a) return b;
    if (fromFile === b) return a;
  }
  return fromFile.startsWith("en/") ? null : "en/index.html";
}

function fixFooterPaths(fromFile) {
  if (fromFile === "privacy.html" || fromFile === "support.html") {
    return {
      privacy: "privacy.html",
      support: "support.html",
      contact: "tr/index.html#iletisim",
    };
  }
  if (fromFile === "en/privacy.html" || fromFile === "en/support.html") {
    return {
      privacy: "privacy.html",
      support: "support.html",
      contact: "index.html#iletisim",
    };
  }
  if (fromFile.startsWith("tr/")) {
    const d = posixDirname(fromFile);
    const parts = d.split("/").filter(Boolean);
    const up = parts.length - 1;
    const pre = up ? "../".repeat(up) : "./";
    return {
      privacy: `${pre}privacy.html`,
      support: `${pre}support.html`,
      contact: `${pre}index.html#iletisim`,
    };
  }
  if (fromFile.startsWith("en/")) {
    const d = posixDirname(fromFile);
    const parts = d.split("/").filter(Boolean);
    const up = parts.length - 1;
    const pre = up ? "../".repeat(up) : "./";
    return {
      privacy: `${pre}privacy.html`,
      support: `${pre}support.html`,
      contact: `${pre}index.html#iletisim`,
    };
  }
  const depth = fromFile.split("/").length - 1;
  const pre = depth ? "../".repeat(depth) : "";
  return {
    privacy: `${pre}tr/privacy.html`,
    support: `${pre}tr/support.html`,
    contact: `${pre}tr/index.html#iletisim`,
  };
}

function parallaxSrc(fromFile) {
  const d = posixDirname(fromFile);
  const depth = d && d !== "." ? d.split("/").filter(Boolean).length : 0;
  return `${depth ? "../".repeat(depth) : ""}assets/gc-home-parallax.js`.replace(/^\//, "");
}

function ensureStylesheetVersion(html) {
  const v = STYLE_QUERY;
  return html.replace(/href="([^"]*?)style\.css(\?[^"]*)?"/g, (full, prefix, query) => {
    if (query && query.includes(v)) return full;
    return `href="${prefix}style.css?v=${v}"`;
  });
}

function ensureFontAwesomeLink(html) {
  const needsFa = /\bfa-brands\b|\bfa-solid\b|\bfa-regular\b/.test(html);
  if (!needsFa) return html;
  if (/font-awesome|fontawesome|cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome/.test(html)) return html;
  const injected = html.replace(
    /(<link rel="stylesheet" href="[^"]*style\.css[^"]*">)(\s*)/i,
    `$1\n${FONT_AWESOME_LINK}$2`
  );
  if (injected !== html) return injected;
  return html.replace(/<\/head>/i, `${FONT_AWESOME_LINK}</head>`);
}

function buildFooter(fromFile, en) {
  const { privacy, support, contact } = fixFooterPaths(fromFile);
  const L = en
    ? { p: "Privacy", s: "Support", c: "Contact", g: "GitHub", i: "Instagram", aria: "Site" }
    : { p: "Gizlilik", s: "Destek", c: "İletişim", g: "GitHub", i: "Instagram", aria: "Site" };
  return `  <footer class="site-footer">
    <nav class="gc-footer-nav" aria-label="${L.aria}">
      <a href="${privacy}">
        ${ICONS.lock}
        ${L.p}
      </a>
      <a href="${support}">
        ${ICONS.headset}
        ${L.s}
      </a>
      <a href="${contact}">
        ${ICONS.mail}
        ${L.c}
      </a>
      <a href="https://github.com/GezegenselCore" target="_blank" rel="noopener noreferrer">
        ${ICONS.gh}
        ${L.g}
      </a>
      <a href="https://www.instagram.com/gezegenselcore/" target="_blank" rel="noopener noreferrer">
        ${ICONS.ig}
        ${L.i}
      </a>
    </nav>
    <p class="site-footer__legal">${en ? "© 2024 Gezegensel Core. All rights reserved." : "© 2024 Gezegensel Core. Tüm hakları saklıdır."}</p>
  </footer>`;
}

function buildHeader(fromFile, opts) {
  const en = opts.en;
  const is404 = opts.is404;
  const L = en
    ? {
        skip: "Skip to content",
        burger: "Open or close menu",
        navLabel: "Main menu",
        home: "Home",
        about: "About",
        products: "Products",
        contact: "Contact",
        langAria: "Language",
      }
    : {
        skip: "İçeriğe atla",
        burger: "Menüyü aç veya kapat",
        navLabel: "Ana menü",
        home: "Anasayfa",
        about: "Hakkında",
        products: "Ürünler",
        contact: "İletişim",
        langAria: "Dil",
      };

  const brandHref = (() => {
    if (fromFile.startsWith("tr/")) return `${relHref(fromFile, "tr/index.html")}#ust`;
    if (fromFile.startsWith("en/")) return `${relHref(fromFile, "en/index.html")}#ust`;
    if (fromFile === "404.html") return "tr/index.html#ust";
    if (fromFile === "privacy.html" || fromFile === "support.html") return "tr/index.html#ust";
    if (fromFile === "en/privacy.html" || fromFile === "en/support.html") return "index.html#ust";
    return `${relHref(fromFile, "tr/index.html")}#ust`;
  })();

  const h = (hash) => {
    if (fromFile.startsWith("tr/")) return `${relHref(fromFile, "tr/index.html")}#${hash}`;
    if (fromFile.startsWith("en/")) return `${relHref(fromFile, "en/index.html")}#${hash}`;
    if (fromFile === "en/privacy.html" || fromFile === "en/support.html") return `index.html#${hash}`;
    return `${relHref(fromFile, "tr/index.html")}#${hash}`;
  };

  let langBlock;
  if (is404) {
    langBlock = `        <div class="gc-lang-switch" aria-label="${L.langAria}">
          <a href="tr/index.html#ust">TR</a>
          <span class="gc-lang-switch__sep" aria-hidden="true">|</span>
          <a href="en/index.html#ust">EN</a>
        </div>`;
  } else if (en) {
    const trLink = otherLocaleFile(fromFile);
    const trHref = trLink ? relHref(fromFile, trLink) : "../tr/index.html";
    langBlock = `        <div class="gc-lang-switch" aria-label="${L.langAria}">
          <a href="${trHref}">TR</a>
          <span class="gc-lang-switch__sep" aria-hidden="true">|</span>
          <span class="gc-lang-switch__current" aria-current="true">EN</span>
        </div>`;
  } else {
    const enLink = otherLocaleFile(fromFile);
    const enHref = enLink ? relHref(fromFile, enLink) : "en/index.html";
    langBlock = `        <div class="gc-lang-switch" aria-label="${L.langAria}">
          <span class="gc-lang-switch__current" aria-current="true">TR</span>
          <span class="gc-lang-switch__sep" aria-hidden="true">|</span>
          <a href="${enHref}">EN</a>
        </div>`;
  }

  const skipTarget = is404 ? "#icerik" : opts.skipHref || "#icerik";

  return `  <header class="site-header">
    <div class="site-header__inner">
      <a class="brand" href="${brandHref}">GEZEGENSEL CORE</a>
      <div class="site-header__tail">
${langBlock}
        <input type="checkbox" id="nav-open" class="nav-toggle">
        <label for="nav-open" class="nav-burger" aria-label="${L.burger}">
          <span></span>
          <span></span>
          <span></span>
        </label>
        <nav class="nav-desktop" aria-label="${L.navLabel}">
          <a href="${h("ust")}">${L.home}</a>
          <a href="${h("hakkinda")}">${L.about}</a>
          <a href="${h("urunler")}">${L.products}</a>
          <a href="${h("iletisim")}">${L.contact}</a>
        </nav>
        <div class="nav-panel" id="nav-panel">
          <a href="${h("ust")}">${L.home}</a>
          <a href="${h("hakkinda")}">${L.about}</a>
          <a href="${h("urunler")}">${L.products}</a>
          <a href="${h("iletisim")}">${L.contact}</a>
        </div>
      </div>
    </div>
  </header>`;
}

function walkHtml(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith(".")) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "tools" || ent.name === "node_modules") continue;
      walkHtml(p, out);
    } else if (ent.name.endsWith(".html")) out.push(p);
  }
  return out;
}

function patch(html, fromFile) {
  const posixFile = posix(path.relative(ROOT, fromFile));
  const en = posixFile.startsWith("en/");
  const is404 = posixFile === "404.html";

  if (SKIP_FILES.has(posixFile)) {
    let out = ensureStylesheetVersion(html);
    out = ensureFontAwesomeLink(out);
    return out !== html ? out : null;
  }
  if (!html.includes("style.css") || !html.includes("site-header")) return null;

  let out = html;
  if (!out.includes("gc-tech-bg")) {
    if (/<a class="skip-link"[^>]*>\s*<\/a>/i.test(out)) {
      out = out.replace(/(<a class="skip-link"[^>]*><\/a>)/i, `$1\n${TECH_BG}`);
    } else if (/<a class="skip-link"[\s\S]*?<\/a>/i.test(out)) {
      out = out.replace(/(<a class="skip-link"[\s\S]*?<\/a>)/i, `$1\n${TECH_BG}`);
    } else {
      out = out.replace(
        /<body([^>]*)>/i,
        `<body$1>\n  <a class="skip-link" href="${is404 ? "#icerik" : "#icerik"}">${
          en ? "Skip to content" : "İçeriğe atla"
        }</a>\n${TECH_BG}`
      );
    }
  }

  const headerNew = buildHeader(posixFile, { en, is404, skipHref: "#icerik" });
  out = out.replace(/<header class="site-header">[\s\S]*?<\/header>/i, headerNew);

  const footerNew = buildFooter(posixFile, en);
  out = out.replace(/<footer class="site-footer">[\s\S]*?<\/footer>/i, footerNew);

  const ps = parallaxSrc(posixFile);
  if (!out.includes("gc-home-parallax.js")) {
    out = out.replace(/<\/body>/i, `  <script src="${ps}" defer></script>\n</body>`);
  }

  if (is404 && !out.includes('id="icerik"')) {
    out = out.replace(/<main(\s|>)/i, `<main id="icerik"$1`);
  }

  out = ensureStylesheetVersion(out);
  out = ensureFontAwesomeLink(out);

  return out;
}

function main() {
  const files = walkHtml(ROOT);
  let n = 0;
  for (const abs of files) {
    const rel = posix(path.relative(ROOT, abs));
    const raw = fs.readFileSync(abs, "utf8");
    const next = patch(raw, abs);
    if (next && next !== raw) {
      fs.writeFileSync(abs, next, "utf8");
      console.log("patched", rel);
      n++;
    }
  }
  console.log("Done,", n, "files.");
}

main();
