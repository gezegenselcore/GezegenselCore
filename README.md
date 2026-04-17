# GezegenselCore — marka sitesi

**Canlı:** [https://gezegenselcore.com](https://gezegenselcore.com)  
Statik HTML, GitHub Pages (`CNAME` → özel alan). Dosya haritası: **`SITE_STRUCTURE.md`**.

## Tema ve dil

- **Tema:** `Theme/freelancer-theme-master` zip’inden `assets/freelancer/`; renkler marka paletiyle (`#00f2fe` / `#0d2137`). Üstine `assets/gezegensel.css` + `assets/lang-boot.js` + `assets/gezegensel.js`.
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
| AURA gizlilik (Play / kamu) | **`/aura/privacy-policy.html`** (`#account-deletion`) — kanonik tam metin; eski `pages/aura/policies/*` yolları yönlendirme |
| AURA kullanım koşulları (Play / kamu) | **`/aura/terms-of-use.html`** |
| AURA destek | **`/pages/aura/support.html`** — üstte yalnız Gizlilik · Koşullar · iletişim bağlantıları |
| AURA (dosya yolu, politikalar klasörü) | `/pages/aura/…` |
| ReFollow | `/pages/refollow/…` |

**Policy senkronu:** Aura mobil repodaki `legal-public/aura/*.html` ile `aura/privacy-policy.html` ve `aura/terms-of-use.html` **dosya olarak eşlenir** (push öncesi kopyalanır). `pages/aura/policies/privacy-policy.html`, `privacy.html`, `terms.html` eski bağlantılar için **kanonik URL’ye yönlendirme** içerir. Ayrıntı: `SITE_STRUCTURE.md`.

Son güncelleme: 2026-04-18
