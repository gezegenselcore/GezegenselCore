/**
 * GezegenselCore statik site — dil: navigator.language + localStorage (gezegensel-lang)
 * AURA privacy-policy: #content-tr / #content-en ile senkron
 */
(function () {
  var STORAGE_KEY = "gezegensel-lang";

  function detect() {
    try {
      var s = localStorage.getItem(STORAGE_KEY);
      if (s === "tr" || s === "en") return s;
    } catch (e) {}
    var list =
      typeof navigator !== "undefined"
        ? navigator.languages || [navigator.language || navigator.userLanguage || "en"]
        : ["en"];
    for (var i = 0; i < list.length; i++) {
      if (String(list[i]).toLowerCase().indexOf("tr") === 0) return "tr";
    }
    return "en";
  }

  function applyLang(lang) {
    if (lang !== "tr" && lang !== "en") lang = "en";
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}

    document.querySelectorAll(".gc-lang-btn").forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === lang;
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    /* #content-tr / #content-en: görünürlük gezegensel.css html[lang] kurallarıyla (FOUC yok) */

    var legacyTr = document.getElementById("btn-tr");
    var legacyEn = document.getElementById("btn-en");
    if (legacyTr && legacyEn) {
      legacyTr.setAttribute("aria-pressed", lang === "tr" ? "true" : "false");
      legacyEn.setAttribute("aria-pressed", lang === "en" ? "true" : "false");
    }

    var tTr = document.body && document.body.getAttribute("data-title-tr");
    var tEn = document.body && document.body.getAttribute("data-title-en");
    if (tTr && tEn) {
      document.title = lang === "tr" ? tTr : tEn;
    }
  }

  function onReady() {
    applyLang(detect());
    document.querySelectorAll(".gc-lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLang(btn.getAttribute("data-lang") || "en");
      });
    });
    var legacyTr = document.getElementById("btn-tr");
    var legacyEn = document.getElementById("btn-en");
    if (legacyTr) {
      legacyTr.addEventListener("click", function () {
        applyLang("tr");
      });
    }
    if (legacyEn) {
      legacyEn.addEventListener("click", function () {
        applyLang("en");
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
