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
     3. Hero background video — desktop only
     The hero always has the still photo behind it. On screens
     at least HERO_VIDEO_MIN wide, the looping video is attached
     and fades in over that still.

     Phones deliberately keep the still: the file is several
     megabytes, and a looping autoplay video is the most
     expensive thing on the page for battery and data. The URL
     lives in data-src rather than a <source> tag so that on a
     phone it is never requested at all — moving a src around
     after the fact still costs the download.

     If the video is missing, undecodable, or autoplay is
     refused, the still stays put, so the hero is never a blank
     or black rectangle.
     ========================================================= */
  var HERO_VIDEO_MIN = "(min-width: 900px)";

  function initHeroVideo() {
    var video = document.getElementById("heroVideo");
    if (!video) return;

    var src = video.getAttribute("data-src");
    if (!src) return;

    // Reduced motion and Data Saver keep the still at every width.
    var saveData = navigator.connection && navigator.connection.saveData;
    if (prefersReducedMotion || saveData) return;

    var attached = false;
    var failed = false;

    function reveal() {
      if (failed) return;
      video.classList.add("is-playing");
    }

    function tryPlay() {
      var p = video.play();
      if (p && p.catch) p.catch(function () { /* autoplay refused; still stays */ });
    }

    function attach() {
      if (attached) return;
      attached = true;

      // Browsers disagree about which of these fires first, and waiting on
      // only one of them is what leaves the video invisible.
      ["loadeddata", "canplay", "canplaythrough", "playing"].forEach(function (evt) {
        video.addEventListener(evt, function () { reveal(); tryPlay(); });
      });

      // Capture, because a <source> error does not bubble.
      video.addEventListener("error", function () {
        failed = true;
        video.classList.remove("is-playing");
      }, true);

      var source = document.createElement("source");
      source.type = "video/mp4";
      source.src = src;
      video.appendChild(source);
      video.load();
      tryPlay();

      // Don't burn battery decoding video in a background tab.
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) video.pause();
        else if (video.classList.contains("is-playing")) tryPlay();
      });
    }

    var mq = window.matchMedia(HERO_VIDEO_MIN);
    if (mq.matches) attach();

    // A tablet turned to landscape, or a window dragged wider, gets the video
    // too. Going the other way we leave it alone — it is already downloaded,
    // and CSS hides it below the breakpoint.
    var onChange = function (e) { if (e.matches) attach(); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
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
