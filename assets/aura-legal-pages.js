/**
 * AURA kanonik hukuk / destek HTML sayfaları — Aura uygulamasıyla aynı dil kodları.
 * Tam metin yalnızca TR ve EN; diğer seçimlerde içerik EN + yerelleştirilmiş kısa uyarı.
 * /{locale}/… URL'lerinde dil düğmesi aynı sayfanın başka dil yoluna gider (site-path).
 */
(function () {
  var STORAGE_KEY = "gezegensel-lang";
  var LOCALES = ["tr", "en", "de", "fr", "es", "it", "pt-br", "ar"];
  var PICKER_LABELS = { tr: "Dil", en: "Language", de: "Sprache", fr: "Langue", es: "Idioma", it: "Lingua", "pt-br": "Idioma", ar: "اللغة" };
  var BTN_SHORT = { tr: "TR", en: "EN", de: "DE", fr: "FR", es: "ES", it: "IT", "pt-br": "PT", ar: "AR" };
  var FALLBACK_BANNER = {
    tr: "",
    en: "",
    de: "Der vollständige Rechtstext erscheint auf Englisch.",
    fr: "Le texte juridique complet est en anglais.",
    es: "El texto legal completo está en inglés.",
    it: "Il testo legale completo è in inglese.",
    "pt-br": "O texto legal completo está em inglês.",
    ar: "النص القانوني الكامل معروض بالإنجليزية.",
  };

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
        localStorage.setItem(STORAGE_KEY, legacy === "pt-br" ? "pt-BR" : legacy);
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
    if (ui === "pt-br") return "pt-BR";
    return ui;
  }

  /** Arapça sayfa kabuğu RTL; hukuk gövdesi (TR/EN) satır içi okunabilirlik için LTR. */
  function setDir(ui) {
    var rtl = ui === "ar";
    document.documentElement.dir = rtl ? "rtl" : "ltr";
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
      localStorage.setItem(STORAGE_KEY, ui === "pt-br" ? "pt-BR" : ui);
    } catch (e) {}
  }

  function apply() {
    var ui = detectLocale();
    var mount = document.getElementById("aura-legal-picker");
    var trBlock = document.getElementById("aura-block-tr");
    var enBlock = document.getElementById("aura-block-en");
    var banner = document.getElementById("aura-legal-fallback-banner");
    if (!trBlock || !enBlock) return;

    setDir(ui);
    document.documentElement.setAttribute("lang", bcp47(ui));

    var c = contentLang(ui);
    trBlock.hidden = c !== "tr";
    enBlock.hidden = c !== "en";

    if (banner) {
      var msg = FALLBACK_BANNER[ui] || "";
      if (msg) {
        banner.textContent = msg;
        banner.hidden = false;
      } else {
        banner.textContent = "";
        banner.hidden = true;
      }
    }

    var titleTr = document.body.getAttribute("data-title-tr");
    var titleEn = document.body.getAttribute("data-title-en");
    if (titleTr && titleEn) {
      document.title = c === "tr" ? titleTr : titleEn;
    }

    if (mount && !mount.dataset.built) {
      mount.dataset.built = "1";
      mount.className = (mount.className ? mount.className + " " : "") + "aura-legal-picker";
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

    if (mount) {
      var pl = mount.querySelector("[data-aura-picker-label]");
      if (pl) pl.textContent = PICKER_LABELS[ui] || PICKER_LABELS.en;
      mount.querySelectorAll("[data-aura-lang]").forEach(function (btn) {
        btn.setAttribute("aria-pressed", btn.getAttribute("data-aura-lang") === ui ? "true" : "false");
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
