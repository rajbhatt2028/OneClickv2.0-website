#!/usr/bin/env node
/* Local preview server: node tools/serve.js  →  http://localhost:8080
   Static files only (PHP form handlers need the real host). */
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const PORT = process.env.PORT || 8080;
// mirror the security headers from web.config so problems show up locally
const SEC = {};
for (const m of fs.readFileSync(path.join(ROOT, "web.config"), "utf8").split("<customHeaders>")[1].split("</customHeaders>")[0].matchAll(/<add name="([^"]+)" value="([^"]*)"/g)) {
  if (m[1] !== "Strict-Transport-Security") SEC[m[1]] = m[2].replace(/; upgrade-insecure-requests/, "");
}
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon", ".xml": "application/xml", ".txt": "text/plain" };

http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT) || /[\\/](tools|includes)[\\/]/.test(file)) { res.writeHead(403); return res.end("Forbidden"); }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { ...SEC, "Content-Type": TYPES[".html"] });
      return res.end(fs.readFileSync(path.join(ROOT, "404.html")));
    }
    res.writeHead(200, { ...SEC, "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream" });
    res.end(data);
  });
}).listen(PORT, () => console.log("OneClicq preview on http://localhost:" + PORT));
