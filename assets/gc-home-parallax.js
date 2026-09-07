/**
 * Ana sayfa (tr/en): fareye göre çok hafif arka plan parallax (--gc-px / --gc-py).
 */
(function () {
  function kickFeatureLoops() {
    document.querySelectorAll(".product-card__feature video, .ns-page__feature video").forEach(function (v) {
      v.muted = true;
      v.loop = true;
      var p = v.play();
      if (p && typeof p.catch === "function") p.catch(function () {});
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", kickFeatureLoops);
  } else {
    kickFeatureLoops();
  }
})();

(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var max = 12;
  window.addEventListener(
    "mousemove",
    function (e) {
      var x = ((e.clientX / window.innerWidth) - 0.5) * 2 * max;
      var y = ((e.clientY / window.innerHeight) - 0.5) * 2 * max;
      document.documentElement.style.setProperty("--gc-px", x.toFixed(2));
      document.documentElement.style.setProperty("--gc-py", y.toFixed(2));
    },
    { passive: true }
  );
})();
