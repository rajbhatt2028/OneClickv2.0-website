#!/usr/bin/env node
/* ============================================================
   OneClicq — static site build
   Usage:  node tools/build.js
   Safe to run repeatedly. For every page it:
     • rewrites the <head> SEO block (title, description, canonical,
       Open Graph, Twitter, font, CSS, favicon, JSON-LD schema)
     • writes the header + footer as real HTML (crawlable, no JS needed)
     • wraps content in <main id="main"> and adds a skip link
     • rebuilds the breadcrumb as Home > … > Page
     • fills company numbers from site.config.js (data-stat="…")
     • adds lazy-loading + width/height to images
     • regenerates robots.txt and sitemap.xml
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const C = require("./site.config.js");
const V = C.assetVersion;

const esc = (s) => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const url = (p) => C.domain + "/" + p.replace(/(^|\/)index\.html$/, "$1");

/* ---------- helpers ---------- */
function listPages() {
  const out = [];
  for (const dir of ["", "services", "solutions", "case-studies", "blog"]) {
    for (const f of fs.readdirSync(path.join(ROOT, dir))) {
      if (f.endsWith(".html")) out.push(dir ? dir + "/" + f : f);
    }
  }
  return out;
}

function imageSize(file) {
  try {
    const b = fs.readFileSync(file);
    if (b[0] === 0x89 && b[1] === 0x50) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
    if (b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i < b.length) {
        if (b[i] !== 0xff) { i++; continue; }
        const m = b[i + 1];
        if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
        i += 2 + b.readUInt16BE(i + 2);
      }
    }
  } catch (e) { /* ignore */ }
  return null;
}

/* ---------- shared fragments ---------- */
function headerHTML(page, P) {
  const slug = page.split("/").pop();
  const inServices = page.startsWith("services/");
  const inSolutions = page.startsWith("solutions/");
  const inCases = page.startsWith("case-studies/");
  const isActive = (href) => (href === "/" && page === "index.html") || (href === slug && !page.includes("/")) || (href === "services.html" && inServices) || (href === "solutions.html" && inSolutions) || (href === "case-studies.html" && inCases);
  const link = (href) => (href === "/" ? "/" : P + href); // "/" is the site root on every page

  const mega =
    '<div class="mega">' +
    '<div class="mega-grid">' +
    C.mega.map((c) => '<div class="mega-col"><p class="mega-h">' + esc(c.h) + "</p>" +
      c.items.map((it) => '<a href="' + P + it[1] + '">' + esc(it[0]) + "</a>").join("") + "</div>").join("") +
    "</div>" +
    '<div class="mega-foot"><span>Not sure where to start? We\'ll map the right path for your business.</span>' +
    '<a class="btn btn-aurora" href="' + P + 'contact.html">Let\'s Talk <i class="bi bi-arrow-right" aria-hidden="true"></i></a></div>' +
    "</div>";

  const menu = C.nav.map((n) => {
    const cur = isActive(n[1]);
    const a = cur ? ' aria-current="page"' : "";
    if (n[2]) {
      return '<li class="mega-wrap' + (cur ? " active" : "") + '"><a href="' + link(n[1]) + '"' + a + ">" + n[0] +
        ' <i class="bi bi-chevron-down caret" aria-hidden="true"></i></a>' + mega + "</li>";
    }
    return "<li" + (cur ? ' class="active"' : "") + '><a href="' + link(n[1]) + '"' + a + ">" + n[0] + "</a></li>";
  }).join("");

  const mob = C.nav.map((n) => {
    if (n[2]) {
      const subs = C.mega.map((c) => c.items.map((it) => '<a href="' + P + it[1] + '">' + esc(it[0]) + "</a>").join("")).join("");
      return '<div class="m-item"><button type="button" class="m-link" aria-expanded="false">Services <i class="bi bi-chevron-right chev" aria-hidden="true"></i></button>' +
        '<div class="m-sub"><a href="' + P + 'services.html"><b>All Services</b></a>' + subs + "</div></div>";
    }
    return '<div class="m-item"><a class="m-link" href="' + link(n[1]) + '"' + (isActive(n[1]) ? ' aria-current="page"' : "") + ">" + n[0] + "</a></div>";
  }).join("");

  return (
    '<a class="skip-link" href="#main">Skip to content</a>\n' +
    '<div id="site-header">' +
    '<nav class="q-nav" id="qNav" aria-label="Primary"><div class="container">' +
    '<a class="q-logo" href="/" aria-label="' + C.brand + ' home"><img src="' + P + 'assets/img/logo.svg" alt="' + C.brand + '" class="q-logo-img" width="180" height="34"></a>' +
    '<ul class="q-menu">' + menu + "</ul>" +
    '<div class="q-actions">' +
    '<a class="btn btn-aurora" href="' + P + 'contact.html">Let\'s Talk <i class="bi bi-arrow-right" aria-hidden="true"></i></a></div>' +
    '<button type="button" class="q-burger" id="qBurger" aria-label="Open menu" aria-expanded="false" aria-controls="qMobile"><i class="bi bi-list" aria-hidden="true"></i></button>' +
    "</div></nav>" +
    '<div class="q-mobile" id="qMobile" aria-hidden="true">' + mob +
    '<div class="m-cta">' +
    '<a class="btn btn-aurora" href="' + P + 'contact.html">Let\'s Talk <i class="bi bi-arrow-right" aria-hidden="true"></i></a></div>' +
    "</div></div>\n"
  );
}

