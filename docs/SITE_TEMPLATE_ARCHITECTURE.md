# Site şablon mimarisi

## Özet

Statik site **tek bir sayfa kabuğu** etrafında toplanır:

1. **Üst:** Bootstrap 3 `navbar-default` (sabit), marka, menü, TR/EN dil seçici.
2. **Hero:** İç sayfalar, ReFollow politikaları ve AURA hukuk/destek sayfalarında `section.success.first.gc-page-hero` (breadcrumb + sayfa başlığı).
3. **Gövde:** `<main class="gc-main">` içinde `container` + `gc-prose` (ve gerektiğinde `gc-legal`).
4. **Alt:** Freelancer üç sütunlu `footer` + `gc-site-footer` sınıfı.

## Sayfa tipleri

| Tip | Kaynak | Not |
|-----|--------|-----|
| Landing / hub | `tools/templates/index.master.html` | `body.index.gc-site`, ana içerik `<main class="gc-main">` içinde. |
| Site legal / support | `privacy.master.html`, `support.master.html` | `inner-page gc-site`, iki `section` (hero + içerik) `<main>` içinde. |
| ReFollow uzun politika | `pages/refollow/policies/*.html` | Aynı inner-page kabuğu; build `tr`/`en` altına kopyalar. |
| AURA hukuk / destek | `tools/templates/aura-*.master.html` | Aynı navbar + hero + footer ile **marka sitesiyle hizalı**; dil TR/EN `gc-lang-btn` + `aura-legal-pages.js` ile gövde seçimi. |

## Ortak davranış

- **Dil:** Yalnızca `tr` / `en` (bkz. `docs/SITE_I18N_ARCHITECTURE.md`).
- **Varlıklar:** `assets/site-path.js`, `lang-boot.js`, `gezegensel.js`; AURA sayfalarında tam jQuery + Bootstrap + `freelancer.js` (navbar mobil kırılımı).
- **SEO:** `build-locale-pages.mjs` içinde `hreflang` + canonical; AURA gövdesi yerelde kalır, başlık/meta `AURA_SEO` ile yerelleştirilir.

## Kaldırılan dağınıklık

- AURA master’lardaki **tek başına inline `<style>`** kaldırıldı; tipografi **Freelancer + gezegensel** ile hizalandı.
- AURA üstteki **ayrı fixed dil şeridi** navbar içine **gömüldü** (`.aura-legal-picker--embedded`).

## Bakım

- Navbar veya footer metni değişince: önce **hub / privacy / support** master’larından birini güncelleyin; AURA şablonlarındaki aynı blokları **senkron** tutun (veya ileride `tools/templates/partials/` altına taşınacak ortak parçaya çıkarın).

Son güncelleme: 2026-04-18
