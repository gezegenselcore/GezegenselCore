/**
 * Sitenin tüm dilleri — tek kaynak.
 * Liste ReFollow uygulamasının dilleriyle aynı (tools/refollow-locales.mjs → REFOLLOW_LOCALES).
 *
 * Kapsam (hangi sayfa hangi dilde GERÇEKTEN çevrili):
 *   - ReFollow sayfaları: 12 dil (uygulama metinleri) — tools/build-refollow-site.mjs
 *   - Hub, site gizlilik/destek, Anima, Night Swarm: tr + en gerçek; diğer 10 dilde
 *     sayfa çerçevesi (menü, footer, dil seçici) yerelleştirilir, gövde İngilizce kalır
 *     (canonical → /en/…, hreflang yalnızca tr/en) — tools/build-site-locales.mjs
 */
import { REFOLLOW_LOCALES } from "./refollow-locales.mjs";
import { REFOLLOW_SITE_UI } from "./i18n/messages/refollow-site-ui.mjs";

export const ORIGIN = "https://gezegenselcore.com";

/** { seg, app, hreflang, name, dir } × 12 */
export const ALL_LOCALES = REFOLLOW_LOCALES;

/** Hub/Anima/Night Swarm gövdesinin gerçekten çevrili olduğu diller. */
export const TRANSLATED_SITE_SEGS = ["tr", "en"];

/** Çerçeve metinleri (menü, footer, dil etiketi) — ReFollow sayfalarıyla aynı sözlük. */
export function siteUi(seg) {
  const ui = REFOLLOW_SITE_UI[seg];
  if (!ui) throw new Error("Missing REFOLLOW_SITE_UI for " + seg);
  return ui;
}

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Başlıktaki dil seçici: "🌐 XX ▾" yüzü + görünmez yerel <select> (site-path.js bağlar).
 * ReFollow sayfalarındaki ile aynı işaretleme. `indent` satır başı boşluğu.
 */
export function langSelectHtml(seg, logicalPath, label, indent = "        ") {
  const i = indent;
  const options = ALL_LOCALES.map(
    (l) =>
      `${i}      <option value="${l.seg}" lang="${l.hreflang}"${l.seg === seg ? " selected" : ""}>${esc(l.name)}</option>`
  ).join("\n");
  const fallback = ALL_LOCALES.map(
    (l) => `<a href="${ORIGIN}/${l.seg}${logicalPath}" lang="${l.hreflang}">${esc(l.name)}</a>`
  ).join(" · ");
  const code = seg.split("-")[0].toUpperCase();
  return `${i}<div class="gc-lang-switch gc-lang-switch--menu">
${i}  <label class="gc-lang-select-wrap" title="${esc(label)}">
${i}    <span class="gc-visually-hidden">${esc(label)}</span>
${i}    <span class="gc-lang-select-face" aria-hidden="true">🌐 ${code}</span>
${i}    <select class="gc-lang-select" data-gc-lang-select aria-label="${esc(label)}">
${options}
${i}    </select>
${i}  </label>
${i}  <noscript><p class="gc-lang-fallback">${fallback}</p></noscript>
${i}</div>`;
}

/** Eski TR|EN düğmeleri veya önceki seçici — idempotent değiştirme. */
export function replaceLangSwitch(html, seg, logicalPath, label) {
  return html.replace(
    /[ \t]*<div class="gc-lang-switch[^"]*"[^>]*>[\s\S]*?<\/div>/,
    () => langSelectHtml(seg, logicalPath, label)
  );
}

/** "tr/anima/index.html" → "/anima/" ; "en/privacy.html" → "/privacy.html" */
export function logicalPathOf(relUnderLocale) {
  let p = "/" + relUnderLocale.replace(/^\/+/, "");
  if (p.endsWith("/index.html") && p !== "/index.html") p = p.slice(0, -"index.html".length);
  return p;
}