function footerHTML(P) {
  const a = C.contact.address;
  const socials = C.socials.length
    ? '<div class="socials">' + C.socials.map((s) => s[1]
      ? '<a href="' + s[1] + '" target="_blank" rel="noopener" aria-label="' + s[0] + '"><i class="bi ' + s[2] + '" aria-hidden="true"></i></a>'
      : '<a aria-label="' + s[0] + ' (coming soon)" title="' + s[0] + ' – coming soon"><i class="bi ' + s[2] + '" aria-hidden="true"></i></a>').join("") + "</div>"
    : "";
  return (
    '<footer class="q-foot" id="site-footer"><div class="container"><div class="row g-4 g-lg-5">' +
    '<div class="col-lg-4 col-md-6">' +
    '<a class="q-logo mb-3" href="/"><img src="' + P + 'assets/img/logo-1.svg" alt="' + C.brand + '" class="q-logo-img" width="180" height="34" loading="lazy"></a>' +
    '<p class="brand-line">We design, build and support custom software, web and mobile apps, AI and cloud solutions for growing businesses.</p>' +
    '<address class="foot-contact">' +
    '<span><i class="bi bi-geo-alt" aria-hidden="true"></i> ' + esc(a.street) + ", " + esc(a.locality) + ", " + esc(a.region) + " " + a.postalCode + "</span>" +
    '<a href="tel:' + C.contact.phone + '"><i class="bi bi-telephone" aria-hidden="true"></i> ' + C.contact.phoneDisplay + "</a>" +
    '<a href="mailto:' + C.contact.email + '"><i class="bi bi-envelope" aria-hidden="true"></i> ' + C.contact.email + "</a>" +
    "</address>" + socials +
    "</div>" +
    C.footCols.map((c) => '<div class="col-lg-2 col-md-3 col-6"><p class="foot-h">' + c[0] + "</p>" +
      c[1].map((l) => '<a href="' + P + l[1] + '">' + esc(l[0]) + "</a>").join("") + "</div>").join("") +
    "</div>" +
    '<div class="foot-bottom"><small>© ' + new Date().getFullYear() + " " + C.brand + ". All rights reserved.</small>" +
    '<div class="flinks"><a href="' + P + 'privacy-policy.html">Privacy Policy</a><a href="' + P + 'cookie-policy.html">Cookie Policy</a></div>' +
    "</div></div></footer>\n"
  );
}

