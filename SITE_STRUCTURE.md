# gezegenselcore.com — dosya haritası

**AURA public legal — tek kaynak (canonical):** Yalnız şu üç URL tam hukuki / destek metnini taşır: `/aura/privacy-policy.html`, `/aura/terms-of-use.html`, `/pages/aura/support.html`. Başka bir yolda AURA hukuk gövdesi yoktur.

**English:** Only these canonical legal URLs are used. Legacy paths under `/pages/aura/policies/` are redirect stubs (meta refresh + click-through link); they do not duplicate policy text.

**Tema:** `D:\GezegenselCore\Theme` altındaki **Freelancer (Jekyll)** zip’inden derlenen statik varlıklar — `assets/freelancer/` (`bootstrap.min.css`, `css/main.css`, `js/*`, `img/*`, Font Awesome). Renkler zip yerine marka paleti: `primary` **#00f2fe**, `secondary` **#0d2137** (`main.css` içinde liquid yerine sabitlenmiş). Üzerine ince katman: `assets/gezegensel.css` (navbar + çoklu dil, iç sayfa metinleri).

**Dil (marka sitesi):** `assets/lang-boot.js` (ilk boyama: `html[lang]`, `data-boot-l10n` = `tr` \| `en`) + `assets/gezegensel.js` — navbar’da **8 dil** (`tr`, `en`, `de`, `fr`, `es`, `it`, `pt-BR`, `ar`), tercih **`localStorage` → `gezegensel-lang`** (Aura uygulaması `SUPPORTED_LANGUAGES` ile aynı kodlar). Sayfa içi `l10n-*` kardeşleri: seçilen dil varsa o metin, yoksa **TR**, aksi **EN**. **AURA kanonik hukuk HTML** (`aura/*.html`, `pages/aura/support.html`) ayrıca `aura-legal-pages.js` / `aura-legal-pages.css`: tam gövde yalnız **TR+EN**; diğer seçimlerde **EN** + kısa uyarı bandı.

## Kök (`/`)

| Dosya / klasör | Açıklama |
|----------------|----------|
| `index.html` | Ana sayfa (`#about`, `#apps`, `#policies` — uygulama/politika kartları dikey ortalı; `assets/gezegensel.css` tema zeminleri) |
| `privacy.html`, `support.html` | Site gizlilik / destek |
| `assets/freelancer/` | Freelancer zip’ten kopyalanan CSS/JS/img/FA |
| `assets/icons/` | `Theme/icons` kaynaklı uygulama ve marka görselleri (deploy için burada tutulur) |
| `assets/gezegensel.css` | Çoklu dil (`data-boot-l10n`, `l10n-*`) / `#content-tr`·`#content-en` (varsa) / iç sayfa ince ayar |
| `assets/gezegensel.js` | Dil seçici + başlık senkronu |
| `assets/lang-boot.js` | Erken `html[lang]` + `data-boot-l10n` (ilk boyama) |
| `assets/aura-legal-pages.js`, `assets/aura-legal-pages.css` | AURA kanonik hukuk / destek HTML (8 dil seçici; gövde TR+EN, diğerleri EN + uyarı) |
| `CNAME` | `gezegenselcore.com` |
| `app-ads.txt` | Reklam doğrulama |
| `README.md` | Repo + GitHub Pages notları |

## `aura/` (AURA — mağaza kamu URL)

| Dosya | Canlı URL | Not |
|-------|-----------|-----|
| `aura/privacy-policy.html` | `https://gezegenselcore.com/aura/privacy-policy.html` | Google Play gizlilik + hesap silme (**`#account-deletion`** TR §12, EN §12 **`#account-deletion-en`**) için **kanonik** adres. **Gövde:** Aura `legal-public/aura/privacy-policy.html` ile aynı; üstte 8 dil şeridi (`aura-legal-pages.*`). |
| `aura/terms-of-use.html` | `https://gezegenselcore.com/aura/terms-of-use.html` | Kamu **Kullanım Koşulları** (TR + EN). Aura `legal-public/aura/terms-of-use.html` ile senkron. |

## `pages/aura/`

| Dosya | Canlı URL | Not |
|-------|-----------|-----|
| `pages/aura/support.html` | `https://gezegenselcore.com/pages/aura/support.html` | AURA **destek** tam metni (TR + EN gövde; üstte 8 dil, `aura-legal-pages.*`). Aura `legal-public/aura/support.html` ile senkron. |
| `pages/aura/policies/*.html` | `/pages/aura/policies/…` | Yalnızca **yönlendirme stub** (`meta refresh` + tıklanabilir link). Hukuki gövde yok; kanonik `/aura/*.html`. Açıklama: `pages/aura/policies/README.md`. |

## `pages/refollow/`

Uygulama HTML’leri; **Bootstrap 3** üst çubuk (`navbar`), sol üst görünen marka **Gezegensel Core** (boşluklu) → kök `index.html`. ReFollow politika sayfaları bu klasörde. Varlıklar: `../../../assets/freelancer/…`, `../../../assets/icons/…`, `../../../assets/gezegensel.css`.

## Yayın (GitHub Pages)

Kaynak repo ör. `gezegenselcore/gezegenselcore.github.io` — `main` kökten yayın; `CNAME` özel alanı işaret eder. Push sonrası birkaç dakika içinde `https://gezegenselcore.com` güncellenir.

**Marka kökü (`index.html`):** AURA ve ReFollow tanıtım metinleri, `assets/gezegensel.css` ile ince stil; Freelancer / navbar script’lerine dokunulmadan güncellenir.

Son güncelleme: 2026-04-18
