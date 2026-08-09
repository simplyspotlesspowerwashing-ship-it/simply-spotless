/* =====================================================================
   Simply Spotless Pressure Washing — main.js
   Hero video slider · scroll effects · before/after comparison ·
   "Claim Your Deal" pressure-wash reveal · quote form wiring
   ===================================================================== */
(function () {
  "use strict";

  var CFG = window.SPOTLESS_CONFIG || {};
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================================================
     1. Business config → DOM
     ========================================================= */
  function applyConfig() {
    document.querySelectorAll("[data-phone]").forEach(function (el) {
      el.textContent = CFG.phoneDisplay || "";
    });
    document.querySelectorAll("[data-tel], [data-tel-wrap]").forEach(function (el) {
      el.setAttribute("href", "tel:" + (CFG.phoneDial || ""));
    });
    document.querySelectorAll("[data-email]").forEach(function (el) {
      el.textContent = CFG.email || "";
    });
    document.querySelectorAll("[data-mailto]").forEach(function (el) {
      el.setAttribute("href", "mailto:" + (CFG.email || ""));
    });
    document.querySelectorAll("[data-hours]").forEach(function (el) {
      el.textContent = CFG.hours || "";
    });
    var form = document.getElementById("quoteForm");
    if (form && CFG.formEndpoint) form.setAttribute("action", CFG.formEndpoint);
    var year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  /* =========================================================
     2. Header + mobile nav
     ========================================================= */
  function initHeader() {
    var header = document.getElementById("header");
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("nav");

    window.addEventListener("scroll", function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }, { passive: true });

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    // Scroll-spy: highlight the section currently in view
    var links = Array.prototype.slice.call(nav.querySelectorAll('.nav__link[href^="#"]'));
    var map = {};
    links.forEach(function (l) { map[l.getAttribute("href").slice(1)] = l; });
    var spied = document.querySelectorAll("section[id]");
    if ("IntersectionObserver" in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var link = map[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            links.forEach(function (l) { l.classList.remove("is-current"); });
            link.classList.add("is-current");
          }
        });
      }, { rootMargin: "-40% 0px -55% 0px" });
      spied.forEach(function (s) { spy.observe(s); });
    }
  }

  /* =========================================================
     3. Hero slider (videos with illustrated fallback)
     ========================================================= */
  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-slide]"));
    var headlines = Array.prototype.slice.call(document.querySelectorAll("[data-headline]"));
    var dotsWrap = document.getElementById("heroDots");
    var prevBtn = document.getElementById("heroPrev");
    var nextBtn = document.getElementById("heroNext");
    if (!slides.length) return;

    var current = 0;
    var timer = null;
    var INTERVAL = 6500;

    var dots = slides.map(function (_, i) {
      var b = document.createElement("button");
      b.className = "hero__dot" + (i === 0 ? " is-active" : "");
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", "Go to slide " + (i + 1));
      b.addEventListener("click", function () { goTo(i); restart(); });
      dotsWrap.appendChild(b);
      return b;
    });

    // Videos: play only when their file exists & can play; otherwise the
    // animated illustration behind them stays visible.
    slides.forEach(function (slide) {
      var video = slide.querySelector("video");
      if (!video) return;
      video.addEventListener("canplay", function () {
        video.dataset.ready = "1";
        if (slide.classList.contains("is-active") && !prefersReducedMotion) {
          video.play().then(function () { video.classList.add("is-playing"); }).catch(function () {});
        }
      });
    });

    function syncVideos() {
      slides.forEach(function (slide, i) {
        var video = slide.querySelector("video");
        if (!video) return;
        if (i === current && video.dataset.ready && !prefersReducedMotion) {
          video.play().then(function () { video.classList.add("is-playing"); }).catch(function () {});
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
      if (prefersReducedMotion) return;
      timer = setInterval(function () { goTo(current + 1); }, INTERVAL);
    }

    prevBtn.addEventListener("click", function () { goTo(current - 1); restart(); });
    nextBtn.addEventListener("click", function () { goTo(current + 1); restart(); });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { if (timer) clearInterval(timer); }
      else restart();
    });

    restart();
  }

  /* =========================================================
     4. Reveal-on-scroll
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
     5. Before / After comparison
     ========================================================= */
  function initBeforeAfter() {
    var widget = document.getElementById("baWidget");
    if (!widget) return;
    var frame = widget.querySelector(".ba__frame");
    var range = document.getElementById("baRange");

    function update() {
      frame.style.setProperty("--pos", range.value + "%");
      range.setAttribute("aria-valuetext", Math.round(range.value) + "% revealed");
    }
    range.addEventListener("input", update);
    update();
  }

  /* =========================================================
     6. Claim Your Deal — pressure-wash the grime off the house
     =========================================================
     A canvas painted with the "dirty" house sits over the clean
     house image (which carries the red $25 OFF lettering). Swiping
     erases the grime (destination-out compositing) like a real
     pressure washer pass. At the reveal threshold, the rest washes
     away and the offer unlocks.
     ========================================================= */

  // The dirty overlay lives here as an inline SVG (data URI) so the canvas
  // is never tainted and readback works on any host — or even from file://.
  var DIRTY_HOUSE_SVG = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 640">',
    '<defs>',
    '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">',
    '<stop offset="0" stop-color="#aad4ee"/><stop offset="1" stop-color="#d7ecf8"/>',
    '</linearGradient>',
    '<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">',
    '<stop offset="0" stop-color="#a9a48f"/><stop offset="1" stop-color="#8e8a75"/>',
    '</linearGradient>',
    '<linearGradient id="roofg" x1="0" y1="0" x2="0" y2="1">',
    '<stop offset="0" stop-color="#31465a"/><stop offset="1" stop-color="#22303f"/>',
    '</linearGradient>',
    '</defs>',
    // sky + grass (identical to the clean art so only the house "washes")
    '<rect width="1000" height="640" fill="url(#sky)"/>',
    '<rect y="560" width="1000" height="80" fill="#79ad63"/>',
    '<rect y="556" width="1000" height="8" fill="#6b9c57"/>',
    // roof band
    '<rect x="30" y="66" width="940" height="58" fill="url(#roofg)"/>',
    '<rect x="18" y="116" width="964" height="16" rx="4" fill="#5b6b7a"/>',
    // dirty wall
    '<rect x="60" y="132" width="880" height="392" fill="url(#wall)"/>',
    // siding laps
    '<g stroke="#7c785f" stroke-width="2" opacity=".55">',
    '<path d="M60 160h880M60 188h880M60 216h880M60 244h880M60 272h880M60 300h880M60 328h880M60 356h880M60 384h880M60 412h880M60 440h880M60 468h880M60 496h880"/>',
    '</g>',
    // heavy grime blotches
    '<g fill="#6e6a52">',
    '<ellipse cx="250" cy="300" rx="150" ry="90" opacity=".45"/>',
    '<ellipse cx="520" cy="380" rx="200" ry="110" opacity=".4"/>',
    '<ellipse cx="780" cy="260" rx="140" ry="100" opacity=".45"/>',
    '<ellipse cx="420" cy="200" rx="120" ry="60" opacity=".35"/>',
    '<ellipse cx="660" cy="470" rx="180" ry="70" opacity=".45"/>',
    '<ellipse cx="150" cy="460" rx="110" ry="70" opacity=".4"/>',
    '</g>',
    // algae / mildew streaks
    '<g fill="#75855a">',
    '<ellipse cx="330" cy="480" rx="140" ry="46" opacity=".5"/>',
    '<ellipse cx="850" cy="490" rx="120" ry="42" opacity=".5"/>',
    '<rect x="140" y="290" width="26" height="180" rx="12" opacity=".38"/>',
    '<rect x="315" y="270" width="20" height="160" rx="10" opacity=".34"/>',
    '<rect x="705" y="290" width="24" height="170" rx="12" opacity=".38"/>',
    '<rect x="875" y="260" width="18" height="150" rx="9" opacity=".34"/>',
    '</g>',
    // dark run-off streaks from the roof line
    '<g fill="#5d5947" opacity=".5">',
    '<rect x="95" y="132" width="14" height="120" rx="7"/>',
    '<rect x="235" y="132" width="10" height="95" rx="5"/>',
    '<rect x="405" y="132" width="16" height="130" rx="8"/>',
    '<rect x="555" y="132" width="10" height="90" rx="5"/>',
    '<rect x="695" y="132" width="14" height="115" rx="7"/>',
    '<rect x="905" y="132" width="12" height="100" rx="6"/>',
    '</g>',
    // grimy windows
    '<g>',
    '<rect x="150" y="176" width="130" height="104" rx="6" fill="#e8e2d2"/>',
    '<rect x="160" y="186" width="110" height="84" rx="3" fill="#8fa0aa"/>',
    '<path d="M215 186v84M160 228h110" stroke="#e8e2d2" stroke-width="5"/>',
    '<rect x="720" y="176" width="130" height="104" rx="6" fill="#e8e2d2"/>',
    '<rect x="730" y="186" width="110" height="84" rx="3" fill="#8fa0aa"/>',
    '<path d="M785 186v84M730 228h110" stroke="#e8e2d2" stroke-width="5"/>',
    '</g>',
    // grime under the window sills
    '<g fill="#6e6a52" opacity=".55">',
    '<path d="M150 280h130l-8 70q-57 14-114 0z"/>',
    '<path d="M720 280h130l-8 70q-57 14-114 0z"/>',
    '</g>',
    // stained foundation
    '<rect x="60" y="524" width="880" height="36" fill="#8a8778"/>',
    '<g fill="#615e4e" opacity=".6">',
    '<ellipse cx="200" cy="542" rx="90" ry="14"/>',
    '<ellipse cx="500" cy="544" rx="120" ry="14"/>',
    '<ellipse cx="800" cy="542" rx="100" ry="14"/>',
    '</g>',
    // downspout
    '<rect x="66" y="132" width="18" height="392" rx="6" fill="#77736a"/>',
    // scruffy bushes
    '<g fill="#5e7d4d">',
    '<ellipse cx="130" cy="560" rx="70" ry="36"/>',
    '<ellipse cx="880" cy="562" rx="76" ry="38"/>',
    '<ellipse cx="820" cy="572" rx="50" ry="28"/>',
    '</g>',
    '</svg>'
  ].join("");

  function initDeal() {
    var stage = document.getElementById("dealStage");
    var canvas = document.getElementById("dealCanvas");
    var spray = document.getElementById("sprayCanvas");
    var wand = document.getElementById("dealWand");
    var hint = document.getElementById("dealHint");
    var progressBar = document.getElementById("dealProgressBar");
    var percentOut = document.getElementById("dealPercent");
    var skipBtn = document.getElementById("dealSkip");
    var panelLocked = document.getElementById("dealPanelLocked");
    var panelWon = document.getElementById("dealPanelWon");
    var claimBtn = document.getElementById("dealClaimBtn");
    var live = document.getElementById("dealLive");
    if (!stage || !canvas) return;

    var ctx = canvas.getContext("2d");
    var sprayCtx = spray.getContext("2d");
    var THRESHOLD = Number(CFG.revealThreshold) || 60;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var revealed = false;
    var scratching = false;
    var started = false;
    var lastPoint = null;
    var lastCheck = 0;
    var strokeArea = 0; // fallback progress metric if pixel readback fails
    var brushR = 48;
    var dirtyImg = new Image();
    var imgLoaded = false;
    var finePointer = window.matchMedia("(pointer: fine)").matches;

    dirtyImg.onload = function () { imgLoaded = true; paintDirty(); };
    dirtyImg.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(DIRTY_HOUSE_SVG);

    function sizeCanvases() {
      var w = stage.clientWidth;
      var h = stage.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      spray.width = canvas.width;
      spray.height = canvas.height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sprayCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      brushR = Math.max(38, Math.min(95, w * 0.075));
      paintDirty();
    }

    function paintDirty() {
      if (!imgLoaded || revealed) return;
      var w = stage.clientWidth, h = stage.clientHeight;
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(dirtyImg, 0, 0, w, h);
      ctx.restore();
      strokeArea = 0;
      setProgress(0);
    }

    /* --- erasing (the "washing") --- */
    function washAt(x, y) {
      ctx.globalCompositeOperation = "destination-out";
      var g = ctx.createRadialGradient(x, y, brushR * 0.2, x, y, brushR);
      g.addColorStop(0, "rgba(0,0,0,1)");
      g.addColorStop(0.75, "rgba(0,0,0,.85)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, brushR, 0, Math.PI * 2);
      ctx.fill();
      strokeArea += Math.PI * brushR * brushR * 0.55;
    }

    function washLine(a, b) {
      var dist = Math.hypot(b.x - a.x, b.y - a.y);
      var steps = Math.max(1, Math.ceil(dist / (brushR * 0.35)));
      for (var i = 0; i <= steps; i++) {
        washAt(a.x + ((b.x - a.x) * i) / steps, a.y + ((b.y - a.y) * i) / steps);
      }
    }

    function progressPercent() {
      try {
        var step = 8 * dpr;
        var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        var clear = 0, total = 0;
        for (var y = 0; y < canvas.height; y += step) {
          for (var x = 0; x < canvas.width; x += step) {
            total++;
            if (data[(Math.floor(y) * canvas.width + Math.floor(x)) * 4 + 3] < 64) clear++;
          }
        }
        return total ? (clear / total) * 100 : 0;
      } catch (e) {
        // Canvas readback blocked (shouldn't happen with a data URI, but
        // stay safe): estimate from the area the user has swept.
        var area = stage.clientWidth * stage.clientHeight;
        return Math.min(100, (strokeArea / (area * 1.35)) * 100);
      }
    }

    function setProgress(pct) {
      var p = Math.min(100, Math.round(pct));
      if (percentOut) percentOut.textContent = String(p);
      if (progressBar) progressBar.style.width = p + "%";
    }

    function checkProgress(force) {
      if (revealed) return;
      var now = performance.now();
      if (!force && now - lastCheck < 180) return;
      lastCheck = now;
      var pct = progressPercent();
      setProgress(pct);
      if (pct >= THRESHOLD) complete(false);
    }

    function complete(viaSkip) {
      if (revealed) return;
      revealed = true;
      stage.classList.add("is-revealed");
      hint.classList.add("is-hidden");
      setProgress(100);
      panelLocked.hidden = true;
      panelWon.hidden = false;
      if (live) live.textContent = "Deal revealed: $25 off all house washes. Use code " + (CFG.promoCode || "SPOTLESS25") + ".";
      if (!viaSkip && !prefersReducedMotion) burst();
    }

    /* --- pointer handling --- */
    function localPoint(e) {
      var r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    canvas.addEventListener("pointerdown", function (e) {
      if (revealed) return;
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      scratching = true;
      started = true;
      hint.classList.add("is-hidden");
      lastPoint = localPoint(e);
      washAt(lastPoint.x, lastPoint.y);
      spawnDroplets(lastPoint.x, lastPoint.y, 6, 0, 0);
      checkProgress(false);
    });

    canvas.addEventListener("pointermove", function (e) {
      var p = localPoint(e);
      if (finePointer && wand) {
        wand.style.transform = "translate(" + p.x + "px," + p.y + "px)";
        wand.classList.add("is-on");
      }
      if (!scratching || revealed) return;
      e.preventDefault();
      washLine(lastPoint, p);
      spawnDroplets(p.x, p.y, 4, p.x - lastPoint.x, p.y - lastPoint.y);
      lastPoint = p;
      checkProgress(false);
    });

    function endStroke() {
      if (scratching) {
        scratching = false;
        checkProgress(true);
      }
    }
    canvas.addEventListener("pointerup", endStroke);
    canvas.addEventListener("pointercancel", endStroke);
    stage.addEventListener("pointerleave", function () {
      if (wand) wand.classList.remove("is-on");
      endStroke();
    });

    skipBtn.addEventListener("click", function () { complete(true); });

    /* --- water spray particles --- */
    var drops = [];
    var rafId = null;

    function spawnDroplets(x, y, n, dx, dy) {
      if (prefersReducedMotion) return;
      var mag = Math.hypot(dx, dy) || 1;
      for (var i = 0; i < n; i++) {
        drops.push({
          x: x, y: y,
          vx: (dx / mag) * (1.5 + Math.random() * 2.5) + (Math.random() - 0.5) * 3.2,
          vy: (dy / mag) * (1.5 + Math.random() * 2.5) - Math.random() * 2.4,
          r: 1.4 + Math.random() * 2.6,
          life: 1,
          gold: false
        });
      }
      if (drops.length > 400) drops.splice(0, drops.length - 400);
      if (!rafId) rafId = requestAnimationFrame(tick);
    }

    function burst() {
      var w = stage.clientWidth, h = stage.clientHeight;
      for (var i = 0; i < 110; i++) {
        drops.push({
          x: w / 2 + (Math.random() - 0.5) * w * 0.55,
          y: h / 2 + (Math.random() - 0.5) * h * 0.4,
          vx: (Math.random() - 0.5) * 7,
          vy: -2 - Math.random() * 5,
          r: 1.6 + Math.random() * 3,
          life: 1,
          gold: Math.random() < 0.35
        });
      }
      if (!rafId) rafId = requestAnimationFrame(tick);
    }

    function tick() {
      var w = stage.clientWidth, h = stage.clientHeight;
      sprayCtx.clearRect(0, 0, w, h);
      for (var i = drops.length - 1; i >= 0; i--) {
        var d = drops[i];
        d.x += d.vx;
        d.y += d.vy;
        d.vy += 0.18; // gravity
        d.life -= 0.02;
        if (d.life <= 0 || d.y > h + 10) { drops.splice(i, 1); continue; }
        sprayCtx.globalAlpha = Math.max(0, d.life) * 0.85;
        sprayCtx.fillStyle = d.gold ? "#ffb400" : "#dff1fc";
        sprayCtx.beginPath();
        sprayCtx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        sprayCtx.fill();
      }
      sprayCtx.globalAlpha = 1;
      rafId = drops.length ? requestAnimationFrame(tick) : null;
    }

    /* --- claiming applies the promo to the quote form --- */
    if (claimBtn) {
      claimBtn.addEventListener("click", function () {
        var promo = document.getElementById("promoField");
        var flag = document.getElementById("contactDealFlag");
        var house = document.getElementById("svcHouse");
        var msg = document.getElementById("qfMessage");
        if (promo) promo.value = CFG.promoCode || "SPOTLESS25";
        if (flag) flag.hidden = false;
        if (house) house.checked = true;
        if (msg && !msg.value) {
          msg.value = "Hi! I washed the house on your website and I'd like to claim the $25 off house wash deal (code " + (CFG.promoCode || "SPOTLESS25") + ").";
        }
      });
    }

    /* --- responsive sizing --- */
    var lastW = 0;
    function maybeResize() {
      var w = stage.clientWidth;
      if (Math.abs(w - lastW) < 4) return;
      lastW = w;
      if (!revealed) sizeCanvases();
      else { // keep spray canvas usable for the celebration layer
        spray.width = Math.round(stage.clientWidth * dpr);
        spray.height = Math.round(stage.clientHeight * dpr);
        sprayCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    }
    if ("ResizeObserver" in window) {
      var ro = new ResizeObserver(function () { maybeResize(); });
      ro.observe(stage);
    } else {
      window.addEventListener("resize", maybeResize);
    }
    maybeResize();
    sizeCanvases();
  }

  /* =========================================================
     Boot
     ========================================================= */
  function init() {
    applyConfig();
    initHeader();
    initHero();
    initReveals();
    initBeforeAfter();
    initDeal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
