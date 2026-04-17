# Aura uygulaması ↔ gezegenselcore.com hizalaması

## Dil kodları

| Aura `i18n.language` (ör.) | Web URL segmenti |
|----------------------------|-------------------|
| `tr` | `tr` |
| `en` | `en` |
| `de` | `de` |
| `fr` | `fr` |
| `es` | `es` |
| `it` | `it` |
| `pt-BR` | `pt-br` |
| `ar` | `ar` |
| Bilinmeyen | `en` |

Uygulama tarafı: `src/utils/gezegenselLegalUrls.ts` → `appLanguageToUrlSegment`, `buildGezegenselAuraLegalUrl`, `resolveLegalUrlForGezegenselWeb`.

## Üç kamu bağlantı

| Anlam | Örnek URL (DE) |
|-------|----------------|
| Gizlilik | `https://gezegenselcore.com/de/aura/privacy-policy.html` |
| Koşullar | `https://gezegenselcore.com/de/aura/terms-of-use.html` |
| Destek | `https://gezegenselcore.com/de/pages/aura/support.html` |

Remote Config’te verilen URL `gezegenselcore.com` içeriyorsa, uygulama açılışında yukarıdaki segment ile **yeniden yazar**; zaten `/{tr|en|…|ar}/aura/…` veya `…/pages/aura/…` biçiminde yerelleştirilmişse **dokunulmaz**. Eski kök biçim (`…/aura/privacy-policy.html` gibi, dil segmenti yok) RC’de kalmışsa yine kullanıcı diline göre **yeniden yazılır**. Harici CDN veya farklı alan adı ise RC URL’si **olduğu gibi** kullanılır.

## Web tarafı depolama

- Anahtar: `localStorage` **`gezegensel-lang`**
- Değer: `pt` kökenli diller için `pt-BR` yazılabilir; okuma tarafında `pt-br` ile eşdeğer kabul edilir (`lang-boot.js`, `site-path.js`, `gezegensel.js`, `aura-legal-pages.js`).

## Yayın sonrası

Site push edildikten sonra GitHub Pages önbelleği nedeniyle birkaç dakika gecikme olabilir. Hukuk metni değişince:

1. `tools/templates/aura-*.master.html` güncelleyin (veya üretim öncesi tam sürümü köke geri yükleyip script’i bir kez çalıştırarak master oluşturun).
2. `node tools/build-locale-pages.mjs`
3. Aura `legal-public/` ve gerekirse `docs/legal` ile senkron.
