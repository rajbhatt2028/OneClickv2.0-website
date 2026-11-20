#!/usr/bin/env node
/* Quick site audit: node tools/audit.js
   Checks every page for the issues in the Nov 2026 fix plan. */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const C = require("./site.config.js");

const pages = [];
for (const dir of ["", "services", "solutions", "blog"]) {
  for (const f of fs.readdirSync(path.join(ROOT, dir))) if (f.endsWith(".html")) pages.push(dir ? dir + "/" + f : f);
}

let problems = 0;
const warn = (p, msg) => { problems++; console.log("  ✗ " + p + ": " + msg); };

for (const p of pages) {
  const html = fs.readFileSync(path.join(ROOT, p), "utf8");
  const meta = C.pages[p] || {};
  const count = (re) => (html.match(re) || []).length;

  if (count(/<h1[\s>]/g) !== 1) warn(p, count(/<h1[\s>]/g) + " <h1> tags");
  if (count(/<main id="main">/g) !== 1 || count(/<\/main>/g) !== 1) warn(p, "needs exactly one <main id=\"main\">");
  if (!html.includes('class="skip-link"')) warn(p, "no skip link");
  if (/href="#"/.test(html)) warn(p, 'has href="#" links');
  if (/oneclicq\.com/.test(html)) warn(p, "mentions oneclicq.com");
  if (/OneClicQ/.test(html)) warn(p, "spelling OneClicQ");
  if (/Space\+Grotesk|family=Inter/.test(html)) warn(p, "loads unused fonts");
  if (/images\.unsplash\.com/.test(html)) warn(p, "hotlinks Unsplash images (" + count(/images\.unsplash\.com/g) + ")");
  if (/console\.log/.test(html)) warn(p, "console.log left in page");
  if (!meta.noindex) {
    const canon = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
    const want = C.domain + "/" + p.replace(/(^|\/)index\.html$/, "$1");
    if (canon !== want) warn(p, "canonical " + canon + " should be " + want);
  }
  const t = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
  const d = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
  const tl = t.replace(/&amp;/g, "&").length, dl = d.replace(/&amp;/g, "&").length;
  if (tl < 20 || tl > 62) warn(p, "title length " + tl);
  if (dl < 120 || dl > 160) warn(p, "description length " + dl);

  // heading order: no jumps of more than one level
  let prev = 0;
  for (const m of html.matchAll(/<h([1-6])[\s>]/g)) {
    const lvl = +m[1];
    if (prev && lvl > prev + 1) { warn(p, "heading jumps h" + prev + " → h" + lvl); break; }
    prev = lvl;
  }

  // form controls must have a label
  for (const m of html.matchAll(/<(input|select|textarea)\b([^>]*)>/g)) {
    const attrs = m[2];
    if (/type="(hidden|submit|button)"/.test(attrs)) continue;
    const id = (attrs.match(/\sid="([^"]+)"/) || [])[1];
    if (!/aria-label=/.test(attrs) && !(id && html.includes('for="' + id + '"'))) warn(p, "unlabelled <" + m[1] + "> " + (id || attrs.slice(0, 40)));
    if (!/\sname=/.test(attrs) && !/data-faq|faqSearch|search/i.test(attrs)) warn(p, "control without name: " + (id || attrs.slice(0, 40)));
  }

  // internal links and assets resolve
  for (const m of html.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)) {
    const u = m[1];
    if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(u)) continue;
    const target = u.startsWith("/") ? path.join(ROOT, u.endsWith("/") ? u + "index.html" : u) : path.join(ROOT, path.dirname(p), u);
    if (!fs.existsSync(target) && !/\.php$/.test(u)) warn(p, "broken link " + u);
  }
}

for (const f of ["robots.txt", "sitemap.xml", "favicon.ico", "404.html", "web.config","assets/img/og.png", "sendmail.php", "careers-apply.php"]) {
  if (!fs.existsSync(path.join(ROOT, f))) warn("site", "missing " + f);
}

console.log(problems ? "\n" + problems + " problem(s) found." : "\nNo problems found across " + pages.length + " pages.");
process.exitCode = problems ? 1 : 0;
