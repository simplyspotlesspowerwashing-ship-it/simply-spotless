# How To Update Your Website

Everything you'll want to change, in plain English. No web experience needed.

There are only **three kinds of edits**, and they live in three places:

| What you want to change | Where you go |
|---|---|
| Phone, email, hours, review link | `js/config.js` |
| Hero videos and photos | the `assets/` folder |
| Any words on any page | `src/pages/` |

> **One rule to remember:** after editing anything in `src/pages/` or
> `src/partials/`, run this command once in the project folder:
>
> ```bash
> node build.js
> ```
>
> That rebuilds the real pages. If you only changed `js/config.js` or added
> photos/videos, you do **not** need to run it.

---

## 1. Your business info (do this first)

Open **`js/config.js`**. It's short, and it's the only place your contact
details exist — change it once and it updates every page, the top bar, the
footer, and the mobile "Call Now" button.

```js
phoneDisplay: "(555) 555-0199",     // how it LOOKS on the page
phoneDial:    "+15555550199",       // what it DIALS when tapped
email:        "simply.spotless.powerwashing@gmail.com",
hours:        "Mon–Sat: 8am–6pm",
googleReviewLink: "",               // paste your Google review link here
```

Rules for `phoneDial`: no spaces, no dashes, no parentheses. US numbers start
with `+1`. So `(845) 555-0123` becomes `+18455550123`.

**The `(555) 555-0199` number is fake and it's currently on every page.**
This is the single most important thing to change before you go live.

---

## 2. The hero videos

The big rotating hero on the home page is already wired for three videos.
You don't touch any code — you just add three files.

**Put your videos here, named exactly this:**

```
assets/videos/hero-1.mp4     ← house washing
assets/videos/hero-2.mp4     ← driveway / power washing
assets/videos/hero-3.mp4     ← deck / fence
```

That's it. Refresh the page and they play, fading in behind the blue overlay
and rotating every 6.5 seconds.

**Filming tips:**
- **Hold your phone sideways** (landscape). This matters most — a vertical
  video will look wrong.
- 10–20 seconds each is plenty. They loop automatically.
- Best shots: the wand moving across dirty siding, a surface cleaner leaving
  a clean stripe on concrete, a slow pan across a finished job.
- Keep the camera fairly steady and move slowly.
- Sound doesn't matter — hero videos are always muted by browsers.

**Important — file size:** keep each video **under about 8 MB**, or your site
will load slowly on phones. Raw phone video is often 50 MB+. Use a free
compressor first:
- **HandBrake** (free, Mac/Windows) — use the preset "Web → Vimeo YouTube 720p30"
- or any "compress video" web tool, set to 720p

**If you only have one video:** name it `hero-1.mp4` and delete the other two
slide blocks — or just leave them; slides 2 and 3 will keep showing the
illustrations, which still looks fine.

**Until you add videos**, the hero shows animated illustrations, so the site
never looks broken or empty.

---

## 3. Your photos

Right now the site uses hand-drawn illustrations as placeholders. Here's every
image and where it shows up:

| File | Where it appears |
|---|---|
| `assets/img/hero-house.svg` | Hero slide 1, About page, Gutter Cleaning page |
| `assets/img/hero-driveway.svg` | Hero slide 2, Power Washing page |
| `assets/img/hero-deck.svg` | Hero slide 3, Gallery |
| `assets/img/ba-before.svg` | "Before" in the comparison sliders |
| `assets/img/ba-after.svg` | "After" in the comparison sliders |

**To swap in a real photo**, you need to do two small things:

1. Put your photo in `assets/img/` — for example `my-house-wash.jpg`
2. Find where the old file is named and change it to your new filename

For the **hero slides**, open `src/pages/index.html` and look for lines like:

```html
<div class="hero-slide__art" style="background-image:url('assets/img/hero-house.svg')"></div>
```

Change `hero-house.svg` to `my-house-wash.jpg`. Then run `node build.js`.

