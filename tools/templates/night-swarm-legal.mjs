/** One-shot writer for Night Swarm legal pages. Run: node tools/templates/night-swarm-legal.mjs */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const chrome = (lang, title, canonical, otherLangHref, crumb, h1, body) => `<!DOCTYPE html>
<html lang="${lang}" dir="ltr">
<head>
  <meta charset="utf-8">
  <script src="/assets/site-path.js"></script>
  <script src="/assets/lang-boot.js"></script>
  <script src="/assets/theme-boot.js"></script>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="canonical" href="${canonical}" />
  <link rel="alternate" hreflang="tr" href="${canonical.replace('/en/', '/tr/')}" />
  <link rel="alternate" hreflang="en" href="${canonical.replace('/tr/', '/en/')}" />
  <link rel="alternate" hreflang="x-default" href="${canonical.replace('/tr/', '/en/')}" />
  <meta name="robots" content="noindex,follow" />
  <link rel="icon" href="/favicon.ico" type="image/x-icon">
  <title>${title}</title>
  <link rel="stylesheet" href="/style.css?v=global8">
</head>
<body id="top" class="gc-inner">
  <a class="skip-link" href="#icerik">${lang === 'tr' ? 'İçeriğe geç' : 'Skip to content'}</a>
  <div class="gc-tech-bg" aria-hidden="true">
    <div class="gc-tech-bg__layer gc-tech-bg__layer--grid"></div>
    <div class="gc-tech-bg__layer gc-tech-bg__layer--schema"></div>
  </div>
  <header class="site-header">
    <div class="site-header__inner">
      <a class="brand" href="../index.html#ust">GezegenselCore</a>
      <div class="site-header__tail">
        <div class="gc-theme-switch" role="group" aria-label="${lang === 'tr' ? 'Tema' : 'Theme'}">
          <button type="button" class="gc-theme-switch__btn" data-gc-theme="light" aria-pressed="false">${lang === 'tr' ? 'Açık' : 'Light'}</button>
          <span class="gc-theme-switch__sep" aria-hidden="true">|</span>
          <button type="button" class="gc-theme-switch__btn" data-gc-theme="dark" aria-pressed="false">${lang === 'tr' ? 'Koyu' : 'Dark'}</button>
        </div>
        <div class="gc-lang-switch" aria-label="${lang === 'tr' ? 'Dil' : 'Language'}">
          ${lang === 'en' ? `<a href="${otherLangHref}">TR</a><span class="gc-lang-switch__sep" aria-hidden="true">|</span><span class="gc-lang-switch__current" aria-current="true">EN</span>` : `<span class="gc-lang-switch__current" aria-current="true">TR</span><span class="gc-lang-switch__sep" aria-hidden="true">|</span><a href="${otherLangHref}">EN</a>`}
        </div>
        <nav class="nav-desktop" aria-label="${lang === 'tr' ? 'Menü' : 'Main menu'}">
          <a href="../index.html#ust">${lang === 'tr' ? 'Ana sayfa' : 'Home'}</a>
          <a href="../index.html#urunler">${lang === 'tr' ? 'Ürünler' : 'Products'}</a>
          <a href="../index.html#iletisim">${lang === 'tr' ? 'İletişim' : 'Contact'}</a>
        </nav>
      </div>
    </div>
  </header>
  <main id="icerik">
    <header class="gc-page-hero">
      <p class="gc-crumb">${crumb}</p>
      <h1>${h1}</h1>
    </header>
    <div class="gc-doc">
${body}
      <p class="gc-updated">${lang === 'tr' ? 'Son güncelleme: 7 Eylül 2026' : 'Last updated: 7 September 2026'}</p>
    </div>
  </main>
  <footer class="site-footer">
    <nav class="gc-footer-nav" aria-label="Site">
      <a href="../privacy.html">${lang === 'tr' ? 'Gizlilik' : 'Privacy'}</a>
      <a href="../support.html">${lang === 'tr' ? 'Destek' : 'Support'}</a>
      <a href="../index.html#iletisim">${lang === 'tr' ? 'İletişim' : 'Contact'}</a>
    </nav>
    <p class="site-footer__legal">© 2024 GezegenselCore. All rights reserved.</p>
  </footer>
  <script src="/assets/gc-home-parallax.js" defer></script>
  <script src="/assets/theme.js" defer></script>
</body>
</html>
`;

