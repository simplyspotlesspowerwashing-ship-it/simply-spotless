# Hero background

The home page hero currently shows a **still photo**: `assets/img/hero.jpg`
(a frame lifted from the video below). To change it, replace that file.

## Going back to video

`hero-1.mp4` is still here. To use it again, open `src/pages/index.html` and
put the video element back inside `<div class="hero__media">`, directly after
the `hero__art` div:

```html
<video class="hero__video" id="heroVideo"
       autoplay muted loop playsinline preload="auto"
       disablepictureinpicture aria-hidden="true" tabindex="-1">
  <source src="assets/videos/hero-1.mp4" type="video/mp4">
</video>
```

Then run `node build.js`. The still stays behind it as the loading fallback,
and the script handles playback automatically.

## Tips for great hero footage

- **10-20 seconds** is plenty; it loops automatically.
- Shoot **landscape (horizontal)**, ideally 1080p. Phone footage works great.
- Best shots: a wand moving across dirty siding, a surface cleaner leaving a
  clean stripe on concrete, a slow pan across a finished job.
- Keep the camera fairly steady and move slowly.
- Sound doesn't matter - hero video is always muted by browsers.
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

## Tips for great hero footage

- **10–20 seconds** per clip is plenty — they loop automatically.
- Shoot **landscape (horizontal)**, ideally 1080p. Phone footage works great.
- Best shots: a wand spraying siding, a surface cleaner making a clean stripe
  on a driveway, a satisfying "clean line" reveal.
- Keep clips **under ~8 MB each** so the page stays fast. Free compressors
  like HandBrake (preset: "Web / Vimeo YouTube 720p30") get you there.
- Videos autoplay muted (that's required by browsers), so sound doesn't matter.
