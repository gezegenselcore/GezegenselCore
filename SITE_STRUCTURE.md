# gezegenselcore.com — dosya haritası

**Tema:** `D:\GezegenselCore\Theme` altındaki **Freelancer (Jekyll)** zip’inden derlenen statik varlıklar — `assets/freelancer/` (`bootstrap.min.css`, `css/main.css`, `js/*`, `img/*`, Font Awesome). Renkler zip yerine marka paleti: `primary` **#00f2fe**, `secondary` **#0d2137** (`main.css` içinde liquid yerine sabitlenmiş). Üzerine ince katman: `assets/gezegensel.css` (TR/EN, dil düğmeleri, iç sayfa metinleri).

**Dil:** `assets/lang-boot.js` (senkron, ilk boyamadan önce) + `assets/gezegensel.js` (TR/EN düğmeleri, `localStorage` anahtarı `gezegensel-lang`). Tarayıcı `navigator.languages` içinde `tr*` → Türkçe; aksi İngilizce.

## Kök (`/`)

| Dosya / klasör | Açıklama |
|----------------|----------|
| `index.html` | Ana sayfa (`#about`, `#apps`, `#policies` — uygulama/politika kartları dikey ortalı; `assets/gezegensel.css` tema zeminleri) |
| `privacy.html`, `support.html` | Site gizlilik / destek |
| `assets/freelancer/` | Freelancer zip’ten kopyalanan CSS/JS/img/FA |
| `assets/icons/` | `Theme/icons` kaynaklı uygulama ve marka görselleri (deploy için burada tutulur) |
| `assets/gezegensel.css` | Dil / `#content-tr`·`#content-en` / iç sayfa ince ayar |
| `assets/gezegensel.js` | Dil seçici + başlık senkronu |
| `assets/lang-boot.js` | Erken `html[lang]` |
| `CNAME` | `gezegenselcore.com` |
| `app-ads.txt` | Reklam doğrulama |
| `README.md` | Repo + GitHub Pages notları |

## `pages/aura/` · `pages/refollow/`

Uygulama HTML’leri; **Bootstrap 3** üst çubuk (`navbar`), sol üst görünen marka **Gezegensel Core** (boşluklu) → kök `index.html`. Adres ve e-posta birleşik `gezegenselcore.com` / `support@gezegenselcore.com`. Freelancer bölümleri + footer. Varlıklar: `../../../assets/freelancer/…`, `../../../assets/icons/…`, `../../../assets/gezegensel.css` (`pages/*/policies/`); `pages/aura/support.html` için `../../assets/…`.

## Yayın (GitHub Pages)

Kaynak repo ör. `gezegenselcore/gezegenselcore.github.io` — `main` kökten yayın; `CNAME` özel alanı işaret eder. Push sonrası birkaç dakika içinde `https://gezegenselcore.com` güncellenir.

Son güncelleme: 2026-04-10
