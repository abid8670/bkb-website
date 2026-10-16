# Bin Kamal Builders — Website

A premium static marketing website for **Bin Kamal Builders (BKB)**, featuring **Arabian Villa Apartments (AVA)** as the flagship project. Built with hand-written HTML, a custom CSS design system, Bootstrap 5 (grid/utilities only) and vanilla JavaScript — no build step, deployable on any static host.

---

## 1. Preview locally

A static server is already configured in the project root (`_server.ps1`, port `8765`).

```
# from C:\Users\HP\Desktop\BKB
powershell -ExecutionPolicy Bypass -File _server.ps1
```

Then open: <http://localhost:8765/website/index.html>

> Because the site uses relative paths, it also opens directly from disk, but a local server is recommended so that fonts, the map embed and the brochure PDFs behave exactly as in production.

## 2. Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — hero “Building Beyond Structures.”, intro, philosophy pillars, featured AVA, CEO quote, why BKB, selected projects, partner, contact CTA |
| `about.html` | About BKB — story, CEO Ibrahim Kamal, vision/mission, DevPro division, BKB Holdings, CTA |
| `projects.html` | Projects — featured AVA, 10 duplex residences (General Block + Legends Enclave), 8 delivered construction works |
| `arabian-villa.html` | Flagship page — intro, gallery, prime location, community, amenities, master plan, residences, floor-plan tabs, payment plan, request form, brochure gate |
| `services.html` | Services — development, construction, renovation, institutional, commercial, infrastructure |
| `why-bkb.html` | Why BKB — six pillars, commitment quote, vision/mission |
| `contact.html` | Contact — enquiry channels, contact info, map embed, main form, dealer/partner form |
| `privacy.html` / `terms.html` | Legal pages |
| `robots.txt` / `sitemap.xml` | SEO crawl files |

## 3. Structure

```
website/
├── index.html … terms.html      # 9 pages
├── robots.txt, sitemap.xml
├── css/style.css                # full design system
├── js/main.js                   # header, reveals, tabs, lightbox, forms, brochure gate
└── assets/
    ├── img/                     # all imagery + favicons (see §6)
    └── brochure/                # official source PDFs (downloadable)
```

## 4. Design system

- **Palette:** navy `#07182B` / `#0C223B`, gold `#C89B4A` / `#D4AC61`, ivory `#F7F4EE`, charcoal `#242424`.
- **Type:** Cormorant Garamond (display) + Inter (body).
- **Header:** transparent over the hero, turns solid on scroll.
- **Motion:** scroll-reveal, hero parallax, staggered mobile menu — all disabled under `prefers-reduced-motion`.
- **Responsive:** mobile-first; hamburger menu ≤ 1040px.

## 5. Verified content & contact details

Copy is derived from the supplied PDFs plus the **official company details confirmed by the client**. No projects, stats, awards, completion dates or figures were invented.

**Company (official):**
- **Name:** Bin Kamal Builders (brand: BKB) · **Tagline:** “Your Dream, Our Commitment” · **Established:** 2019
- **Founder / CEO:** Ibrahim Kamal
- **Head office:** Ground Floor, Al Hafeez Executive, Block C3, Gulberg III, Lahore, Pakistan, 54660
- **Phone / WhatsApp:** 0332-4448445 (`tel:+923324448445`, `wa.me/923324448445`)
- **Email:** Binkamalbuilders@gmail.com
- **Service areas:** Lahore & Islamabad
- **Main services:** Residential Construction, Commercial Construction, Grey Structure, Real Estate Development
- **Social:** Facebook — <https://www.facebook.com/share/1CcPDGzgXG/> and <https://www.facebook.com/share/1JWdJnGCCG/>
- **Confirmed stats:** 10+ years experience · 50+ projects completed · PKR 50+ crore client budget managed · 5.0 Google rating

**Subsidiary — DevPro Contractors & Engineers:** 128 School Avenue, Blue World City, Chakri Road, Rawalpindi · 0306-8750009 / 0333-0034500 · devproconstruction@gmail.com · devproconstruction.com · PEC C5/E 29168 (PEC-II, up to PKR 65M) · FBR NTN 3520055066283 · DHA Cat C-5 No. 6684 · FWO T-5491 Cat C-4.

**AVA status:** Under Construction · Booking Open. CTAs used: “Book Now”, “Request Payment Plan”, “Schedule Site Visit”.


## 6. Image mapping (generated from the source PDFs)

All images are **original crops/renders from the supplied PDFs** — no stock imagery was used. `_gen_assets2.ps1` in the project root regenerates the current (re-cropped) set.

