/**
 * Sitenin dilleri — uygulamadaki dillerle birebir (ReFollow/src/i18n/locales/*.json).
 * ReFollow sayfaları bu listenin tamamında gerçek çeviriyle; hub/Anima/Night Swarm sayfaları da
 * bu 12 dilde yayında (tr/en dışında gövde İngilizce — tools/site-locales.mjs).
 *
 * seg      → URL ilk segmenti (küçük harf)
 * app      → uygulama locale dosyası
 * hreflang → <link hreflang> / <html lang>
 */
export const REFOLLOW_LOCALES = [
  { seg: "tr", app: "tr", hreflang: "tr", name: "Türkçe", dir: "ltr" },
  { seg: "en", app: "en", hreflang: "en", name: "English", dir: "ltr" },
  { seg: "pt-br", app: "pt-BR", hreflang: "pt-BR", name: "Português (Brasil)", dir: "ltr" },
  { seg: "es", app: "es", hreflang: "es", name: "Español", dir: "ltr" },
  { seg: "de", app: "de", hreflang: "de", name: "Deutsch", dir: "ltr" },
  { seg: "fr", app: "fr", hreflang: "fr", name: "Français", dir: "ltr" },
  { seg: "ar", app: "ar", hreflang: "ar", name: "العربية", dir: "rtl" },
  { seg: "hi", app: "hi", hreflang: "hi", name: "हिन्दी", dir: "ltr" },
  { seg: "bn", app: "bn", hreflang: "bn", name: "বাংলা", dir: "ltr" },
  { seg: "fa", app: "fa", hreflang: "fa", name: "فارسی", dir: "rtl" },
  { seg: "ne", app: "ne", hreflang: "ne", name: "नेपाली", dir: "ltr" },
  { seg: "ur", app: "ur", hreflang: "ur", name: "اردو", dir: "rtl" },
];

/** Site sayfalarının yayınlandığı tüm URL dilleri (hub, Anima, Night Swarm dahil). */
export const SITE_LOCALES = REFOLLOW_LOCALES.map((l) => l.seg);

/** ReFollow mantıksal yolları (dil öneki olmadan). */
export const REFOLLOW_LOGICAL_PATHS = [
  "/refollow/",
  "/pages/refollow/policies/privacy.html",
  "/pages/refollow/policies/terms.html",
  "/pages/refollow/policies/support.html",
];
