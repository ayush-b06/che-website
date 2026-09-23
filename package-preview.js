// Package the currently rendered Silk site without changing the working designs.
// Preview: node package-preview.js | Cloudflare: node package-preview.js --production
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
// A fresh directory on every run avoids stale files and never overwrites a preview.
const production = process.argv.includes('--production');
const output = production ? path.join(root, 'public') : fs.mkdtempSync(path.join(root, 'che-preview-upload-'));
if (production && fs.existsSync(output)) throw Error('public/ already exists. Move the previous build aside before rebuilding; it is not overwritten automatically.');
const pages = {
  'aire-motion.html': 'index.html',
  'aire-motion-about.html': 'about.html',
  'aire-motion-events.html': 'events.html',
  'aire-motion-join.html': 'join.html',
  'aire-motion-scholarships.html': 'scholarships.html',
  'aire-motion-board.html': 'board.html'
};
const files = new Map();
function add(name, data) {
  if (path.isAbsolute(name) || name.split('/').includes('..')) throw Error(`Unsafe output: ${name}`);
  files.set(name, data);
}
function copyAsset(url) {
  const name = url.replace(/^\.\.\//, '');
  if (!/^assets\/(img|fonts)\/[\w./-]+$/.test(name)) throw Error(`Unexpected asset: ${url}`);
  add(name, fs.readFileSync(path.join(root, name)));
  return name;
}
const dependencies = new Set(['walker-renderer.js']); // dynamically loaded, model embedded
for (const [source, target] of Object.entries(pages)) {
  let html = fs.readFileSync(path.join(root, 'designs', source), 'utf8');
  html = html.replace(/\.\.\/assets\/[\w./-]+/g, copyAsset);
  for (const [from, to] of Object.entries(pages)) html = html.replaceAll(from, to);
  html = html.replace('<title>CHE — Aire motion explorations</title>', '<title>CHE — Comunidad for Health Equity</title>');
  if (!production) html = html.replace('</head>', '<meta name="robots" content="noindex, nofollow"></head>');
  // Keep the description node required by the background script, but hide design controls.
  html = html.replace('<aside class="motion-picker"', '<aside hidden style="display:none!important" class="motion-picker"');
  for (const match of html.matchAll(/(?:src|href)="([\w-]+\.(?:css|js))"/g)) dependencies.add(match[1]);
  add(target, html);
}
for (const name of dependencies) {
  let data = fs.readFileSync(path.join(root, 'designs', name), 'utf8');
  if (name.endsWith('.css')) data = data.replace(/\.\.\/assets\/[\w./-]+/g, copyAsset);
  add(name, data);
}
add('_headers', `/*\n${production ? '' : '  X-Robots-Tag: noindex, nofollow\n'}  Cache-Control: public, max-age=0, must-revalidate\n  X-Content-Type-Options: nosniff\n`);
add('404.html', '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found — CHE</title><h1>Page not found</h1><p><a href="/">Return to CHE</a></p></html>');
// Keep source records with the packaged assets; not a claim that rights are cleared.
add('credits/photos.md', fs.readFileSync(path.join(root, 'assets/img/PHOTO-SOURCES.md')));
add('credits/models.md', fs.readFileSync(path.join(root, 'assets/models/ATTRIBUTION.md')));
if (files.size > 1000) throw Error('Exceeds Cloudflare drag-and-drop file count.');
for (const [name, data] of files) {
  if (Buffer.byteLength(data) > 25 * 1024 * 1024) throw Error(`Asset exceeds 25 MiB: ${name}`);
  if (/\.(html|css)$/.test(name)) {
    const references = [...String(data).matchAll(/(?:src|href)="([^"#?]+)|url\(['"]?([^)'"?#]+)/g)];
    for (const match of references) {
      const ref = (match[1] || match[2]).split(/[?#]/)[0];
      if (/^(?:[a-z]+:|\/)/i.test(ref)) continue;
      if (!files.has(ref)) throw Error(`Missing reference in ${name}: ${ref}`);
    }
  }
  const target = path.join(output, name);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, data);
}
console.log(`Ready: ${output}\n${files.size} files, ${(Array.from(files.values()).reduce((n, data) => n + Buffer.byteLength(data), 0) / 1024 / 1024).toFixed(1)} MiB\nUpload this folder, not the entire che-website project.\nConfirm Box Man web-use rights before publishing. No files have been uploaded.`);
