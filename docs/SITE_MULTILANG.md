# Site — 12 dil (2026-11-01)

ReFollow sayfalarından sonra sitenin geri kalanı da (anasayfa, site gizlilik/destek, Anima, Night Swarm) uygulamadaki 12 dilde yayında: `tr, en, pt-br, es, de, fr, ar, hi, bn, fa, ne, ur` (RTL: `ar, fa, ur`).

## Hangi sayfa hangi dilde gerçekten çevrili

| Sayfa grubu | Gerçek çeviri | Diğer diller |
|---|---|---|
| ReFollow (`/{dil}/refollow/`, politikalar) | 12 dil (uygulama metinleri) | — |
| Anasayfa, site gizlilik/destek | tr, en | çerçeve yerel, gövde İngilizce |
| Anima tanıtım + hukuk sayfaları | tr, en | çerçeve yerel, gövde İngilizce |
| Night Swarm | tr, en | çerçeve yerel, gövde İngilizce |

**Neden gövde İngilizce:** Bu sayfaların metni uygulama klasörlerinde yok (uygulama metinleri değil, site metni). Anima uygulamasında de/fr/es/pt-BR/ar/it çevirileri var ama site metniyle birebir eşleşmiyor; Night Swarm ve hub için çeviri kaynağı yok. Kural: metin uydurulmaz.

**Hukuk metinleri:** Anima gizlilik/şartlar gövdesi TR/EN kalır (kaynak `Anima/legal-public`, `sync-anima-policies.mjs`). Diğer dillerde `assets/anima-legal-pages.js` kısa bir uyarı bandı gösterir (de/fr/es/pt-br/ar yerel, hi/bn/fa/ne/ur İngilizce).

**İtalyanca:** Siteye eklenmedi (Anima uygulamasında var, ReFollow'da yok). `/it/…` yolları EN'e düşer.

## Yerelleştirilmiş çerçeve (tr/en dışı diller)

- `<html lang dir>` — RTL dillerde sayfa kabuğu sağdan sola; `<main lang="en" dir="ltr">`.
- Menü, atlama linki, footer, telif satırı: `tools/i18n/messages/refollow-site-ui.mjs` (ReFollow sayfalarıyla aynı sözlük).
- Tema düğmeleri: ReFollow uygulaması `settings.themeTitle / themePaletteLight / themePaletteDark`.
- Dil seçici `🌐 XX ▾` (görünmez yerel `<select>`) — her sayfada, tr/en dahil.
- Gövdenin başında "This page is available in English only." notu (Anima hukuk sayfalarında yerine uyarı bandı).

## SEO

- tr/en dışı sayfalarda `canonical` ve `og:url` → `/en/…`; `hreflang` yalnızca `tr`, `en`, `x-default`. Kopya içerik sorunu olmaz.
- `sitemap.xml` yalnızca gerçek çevirileri listeler (değişmedi).

## Nasıl üretilir

```bash
node tools/sync-refollow-policies.mjs   # hepsi: tr/en + ReFollow + chrome + 12 dil
node tools/build-site-locales.mjs       # yalnızca hub/Anima/Night Swarm dil kopyaları
```

Kaynak: elle bakılan `/en/…` sayfaları (ReFollow hariç). **`/en/` sayfasını düzenle, sonra build-site-locales'i çalıştır**; diğer 10 dil oradan üretilir. Üretilen dosyalar `<html … data-gc-generated="site-locale">` işaretlidir; `apply-shared-chrome.mjs` bunları atlar. Elle düzenlemeyin.

## Dosyalar

| Dosya | Görev |
|---|---|
| `tools/refollow-locales.mjs` | 12 dil listesi (`REFOLLOW_LOCALES`), `SITE_LOCALES` artık 12 dil |
| `tools/site-locales.mjs` | Ortak: dil seçici HTML'i, mantıksal yol, çerçeve sözlüğü, hangi dillerin gerçek çeviri olduğu |
| `tools/build-site-locales.mjs` | tr/en seçici yükseltmesi + 10 dilde sayfa üretimi |
| `tools/apply-shared-chrome.mjs` | tr/en başlığında artık 12 dilli seçici üretir; `site-locale` sayfalarını atlar |
| `assets/site-path.js` | `SITE_LOCALES` = 12 dil; `/de/index.html` gibi yollar artık EN'e yönlenmez |
| `assets/anima-legal-pages.js` | 12 dil, RTL ar/fa/ur, uyarı bandı metinleri; `it` kaldırıldı |

## Bu turda düzeltilen

- `en/privacy.html` ve `en/support.html` Türkçe başlık/`lang="tr"` ile yayındaydı; `privacy.mjs` / `support.mjs` içindeki İngilizce metinlerle düzeltildi.

## Test (2026-11-01)

Playwright, 12 dil × 12 sayfa (144 sayfa), 360 px genişlik: yatay taşma yok, RTL'de `scrollWidth ≤ clientWidth`, seçici her sayfada 12 seçenekli ve doğru dil seçili, eski TR|EN düğmesi kalmadı, JS hatası yok. Seçiciyle dil değiştirme, ilk açılışta tarayıcı diline yönlendirme (`/`, `/privacy.html`, `/anima/privacy-policy.html`, `/aura/…`, `/refollow/`) ve `/it/…` → EN doğrulandı.
