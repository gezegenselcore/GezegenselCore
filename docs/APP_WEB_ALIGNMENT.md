# Anima uygulaması ↔ gezegenselcore.com hizalaması

## Dil kodları (web URL)

| Uygulama / bağlam | Web URL segmenti |
|-------------------|------------------|
| Türkçe (`tr`) | `tr` |
| İngilizce ve uygulamadaki diğer tüm dil kodları veya bilinmeyen | `en` |

**Kural:** Web sitesi yalnızca **`/tr/…`** ve **`/en/…`** üretir ve indeksler. Anima uygulaması içi dil **`tr`** ise kamu hukuk / destek bağlantıları **`https://gezegenselcore.com/tr/…`**; **aksi halde** her zaman **`https://gezegenselcore.com/en/…`**.

Uygulama tarafı implementasyonu Anima mobil reposundadır (ör. `gezegenselLegalUrls` benzeri yardımcılar); bu belge **web davranışının** referans sözleşmesidir. Statik sayfaların görsel kabuğu (header, ikonlu footer, tech ızgara) kök `style.css` ve `tools/apply-shared-chrome.mjs` ile tutarlıdır.

## Örnek kamu bağlantılar

| Anlam | Türkçe | English |
|-------|--------|---------|
| Gizlilik | `https://gezegenselcore.com/tr/anima/privacy-policy.html` | `https://gezegenselcore.com/en/anima/privacy-policy.html` |
| Koşullar | `https://gezegenselcore.com/tr/anima/terms-of-use.html` | `https://gezegenselcore.com/en/anima/terms-of-use.html` |
| Destek | `https://gezegenselcore.com/tr/pages/anima/support.html` | `https://gezegenselcore.com/en/pages/anima/support.html` |

Remote Config’te verilen URL `gezegenselcore.com` içeriyorsa, uygulama açılışında yukarıdaki **iki segment kuralına** göre **yeniden yazar**; zaten `/tr/…` veya `/en/…` biçiminde yerelleştirilmişse **dokunulmaz**. Eski kök biçim (`…/anima/privacy-policy.html` gibi, dil segmenti yok) RC’de kalmışsa yine kullanıcı diline göre **yeniden yazılır**. Harici CDN veya farklı alan adı ise RC URL’si **olduğu gibi** kullanılır.

## Statik site çok dillilik (özet)

- Hub ve marka sayfaları: `tools/i18n/messages/` + `{{i18n:…}}` ile **yalnızca TR ve EN**; ayrıntı: `docs/SITE_I18N_ARCHITECTURE.md`.

## Anima ürün sayfası (pazarlama / tanıtım)

| | URL |
|---|-----|
| Türkçe | `https://gezegenselcore.com/tr/anima/` |
| English | `https://gezegenselcore.com/en/anima/` |

Öne çıkan alan açıklamalarının metin SSOT’u: **`docs/AURA_PRODUCT_PAGE_COPY.md`**. Uygulamada eski “AI Rehber” adı web metinlerinde kullanılmaz; özellik adı **Anima** olarak geçer.

## Web tarafı depolama

- Anahtar: `localStorage` **`gezegensel-lang`**
- Değer: yalnızca `tr` veya `en` kalıcı; eski depolama değerleri okunurken **en**e normalize edilir (`site-path.js`, `lang-boot.js`, `gezegensel.js`, `anima-legal-pages.js`).

## Yayın sonrası

Site push edildikten sonra GitHub Pages önbelleği nedeniyle birkaç dakika gecikme olabilir. Hukuk metni değişince:

1. `tools/templates/aura-*.master.html` güncelleyin (veya üretim öncesi tam sürümü köke geri yükleyip script’i bir kez çalıştırarak master oluşturun).
2. `node tools/build-locale-pages.mjs`
3. Anima `legal-public/` ve gerekirse `docs/legal` ile senkron.

Son güncelleme: 2026-05-04
