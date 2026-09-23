// Extend the rendered site without regenerating or overwriting existing page bodies.
// Also called after build-aire-motion.js so navigation and these pages stay in sync.
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pages = [
  ['aire-motion-about.html', 'About'],
  ['aire-motion-events.html', 'Events'],
  ['aire-motion-scholarships.html', 'Scholarships'],
  ['aire-motion-board.html', 'Our board'],
  ['aire-motion-join.html', 'Join us']
];
function navigation(current) {
  return `<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-navigation">Menu <span aria-hidden="true">+</span></button><nav id="site-navigation" aria-label="Main navigation">${pages.map(([file,label]) => `<a${file.endsWith('join.html') ? ' class="nav-join"' : ''} href="${file}"${file === current ? ' aria-current="page"' : ''}>${label}${file.endsWith('join.html') ? ' <span aria-hidden="true"><i>↗</i></span>' : ''}</a>`).join('')}</nav>`;
}
const originals = ['aire-motion.html', 'aire-motion-about.html', 'aire-motion-events.html', 'aire-motion-join.html'];
for (const file of originals) {
  const target = path.join(root,file);
  const html = fs.readFileSync(target,'utf8').replace(/(?:<button class="nav-toggle"[\s\S]*?<\/button>)?<nav(?: id="site-navigation")? aria-label="Main navigation">[\s\S]*?<\/nav>/, navigation(file));
  fs.writeFileSync(target,html);
}
const reference = fs.readFileSync(path.join(root,'aire-motion-about.html'),'utf8');
const rawHeader = reference.match(/<header class="header wrap">[\s\S]*?<\/header>/)[0];
const footer = reference.match(/<footer class="footer wrap">[\s\S]*?<\/footer>/)[0];
function page(file,title,description,body,script='') {
  const header = rawHeader.replace(/<button class="nav-toggle"[\s\S]*?<\/nav>/, navigation(file));
  fs.writeFileSync(path.join(root,file),`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${escape(description)}"><meta name="theme-color" content="#f0f5f9"><title>${escape(title)} — CHE</title><link rel="icon" href="../assets/img/che-logo-64.jpg"><link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="aire-nav.css"><link rel="stylesheet" href="aire-buttons.css"><link rel="stylesheet" href="aire-community.css"><script src="aire-nav.js" defer></script>${script ? `<script src="${script}" defer></script>` : ''}</head>
<body class="aire"><a class="skip" href="#main">Skip to content</a>${header}<main id="main" class="community-page">${body}</main>${footer}</body></html>\n`);
}
const source = 'https://www.ocf.berkeley.edu/~calche/che-scholarship-2018/';
const recipientSamples = [
  { name: 'Elena', category: 'High school recipient', bio: "hi! i'm elena, a high school senior interested in nursing. i love playing soccer and baking with my little sister!" },
  { name: 'Daniel', category: 'Undergraduate recipient', bio: "hey! i'm daniel, a college sophomore studying public health. outside of class, i'm usually hiking or trying a new recipe!" }
];
page('aire-motion-scholarships.html','Scholarships','CHE Educational Scholarship information for high school and undergraduate students, with updates on the next application cycle.',`
<div class="scholarship-page">
<section class="community-hero scholarship-hero wrap" aria-labelledby="scholarship-title"><p class="eyebrow">CHE Educational Scholarship</p><h1 id="scholarship-title">A little support.<br><em>A world of possibility.</em></h1></section>
<section class="scholarship-feature wrap" aria-labelledby="cycle-title">
<div class="scholarship-art" aria-hidden="true"><span class="art-orbit orbit-one"></span><span class="art-orbit orbit-two"></span><span class="art-orbit orbit-three"></span><div class="scholarship-seal"><span>COMUNIDAD</span><strong>✳</strong><span>GROWING TOGETHER</span></div></div>
<div class="cycle-copy"><p class="eyebrow">The next scholarship</p><h2 id="cycle-title">Applications<br><em>on the horizon.</em></h2><p>CHE hopes to offer the scholarship again. Details for the next cycle are still being confirmed.</p><dl class="cycle-facts"><div><dt>Application dates</dt><dd>To be announced</dd></div><div><dt>Award &amp; eligibility</dt><dd>To be confirmed</dd></div></dl><a class="text-link" href="mailto:calchescholarships@gmail.com">Scholarship questions <span aria-hidden="true">↗</span></a></div>
</section>
<section class="recipients-section wrap" aria-labelledby="recipients-title"><div class="recipient-heading"><p class="eyebrow">High school &amp; undergraduate awards</p><h2 id="recipients-title">Meet our <em>recipients.</em></h2><p class="sample-note">Sample profiles until recipient details are confirmed.</p></div><div class="recipient-grid">${recipientSamples.map((member,i)=>`<article class="recipient-card"><div class="recipient-art tone-${i}" aria-hidden="true"><span class="recipient-initial">${member.name.charAt(0)}</span><span class="recipient-art-star">✳</span></div><div class="recipient-copy"><p class="eyebrow">${member.category}</p><h3>${member.name}</h3><p>${escape(member.bio)}</p><span class="sample-tag">Sample profile</span></div></article>`).join('')}</div></section>
<aside class="scholarship-background wrap" aria-label="Scholarship history"><div><p class="eyebrow">Rooted in community</p><p>Previously known as the Familia Paredes-Miramontes scholarship, this program grew from the family’s campus fundraisers with CHE.</p></div><a class="text-link" href="${source}" target="_blank" rel="noopener noreferrer">Read our scholarship history <span aria-hidden="true">↗</span></a></aside>
</div>
`);
const board = JSON.parse(fs.readFileSync(path.join(root,'../content/aire-board.json'),'utf8'));
const cards = board.members.map((member,i) => {
  if (member.photo && !/^\.\.\/assets\/img\/photos\/che-[\w-]+\.(?:jpg|png|webp)$/.test(member.photo)) throw Error('Board photos must use ../assets/img/photos/che-<name>.jpg, .png, or .webp');
  return `<article class="board-card tone-${i%3}" aria-labelledby="member-${i}"><div class="board-portrait">${member.photo ? `<img src="${escape(member.photo)}" alt="Portrait of ${escape(member.name)}" width="800" height="960" loading="lazy">` : `<div class="portrait-placeholder" aria-hidden="true"><span class="portrait-ring"></span><span class="portrait-head"></span><span class="portrait-body"></span><span class="portrait-star">✳</span></div>`}${board.sampleProfiles ? '<span class="portrait-label">Sample profile</span>' : ''}</div><div class="board-card-copy"><p class="eyebrow">${escape(member.role)}</p><h2 id="member-${i}">${escape(member.name)}</h2><details class="board-bio"><summary>Meet ${escape(member.name)} <span aria-hidden="true">+</span></summary><p>${escape(member.bio)}</p></details></div></article>`;
}).join('\n');
page('aire-motion-board.html','Our board','The board of Comunidad for Health Equity at UC Berkeley.',`
<section class="community-hero compact-hero wrap" aria-labelledby="board-title"><p class="eyebrow">Comunidad for Health Equity</p><h1 id="board-title">Our <em>board.</em></h1>${board.sampleProfiles ? '<p class="sample-note">Sample names, roles, and bios for now.</p>' : ''}</section>
<section class="board-section wrap" aria-label="Board members"><div class="board-grid">${cards}</div></section>
<div class="board-events wrap"><a class="button" href="aire-motion-events.html">See upcoming events <span aria-hidden="true"><i>↗</i></span></a></div>
`,'aire-board.js');
console.log('Updated shared navigation, Scholarships, and Our board.');
