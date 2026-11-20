# OneClicq fix plan — status (9 Nov 2026)

Backup of the site before these changes: `../OneClicq-backup-2026-11-09/`

## How the site works now
- **Edit `tools/site.config.js`** for domain, email, phone, address, hours, company numbers, menu, footer, socials and every page's title/description.
- **Run `node tools/build.js`** after any edit. It rewrites each page's `<head>`, header, footer, breadcrumb, schema, numbers, `robots.txt` and `sitemap.xml`. Safe to run repeatedly.
- **Blog:** edit or add articles in `tools/blog-content.js`, then `node tools/blog.js && node tools/build.js`.
- **Run `node tools/audit.js`** to re-check all pages. **`node tools/serve.js`** previews at http://localhost:8080 (no PHP locally).
- Upload everything except `tools/`, `FIX-STATUS.md` and `.claude/` to `public_html`.

## Status by issue
| ID | Status | What was done / what is left |
|---|---|---|
| C1 | Done – **test live** | Careers form: every field named + labelled, posts to `careers-apply.php` (validation, PDF/DOC/DOCX ≤5 MB, stored outside `public_html`, emailed to HR, success/error message). |
| C2 | Done – **Search Console** | All canonicals, `og:url`, `og:image`, schema use `https://oneclicq.in`. `.htaccess` 301s `oneclicq.com` → `.in`. Verify `.in` in Search Console and request indexing. |
| C3 | Done – **confirm figures** | Home/About/Case Studies read from `stats` in config (50+ projects, 20+ specialists, 10+ industries, 5+ years). Removed 98% satisfaction and 40% efficiency. Confirm these against records. |
| C4 | Done | Fake chat bot removed. Replaced by a "Talk to OneClicq" panel: call, WhatsApp, email, contact form. No reply-time promises. |
| H1 | Done – **confirm** | One email (`hello@oneclicq.in`) and one set of hours (Mon–Fri 9:00–18:00 IST) everywhere. Check the mailbox exists and the hours are right. |
| H2 | Done | Every canonical points to its own URL (audit checks this). |
| H3 | Done | Home/logo links go to `/`; `oneclicq-home.html` deleted; `.htaccess` redirects www, `/index.html`, `/oneclicq-home.html`. |
| H4 | Done – **submit** | `robots.txt` + `sitemap.xml` (32 URLs). Submit in Search Console and Bing Webmaster Tools. |
| H5 | Done | One font link (Montserrat + JetBrains Mono) on all pages; Inter/Space Grotesk removed. |
| H6 | Done – **socials** | No `href="#"` left. View Product → "Request a demo of X" (pre-fills the contact form). Social icons hidden until real URLs are added to `socials` in config. |
| H7 | Done – **review articles** | Blog at `/blog/` with 6 articles (generative AI, cloud migration, software that lasts, legacy modernisation, automation, tech stack). Footer links to it; each article has BlogPosting schema and links to related services. Edit text in `tools/blog-content.js`, then run `node tools/blog.js && node tools/build.js`. Old broken links redirected; branded `404.html`. |
| H8 | Done – **needs client confirmations** | Testimonials and case-study results now live in `tools/site.config.js` (`testimonials`, `caseResults`) and only appear when `verified: true`. All start unverified, so the 3 testimonials and 16 result figures are off the site until confirmed. Verified testimonials show name, role, company, photo, logo and LinkedIn link (no star ratings). Still to do: replace product mock-ups with real screenshots (StayFlow image says HotelManager/HotelBook). |
| H9 | Done – **test** | 1200×630 share image (`assets/img/og.png`) + full OG/Twitter tags, unique per page. Test with LinkedIn Post Inspector / Facebook Sharing Debugger. |
| H10 | Done – **test live** | `sendmail.php` written (honeypot, timing check, validation, rate limit 3/10 min, optional Turnstile). Debug `console.log` removed. **Note:** this replaces the server's existing `sendmail.php` — keep a copy of the old one. |
| M1 | Done | ProfessionalService (address, phone, hours) on home; BreadcrumbList on inner pages; Service on service/solution pages; FAQPage on FAQ. Validate in Rich Results Test. |
| M2 | Done | Unique titles (≤60 chars) and descriptions (120–160 chars) with service + location. |
| M3 | Done (partly) | More content on Contact, Products, Industries, Technologies. The two e-commerce pages now have different headlines and purposes and link to each other. |
| M4 | Done | Header and footer are real HTML in every page; `main.js` only adds behaviour. |
| M5 | **Hosting** | Check Hostinger bot protection and Search Console crawl stats. `robots.txt` allows AI crawlers (lines to block them are included, commented). |
| M6 | Done | Grey text `#7a7a7a` → `#6a6a6a`; no text under 12px. |
| M7 | Done | `<main id="main">` + skip link on all pages; no heading-level jumps; all form controls labelled. |
| M8 | Done | Duplicate chat widgets and old menus removed from Careers/Technologies; Resources removed. |
| M9 | Done | Full menu shows down to 1100px (checked at 1280px). |
| M10 | Done | Map no longer inverted and now shows the Greater Noida office; breadcrumb is Home › Page; smaller floating button + bottom space on phones. |
| M11 | Mostly done | Hero shows instantly (no fade-in), images lazy-load below the fold with width/height, unused Bootstrap JS and particle animation removed, scripts deferred. The 12 Unsplash photos are now hosted in `assets/img/stock/` as WebP (700px + 1200px with `srcset`). Still to do: convert the site's own JPGs in `assets/img/` to WebP. |
| M12 | Done – **legal review** | Security headers in `.htaccess` (CSP in report-only first). Cookie and Privacy policies now match reality (no analytics). New `terms.html` — have a lawyer review it. No analytics installed (needs an account/ID and a consent decision). |
| L1 | Done | "OneClicq" everywhere. |
| L2–L3 | Done | Old chat code removed with C4. |
| L4 | Done | Indian names, companies and +91 phone formats in forms. |
| L5 | Done | Dead code removed, one asset version (`v=6`), `favicon.ico` added. |
| L6 | Done | Home page cut from 15 to 12 sections (Digital Transformation, Technologies, Blog removed). |
| L7 | Done | Timeline shows 2021, 2022, 2024, 2026. |

## Hosting notes (checked 9 Nov 2026)
- **oneclicq.algointellia.com** runs on **Microsoft IIS**, which ignores `.htaccess`. Upload `web.config` there: it adds the six security headers, serves `.webp` images (they returned 404), shows the branded 404 page and hides `tools/`, `includes/` and `.md` files. The redirect rules at the bottom of `web.config` are commented out because they need the IIS URL Rewrite module; uncomment them if the host has it.
- On that server `sendmail.php` and `careers-apply.php` return 404: either they were not uploaded or PHP is not enabled. Ask the host. The forms cannot send without PHP.
- Delete `oneclicq-home.html` and `resources.html` from that server (still online).
- **oneclicq.in** (Hostinger) still serves the old site: `.com` canonicals, no robots.txt or sitemap, no security headers. Hostinger runs Apache/LiteSpeed, so it needs `.htaccess` (removed from this folder; restore it from the backup or this session if you deploy there).

## Before going live
1. Back up the live site (including the current `sendmail.php`).
2. Create `no-reply@oneclicq.in` in Hostinger (sender for form emails) — or change `mail_from` in `includes/config.php`.
3. Upload, then send one real contact enquiry and one real job application with a resume; confirm both arrive.
4. Check `https://oneclicq.com/about.html` redirects to `https://oneclicq.in/about.html`.
5. Run PageSpeed Insights on Home, Contact and one service page; test on Android, iPhone and a 1280px laptop.
