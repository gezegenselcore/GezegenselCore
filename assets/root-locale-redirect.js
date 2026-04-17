/**
 * Kök / veya /index.html → /{locale}/index.html
 */
(function () {
  var G = typeof window !== "undefined" ? window : null;
  if (!G || !G.GezegenselSitePath) return;
  var p = G.location.pathname.replace(/\/+$/, "") || "/";
  if (p !== "" && p !== "/" && p !== "/index.html") return;
  var seg = G.GezegenselSitePath.preferredSegmentFromStorageOrNavigator();
  G.GezegenselSitePath.persistSegment(seg);
  var target = G.GezegenselSitePath.buildAbsoluteUrl(seg, "/index.html");
  if (G.location.href.split("#")[0] !== target) {
    G.location.replace(target);
  }
})();
