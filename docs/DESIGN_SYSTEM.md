# Tasarım sistemi (gezegenselcore.com)

## Amaç

Tüm kullanıcı sayfaları aynı **görsel dil**i paylaşır: Bootstrap Freelancer teması + `gezegensel.css` marka katmanı + **`assets/gc-design-system.css`** ortak kabuk.

## Dosya

| Dosya | Rol |
|--------|-----|
| `assets/gc-design-system.css` | Tasarım jetonları (`:root`), sayfa iskeleti (`.gc-site`, `.gc-main`), hero bandı (`.gc-page-hero`), footer çizgisi (`.gc-site-footer`), AURA navbar içi dil şeridi (`.aura-legal-picker--embedded`). |

`gezegensel.css` içindeki mevcut **prose / legal / kart** kuralları korunur; `gc-design-system` üzerinden yalnızca **tüm sayfa tiplerinde ortak** olan üst-alt ritim ve kabuk davranışı güçlendirilir.

## Sınıf sözlüğü

| Sınıf | Kullanım |
|--------|----------|
| `gc-site` | `body` — dikey flex, footer alta itilir. |
| `gc-main` | Ana içerik sarmalayıcı (`<main>`) — `flex: 1`. |
| `gc-page-hero` | Turkuaz üst bant (`section.success.first` ile birlikte) — hub / iç sayfa / AURA / ReFollow hero hizası. |
| `gc-site-footer` | `<footer>` — ince üst border, tüm sayfalarda aynı aile. |
| `gc-prose` / `gc-legal` | Uzun metin ve hukuk düzeni (`gezegensel.css` ile birlikte). |

## Tipografi ve bileşenler

Başlık hiyerarşisi, butonlar, kartlar ve policy blokları **`gezegensel.css`** içindeki mevcut `.gc-prose`, `.gc-app-card`, `.navbar-default` vb. ile tanımlıdır; bu belge **yeni bir ikinci sistem** tanımlamaz — yalnızca **ortak kabuk** katmanını belgeler.

## Build

`node tools/build-locale-pages.mjs` çıktısında `gc-design-system.css`, `gezegensel.css` satırının hemen ardından **otomatik** eklenir (hub, site iç sayfaları, ReFollow). AURA master şablonları aynı linki `/assets/…` yoluyla zaten içerir; script yine de yinelenmeyi önler.

Son güncelleme: 2026-04-18
