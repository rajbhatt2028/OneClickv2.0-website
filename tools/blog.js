#!/usr/bin/env node
/* Generates blog/index.html and one page per article from tools/blog-content.js.
   Usage:  node tools/blog.js && node tools/build.js
   (build.js then adds the header, footer, SEO tags and schema.) */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const posts = require("./blog-content.js");
const OUT = path.join(ROOT, "blog");
fs.mkdirSync(OUT, { recursive: true });

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fmtDate = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
const img = (p, prefix, cls, lazy) =>
  '<img src="' + prefix + "assets/img/stock/" + p.img + '-1200.webp" srcset="' + prefix + "assets/img/stock/" + p.img + "-700.webp 700w, " +
  prefix + "assets/img/stock/" + p.img + '-1200.webp 1200w" sizes="(max-width: 991px) 100vw, 760px" width="' + p.w + '" height="' + p.h + '"' +
  (lazy ? ' loading="lazy"' : ' loading="eager" fetchpriority="high"') + ' alt="' + esc(p.alt) + '"' + (cls ? ' class="' + cls + '"' : "") + ">";

const page = (body) => "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n</head>\n<body>\n  <div id=\"site-header\"></div>\n\n" + body + "\n\n  <div id=\"site-footer\"></div>\n</body>\n</html>\n";

const card = (p, h) =>
  '<div class="col-md-6 col-lg-4 reveal"><a class="blog-card" href="' + p.slug + '.html">' +
  img(p, "../", "blog-card-img", true) +
  '<span class="blog-card-body"><span class="tech-chip">' + esc(p.tag) + "</span>" +
  "<" + h + ' class="blog-card-title">' + esc(p.title) + "</" + h + ">" +
  '<span class="blog-card-summary">' + esc(p.summary) + "</span>" +
  '<span class="blog-card-meta">' + fmtDate(p.date) + " · " + p.read + " min read</span></span></a></div>";

/* ---- index ---- */
fs.writeFileSync(path.join(OUT, "index.html"), page(
`  <section class="page-hero bg-ink">
    <div class="container">
      <nav class="crumb" aria-label="Breadcrumb"></nav>
      <div class="col-lg-8">
        <h1 class="display-hero mt-3" style="font-size:clamp(2.3rem,4.8vw,3.8rem)">Insights from the <span class="grad-text">OneClicq team</span></h1>
        <p class="lead-txt mt-4" style="max-width:640px;">Practical guides on AI, cloud, automation and building software that lasts, written by the people who do the work.</p>
      </div>
    </div>
  </section>

  <section class="section bg-ink-2" style="border-top:1px solid var(--hairline);">
    <div class="container">
      <h2 class="visually-hidden">Latest articles</h2>
      <div class="row g-4">
        ${posts.map((p) => card(p, "h3")).join("\n        ")}
      </div>
    </div>
  </section>

  <section class="section bg-ink">
    <div class="container text-center reveal">
      <h2 class="h-xl">Have a project in mind?</h2>
      <p class="lead-txt mt-3 mx-auto" style="max-width:560px;">Tell us what you're building. We'll reply within one business day with practical next steps.</p>
      <a class="btn btn-aurora btn-lg mt-4" href="../contact.html">Start a conversation <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
    </div>
  </section>`));

/* ---- articles ---- */
posts.forEach((p, i) => {
  // rotate so each article suggests different neighbours
  const more = posts.slice(i + 1).concat(posts.slice(0, i)).slice(0, 3);
  fs.writeFileSync(path.join(OUT, p.slug + ".html"), page(
`  <section class="page-hero bg-ink article-hero">
    <div class="container">
      <div class="article-wrap">
        <nav class="crumb" aria-label="Breadcrumb"></nav>
        <h1 class="display-hero mt-3 article-title">${esc(p.title)}</h1>
        <p class="article-meta"><span class="tech-chip">${esc(p.tag)}</span><span>By the OneClicq team</span><span><time datetime="${p.date}">${fmtDate(p.date)}</time></span><span>${p.read} min read</span></p>
      </div>
    </div>
  </section>

  <section class="section bg-ink-2 article-section" style="border-top:1px solid var(--hairline);">
    <div class="container">
      <article class="article-wrap article-body">
        <figure class="article-figure">${img(p, "../", "", false)}</figure>
${p.body.trim().split("\n").map((l) => "        " + l).join("\n")}

        <aside class="article-cta" aria-label="Work with OneClicq">
          <p class="article-cta-title">Want help with this?</p>
          <p>Our team in Greater Noida helps businesses across India plan and build this kind of work. Related services:</p>
          <p class="article-cta-links">${p.related.map((r) => '<a href="' + r[1] + '">' + esc(r[0]) + "</a>").join("")}</p>
          <a class="btn btn-aurora" href="../contact.html">Talk to our team <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
        </aside>
      </article>
    </div>
  </section>

  <section class="section bg-ink">
    <div class="container">
      <div class="d-flex flex-wrap justify-content-between align-items-end gap-3">
        <h2 class="h-lg mb-0">More from the blog</h2>
        <a class="link-arrow" href="./">All articles <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
      </div>
      <div class="row g-4 mt-2">
        ${more.map((x) => card(x, "h3")).join("\n        ")}
      </div>
    </div>
  </section>`));
});

console.log("Wrote blog/index.html and " + posts.length + " articles.");