function breadcrumbHTML(meta, P) {
  if (!meta.crumb) return "";
  const sep = ' <span class="crumb-sep" aria-hidden="true">/</span> ';
  let h = '<nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a>' + sep;
  if (meta.parent) h += '<a href="' + P + meta.parent[1] + '">' + esc(meta.parent[0]) + "</a>" + sep;
  return h + '<span aria-current="page">' + esc(meta.crumb) + "</span></nav>";
}

function orgSchema() {
  const a = C.contact.address;
  return {
    "@type": "ProfessionalService",
    "@id": C.domain + "/#organization",
    name: C.brand,
    url: C.domain + "/",
    logo: { "@type": "ImageObject", url: C.domain + "/assets/img/favicon.png", width: 512, height: 512 }, // Google needs a raster logo
    image: C.domain + C.ogImage,
    description: "Custom software, web and mobile app, AI and cloud development company in Greater Noida, serving businesses across India.",
    email: C.contact.email,
    telephone: C.contact.phone,
    contactPoint: [{ "@type": "ContactPoint", contactType: "sales", telephone: C.contact.phone, email: C.contact.email, areaServed: "IN", availableLanguage: ["English"] }],
    priceRange: "₹₹",
    address: { "@type": "PostalAddress", streetAddress: a.street, addressLocality: a.locality, addressRegion: a.region, postalCode: a.postalCode, addressCountry: a.country },
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: C.contact.hoursSchema.days, opens: C.contact.hoursSchema.opens, closes: C.contact.hoursSchema.closes }],
    areaServed: "IN",
    sameAs: C.socials.filter((s) => s[1]).map((s) => s[1])
  };
}

function stripTags(s) { return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); }

function schemaFor(page, meta, html) {
  const graph = [];
  if (page === "index.html") {
    graph.push(orgSchema());
    graph.push({ "@type": "WebSite", "@id": C.domain + "/#website", url: C.domain + "/", name: C.brand, publisher: { "@id": C.domain + "/#organization" } });
  }
  if (meta.crumb && !meta.noindex) {
    const items = [{ name: "Home", item: C.domain + "/" }];
    if (meta.parent) items.push({ name: meta.parent[0], item: url(meta.parent[1]) });
    items.push({ name: meta.crumb, item: url(page) });
    graph.push({ "@type": "BreadcrumbList", itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.item })) });
  }
  if (meta.type === "service") {
    graph.push({ "@type": "Service", name: meta.crumb, description: meta.description, url: url(page), serviceType: meta.crumb, provider: { "@type": "ProfessionalService", "@id": C.domain + "/#organization", name: C.brand, url: C.domain + "/" }, areaServed: { "@type": "Country", name: "India" } });
  }
  if (meta.type === "article") {
    graph.push({ "@type": "BlogPosting", headline: meta.h1 || meta.crumb, description: meta.description, url: url(page), mainEntityOfPage: url(page),
      datePublished: meta.date, dateModified: meta.date, inLanguage: "en-IN",
      image: meta.image ? C.domain + "/" + meta.image : C.domain + C.ogImage,
      author: { "@type": "Organization", name: C.brand + " team", url: C.domain + "/" },
      publisher: { "@type": "Organization", name: C.brand, logo: { "@type": "ImageObject", url: C.domain + "/assets/img/logo.svg" } } });
  }
  if (meta.type === "blog") {
    graph.push({ "@type": "Blog", name: C.brand + " Blog", url: url(page), publisher: { "@type": "Organization", name: C.brand, url: C.domain + "/" } });
  }
  if (meta.faqSchema) {
    const qa = [];
    const re = /data-question="([^"]+)"[\s\S]*?class="faq-answer-content"[^>]*>([\s\S]*?)<\/div>/g;
    let m;
    while ((m = re.exec(html))) qa.push({ "@type": "Question", name: m[1].replace(/OneClicQ/g, C.brand), acceptedAnswer: { "@type": "Answer", text: stripTags(m[2]).replace(/OneClicQ/g, C.brand) } });
    if (qa.length) graph.push({ "@type": "FAQPage", mainEntity: qa });
  }
  if (!graph.length) return "";
  return '<script type="application/ld+json">\n' + JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2).replace(/</g, "\\u003c") + "\n</script>\n";
}

