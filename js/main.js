/* =====================================================================
   Simply Spotless Pressure Washing — main.js
   Business config → DOM · header & dropdown nav · hero video slider ·
   before/after comparison sliders · scroll reveals
   ===================================================================== */
(function () {
  "use strict";

  var CFG = window.SPOTLESS_CONFIG || {};
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================================================
     1. Business config → DOM
     Every phone number / email / hour on the site comes from
     js/config.js so there is exactly one place to edit.
     ========================================================= */
  function applyConfig() {
    document.querySelectorAll("[data-phone]").forEach(function (el) {
      if (CFG.phoneDisplay) el.textContent = CFG.phoneDisplay;
    });
    document.querySelectorAll("[data-tel]").forEach(function (el) {
      el.setAttribute("href", "tel:" + (CFG.phoneDial || ""));
    });
    document.querySelectorAll("[data-email]").forEach(function (el) {
      if (CFG.email) el.textContent = CFG.email;
    });
    document.querySelectorAll("[data-mailto]").forEach(function (el) {
      el.setAttribute("href", "mailto:" + (CFG.email || ""));
    });
    document.querySelectorAll("[data-hours]").forEach(function (el) {
      if (CFG.hours) el.textContent = CFG.hours;
    });
    // Every quote form on the page posts to the same endpoint. There can be
    // more than one (the hero card and a full form lower down), so this is a
    // querySelectorAll rather than a lookup by id.
    if (CFG.formEndpoint) {
      document.querySelectorAll("form[data-quote-form]").forEach(function (form) {
        form.setAttribute("action", CFG.formEndpoint);
      });
    }

    var year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  /* =========================================================
     2. Header, mobile menu and dropdown navigation
     ========================================================= */
  function initHeader() {
    var header = document.getElementById("header");
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("nav");
    if (!header || !nav) return;

    window.addEventListener("scroll", function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }, { passive: true });

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    var groupToggles = Array.prototype.slice.call(nav.querySelectorAll(".nav__toggle"));

    function closeAllGroups(except) {
      groupToggles.forEach(function (t) {
        if (t !== except) t.setAttribute("aria-expanded", "false");
      });
    }

    groupToggles.forEach(function (t) {
      t.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = t.getAttribute("aria-expanded") === "true";
        closeAllGroups(t);
        t.setAttribute("aria-expanded", open ? "false" : "true");
      });
    });

    // Click outside closes any open dropdown.
    document.addEventListener("click", function (e) {
      if (!nav.contains(e.target)) closeAllGroups(null);
    });

    // Escape closes dropdowns and the mobile menu.
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      closeAllGroups(null);
      if (nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });

    // Following a link closes the mobile menu.
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* =========================================================
     2b. Brand logo
     The header/footer use assets/img/logo.png. If that file
     isn't there (or fails to load) we fall back to the drawn
     mark instead of showing a broken-image icon.
     ========================================================= */
  function initBrandLogo() {
    document.querySelectorAll("[data-brand-logo]").forEach(function (img) {
      function fallback() {
        var mark = img.closest("[data-brand-mark]");
        if (mark) mark.classList.add("is-fallback");
      }
      img.addEventListener("error", fallback);
      // Already finished loading (and failed) before this script ran.
      if (img.complete && img.naturalWidth === 0) fallback();
    });
  }

  /* =========================================================
     3. Hero background video
     One full-bleed looping video. The illustration behind it
     shows while the video loads and stays put if the file is
     missing or the browser can't decode it, so the hero is
     never a blank rectangle.

     The markup carries `autoplay`, so in most browsers this
     runs before JS does. Everything below is belt-and-braces:
     browsers differ over which of loadeddata / canplay /
     playing actually fires, and relying on only one of them
     is what leaves the video invisible.
     ========================================================= */
  function initHeroVideo() {
    var video = document.getElementById("heroVideo");
    if (!video) return;

    var revealed = false;

    function reveal() {
      if (revealed) return;
      revealed = true;
      video.classList.add("is-playing");
    }

    function tryPlay() {
      var p = video.play();
      if (p && p.catch) p.catch(function () { /* autoplay refused; first frame still shows */ });
    }

    if (prefersReducedMotion) {
      // Show a still frame rather than motion, but never a black box.
      video.removeAttribute("autoplay");
      video.addEventListener("loadeddata", reveal);
      if (video.readyState >= 2) reveal();
      video.pause();
      return;
    }

    ["loadeddata", "canplay", "canplaythrough", "playing"].forEach(function (evt) {
      video.addEventListener(evt, function () { reveal(); tryPlay(); });
    });

    // Already buffered before this script ran.
    if (video.readyState >= 2) { reveal(); tryPlay(); }

    // A missing or undecodable file must leave the illustration in place.
    video.addEventListener("error", function () {
      revealed = true;                       // stop later events re-showing it
      video.classList.remove("is-playing");
    }, true);

    // Don't burn battery decoding video in a background tab.
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) video.pause();
      else if (video.classList.contains("is-playing")) tryPlay();
    });
  }

  /* =========================================================
     4. Before / after comparison sliders
     Works for any number of [data-ba] widgets on a page.
     ========================================================= */
  function initBeforeAfter() {
    document.querySelectorAll("[data-ba]").forEach(function (widget) {
      var frame = widget.querySelector(".ba__frame");
      var range = widget.querySelector(".ba__range");
      if (!frame || !range) return;

      function update() {
        frame.style.setProperty("--pos", range.value + "%");
        range.setAttribute("aria-valuetext", Math.round(range.value) + "% revealed");
      }
      range.addEventListener("input", update);
      update();
    });
  }

  /* =========================================================
     5. Reveal-on-scroll
     ========================================================= */
  function initReveals() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* =========================================================
     Boot
     ========================================================= */
  function init() {
    applyConfig();
    initHeader();
    initBrandLogo();
    initHeroVideo();
    initBeforeAfter();
    initReveals();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
