# How To Update Your Website

Everything you'll want to change, in plain English. No web experience needed.

There are only **three kinds of edits**, and they live in three places:

| What you want to change | Where you go |
|---|---|
| Phone, email, hours | `js/config.js` |
| Hero video and photos | the `assets/` folder |
| Any words on any page | `src/pages/` |

> **You can do all of this from the GitHub website — no software needed.**
> Open a file, click the pencil icon, make your change, click *Commit changes*.
> The site rebuilds and republishes itself within a minute or two.
>
> (There's a robot that runs the page build for you whenever you edit
> anything in `src/`. You'll see it under the **Actions** tab. If you ever
> work on the files locally instead, run `node build.js` yourself after
> editing `src/`.)

---

## 1. Your business info (do this first)

Open **`js/config.js`**. It's short, and it's the only place your contact
details exist — change it once and it updates every page, the top bar, the
footer, and the mobile "Call Now" button.

```js
phoneDisplay: "(845) 650 7548",     // how it LOOKS on the page
phoneDial:    "+18456507548",       // what it DIALS when tapped
email:        "simply.spotless.powerwashing@gmail.com",
hours:        "Mon–Sun: 8am–6pm",
```

Rules for `phoneDial`: no spaces, no dashes, no parentheses. US numbers start
with `+1`. So `(845) 650 7548` becomes `+18456507548`.

Your real details are already in here — this is just where to change them
if anything moves.

---

## 2. The hero video

The big video across the top of the home page is one file:

```
assets/videos/hero-1.mp4
```

**To change it, replace that file.** Same name, same folder. That's the whole
job — no code to edit, nothing to rebuild. Your current clip is already in
place.

**Filming tips:**
- **Hold your phone sideways** (landscape). This matters most — a vertical
  video will look wrong.
- 10-20 seconds is plenty. It loops automatically.
- Best shots: the wand moving across dirty siding, a surface cleaner leaving
  a clean stripe on concrete, a slow pan across a finished job.
- Keep the camera fairly steady and move slowly.
- Sound doesn't matter — the hero is always muted by browsers.

**Important — file size:** keep it **under about 8 MB**, or the page will be
slow on phones. Raw phone video is often 50 MB+. Compress it first with
**HandBrake** (free) using the preset "Web → Vimeo YouTube 720p30", or send
it over and it can be compressed for you.

**Uploading through GitHub — two traps:**
1. **Rename the file on your computer first, then upload it.** Never use
   GitHub's rename button on a video: its editor treats the file as text and
   will silently destroy it. This already happened once.
2. **`.mov` is not `.mp4`.** Renaming an iPhone `.mov` doesn't convert it.
   Convert with HandBrake, or send it over.

**If the video is missing or broken**, the hero falls back to an illustrated
scene, so the page never looks empty.

---

## 3. Your logo

Your logo goes here, named exactly this:

```
assets/img/logo.png
```

Upload it and it appears in **both the header and the footer** automatically.
Nothing else to change.

**How to upload it:**
1. Rename your file to `logo.png` **on your computer first**
2. On GitHub go to the **`assets/img`** folder
3. **Add file → Upload files**, drag it in, **Commit changes**

**Your logo is already installed.** It appears in the header and footer next
to the business name, and it is also the little icon on the browser tab.

If you ever change it, replace `assets/img/logo.png` with a square,
transparent-background PNG. The tab icons (`favicon-32.png`,
`favicon-192.png`, `apple-touch-icon.png`) are generated from it — send the
new logo over and those can be regenerated to match.

If the file is ever missing, the site falls back to a simple drawn water-drop
mark, so the header never looks broken.

---

## 4. Your photos

Right now the site uses hand-drawn illustrations as placeholders. Here's every
image and where it shows up:

