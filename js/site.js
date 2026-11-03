/* Shared page behavior for pages whose inline script was cut off.
   Nav scroll, mobile menu, FAQ accordion, hash links, and the custom cursor. */
(function () {
  function boot() {
    var nav = document.getElementById("nav");
    if (nav) {
      window.addEventListener("scroll", function () {
        nav.classList.toggle("scrolled", window.scrollY > 40);
      });
    }

    var mm = document.getElementById("mobileMenu");
    var openBtn = document.getElementById("menuOpen");
    var closeBtn = document.getElementById("menuClose");

    function openMenu() {
      if (!mm) return;
      mm.style.display = "";
      mm.classList.add("open");
      if (window.getComputedStyle(mm).display === "none") mm.style.display = "flex";
    }
    function closeMenu() {
      if (!mm) return;
      mm.classList.remove("open");
      if (window.getComputedStyle(mm).display !== "none") mm.style.display = "none";
    }
    if (openBtn) openBtn.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (mm) mm.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });

    var cur = document.getElementById("cur");
    var ring = document.getElementById("curRing");
    if (window.matchMedia("(pointer:fine)").matches && cur && ring) {
      var mx = 0, my = 0, rx = 0, ry = 0;
      document.addEventListener("mousemove", function (e) {
        mx = e.clientX;
        my = e.clientY;
        cur.style.transform = "translate(" + (mx - 4) + "px," + (my - 4) + "px)";
      });
      (function loop() {
        rx += (mx - rx - 15) * 0.12;
        ry += (my - ry - 15) * 0.12;
        ring.style.transform = "translate(" + rx + "px," + ry + "px)";
        requestAnimationFrame(loop);
      })();
    }

    document.querySelectorAll(".faq-q").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.parentElement;
        var wasOpen = item.classList.contains("open");
        document.querySelectorAll(".faq-item").forEach(function (i) { i.classList.remove("open"); });
        if (!wasOpen) item.classList.add("open");
      });
    });

    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var href = a.getAttribute("href");
        if (!href || href === "#") return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    document.querySelectorAll(".nav-dropdown-toggle").forEach(function (toggle) {
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var menu = this.parentElement.querySelector(".nav-dropdown-menu");
        if (!menu) return;
        var isOpen = menu.classList.contains("open");
        document.querySelectorAll(".nav-dropdown-menu").forEach(function (m) { m.classList.remove("open"); });
        if (!isOpen) menu.classList.add("open");
      });
    });
    document.addEventListener("click", function () {
      document.querySelectorAll(".nav-dropdown-menu").forEach(function (m) { m.classList.remove("open"); });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
