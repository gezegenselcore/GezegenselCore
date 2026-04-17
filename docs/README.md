# gezegenselcore.com — teknik dokümantasyon

Bu klasör, marka statik sitesinin **iki dilli (TR / EN) URL mimarisi**, **yönlendirme / legacy davranışı**, **üretim (build) akışı** ve **Aura uygulaması ile hizalama** bilgisini toplar. Canlı site: [https://gezegenselcore.com](https://gezegenselcore.com).

## Hızlı özet

| Konu | Açıklama |
|------|-----------|
| Dil segmentleri | Yalnızca `tr` ve `en` — URL’de küçük harf. |
| Kanonik içerik | Her dil altında aynı mantıksal yollar: örn. `/en/aura/privacy-policy.html`, `/tr/aura/privacy-policy.html`. |
| Eski URL’ler | Artık yayımda olmayan eski dil URL önekleri `assets/site-path.js` ile **aynı mantıksal yolun** `/en/…` sürümüne yönlendirilir (GitHub Pages’te `404.html` + aynı script ile de desteklenir). |
| Kök legacy | `/`, `/privacy.html`, `/support.html`, `/aura/*.html`, `/pages/aura/support.html` → kullanıcı tercihi + `legacy-path-redirect.js` / `root-locale-redirect.js` ile `/tr/…` veya `/en/…` adresine. |
| Ortak çözümleyici | `assets/site-path.js` → `GezegenselSitePath` (`buildAbsoluteUrl`, `getLogicalPath`, `navigateToLocaleSegment`). |
| Navbar / iç sayfa | `assets/lang-boot.js` (`data-ui-locale`), `assets/gezegensel.js` (path modunda dil düğmesi navigasyon). |
| AURA hukuk HTML | `assets/aura-legal-pages.js` — tam gövde TR + EN; dil şeridi yalnız TR / EN. |
| Üretim | `node tools/build-locale-pages.mjs` — şablonlar `tools/templates/*` + `tools/i18n/messages/*` (`{{i18n:…}}` / `{{i18nH:…}}`); AURA tam metin master’ları `aura-*.master.html` (ilk çalıştırmada mevcut siteden oluşturulur). |
| Sitemap | `sitemap.xml` — yalnızca kök `/` + her mantıksal yol için `tr` ve `en` URL’leri; tekrarlayan `<loc>` yok. |

## Dosya ve klasör

- **`assets/site-path.js`** — Dil segmenti listesi (`tr` \| `en`), eski dil öneklerinden EN’ye yönlendirme, mantıksal yol çıkarma, `localStorage` ile senkron.
- **`assets/legacy-path-redirect.js`** — Kök stub sayfalarında `data-logical="/…"` ile hedef locale URL’sine `location.replace`.
- **`assets/root-locale-redirect.js`** — Sadece `/` ve `/index.html` için hub yönlendirmesi.
- **`404.html`** — Bilinmeyen yollar; eski çok dilli önek içeren isteklerde `site-path.js` ile `/en/…`’e düşer.
- **`tools/build-locale-pages.mjs`** — İki dil × (index, privacy, support, 3×AURA, 3×ReFollow) üretir; kök AURA ve site sayfalarını redirect stub yapar.
- **`tools/templates/`** — `index.master.html`, `privacy.master.html`, `support.master.html`, `aura-*.master.html` (AURA gövdesi; hukuk metni güncellenince burayı veya üretim kaynağını güncelleyin).

## İçerik ve dil geri dönüşü (fallback)

- **Tarayıcı / depolama:** Yalnızca `tr` açıkça Türkçe; **diğer tüm** dil kodları, eski `localStorage` değerleri ve bilinmeyen diller **İngilizce** (`en`) segmentine eşlenir.
- **Hub, site `privacy` / `support`, ReFollow kromu:** Metinler build’de seçilir; `tools/i18n/expand.mjs` içinde **tr → `tr`, aksi → `en`**.
- **AURA kanonik hukuk:** Tam metin yalnız TR ve EN; uyarı bandı kullanılmaz (şerit yalnız TR / EN).

## SEO

- Her locale sayfasında: `link rel="canonical"`, `hreflang` (**yalnızca** `tr`, `en`, `x-default` → EN), `og:url`, `og:type` (iç sayfalarda).
- **`robots.txt`** — değişmedi; gerekirse `Sitemap:` satırı eklenebilir.

## Aura mobil uygulama

- Uygulama içi dil **`tr`** ise web **`/tr/…`**; **diğer tüm** uygulama dilleri için web **`/en/…`** (detay: `docs/APP_WEB_ALIGNMENT.md`).
- Aura uygulama kodu bu repoda değişmez; hizalama kuralı web tarafında bu şekilde sabitlendi.

## Manuel kontrol listesi

- [ ] Firebase Remote Config URL parametrelerini `…/tr/…` veya `…/en/…` ile güncelleyin.
- [ ] Play Console / App Store Connect’teki kamu URL’lerin yeni yolları gösterdiğini doğrulayın.
- [ ] `node tools/build-locale-pages.mjs` sonrası `legal-public` ve Aura `docs/` ile diff alın.

Son güncelleme: 2026-04-18
