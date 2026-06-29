/**
 * Anima hukuk master şablonlarını canlı tr/… HTML gövdesinden üretir.
 * node tools/sync-anima-legal-masters.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildAuraLegalMaster } from "./anima-legal-master-shell.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const TPL = path.join(ROOT, "tools", "templates");

const SPECS = [
  {
    master: "anima-privacy.master.html",
    source: "tr/anima/privacy-policy.html",
    assetPrefix: "../../",
    seoKey: "aura_privacy",
    dataTitleTr: "Gizlilik Politikası — Anima",
    dataTitleEn: "Privacy Policy — Anima",
    logicalPath: "/anima/privacy-policy.html",
  },
  {
    master: "anima-terms.master.html",
    source: "tr/anima/terms-of-use.html",
    assetPrefix: "../../",
    seoKey: "aura_terms",
    dataTitleTr: "Kullanım Koşulları — Anima",
    dataTitleEn: "Terms of Use — Anima",
    logicalPath: "/anima/terms-of-use.html",
  },
  {
    master: "anima-support.master.html",
    source: "tr/pages/anima/support.html",
    assetPrefix: "../../../",
    seoKey: "aura_support",
    dataTitleTr: "Anima — Destek",
    dataTitleEn: "Anima — Support",
    logicalPath: "/pages/anima/support.html",
  },
];

function extractArticles(html) {
  const stripped = html.replace(/<div id="anima-legal-picker"[^>]*>\s*<\/div>\s*/gi, "");
  const m = stripped.match(
    /<article id="anima-block-tr"[\s\S]*?<\/article>\s*<article id="anima-block-en"[\s\S]*?<\/article>/
  );
  if (!m) throw new Error("Could not extract anima-block articles");
  return m[0];
}

/** İçerik URL'lerini build sırasında locale ile genişletilebilir hale getirir. */
function normalizeArticleUrls(articles, assetPrefix) {
  let a = articles;
  a = a.replace(
    /https:\/\/gezegenselcore\.com\/(?:tr|en)\/aura\//g,
    "https://gezegenselcore.com/{{locale}}/anima/"
  );
  a = a.replace(
    /https:\/\/gezegenselcore\.com\/aura\//g,
    "https://gezegenselcore.com/{{locale}}/anima/"
  );
  a = a.replace(/\.\.\/\.\.\/aura\//g, `${assetPrefix}{{locale}}/anima/`);
  a = a.replace(/\.\.\/\.\.\/\.\.\/tr\//g, `${assetPrefix}{{locale}}/`);
  a = a.replace(/\.\.\/\.\.\/tr\//g, `${assetPrefix}{{locale}}/`);
  a = a.replace(/\.\.\/\.\.\/en\//g, `${assetPrefix}{{localeOther}}/`);
  return a;
}

function main() {
  for (const spec of SPECS) {
    const src = path.join(ROOT, spec.source);
    const html = fs.readFileSync(src, "utf8");
    const articles = normalizeArticleUrls(extractArticles(html), spec.assetPrefix);
    const master = buildAuraLegalMaster({
      assetPrefix: spec.assetPrefix,
      seoKey: spec.seoKey,
      dataTitleTr: spec.dataTitleTr,
      dataTitleEn: spec.dataTitleEn,
      articles,
    });
    const outPath = path.join(TPL, spec.master);
    fs.writeFileSync(outPath, master, "utf8");
    console.log("wrote", spec.master, "←", spec.source);
  }
  console.log("Done. Run: node tools/build-locale-pages.mjs");
}

main();
