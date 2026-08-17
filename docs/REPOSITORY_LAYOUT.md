# Depo dizin yapısı (hedef düzen)

Tüm çalışmalar **`D:\GezegenselCore\gezegenselcore.com`** (GitHub: [`gezegenselcore/GezegenselCore`](https://github.com/gezegenselcore/GezegenselCore)) kökünde toplanır. Yanlış yazılmış `gezegensenselcore.com` gibi kopya klasörler kullanılmaz; araçlar yalnızca bu repodaki **`tools/`** altında tutulur.

## Kök seviyesi

| Yol | Açıklama |
|-----|-----------|
| **`.github/`** | GitHub notları (ör. `PAGES.md`). |
| **`assets/`** | Görseller, ortak JS (`site-path.js`, `gc-home-parallax.js`, `anima-legal-pages.js`, …), eski tema / yardımcı CSS (`gezegensel.css`, `gc-design-system.css`, Freelancer vb.). |
| **`tr/`**, **`en/`** | Kanonik dil ağaçları: hub, site gizlilik/destek, Anima ve ReFollow sayfaları. |
| **`aura/`**, **`pages/`** | Kök **legacy** ve yönlendirme stub’ları; kanonik içerik `tr/` ve `en/` altında. |
| **`docs/`** | Bu klasör — mimari, tasarım, i18n, Anima ve ReFollow hizalaması. |
| **`tools/`** | `build-locale-pages.mjs`, `apply-shared-chrome.mjs`, şablonlar, i18n mesajları. |
| **`style.css`** | Marka sitesinin birincil stil dosyası (grid, header, footer, iç sayfa). |
| **`index.html`**, **`404.html`**, **`privacy.html`**, **`support.html`** | Kök hub / hata / legacy girişler. |
| **`CNAME`**, **`sitemap.xml`**, **`robots.txt`** | Yayın ve SEO. |

## Özet

- **Statik site:** HTML + kök `style.css` + `assets/*.js` (ihtiyaca göre).  
- **Üretim:** `node tools/build-locale-pages.mjs` (şablonlardan `tr/` / `en/` üretimi).  
- **Kabuk senkronu:** `node tools/apply-shared-chrome.mjs` (elle düzenlenen sayfalarda ortak header, ikonlu footer, `gc-tech-bg`, parallax).

Son güncelleme: 2026-04-18
