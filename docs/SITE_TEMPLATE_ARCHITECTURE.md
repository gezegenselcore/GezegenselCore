# Site şablon mimarisi (güncel)

## İki kaynak akışı

1. **Elle bakım + kabuk script’i**  
   `tr/`, `en/`, kök `aura/`, `pages/` altındaki birçok sayfa **doğrudan HTML** olarak düzenlenir. Ortak **header** (dil anahtarı, burger, dört ana bağlantı), **ikonlu footer**, **`gc-tech-bg`** ve `gc-home-parallax.js` için:  
   `node tools/apply-shared-chrome.mjs`  
   (`tools/apply-shared-chrome.mjs` içinde yollar `relHref` ile derinliğe göre üretilir.)

2. **Build zamanı üretimi**  
   `node tools/build-locale-pages.mjs` — `tools/templates/*.master.html` + `tools/i18n/messages/*` ile belirli sayfaların `tr` / `en` kopyaları üretilir veya güncellenir. Üretimden sonra yine **`apply-shared-chrome`** ile kabuk hizalanması gerekebilir.

## Sayfa kabuğu (canlı yüzey)

| Katman | HTML / sınıf |
|--------|----------------|
| Arka plan | `<div class="gc-tech-bg">` → grid + şema katmanları. |
| Üst | `<header class="site-header">` → `.site-header__inner`, `.brand` (locale `index.html#ust`), `.gc-lang-switch`, masaüstü / mobil menü. |
| Gövde | **Hub:** `main` içinde `section.hero`, `about`, `gc-highlights`, `products`, `contact-block`. **İç:** `main#icerik`, `header.gc-page-hero`, `article.gc-doc` veya benzeri. |
| Alt | `<footer class="site-footer">` → `nav.gc-footer-nav` (SVG + metin: Gizlilik, Destek, İletişim, GitHub, Instagram). |

İç sayfalarda genelde `body` sınıfı: `gc-inner`.

## Dil

- Kanonik segmentler: **`/tr/…`** ve **`/en/…`**.  
- Ayrıntı: **`docs/SITE_I18N_ARCHITECTURE.md`**, yönlendirme: **`docs/README.md`**.

## SEO ve hukuk

- Sayfa başına `canonical`, mümkünse `hreflang` (`tr`, `en`, `x-default`).  
- Anima tam metin: `anima-legal-pages.js` ile TR/EN gövde seçimi.

## Bakım ipuçları

- Navbar veya footer metni değişince: **hub** (`tr/index.html`, `en/index.html`) güncellenir; ardından `apply-shared-chrome` diğer sayfalara yayılır.  
- Yalnız şablondan üretilen içerik değişince: önce **master** + `build-locale-pages`, sonra gerekiyorsa **apply-shared-chrome**.

Son güncelleme: 2026-04-18
