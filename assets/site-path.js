/**
 * Gezegensel Core — path tabanlı çok dilli URL çözümleyici (Aura ile uyumlu dil kodları).
 * URL segmenti: tr | en | de | fr | es | it | pt-br | ar
 * Depolama: localStorage "gezegensel-lang" — pt-BR (eski) ve pt-br (yeni) kabul edilir.
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
  var LOCALE_SEGMENTS = ["tr", "en", "de", "fr", "es", "it", "pt-br", "ar"];
  var STORAGE_KEY = "gezegensel-lang";
  var DEFAULT_SEGMENT = "en";

  function isLocaleSegment(seg) {
    return LOCALE_SEGMENTS.indexOf(seg) >= 0;
  }

  function normalizeStorageToSegment(v) {
    if (!v || typeof v !== "string") return null;
    var s = v.trim();
    if (s === "pt-BR" || s.toLowerCase() === "pt-br" || s.toLowerCase() === "pt_br") return "pt-br";
    if (/^pt\b/i.test(s)) return "pt-br";
    var low = s.toLowerCase();
    if (LOCALE_SEGMENTS.indexOf(low) >= 0) return low;
    var base = low.split("-")[0];
    if (LOCALE_SEGMENTS.indexOf(base) >= 0) return base;
    return null;
  }

  function segmentToBcp47(seg) {
    if (seg === "pt-br") return "pt-BR";
    return seg;
  }

  function pathnameNoQuery() {
    return (global.location && global.location.pathname) || "/";
  }

  function getLocaleSegmentFromPathname(pathname) {
    var p = String(pathname || "").replace(/^\/+|\/+$/g, "");
    if (!p) return null;
    var first = p.split("/")[0].toLowerCase();
    return isLocaleSegment(first) ? first : null;
  }

  /**
   * Örn. /de/aura/privacy-policy.html → /aura/privacy-policy.html
   * Örn. /tr/index.html → /index.html
   */
  function getLogicalPath(pathname) {
    var raw = String(pathname || pathnameNoQuery()).split("?")[0];
    var path = raw.replace(/\/+$/, "") || "/";
    if (path === "" || path === "/") return "/index.html";
    var parts = path.replace(/^\/+/, "").split("/").filter(Boolean);
    if (!parts.length) return "/index.html";
    if (isLocaleSegment(parts[0].toLowerCase())) {
      var rest = parts.slice(1);
      if (!rest.length) return "/index.html";
      return "/" + rest.join("/");
    }
    return path.charAt(0) === "/" ? path : "/" + path;
  }

  function buildAbsoluteUrl(localeSeg, logicalPath) {
    var seg = isLocaleSegment(localeSeg) ? localeSeg : DEFAULT_SEGMENT;
    var log = logicalPath || "/index.html";
    if (log.charAt(0) !== "/") log = "/" + log;
    return ORIGIN + "/" + seg + log;
  }

  function persistSegment(seg) {
    var s = normalizeStorageToSegment(seg) || DEFAULT_SEGMENT;
    try {
      global.localStorage.setItem(STORAGE_KEY, segmentToBcp47(s) === "pt-BR" ? "pt-BR" : s);
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

  global.GezegenselSitePath = {
    ORIGIN: ORIGIN,
    LOCALE_SEGMENTS: LOCALE_SEGMENTS,
    DEFAULT_SEGMENT: DEFAULT_SEGMENT,
    STORAGE_KEY: STORAGE_KEY,
    isLocaleSegment: isLocaleSegment,
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