**Photo tips:**
- Landscape (sideways), not vertical
- Save as `.jpg` — smaller files than `.png` for photos
- Aim for about 1600 pixels wide; keep each file under ~500 KB
- Free compressor: [squoosh.app](https://squoosh.app)

### Before & After photos (your best sales tool)

The comparison sliders on the home page and Gallery only look good if both
photos line up. When you're on a job:

- **Take the "before" shot every single time**, even when you're rushed
- Stand in the same spot for both — mark it with a rock or a chalk line
- Same time of day so shadows match
- Hold the phone level, get the whole surface in frame
- Crop both photos to the same size before uploading

Then in `src/pages/gallery.html`, replace `ba-before.svg` / `ba-after.svg`
with your filenames, and update the caption underneath. Run `node build.js`.

---

## 4. Changing words on a page

Every page's text lives in `src/pages/`, one file per page:

```
src/pages/index.html                     Home
src/pages/about.html                     About
src/pages/house-washing.html             House Washing
src/pages/power-washing.html             Power Washing
src/pages/gutter-cleaning.html           Gutter Cleaning
src/pages/benefits-of-soft-washing.html  Benefits of Soft Washing
src/pages/service-area.html              Service Area
src/pages/gallery.html                   Gallery
src/pages/reviews.html                   Reviews
src/pages/contact.html                   Contact
```

Open one, find the sentence, type over it, save, then run `node build.js`.

Text sits between angle-bracket tags. Only change the words, not the tags:

```html
<p>Change this sentence, but leave the p tags alone.</p>
```

The block at the very top of each file (between `<!--meta` and `-->`) controls
the page title and the description Google shows in search results — worth
updating those too.

**Header and footer** are shared by all pages and live in
`src/partials/header.html` and `src/partials/footer.html`. Change them once
and every page updates.

---

## 5. The three things that need your real content

These are currently placeholders and should be replaced before you launch:

### Reviews
`src/pages/reviews.html` and the reviews section of `src/pages/index.html`.
The sample reviews are marked with a comment that says SAMPLE CONTENT.
Replace the quote, the name, and the service underneath with real ones.
**Don't leave the fake ones up** — made-up reviews are the fastest way to lose
trust with a customer who spots them.

### Service area
`src/pages/service-area.html` has placeholder town names like "Your Town".
Put your real towns, cities and ZIP codes there. This is genuinely one of the
highest-impact things you can do for showing up in local Google searches, so
be thorough — list every town you'd drive to.

### Google review link
Get it from your Google Business Profile, paste it into `googleReviewLink` in
`js/config.js`, and the "Leave A Google Review" button starts working.

---

## 6. Making the quote form actually email you

The form is already pointed at your Gmail through a free service called
FormSubmit. It needs **one activation step**:

1. Put the site online
2. Go to the Contact page and submit the form yourself, as a test
3. FormSubmit sends you an email with a confirmation link — **click it**
4. Done. Every quote request from then on lands in your inbox

Until you click that link, submissions won't come through. Do this on launch
day and test it once.

---

## 7. Seeing your changes before you publish

In the project folder, run:

```bash
python3 -m http.server 8080
```

Then open **http://localhost:8080** in your browser. That's your site, running
on your own computer. Press `Ctrl+C` in the terminal to stop it.

---

## Quick checklist before you go live

- [ ] Real phone number in `js/config.js` (the `(555)` one is fake)
- [ ] Real email and hours
- [ ] Hero videos added, each under ~8 MB
- [ ] Real before/after photos in the Gallery
- [ ] Real customer reviews replacing the samples
- [ ] Real town names on the Service Area page
- [ ] Google review link added
- [ ] Social links in `src/partials/footer.html` (they point nowhere yet)
- [ ] Your domain set in `build.js` (`SITE.url`), then `node build.js`
- [ ] Quote form tested and FormSubmit link clicked
