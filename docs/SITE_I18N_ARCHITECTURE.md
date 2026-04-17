# Site i18n mimarisi

## Özet

Statik site **build zamanında** yerelleştirilir: `node tools/build-locale-pages.mjs` yalnızca **`tr`** ve **`en`** için HTML üretir. Şablonlarda `{{i18n:key}}` (düz metin, kaçışlı) ve `{{i18nH:key}}` (güvenilir HTML parçaları) yer tutucuları kullanılır.

## Dosyalar

| Bileşen | Açıklama |
|---------|-----------|
| `tools/i18n/messages/*.mjs` | Çeviri tabloları (`INDEX`, `PRIVACY`, `SUPPORT`, `REFOLLOW`, `AURA_SEO`); her anahtar `{ tr, en }`; `registry.mjs` birleştirir. |
| `tools/i18n/expand.mjs` | `expandI18n`, `pick` (locale `tr` ise `tr`, aksi halde `en`). |
| `tools/templates/*.master.html` | Hub, site gizlilik/destek, AURA master şablonları. |
| `pages/refollow/policies/*.html` | ReFollow uzun politika gövdesi (TR/EN blokları) + yerelleştirilmiş krom (nav, footer, meta). |

## Fallback

- **URL:** Eski dil öneki (`/de/`, `/fr/`, …) `assets/site-path.js` içinde `/en` + aynı mantıksal yola yönlendirilir. Bilinmeyen veya eksik segment **EN**.
- **Metin:** `pick()` — istenen locale `tr` değilse **İngilizce** string; yoksa `tr` yedek.

## ReFollow uzun metin

Tam hukuk gövdesi yalnızca **Türkçe** ve **İngilizce** bloklar halinde kaynakta kalır. Ek dil uyarı bandı yok (yalnız TR / EN build çıktısı).

## AURA hukuk gövdesi

Tam metin TR/EN; başlık ve `meta` açıklamaları `AURA_SEO` ile build’de doldurulur. Gövde seçimi `assets/aura-legal-pages.js` ile; dil şeridi yalnız TR ve EN düğmeleri.

## Dil seçici

`/{tr|en}/…` yolunda düğmeler `GezegenselSitePath.navigateToLocaleSegment` ile aynı mantıksal sayfanın diğer dil URL’sine gider. `<title>` yol modunda `gezegensel.js` tarafından ezilmez (statik SEO başlığı korunur).

## hreflang ve sitemap

- Sayfa başına: `hreflang="tr"`, `hreflang="en"`, `hreflang="x-default"` (EN URL).
- `sitemap.xml`: kök `/` + her mantıksal yol için yalnızca `/tr/…` ve `/en/…` girdileri.

Son güncelleme: 2026-04-18
