# Images

## What each file is for

| File | Where it appears |
| --- | --- |
| `hero.jpg` | Home page hero behind the video on desktop, **and** the banner on both the House Washing and Benefits of Soft Washing pages. See `assets/videos/README.md`. |
| `hero-m.jpg` | Home page hero on phones — a crop of the same frame shaped to the phone hero box (which is capped at 600px tall so more of the photo shows). |
| `hero-gallery.jpg` | Banner at the top of the Gallery page (the tan apartment building). |
| `hero-sign.jpg` | Banner at the top of the Reviews and Contact pages (the yard sign), on laptops and tablets. |
| `hero-sign-m.jpg` | The same banner reframed for phones — sign lower and smaller, so it sits under the buttons rather than behind them. |
| `hero-house.svg`, `hero-driveway.svg`, `hero-deck.svg` | Illustrated banners on the remaining inner pages. |
| `ba-siding-before/after.jpg` | House page slider **and** gallery slider — the close siding crop. |
| `ba-gable-before/after.jpg` | Gallery slider — the tan gable wall. |
| `ba-fence-before/after.jpg` | Gallery side-by-side — the vinyl privacy fence. |
| `ba-steps-before/after.jpg` | Gallery side-by-side — the front steps and landing. |
| `ba-blue-before/after.jpg` | Gallery side-by-side — the blue siding and window. |
| `ba-fenceline-before/after.jpg` | Gallery side-by-side — the long fence run. |
| `ba-stairwell-before/after.jpg` | Gallery side-by-side — the basement stairwell. |
| `ba-yellow-before/after.jpg` | Gallery side-by-side — the pale yellow wall. |
| `logo.png` | The badge in the site header. |
| `favicon-*.png`, `apple-touch-icon.png` | Browser tab and phone home-screen icons. |

## Changing a page's banner

Each page's banner is named in the `<!--meta -->` block at the top of its file
in `src/pages/`:

```
heroArt: assets/img/hero-gallery.jpg
```

Point it at any image in this folder and run `node build.js`. If the file is a
photo (`.jpg`, `.png`, `.webp`, `.avif`) the builder automatically adds a
heavier scrim so the headline stays readable — darkening the left on wide
screens and the top on phones. SVG illustrations don't get it; they don't need
it.

A page can also give phones a differently framed file:

```
heroArt: assets/img/hero-sign.jpg
heroArtMobile: assets/img/hero-sign-m.jpg
```

The builder emits both and the stylesheet swaps to the mobile one below 760px.
Leave `heroArtMobile` out and the one image is used at every width.

## Sizing banner photos

Banners are very wide on a laptop (about 3.6:1) and nearly square on a phone
(about 1.2:1), and `background-size: cover` crops to fit. That means **only the
middle of the photo is guaranteed to survive**, so:

- Crop to roughly **1600x1000** before adding it.
- Put the subject in the **middle vertically** — the top and bottom get cut on
  wide screens.
- Keep the subject **right of centre** — the headline and buttons sit on the
  left. The `hero-sign.jpg` crop starts at the left edge of the original photo
  for exactly this reason, which pushes the sign to the right of the frame.
- Anything with fine detail or small text will be hard to read under the blue
  wash. That's fine — the banner is a texture, not a billboard.

## Adding a before & after to the gallery

Open `src/pages/gallery.html`, copy an existing block inside `<div class="gallery">`,
point its two `<img>` tags at your new files, rewrite the alt text and the
caption, then run `node build.js`.

There are two kinds of block, and picking the right one matters:

- **A slider** (`<div class="ba" data-ba>`) — for a pair shot from close enough
  to the same spot that the two frames line up. Dragging the handle swaps
  between them, which is only convincing when the wall doesn't jump.
- **A side-by-side** (`<div class="twoup">` inside a
  `gallery__item--wide` figure) — for a pair shot from different spots or
  distances. Still reads at a glance, and nothing looks broken.

### Shooting a pair that can be a slider

The slider only works when both photos line up, which takes a little care:

- **Stand in the same spot both times.** Mark it — a chalk X, a paving slab,
  anything. This is the one that matters most.
- Same distance and same zoom. Stepping closer for the "after" is what forces
  a pair into the side-by-side treatment.
- Hold the phone level, not tilted, and at the same height.
- Same time of day where you can, so the light matches.
- Get the whole surface in frame, not just the worst patch.
- **Take the "before" every single time**, even when you're in a hurry. You can
  always skip using it; you can never go back for it.

### Preparing the files

Crop both to the **same shape** — 4:3 landscape, around 1400x1050, is what the
existing ones use. Both images of a pair must be the same dimensions or the
slider will drift as you drag it.
