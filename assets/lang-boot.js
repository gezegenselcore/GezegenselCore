/* Sync: <html lang> + data-boot-l10n (tr|en) before first paint — gezegensel.js tam seçimi uygular.
 * Dil URL öneki: yalnızca /tr/ … /en/ … */
(function () {
  var LOCALE_SEGMENTS = ["tr", "en"];
  var STORAGE_KEY = "gezegensel-lang";

  function normalize(v) {
    if (!v || typeof v !== "string") return null;
    var low = v.trim().toLowerCase().replace(/_/g, "-");
    if (low === "tr" || low.indexOf("tr-") === 0) return "tr";
    if (low === "en" || low.indexOf("en-") === 0) return "en";
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
    return ui === "tr" ? "tr" : "en";
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
  document.documentElement.dir = "ltr";
})();