const pages = [
  {
    file: 'en/night-swarm/privacy-policy.html',
    lang: 'en',
    title: 'Night Swarm — Privacy Policy | GezegenselCore',
    canonical: 'https://gezegenselcore.com/en/night-swarm/privacy-policy.html',
    other: '../../tr/night-swarm/privacy-policy.html',
    crumb: '<a href="../index.html#ust">Home</a> · Night Swarm · Privacy',
    h1: 'Night Swarm — Privacy Policy',
    body: `
      <p>Data controller: GezegenselCore · <a href="mailto:support@gezegenselcore.com">support@gezegenselcore.com</a> · Turkey</p>
      <p>Night Swarm is a single-player auto-attack roguelite. Your save (settings, gold, unlocks, Permanent Level, map progress, hero looks, personal high scores) stays on your device. We do not run our own game-account or score server. The Android app may use the Google services below. The game stays playable offline; only those Google features will be unavailable without a connection.</p>
      <h2>1. Age</h2>
      <p>Night Swarm is not intended for children under 13. We do not knowingly collect personal data from children under 13.</p>
      <h2>2. Data we process</h2>
      <ul>
        <li><strong>On-device save data</strong> — settings, personal scores, achievements, gold, weapon and map unlocks, Permanent Level, hero looks, last-run replay. This data does not come to us. It stays on the device until you reset it in Settings or uninstall the app.</li>
        <li><strong>Firebase Analytics and Crashlytics (Android, packaged app)</strong> — Google Firebase may collect device and app identifiers, coarse usage events (run start/end, level, boss, chest, ad, shop, achievement — no name or email), and crash reports (stack traces, device model, OS; context: map, player level, time). Disabled on development and live-reload sessions. We do not sell this data. Google processes it under <a href="https://policies.google.com/privacy">Google’s privacy policy</a> and the <a href="https://firebase.google.com/support/privacy">Firebase privacy information</a>.</li>
        <li><strong>Advertising (optional)</strong> — If ads are on, Google AdMob may process an advertising id, IP address, and diagnostics. In Europe, Google’s UMP consent form is shown before the ads SDK starts. Change your choice in Settings → Privacy preferences. <strong>Remove ads</strong> stops banners and interstitials. Rewarded ads play only if you tap them. Ads never interrupt a run.</li>
        <li><strong>Purchases</strong> — If you buy something, Google Play processes the payment. We do not receive your card number.</li>
      </ul>
      <h2>3. Sharing</h2>
      <p>We do not sell personal data. We share data with Google only as needed for Firebase Analytics and Crashlytics, ads (AdMob), and Play purchases. There is no Play Games sign-in or public leaderboard; scores are not sent to Google.</p>
      <h2>4. Your choices</h2>
      <p>Decline personalized ads (UMP); Settings → Privacy preferences; buy Remove ads; reset the save in Settings; uninstall to delete on-device data. To ask us to delete analytics or crash data we can reach in Firebase, email <a href="mailto:support@gezegenselcore.com">support@gezegenselcore.com</a>.</p>
      <h2>5. Security and retention</h2>
      <p>Data sent to Google is encrypted in transit (HTTPS). Local saves stay on the device until you reset or uninstall. Analytics and crash data are retained according to Firebase defaults unless you request deletion.</p>
      <h2>6. Contact</h2>
      <p><a href="mailto:support@gezegenselcore.com">support@gezegenselcore.com</a></p>
    `
  },
  {
    file: 'tr/night-swarm/privacy-policy.html',
    lang: 'tr',
    title: 'Night Swarm — Gizlilik Politikası | GezegenselCore',
    canonical: 'https://gezegenselcore.com/tr/night-swarm/privacy-policy.html',
    other: '../../en/night-swarm/privacy-policy.html',
    crumb: '<a href="../index.html#ust">Ana sayfa</a> · Night Swarm · Gizlilik',
    h1: 'Night Swarm — Gizlilik Politikası',
    body: `
      <p>Veri sorumlusu: GezegenselCore · <a href="mailto:support@gezegenselcore.com">support@gezegenselcore.com</a> · Türkiye</p>
      <p>Night Swarm tek oyunculu otomatik saldırı roguelite oyunudur. Kayıt (ayarlar, altın, açılımlar, Kalıcı Seviye, harita ilerlemesi, kahraman görünümleri, kişisel skorlar) cihazınızda kalır. Kendi oyun hesabımız veya skor sunucumuz yoktur. Android sürümü aşağıdaki Google hizmetlerini kullanabilir. İnternet yoksa oyun oynanır; yalnızca bu Google özellikleri o an çalışmaz.</p>
      <h2>1. Yaş</h2>
      <p>Night Swarm 13 yaşından küçükler için tasarlanmamıştır. 13 yaş altından bilerek kişisel veri toplamayız.</p>
      <h2>2. İşlenen veriler</h2>
      <ul>
        <li><strong>Cihaz içi kayıt</strong> — ayarlar, kişisel skor, başarımlar, altın, silah ve harita açılımları, Kalıcı Seviye, kahraman görünümleri, son koşu tekrarı. Bu veri bize gelmez; Ayarlar’dan sıfırlayana veya uygulamayı kaldırana kadar cihazda durur.</li>
        <li><strong>Firebase Analytics ve Crashlytics (Android, paketli uygulama)</strong> — Google Firebase cihaz ve uygulama kimlikleri, kaba kullanım olayları (koşu başı/sonu, seviye, boss, sandık, reklam, dükkan, başarım — ad veya e-posta yok) ve çökme raporları (yığın izi, cihaz modeli, işletim sistemi; bağlam: harita, oyuncu seviyesi, süre) toplayabilir. Geliştirme ve canlı yenileme oturumlarında kapalıdır. Bunu satmayız. Google, <a href="https://policies.google.com/privacy">kendi gizlilik politikası</a> ve <a href="https://firebase.google.com/support/privacy">Firebase gizlilik bilgisi</a> kapsamında işler.</li>
        <li><strong>Reklam (isteğe bağlı)</strong> — Reklam açıksa Google AdMob reklam kimliği, IP ve tanılama işleyebilir. Avrupa’da Google UMP onay formu, reklam SDK’sından önce gösterilir. Ayarlar → Gizlilik Tercihleri ile seçiminizi değiştirebilirsiniz. <strong>Reklamları kaldır</strong> banner ve geçiş reklamlarını durdurur. Ödüllü reklam yalnızca siz dokunursanız oynar. Reklamlar koşuyu bölmez.</li>
        <li><strong>Satın almalar</strong> — Bir şey satın alırsanız ödemeyi Google Play işler. Kart numaranız bize gelmez.</li>
      </ul>
      <h2>3. Paylaşım</h2>
      <p>Kişisel veri satmayız. Google ile yalnızca Firebase Analytics ve Crashlytics, reklam (AdMob) ve Play üzerinden satın alma için gerekeni paylaşırız. Play Games girişi veya genel sıralama yoktur; skor Google’a gitmez.</p>
      <h2>4. Seçenekleriniz</h2>
      <p>Kişiselleştirilmiş reklamı reddedin (UMP); Ayarlar → Gizlilik Tercihleri; Reklamları kaldır satın alın; Ayarlar’dan kaydı silin; uygulamayı kaldırınca cihaz verisi silinir. Firebase’de ulaşabildiğimiz analitik veya çökme verisinin silinmesini istemek için <a href="mailto:support@gezegenselcore.com">support@gezegenselcore.com</a>.</p>
      <h2>5. Güvenlik ve saklama</h2>
      <p>Google’a giden veri yolda şifrelenir (HTTPS). Yerel kayıt, sıfırlayana veya uygulamayı kaldırana kadar cihazda kalır. Analitik ve çökme verisi, silme istemezseniz Firebase varsayılan süreleriyle saklanır.</p>
      <h2>6. İletişim</h2>
      <p><a href="mailto:support@gezegenselcore.com">support@gezegenselcore.com</a></p>
    `
  },
  {
    file: 'en/night-swarm/terms-of-use.html',
    lang: 'en',
    title: 'Night Swarm — Terms of Use | GezegenselCore',
    canonical: 'https://gezegenselcore.com/en/night-swarm/terms-of-use.html',
    other: '../../tr/night-swarm/terms-of-use.html',
    crumb: '<a href="../index.html#ust">Home</a> · Night Swarm · Terms',
    h1: 'Night Swarm — Terms of Use',
    body: `
      <p>By using Night Swarm you agree to these terms. The game is provided by GezegenselCore (“as is”). Optional ads, in-app purchases, and Firebase diagnostics are offered through Google. Purchases are subject to Google’s refund rules. You must be 13 or older. We may update the game and these terms. Contact: <a href="mailto:support@gezegenselcore.com">support@gezegenselcore.com</a>.</p>
    `
  },
  {
    file: 'tr/night-swarm/terms-of-use.html',
    lang: 'tr',
    title: 'Night Swarm — Kullanım Koşulları | GezegenselCore',
    canonical: 'https://gezegenselcore.com/tr/night-swarm/terms-of-use.html',
    other: '../../en/night-swarm/terms-of-use.html',
    crumb: '<a href="../index.html#ust">Ana sayfa</a> · Night Swarm · Koşullar',
    h1: 'Night Swarm — Kullanım Koşulları',
    body: `
      <p>Night Swarm’ı kullanarak bu koşulları kabul etmiş olursunuz. Oyun GezegenselCore tarafından “olduğu gibi” sunulur. İsteğe bağlı reklam, uygulama içi satın alma ve Firebase tanılama Google üzerinden yürür. İadeler Google kurallarına tabidir. 13 yaş ve üzeri. Oyunu ve bu metni güncelleyebiliriz. İletişim: <a href="mailto:support@gezegenselcore.com">support@gezegenselcore.com</a>.</p>
    `
  },
  {
    file: 'en/night-swarm/support.html',
    lang: 'en',
    title: 'Night Swarm — Support | GezegenselCore',
    canonical: 'https://gezegenselcore.com/en/night-swarm/support.html',
    other: '../../tr/night-swarm/support.html',
    crumb: '<a href="../index.html#ust">Home</a> · Night Swarm · Support',
    h1: 'Night Swarm — Support',
    body: `
      <p>Need help with Night Swarm? Email <a href="mailto:support@gezegenselcore.com">support@gezegenselcore.com</a>. Please include your device model, Android version, and what you were doing when the issue happened.</p>
      <p><a href="privacy-policy.html">Privacy Policy</a> · <a href="terms-of-use.html">Terms of Use</a></p>
    `
  },
  {
    file: 'tr/night-swarm/support.html',
    lang: 'tr',
    title: 'Night Swarm — Destek | GezegenselCore',
    canonical: 'https://gezegenselcore.com/tr/night-swarm/support.html',
    other: '../../en/night-swarm/support.html',
    crumb: '<a href="../index.html#ust">Ana sayfa</a> · Night Swarm · Destek',
    h1: 'Night Swarm — Destek',
    body: `
      <p>Night Swarm için yardım: <a href="mailto:support@gezegenselcore.com">support@gezegenselcore.com</a>. Cihaz modeli, Android sürümü ve sorun anında ne yaptığınızı yazın.</p>
      <p><a href="privacy-policy.html">Gizlilik Politikası</a> · <a href="terms-of-use.html">Kullanım Koşulları</a></p>
    `
  }
];

for (const p of pages) {
  const out = path.join(root, p.file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(
    out,
    chrome(p.lang, p.title, p.canonical, p.other, p.crumb, p.h1, p.body),
    'utf8'
  );
  console.log('wrote', p.file);
}

const stub = (logical, title) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,follow" />
  <title>${title}</title>
  <link rel="canonical" href="https://gezegenselcore.com/en${logical}" />
  <script src="/assets/site-path.js"></script>
  <script src="/assets/lang-boot.js"></script>
  <script src="/assets/legacy-path-redirect.js" data-logical="${logical}"></script>
</head>
<body>
  <p><a href="https://gezegenselcore.com/tr${logical}">Türkçe</a> · <a href="https://gezegenselcore.com/en${logical}">English</a></p>
</body>
</html>
`;

for (const [logical, title] of [
  ['/night-swarm/privacy-policy.html', 'Privacy Policy - Night Swarm'],
  ['/night-swarm/terms-of-use.html', 'Terms of Use - Night Swarm'],
  ['/night-swarm/support.html', 'Support - Night Swarm']
]) {
  const out = path.join(root, logical.slice(1));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, stub(logical, title), 'utf8');
  console.log('wrote stub', logical);
}
