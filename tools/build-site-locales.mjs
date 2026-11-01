/**
 * Hub, site gizlilik/destek, Anima ve Night Swarm sayfalarını 12 dile çıkarır.
 *
 *   node tools/build-site-locales.mjs
 *
 * Kaynak: elle bakılan /tr/… ve /en/… sayfaları (ReFollow sayfaları HARİÇ — onlar build-refollow-site.mjs).
 *
 * 1) tr/ ve en/ sayfalarında eski TR|EN düğmeleri → 12 dilli "🌐 XX ▾" seçici (idempotent).
 * 2) Diğer 10 dil (pt-br, es, de, fr, ar, hi, bn, fa, ne, ur) için /en/… sayfasından üretim:
 *    - Çerçeve yerelleşir: <html lang/dir>, menü, atlama linki, tema düğmeleri, footer, dil seçici.
 *      Metin kaynağı: tools/i18n/messages/refollow-site-ui.mjs + ReFollow uygulama locale JSON (tema etiketleri).
 *    - Gövde İngilizce kalır (<main lang="en" dir="ltr">) — bu sayfaların uygulamada çevirisi yok.
 *    - canonical / og:url → /en/… ; hreflang yalnızca tr, en, x-default (gerçek çeviriler).
 *    - Sitemap'e eklenmez.
 * Üretilen dosyaları elle düzenlemeyin. İşaret: <html … data-gc-generated="site-locale">.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  ALL_LOCALES,
  TRANSLATED_SITE_SEGS,
  siteUi,
  replaceLangSwitch,
  logicalPathOf,
} from "./site-locales.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REFOLLOW_ROOT = path.resolve(process.argv[2] || path.join(ROOT, "..", "ReFollow"));
const MARKER = 'data-gc-generated="site-locale"';

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function walk(dir, base = dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, base, out);
    else if (ent.name.endsWith(".html")) out.push(path.relative(base, p).split(path.sep).join("/"));
  }
  return out;
}

/** ReFollow sayfaları kendi üreticisine ait. */
function isRefollowRel(rel) {
  return /^(refollow\/|pages\/refollow\/)/.test(rel);
}

function sourcePages() {
  return walk(path.join(ROOT, "en"))
    .filter((rel) => !isRefollowRel(rel))
    .sort();
}

function themeLabels(appCode) {
  const p = path.join(REFOLLOW_ROOT, "src", "i18n", "locales", `${appCode}.json`);
  const j = JSON.parse(fs.readFileSync(p, "utf8").replace(/^﻿/, ""));
  const s = j.settings || {};
  if (!s.themeTitle || !s.themePaletteLight || !s.themePaletteDark) {
    throw new Error("Missing theme labels in " + p);
  }
  return { title: s.themeTitle, light: s.themePaletteLight, dark: s.themePaletteDark };
}

/* ---------- 1) tr / en: dil seçicisini 12 dile çevir ---------- */

function upgradeTranslatedPages() {
  let n = 0;
  for (const seg of TRANSLATED_SITE_SEGS) {
    const ui = siteUi(seg);
    for (const rel of walk(path.join(ROOT, seg))) {
      if (isRefollowRel(rel)) continue;
      const abs = path.join(ROOT, seg, rel);
      const raw = fs.readFileSync(abs, "utf8");
      if (!raw.includes("gc-lang-switch")) continue;
      const next = replaceLangSwitch(raw, seg, logicalPathOf(rel), ui.lang);
      if (next !== raw) {
        fs.writeFileSync(abs, next, "utf8");
        n++;
      }
    }
  }
  return n;
}

/* ---------- 2) diğer diller: /en/ sayfasından yerelleştirilmiş çerçeve ---------- */

const NAV_KEYS = { ust: "home", hakkinda: "about", urunler: "products", iletisim: "contact" };

