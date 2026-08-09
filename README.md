# Simply Spotless Pressure Washing — Website

A fast, professional one-page website for Simply Spotless Pressure Washing.
No build step, no framework — plain HTML/CSS/JS that can be hosted anywhere
static files are served (Netlify, Vercel, GitHub Pages, Cloudflare Pages…).

## What's inside

- **Hero video slider** — three rotating slides with headline changes, dots and
  arrows. Plays real MP4 footage when you add it (see
  `assets/videos/README.md`); until then it shows polished animated scenes.
- **Strong calls to action** — "Get A Fast Quote" and "Click To Call"
  everywhere, plus a sticky call bar on mobile.
- **Services grid** — house washing, roof soft wash, driveways, decks &
  fences, gutters, commercial.
- **Interactive before/after slider** — drag to compare.
- **Claim Your Deal** — the signature feature: visitors "pressure wash" a
  grimy house with their cursor or finger (HTML5 canvas). A few passes reveal
  red **$25 OFF ALL HOUSE WASHES** lettering and unlock a claim button that
  pre-fills the quote form with promo code `SPOTLESS25`.
- **Reviews, about, three-step process, quote form, footer.**

## Run it locally

Any static server works:

```bash
cd simply-spotless
python3 -m http.server 8080
# open http://localhost:8080
```

(Opening `index.html` directly also works — the interactive deal is written so
it doesn't depend on a server.)

## Launch checklist (do these before going live)

1. **Phone number** — edit `js/config.js` (`phoneDisplay` + `phoneDial`).
   The placeholder `(555) 555-0199` appears everywhere until you do.
2. **Hours & email** — same file, `hours` and `email`.
3. **Quote form** — the form posts to [FormSubmit](https://formsubmit.co)
   using your Gmail address. After deploying, submit the form once yourself:
   FormSubmit emails you a one-time activation link. Click it and every
   request after that lands in your inbox. (Alternatives: Netlify Forms or
   Formspree — swap `formEndpoint` in `js/config.js`.)
4. **Reviews** — the three testimonials in `index.html` are **sample
   placeholder text** (marked with an HTML comment). Replace them with real
   customer reviews before launch.
5. **Service area** — the About section says "our local area". Add your real
   city/town names for better local search results.
6. **Hero videos** — add `hero-1.mp4`, `hero-2.mp4`, `hero-3.mp4` to
   `assets/videos/` (see the README there).
7. **Photos** — when you have real before/after photos, replace
   `assets/img/ba-before.svg` / `ba-after.svg` with same-angle JPGs (update
   the two `<img>` tags in the Before & After section to point at them).

## Changing the deal

Everything about the offer lives in `js/config.js`:

- `promoCode` — the code shown after the reveal.
- `revealThreshold` — how much grime (percent) must be washed off before the
  deal unlocks (default 60).

The red lettering itself is in `assets/img/deal-house-clean.svg`, and the
grime layer is the `DIRTY_HOUSE_SVG` string at the top of `js/main.js`.
