# gezegenselcore.com — dosya haritası

**Çok dilli kanonik yollar:** Asıl içerik `/{locale}/…` altında (`locale` ∈ `tr`, `en`, `de`, `fr`, `es`, `it`, `pt-br`, `ar`). Kök `index.html`, `privacy.html`, `support.html`, `aura/*.html`, `pages/aura/support.html` **yönlendirme** (kullanıcı diline göre `/{locale}/…`). Ayrıntı: **`docs/README.md`**, **`docs/APP_WEB_ALIGNMENT.md`**.

**AURA kamu hukuk — tam metin:** `tools/templates/aura-privacy.master.html`, `aura-terms.master.html`, `aura-support.master.html` (ilk `node tools/build-locale-pages.mjs` çalıştırmasında mevcut siteden kopyalanır). Üretilen canlı dosyalar: `/{locale}/aura/privacy-policy.html`, `/{locale}/aura/terms-of-use.html`, `/{locale}/pages/aura/support.html`.

**English:** Legacy paths without `/{locale}/` redirect to the localized URL; `x-default` hreflang points to `en`. See `assets/site-path.js`.

**Tema:** `assets/freelancer/` (Bootstrap 3 + Freelancer). Marka katmanı: `assets/gezegensel.css`, `assets/lang-boot.js`, `assets/gezegensel.js`, **`assets/site-path.js`**, `assets/legacy-path-redirect.js`, `assets/root-locale-redirect.js`. AURA hukuk: `assets/aura-legal-pages.{js,css}`.

## Kök (`/`)

| Dosya / klasör | Açıklama |
|-----------------|----------|
| `index.html` | **Yönlendirme** → `/{locale}/index.html` (`root-locale-redirect.js`). |
| `privacy.html`, `support.html` | **Yönlendirme** → `/{locale}/privacy.html` vb. |
| `assets/` | Ortak JS/CSS; yukarıdaki çözümleyiciler. |
| `tools/build-locale-pages.mjs` | Locale ağacını üretir. |
| `tools/templates/` | `index.master.html`, `privacy.master.html`, `support.master.html`, `aura-*.master.html`. |
| `docs/` | Site mimarisi ve Aura hizalama belgeleri. |

## `/{locale}/` (ör. `en/`, `tr/`, `pt-br/`)

| Yol | Açıklama |
|-----|----------|
| `{locale}/index.html` | Ana hub (CTA, politikalar). |
| `{locale}/privacy.html`, `support.html` | Site gizlilik / destek. |
| `{locale}/aura/privacy-policy.html`, `terms-of-use.html` | AURA hukuk (8 dil şeridi; gövde TR+EN). |
| `{locale}/pages/aura/support.html` | AURA destek. |
| `{locale}/pages/refollow/policies/*.html` | ReFollow politikaları. |

Varlık yolları: bir seviye `../assets/` (`en/index.html`); iç içe sayfalar için çoklu `../`.

## `aura/` (kök — legacy)

| Dosya | Davranış |
|-------|----------|
| `privacy-policy.html`, `terms-of-use.html` | **Yönlendirme** stub → `/{locale}/aura/…` |

## `pages/aura/`

| Dosya | Davranış |
|-------|----------|
| `support.html` | **Yönlendirme** stub. |
| `policies/*.html` | **Yönlendirme** stub → locale’li kanonik. |

## `pages/refollow/` (kök)

Orijinal `pages/refollow/policies/*.html` **kaynak**; build çıktısı `/{locale}/pages/refollow/…` altında çoğaltılır. Kök dosyalar GitHub’da kalır (derleme sırasında üzerine yazılmaz).

## Yayın

`main` kökten GitHub Pages; `CNAME` → `gezegenselcore.com`. `sitemap.xml` tüm locale URL’lerini listeler.

**Policy senkronu (Aura mobil repo):** `legal-public/aura/*.html` + `legal-public/assets/` bu yapı ile uyumlu tutulur; uygulama `src/utils/gezegenselLegalUrls.ts` ile tarayıcıda doğru `/{locale}/…` açar.

Son güncelleme: 2026-04-18
