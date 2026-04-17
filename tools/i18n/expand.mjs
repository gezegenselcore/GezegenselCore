/**
 * Build-time: {{i18n:key}} → tek dil metni (locale → en → tr).
 */
const LOCALES = ["tr", "en", "de", "fr", "es", "it", "pt-br", "ar"];

export function pick(table, locale) {
  if (!table || typeof table !== "object") return "";
  if (table[locale]) return String(table[locale]);
  if (table.en) return String(table.en);
  if (table.tr) return String(table.tr);
  return "";
}

export function expandI18n(html, locale, messages) {
  const loc = LOCALES.includes(locale) ? locale : "en";
  let out = html.replace(/\{\{i18n:([^}]+)\}\}/g, (_, key) => escapeHtmlText(pick(messages[key.trim()], loc)));
  out = out.replace(/\{\{i18nH:([^}]+)\}\}/g, (_, key) => pick(messages[key.trim()], loc));
  return out;
}

function escapeHtmlText(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** ReFollow uzun politika: TR/EN dışı locale için EN bloğundan önce kısa uyarı. */
export function injectRefollowLegalBanner(html, locale, messages) {
  if (locale === "tr" || locale === "en") return html;
  const text = pick(messages["refollow.legal_body_fallback"], locale);
  if (!text) return html;
  const banner = `<p class="gc-refollow-locale-banner text-muted" style="margin-bottom:1rem;">${escapeHtmlText(text)}</p>`;
  return html.replace(
    /<div class="policy-locale-en lang-block">/,
    `${banner}\n    <div class="policy-locale-en lang-block">`
  );
}
