/**
 * Anima hukuk / destek — TR ve EN gövde blokları.
 * Dil: URL öneki (/tr/ | /en/), yoksa <html lang> (build ile uyumlu).
 */
(function () {
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
    var parts = (location.pathname || "").replace(/^\/+/, "").split("/").filter(Boolean);
    for (var i = 0; i < parts.length; i++) {
      var n = normalize(parts[i]);
      if (n) return n;
    }
    return null;
  }

  function localeFromDocument() {
    return normalize(document.documentElement.getAttribute("lang") || "");
  }

  function contentLang() {
    return localeFromPath() || localeFromDocument() || "en";
  }

  function setDir() {
    document.documentElement.dir = "ltr";
    ["anima-block-tr", "anima-block-en"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.setAttribute("dir", "ltr");
        el.style.textAlign = "left";
      }
    });
  }

  function removeInPagePicker() {
    document.querySelectorAll("#anima-legal-picker, .anima-legal-picker").forEach(function (el) {
      el.remove();
    });
  }

  function apply() {
    var trBlock = document.getElementById("anima-block-tr");
    var enBlock = document.getElementById("anima-block-en");
    if (!trBlock || !enBlock) return;

    removeInPagePicker();

    var c = contentLang();
    var isTr = c === "tr";
    setDir();
    document.documentElement.setAttribute("lang", isTr ? "tr" : "en");

    trBlock.hidden = !isTr;
    enBlock.hidden = isTr;

    var banner = document.getElementById("anima-legal-fallback-banner");
    if (banner) {
      banner.textContent = "";
      banner.hidden = true;
    }

    var titleTr = document.body.getAttribute("data-title-tr");
    var titleEn = document.body.getAttribute("data-title-en");
    if (titleTr && titleEn) {
      document.title = isTr ? titleTr : titleEn;
    }

    scrollAccountDeletionIfNeeded();
  }

  function scrollAccountDeletionIfNeeded() {
    var raw = (typeof location !== "undefined" && location.hash) || "";
    if (raw.replace(/^#/, "") !== "account-deletion") return;
    var c = contentLang();
    var el =
      c === "tr"
        ? document.getElementById("account-deletion")
        : document.getElementById("account-deletion-en");
    if (!el) return;
    window.requestAnimationFrame(function () {
      try {
        el.scrollIntoView({ block: "start", behavior: "auto" });
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
