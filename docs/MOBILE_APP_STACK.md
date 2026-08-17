# Mobil uygulamalar — teknoloji yığını (özet)

**gezegenselcore.com** deposu yalnızca **statik web** içerir. Mobil uygulamalar ayrı repolardadır: **Anima** (`D:\GezegenselCore\Anima`) ve **ReFollow** (`D:\GezegenselCore\ReFollow`). Bu belge, web dokümantasyonu ile hizalı kısa bir referanstır.

## Tipik Anima yığını (Anima reposuna bakın)

| Alan | Teknoloji (özet) |
|------|-------------------|
| Çerçeve | **React Native** (Expo), dosya tabanlı yönlendirme. |
| Durum | **Zustand** ve ilgili store’lar. |
| Arka uç | **Firebase** (Auth, Firestore, Functions, Remote Config, App Check vb.). |
| Yapay zekâ | **Google Gemini** tabanlı koç / özet akışları (ürün sürümüne göre). |

## Web ile bağlantı

- Kamu **Gizlilik**, **Koşullar**, **Destek** URL’leri: `https://gezegenselcore.com/tr/…` veya `…/en/…` (uygulama dili `tr` değilse `en`).  
- Ayrıntılı kural: **`docs/APP_WEB_ALIGNMENT.md`**.  
- Anima içi hukuk metinleri ve uygulama davranışı: Anima reposunda `docs/legal/`, **`legal-public/`** (tek kaynak). Siteye aktarım: `node tools/sync-anima-policies.mjs`.

## ReFollow

Kod **ReFollow** reposunda. Kamu gizlilik / şartlar / destek metni uygulama i18n + `src/config/links.ts` SSOT’undan `node tools/sync-refollow-policies.mjs` ile siteye alınır.

- Play Store: `https://play.google.com/store/apps/details?id=com.refollow.app`
- Kanonik politikalar: `/{tr|en}/pages/refollow/policies/{privacy,terms,support}.html`

Son güncelleme: 2026-08-17
