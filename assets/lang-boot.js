/* Sync: <html lang> + data-boot-l10n (tr|en) before first paint — gezegensel.js tam seçimi uygular.
 * Dil URL öneki: /tr/ … /pt-br/ … /ar/ — varsa öncelikli; depolama pt-BR / pt-br uyumlu. */
(function () {
  var LOCALE_SEGMENTS = ["tr", "en", "de", "fr", "es", "it", "pt-br", "ar"];
  var STORAGE_KEY = "gezegensel-lang";

  function normalize(v) {
    if (!v || typeof v !== "string") return null;
    var s = v.trim();
    if (s === "pt-BR" || s.toLowerCase() === "pt-br" || s.toLowerCase() === "pt_br") return "pt-br";
    if (/^pt\b/i.test(s)) return "pt-br";
    var low = s.toLowerCase();
    if (LOCALE_SEGMENTS.indexOf(low) >= 0) return low;
    var base = low.split("-")[0];
    if (LOCALE_SEGMENTS.indexOf(base) >= 0) return base;
    return null;
  }

  function fromPath() {
    try {
      var p = (typeof location !== "undefined" ? location.pathname : "")
        .replace(/^\/+/, "")
        .split("/");
      var seg = (p[0] || "").toLowerCase();
      return LOCALE_SEGMENTS.indexOf(seg) >= 0 ? seg : null;
    } catch (e) {
      return null;
    }
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

  function bootContentLang(ui) {
    return ui === "tr" ? "tr" : "en";
  }

  function bcp47(ui) {
    if (ui === "pt-br") return "pt-BR";
    return ui;
  }

  var ui = null;
  try {
    ui = normalize(fromPath() || "") || normalize(localStorage.getItem(STORAGE_KEY));
  } catch (e) {}
  if (!ui) ui = fromNavigator();
  if (!ui) ui = "en";

  document.documentElement.lang = bcp47(ui);
  document.documentElement.setAttribute("data-ui-locale", ui);
  document.documentElement.setAttribute("data-boot-l10n", bootContentLang(ui));
  document.documentElement.dir = ui === "ar" ? "rtl" : "ltr";
})();
