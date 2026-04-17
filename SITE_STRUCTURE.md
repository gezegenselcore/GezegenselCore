# gezegenselcore.com — dosya haritası

**Kanonik yollar:** Asıl içerik yalnızca `/tr/…` ve `/en/…` altında. Kök `index.html`, `privacy.html`, `support.html`, `aura/*.html`, `pages/aura/support.html` **yönlendirme** (kullanıcı tercihi + `legacy-path-redirect.js` / `root-locale-redirect.js` ile locale önekli adrese). Eski, artık yayınlanmayan dil önekli istekler `assets/site-path.js` ile **aynı mantıksal yolun** `/en/…` sürümüne düşer. Ayrıntı: **`docs/README.md`**, **`docs/APP_WEB_ALIGNMENT.md`**.

**AURA kamu hukuk — tam metin:** `tools/templates/aura-privacy.master.html`, `aura-terms.master.html`, `aura-support.master.html` (ilk `node tools/build-locale-pages.mjs` çalıştırmasında mevcut siteden kopyalanır). Üretilen canlı dosyalar: `/{tr|en}/aura/privacy-policy.html`, `/{tr|en}/aura/terms-of-use.html`, `/{tr|en}/pages/aura/support.html`.

**English:** `x-default` hreflang ve bilinmeyen dil fallback’i `en`’i işaret eder. Bkz. `assets/site-path.js`.

**Tema:** `assets/freelancer/` (Bootstrap 3 + Freelancer). Marka katmanı: `assets/gezegensel.css`, `assets/lang-boot.js`, `assets/gezegensel.js`, **`assets/site-path.js`**, `assets/legacy-path-redirect.js`, `assets/root-locale-redirect.js`. AURA hukuk: `assets/aura-legal-pages.{js,css}`.

## Kök (`/`)

| Dosya / klasör | Açıklama |
|-----------------|----------|
| `index.html` | **Yönlendirme** → `/tr/index.html` veya `/en/index.html` (`root-locale-redirect.js`). |
| `privacy.html`, `support.html` | **Yönlendirme** → `/tr/…` veya `/en/…` (`legacy-path-redirect.js`). |
| `404.html` | GitHub Pages 404; `site-path.js` ile eski dil önekli yollar `/en/…`’e. |
| `assets/` | Ortak JS/CSS; yukarıdaki çözümleyiciler. |
| `tools/build-locale-pages.mjs` | `tr` / `en` ağacını üretir; `tools/i18n/` çeviri paketini uygular. |
| `tools/templates/` | `index.master.html`, `privacy.master.html`, `support.master.html`, `aura-*.master.html`. |
| `docs/` | Site mimarisi ve uygulama hizalama belgeleri. |

## `/tr/` ve `/en/`

| Yol | Açıklama |
|-----|----------|
| `tr/index.html`, `en/index.html` | Ana hub (CTA, politikalar). |
| `tr/privacy.html`, `en/privacy.html`, `…/support.html` | Site gizlilik / destek. |
| `…/aura/privacy-policy.html`, `…/aura/terms-of-use.html` | AURA hukuk (dil şeridi TR / EN; gövde TR + EN). |
| `…/pages/aura/support.html` | AURA destek. |
| `…/pages/refollow/policies/*.html` | ReFollow politikaları. |

Varlık yolları: bir seviye `../assets/` (`en/index.html`); iç içe sayfalar için çoklu `../`.

## `aura/` (kök — legacy)

| Dosya | Davranış |
|-------|----------|
| `privacy-policy.html`, `terms-of-use.html` | **Yönlendirme** stub → `/tr/aura/…` veya `/en/aura/…` |

## `pages/aura/`

| Dosya | Davranış |
|-------|----------|
| `support.html` | **Yönlendirme** stub. |

## `pages/refollow/` (kök)

Orijinal `pages/refollow/policies/*.html` **kaynak**; build çıktısı `/tr/pages/refollow/…` ve `/en/pages/refollow/…` altında çoğaltılır. Kök dosyalar GitHub’da kalır (derleme sırasında üzerine yazılmaz).

## Yayın

`main` kökten GitHub Pages; `CNAME` → `gezegenselcore.com`. `sitemap.xml` yalnızca `tr` ve `en` locale URL’lerini (+ kök `/`) listeler.

**Policy senkronu (Aura mobil repo):** `legal-public/aura/*.html` + `legal-public/assets/` bu yapı ile uyumlu tutulur; uygulama tarafında dil `tr` → `/tr/…`, diğerleri → `/en/…` kuralı geçerlidir.

Son güncelleme: 2026-04-18
