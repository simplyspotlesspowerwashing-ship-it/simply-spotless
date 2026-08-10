# Images

## What each file is for

| File | Where it appears |
| --- | --- |
| `hero.jpg` | Home page hero, on phones. On desktop the video plays over it — see `assets/videos/README.md`. |
| `hero-gallery.jpg` | Banner at the top of the Gallery page (the tan apartment building). |
| `hero-sign.jpg` | Banner at the top of the Reviews and Contact pages (the yard sign). |
| `hero-house.svg`, `hero-driveway.svg`, `hero-deck.svg` | Illustrated banners on the remaining inner pages. |
| `ba-before.jpg` / `ba-after.jpg` | The before/after slider on the home page and the gallery. |
| `logo.png` | The badge in the site header. |
| `favicon-*.png`, `apple-touch-icon.png` | Browser tab and phone home-screen icons. |

## Changing a page's banner

Each page's banner is named in the `<!--meta -->` block at the top of its file
in `src/pages/`:

```
heroArt: assets/img/hero-gallery.jpg
```

Point it at any image in this folder and run `node build.js`. If the file is a
photo (`.jpg`, `.png`, `.webp`, `.avif`) the builder adds a heavier scrim over
the left side automatically, so the headline stays readable — SVG illustrations
don't get it, because they don't need it.

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
