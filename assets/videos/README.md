# Hero background

The home page hero has two backgrounds:

| Screen width | What visitors see |
| --- | --- |
| 900px and up (laptops, desktops, tablets in landscape) | `hero-1.mp4` playing on a loop |
| Under 900px (phones) | the still photo `assets/img/hero.jpg` |

The still is a frame lifted straight out of the video, so the two match.

## Why phones get the still

The video is about 4 MB. On a phone that is the single most expensive thing
on the page — data, battery, and time-to-first-paint — and the video reads
poorly at that size anyway.

Phones don't just hide the video, they **never download it**. The URL is kept
in a `data-src` attribute, and `js/main.js` only turns it into a real
`<source>` above the breakpoint. That's the whole trick — a `<video>` with a
normal `src` that's merely hidden with `display: none` still costs the visitor
every byte.

## Changing either one

- **Different still**: replace `assets/img/hero.jpg` (1920x1080 works well).
- **Different video**: replace `hero-1.mp4`, keeping the name.
- **Different cutoff**: the width lives in two places that must agree —
  `HERO_VIDEO_MIN` in `js/main.js` and the `@media (max-width: 899.98px)`
  rule for `.hero__video` in `css/styles.css`.
- **Still photo everywhere, no video**: delete the `data-src` attribute from
  the `<video>` in `src/pages/index.html`, then run `node build.js`.
- **Video on phones too**: change both widths above to `(min-width: 0px)` /
  drop the media query. Not recommended.

Visitors who have "reduce motion" turned on, or Data Saver, keep the still at
every width. If the video is missing or won't decode, the still stays up — the
hero is never a black box.

After editing anything in `src/`, run `node build.js`.

## Tips for great hero footage

- **10-20 seconds** is plenty; it loops automatically.
- Shoot **landscape (horizontal)**, ideally 1080p. Phone footage works great.
- Best shots: a wand moving across dirty siding, a surface cleaner leaving a
  clean stripe on concrete, a slow pan across a finished job.
- Keep the camera fairly steady and move slowly.
- Sound doesn't matter — hero video is always muted by browsers.
- Keep it **under ~8 MB** so the page stays fast. Raw phone video is often
  50 MB+; HandBrake's "Web / Vimeo YouTube 720p30" preset gets you there.

## Uploading through the GitHub website — two gotchas

1. **Upload the file already named correctly.** Do NOT upload it under one
   name and then use GitHub's "rename" on it. GitHub's web editor opens the
   file as text to rename it, which corrupts binary files — it will silently
   turn your video into a 2-byte text file. Rename it on your computer first,
   then upload.
2. **`.mov` is not `.mp4`.** Renaming an iPhone `.mov` to `.mp4` does not
   convert it — it just relabels a QuickTime file. Convert properly with
   HandBrake, or send it over and it can be converted for you.
