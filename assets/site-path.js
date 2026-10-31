/**
 * GezegenselCore — path tabanlı dil.
 *  - Site geneli (anasayfa, Anima, Night Swarm, site gizlilik/destek): tr | en
 *  - ReFollow sayfaları (/{dil}/refollow/, /{dil}/pages/refollow/…): uygulamadaki tüm diller
 * Bir dilde olmayan sayfa istenirse EN'e düşer (ör. /de/index.html → /en/index.html).
 * Depolama: localStorage "gezegensel-lang" (son dil), "gezegensel-lang-explicit" (kullanıcı elle seçti).
 */
(function (global) {
  function runtimeOrigin() {
    var loc = global.location;
    if (!loc || !loc.hostname) return "https://gezegenselcore.com";
    var h = String(loc.hostname).toLowerCase();
    if (h === "gezegenselcore.com" || h === "www.gezegenselcore.com") {
      return loc.protocol + "//" + loc.host;
    }
    if (h === "localhost" || h === "127.0.0.1" || /\.github\.io$/i.test(h)) {
      return loc.origin;
    }
    return "https://gezegenselcore.com";
  }
  var ORIGIN = runtimeOrigin();
  var SITE_LOCALES = ["tr", "en"];
  /* tools/refollow-locales.mjs ile aynı sıra */
  var REFOLLOW_LOCALES = ["tr", "en", "pt-br", "es", "de", "fr", "ar", "hi", "bn", "fa", "ne", "ur"];
  /** Artık yayınlanmayan eski önekler — yalnızca yönlendirme. */
  var LEGACY_LOCALE_PREFIXES = ["it"];
  var STORAGE_KEY = "gezegensel-lang";
  var EXPLICIT_KEY = "gezegensel-lang-explicit";
  var DEFAULT_SEGMENT = "en";
  var BCP47 = { "pt-br": "pt-BR" };

  function isRefollowLogicalPath(logical) {
    return /^\/(?:refollow(?:\/|$)|pages\/refollow\/)/i.test(String(logical || ""));
  }

  function localesForLogicalPath(logical) {
    return isRefollowLogicalPath(logical) ? REFOLLOW_LOCALES : SITE_LOCALES;
  }

  function isLocaleSegment(seg) {
    return REFOLLOW_LOCALES.indexOf(String(seg || "").toLowerCase()) >= 0;
  }

  function isPathLocalePrefix(seg) {
    var s = String(seg || "").toLowerCase();
    return isLocaleSegment(s) || LEGACY_LOCALE_PREFIXES.indexOf(s) >= 0;
  }

  /** "pt_BR", "pt-PT", "de-AT", "fa-IR" … → desteklenen segment ya da null. */
  function normalizeStorageToSegment(v) {
    if (!v || typeof v !== "string") return null;
    var low = v.trim().toLowerCase().replace(/_/g, "-");
    if (!low) return null;
    if (low === "pt-br" || low.indexOf("pt") === 0) return "pt-br";
    var primary = low.split("-")[0];
    if (primary === "pt") return "pt-br";
    return REFOLLOW_LOCALES.indexOf(primary) >= 0 ? primary : null;
  }

  function segmentToBcp47(seg) {
    var s = normalizeStorageToSegment(seg) || DEFAULT_SEGMENT;
    return BCP47[s] || s;
  }

  function pathnameNoQuery() {
    return (global.location && global.location.pathname) || "/";
  }

  function getLocaleSegmentFromPathname(pathname) {
    var first = String(pathname || "")
      .replace(/^\/+/, "")
      .split("/")[0];
    first = String(first || "").toLowerCase();
    return isLocaleSegment(first) ? first : null;
  }

  /** /de/refollow/ → /refollow/ ; /tr/index.html → /index.html */
  function getLogicalPath(pathname) {
    var raw = String(pathname || pathnameNoQuery()).split("?")[0];
    var trailing = /\/$/.test(raw);
    var path = raw.replace(/\/+$/, "") || "/";
    if (path === "/") return "/index.html";
    var parts = path.replace(/^\/+/, "").split("/").filter(Boolean);
    if (!parts.length) return "/index.html";
    if (isPathLocalePrefix(parts[0].toLowerCase())) {
      var rest = parts.slice(1);
      if (!rest.length) return "/index.html";
      return "/" + rest.join("/") + (trailing ? "/" : "");
    }
    return "/" + parts.join("/") + (trailing ? "/" : "");
  }

  function supportedSegment(seg, logical) {
    var s = normalizeStorageToSegment(seg) || DEFAULT_SEGMENT;
    return localesForLogicalPath(logical).indexOf(s) >= 0 ? s : DEFAULT_SEGMENT;
  }

  function buildAbsoluteUrl(localeSeg, logicalPath) {
    var log = logicalPath || "/index.html";
    if (log.charAt(0) !== "/") log = "/" + log;
    return ORIGIN + "/" + supportedSegment(localeSeg, log) + log;
  }

  function persistSegment(seg) {
    var s = normalizeStorageToSegment(seg) || DEFAULT_SEGMENT;
    try {
      global.localStorage.setItem(STORAGE_KEY, s);
    } catch (e) {}
    return s;
  }

  function storedSegment() {
    try {
      return normalizeStorageToSegment(global.localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      return null;
    }
  }

  function navigatorSegment() {
    if (typeof navigator === "undefined") return null;
    var list = navigator.languages || [navigator.language || navigator.userLanguage || ""];
    for (var i = 0; i < list.length; i++) {
      var s = normalizeStorageToSegment(String(list[i]));
      if (s) return s;
    }
    return null;
  }

  function preferredSegmentFromStorageOrNavigator() {
    return storedSegment() || navigatorSegment() || DEFAULT_SEGMENT;
  }

  function navigateToLocaleSegment(newSeg) {
    var seg = persistSegment(newSeg);
    try {
      global.localStorage.setItem(EXPLICIT_KEY, "1");
    } catch (e) {}
    var url = buildAbsoluteUrl(seg, getLogicalPath(pathnameNoQuery()));
    var cur = global.location ? global.location.href.split("#")[0] : "";
    if (global.location && cur !== url.split("#")[0]) {
      global.location.href = url;
    }
  }

  /** /it/… veya /de/index.html gibi o dilde olmayan sayfalar → desteklenen dile. */
  function redirectUnsupportedLocalePathIfNeeded() {
    try {
      var path = pathnameNoQuery();
      var first = String(path.replace(/^\/+/, "").split("/")[0] || "").toLowerCase();
      if (!isPathLocalePrefix(first)) return;
      var logical = getLogicalPath(path);
      if (localesForLogicalPath(logical).indexOf(first) >= 0) return;
      var target = buildAbsoluteUrl(first, logical);
      if (global.location.href.split("#")[0] !== target.split("#")[0]) {
        global.location.replace(target);
      }
    } catch (e) {}
  }

  /** URL dili kaynak. Yalnızca-ReFollow dili seçmiş kullanıcı TR/EN hub sayfasına girince tercihi silinmez. */
  function rememberPathLocale() {
    try {
      var pathSeg = getLocaleSegmentFromPathname(pathnameNoQuery());
      if (!pathSeg) return;
      var stored = storedSegment();
      var logical = getLogicalPath(pathnameNoQuery());
      if (!stored || localesForLogicalPath(logical).indexOf(stored) >= 0) {
        persistSegment(pathSeg);
      }
    } catch (e) {}
  }

  function localeFromHref(href) {
    try {
      var u = new URL(href, global.location.href);
      return getLocaleSegmentFromPathname(u.pathname);
    } catch (e) {
      return null;
    }
  }

  function wireLanguageControls() {
    if (typeof document === "undefined") return;
    document.querySelectorAll(".gc-lang-switch a[href]").forEach(function (a) {
      if (a.dataset.gcLangWired === "1") return;
      a.dataset.gcLangWired = "1";
      a.addEventListener("click", function (ev) {
        var seg = localeFromHref(a.getAttribute("href") || "");
        if (!seg) seg = normalizeStorageToSegment((a.textContent || "").trim());
        if (seg) {
          ev.preventDefault();
          navigateToLocaleSegment(seg);
        }
      });
    });
    document.querySelectorAll("select[data-gc-lang-select]").forEach(function (sel) {
      if (sel.dataset.gcLangWired === "1") return;
      sel.dataset.gcLangWired = "1";
      sel.addEventListener("change", function () {
        if (sel.value) navigateToLocaleSegment(sel.value);
      });
    });
  }

  redirectUnsupportedLocalePathIfNeeded();
  rememberPathLocale();

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", wireLanguageControls);
    } else {
      wireLanguageControls();
    }
  }

  global.GezegenselSitePath = {
    ORIGIN: ORIGIN,
    /** @deprecated Eski kod uyumu — site geneli diller */
    LOCALE_SEGMENTS: SITE_LOCALES.slice(),
    SITE_LOCALES: SITE_LOCALES.slice(),
    REFOLLOW_LOCALES: REFOLLOW_LOCALES.slice(),
    DEFAULT_SEGMENT: DEFAULT_SEGMENT,
    STORAGE_KEY: STORAGE_KEY,
    isLocaleSegment: isLocaleSegment,
    isRefollowLogicalPath: isRefollowLogicalPath,
    localesForLogicalPath: localesForLogicalPath,
    normalizeStorageToSegment: normalizeStorageToSegment,
    segmentToBcp47: segmentToBcp47,
    getLocaleSegmentFromPathname: getLocaleSegmentFromPathname,
    getLogicalPath: getLogicalPath,
    buildAbsoluteUrl: buildAbsoluteUrl,
    persistSegment: persistSegment,
    navigatorSegment: navigatorSegment,
    preferredSegmentFromStorageOrNavigator: preferredSegmentFromStorageOrNavigator,
    navigateToLocaleSegment: navigateToLocaleSegment,
  };
})(typeof window !== "undefined" ? window : this);
