/**
 * Anima mobil reposu legal-public → site tr/ kaynak sayfalar (article gövdeleri).
 * node tools/import-anima-legal-content.mjs [path/to/Anima/legal-public]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DEFAULT_ANIMA = path.join(ROOT, "..", "Anima", "legal-public");

const TARGETS = [
  {
    source: "anima/privacy-policy.html",
    dest: "tr/anima/privacy-policy.html",
    patchPrivacyS14: true,
  },
  { source: "anima/terms-of-use.html", dest: "tr/anima/terms-of-use.html" },
  {
    source: "anima/support.html",
    dest: "tr/pages/anima/support.html",
    fixSupport: true,
  },
];

function extractArticles(html) {
  const stripped = html.replace(/<div id="anima-legal-picker"[^>]*><\/div>\s*/gi, "");
  const m = stripped.match(
    /<article id="anima-block-tr"[\s\S]*?<\/article>\s*<article id="anima-block-en"[\s\S]*?<\/article>/
  );
  if (!m) throw new Error("Could not extract anima-block articles");
  return m[0];
}

function normalizeForTrSource(articles, assetPrefix, destRel) {
  let a = articles;
  if (destRel.includes("pages/anima/support")) {
    a = a.replace(
      /https:\/\/gezegenselcore\.com\/en\/aura\/privacy-policy\.html/,
      "../../tr/anima/privacy-policy.html"
    );
  }
  return a;
}

const PRIVACY_S14_TR = `
    <h2>14. Anonim topluluk öğrenmesi</h2>
    <p>Anima, hizmetlerini iyileştirmek için açık rızanızla anonim kullanım örüntüleri toplayabilir.</p>
    <h3>Toplananlar</h3>
    <ul>
      <li>Yaş grubu (18–25, 26–64, 65+)</li>
      <li>Aktivite tipi (binaural, nefes, ritüel, odak vb.)</li>
      <li>Stres bandı (düşük, orta, yüksek)</li>
      <li>Kapasite değişimi (aktivite öncesi/sonrası anonim fark)</li>
      <li>Hafta referansı (gün veya tarih değil)</li>
    </ul>
    <h3>Toplanmayanlar</h3>
    <ul>
      <li>Ad, e-posta veya kullanıcı kimliği</li>
      <li>Konum</li>
      <li>Sağlık kaydı içeriği</li>
      <li>Rüya veya günlük girdileri</li>
      <li>Cihaz tanımlayıcısı</li>
    </ul>
    <h3>Kullanım</h3>
    <p>Bu veriler anonim toplu istatistik oluşturmak ve genel öneri kalitesini iyileştirmek için kullanılır; bireysel kullanıcılara geri izlenemez.</p>
    <h3>Kontrolünüz</h3>
    <p>Uygulama ayarlarından “Anonim Veri Paylaşımı”nı kapatarak bu toplamayı istediğiniz zaman durdurabilirsiniz. Özellik varsayılan olarak kapalıdır ve yalnızca açık rızanızla etkinleşir.</p>
    <h3>Saklama</h3>
    <p>Anonim toplu veriler en fazla 12 ay saklanır.</p>`;

const PRIVACY_S14_EN = `
    <h2>14. Anonymous Community Learning</h2>
    <p>Anima may collect anonymous usage patterns with your explicit consent to improve its services.</p>
    <h3>What is collected</h3>
    <ul>
      <li>Age group (18–25, 26–64, 65+)</li>
      <li>Activity type (binaural, breathing, ritual, focus, etc.)</li>
      <li>Stress band (low, medium, high)</li>
      <li>Capacity change (anonymous delta before and after activity)</li>
      <li>Week reference (not day or date)</li>
    </ul>
    <h3>What is NOT collected</h3>
    <ul>
      <li>Name, email, or user identifier</li>
      <li>Location</li>
      <li>Health record contents</li>
      <li>Dream or journal entries</li>
      <li>Device identifier</li>
    </ul>
    <h3>How it's used</h3>
    <p>This data is used to create anonymous aggregate statistics and improve general recommendation quality. It cannot be traced back to individual users.</p>
    <h3>Your control</h3>
    <p>You can stop this data collection at any time by turning off "Anonymous Data Sharing" in app settings. This feature is off by default and only activated with your explicit consent.</p>
    <h3>Retention</h3>
    <p>Anonymous aggregate data is retained for a maximum of 12 months.</p>`;

function expandPrivacySection14(articles) {
  let a = articles;
  a = a.replace(
    /<h2>14\. Anonim topluluk öğrenmesi<\/h2>[\s\S]*?(?=<h2>15\. İletişim)/,
    `${PRIVACY_S14_TR}\n`
  );
  a = a.replace(
    /<h2>14\. Anonymous Community Learning<\/h2>[\s\S]*?(?=<h2>15\. Contact)/,
    `${PRIVACY_S14_EN}\n`
  );
  return a;
}

function fixSupportArticles(articles) {
  let a = articles;
  a = a.replace(
    /Son güncelleme: 18 Nisan 2026/,
    "Son güncelleme: 26 Nisan 2026"
  );
  a = a.replace(
    /Last updated: April 18, 2026/,
    "Last updated: April 26, 2026"
  );
  a = a.replace(
    /https:\/\/gezegenselcore\.com\/en\/aura\/privacy-policy\.html(?=[^<]*Gizlilik)/,
    "../../tr/anima/privacy-policy.html"
  );
  return a;
}

function patchPage(destRel, articles) {
  const dest = path.join(ROOT, destRel);
  const html = fs.readFileSync(dest, "utf8");
  const current = extractArticles(html);
  if (current === articles) {
    console.log("unchanged", destRel);
    return;
  }
  const next = html.replace(current, articles);
  if (next === html) throw new Error("Failed to patch " + destRel);
  fs.writeFileSync(dest, next, "utf8");
  console.log("updated", destRel);
}

function main() {
  const animaRoot = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_ANIMA;
  if (!fs.existsSync(animaRoot)) {
    throw new Error("Anima legal-public not found: " + animaRoot);
  }

  for (const t of TARGETS) {
    const src = path.join(animaRoot, t.source);
    const parts = t.dest.split("/").filter(Boolean);
    const assetPrefix = "../".repeat(parts.length - 1);
    let articles = extractArticles(fs.readFileSync(src, "utf8"));
    if (t.patchPrivacyS14) articles = expandPrivacySection14(articles);
    if (t.fixSupport) articles = fixSupportArticles(articles);
    articles = normalizeForTrSource(articles, assetPrefix, t.dest);
    patchPage(t.dest, articles);
  }
  console.log("Done. Run: node tools/sync-anima-legal-masters.mjs && node tools/build-locale-pages.mjs");
}

main();
