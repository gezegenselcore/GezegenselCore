# Tasarım sistemi — gezegenselcore.com (güncel)

## Amaç

Canlı marka yüzeyi **tek CSS dosyası** üzerinden yönetilir: kökteki **`style.css`**. Ton: açık zemin (`--gc-bg`), koyu lacivert metin (`--gc-ink`), **altın aksan** (`--gc-accent`). Arka planda çok düşük kontrastlı **kare ızgara** ve hafif **şema** dokusu (`#111A24` tabanlı `rgba`, bkz. `--gc-tech-grid` ve `.gc-tech-bg__layer--grid`).

## Birincil dosya: `style.css`

| Bölüm | İçerik |
|--------|--------|
| `:root` | Renkler, gölgeler, yarıçaplar, **`--gc-tech-grid`** (ızgara RGB), header yüksekliği. |
| **Arka plan** | `.gc-tech-bg` + `.gc-tech-bg__layer--grid` + `.gc-tech-bg__layer--schema` (sabit katman, `z-index: -1`, hafif parallax ile `gc-home-parallax.js`). |
| **Üst bilgi** | `.site-header`, `.site-header__inner`, `.brand`, `.nav-desktop`, `.nav-panel`, `.nav-burger`, `.gc-lang-switch`. |
| **Hub** | `.hero`, `.about`, `.gc-highlights`, `.products`, `.product-card`, `.contact-block`. |
| **İç sayfa** | `body.gc-inner`, `.gc-page-hero`, `.gc-crumb`, `.gc-doc` (kart zemini + ince doku `::before`). |
| **Alt bilgi** | `.site-footer`, `.gc-footer-nav` — bağlantı + **satır içi SVG** (`gc-footer-nav__icon`, `--stroke` / `--brand`). |
| **Butonlar** | `.btn-play`, `.btn-ghost`, `.gc-btn-stack`. |

Yükleme: her sayfada `<link rel="stylesheet" href="…/style.css?v=…">` (sürüm parametresi önbellek için; `apply-shared-chrome.mjs` güncelleyebilir).

## Eski / yardımcı varlıklar

| Dosya | Not |
|--------|-----|
| `assets/gezegensel.css`, `assets/gc-design-system.css` | Geçmiş veya alternatif tema yüzeyleri; **yeni hub ve locale sayfaları** `style.css` ile hizalanır. |
| `assets/freelancer/` | Bootstrap 3 + Freelancer şablonu; yalnızca eski/yardımcı sayfa yollarında kullanılıyorsa geçerli. |
| `assets/anima-legal-pages.css` | Anima hukuk sayfalarında dil şeridi ve gövde seçimi. |

## Ürün mesajı (hub)

- **Anima:** Yapay zekâ destekli wellness ve sağlık **rehberliği**; tıbbi teşhis veya tedavi iddiası yok.  
- **ReFollow:** Instagram dışa aktarım verisinde **içgörü** ve tablolar; veri cihazda işlenir.

Metinler `tr/index.html` ve `en/index.html` içinde tutulur; yasal uzun metinler ilgili politika sayfalarında.

## Erişilebilirlik ve etkileşim

- **Skip link** (`skip-link`) içeriğe atlar.  
- **Odak:** `:focus-visible` ile görünür halka (footer ve bağlantılar).  
- **Hareket:** `prefers-reduced-motion` altında tech katmanı dönüşümleri sadeleşir (`style.css` içinde media sorgusu).

## Bakım

- Global görünüm değişikliği: önce **`style.css`**, ardından gerekirse `node tools/apply-shared-chrome.mjs` ile tüm sayfalarda kabuk tutarlılığı.  
- Izgara / şema yoğunluğu: `.gc-tech-bg__layer--grid` ve şema SVG veri URL’sindeki opaklıklar.

Son güncelleme: 2026-04-18
