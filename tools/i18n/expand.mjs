/**
 * Build-time: {{i18n:key}} → tek dil metni (yalnızca tr | en; bilinmeyen locale → en).
 */
const LOCALES = ["tr", "en"];

export function pick(table, locale) {
  if (!table || typeof table !== "object") return "";
  const loc = locale === "tr" ? "tr" : "en";
  if (table[loc]) return String(table[loc]);
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
