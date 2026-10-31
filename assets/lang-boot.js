/* Sync: <html lang>, dir (RTL: ar, fa, ur) + data-boot-l10n (tr|en) before first paint.
 * Dil URL'nin ilk segmentinden gelir (/tr/, /en/, /pt-br/, /ar/ …); yoksa kayıtlı tercih, yoksa tarayıcı dili. */
(function () {
  var LOCALES = ["tr", "en", "pt-br", "es", "de", "fr", "ar", "hi", "bn", "fa", "ne", "ur"];
  var RTL = ["ar", "fa", "ur"];
  var STORAGE_KEY = "gezegensel-lang";

  function normalize(v) {
    if (!v || typeof v !== "string") return null;
    var low = v.trim().toLowerCase().replace(/_/g, "-");
    if (!low) return null;
    var primary = low.split("-")[0];
    if (primary === "pt") return "pt-br";
    return LOCALES.indexOf(primary) >= 0 ? primary : null;
  }

  function fromPath() {
    try {
      var first = (typeof location !== "undefined" ? location.pathname : "")
        .replace(/^\/+/, "")
        .split("/")[0]
        .toLowerCase();
      if (LOCALES.indexOf(first) >= 0) return first;
    } catch (e) {}
    return null;
  }

  function fromNavigator() {
    var list =
      typeof navigator !== "undefined"
        ? navigator.languages || [navigator.language || navigator.userLanguage || "en"]
        : ["en"];
    for (var i = 0; i < list.length; i++) {
      var n = normalize(String(list[i]));
      if (n) return n;
    }
    return "en";
  }

  var ui = fromPath();
  if (!ui) {
    try {
      ui = normalize(localStorage.getItem(STORAGE_KEY));
    } catch (e) {}
  }
  if (!ui) ui = fromNavigator();
  if (!ui) ui = "en";

  var root = document.documentElement;
  root.lang = ui === "pt-br" ? "pt-BR" : ui;
  root.setAttribute("data-ui-locale", ui);
  root.setAttribute("data-boot-l10n", ui === "tr" ? "tr" : "en");
  root.dir = RTL.indexOf(ui) >= 0 ? "rtl" : "ltr";
})();
