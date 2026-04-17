# GezegenselCore — marka sitesi

**Canlı:** [https://gezegenselcore.com](https://gezegenselcore.com)  
Statik HTML, GitHub Pages (`CNAME` → özel alan). **Dosya haritası:** `SITE_STRUCTURE.md` · **Teknik / Aura hizalaması:** `docs/README.md`, `docs/APP_WEB_ALIGNMENT.md`.

## Dil yapısı (yalnızca TR / EN)

- **URL:** `/tr/…` ve `/en/…` — örnek: `https://gezegenselcore.com/en/aura/privacy-policy.html`, `https://gezegenselcore.com/tr/index.html`
- **Kök** (`/`, `/aura/…`, `/privacy.html` …): tarayıcı dil tercihi + `localStorage` (`gezegensel-lang`) ile **`/tr/…` veya `/en/…`** sayfasına yönlendirme.
- **Navbar dil seçici:** Yalnızca **TR** ve **EN** düğmeleri; aynı mantıksal sayfanın diğer dil URL’sine gider.
- **Üretim:** Depoda `tr` ve `en` ağaçlarını güncellemek için:

```bash
node tools/build-locale-pages.mjs
```

Şablonlar: `tools/templates/`. AURA tam metin master’ları `tools/templates/aura-*.master.html` (ilk çalıştırmada otomatik oluşturulur; hukuk metni değişince bu dosyaları güncelleyip script’i yeniden çalıştırın).

## Tema ve dil

- **Tema:** `assets/freelancer/`; zemin / hero duman grisi (`#d4d9e0` vb.) + `#0d2137` metin; üstüne `assets/gezegensel.css` ve `assets/gc-design-system.css`.
- **Betikler:** `lang-boot.js` (`data-ui-locale`), `gezegensel.js` (navbar; path altında dil düğmesi **sayfa değiştirir**), **`site-path.js`**, AURA sayfalarında `aura-legal-pages.js`.
- **Diller:** Yalnızca **`tr`** ve **`en`**; `hreflang` yalnızca `tr`, `en`, `x-default` (varsayılan EN).

## GitHub repo ve deploy

1. Örnek remote: `https://github.com/gezegenselcore/gezegenselcore.github.io.git`
2. `main` dalını kökten yayınla.
3. Custom domain: `gezegenselcore.com`.

```bash
node tools/build-locale-pages.mjs
git add -A && git commit -m "site: …" && git push origin main
```

## URL özeti (kanonik örnekler, `en`)

| Sayfa | URL |
|--------|-----|
| Hub | `https://gezegenselcore.com/en/index.html` |
| Site gizlilik / destek | `…/en/privacy.html`, `…/en/support.html` |
| AURA gizlilik / koşullar / destek | `…/en/aura/privacy-policy.html`, `…/en/aura/terms-of-use.html`, `…/en/pages/aura/support.html` |
| ReFollow | `…/en/pages/refollow/policies/…` |

**Aura uygulaması:** `D:\GezegenselCore\Aura` içinde `src/utils/gezegenselLegalUrls.ts` ve `docs/DATA_AND_PRIVACY.md`.

Son güncelleme: 2026-04-18
