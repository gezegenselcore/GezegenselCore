/**
 * AURA hukuk master şablonlarını canlı tr/… HTML gövdesinden üretir.
 * node tools/sync-aura-legal-masters.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildAuraLegalMaster } from "./aura-legal-master-shell.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const TPL = path.join(ROOT, "tools", "templates");

const SPECS = [
  {
    master: "aura-privacy.master.html",
    source: "tr/aura/privacy-policy.html",
    assetPrefix: "../../",
    seoKey: "aura_privacy",
    dataTitleTr: "Gizlilik Politikası — AURA",
    dataTitleEn: "Privacy Policy — AURA",
    logicalPath: "/aura/privacy-policy.html",
  },
  {
    master: "aura-terms.master.html",
    source: "tr/aura/terms-of-use.html",
    assetPrefix: "../../",
    seoKey: "aura_terms",
    dataTitleTr: "Kullanım Koşulları — AURA",
    dataTitleEn: "Terms of Use — AURA",
    logicalPath: "/aura/terms-of-use.html",
  },
  {
    master: "aura-support.master.html",
    source: "tr/pages/aura/support.html",
    assetPrefix: "../../../",
    seoKey: "aura_support",
    dataTitleTr: "AURA — Destek",
    dataTitleEn: "AURA — Support",
    logicalPath: "/pages/aura/support.html",
  },
];

function extractArticles(html) {
  const m = html.match(
    /<article id="aura-block-tr"[\s\S]*?<\/article>\s*<article id="aura-block-en"[\s\S]*?<\/article>/
  );
  if (!m) throw new Error("Could not extract aura-block articles");
  return m[0];
}

/** İçerik URL'lerini build sırasında locale ile genişletilebilir hale getirir. */
function normalizeArticleUrls(articles, assetPrefix) {
  let a = articles;
  a = a.replace(
    /https:\/\/gezegenselcore\.com\/(?:tr|en)\/aura\//g,
    "https://gezegenselcore.com/{{locale}}/aura/"
  );
  a = a.replace(
    /https:\/\/gezegenselcore\.com\/aura\//g,
    "https://gezegenselcore.com/{{locale}}/aura/"
  );
  a = a.replace(/\.\.\/\.\.\/aura\//g, `${assetPrefix}{{locale}}/aura/`);
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
