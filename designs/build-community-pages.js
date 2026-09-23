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
page('aire-motion-scholarships.html','Scholarships','The CHE Educational Scholarship: supporting students pursuing health careers. Explore its history and watch for the next scholarship announcement.',`
<section class="community-hero wrap" aria-labelledby="scholarship-title">
  <p class="eyebrow">CHE Educational Scholarship</p>
  <div class="community-intro"><h1 id="scholarship-title">A little support.<br><em>A world of possibility.</em></h1><div class="community-lede"><p>For students who see a healthier future for their communities—and want to be part of building it.</p><a class="text-link" href="#next-cycle">Explore the scholarship <span aria-hidden="true">↓</span></a></div></div>
</section>
<section class="scholarship-feature wrap" id="next-cycle" aria-labelledby="cycle-title">
  <div class="scholarship-art" aria-hidden="true"><span class="art-orbit orbit-one"></span><span class="art-orbit orbit-two"></span><span class="art-orbit orbit-three"></span><div class="scholarship-seal"><span>COMUNIDAD</span><strong>✳</strong><span>GROWING TOGETHER</span></div><p>Rooted in community.<br><em>Invested in you.</em></p></div>
  <div class="cycle-copy"><span class="status-label"><span aria-hidden="true"></span>Next cycle · Not yet announced</span><h2 id="cycle-title">More opportunity,<br><em>on the horizon.</em></h2><p>CHE hopes to offer the Educational Scholarship again. Details for the next cycle are still being confirmed.</p><dl class="cycle-facts"><div><dt>Application dates</dt><dd>To be announced</dd></div><div><dt>Award &amp; eligibility</dt><dd>Details to come</dd></div></dl><a class="button" href="mailto:calchescholarships@gmail.com">Ask about the scholarship <span aria-hidden="true"><i>↗</i></span></a><p class="cycle-note">Application information will appear here once confirmed.</p></div>
</section>
<section class="scholarship-story wrap" aria-labelledby="scholarship-story-title"><div><p class="eyebrow">The story behind the support</p><h2 id="scholarship-story-title">From our comunidad,<br><em>for our comunidad.</em></h2></div><div class="community-prose"><p>The CHE Educational Scholarship supports students pursuing health careers who want to give back to their communities.</p><p>Previously known as the Familia Paredes-Miramontes scholarship, its history includes the family’s campus taco fundraisers with CHE, which began in 2008.</p><a class="text-link" href="${source}" target="_blank" rel="noopener noreferrer">Read the scholarship history <span aria-hidden="true">↗</span></a></div></section>
<section class="recipients-section wrap" aria-labelledby="recipients-title"><div class="community-section-heading"><div><p class="eyebrow">Celebrating the journey</p><h2 id="recipients-title">Past recipients.</h2></div><p>Two recent awards. Stories we look forward to sharing.</p></div><div class="recipient-grid">${['Earlier award','Most recent award'].map((label,i)=>`<article class="recipient-card"><span class="recipient-symbol" aria-hidden="true">${i ? '✺' : '✳'}</span><div><p class="eyebrow">${label}</p><h3>Recipient spotlight<br><em>coming soon.</em></h3><p>Names, award years, and recipient stories will be added once confirmed.</p></div></article>`).join('')}</div></section>
<section class="scholarship-faq wrap" aria-labelledby="faq-title"><div><p class="eyebrow">A few things to know</p><h2 id="faq-title">Your next step.</h2></div><div class="faq-list"><details><summary>Can I apply now?<span aria-hidden="true">+</span></summary><p>The next application cycle has not been announced. Check this page for confirmed dates and an application link.</p></details><details><summary>Who can apply, and how much is the award?<span aria-hidden="true">+</span></summary><p>Eligibility and award amounts for the next cycle are still to be confirmed. Previous requirements should not be treated as current.</p></details><details><summary>Who should I contact?<span aria-hidden="true">+</span></summary><p>Email <a href="mailto:calchescholarships@gmail.com">calchescholarships@gmail.com</a> with scholarship questions.</p></details></div></section>
`);
const board = JSON.parse(fs.readFileSync(path.join(root,'../content/aire-board.json'),'utf8'));
const cards = board.members.map((member,i) => {
  if (member.photo && !/^\.\.\/assets\/img\/photos\/che-[\w-]+\.(?:jpg|png|webp)$/.test(member.photo)) throw Error('Board photos must use ../assets/img/photos/che-<name>.jpg, .png, or .webp');
  return `<article class="board-card tone-${i%3}" aria-labelledby="member-${i}"><div class="board-portrait">${member.photo ? `<img src="${escape(member.photo)}" alt="Portrait of ${escape(member.name)}" width="800" height="960" loading="lazy">` : `<div class="portrait-placeholder" aria-hidden="true"><span class="portrait-ring"></span><span class="portrait-head"></span><span class="portrait-body"></span><span class="portrait-star">✳</span></div><span class="portrait-label">Portrait coming soon</span>`}<span class="portrait-index" aria-hidden="true">${String(i+1).padStart(2,'0')}</span></div><div class="board-card-copy"><p class="eyebrow">${escape(member.role)}</p><h2 id="member-${i}">${escape(member.name)}</h2><details class="board-bio"><summary>Get to know ${member.photo ? escape(member.name) : 'this member'}<span aria-hidden="true">+</span></summary><p>${escape(member.bio)}</p></details></div></article>`;
}).join('\n');
page('aire-motion-board.html','Our board','Meet the students behind Comunidad for Health Equity at UC Berkeley. Board profiles are coming soon.',`
<section class="community-hero wrap" aria-labelledby="board-title"><p class="eyebrow">Our board / The people behind CHE</p><div class="community-intro"><h1 id="board-title">Different paths.<br><em>One comunidad.</em></h1><div class="community-lede"><p>${escape(board.intro)}</p><a class="text-link" href="#meet-the-board">Meet our board <span aria-hidden="true">↓</span></a></div></div></section>
<section class="board-section wrap" id="meet-the-board" aria-labelledby="board-section-title"><div class="board-section-heading"><h2 id="board-section-title">Built on connection.</h2><p>Board profiles coming soon</p></div><div class="board-grid">${cards}</div></section>
<section class="community-invitation wrap" aria-labelledby="invitation-title"><p class="eyebrow">There’s a place for you, too</p><h2 id="invitation-title">Come say <em>hola.</em></h2><p>You don’t have to be on the board to be part of CHE.<br>Come to a meeting and find your community.</p><div class="community-actions"><a class="button" href="aire-motion-events.html">Find a meeting <span aria-hidden="true"><i>↗</i></span></a><a class="text-link" href="aire-motion-join.html">Get involved <span aria-hidden="true">↗</span></a></div></section>
`,'aire-board.js');
console.log('Updated shared navigation, Scholarships, and Our board.');
