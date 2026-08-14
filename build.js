#!/usr/bin/env node
/* =====================================================================
   Simply Spotless — static site builder
   ---------------------------------------------------------------------
   Stitches src/pages/*.html (content only) into a shared shell using
   src/partials/*.html, and writes plain static .html files to the
   project root. No dependencies — just run:

       node build.js

   Edit content in src/pages/, edit the header/footer in src/partials/,
   then re-run. Never hand-edit the generated .html files in the root:
   they are overwritten on every build.
   ===================================================================== */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const SRC = path.join(ROOT, "src");
const PAGES = path.join(SRC, "pages");
const PARTIALS = path.join(SRC, "partials");

const read = (p) => fs.readFileSync(p, "utf8");
const partial = (name) => read(path.join(PARTIALS, name + ".html"));

const HEADER = partial("header");
const FOOTER = partial("footer");
const CTA = partial("cta");
const QUOTE_FORM = partial("quote-form");
const HERO_FORM = partial("hero-form");
const ABOUT_VIDEO = partial("about-video");
const BARE_HEADER = partial("bare-header");
const BARE_FOOTER = partial("bare-footer");

const SITE = {
  name: "Simply Spotless Pressure Washing",
  // Live URL — used for canonical + social-preview tags.
  // Change this if you move to a custom domain, then re-run: node build.js
  url: "https://simplyspotlesspowerwashing-ship-it.github.io/simply-spotless",
};

/* ---------------------------------------------------------------------
   Front matter: an HTML comment block at the top of each page fragment.

     <!--meta
     title: About Us
     description: ...
     nav: about
     heroTitle: About Simply Spotless
     heroSub: ...
     -->
   ------------------------------------------------------------------- */
function parseFragment(raw) {
  const match = raw.match(/^\s*<!--meta([\s\S]*?)-->/);
  const meta = {};
  if (!match) return { meta, body: raw };
  match[1]
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .forEach((line) => {
      const i = line.indexOf(":");
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    });
  return { meta, body: raw.slice(match[0].length) };
}

/* Inner-page hero banner (every page except the home page, which ships
   its own full-height video hero inside its fragment). */
function pageHero(meta, slug) {
  const art = meta.heroArt || "assets/img/hero-house.svg";
  // A photograph needs a heavier scrim under the copy than the flat SVG
  // illustrations do — see .pagehero--photo in the stylesheet.
  const photo = /\.(jpe?g|png|webp|avif)$/i.test(art) ? " pagehero--photo" : "";
  // A banner is ~3.6:1 on a laptop and ~1.2:1 on a phone. When one crop can't
  // suit both, a page names a second file with `heroArtMobile:` and we emit a
  // second layer; the media query for .pagehero--dual swaps them.
  //
  // The url() has to live in the inline style, not a CSS custom property: a
  // url() inside a custom property is resolved against the stylesheet that
  // reads it, so `assets/…` would be looked up under css/ and 404.
  const dual = meta.heroArtMobile ? " pagehero--dual" : "";
  const mobileLayer = meta.heroArtMobile
    ? `\n    <div class="pagehero__art pagehero__art--m" style="background-image:url('${meta.heroArtMobile}')"></div>`
    : "";
  const crumbs = meta.crumb
    ? `<a href="index.html">Home</a><span aria-hidden="true">/</span><span>${meta.crumb}</span>`
    : "";
  return `
  <section class="pagehero${photo}${dual}" aria-label="${escapeAttr(meta.heroTitle || meta.title)}">
    <div class="pagehero__art" style="background-image:url('${art}')"></div>${mobileLayer}
    <div class="pagehero__shade"></div>
    <div class="container pagehero__content">
      <nav class="crumbs" aria-label="Breadcrumb">${crumbs}</nav>
      <h1>${meta.heroTitle || meta.title}</h1>
      ${meta.heroSub ? `<p>${meta.heroSub}</p>` : ""}
      <div class="pagehero__actions">
        <a class="btn btn--primary" href="contact.html">Get A Fast Quote</a>
        <a class="btn btn--call" data-tel href="#">Click To Call</a>
      </div>
    </div>
    <div class="pagehero__wave" aria-hidden="true">
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none"><path d="M0 40 C 240 66 480 6 720 26 C 960 46 1200 60 1440 20 L1440 60 L0 60 Z" fill="#ffffff"/></svg>
    </div>
  </section>`;
}