function localizeHeader(html, ui, theme) {
  return html.replace(/<header class="site-header">[\s\S]*?<\/header>/, (hdr) =>
    hdr
      .replace(
        /(<a href="[^"]*#(ust|hakkinda|urunler|iletisim)">)[^<]*(<\/a>)/g,
        (_, open, hash, close) => `${open}${esc(ui[NAV_KEYS[hash]])}${close}`
      )
      .replace(/(<div class="gc-theme-switch"[^>]*aria-label=")[^"]*(")/, `$1${esc(theme.title)}$2`)
      .replace(/(data-gc-theme="light"[^>]*>)[^<]*(<)/, `$1${esc(theme.light)}$2`)
      .replace(/(data-gc-theme="dark"[^>]*>)[^<]*(<)/, `$1${esc(theme.dark)}$2`)
  );
}

function localizeFooter(html, ui) {
  return html.replace(/<footer class="site-footer">[\s\S]*?<\/footer>/, (ftr) =>
    ftr
      .replace(/(<\/svg>\s*)Privacy(\s*<\/a>)/, `$1${esc(ui.privacyHub)}$2`)
      .replace(/(<\/svg>\s*)Support(\s*<\/a>)/, `$1${esc(ui.supportHub)}$2`)
      .replace(/(<\/svg>\s*)Contact(\s*<\/a>)/, `$1${esc(ui.contact)}$2`)
      .replace(/(<p class="site-footer__legal">)[^<]*(<\/p>)/, `$1${esc(ui.rights)}$2`)
  );
}

const EN_NOTICE =
  '<p class="rf-lang-hint gc-locale-note" lang="en" dir="ltr" style="margin-top:1rem">This page is available in English only.</p>';

function buildLocalePage(enHtml, loc, rel, theme) {
  const ui = siteUi(loc.seg);
  const logical = logicalPathOf(rel);
  let h = enHtml.replace(/^﻿/, "");

  /* Yönlendirme taslakları (eski aura/* vb.) olduğu gibi kopyalanır. */
  if (h.includes("legacy-path-redirect.js")) return h;

  h = h.replace(
    /<html\b[^>]*>/i,
    `<html lang="${loc.hreflang}" dir="${loc.dir}" ${MARKER}>\n<!-- Otomatik üretilir: node tools/build-site-locales.mjs (kaynak: /en${logical}) — elle düzenlemeyin. -->`
  );

  h = h.replace(/(<a class="skip-link"[^>]*>)[^<]*(<\/a>)/i, `$1${esc(ui.skip)}$2`);
  h = localizeHeader(h, ui, theme);
  h = replaceLangSwitch(h, loc.seg, logical, ui.lang);
  h = localizeFooter(h, ui);

  /* Gövde İngilizce: okunabilirlik için LTR; bilgi notu (Anima hukuk sayfalarında kendi bandı var). */
  const hasAnimaBanner = h.includes("anima-legal-fallback-banner");
  h = h.replace(/<main\b([^>]*)>/i, (m, attrs) => {
    const a = attrs.replace(/\s+(lang|dir)="[^"]*"/g, "");
    return `<main${a} lang="en" dir="ltr">` + (hasAnimaBanner ? "" : `\n    ${EN_NOTICE}`);
  });

  /* Site içi /en/ ve ../en/ yolları → bu dil (canonical/hreflang/og tam URL olduğu için etkilenmez). */
  h = h.replace(/(href|src)="\/en\//g, `$1="/${loc.seg}/`);
  h = h.replace(/(href|src)="((?:\.\.\/)+)en\//g, `$1="$2${loc.seg}/`);

  return h;
}

function main() {
  if (!fs.existsSync(REFOLLOW_ROOT)) throw new Error("ReFollow repo not found: " + REFOLLOW_ROOT);

  const upgraded = upgradeTranslatedPages();
  const pages = sourcePages();
  let written = 0;

  for (const loc of ALL_LOCALES) {
    if (TRANSLATED_SITE_SEGS.includes(loc.seg)) continue;
    const theme = themeLabels(loc.app);
    for (const rel of pages) {
      const enHtml = fs.readFileSync(path.join(ROOT, "en", rel), "utf8");
      const out = buildLocalePage(enHtml, loc, rel, theme);
      const abs = path.join(ROOT, loc.seg, rel);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      const prev = fs.existsSync(abs) ? fs.readFileSync(abs, "utf8") : null;
      if (prev !== out) {
        fs.writeFileSync(abs, out, "utf8");
        written++;
      }
    }
  }

  console.log(
    `Done. tr/en selector updated: ${upgraded} files · generated: ${written} files · pages per locale: ${pages.length}`
  );
}

main();
