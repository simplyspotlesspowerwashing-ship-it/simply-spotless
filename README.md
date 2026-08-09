# Simply Spotless Pressure Washing — Website

A fast, professional 15-page website for Simply Spotless Pressure Washing,
modeled on the structure and design language of the reference site
(rocklandhousewashing.com). No frameworks and no dependencies — plain static
HTML/CSS/JS that will host anywhere: Netlify, Vercel, GitHub Pages,
Cloudflare Pages, or ordinary shared hosting.

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| About Us | `about.html` |
| Careers | `careers.html` |
| Power Washing | `power-washing.html` |
| House Washing | `house-washing.html` |
| Roof Cleaning | `roof-cleaning.html` |
| Gutter Cleaning | `gutter-cleaning.html` |
| Solar Panel Cleaning | `solar-panel-cleaning.html` |
| Junk Removal | `junk-removal.html` |
| Benefits of Soft Washing | `benefits-of-soft-washing.html` |
| Service Area | `service-area.html` |
| Gallery | `gallery.html` |
| Reviews | `reviews.html` |
| Contact | `contact.html` |
| Prepare For Your Service | `prepare-for-your-service.html` |

Navigation mirrors the reference: Home · About (About Us, Careers) ·
Services (7 pages) · Service Area · Gallery · Reviews · Contact, with a
yellow **Get A Fast Quote** button always visible.

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

The home page hero is a three-slide video slider with rotating headlines,
dots and arrows. Each slide plays a video from `assets/videos/`:

| File | Slide |
|---|---|
| `hero-1.mp4` | House washing |
| `hero-2.mp4` | Driveway / power washing |
| `hero-3.mp4` | Roof cleaning |

**Drop those three files in and they play automatically — no code changes.**
Until then each slide shows an animated illustration, so the hero always
looks finished rather than broken. A video only fades in once the browser
confirms it can actually play it, so a missing or corrupt file silently
falls back to the illustration.

See `assets/videos/README.md` for shooting and compression tips.

## Editing the site

Pages are assembled from shared parts by a tiny build script, so the header,
footer and CTA band only exist in one place instead of being copy-pasted 15
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

The generated `.html` files in the project root are what you upload. They are
overwritten on every build, so make your edits in `src/`.

## Run it locally

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Launch checklist

1. **Phone number** — edit `js/config.js` (`phoneDisplay` and `phoneDial`).
   The placeholder `(555) 555-0199` appears site-wide until you change it.
2. **Hours and email** — same file (`hours`, `email`).
3. **Quote form** — posts to [FormSubmit](https://formsubmit.co) using your
   Gmail address. After deploying, submit the form once yourself: FormSubmit
   emails a one-time activation link. Click it and every request after that
   lands in your inbox. (Netlify Forms or Formspree work too — just change
   `formEndpoint` in `js/config.js`.)
4. **Reviews** — the testimonials on `reviews.html` and the home page are
   clearly-marked **sample text**. Replace them with real customer reviews.
5. **Service area** — `service-area.html` has placeholder town names. Put
   your real towns, cities and ZIP codes there; it is one of the highest-impact
   things you can do for local search.
6. **Google review link** — paste it into `googleReviewLink` in
   `js/config.js` and the button on the Reviews page will point at it.
7. **Hero videos** — add `hero-1.mp4`, `hero-2.mp4`, `hero-3.mp4`.
8. **Gallery photos** — replace the placeholder illustrations with real
   before/after JPGs (same angle, same crop). The gallery page has a short
   guide on shooting them.
9. **Domain** — set `SITE.url` at the top of `build.js` and re-run
   `node build.js` so the canonical URLs are correct.
10. **Social links** — the footer's Facebook / Instagram / Google icons point
    at `#`. Update them in `src/partials/footer.html`.

## What's built in

- Video hero slider with illustrated fallback and rotating headlines
- Dropdown navigation (hover on desktop, accordion on mobile)
- Draggable before/after comparison sliders — any number per page
- Accessible FAQ accordions on every service page
- Sticky Call Now / Free Quote bar on mobile
- Scroll reveal animations that respect `prefers-reduced-motion`
- Skip-to-content link, keyboard-accessible menus, labelled form fields
- Per-page titles, meta descriptions, canonical URLs and Open Graph tags
