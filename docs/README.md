# gezegenselcore.com — teknik dokümantasyon

Bu klasör, marka statik sitesinin **URL mimarisi**, **yönlendirme**, **üretim (build)**, **ortak kabuk (header / footer / grid)** ve **Anima uygulaması ile hizalama** bilgisini toplar.

**Canlı site:** [https://gezegenselcore.com](https://gezegenselcore.com) — GitHub kaynak: [`gezegenselcore/GezegenselCore`](https://github.com/gezegenselcore/GezegenselCore).

## Hızlı özet

| Konu | Açıklama |
|------|-----------|
| **Birincil stil** | Kök **`style.css`** — lacivert kare ızgara (`gc-tech-bg`), kurumsal header, **ikonlu footer** (`gc-footer-nav` + SVG). |
| **Kabuk senkronu** | `node tools/apply-shared-chrome.mjs` — iç sayfalara tech-bg, aynı header yapısı, ikonlu footer, `style.css?v=…`, gerekirse Font Awesome CDN. |
| Dil segmentleri | Yalnızca **`tr`** ve **`en`** (URL’de küçük harf). |
| Kanonik içerik | Örn. `/en/anima/privacy-policy.html`, `/tr/anima/privacy-policy.html`. |
| Eski URL’ler | `assets/site-path.js`, `legacy-path-redirect.js`, `root-locale-redirect.js`, kök `404.html`. |
| Üretim | `node tools/build-locale-pages.mjs` — şablonlar `tools/templates/*`, çeviriler `tools/i18n/messages/*`. |
| Sitemap | `sitemap.xml` — locale çiftleri + kök `/`. |

## Belge haritası

| Dosya | İçerik |
|--------|--------|
| **`REPOSITORY_LAYOUT.md`** | Hedef klasör yapısı (`.github`, `assets`, `tr`/`en`, `docs`, `tools`, kök dosyalar). |
| **`WEBSITE_TECH_STACK.md`** | Bu repodaki web yığını (HTML, CSS, GitHub Pages, Node script’leri). |
| **`MOBILE_APP_STACK.md`** | Anima mobil yığınına kısa işaret (kod Anima reposunda). |
| **`DESIGN_SYSTEM.md`** | `style.css` jetonları, grid, footer, iç sayfa. |
| **`SITE_TEMPLATE_ARCHITECTURE.md`** | Kabuk katmanları, build vs elle sayfalar. |
| **`SITE_I18N_ARCHITECTURE.md`** | Build i18n, `tr`/`en`, hreflang. |
| **`APP_WEB_ALIGNMENT.md`** | Anima ↔ web URL kuralları. |

## Önemli dosya yolları (kök)

- **`style.css`** — global tema ve ızgara.  
- **`assets/site-path.js`** — segment listesi, mantıksal yol, `navigateToLocaleSegment`.  
- **`assets/gc-home-parallax.js`** — tech arka plana hafif fare parallax.  
- **`tools/apply-shared-chrome.mjs`** — ortak HTML kabuğu.  
- **`tools/build-locale-pages.mjs`** — locale ağacı üretimi.

## Anima mobil uygulama

- Uygulama dili **`tr`** ise web **`/tr/…`**; aksi halde **`/en/…`**.  
- Uygulama kodu bu repoda değildir; bkz. **`docs/MOBILE_APP_STACK.md`** ve Anima reposu.

## Manuel kontrol listesi

- [ ] Yeni iç sayfa eklendiyse: `node tools/apply-shared-chrome.mjs` çalıştırıldı mı?  
- [ ] Firebase Remote Config kamu URL’leri `/tr/…` veya `/en/…` ile mi?  
- [ ] Hukuk metni değişince: master şablonlar + `build-locale-pages` + Anima `legal-public` senkronu.

Son güncelleme: 2026-04-18
