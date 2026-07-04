/* Tema: localStorage → data-theme (ilk boyamadan önce — FOUC önleme) */
(function () {
  var STORAGE_KEY = "gezegensel-theme";
  var theme = "light";
  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") theme = stored;
  } catch (e) {}
  document.documentElement.setAttribute("data-theme", theme);
})();
