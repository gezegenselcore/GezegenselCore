# Tasarım sistemi (gezegenselcore.com)

## Amaç

Tek marka dili: **Freelancer** iskeleti + **`assets/gezegensel.css`** bileşenleri + **`assets/gc-design-system.css`** (jetonlar + hero/footer cilası + iç sayfa ritmi). Parlak turkuaz kullanılmaz; vurgu **desatüre lacivert–slate** tonlarındadır.

## Dosya rolleri

| Dosya | Rol |
|--------|-----|
| `assets/gc-design-system.css` | **`:root` jetonları**, sayfa kabuğu (`.gc-site`, `.gc-main`), hero/success zemin ve metin, global `a` (footer hariç tutulmuş), iç sayfa hero/gövde dikey padding, footer koyulaştırma, AURA navbar dil şeridi, portfolyo örtüsü. |
| `assets/gezegensel.css` | Navbar davranışı, politika kartları, prose tipografisi, kartlar, dil düğmeleri — renklerde **mümkün olduğunca `var(--gc-*)`**. |
| `assets/freelancer/css/main.css` | Tema tabanı; kritik yüzeyler `var(--gc-*, yedek)` ile jetonlara bağlı (gc-design yüklenmeden tek başına kullanılırsa yedek hex devreye girer). |
| `assets/aura-legal-pages.css` | AURA dil şeridi; seçili durum `var(--gc-lang-active-*)` ile marka ile hizalı. |

Yükleme sırası (tipik): `bootstrap` → `main.css` → `gezegensel.css` → **`gc-design-system.css`** → (AURA sayfalarında) `aura-legal-pages.css`.

## Renk jetonları (`:root`)

| Jeton | Kullanım |
|--------|----------|
| `--gc-ink` | Birincil metin (koyu lacivert-gri). |
| `--gc-ink-muted` | İkincil metin. |
| `--gc-muted` | Etiket / tagline / soluk açıklama. |
| `--gc-hero-bg`, `--gc-hero-bg-2` | Hero / `section.success` gradient uçları (orta-koyu duman grisi). |
| `--gc-hero-text` | Hero başlık ve gövde metni. |
| `--gc-hero-star-fill` | Yıldız ayırıcı arka planı (hero ile uyumlu). |
| `--gc-about-1` … `--gc-apps-3` | Ana sayfa bölüm gradyanları. |
| `--gc-card-bg`, `--gc-card-border`, `--gc-card-shadow` | Uygulama kartları. |
| `--gc-policy-shell`, `--gc-policy-head`, `--gc-policy-row`, `--gc-policy-foot` | Politika panelleri. |
| `--gc-link`, `--gc-link-hover` | Gövde ve hero içi bağlantı (slate-mavi, cyan değil). |
| `--gc-accent`, `--gc-accent-strong` | Form odak / ikincil vurgu. |
| `--gc-btn-primary-*` | Birincil CTA (`.btn.gc-btn-solid`). |
| `--gc-lang-active-*` | TR/EN seçili dil düğmesi + AURA şeridi. |
| `--gc-prose-bg`, `--gc-prose-bg-end` | İç sayfa gövde zemini gradyanı. |
| `--gc-prose-fg`, `--gc-prose-heading`, `--gc-prose-border`, `--gc-prose-card` | Uzun metin / hukuk kartı. |
| `--gc-prose-note-bg`, `--gc-prose-note-border` | Alıntı / not kutusu. |
| `--gc-border-subtle`, `--gc-border-strong` | Ayırıcılar. |

## Mobil dikey ritim (≤767px)

- `main.gc-main > section`: Freelancer’ın **75px** bölüm padding’i yerine **~1.5rem** (`gc-design-system.css`).
- Bölüm **h2**: **~1.55rem** (Freelancer **3em** dev başlığı iptal).
- **hr.star-*** margin mobilde küçültüldü; **#apps** başlık satırı ↔ kart satırı arası **margin sıfır**.
- Ana **header** `.container` ve **inner hero** üst/alt padding mobilde ayrı sıkıldı; **`section.first`** üst 120px mobilde **0** (`gezegensel.css`).
- **Dil**: `.gc-lang-wrap` tam genişlik, üst border, `.gc-lang-group` `margin-top` sıfır (`gc-design-system.css`).

## Katmanlama (mobil / kaydırma)

- **Navbar** üstte opak beyaz zemin (`gezegensel.css`); yarı saydam bar kaydırırken metnin “soluk üst katman” altında kalması hissi oluşturmaz.
- **`main.gc-main`**: `position: relative`, `z-index: 0`, `isolation: isolate` — gövde kendi stacking bağlamında; hero gradient’i alt bölümlerin üstüne “sızmasın”.
- **`header` / `section.success`**: `position: relative`, `isolation: isolate` — hero boyası kutuya sıkısın.
- **Freelancer `#portfolio * { z-index: 2 }`** kaldırıldı; yalnızca `.caption` overlay’inde `z-index` (yanlış global stacking önlendi).

## Bileşen davranışı

- **Primary CTA** (`.btn.gc-btn-solid`): `min-height: 44px`, net gölge, `:focus-visible` halkası; renkler jetondan.
- **Metin bağlantıları**: `body a` slate; **footer** ve **scroll-top** için ayrı açık renk kuralı (koyu zemin üzerinde okunurluk).
- **Hero**: gradient + iç sayfada daha sıkı üst/alt padding; ana sayfada `header .container` dikey boşluk sakinleştirildi.
- **İç sayfa gövde**: `main > section:not(.success)` için Freelancer’ın aşırı 100px padding’i `!important` ile ~2.75–3.5rem bandına çekildi.

## Sınıf sözlüğü (kabuk)

| Sınıf | Kullanım |
|--------|----------|
| `gc-site` | `body` — dikey flex, footer alta. |
| `gc-main` | Ana içerik sarmalayıcı. |
| `gc-page-hero` | `section.success.first` ile birlikte üst bant. |
| `gc-site-footer` | Footer + üst border; `.footer-above` / `.footer-below` koyu tonlar. |
| `gc-prose` / `gc-legal` | Okuma genişliği, gövde link ağırlığı 500. |

## Build

Statik HTML’de `gc-design-system.css` linki build çıktısına eklenir; AURA kök sayfalarında da aynı sıra korunur.

Son güncelleme: 2026-04-18 (premium duman grisi + CTA/link cilası)