function escapeAttr(s) {
  return String(s).replace(/"/g, "&quot;");
}

function layout({ meta, body, slug }) {
  const title =
    slug === "index"
      ? `${meta.title} | House Washing, Driveways &amp; Gutters`
      : `${meta.title} | ${SITE.name}`;

  // `bare: true` in a page's front matter drops the nav, the page banner and
  // the full footer. It exists for the quote page: someone who clicked "Get A
  // Fast Quote" has already decided, and every extra link is a chance to
  // wander off. The logo still goes home and the phone number is still one
  // tap, so nobody is trapped.
  const bare = String(meta.bare || "").trim() === "true";

  // Mark the active nav item so the current page is highlighted.
  let header = HEADER;
  const navKey = meta.nav || slug;
  header = header.replace(
    new RegExp(`(<a[^>]*data-nav="${navKey}")`),
    "$1 aria-current=\"page\""
  );
  // Highlight the Services parent when one of its children is the active page.
  const SERVICE_PAGES = [
    "house-washing", "power-washing", "gutter-cleaning", "benefits-of-soft-washing",
  ];
  if (SERVICE_PAGES.includes(navKey)) {
    header = header.replace('data-nav="services-group"', 'data-nav="services-group" data-active-group');
  }

  const hero = bare || slug === "index" ? "" : pageHero(meta, slug);

  return `<!DOCTYPE html>
<!--
  ============================================================
  DO NOT EDIT THIS FILE.

  It is generated by build.js from src/pages/${slug}.html plus the
  partials in src/partials/, and every edit made here is overwritten
  the next time the site builds.

  To change this page, edit:
      src/pages/${slug}.html          (this page's content)
      src/partials/footer.html        (footer + service area, all pages)
      src/partials/header.html        (nav, all pages)
  then run:  node build.js
  ============================================================
-->
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${escapeAttr(meta.description || "")}">
  <link rel="canonical" href="${SITE.url}/${slug === "index" ? "" : slug + ".html"}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeAttr(title.replace(/&amp;/g, "&"))}">
  <meta property="og:description" content="${escapeAttr(meta.description || "")}">
  <meta property="og:site_name" content="${SITE.name}">
  <!-- Tab-sized icons use a simplified mark from the logo's palette: three
       lines of type cannot resolve at 16-32px. Larger icons use the badge. -->
  <link rel="icon" type="image/png" sizes="16x16" href="assets/img/favicon-16.png">
  <link rel="icon" type="image/png" sizes="32x32" href="assets/img/favicon-32.png">
  <link rel="icon" type="image/png" sizes="48x48" href="assets/img/favicon-48.png">
  <link rel="icon" type="image/png" sizes="192x192" href="assets/img/favicon-192.png">
  <link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
  <meta name="theme-color" content="#002b47">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
  <!-- Scroll reveals start at opacity 0 and are switched on by main.js. If
       scripting is off or blocked, everything below the fold would stay
       invisible, so turn the animation off entirely in that case. -->
  <noscript><style>.reveal{opacity:1;transform:none}</style></noscript>
</head>
<body data-page="${slug}"${bare ? ' class="is-bare"' : ""}>
  <a class="skip-link" href="#main">Skip to content</a>
${bare ? BARE_HEADER : header}
  <main id="main">
${hero}
${body.trimEnd()}
  </main>
${bare ? BARE_FOOTER : FOOTER}
  <script src="js/config.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
`;
}

/* ------------------------------- build ------------------------------ */
const files = fs.readdirSync(PAGES).filter((f) => f.endsWith(".html"));
let built = 0;

files.forEach((file) => {
  const slug = path.basename(file, ".html");
  const raw = read(path.join(PAGES, file));
  const { meta, body } = parseFragment(raw);

  const expanded = body
    .replace(/\{\{CTA\}\}/g, CTA)
    .replace(/\{\{QUOTE_FORM\}\}/g, QUOTE_FORM)
    .replace(/\{\{HERO_FORM\}\}/g, HERO_FORM)
    .replace(/\{\{ABOUT_VIDEO\}\}/g, ABOUT_VIDEO);

  fs.writeFileSync(path.join(ROOT, slug + ".html"), layout({ meta, body: expanded, slug }));
  built++;
  console.log("  ✓ " + slug + ".html");
});

console.log(`\nBuilt ${built} pages.`);
