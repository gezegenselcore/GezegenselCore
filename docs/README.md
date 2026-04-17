# gezegenselcore.com — teknik dokümantasyon

Bu klasör, marka statik sitesinin **çok dilli URL mimarisi**, **yönlendirme / legacy davranışı**, **üretim (build) akışı** ve **Aura uygulaması ile hizalama** bilgisini toplar. Canlı site: [https://gezegenselcore.com](https://gezegenselcore.com).

## Hızlı özet

| Konu | Açıklama |
|------|-----------|
| Dil segmentleri | `tr`, `en`, `de`, `fr`, `es`, `it`, `pt-br`, `ar` — URL’de küçük harf; `hreflang` için `pt-br` → `pt-BR`. |
| Kanonik içerik | Her dil altında aynı mantıksal yollar: örn. `/de/aura/privacy-policy.html`. |
| Kök legacy | `/`, `/privacy.html`, `/support.html`, `/aura/*.html`, `/pages/aura/support.html` → kullanıcı tercihi + `legacy-path-redirect.js` / `root-locale-redirect.js` ile `/{locale}/…` adresine. |
| Ortak çözümleyici | `assets/site-path.js` → `GezegenselSitePath` (`buildAbsoluteUrl`, `getLogicalPath`, `navigateToLocaleSegment`). |
| Navbar / iç sayfa | `assets/lang-boot.js` (`data-ui-locale`), `assets/gezegensel.js` (path modunda dil düğmesi navigasyon). |
| AURA hukuk HTML | `assets/aura-legal-pages.js` — tam gövde TR/EN; dil şeridi navigasyon; Arapça `dir=rtl` kabuk + `article` LTR. |
| Üretim | `node tools/build-locale-pages.mjs` — şablonlar `tools/templates/*` + `tools/i18n/messages/*` (`{{i18n:…}}` / `{{i18nH:…}}`); AURA tam metin master’ları `aura-*.master.html` (ilk çalıştırmada mevcut siteden oluşturulur). |
| Sitemap | `sitemap.xml` — `build-locale-pages.mjs` ile üretilir: 8 dil × 9 mantıksal yol + kök `/` + legacy kök stub’ları + yerelleştirilmemiş ReFollow kök politikaları; tekrarlayan `<loc>` yok. |

## Dosya ve klasör

- **`assets/site-path.js`** — Dil segmenti listesi, mantıksal yol çıkarma, `localStorage` ile senkron yönlendirme.
- **`assets/legacy-path-redirect.js`** — Kök stub sayfalarında `data-logical="/…"` ile hedef locale URL’sine `location.replace`.
- **`assets/root-locale-redirect.js`** — Sadece `/` ve `/index.html` için hub yönlendirmesi.
- **`tools/build-locale-pages.mjs`** — 8 dil × (index, privacy, support, 3×AURA, 3×ReFollow) üretir; kök AURA ve site sayfalarını redirect stub yapar.
- **`tools/templates/`** — `index.master.html`, `privacy.master.html`, `support.master.html`, `aura-*.master.html` (AURA gövdesi; hukuk metni güncellenince burayı veya üretim kaynağını güncelleyin).

## İçerik ve dil geri dönüşü (fallback)

- **Hub, site `privacy` / `support`, ReFollow kromu:** Metinler build’de seçilir; `tools/i18n/expand.mjs` içinde **locale → en → tr**. İstemci tarafında çoklu `l10n-*` kardeşi gerekmez (sayfa tek dil HTML olarak yayınlanır).
- **AURA kanonik hukuk:** Tam metin yalnız TR ve EN; diğer dillerde EN gövde + `aura-legal-fallback-banner` uyarısı.
- **ReFollow politikaları:** TR ve EN `lang-block` bölümleri; çoklu dil seçiminde aynı sıra (EN ikinci öncelik).

## SEO

- Her locale sayfasında: `link rel="canonical"`, `hreflang` (8 dil + `x-default` → EN), `og:url`, `og:type` (iç sayfalarda).
- **`robots.txt`** — değişmedi; gerekirse `Sitemap:` satırı eklenebilir.

## Aura mobil uygulama

- Repoda: `src/utils/gezegenselLegalUrls.ts`, `components/legal/AuraLegalThreeLinks.tsx`, `src/constants/legalVersions.ts` (`/en/…` fallback).
- `pt-BR` uygulama kodu → URL segmenti **`pt-br`**.

## Manuel kontrol listesi

- [ ] Firebase Remote Config URL parametrelerini `…/en/…` veya dil başına ayrı değerlerle güncelleyin.
- [ ] Play Console / App Store Connect’teki kamu URL’lerin yeni yolları gösterdiğini doğrulayın.
- [ ] `node tools/build-locale-pages.mjs` sonrası `legal-public` ve Aura `docs/` ile diff alın.

Son güncelleme: 2026-04-18
