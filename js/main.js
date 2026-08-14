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
     3b. Click-to-play video
     Nothing is requested from YouTube until someone presses
     play, which keeps a few hundred KB of player script and
     its cookies off every page view. See src/partials/about-video.html.
     ========================================================= */
  function initVideoBoxes() {
    document.querySelectorAll("[data-yt-id]").forEach(function (box) {
      var btn = box.querySelector(".videobox__btn");
      var id = box.getAttribute("data-yt-id");
      if (!btn || !id) return;

      // The label doubles as the accessible name of the button.
      var label = box.querySelector(".videobox__label");
      btn.setAttribute("aria-label",
        "Play video: " + (label ? label.childNodes[0].textContent.trim() : "About Simply Spotless"));

      btn.addEventListener("click", function () {
        var frame = document.createElement("iframe");
        frame.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) +
          "?autoplay=1&rel=0&modestbranding=1";
        frame.title = "Simply Spotless Pressure Washing";
        frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        frame.allowFullscreen = true;
        box.innerHTML = "";
        box.appendChild(frame);
      });
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

      /* Dragging is handled here rather than by the range input itself.
         Desktop browsers jump a range's thumb to wherever you press the
         track, but iOS Safari does not — there you have to grab the thumb,
         and this one is invisible, so on a phone the slider felt dead.
         Pointer events behave the same everywhere.

         The input stays in the markup, and stays focusable, so arrow keys
         and screen readers keep working; CSS just stops it swallowing
         touches. */
      function setFromX(clientX) {
        var r = frame.getBoundingClientRect();
        if (!r.width) return;
        var pct = ((clientX - r.left) / r.width) * 100;
        range.value = Math.max(0, Math.min(100, pct));
        update();
      }

      var dragging = false;

      frame.addEventListener("pointerdown", function (e) {
        // Ignore secondary buttons so a right-click doesn't yank the handle.
        if (e.button && e.button !== 0) return;
        dragging = true;
        if (frame.setPointerCapture) frame.setPointerCapture(e.pointerId);
        setFromX(e.clientX);
        e.preventDefault();
      });

      frame.addEventListener("pointermove", function (e) {
        if (!dragging) return;
        setFromX(e.clientX);
        e.preventDefault();
      });

      ["pointerup", "pointercancel"].forEach(function (evt) {
        frame.addEventListener(evt, function (e) {
          dragging = false;
          if (frame.releasePointerCapture && frame.hasPointerCapture && frame.hasPointerCapture(e.pointerId)) {
            frame.releasePointerCapture(e.pointerId);
          }
        });
      });

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
     8. Exit offer
     One modal, once per visitor, and only when they look like
     they are leaving:
       desktop — the mouse crosses out through the TOP of the
                 window, which is where the tab bar, the back
                 button and the address bar all live;
       phone   — no mouse exists, so the equivalent signal is a
                 decisive scroll back up after they have read a
                 good way down the page.
     Never on a timer, never twice, and never on the quote page
     (the markup isn't emitted there at all).
     ========================================================= */
  var OFFER_KEY = "ss_offer_seen";
  // A cursor can leave the window in the first moment of a page load
  // without the visitor having done anything. Wait a few seconds.
  var OFFER_ARM_MS = 4000;

  function initOfferPopup() {
    var offer = document.getElementById("offerPopup");
    if (!offer) return;

    var seen = false;
    try { seen = window.localStorage.getItem(OFFER_KEY) === "1"; } catch (e) {}
    if (seen) return;

    var card = offer.querySelector(".offer__card");
    var armed = false;
    var open = false;
    var lastFocus = null;

    window.setTimeout(function () { armed = true; }, OFFER_ARM_MS);

    function remember() {
      try { window.localStorage.setItem(OFFER_KEY, "1"); } catch (e) {}
    }

    function show() {
      if (open || !armed) return;
      open = true;
      remember();
      lastFocus = document.activeElement;
      offer.hidden = false;
      document.body.style.overflow = "hidden";
      var first = card.querySelector(".offer__cta");
      if (first) first.focus();
      detach();
    }

    function hide() {
      if (!open) return;
      open = false;
      offer.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    /* --- desktop: mouse leaving through the top --- */
    function onMouseOut(e) {
      if (e.relatedTarget || e.toElement) return;   // still inside the page
      if (e.clientY > 4) return;                    // left sideways or downward
      show();
    }

    /* --- phone: read a way down, then scroll decisively back up --- */
    var lastY = window.scrollY;
    var upwards = 0;
    var wentDown = false;
    function onScroll() {
      var y = window.scrollY;
      var doc = document.documentElement.scrollHeight - window.innerHeight;
      if (doc > 0 && y / doc > 0.35) wentDown = true;
      if (y < lastY) {
        upwards += lastY - y;
        // 700px of upward travel, ending near the top: they're done reading.
        if (wentDown && upwards > 700 && y < 400) show();
      } else {
        upwards = 0;
      }
      lastY = y;
    }

    function detach() {
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
    }

    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("scroll", onScroll, { passive: true });

    offer.addEventListener("click", function (e) {
      if (e.target.closest("[data-offer-close]")) hide();
    });
    document.addEventListener("keydown", function (e) {
      if (!open) return;
      if (e.key === "Escape") { hide(); return; }
      // Keep tabbing inside the dialog while it is open.
      if (e.key !== "Tab") return;
      var f = card.querySelectorAll("a[href], button");
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // Following the CTA counts as accepting it; don't show it again.
    var cta = offer.querySelector(".offer__cta");
    if (cta) cta.addEventListener("click", remember);
  }

  /* =========================================================
     9. Carrying the offer through to the quote
     The popup's button lands on the quote page with ?offer= on
     the URL. Stash it in the form so the emailed request says
     which discount was promised, and tell the visitor it came
     across so they aren't left wondering.
     ========================================================= */
  var OFFERS = { "house-wash-25": "$25 off a house wash" };

  function initOfferClaim() {
    var code = new URLSearchParams(window.location.search).get("offer");
    var label = code && OFFERS[code];
    if (!label) return;

    document.querySelectorAll("form[data-quote-form]").forEach(function (form) {
      var input = document.createElement("input");
      input.type = "hidden";
      input.name = "Offer claimed";
      input.value = label;
      form.appendChild(input);

      var note = document.createElement("p");
      note.className = "offer-note";
      note.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7L10 17l-6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        "<span>" + label + " applied \u2014 we'll include it in your quote.</span>";
      form.insertBefore(note, form.firstChild);
    });
  }

  /* =========================================================
     Boot
     ========================================================= */
  function init() {
    applyConfig();
    initHeader();
    initBrandLogo();
    initHeroVideo();
    initVideoBoxes();
    initBeforeAfter();
    initReveals();
    initOfferPopup();
    initOfferClaim();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