| Web asset | Source |
|-----------|--------|
| `ava-hero.jpg` | AVA p.2 (clean render, text-free top band) |
| `ava-residences.jpg` | AVA p.2 |
| `ava-community.jpg` | AVA p.2 (landscaped community/garden band) |
| `map-location.jpg` | AVA p.3 (location map) |
| `masterplan.jpg` | AVA p.9 (master plan) |
| `floor-ground/first/second/rooftop.jpg` | AVA pp.10–13 |
| `payment-plan-page.jpg` | AVA p.14 (original table, for reference) |
| `logo-bkb.jpg` | AVA p.15 (BHB monogram lockup, high-res) |
| `ceo.jpg` | Company profile p.3 (CEO portrait, tight crop) |
| `bk-construction.jpg` | Company profile p.2 |
| `p-*.jpg` (8 projects) | Company profile pp.6–9 |
| `ava-grandeur.jpg` | Company profile p.11 |
| `r-*.jpg` (10 residences) | Company profile pp.18–22 |

**Visual QA result (all images reviewed):**
- **Good (clean, no baked text, no matte):** `ava-hero`, `ava-residences`, `ava-community`, `ava-grandeur`, `ceo`, `logo-bkb`, `bk-construction`, `map-location`, `masterplan`, all four `floor-*`, `payment-plan-page`, `p-mediterranean`, `p-georgian`, `p-forces-boys`, `p-sector-shops`, `p-sangral-stables`, `r-general-69`, `r-general-701`, `r-legends-17`, `r-legends-171`, `r-legends-79`, `r-legends-295`.
- **Usable but with a thin matte/edge bar** (source photos sit inside a designed card on the page): `p-forces-girls`, `p-blue-square`, `p-dha-works`, `r-general-238`, `r-general-1213`, `r-legends-170`, `r-legends-18`.
- **Known duplicates in source:** `r-legends-170` ≈ mirrored `r-legends-171`; `r-legends-17` ≈ `r-legends-18`. Both variants are kept for gallery variety.

> **Recommendation.** The company-profile project/residence images originate from low-resolution (~1152×650) full-page screenshots, so even after re-cropping they are soft. For a fully premium finish, replace the `p-*.jpg` and `r-*.jpg` files with the original high-resolution photographs/renders if available (keep the same file names), and supply the transparent **PNG/SVG logo** files.


## 7. Important notes

