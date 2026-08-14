# Simply Spotless Pressure Washing — Website

A fast, professional 10-page website for Simply Spotless Pressure Washing,
modeled on the structure and design language of the reference site
(rocklandhousewashing.com). No frameworks and no dependencies — plain static
HTML/CSS/JS that will host anywhere: Netlify, Vercel, GitHub Pages,
Cloudflare Pages, or ordinary shared hosting.

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| About | `about.html` |
| House Washing | `house-washing.html` |
| Power Washing | `power-washing.html` |
| Gutter Cleaning | `gutter-cleaning.html` |
| Benefits of Soft Washing | `benefits-of-soft-washing.html` |
| Gallery | `gallery.html` |
| Reviews | `reviews.html` |
| Contact | `contact.html` |

Navigation: Home · About · Services (House Washing, Power Washing, Gutter
Cleaning, Benefits of Soft Washing) · Gallery · Reviews, with a yellow
**Get A Fast Quote** button always visible. There is deliberately no Contact
tab — the button goes to the same place. `contact.html` is a stripped
quote page: no nav, no footer links, nothing to click but the form.

The service area lives in a band above the footer (a drawn map plus the town
list) rather than on its own page.

Services offered are house washing, power washing (driveways, patios, decks,
fences, walkways) and gutter cleaning — residential only.

## Design

Colors and typography are taken directly from the reference site:

| Token | Value | Used for |
|---|---|---|
| Navy | `#002B47` | Headings, dark sections, footer |
| Blue | `#148FD7` | Hero gradient, accents |
| Yellow | `#FFB400` | Every primary call-to-action |
| Montserrat | 600–900 | Headings and buttons |
| Roboto | 400–700 | Body text |

The hero overlay is the reference's exact recipe:
`linear-gradient(20deg, #148FD7 0%, #002B47 100%)` at 70% opacity, layered
over the background video.

## The hero video

The home page hero is a single full-bleed looping background video:
`assets/videos/hero-1.mp4`. Swap that file to change the hero — no code
changes and no rebuild.

It carries `autoplay muted playsinline` and `preload="auto"`, and the script
listens for several readiness events rather than just one, because browsers
disagree about which of `loadeddata` / `canplay` / `playing` fires. The video
only fades in once it can actually play, so a missing or undecodable file
silently leaves the illustration in place instead of showing a black box.

See `assets/videos/README.md` for shooting and compression tips.

## Editing the site

**New to this? Read [HOW-TO-UPDATE.md](HOW-TO-UPDATE.md)** — a plain-English
walkthrough of adding your photos, videos, contact details and page text.

Pages are assembled from shared parts by a tiny build script, so the header,
footer and CTA band only exist in one place instead of being copy-pasted 10
times.

```
src/partials/   header, footer, CTA band, quote form  (shared by every page)
src/pages/      the unique content of each page
build.js        stitches them together
*.html          the generated files you deploy — do not hand-edit
```

To change something:

```bash
# edit src/pages/… or src/partials/…
node build.js
```

The generated `.html` files in the project root are what gets served. They are
overwritten on every build, so make edits in `src/`.

**Editing from the GitHub web UI works too.** `.github/workflows/build.yml`
runs `node build.js` on any push that touches `src/**` or `build.js` and
commits the regenerated pages, so the published site never goes stale when
files are edited in the browser. That commit only touches root `*.html`,
which the workflow's `paths` filter excludes, so it cannot loop.

## Live site

**https://simplyspotlesspressurewash.com**

Published by GitHub Pages from the `claude/spotless-pressure-washing-site-dc5jzw`
branch (repo root). Every push redeploys automatically. A `.nojekyll` file is
present so Pages serves the files as-is instead of running them through Jekyll.
The old `simplyspotlesspowerwashing-ship-it.github.io/simply-spotless` address
still works and redirects here. See **Hosting and DNS** below.

## Run it locally

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Launch checklist

1. ~~**Phone number**~~ — done: `(845) 650 7548`, set in `js/config.js`.
2. ~~**Hours and email**~~ — done: Mon–Sun 8am–6pm.
3. **Quote form — DO THIS FIRST AFTER GOING LIVE.** The form posts to
   [FormSubmit](https://formsubmit.co) using your Gmail address. It does not
   deliver anything until it is activated: submit the form once yourself,
   then click the one-time link FormSubmit emails you. Until you do, quote
   requests are silently lost. Test it again afterwards to confirm.
4. ~~**Reviews**~~ — done: three real customer reviews, in their own words.
5. ~~**Service area**~~ — done: real towns and a drawn ten-mile map in the
   band above the footer.
6. ~~**Hero video**~~ — done: `assets/videos/hero-1.mp4`.
7. **Gallery photos** — ten before/after pairs are in place. Add more as
   jobs finish; see HOW-TO-UPDATE.md.
8. ~~**Domain**~~ — done: `simplyspotlesspressurewash.com`, set in the
   `CNAME` file and as `url` in `build.js`.
9. **Social links** — Facebook is live. The Instagram and Google icons in
   the footer still point at `#`. Either add the real URLs in
   `src/partials/footer.html` or delete those two `<a>` blocks; a dead link
   on a live site looks worse than no link.
10. ~~**Logo**~~ — done: `assets/img/logo.png`, also used for the favicons.
11. **Google Business Profile** — not part of this repo, but it is the
    single highest-impact thing for local search. Create one, put this
    domain in it, and ask the customers who left reviews to leave them
    there too.

Full step-by-step instructions are in [HOW-TO-UPDATE.md](HOW-TO-UPDATE.md).

## Hosting and DNS

The site is served by GitHub Pages from the `claude/spotless-pressure-washing-site-dc5jzw`
branch of this repo, on the custom domain `simplyspotlesspressurewash.com`.

Two things make the domain work, and both must agree:

- **`CNAME`** in the repo root holds the domain. GitHub reads it on every
  deploy. Deleting it drops the site back to the `github.io` address.
- **DNS at the registrar** points the domain at GitHub:

  | Type | Name | Value |
  |---|---|---|
  | A | `@` | `185.199.108.153` |
  | A | `@` | `185.199.109.153` |
  | A | `@` | `185.199.110.153` |
  | A | `@` | `185.199.111.153` |
  | CNAME | `www` | `simplyspotlesspowerwashing-ship-it.github.io` |

Changing domain later means editing three things together: the `CNAME` file,
`url` in `build.js` (then `node build.js`), and the DNS records.

## What's built in

- Full-bleed hero background video with illustrated fallback
- Logo image with an automatic drawn fallback if the file is absent,
  reused as the favicon and Apple touch icon
- Quote form built into the hero, with tap-to-call as the primary CTA
- Services icon bar mirroring the reference site
- Dropdown navigation (hover on desktop, accordion on mobile)
- Draggable before/after comparison sliders — any number per page
- Accessible FAQ accordions on every service page
- Sticky Call Now / Free Quote bar on mobile
- Scroll reveal animations that respect `prefers-reduced-motion`
- Skip-to-content link, keyboard-accessible menus, labelled form fields
- Per-page titles, meta descriptions, canonical URLs and Open Graph tags
