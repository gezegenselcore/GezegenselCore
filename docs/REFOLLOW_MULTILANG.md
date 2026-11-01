# ReFollow web sayfaları — çok dilli yapı (2026-11-01)

ReFollow'un web sayfaları (ürün sayfası, gizlilik, kullanım şartları, destek) uygulamadaki **12 dilin hepsinde** yayında. Sitenin geri kalanı da 2026-11-01'den beri 12 dilde (tr/en dışında gövde İngilizce) — bkz. `docs/SITE_MULTILANG.md`.

## Neden

Play Console verisi (Tem–Eki 2026): mağaza sayfasından gelen kullanıcıların ~%44'ü `utm_source=chatgpt.com` linkiyle geldi. ChatGPT, ReFollow'u özellikle Brezilya'da öneriyor; Brezilya en çok satış yapılan ülke. Hedef: her dilde ReFollow'u net anlatan, yapay zeka araçları ve arama motorlarının kolayca alıntılayabileceği sayfalar.

## Diller ve URL'ler

`tools/refollow-locales.mjs` — tek liste: `tr, en, pt-br, es, de, fr, ar, hi, bn, fa, ne, ur` (RTL: `ar, fa, ur`).

| Sayfa | URL |
|-------|-----|
| Ürün | `/{dil}/refollow/` |
| Gizlilik | `/{dil}/pages/refollow/policies/privacy.html` |
| Şartlar | `/{dil}/pages/refollow/policies/terms.html` |
| Destek | `/{dil}/pages/refollow/policies/support.html` |

Dil öneki olmayan girişler (`/refollow/`, `/pages/refollow/policies/*.html`, `/refollow-policies/*.html` — uygulama içi politika linkleri dahil) tarayıcı diline yönlendirir; desteklenmeyen dil → `en`.

## Nasıl üretilir

```bash
node tools/sync-refollow-policies.mjs            # hepsi: hub + ReFollow + chrome
node tools/build-refollow-site.mjs               # yalnızca ReFollow sayfaları
```

Kaynak (yalnızca okunur): `D:\GezegenselCore\ReFollow`

- `src/i18n/locales/*.json` → ürün metinleri (`about`, `welcome`, `premium`, `launchInfo`, `home`, `import`, `support`) + `settings.privacyPolicyContent` / `settings.termsOfUseContent`
- `src/config/links.ts` → `PLAY_STORE_URL`, `SUPPORT_EMAIL`
- `package.json` → sürüm (JSON-LD)

Uygulamada karşılığı olmayan metinler (menü, SSS soruları, meta başlık/açıklama, "bu sayfayı X dilinde görüntüle"): `tools/i18n/messages/refollow-site-ui.mjs`.

**Üretilen dosyaları elle düzenlemeyin** — her çalıştırmada üzerine yazılır. İşaret: `<html … data-gc-generated="refollow">`; `apply-shared-chrome.mjs` bu dosyaları atlar.

## Sayfada ne var

- Ürün sayfası: özellikler, Pro, nasıl kullanılır, güvenlik politikaları, gizlilik özeti, **SSS** (5 soru), Play butonları (Google Ads dönüşüm etiketi korunur).
- `<head>`: canonical, 12 dil + `x-default` hreflang, Open Graph, **JSON-LD** (`MobileApplication` + `WebPage` + `FAQPage`).
- Başlıkta dil seçici `🌐 XX ▾` (görünmez yerel `<select>`; dokununca cihazın dil listesi açılır). Seçim `localStorage` (`gezegensel-lang`, `gezegensel-lang-explicit`) ile hatırlanır.
- Tarayıcı dili sayfa dilinden farklıysa **otomatik yönlendirme yok**, üstte "bu sayfayı X dilinde görüntüle" önerisi var (`assets/refollow-lang-hint.js`, üretilir).
- Kökte `llms.txt` — yapay zeka botları için uygulama özeti ve tüm dil linkleri.

## Bu turda düzeltilen eski hatalar

- `404.html` göreli yollar kullanıyordu; GitHub Pages iç içe eksik URL'lerde (ör. `/de/index.html`) script'ler yüklenmiyor, yönlendirme çalışmıyordu. `apply-shared-chrome.mjs` artık 404'teki tüm yolları köke sabitliyor.
- `apply-shared-chrome.mjs` her çalıştırmada header/footer girintisini 2 boşluk büyütüyordu (idempotent değildi) — düzeltildi.
- ReFollow sayfasında mobilde metin ekran kenarına yapışıyordu — `.rf-page .section-inner` yatay boşluk.
- RTL dillerde ekran dışı skip-link yatay kaydırma oluşturuyordu.
- `style.css` sürümü `global16`.

## Kaldırılan

- `tools/import-refollow-legal-content.mjs` (yalnızca TR/EN bloklarını yamalıyordu; yerini `build-refollow-site.mjs` aldı).
- `build-locale-pages.mjs` artık ReFollow politika sayfalarını üretmiyor; sitemap'e ReFollow'un tüm dillerini ekliyor.

## Uygulamaya yeni dil eklenirse

1. `tools/refollow-locales.mjs` → satır ekle (`seg`, `app`, `hreflang`, `name`, `dir`)
2. `tools/i18n/messages/refollow-site-ui.mjs` → o dilin arayüz metinleri
3. `assets/site-path.js` (`REFOLLOW_LOCALES`) ve `assets/lang-boot.js` (`LOCALES`, gerekiyorsa `RTL`)
4. `node tools/sync-refollow-policies.mjs`, kontrol, commit

## Açık not

Uygulamadaki gizlilik politikası **de, es, fr, pt-BR, ar, hi** dillerinde TR/EN'e göre kısaltılmış özet (Firebase ve AdMob bilgisi hepsinde var). Site uygulamayı birebir yansıtır; tam metin isteniyorsa ReFollow reposunda güncellenip sync çalıştırılmalı.