function headHTML(page, meta, P, html) {
  const u = url(page);
  return (
    "<!-- seo:start (generated by tools/build.js — edit tools/site.config.js) -->\n" +
    '<meta charset="UTF-8">\n' +
    '<script>document.documentElement.classList.add("js")</script>\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    "<title>" + esc(meta.title) + "</title>\n" +
    '<meta name="description" content="' + esc(meta.description) + '">\n' +
    (meta.noindex ? '<meta name="robots" content="noindex, follow">\n'
      : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">\n<link rel="canonical" href="' + u + '">\n') +
    '<meta name="theme-color" content="' + C.themeColor + '">\n' +
    (meta.type === "article"
      ? '<meta property="og:type" content="article">\n<meta property="article:published_time" content="' + meta.date + '">\n<meta property="article:author" content="' + C.brand + '">\n'
      : '<meta property="og:type" content="website">\n') +
    '<meta property="og:site_name" content="' + C.brand + '">\n' +
    '<meta property="og:locale" content="en_IN">\n' +
    '<meta property="og:title" content="' + esc(meta.title) + '">\n' +
    '<meta property="og:description" content="' + esc(meta.description) + '">\n' +
    '<meta property="og:url" content="' + u + '">\n' +
    '<meta property="og:image" content="' + C.domain + C.ogImage + '">\n' +
    '<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n' +
    '<meta property="og:image:alt" content="' + C.brand + ' – software, app and AI development company">\n' +
    '<meta name="twitter:card" content="summary_large_image">\n' +
    '<meta name="twitter:title" content="' + esc(meta.title) + '">\n' +
    '<meta name="twitter:description" content="' + esc(meta.description) + '">\n' +
    '<meta name="twitter:image" content="' + C.domain + C.ogImage + '">\n' +
    '<link rel="icon" href="/favicon.ico" sizes="any">\n' +
    '<link rel="icon" type="image/png" href="' + P + 'assets/img/favicon.png">\n' +
    '<link rel="apple-touch-icon" href="' + P + 'assets/img/favicon.png">\n' +
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
    '<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>\n' +
    '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet">\n' +
    '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">\n' +
    '<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">\n' +
    '<link href="' + P + "assets/css/main.css?v=" + V + '" rel="stylesheet">\n' +
    schemaFor(page, meta, html) +
    "<!-- seo:end -->\n"
  );
}

/* ---------- page transform ---------- */
function build(page) {
  const file = path.join(ROOT, page);
  let html = fs.readFileSync(file, "utf8").replace(/^﻿/, "");
  const meta = C.pages[page];
  if (!meta) { console.warn("  ! no config for " + page + " — skipped"); return; }
  const P = meta.absolute ? "/" : page.includes("/") ? "../" : ""; // 404 is served at any URL, so it uses root paths

  // 1. brand spelling (L1)
  html = html.replace(/OneClicQ/g, C.brand);

  // 2. HEAD
  let hs = html.indexOf("<head");
  let he = html.indexOf("</head>");
  let headOpenEnd = html.indexOf(">", hs) + 1;
  let head = html.slice(headOpenEnd, he);
  head = head
    .replace(/<!-- seo:start[\s\S]*?<!-- seo:end -->\s*/g, "")
    .replace(/<meta\s+charset[^>]*>\s*/gi, "")
    .replace(/<meta\s+name="viewport"[^>]*>\s*/gi, "")
    .replace(/<title>[\s\S]*?<\/title>\s*/gi, "")
    .replace(/<meta\s+name="(description|theme-color|robots)"[^>]*>\s*/gi, "")
    .replace(/<meta\s+(property="og:|name="twitter:)[^>]*>\s*/gi, "")
    .replace(/<link\s+rel="(canonical|preconnect|icon|apple-touch-icon)"[^>]*>\s*/gi, "")
    .replace(/<link[^>]*(fonts\.googleapis|bootstrap|main\.css)[^>]*>\s*/gi, "")
    .replace(/<!--\s*<link[^>]*fonts\.googleapis[\s\S]*?-->\s*/gi, "")
    .replace(/<!--\s*(OneClicq Favicon|Schema|Bootstrap[^>]*|Fonts?[^>]*|Google Fonts[^>]*|Favicon)\s*-->\s*/gi, "")
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, "");
  // careers/technologies carried a stale copy of main.css inline — drop it
  head = head.replace(/<style>\s*:root\{\s*--ink:#FFFFFF[\s\S]*?<\/style>\s*/g, "");
  head = "\n" + headHTML(page, meta, P, html) + head.trim() + "\n";
  html = html.slice(0, headOpenEnd) + head + html.slice(he);

  // 3. HEADER — everything from <body> to the first content block
  let bs = html.indexOf("<body");
  let bodyOpenEnd = html.indexOf(">", bs) + 1;
  let firstBlock = html.slice(bodyOpenEnd).search(/<main id="main">|<section[\s>]|<header class="hero"/);
  if (firstBlock < 0) throw new Error("no content block in " + page);
  let afterHead = html.slice(bodyOpenEnd + firstBlock).replace(/^<main id="main">\s*/, "");
  html = html.slice(0, bodyOpenEnd) + "\n" + headerHTML(page, P) + '<main id="main">\n' + afterHead;

  // remove any other <main> tags (privacy page had one)
  html = html.replace(/(<main id="main">\n)([\s\S]*)$/, (all, open, rest) => open + rest.replace(/<\/?main\b[^>]*>/g, ""));

  // first screen shows immediately: no scroll-reveal animation in the hero (better LCP)
  {
    const i = html.indexOf('<main id="main">');
    const rel = html.slice(i).search(/<\/section>|<\/header>/);
    if (rel > 0) {
      const hero = html.slice(i, i + rel).replace(/class="([^"]*)"/g, (m, cls) => {
        const out = cls.split(/\s+/).filter((c) => !/^(reveal|d[1-4])$/.test(c)).join(" ");
        return out === cls ? m : 'class="' + out + '"';
      });
      html = html.slice(0, i) + hero + html.slice(i + rel);
    }
  }

  // 4. FOOTER — from the footer mount (or an old hardcoded footer) to the end of </body>
  let fStart = html.search(/<!--\s*(Footer[^>]*|=+\s*FOOTER\s*=+)\s*-->\s*<div id="site-footer">|<div id="site-footer"><\/div>|<footer class="q-foot"[\s\S]*?(?=<\/footer>)/);
  if (fStart < 0) throw new Error("no footer mount in " + page);
  // remember page-specific inline scripts after the footer (not bootstrap, main.js or old chat)
  let tail = html.slice(fStart);
  let scripts = [];
  tail.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/g, (m, attrs, body) => {
    if (/bootstrap\.bundle|main\.js/.test(attrs)) return m;
    if (/chatWidget|getElementById\("qNav"\)/.test(body)) return m; // old hardcoded nav/chat logic
    scripts.push(m);
    return m;
  });
  html = html.slice(0, fStart).replace(/\s*$/, "\n") +
    "</main>\n" +
    footerHTML(P) +
    '<script src="' + P + "assets/js/main.js?v=" + V + '" defer></script>\n' +
    (scripts.length ? scripts.join("\n") + "\n" : "") +
    "</body>\n</html>\n";

  // 5. breadcrumb
  const crumb = breadcrumbHTML(meta, P);
  html = html.replace(/<nav\s+class="(?:[a-z]+-)?crumb(?:\s[^"]*)?"[^>]*>[\s\S]*?<\/nav>/, crumb);

  // 5b. no label above the page title: the breadcrumb already names the page
  if (meta.crumb) {
    const i = html.indexOf('<main id="main">');
    const rel = html.slice(i).search(/<\/section>|<\/header>/);
    if (rel > 0) {
      const hero = html.slice(i, i + rel).replace(/\s*<(span|p)\s+class="(?:[a-z]+-)?eyebrow[^"]*">[\s\S]*?<\/\1>/g, "");
      html = html.slice(0, i) + hero + html.slice(i + rel);
    }
  }

  // 5c. remaining section labels in sentence case (brand names and acronyms kept)
  const KEEP = /^(OneClicq|AI|ERP|CRM|SaaS|APIs?|UI|UX|IT|FAQs?)$/i;
  const fixWord = (w) => w.split("-").map((part) => {
    const k = part.match(KEEP);
    return k ? ({ oneclicq: "OneClicq", saas: "SaaS", apis: "APIs", faqs: "FAQs" }[part.toLowerCase()] || part.toUpperCase()) : part.toLowerCase();
  }).join("-");
  html = html.replace(/(<(span|p)\s+class="(?:[a-z]+-)?eyebrow[^"]*"[^>]*>)\s*([^<]+?)\s*(<\/\2>)/g, (m, open, tag, text, close) => {
    // only convert Title Case / ALL CAPS labels; text already in sentence case (with proper nouns) is left alone
    const words = text.split(/\s+/).filter((w) => /^[a-z]/i.test(w));
    if (!words.every((w) => /^[A-Z]/.test(w))) return open + text + close;
    const s = text.split(/\s+/).map(fixWord).join(" ");
    return open + s.charAt(0).toUpperCase() + s.slice(1) + close;
  });

  // 5d. proof (H8): only verified testimonials and case-study results are published
  html = html.replace(/<!-- testimonials:start -->[\s\S]*?<!-- testimonials:end -->/, () => {
    const list = (C.testimonials || []).filter((t) => t.verified);
    if (!list.length) return "<!-- testimonials:start --><!-- testimonials:end -->";
    const initials = (n) => n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const cards = list.map((t, i) =>
      '<div class="col-lg-4 reveal' + (i ? " d" + i : "") + '"><figure class="quote-card">' +
      (t.logo ? '<img class="quote-logo" src="' + P + esc(t.logo) + '" alt="' + esc(t.company) + '" loading="lazy" height="28">' : "") +
      "<blockquote><p>" + esc(t.quote) + "</p></blockquote>" +
      '<figcaption class="who">' +
      (t.photo ? '<img class="av" src="' + P + esc(t.photo) + '" alt="" width="44" height="44" loading="lazy">' : '<span class="av" aria-hidden="true">' + initials(t.name) + "</span>") +
      "<span><b>" + esc(t.name) + "</b><small>" + esc(t.role) + ", " + esc(t.company) + "</small>" +
      (t.linkedin ? '<a class="quote-in" href="' + esc(t.linkedin) + '" target="_blank" rel="noopener">View on LinkedIn <i class="bi bi-linkedin" aria-hidden="true"></i></a>' : "") +
      "</span></figcaption></figure></div>").join("");
    return '<!-- testimonials:start --><section class="section bg-ink"><div class="container">' +
      '<div class="section-head center reveal"><span class="eyebrow center">Testimonials</span><h2 class="h-xl mt-3">What our clients say</h2></div>' +
      '<div class="row g-4 mt-2 justify-content-center">' + cards + "</div></div></section><!-- testimonials:end -->";
  });
  html = html.replace(/<div class="cs-results" data-case="([a-z0-9-]+)">[\s\S]*?<\/div><!-- \/cs-results -->/g, (m, key) => {
    const c = (C.caseResults || {})[key];
    const inner = c && c.verified
      ? c.results.map((r) => '<div><strong>' + esc(r[0]) + "</strong><br>" + esc(r[1]) + "</div>").join("")
      : "";
    return '<div class="cs-results" data-case="' + key + '">' + inner + "</div><!-- /cs-results -->";
  });

  // 6. company numbers (C3) — <x data-stat="projects">…</x>
  html = html.replace(/(<([a-z0-9]+)\b[^>]*\bdata-stat="([a-z]+)"[^>]*>)[^<]*(<\/\2>)/g, (m, open, tag, key, close) => {
    const s = C.stats[key];
    if (!s) return m;
    open = open.replace(/data-count="[^"]*"/, 'data-count="' + s.value + '"').replace(/data-suffix="[^"]*"/, 'data-suffix="' + s.suffix + '"');
    return open + s.value + s.suffix + close;
  });
  html = html.replace(/(<([a-z0-9]+)\b[^>]*\bdata-stat-label="([a-z]+)"[^>]*>)[^<]*(<\/\2>)/g, (m, open, tag, key, close) => C.stats[key] ? open + C.stats[key].label + close : m);
  // any remaining counters should show the real number before JS runs
  html = html.replace(/(<span data-count="(\d+)" data-suffix="([^"]*)">)0(<\/span>)/g, "$1$2$3$4");

  // 7. images: lazy-load below the fold, eager in the hero; width/height for local files
  const heroEnd = (() => { const i = html.indexOf('<main id="main">'); const m = html.slice(i).search(/<\/section>|<\/header>/); return m < 0 ? i : i + m; })();
  html = html.replace(/<img\b[^>]*>/g, (tag, off) => {
    if (/q-logo-img/.test(tag)) return tag;
    let t = tag;
    if (off < heroEnd) {
      t = t.replace(/\sloading="lazy"/, "");
      if (!/fetchpriority=/.test(t)) t = t.replace(/<img\b/, '<img fetchpriority="high"');
    } else if (!/loading=/.test(t)) {
      t = t.replace(/<img\b/, '<img loading="lazy"');
    }
    if (!/decoding=/.test(t)) t = t.replace(/<img\b/, '<img decoding="async"');
    if (!/\swidth=/.test(t)) {
      const src = (t.match(/src="([^"]+)"/) || [])[1];
      if (src && !/^https?:/.test(src)) {
        const dim = imageSize(path.join(path.dirname(file), src.split("?")[0]));
        if (dim) t = t.replace(/<img\b/, '<img width="' + dim.w + '" height="' + dim.h + '"');
      }
    }
    return t;
  });

  // 8. tidy: links to the old home duplicates, stray blank lines
  html = html.replace(/href="(\.\.\/)?(index|oneclicq-home)\.html"/g, 'href="/"');
  html = html.replace(/\n{3,}/g, "\n\n");

  fs.writeFileSync(file, html);
  return meta;
}

