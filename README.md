# GezegenselCore — marka sitesi

**Canlı:** [https://gezegenselcore.com](https://gezegenselcore.com)  
Statik HTML, GitHub Pages (`CNAME` → özel alan). Dosya haritası: **`SITE_STRUCTURE.md`**.

**AURA legal URLs:** Only canonical paths are used: `/aura/privacy-policy.html`, `/aura/terms-of-use.html`, `/pages/aura/support.html`. Legacy `/pages/aura/policies/*` HTML files are redirects only (no duplicate legal body).

## Tema ve dil

- **Tema:** `Theme/freelancer-theme-master` zip’inden `assets/freelancer/`; renkler marka paletiyle (`#00f2fe` / `#0d2137`). Üstine `assets/gezegensel.css` + `assets/lang-boot.js` + `assets/gezegensel.js`.
- **Diller (Aura ile aynı 8 kod):** Navbar’da `TR` · `EN` · `DE` · `FR` · `ES` · `IT` · `PT` · `AR` (`pt-BR` → PT). Varsayılan = tarayıcı dili eşlemesi; tercih **`localStorage` → `gezegensel-lang`**. Sayfa içi çeviriler `l10n-*` span kardeşleriyle; eksik dilde **EN** yedeği. **AURA kanonik hukuk sayfaları** ek olarak `assets/aura-legal-pages.js` + `assets/aura-legal-pages.css` (tam metin yalnız TR+EN; diğer seçimlerde EN + kısa uyarı).

## GitHub repo ve deploy

1. Örnek remote: `https://github.com/gezegenselcore/gezegenselcore.github.io.git`
2. `main` dalını kökten yayınla (GitHub Pages **Deploy from branch** → `main` / root).
3. Repo ayarlarında **Custom domain** = `gezegenselcore.com`, DNS’te GitHub Pages kayıtları tanımlı olmalı.

```bash
git add -A && git commit -m "site: …" && git push origin main
```

Push’tan sonra CDN önbelleği nedeniyle tema/dil değişikliği **birkaç dakika** gecikebilir; sabit sürüm görmek için gizli pencere veya `?v=2` gibi önbellek kırıcı kullanın.

## URL özeti

| Sayfa | URL |
|--------|-----|
| Hub | `/` |
| Site gizlilik / destek | `/privacy.html`, `/support.html` |
| AURA gizlilik (Play / kamu) | **`/aura/privacy-policy.html`** (`#account-deletion`) — kanonik tam metin; eski `pages/aura/policies/*` yolları yönlendirme |
| AURA kullanım koşulları (Play / kamu) | **`/aura/terms-of-use.html`** |
| AURA destek | **`/pages/aura/support.html`** — kanonik destek metni (TR + EN gövde; 8 dil şeridi) |
| ReFollow | `/pages/refollow/…` |

**Policy senkronu:** Aura mobil repodaki `legal-public/aura/*.html` ve `legal-public/assets/aura-legal-pages.{js,css}` dosyaları sırasıyla site `aura/*.html`, `pages/aura/support.html`, `assets/aura-legal-pages.*` ile **aynı içerikte** tutulur (push öncesi kopyalanır). `pages/aura/policies/*.html` yalnızca eski bağlantılar için **kanonik URL’ye yönlendirme** stub’ıdır. Ayrıntı: `SITE_STRUCTURE.md`.

Son güncelleme: 2026-04-18
