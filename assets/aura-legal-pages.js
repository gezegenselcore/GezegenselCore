/**
 * AURA kanonik hukuk / destek HTML sayfaları — yalnızca TR ve EN.
 * /{locale}/… URL'lerinde dil düğmesi aynı sayfanın başka dil yoluna gider (site-path).
 */
(function () {
  var STORAGE_KEY = "gezegensel-lang";
  var LOCALES = ["tr", "en"];
  var PICKER_LABELS = { tr: "Dil", en: "Language" };
  var BTN_SHORT = { tr: "TR", en: "EN" };

  function normalize(v) {
    if (!v || typeof v !== "string") return null;
    var low = v.trim().toLowerCase().replace(/_/g, "-");
    if (low === "tr" || low.indexOf("tr-") === 0) return "tr";
    if (low === "en" || low.indexOf("en-") === 0) return "en";
    return null;
  }

  function mapNavigatorToLocale() {
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

  function detectLocale() {
    if (typeof GezegenselSitePath !== "undefined") {
      var seg = GezegenselSitePath.getLocaleSegmentFromPathname(location.pathname);
      if (seg) return normalize(seg) || "en";
    }
    try {
      var s = normalize(localStorage.getItem(STORAGE_KEY));
      if (s) return s;
      var legacy = normalize(localStorage.getItem("aura-public-lang"));
      if (legacy) {
        localStorage.setItem(STORAGE_KEY, legacy);
        localStorage.removeItem("aura-public-lang");
        return legacy;
      }
    } catch (e) {}
    return mapNavigatorToLocale();
  }

  function contentLang(ui) {
    return ui === "tr" ? "tr" : "en";
  }

  function bcp47(ui) {
    return ui === "tr" ? "tr" : "en";
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

  function persist(ui) {
    try {
      localStorage.setItem(STORAGE_KEY, ui === "tr" ? "tr" : "en");
    } catch (e) {}
  }

  function apply() {
    var ui = detectLocale();
    var mount = document.getElementById("aura-legal-picker");
    var trBlock = document.getElementById("aura-block-tr");
    var enBlock = document.getElementById("aura-block-en");
    var banner = document.getElementById("aura-legal-fallback-banner");
    if (!trBlock || !enBlock) return;

    setDir();
    document.documentElement.setAttribute("lang", bcp47(ui));

    var c = contentLang(ui);
    trBlock.hidden = c !== "tr";
    enBlock.hidden = c !== "en";

    if (banner) {
      banner.textContent = "";
      banner.hidden = true;
    }

    var titleTr = document.body.getAttribute("data-title-tr");
    var titleEn = document.body.getAttribute("data-title-en");
    if (titleTr && titleEn) {
      document.title = c === "tr" ? titleTr : titleEn;
    }

    if (mount && !mount.dataset.built) {
      mount.dataset.built = "1";
      var prebuilt = mount.querySelector(".gc-lang-btn[data-lang]");
      if (!prebuilt) {
        if (!/\baura-legal-picker\b/.test(mount.className)) {
          mount.className = (mount.className ? mount.className + " " : "") + "aura-legal-picker";
        }
        var lab = document.createElement("span");
        lab.className = "aura-legal-picker-label";
        lab.setAttribute("data-aura-picker-label", "1");
        mount.appendChild(lab);
        LOCALES.forEach(function (code) {
          var b = document.createElement("button");
          b.type = "button";
          b.setAttribute("data-aura-lang", code);
          b.textContent = BTN_SHORT[code] || code;
          b.setAttribute("aria-pressed", "false");
          b.addEventListener("click", function () {
            persist(code);
            if (typeof GezegenselSitePath !== "undefined") {
              GezegenselSitePath.navigateToLocaleSegment(code);
              return;
            }
            apply();
            scrollAccountDeletionIfNeeded();
          });
          mount.appendChild(b);
        });
      }
    }

    if (mount) {
      var pl = mount.querySelector("[data-aura-picker-label]");
      if (pl) pl.textContent = PICKER_LABELS[ui] || PICKER_LABELS.en;
      mount.querySelectorAll("[data-aura-lang], .gc-lang-btn[data-lang]").forEach(function (btn) {
        var code = btn.getAttribute("data-aura-lang") || btn.getAttribute("data-lang");
        btn.setAttribute("aria-pressed", code === ui ? "true" : "false");
      });
    }

    scrollAccountDeletionIfNeeded();
  }

  function scrollAccountDeletionIfNeeded() {
    var raw = (typeof location !== "undefined" && location.hash) || "";
    if (raw.replace(/^#/, "") !== "account-deletion") return;
    var c = contentLang(detectLocale());
    var el =
      c === "tr"
        ? document.getElementById("account-deletion")
        : document.getElementById("account-deletion-en");
    if (!el) return;
    window.requestAnimationFrame(function () {
      try {
        el.scrollIntoView({ block: "start", behavior: "smooth" });
      } catch (e) {
        el.scrollIntoView(true);
      }
    });
  }

  document.body.classList.add("aura-legal-body");

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }

  window.addEventListener("hashchange", scrollAccountDeletionIfNeeded);
})();
