/**
 * AURA hukuk / destek — TR ve EN gövde blokları.
 * Dil: yalnızca URL öneki (/tr/ | /en/) ve üst menüdeki gc-lang-switch; sayfa içi TR/EN yok.
 */
(function () {
  var STORAGE_KEY = "gezegensel-lang";

  function normalize(v) {
    if (!v || typeof v !== "string") return null;
    var low = v.trim().toLowerCase().replace(/_/g, "-");
    if (low === "tr" || low.indexOf("tr-") === 0) return "tr";
    if (low === "en" || low.indexOf("en-") === 0) return "en";
    return null;
  }

  function localeFromPath() {
    if (typeof GezegenselSitePath !== "undefined") {
      var seg = GezegenselSitePath.getLocaleSegmentFromPathname(location.pathname);
      if (seg) return normalize(seg);
    }
    var parts = (location.pathname || "").replace(/^\/+/, "").split("/");
    return normalize(parts[0] || "");
  }

  function contentLang() {
    return localeFromPath() === "tr" ? "tr" : "en";
  }

  function setDir() {
    document.documentElement.dir = "ltr";
    ["aura-block-tr", "aura-block-en"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.setAttribute("dir", "ltr");
        el.style.textAlign = "left";
      }
    });
  }

  function removeInPagePicker() {
    document.querySelectorAll("#aura-legal-picker, .aura-legal-picker").forEach(function (el) {
      el.remove();
    });
  }

  function apply() {
    var trBlock = document.getElementById("aura-block-tr");
    var enBlock = document.getElementById("aura-block-en");
    if (!trBlock || !enBlock) return;

    removeInPagePicker();

    var c = contentLang();
    setDir();
    document.documentElement.setAttribute("lang", c === "tr" ? "tr" : "en");

    trBlock.hidden = c !== "tr";
    enBlock.hidden = c !== "en";

    var banner = document.getElementById("aura-legal-fallback-banner");
    if (banner) {
      banner.textContent = "";
      banner.hidden = true;
    }

    var titleTr = document.body.getAttribute("data-title-tr");
    var titleEn = document.body.getAttribute("data-title-en");
    if (titleTr && titleEn) {
      document.title = c === "tr" ? titleTr : titleEn;
    }

    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch (e) {}

    scrollAccountDeletionIfNeeded();
  }

  function scrollAccountDeletionIfNeeded() {
    var raw = (location.hash || "").replace(/^#/, "");
    if (raw !== "account-deletion") return;
    var c = contentLang();
    var el =
      c === "tr"
        ? document.getElementById("account-deletion")
        : document.getElementById("account-deletion-en");
    if (!el) return;
    requestAnimationFrame(function () {
      try {
        el.scrollIntoView({ block: "start", behavior: "smooth" });
      } catch (e) {
        el.scrollIntoView(true);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }

  window.addEventListener("hashchange", scrollAccountDeletionIfNeeded);
})();
