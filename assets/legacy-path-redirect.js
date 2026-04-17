/**
 * Kök / eski URL'lerden dil önekli kanonik yola yönlendirme.
 * Çağrı: <script src="/assets/legacy-path-redirect.js" data-logical="/aura/privacy-policy.html" defer></script>
 * defer ile lang-boot'un localStorage yazmasından sonra da çalışır; mümkünse head'te senkron yükleme tercih edin.
 */
(function () {
  var me = document.currentScript;
  var logical = (me && me.getAttribute("data-logical")) || "/index.html";
  if (logical.charAt(0) !== "/") logical = "/" + logical;

  var G = typeof window !== "undefined" ? window : null;
  if (!G || !G.GezegenselSitePath) return;

  var seg =
    G.GezegenselSitePath.getLocaleSegmentFromPathname(G.location.pathname) ||
    G.GezegenselSitePath.preferredSegmentFromStorageOrNavigator();
  G.GezegenselSitePath.persistSegment(seg);

  var target = G.GezegenselSitePath.buildAbsoluteUrl(seg, logical);
  if (G.location.href.split("#")[0] !== target) {
    G.location.replace(target);
  }
})();
