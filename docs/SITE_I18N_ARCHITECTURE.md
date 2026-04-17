# Site i18n mimarisi

## Özet

Statik site **build zamanında** yerelleştirilir: `node tools/build-locale-pages.mjs` her `tr | en | de | fr | es | it | pt-br | ar` için HTML üretir. Şablonlarda `{{i18n:key}}` (düz metin, kaçışlı) ve `{{i18nH:key}}` (güvenilir HTML parçaları) yer tutucuları kullanılır.

## Dosyalar

| Bileşen | Açıklama |
|---------|-----------|
| `tools/i18n/messages/*.mjs` | Çeviri tabloları (`INDEX`, `PRIVACY`, `SUPPORT`, `REFOLLOW`, `AURA_SEO`); `registry.mjs` birleştirir. |
| `tools/i18n/expand.mjs` | `expandI18n`, `pick` (locale → `en` → `tr`), `injectRefollowLegalBanner`. |
| `tools/templates/*.master.html` | Hub, site gizlilik/destek, AURA master şablonları. |
| `pages/refollow/policies/*.html` | ReFollow uzun politika gövdesi (TR/EN blokları) + yerelleştirilmiş krom (nav, footer, meta). |

## Fallback

- **URL:** Geçersiz dil segmenti → statik sunucu 404; uygulama tarafında `en` (site-path / Aura resolver).
- **Metin:** `pick()` sırası: istenen dil → `en` → `tr` → boş.

## ReFollow uzun metin

Tam hukuk gövdesi yalnızca **Türkçe** ve **İngilizce** bloklar halinde kaynakta kalır. `de`, `fr`, `es`, `it`, `pt-br`, `ar` sayfalarında İngilizce bloğunun üstüne `injectRefollowLegalBanner` ile kısa yerelleştirilmiş uyarı eklenir.

## AURA hukuk gövdesi

Tam metin TR/EN; başlık ve `meta` açıklamaları tüm dillerde `AURA_SEO` ile build’de doldurulur. Gövde seçimi `assets/aura-legal-pages.js` ile (mevcut davranış).

## Dil seçici

`/{locale}/…` yolunda düğmeler `GezegenselSitePath.navigateToLocaleSegment` ile aynı mantıksal sayfanın diğer dil URL’sine gider. `<title>` yol modunda `gezegensel.js` tarafından ezilmez (statik SEO başlığı korunur).