- **Payment-plan sizes.** The page displays the sizes printed in the **official AVA catalogue** (OCR of the PDF): Ground 2 BHK **1,000 SFT**, 1st Floor 2 BHK **950 SFT**, 2nd Floor 1 BHK (Executive) **550 SFT**, 2nd Floor 1 BHK **450 SFT** — all “gross & approx”. The original catalogue table image (`payment-plan-page.jpg`) is included for reference. *If your approved price list differs, update the four rows in the payment table on `arabian-villa.html`.*
- **Forms send email via Google SMTP.** Each form POSTs JSON to `/api/send` (a Vercel serverless function) which builds a branded HTML summary of the submission and emails it to `binkamalbuilders@gmail.com` (the submitter's address is set as `Reply-To`). Configure the `GMAIL_USER` / `GMAIL_APP_PASSWORD` environment variables (see §10) — without them the endpoint returns a friendly error and nothing is sent. A hidden `_gotcha` honeypot field filters basic bots.
- **Placeholder domain.** Canonical/Open Graph URLs and `sitemap.xml` use `https://www.binkamalbuilders.com/`. Replace with the live domain before launch.
- **Map embed.** The contact page embeds a Google Map query for the verified Gulberg III head-office address.
- **Social links.** The two client-supplied Facebook URLs are linked in the contact page and homepage JSON-LD. Add Instagram / LinkedIn / TikTok URLs once the active accounts are confirmed.
- **Legacy AVA sales line removed.** The old Arabian Villa catalogue sales line (`03-111-654-444` / `info@arabianvillaapartments.com`) was replaced site-wide with the official BKB number/email. If AVA has its own dedicated sales line, re-add it on `arabian-villa.html`.
- **Data conflict — Sector Shops area.** The BKB profile states **11,500 sq ft**; the DevPro profile states **10,500 sq ft**. The site currently shows **11,500 sq ft**. Confirm the correct figure.
- **DevPro is presented as a subsidiary** of Bin Kamal Builders; BKB Holdings projects are shown **separately** from delivered construction works.

## 8. Quality checks (already run)

- All 9 pages pass **Lighthouse 100 / 100 / 100** (Accessibility, Best Practices, SEO).
- No console errors; all internal links and assets resolve (44 unique assets checked); all images load.
- Floor-plan tabs, lightbox, mobile menu, brochure lead-gate and form success states verified in-browser.
- **Mobile-responsive QA (360 / 390 / 768 px):** the hamburger menu opens/closes correctly on every page; no horizontal overflow after the reveal animations settle. Fixed a Bootstrap `g-5` gutter overflow (container padding now matches the largest gutter on screens ≤1040 px) and two containers whose inline `padding: … 0` was zeroing horizontal padding.

## 9. Launch checklist

1. Replace the placeholder domain in canonical/OG tags and `sitemap.xml`.
2. Supply the transparent **PNG/SVG logo** and swap `logo-bkb.jpg` (and `favicon`).
3. Set the `GMAIL_USER` / `GMAIL_APP_PASSWORD` environment variables in Vercel (see §10) so the enquiry / partner / brochure forms can send email.
4. Optionally replace the low-resolution `p-*.jpg` / `r-*.jpg` crops with original high-res photos.
5. Confirm the Sector Shops area (11,500 vs 10,500 sq ft) and whether AVA needs its own sales line.

## 8b. Vendored assets (self-contained layout)

Bootstrap **5.3.3** is now bundled locally in `assets/vendor/` (`bootstrap.min.css`, `bootstrap.bundle.min.js`) and all 9 pages reference these local files instead of the jsDelivr CDN. This guarantees the grid, `.container` and `.row`/`.col-*` classes — and therefore mobile responsiveness — work even when the CDN is slow, blocked or the page is opened offline / from `file://`.

> Google Fonts (Cormorant Garamond + Inter) are still loaded from `fonts.googleapis.com`. They do **not** affect layout (system serif/sans fallbacks apply if they fail). If you want the site 100% offline, the fonts can be self-hosted in `assets/vendor/fonts/` the same way.

## 9. Housekeeping

The project root contains source/working files used to build the site: the two original PDFs, `_assets_*`, `_ocr_*`, `_rendered_*` folders, `_*_positions.txt`, and helper scripts (`_*.ps1`). These are **not** part of the website and can be archived or deleted once the site is approved. Keep `_gen_assets2.ps1` (the current crop pipeline) if you want to regenerate imagery.

## 10. Forms → Google SMTP (Vercel serverless function)

The site is fully static, so the contact forms are handled by one small **Vercel Serverless Function** that relays every submission by email through **Google (Gmail) SMTP**.

### How it fits together

| File | Purpose |
|------|---------|
| `api/send.js` | The Vercel function. `POST /api/send` → validates the payload and sends the email. |
| `lib/mailer.js` | Shared logic: field validation, the branded HTML email template, and the nodemailer/Gmail transport. Also used by the dev server. |
| `dev-server.js` | Local development server that serves the site **and** handles `/api/send`, so forms can be tested on your own machine. |
| `tools/test-mail.js` | Generates `tools/email-preview.html` and can send a real test email. |
| `.env.example` | Template for the local `.env` (which is git-ignored). |
| `vercel.json` | Adds long-lived caching for `/assets/*`. |

Every form is identified by its `data-form="…"` attribute, and every input by its `name`, so the email lists each field with a friendly label, in order, as a table. The submitter's email is set as **Reply-To**, so you can just hit *Reply* in Gmail.

### 1. Create a Google App Password (required)

A normal Gmail password will **not** work. You need a 16-character **App Password**:

1. Sign in to `binkamalbuilders@gmail.com`.
2. Go to **Google Account → Security** and turn on **2-Step Verification** (App Passwords require it).
3. Go to **Security → 2-Step Verification → App passwords**.
4. Create a new app password (name it e.g. “BKB Website”) and copy the 16 characters (shown as `xxxx xxxx xxxx xxxx`).
5. Use it **without spaces** as `GMAIL_APP_PASSWORD`.

> If Gmail replies `535-5.7.8 Username and Password not accepted`, the app password is wrong/revoked or 2-Step Verification is off — generate a new one.

### 2. Test locally (optional)

```powershell
cd C:\Users\HP\Desktop\BKB\website
npm install
Copy-Item .env.example .env      # then edit .env and paste the app password
npm run dev                      # → http://localhost:8788
```

Open the site, submit any form, and (optionally) send a standalone test email:

```powershell
node tools/test-mail.js --send
```

### 3. Deploy on Vercel

1. **vercel.com → Add New → Project → Import Git Repository** and pick your **`bkb-website`** repository.
2. Framework Preset: **Other**. Build Command: *(leave empty)*. Output Directory: *(leave empty / `./`)*. Install Command: default (`npm install`).
3. **Settings → Environment Variables** — add for *Production* (and *Preview*):
   - `GMAIL_USER` = `binkamalbuilders@gmail.com`
   - `GMAIL_APP_PASSWORD` = the 16-character app password
   - `MAIL_TO` = `binkamalbuilders@gmail.com` *(optional; defaults to `GMAIL_USER`)*
4. **Deploy**, then submit a live form to confirm the email arrives.

> Vercel blocks outbound **port 25** but allows ports **465** (used here) and **587**, so Gmail SMTP works from the function.

### 4. Security

- **Never commit the app password.** It lives only in `.env` (git-ignored) locally and in Vercel's encrypted environment variables. The repository can be private *or* public — the password is never stored in the code.
- To rotate the password, create a new app password in Google, update it in Vercel, and redeploy.
