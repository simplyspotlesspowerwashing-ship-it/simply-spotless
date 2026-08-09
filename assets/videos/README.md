# Hero videos

The hero slider is already wired to play real video. Drop three MP4 files in
this folder and they will automatically fade in over the illustrated scenes:

| File | Slide |
|---|---|
| `hero-1.mp4` | House washing |
| `hero-2.mp4` | Driveway / power washing |
| `hero-3.mp4` | Deck & fence cleaning |

Until these files exist, the animated illustrations are shown instead, so the
site always looks finished.

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
