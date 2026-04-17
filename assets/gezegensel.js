/**
 * GezegenselCore statik site — dil: Aura ile aynı 8 kod (path: tr … pt-br … ar).
 * URL /{locale}/… altında: dil düğmeleri aynı mantıksal sayfanın başka dil URL’sine gider (EN fallback site-path ile).
 * Kök eski sayfalar: yalnızca localStorage tabanlı görünürlük (path yokken).
 */
(function () {
  var STORAGE_KEY = "gezegensel-lang";
  var LOCALES = ["tr", "en", "de", "fr", "es", "it", "pt-br", "ar"];

  function normalize(v) {
    if (!v || typeof v !== "string") return null;
    var s = v.trim();
    if (s === "pt-BR" || s.toLowerCase() === "pt-br" || s.toLowerCase() === "pt_br") return "pt-br";
    if (/^pt\b/i.test(s)) return "pt-br";
    var low = s.toLowerCase();
    if (LOCALES.indexOf(low) >= 0) return low;
    var base = low.split("-")[0];
    if (LOCALES.indexOf(base) >= 0) return base;
    return null;
  }

  function pathLocaleMode() {
    return (
      typeof GezegenselSitePath !== "undefined" &&
      GezegenselSitePath.getLocaleSegmentFromPathname(location.pathname)
    );
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

  function detect() {
    if (typeof GezegenselSitePath !== "undefined") {
      var seg = GezegenselSitePath.getLocaleSegmentFromPathname(location.pathname);
      if (seg) return normalize(seg) || "en";
    }
    try {
      var s = normalize(localStorage.getItem(STORAGE_KEY));
      if (s) return s;
    } catch (e) {}
    return fromNavigator();
  }

  function localeCodeFromNode(el) {
    if (el.classList.contains("policy-locale-tr")) return "tr";
    if (el.classList.contains("policy-locale-en")) return "en";
    for (var i = 0; i < el.classList.length; i++) {
      var c = el.classList[i];
      if (c.indexOf("l10n-") === 0) {
        var code = c.slice(5);
        if (code === "pt-BR") return "pt-br";
        return code;
      }
    }
    return null;
  }

  function applySiblingL10n(uiLang) {
    var parents = new Map();
    var candidates = document.querySelectorAll(
      '[class*="l10n-"], .policy-locale-tr, .policy-locale-en'
    );
    candidates.forEach(function (el) {
      var p = el.parentElement;
      if (!p) return;
      if (!parents.has(p)) parents.set(p, []);
      parents.get(p).push(el);
    });

    parents.forEach(function (rawChildren, p) {
      var children = rawChildren.filter(function (c) {
        return c.parentElement === p && localeCodeFromNode(c);
      });
      if (children.length < 2) return;

      var exact = null;
      for (var j = 0; j < children.length; j++) {
        if (localeCodeFromNode(children[j]) === uiLang) {
          exact = children[j];
          break;
        }
      }
      function findFirst(arr, pred) {
        for (var k = 0; k < arr.length; k++) {
          if (pred(arr[k])) return arr[k];
        }
        return null;
      }
      var pick =
        exact ||
        findFirst(children, function (n) { return localeCodeFromNode(n) === "en"; }) ||
        findFirst(children, function (n) { return localeCodeFromNode(n) === "tr"; });
      if (!pick) pick = children[0];

      children.forEach(function (c) {
        var on = c === pick;
        c.style.setProperty("display", on ? "" : "none", "important");
      });
    });
  }

  function applyContentSections(uiLang) {
    var tr = document.getElementById("content-tr");
    var en = document.getElementById("content-en");
    if (!tr && !en) return;
    var showTr = uiLang === "tr";
    if (tr) {
      tr.style.setProperty("display", showTr ? "block" : "none", "important");
    }
    if (en) {
      en.style.setProperty("display", showTr ? "none" : "block", "important");
    }
  }

  function bcp47(ui) {
    if (ui === "pt-br") return "pt-BR";
    return ui;
  }

  function applyLang(lang) {
    var ui = normalize(lang) || "en";
    try {
      localStorage.setItem(STORAGE_KEY, ui === "pt-br" ? "pt-BR" : ui);
    } catch (e) {}

    document.documentElement.lang = bcp47(ui);
    document.documentElement.dir = ui === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("data-ui-locale", ui);
    document.documentElement.removeAttribute("data-boot-l10n");

    document.querySelectorAll(".gc-lang-btn").forEach(function (btn) {
      var raw = btn.getAttribute("data-lang") || "";
      var btnSeg = normalize(raw);
      var active = btnSeg === ui;
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    applySiblingL10n(ui);
    applyContentSections(ui);

    var legacyTr = document.getElementById("btn-tr");
    var legacyEn = document.getElementById("btn-en");
    if (legacyTr && legacyEn) {
      legacyTr.setAttribute("aria-pressed", ui === "tr" ? "true" : "false");
      legacyEn.setAttribute("aria-pressed", ui === "en" ? "true" : "false");
    }

    var tTr = document.body && document.body.getAttribute("data-title-tr");
    var tEn = document.body && document.body.getAttribute("data-title-en");
    var tUi = document.body && document.body.getAttribute("data-title-" + ui);
    if (tUi) {
      document.title = tUi;
    } else if (tTr && tEn) {
      document.title = ui === "tr" ? tTr : tEn;
    }
  }

  function scrollToAccountDeletionSection() {
    var raw = (typeof location !== "undefined" && location.hash) || "";
    if (raw.replace(/^#/, "") !== "account-deletion") return;
    var ui = detect();
    var el =
      ui === "tr"
        ? document.getElementById("account-deletion")
        : document.querySelector("#content-en .gc-account-deletion-heading, #account-deletion-en");
    if (!el) return;
    window.requestAnimationFrame(function () {
      try {
        el.scrollIntoView({ block: "start", behavior: "auto" });
      } catch (e) {
        el.scrollIntoView(true);
      }
    });
  }

  function wireLangButton(btn) {
    btn.addEventListener("click", function () {
      var raw = btn.getAttribute("data-lang") || "en";
      var seg = normalize(raw) || "en";
      if (pathLocaleMode() && typeof GezegenselSitePath !== "undefined") {
        GezegenselSitePath.navigateToLocaleSegment(seg);
        return;
      }
      applyLang(raw);
      scrollToAccountDeletionSection();
    });
  }

  function onReady() {
    applyLang(detect());
    scrollToAccountDeletionSection();
    document.querySelectorAll(".gc-lang-btn").forEach(wireLangButton);
    var legacyTr = document.getElementById("btn-tr");
    var legacyEn = document.getElementById("btn-en");
    if (legacyTr) {
      legacyTr.addEventListener("click", function () {
        if (pathLocaleMode() && typeof GezegenselSitePath !== "undefined") {
          GezegenselSitePath.navigateToLocaleSegment("tr");
          return;
        }
        applyLang("tr");
        scrollToAccountDeletionSection();
      });
    }
    if (legacyEn) {
      legacyEn.addEventListener("click", function () {
        if (pathLocaleMode() && typeof GezegenselSitePath !== "undefined") {
          GezegenselSitePath.navigateToLocaleSegment("en");
          return;
        }
        applyLang("en");
        scrollToAccountDeletionSection();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }

  window.gezegenselSetLang = applyLang;
})();
