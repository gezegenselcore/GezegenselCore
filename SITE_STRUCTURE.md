# gezegenselcore.com — dosya haritası

**Tema:** Aura monorepo içindeki Jekyll vitrin teması (`gezegensel-core-site/freelancer-theme-master/_config.yml`) ile aynı renk paleti — `primary` **#00f2fe**, `secondary` **#0d2137**. Uygulama: `assets/gezegensel.css` (Montserrat + Open Sans).

**Dil:** `assets/lang-boot.js` (senkron, ilk boyamadan önce) + `assets/gezegensel.js` (TR/EN düğmeleri, `localStorage` anahtarı `gezegensel-lang`). Tarayıcı `navigator.languages` içinde `tr*` → Türkçe; aksi İngilizce.

## Kök (`/`)

| Dosya / klasör | Açıklama |
|----------------|----------|
| `index.html` | Ana sayfa |
| `privacy.html`, `support.html` | Site gizlilik / destek |
| `assets/gezegensel.css` | Ortak tema |
| `assets/gezegensel.js` | Dil seçici + başlık senkronu |
| `assets/lang-boot.js` | Erken `html[lang]` |
| `CNAME` | `gezegenselcore.com` |
| `app-ads.txt` | Reklam doğrulama |
| `README.md` | Repo + GitHub Pages notları |

## `pages/aura/` · `pages/refollow/`

Uygulama HTML’leri; üst şerit `gc-nav`, stil `../../../assets/gezegensel.css` (derinliğe göre).

## Yayın (GitHub Pages)

Kaynak repo ör. `gezegenselcore/gezegenselcore.github.io` — `main` kökten yayın; `CNAME` özel alanı işaret eder. Push sonrası birkaç dakika içinde `https://gezegenselcore.com` güncellenir.

Son güncelleme: 2026-04-10
