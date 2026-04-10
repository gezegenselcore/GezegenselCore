/* Sync: set <html lang> before first paint (localStorage gezegensel-lang || browser TR preference). */
(function () {
  try {
    var k = "gezegensel-lang";
    var v = localStorage.getItem(k);
    if (v === "tr" || v === "en") {
      document.documentElement.lang = v;
      return;
    }
  } catch (e) {}
  var list = typeof navigator !== "undefined" ? navigator.languages || [navigator.language || "en"] : ["en"];
  for (var i = 0; i < list.length; i++) {
    if (String(list[i]).toLowerCase().indexOf("tr") === 0) {
      document.documentElement.lang = "tr";
      return;
    }
  }
  document.documentElement.lang = "en";
})();