/* ---------- run ---------- */
const pages = listPages();
const built = [];
for (const p of pages) {
  const meta = build(p);
  if (meta) built.push([p, meta]);
  console.log("  ✓ " + p);
}

// robots.txt
fs.writeFileSync(path.join(ROOT, "robots.txt"),
  "# robots.txt for " + C.domain + "\n" +
  "User-agent: *\nAllow: /\nDisallow: /tools/\nDisallow: /includes/\n\n" +
  "# AI crawlers: allowed. To opt out, uncomment the lines below.\n" +
  "# User-agent: GPTBot\n# Disallow: /\n# User-agent: Google-Extended\n# Disallow: /\n\n" +
  "Sitemap: " + C.domain + "/sitemap.xml\n");

// sitemap.xml
const today = new Date().toISOString().slice(0, 10);
const entries = built.filter(([, m]) => !m.noindex)
  .sort((a, b) => (a[0] === "index.html" ? -1 : b[0] === "index.html" ? 1 : a[0].localeCompare(b[0])))
  .map(([p, m]) => "  <url><loc>" + url(p) + "</loc><lastmod>" + today + "</lastmod><priority>" + (m.priority || (p.includes("/") ? "0.7" : "0.8")) + "</priority></url>");
fs.writeFileSync(path.join(ROOT, "sitemap.xml"),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + entries.join("\n") + "\n</urlset>\n");

console.log("\nBuilt " + built.length + " pages, robots.txt and sitemap.xml (" + entries.length + " URLs).");
