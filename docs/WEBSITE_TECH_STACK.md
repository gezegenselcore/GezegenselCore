# Marka web sitesi — teknoloji yığını (bu repo)

Bu repository **statik bir marka sitesidir** (GitHub Pages). **React Native / Expo kodu burada değildir**; mobil uygulama yığını için bkz. `docs/MOBILE_APP_STACK.md` ve Anima monoreposu.

## Çekirdek

| Katman | Teknoloji |
|--------|-----------|
| İşaretleme | HTML5 (semantik `header` / `main` / `footer`, `lang` özniteliği). |
| Stil | Saf **CSS**, tekincil kaynak kökteki **`style.css`** (`:root` değişkenleri, `gc-tech-bg` ızgarası, `site-header`, ikonlu `gc-footer-nav`, iç sayfa `gc-doc` / `gc-page-hero`). |
| Davranış | Hafif **vanilla JS** (`assets/gc-home-parallax.js` vb.); sayfa başına `defer`. |
| Yayın | **GitHub Pages** (`main` dalı, özel alan `CNAME`). |

## Araç zinciri (Node)

| Script | Rol |
|--------|-----|
| `tools/build-locale-pages.mjs` | Şablon + `tools/i18n/messages/*` ile `tr/` ve `en/` ağacını üretir / günceller. |
| `tools/apply-shared-chrome.mjs` | `tr/index.html` / `en/index.html` dışındaki, `style.css` kullanan sayfalarda ortak **tech arka plan**, **header** (dil anahtarı + menü), **ikonlu footer**, gerekirse **Font Awesome** (yalnız `fa-*` sınıfı olan sayfalar) ve `style.css?v=…` sürüm parametresi. **Tüm HTML** `<head>` içine Google Ads `gtag` (`AW-18302657879`) basılır. |

Çalıştırma örneği:

```bash
cd D:\GezegenselCore\gezegenselcore.com
node tools\build-locale-pages.mjs
node tools\apply-shared-chrome.mjs
```

## Varlıklar ve çok dillilik

- **`assets/site-path.js`**, **`lang-boot.js`**, **`gezegensel.js`**, **`legacy-path-redirect.js`**, **`root-locale-redirect.js`**: URL segmenti (`tr` \| `en`), legacy yollar, isteğe bağlı UI dili.  
- **Anima kamu hukuk:** `assets/anima-legal-pages.js` (+ ilgili CSS), tam gövde TR/EN.  
- **İkonlar:** Footer’da **satır içi SVG**; ReFollow destek sayfasındaki Google Play rozeti için **Font Awesome 6** (CDN, yalnız ilgili HTML’lerde).

## Eski tema dosyaları (`assets/freelancer/`, `gc-design-system.css`)

Jekyll / Freelancer tabanlı **alternatif veya geçmiş** sayfa üretimi için repoda durabilir; **canlı hub ve çoğu locale sayfası** kök **`style.css`** ile hizalanmıştır. Yeni yüzeyler eklerken önce `style.css` ve `docs/DESIGN_SYSTEM.md` ile uyumu kontrol edin.

## Ölçüm

- **Google tag:** `AW-18302657879` — `apply-shared-chrome.mjs` ile her sayfanın `<head>` öğesine. Mevcut GA4 / GTM yoktu; bu tek Ads hesabı. Consent Mode (AEA) yok; PMax hedefi UK + Canada.  
- **ReFollow Play dönüşümü:** `AW-18302657879/RsCVCOjIhPkcENfKsZdE` — ürün sayfalarındaki Play CTA `onclick`. Dönüşüm ping’i gönderilir, Play Store’a **hemen** gidilir (`event_callback` beklenmez; aksi halde gtag yüklenmezse buton hiçbir yere gitmez). PMax final URL: [https://gezegenselcore.com/en/refollow/](https://gezegenselcore.com/en/refollow/).  
- **Takip:** gizlilik metnine kısa bir “Google Ads ile reklam performansı ölçülür” cümlesi — acil değil, yayın sonrası.

Son güncelleme: 2026-09-15
