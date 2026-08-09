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
     3. Hero video slider
     Each slide holds an illustrated background plus an optional
     MP4. A video only fades in once the browser confirms it can
     actually play it, so a missing file degrades silently to the
     illustration instead of showing a black rectangle.
     ========================================================= */
  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-slide]"));
    var headlines = Array.prototype.slice.call(document.querySelectorAll("[data-headline]"));
    var dotsWrap = document.getElementById("heroDots");
    var prevBtn = document.getElementById("heroPrev");
    var nextBtn = document.getElementById("heroNext");
    if (!slides.length || !dotsWrap) return;

    var current = 0;
    var timer = null;
    var INTERVAL = 6500;

    var dots = slides.map(function (_, i) {
      var b = document.createElement("button");
      b.className = "hero__dot" + (i === 0 ? " is-active" : "");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", "Go to slide " + (i + 1));
      b.addEventListener("click", function () { goTo(i); restart(); });
      dotsWrap.appendChild(b);
      return b;
    });

    slides.forEach(function (slide) {
      var video = slide.querySelector("video");
      if (!video) return;
      video.addEventListener("loadeddata", function () {
        video.dataset.ready = "1";
        if (slide.classList.contains("is-active")) playSlideVideo(video);
      });
      // A missing or unplayable file simply leaves the illustration in place.
      video.addEventListener("error", function () { delete video.dataset.ready; }, true);
    });

    function playSlideVideo(video) {
      if (prefersReducedMotion) return;
      var p = video.play();
      if (p && p.then) {
        p.then(function () { video.classList.add("is-playing"); }).catch(function () {});
      } else {
        video.classList.add("is-playing");
      }
    }

    function syncVideos() {
      slides.forEach(function (slide, i) {
        var video = slide.querySelector("video");
        if (!video) return;
        if (i === current && video.dataset.ready) {
          playSlideVideo(video);
        } else if (!video.paused) {
          video.pause();
        }
      });
    }

    function goTo(i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle("is-active", n === current); });
      headlines.forEach(function (h, n) { h.classList.toggle("is-active", n === current); });
      dots.forEach(function (d, n) { d.classList.toggle("is-active", n === current); });
      syncVideos();
    }

    function restart() {
      if (timer) clearInterval(timer);
      if (prefersReducedMotion || slides.length < 2) return;
      timer = setInterval(function () { goTo(current + 1); }, INTERVAL);
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(current - 1); restart(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(current + 1); restart(); });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        if (timer) clearInterval(timer);
      } else {
        restart();
      }
    });

    restart();
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
    initHero();
    initBeforeAfter();
    initReveals();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