| File | Where it appears |
|---|---|
| `assets/img/hero-house.svg` | Hero fallback, About page, Gutter Cleaning page |
| `assets/img/hero-driveway.svg` | Power Washing page |
| `assets/img/hero-deck.svg` | Gallery |
| `assets/img/ba-before.jpg` | "Before" in the comparison sliders (real photo) |
| `assets/img/ba-after.jpg` | "After" in the comparison sliders (real photo) |

**To swap in a real photo**, you need to do two small things:

1. Put your photo in `assets/img/` — for example `my-house-wash.jpg`
2. Find where the old file is named and change it to your new filename

Photos live in `assets/img/`. Upload them the same way as the logo:
**Add file → Upload files** inside that folder.

For the **hero fallback image** (what shows before the video loads), open
`src/pages/index.html` and look for:

```html
<div class="hero__art" style="background-image:url('assets/img/hero-house.svg')"></div>
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

**Sending more pairs is the easy way:** paste them straight into the chat and
they can be cropped, aligned, compressed and wired in for you — that is how
the siding pair already on the site got there.

---

## 5. Changing words on a page

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

**On the GitHub website:** open the file, click the **pencil icon** (top
right), find the sentence, type over it, then **Commit changes** at the
bottom. Give it a minute and your live site updates.

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

**A tip for finding the right file:** on GitHub, press the **`t`** key inside
the repo to search filenames, or use the search box at the top-left and pick
"In this repository" to search the actual wording you want to change. That
usually lands you straight on the right line.

**If something goes wrong**, nothing is lost — every change is saved
separately. Open the **Commits** list, find the change you want to undo,
and click **Revert**.

---

## 6. The two things that need your real content

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

---

## 7. Making the quote form actually email you

The form is already pointed at your Gmail through a free service called
FormSubmit. It needs **one activation step**:

1. Put the site online
2. Go to the Contact page and submit the form yourself, as a test
3. FormSubmit sends you an email with a confirmation link — **click it**
4. Done. Every quote request from then on lands in your inbox

Until you click that link, submissions won't come through. Do this on launch
day and test it once.

---

## 8. Your live website

Your site is published free through GitHub Pages at:

**https://simplyspotlesspowerwashing-ship-it.github.io/simply-spotless/**

**Every time you push a change, the site updates itself** — usually within
about a minute. There is nothing to re-upload.

If it hasn't updated, check the **Actions** tab in your GitHub repo: a
"pages build and deployment" job runs on each push, and a green check means
it published.

### Turning it on (one time only)

If the link above doesn't work yet:

1. Go to your repo on GitHub → **Settings** → **Pages** (left sidebar)
2. Under **Source**, pick **Deploy from a branch**
3. Branch: **`claude/spotless-pressure-washing-site-dc5jzw`**, folder: **`/ (root)`**
4. Click **Save**, wait about a minute, then refresh the link

### Later: using your own domain

When you buy a domain (simplyspotlesspw.com or similar), go to
Settings → Pages → **Custom domain**, enter it, and follow the DNS steps your
registrar gives you. Then update `url:` near the top of `build.js` to the new
domain and run `node build.js` so the search-engine tags match.

---

## 9. Seeing your changes before you publish

In the project folder, run:

```bash
python3 -m http.server 8080
```

Then open **http://localhost:8080** in your browser. That's your site, running
on your own computer, before anyone else can see it. Press `Ctrl+C` in the
terminal to stop it.

---

## Quick checklist before you go live

- [x] Real phone number in `js/config.js` — done
- [x] Real email and hours — done
- [x] Hero video added — done
- [x] First real before/after pair added (siding algae removal)
- [ ] More before/after pairs as jobs finish
- [x] Logo installed (header, footer and browser tab)
- [ ] Real customer reviews replacing the samples
- [ ] Real town names on the Service Area page
- [ ] Social links in `src/partials/footer.html` (they point nowhere yet)
- [ ] Your domain set in `build.js` (`SITE.url`), then `node build.js`
- [ ] Quote form tested and FormSubmit link clicked
