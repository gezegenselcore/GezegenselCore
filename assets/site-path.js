/**
 * GezegenselCore — path tabanlı dil: yalnızca tr | en. Eski önekler (de, fr, …) EN’ye yönlendirilir.
 * Depolama: localStorage "gezegensel-lang" — yalnızca tr / en kalıcı; diğer değerler EN sayılır.
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
  var CANONICAL_LOCALES = ["tr", "en"];
  /** Eski URL yolu ilk segmentleri — yalnızca yönlendirme eşlemesi; arayüzde dil düğmesi yok. */
  var LEGACY_LOCALE_PREFIXES = ["de", "fr", "es", "it", "pt-br", "ar"];
  var PATH_PREFIXES = CANONICAL_LOCALES.concat(LEGACY_LOCALE_PREFIXES);
  var STORAGE_KEY = "gezegensel-lang";
  var DEFAULT_SEGMENT = "en";

  function isCanonicalLocaleSegment(seg) {
    return CANONICAL_LOCALES.indexOf(String(seg || "").toLowerCase()) >= 0;
  }

  function isLegacyLocalePrefix(seg) {
    return LEGACY_LOCALE_PREFIXES.indexOf(String(seg || "").toLowerCase()) >= 0;
  }

  function isPathLocalePrefix(seg) {
    var s = String(seg || "").toLowerCase();
    return PATH_PREFIXES.indexOf(s) >= 0;
  }

  /** Eski URL /de/… → /en/… (sonsuz döngü yok: yalnızca legacy önekte çalışır) */
  function redirectLegacyPathPrefixIfNeeded() {
    try {
      var raw = pathnameNoQuery();
      var path = String(raw || "").split("?")[0].replace(/\/+$/, "") || "/";
      var parts = path.replace(/^\/+/, "").split("/").filter(Boolean);
      if (!parts.length) return;
      var first = parts[0].toLowerCase();
      if (!isLegacyLocalePrefix(first)) return;
      var logical = getLogicalPath(path);
      var target = buildAbsoluteUrl("en", logical);
      var cur = global.location ? global.location.href.split("#")[0] : "";
      if (cur !== target.split("#")[0]) {
        global.location.replace(target);
      }
    } catch (e) {}
  }

  function normalizeStorageToSegment(v) {
    if (!v || typeof v !== "string") return null;
    var s = v.trim();
    var low = s.toLowerCase().replace(/_/g, "-");
    if (low === "tr" || low.indexOf("tr-") === 0) return "tr";
    if (low === "en" || low.indexOf("en-") === 0) return "en";
    if (isLegacyLocalePrefix(low.split("-")[0]) || low === "pt-br" || /^pt\b/i.test(low)) return "en";
    return null;
  }

  function segmentToBcp47(seg) {
    return seg === "tr" ? "tr" : "en";
  }

  function pathnameNoQuery() {
    return (global.location && global.location.pathname) || "/";
  }

  function getLocaleSegmentFromPathname(pathname) {
    var parts = String(pathname || "")
      .replace(/^\/+|\/+$/g, "")
      .split("/")
      .filter(Boolean);
    for (var i = 0; i < parts.length; i++) {
      var seg = parts[i].toLowerCase();
      if (isCanonicalLocaleSegment(seg)) return seg;
    }
    return null;
  }

  /**
   * Örn. /de/anima/privacy-policy.html → /anima/privacy-policy.html
   * Örn. /tr/index.html → /index.html
   */
  function getLogicalPath(pathname) {
    var raw = String(pathname || pathnameNoQuery()).split("?")[0];
    var path = raw.replace(/\/+$/, "") || "/";
    if (path === "" || path === "/") return "/index.html";
    var parts = path.replace(/^\/+/, "").split("/").filter(Boolean);
    if (!parts.length) return "/index.html";
    if (isPathLocalePrefix(parts[0].toLowerCase())) {
      var rest = parts.slice(1);
      if (!rest.length) return "/index.html";
      return "/" + rest.join("/");
    }
    return path.charAt(0) === "/" ? path : "/" + path;
  }

  function buildAbsoluteUrl(localeSeg, logicalPath) {
    var seg = isCanonicalLocaleSegment(localeSeg) ? localeSeg.toLowerCase() : DEFAULT_SEGMENT;
    var log = logicalPath || "/index.html";
    if (log.charAt(0) !== "/") log = "/" + log;
    return ORIGIN + "/" + seg + log;
  }

  function persistSegment(seg) {
    var s = normalizeStorageToSegment(seg) || DEFAULT_SEGMENT;
    try {
      global.localStorage.setItem(STORAGE_KEY, s);
    } catch (e) {}
    return s;
  }

  function preferredSegmentFromStorageOrNavigator() {
    try {
      var raw = global.localStorage.getItem(STORAGE_KEY);
      var n = normalizeStorageToSegment(raw);
      if (n) return n;
    } catch (e) {}
    if (typeof navigator !== "undefined") {
      var list = navigator.languages || [navigator.language || "en"];
      for (var i = 0; i < list.length; i++) {
        var full = normalizeStorageToSegment(String(list[i]));
        if (full) return full;
      }
    }
    return DEFAULT_SEGMENT;
  }

  function navigateToLocaleSegment(newSeg) {
    var seg = normalizeStorageToSegment(newSeg) || DEFAULT_SEGMENT;
    persistSegment(seg);
    var logical = getLogicalPath(pathnameNoQuery());
    var url = buildAbsoluteUrl(seg, logical);
    var cur = global.location ? global.location.href.split("#")[0] : "";
    if (global.location && cur !== url.split("#")[0]) {
      global.location.href = url;
    }
  }

  function redirectIfStoredLocaleDiffers() {
    try {
      var pathSeg = getLocaleSegmentFromPathname(pathnameNoQuery());
      if (!pathSeg) return;
      /* URL yolu kaynak: /en/… açıldıysa EN kalır; storage yolu takip eder (tersine yönlendirme yok). */
      persistSegment(pathSeg);
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

  function wireGcLangSwitch() {
    if (typeof document === "undefined") return;
    document.querySelectorAll(".gc-lang-switch a[href]").forEach(function (a) {
      if (a.dataset.gcLangWired === "1") return;
      a.dataset.gcLangWired = "1";
      a.addEventListener("click", function (ev) {
        var seg = localeFromHref(a.getAttribute("href") || "");
        if (!seg) {
          var t = (a.textContent || "").trim().toLowerCase();
          if (t === "tr" || t === "en") seg = t;
        }
        if (seg) {
          ev.preventDefault();
          navigateToLocaleSegment(seg);
        }
      });
    });
  }

  redirectLegacyPathPrefixIfNeeded();
  redirectIfStoredLocaleDiffers();

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", wireGcLangSwitch);
    } else {
      wireGcLangSwitch();
    }
  }

  global.GezegenselSitePath = {
    ORIGIN: ORIGIN,
    /** @deprecated Eski kod uyumu — yalnızca tr, en */
    LOCALE_SEGMENTS: CANONICAL_LOCALES.slice(),
    DEFAULT_SEGMENT: DEFAULT_SEGMENT,
    STORAGE_KEY: STORAGE_KEY,
    isLocaleSegment: isCanonicalLocaleSegment,
    normalizeStorageToSegment: normalizeStorageToSegment,
    segmentToBcp47: segmentToBcp47,
    getLocaleSegmentFromPathname: getLocaleSegmentFromPathname,
    getLogicalPath: getLogicalPath,
    buildAbsoluteUrl: buildAbsoluteUrl,
    persistSegment: persistSegment,
    preferredSegmentFromStorageOrNavigator: preferredSegmentFromStorageOrNavigator,
    navigateToLocaleSegment: navigateToLocaleSegment,
  };
})(typeof window !== "undefined" ? window : this);
