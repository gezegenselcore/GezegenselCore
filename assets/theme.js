/* Tema geçişi — tüm sayfalarda .gc-theme-switch düğmeleri */
(function () {
  var STORAGE_KEY = "gezegensel-theme";

  function applyTheme(theme) {
    if (theme !== "light" && theme !== "dark") theme = "light";
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}
    syncButtons(theme);
  }

  function syncButtons(theme) {
    document.querySelectorAll("[data-gc-theme]").forEach(function (btn) {
      var active = btn.getAttribute("data-gc-theme") === theme;
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function init() {
    var theme = document.documentElement.getAttribute("data-theme") || "light";
    syncButtons(theme);
    document.querySelectorAll("[data-gc-theme]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyTheme(btn.getAttribute("data-gc-theme"));
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
