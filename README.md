# GezegenselCore — marka sitesi

**Canlı:** [https://gezegenselcore.com](https://gezegenselcore.com)  
Statik HTML, GitHub Pages (`CNAME` → özel alan). Dosya haritası: **`SITE_STRUCTURE.md`**.

## Tema ve dil

- **Tema:** Jekyll vitrin projesindeki Freelancer-türevi palet — elektrik mavisi **#00f2fe** + lacivert **#0d2137** (`gezegensel-core-site` içindeki `_config.yml` `color` ile uyumlu).
- **CSS / JS:** `assets/gezegensel.css`, `assets/lang-boot.js`, `assets/gezegensel.js`.
- **TR | EN:** Varsayılan dil = tarayıcı (`navigator.languages`, `tr` önekli → Türkçe). Kullanıcı TR/EN butonuna bastığında tercih `localStorage` (`gezegensel-lang`) ile saklanır.

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
| AURA | `/pages/aura/…` |
| ReFollow | `/pages/refollow/…` |

Son güncelleme: 2026-04-10
