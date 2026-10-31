/* Otomatik üretilir: node tools/build-refollow-site.mjs — elle düzenlemeyin.
 * ReFollow sayfaları: tarayıcı dili sayfa dilinden farklıysa "bu sayfayı X dilinde görüntüle" önerisi.
 * Otomatik yönlendirme YOK (arama motorları ve paylaşılan linkler için); kullanıcı tek tıkla geçer. */
(function () {
  var VIEW_IN = {"tr":"Bu sayfayı Türkçe görüntüle","en":"View this page in English","pt-br":"Ver esta página em português","es":"Ver esta página en español","de":"Diese Seite auf Deutsch anzeigen","fr":"Voir cette page en français","ar":"عرض هذه الصفحة بالعربية","hi":"यह पेज हिन्दी में देखें","bn":"এই পেজটি বাংলায় দেখুন","fa":"نمایش این صفحه به فارسی","ne":"यो पृष्ठ नेपालीमा हेर्नुहोस्","ur":"یہ صفحہ اردو میں دیکھیں"};
  var DIRS = {"tr":"ltr","en":"ltr","pt-br":"ltr","es":"ltr","de":"ltr","fr":"ltr","ar":"rtl","hi":"ltr","bn":"ltr","fa":"rtl","ne":"ltr","ur":"rtl"};
  var SP = window.GezegenselSitePath;
  if (!SP || !SP.navigatorSegment) return;
  var el = document.querySelector("[data-rf-lang-hint]");
  if (!el) return;
  try {
    if (localStorage.getItem("gezegensel-lang-explicit") === "1") return;
    if (sessionStorage.getItem("rf-lang-hint-dismissed") === "1") return;
  } catch (e) {}
  var cur = SP.getLocaleSegmentFromPathname(location.pathname);
  var want = SP.navigatorSegment();
  if (!cur || !want || want === cur || !VIEW_IN[want]) return;
  var href = SP.buildAbsoluteUrl(want, SP.getLogicalPath(location.pathname));
  var a = document.createElement("a");
  a.href = href;
  a.setAttribute("dir", DIRS[want] || "ltr");
  a.textContent = "\uD83C\uDF10 " + VIEW_IN[want];
  a.addEventListener("click", function (ev) {
    ev.preventDefault();
    SP.navigateToLocaleSegment(want);
  });
  var b = document.createElement("button");
  b.type = "button";
  b.setAttribute("aria-label", "\u00D7");
  b.textContent = "\u00D7";
  b.addEventListener("click", function () {
    try { sessionStorage.setItem("rf-lang-hint-dismissed", "1"); } catch (e) {}
    el.hidden = true;
  });
  el.appendChild(a);
  el.appendChild(b);
  el.hidden = false;
})();
