/**
 * Anima legal-public → site (yalnızca okuma; SSOT: ../Anima/legal-public).
 * Metin burada düzenlenmez — Anima reposunda güncellenir, sonra sync çalıştırılır.
 *
 * node tools/import-anima-legal-content.mjs [path/to/Anima/legal-public]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildAuraLegalMaster } from "./anima-legal-master-shell.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const TPL = path.join(ROOT, "tools", "templates");
const DEFAULT_ANIMA = path.join(ROOT, "..", "Anima", "legal-public");

const MASTER_SPECS = [
  {
    master: "anima-privacy.master.html",
    source: "anima/privacy-policy.html",
    assetPrefix: "../../",
    seoKey: "aura_privacy",
    dataTitleTr: "Gizlilik Politikası — Anima",
    dataTitleEn: "Privacy Policy — Anima",
  },
  {
    master: "anima-terms.master.html",
    source: "anima/terms-of-use.html",
    assetPrefix: "../../",
    seoKey: "aura_terms",
    dataTitleTr: "Kullanım Koşulları — Anima",
    dataTitleEn: "Terms of Use — Anima",
  },
  {
    master: "anima-support.master.html",
    source: "anima/support.html",
    assetPrefix: "../../../",
    seoKey: "aura_support",
    dataTitleTr: "Anima — Destek",
    dataTitleEn: "Anima — Support",
  },
];

const ASSET_FILES = ["anima-legal-pages.js", "anima-legal-pages.css"];

/** Site koyu teması — Anima CSS kopyasından sonra korunur */
const SITE_DARK_CSS = `
[data-theme="dark"] {
  --anima-picker-bg: rgba(8, 14, 22, 0.94);
  --anima-picker-border: rgba(201, 162, 39, 0.16);
  --anima-picker-label: rgba(232, 238, 245, 0.65);
  --anima-picker-btn-bg: rgba(18, 28, 42, 0.9);
  --anima-picker-btn-fg: #e8eef5;
  --anima-picker-btn-border: rgba(232, 238, 245, 0.12);
  --anima-picker-btn-hover-bg: rgba(201, 162, 39, 0.12);
  --anima-picker-btn-hover-border: rgba(201, 162, 39, 0.28);
  --anima-picker-btn-active-bg: rgba(201, 162, 39, 0.22);
  --anima-picker-btn-active-fg: #f0d875;
  --anima-fallback-fg: rgba(232, 238, 245, 0.82);
  --anima-fallback-bg: rgba(18, 28, 42, 0.75);
  --anima-fallback-border: rgba(201, 162, 39, 0.18);
}
`;

function extractArticles(html) {
  const stripped = html.replace(/<div id="anima-legal-picker"[^>]*><\/div>\s*/gi, "");
  const m = stripped.match(
    /<article id="anima-block-tr"[\s\S]*?<\/article>\s*<article id="anima-block-en"[\s\S]*?<\/article>/
  );
  if (!m) throw new Error("Could not extract anima-block articles");
  return m[0];
}

/** Kamu URL'leri: TR bloğunda /tr/, EN bloğunda /en/; göreli yollar {{locale}} ile kalır. */
function normalizeArticleUrls(articles, assetPrefix) {
  let a = articles.replace(
    /(<article id="anima-block-tr"[\s\S]*?<\/article>)/,
    (_, block) =>
      block.replace(
        /https:\/\/gezegenselcore\.com\/(?:tr|en)\/(anima\/|pages\/anima\/)/g,
        "https://gezegenselcore.com/tr/$1"
      )
  );
  a = a.replace(
    /(<article id="anima-block-en"[\s\S]*?<\/article>)/,
    (_, block) =>
      block.replace(
        /https:\/\/gezegenselcore\.com\/(?:tr|en)\/(anima\/|pages\/anima\/)/g,
        "https://gezegenselcore.com/en/$1"
      )
  );
  a = a.replace(
    /https:\/\/gezegenselcore\.com\/(?:tr|en)\/aura\//g,
    "https://gezegenselcore.com/tr/anima/"
  );
  a = a.replace(/https:\/\/gezegenselcore\.com\/aura\//g, "https://gezegenselcore.com/{{locale}}/anima/");
  a = a.replace(/\.\.\/\.\.\/aura\//g, `${assetPrefix}{{locale}}/anima/`);
  a = a.replace(/\.\.\/\.\.\/\.\.\/tr\//g, `${assetPrefix}{{locale}}/`);
  a = a.replace(/\.\.\/\.\.\/tr\//g, `${assetPrefix}{{locale}}/`);
  a = a.replace(/\.\.\/\.\.\/en\//g, `${assetPrefix}{{localeOther}}/`);
  return a;
}

function writeMastersFromAnima(animaRoot) {
  for (const spec of MASTER_SPECS) {
    const src = path.join(animaRoot, spec.source);
    if (!fs.existsSync(src)) {
      throw new Error("Missing Anima source: " + src);
    }
    const articles = normalizeArticleUrls(extractArticles(fs.readFileSync(src, "utf8")), spec.assetPrefix);
    const master = buildAuraLegalMaster({
      assetPrefix: spec.assetPrefix,
      seoKey: spec.seoKey,
      dataTitleTr: spec.dataTitleTr,
      dataTitleEn: spec.dataTitleEn,
      articles,
    });
    const outPath = path.join(TPL, spec.master);
    if (fs.existsSync(outPath) && fs.readFileSync(outPath, "utf8") === master) {
      console.log("unchanged", spec.master);
    } else {
      fs.writeFileSync(outPath, master, "utf8");
      console.log("wrote", spec.master, "←", spec.source);
    }
  }
}

function syncAssets(animaRoot) {
  for (const name of ASSET_FILES) {
    const src = path.join(animaRoot, "assets", name);
    const dest = path.join(ROOT, "assets", name);
    if (!fs.existsSync(src)) {
      console.warn("skip missing asset", src);
      continue;
    }
    let content = fs.readFileSync(src, "utf8");
    if (name === "anima-legal-pages.css") {
      content = content.replace(/\n\[data-theme="dark"\][\s\S]*$/m, "");
      if (!content.includes('[data-theme="dark"]')) {
        content = content.trimEnd() + "\n" + SITE_DARK_CSS;
      }
    }
    if (fs.existsSync(dest) && fs.readFileSync(dest, "utf8") === content) {
      console.log("unchanged assets/" + name);
    } else {
      fs.writeFileSync(dest, content, "utf8");
      console.log("updated assets/" + name);
    }
  }
}

export function importAnimaLegal(animaRootArg) {
  const animaRoot = animaRootArg ? path.resolve(animaRootArg) : DEFAULT_ANIMA;
  if (!fs.existsSync(animaRoot)) {
    throw new Error("Anima legal-public not found: " + animaRoot);
  }
  writeMastersFromAnima(animaRoot);
  syncAssets(animaRoot);
  return animaRoot;
}

function main() {
  importAnimaLegal(process.argv[2]);
  console.log("Done. Run: node tools/sync-anima-policies.mjs");
}

const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) main();
