/* Loads GA4 and Google Ads only after real IDs replace the placeholders
   in js/tags-config.js. Also sends http:// visits on this domain to https. */
(function () {
  var host = location.hostname;
  if (location.protocol === "http:" && (host === "elexpresss.org" || host === "www.elexpresss.org")) {
    location.replace("https://" + host + location.pathname + location.search + location.hash);
  }

  var tags = window.EL1_TAGS || {};
  var ga4 = String(tags.ga4 || "");
  var ads = String(tags.ads || "");
  var ga4Ready = /^G-[A-Z0-9]+$/.test(ga4) && !/^G-X+$/.test(ga4);
  var adsReady = /^AW-[0-9]+$/.test(ads) && !/^AW-X+$/.test(ads);
  if (!ga4Ready && !adsReady) return;

  var firstId = ga4Ready ? ga4 : ads;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(firstId);
  document.head.appendChild(s);

  if (ga4Ready) window.gtag("config", ga4);
  if (adsReady) window.gtag("config", ads);
})();
