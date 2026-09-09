// Reuse the rendered Aire page verbatim; only replace artwork and preview controls.
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const original = fs.readFileSync(path.join(root, 'aire.html'), 'utf8');
const options = ['Silk', 'Field', 'Weave', 'Current', 'Contour'];
// CHE's 2025–26 campaign and 2025/2026 website uploads. See PHOTO-SOURCES.md.
const recentPhotos = [
  { file: 'che-group-campaign.jpg', alt: 'CHE members outdoors holding signs for Comunidad for Health Equity', width: 1800, height: 1018 },
  { file: 'che-comunidad-upload-2025.jpg', alt: 'CHE members smiling together on the steps of Doe Library', width: 1000, height: 666 },
  { file: 'che-health-gathering-campaign.jpg', alt: 'CHE members gathered in a classroom for a health-focused event', width: 1600, height: 777 },
  { file: 'che-interns-upload-2026.jpg', alt: 'A group of CHE members dressed up for a photo outside Doe Library', width: 1000, height: 666 },
  { file: 'che-ajua-outreach-campaign.jpg', alt: 'CHE volunteers with lunches and supplies during outreach in El Cerrito', width: 1600, height: 1102 },
  { file: 'che-board-upload-2025.jpg', alt: 'CHE members posing together in formal attire on campus', width: 1000, height: 667 },
  { file: 'che-health-fair-2025.jpg', alt: 'CHE volunteers at the Spring 2025 Community Health Fair registration table', width: 1600, height: 1066 },
  { file: 'che-interns-upload-2025.jpg', alt: 'CHE members sharing a smile on the library steps', width: 1000, height: 666 }
];
// A long enough repeat prevents empty stretches on wide screens. Only the first
// eight photos are announced; visual repeats are decorative. Double the original
// duration alongside the doubled photo count to preserve the gentle pace.
const filmSet = duplicate => `<div class="film-set"${duplicate ? ' aria-hidden="true"' : ''}>${Array.from({length:3}, () => recentPhotos).flat().map((photo, i) => `<figure class="film-photo photo-${i % recentPhotos.length}"${i >= recentPhotos.length ? ' aria-hidden="true"' : ''}><img src="../assets/img/marquee/${photo.file}" alt="${duplicate || i >= recentPhotos.length ? '' : photo.alt}" width="${photo.width}" height="${photo.height}" decoding="async"></figure>`).join('')}</div>`;
const walker = `<aside class="walker-rail" aria-label="Box Man walking along the timeline as you scroll"><div class="walker-sticky"><div class="walker-stage"><p class="walker-status" role="status">Loading our walking companion…</p></div></div></aside>`;
// The timeline's own figures, which differ from the ones in aire.html.
const chapters = [
  // The suffix is set smaller inline: at the figure's own size it would be far too
  // wide, and would wrap or overflow the panel on a phone.
  { kicker: 'Our roots', value: '1976', suffix: '(50+ years)', label: 'Founded at UC Berkeley' },
  { kicker: 'Our community', value: '40+', label: 'Active members' },
  // Taken from the events calendar this site embeds, where general meetings run
  // Wednesdays 6-7pm. Swap in whichever fact you would rather close on.
  { kicker: 'Meet us', value: '6pm', label: 'General meetings, Wednesdays during the semester' }
];
// Rewrites each stat in document order: kicker, figure, one line of label.
const enrich = numbers => {
  let i = 0;
  return numbers.replace(/<div class="stat">[\s\S]*?<\/div>/g, whole => {
    const chapter = chapters[i++];
    if (!chapter) return whole;
    const suffix = chapter.suffix ? ` <span class="stat-since">${chapter.suffix}</span>` : '';
    return `<div class="stat"><span class="stat-chapter">${chapter.kicker}</span>`
      + `<span class="stat-value">${chapter.value}${suffix}</span>`
      + `<span class="stat-label">${chapter.label}</span></div>`;
  });
};
// The walking line doubles as the progress bar, so the only meter chrome left is
// this counter. It duplicates scroll position visually, so it is hidden from AT.
const meter = `<p class="timeline-count" aria-hidden="true">01 / 03</p>`;
const toolbar = `<aside class="motion-picker" aria-label="Aire animation previews"><p class="motion-description" aria-live="polite">Move your cursor to lift and bend the ribbons.</p><div class="motion-picker-bar"><a class="motion-back" href="index.html" aria-label="Back to all designs">↗</a><span class="motion-picker-label">AIRE / MOTION</span><nav aria-label="Choose an animation">${options.map((name,i)=>`<a href="?motion=${name.toLowerCase()}" data-motion="${name.toLowerCase()}"${i===0?' aria-current="true"':''}>${name}</a>`).join('')}</nav></div></aside>`;
const result = original.replace('<title>CHE — Aire design</title>', '<title>CHE — Aire motion explorations</title>')
  .replace('href="aire.html" aria-label="CHE home"', 'href="aire-motion.html" aria-label="CHE home"')
  .replace('<script src="interactions.js" defer></script>', '<link rel="stylesheet" href="aire-motion.css"><link rel="stylesheet" href="aire-nav.css"><link rel="stylesheet" href="aire-buttons.css"><link rel="stylesheet" href="silk-walker.css"><script src="aire-motion.js" defer></script><script src="aire-nav.js" defer></script><script src="silk-walker.js" defer></script>')
  // The pill needs a wrapper to reshape; the header keeps its box so nothing shifts.
  .replace(/(<header class="header wrap">)([\s\S]*?)(<\/header>)/, '$1<div class="header-inner">$2</div>$3')
  .replace('<body class="aire">', '<body class="aire motion-silk"><div class="aire-backdrop" aria-hidden="true"><canvas class="motion-canvas"></canvas></div>')
  .replace(/<div class="hero-art"[\s\S]*?<div class="hero-content">/, '<div class="hero-content">')
  .replace('<figcaption>Together is a good beginning.</figcaption>', '')
  .replace(/<div class="film-track">[\s\S]*?<div class="film-caption wrap">/, `<div class="film-track" style="animation-duration:130s">${filmSet(false)}${filmSet(true)}</div><div class="film-caption wrap">`)
  .replace(/<img src="\.\.\/assets\/img\/photos\/feature-group.jpg"[^>]*>/, '<img class="campaign-group" src="../assets/img/photos/che-group-campaign.jpg" alt="CHE members outdoors holding signs for Comunidad for Health Equity" width="1800" height="1018" loading="lazy">')
  .replace('<p>We’re CHE: Comunidad for Health Equity. A home for students exploring careers in health and a community committed to serving others.</p><p>From cafecito study hours to mentorship and community health events, we grow together—and bring what we learn back to the communities we care about.</p>',
    '<p>We’re CHE: Comunidad for Health Equity, a home for students exploring careers in health.</p><p>We run mentorship and community service, and bring what we learn back to the communities we come from.</p>')
  .replace('<a class="text-link" href="#join">Find your place here <span aria-hidden="true">↗</span></a>', '<a class="text-link" href="aire-motion-about.html">More about CHE <span aria-hidden="true">↗</span></a>')
  .replace(/(<section class="impact wrap"[\s\S]*?)(<div class="numbers">[\s\S]*?)(<\/section>)/,
    (whole, before, numbers, after) =>
      `${before}<div class="impact-layout"><div class="impact-pin">${walker}${meter}<div class="timeline">${enrich(numbers)}</div></div></div>${after}`)
  .replace('<nav aria-label="Main navigation"><a href="#about">About us</a><a href="#community">Our comunidad</a>',
    '<nav aria-label="Main navigation"><a href="aire-motion-about.html">About</a><a href="aire-motion-events.html">Events</a>')
  .replace('<a class="nav-join" href="#join">Get involved <span aria-hidden="true">↗</span></a>',
    '<a class="nav-join" href="aire-motion-join.html">Join us <span aria-hidden="true"><i>↗</i></span></a>')
  .replace('<a class="button" href="mailto:chesecretary@gmail.com">Say hello <span aria-hidden="true">↗</span></a><a class="text-link" href="https://www.instagram.com/ucberkeleyche/" target="_blank" rel="noopener noreferrer">Find us on Instagram <span aria-hidden="true">↗</span></a>',
    '<a class="button" href="aire-motion-join.html">Join CHE <span aria-hidden="true"><i>↗</i></span></a><a class="text-link" href="https://www.instagram.com/ucberkeleyche/" target="_blank" rel="noopener noreferrer">Find us on Instagram <span aria-hidden="true">↗</span></a>')
  .replace('Curious about CHE? We’d love to meet you.<br>Say hello or see what our comunidad is up to.', 'Curious about CHE? We’d love to meet you.<br>Come to a meeting and find your community.')
  .replace('<div><a href="https://callink.berkeley.edu/organization/calche"', '<div><a href="https://donate.stripe.com/6oEeYJ5CX6Ay5a03cl" target="_blank" rel="noopener noreferrer">Support CHE <span aria-hidden="true">↗</span></a><a href="https://callink.berkeley.edu/organization/calche"')
  .replace(/<nav class="design-switcher"[\s\S]*?<\/nav>/, toolbar);
fs.writeFileSync(path.join(root,'aire-motion.html'), result);

// ---- Subpages -------------------------------------------------------------
// Header and footer are lifted from the page just built, so they cannot drift.
const lift = pattern => result.match(pattern)[0];
const rawHeader = lift(/<header class="header wrap">[\s\S]*?<\/header>/).replace('href="aire.html"', 'href="aire-motion.html"');
const subFooter = lift(/<footer class="footer wrap">[\s\S]*?<\/footer>/)
  .replace('href="#main" aria-label="Back to top"', 'href="aire-motion.html" aria-label="CHE home"');
const headerFor = current => rawHeader.replace(`href="${current}"`, `href="${current}" aria-current="page"`);
const calendar = 'https://calendar.google.com/calendar/embed?src=4c7281d7b4bbb0fb15560f8c13d1890546bad641f0cbd159e90c492f794d60da%40group.calendar.google.com&amp;ctz=America%2FLos_Angeles&amp;mode=AGENDA&amp;showTitle=0&amp;showPrint=0&amp;showTz=0&amp;showCalendars=0&amp;bgcolor=%23FFFFFF';
const subscribe = 'https://calendar.google.com/calendar/r?cid=NGM3MjgxZDdiNGJiYjBmYjE1NTYwZjhjMTNkMTg5MDU0NmJhZDY0MWYwY2JkMTU5ZTkwYzQ5MmY3OTRkNjBkYUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t';
const apply = 'https://forms.gle/smP3F2Lj9r1AFVa88';
const meetings = fs.readFileSync(path.join(root, '../content/aire-meetings.json'), 'utf8');
const subpage = ({ file, title, description, current, body, stylesheet = '' }) => {
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${description}"><meta name="theme-color" content="#f0f5f9"><title>CHE — ${title}</title><link rel="icon" href="../assets/img/che-logo-64.jpg"><link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="aire-nav.css"><link rel="stylesheet" href="aire-buttons.css"><link rel="stylesheet" href="aire-subpage.css">${stylesheet ? `<link rel="stylesheet" href="${stylesheet}">` : ''}<script src="aire-nav.js" defer></script></head>
<body class="aire"><a class="skip" href="#main">Skip to content</a>
${headerFor(current)}
<main id="main">
${body.replace('<img src="../assets/img/photos/spring-group.jpg" alt="CHE members standing together on the grass at a park" width="1100" height="733" loading="lazy">', '<img class="campaign-meeting" src="../assets/img/photos/che-health-gathering-campaign.jpg" alt="CHE members together at a health-focused gathering in a classroom" width="1600" height="777" loading="lazy"><figcaption>Learning together. Shared in CHE’s 2025–26 campaign.</figcaption>')}
</main>
${subFooter}
</body></html>`;
  fs.writeFileSync(path.join(root, file), html);
};
subpage({
  file: 'aire-motion-events.html', title: 'Events', current: 'aire-motion-events.html',
  description: "CHE's events calendar at UC Berkeley: general meetings, health fairs, and service projects.",
  body: `<section class="subpage wrap" aria-labelledby="events-title"><h1 id="events-title">See you at CHE.</h1><p class="subpage-lede">Good conversations, shared experiences, and a place to get involved. Find your next reason to come by.</p><article class="next-meeting" aria-labelledby="meeting-title"><div class="meeting-intro"><p class="eyebrow" data-meeting-kicker>General meetings</p><h2 id="meeting-title">Meet us on Wednesdays</h2><p class="meeting-welcome">New to CHE? You’re welcome to come along.</p></div><div class="meeting-details"><p class="meeting-time" data-meeting-time>6–7 p.m. · Berkeley time</p><p data-meeting-location>Check the calendar or email us for the meeting location.</p><a class="text-link" href="mailto:chesecretary@gmail.com">Ask about attending <span aria-hidden="true">↗</span></a></div></article><div class="calendar-heading"><h2>What’s coming up</h2><p>Check the live calendar for the latest details and changes.</p></div><div class="calendar-embed"><iframe src="${calendar}" title="CHE events calendar" loading="lazy"></iframe></div><p class="calendar-note"><a class="text-link" href="${subscribe}" target="_blank" rel="noopener noreferrer">Add CHE to your own calendar <span aria-hidden="true">↗</span></a></p></section><script id="meeting-data" type="application/json">${meetings.replace(/</g, '\\u003c')}</script><script src="aire-meetings.js" defer></script>`
});
subpage({
  file: 'aire-motion-join.html', title: 'Join us', current: 'aire-motion-join.html',
  description: 'Join CHE, a Chicanx/Latinx pre-health community at UC Berkeley.',
  // General membership guidance comes from content/join.json. The former Apply
  // link is specifically an internship application, as confirmed by the form.
  body: `<section class="subpage wrap" aria-labelledby="join-title"><h1 id="join-title">Find your people.</h1><p class="subpage-lede">Whether you’re set on a career in health or still figuring it out, there’s a place for you at CHE. Start with a general meeting.</p><div class="subpage-action"><a class="button" href="aire-motion-events.html">Find a meeting <span aria-hidden="true"><i>↗</i></span></a><a class="text-link" href="mailto:chesecretary@gmail.com">Say hello first <span aria-hidden="true">↗</span></a></div><div class="join-details"><section><p class="eyebrow">Who can join</p><h2>Come as you are.</h2><p>You don’t need to be Latinx, pre-med, or certain of your path. Our general meetings welcome students exploring health and community.</p></section><section><p class="eyebrow">What to expect</p><h2>Start with an hour.</h2><p>General meetings run Wednesdays, 6–7 p.m. during the semester. They’re free to attend, and you can join during the semester.</p></section><section><p class="eyebrow">Your first step</p><h2>Meet us, then settle in.</h2><p>No application is needed to attend a general meeting. Check Events for details, or email our secretary for help finding your first meeting and getting connected.</p></section></div><figure class="subpage-photo"><img src="../assets/img/photos/spring-group.jpg" alt="CHE members standing together on the grass at a park" width="1100" height="733" loading="lazy"></figure><aside class="intern-note" aria-labelledby="intern-title"><div><p class="eyebrow">Looking to go deeper?</p><h2 id="intern-title">Intern with CHE.</h2><p>The internship is a separate program with additional meeting and unit commitments. The posted Fall 2026 application deadline was September 4.</p></div><div class="intern-links"><a class="text-link" href="mailto:checochair1@gmail.com">Ask about future opportunities <span aria-hidden="true">↗</span></a><a href="${apply}" target="_blank" rel="noopener noreferrer">View Fall 2026 program details ↗</a></div></aside></section>`
});
subpage({
  file: 'aire-motion-about.html', title: 'About', current: 'aire-motion-about.html', stylesheet: 'aire-about.css',
  description: 'Explore CHE’s community outreach, health education, Minorities in Health Conference, and the people who helped rebuild the organization.',
  body: `<div class="about-page">
<section class="story-hero wrap" aria-labelledby="story-title"><p class="eyebrow">About CHE / Our work &amp; our story</p><div class="story-intro"><h1 id="story-title">Health equity,<br><em>beyond campus.</em></h1><div class="story-lede"><p>For CHE, preparing for a career in health also means working alongside the communities we hope to serve.</p><p>Our work connects Berkeley students with East Bay neighbors, younger students, and professionals across healthcare.</p><a class="text-link" href="#community-work">Explore our work <span aria-hidden="true">↓</span></a></div></div></section>
<section class="work-story wrap" id="community-work" aria-labelledby="outreach-title"><div class="story-copy"><p class="eyebrow">01 / Community outreach</p><h2 id="outreach-title">Care begins<br><em>with connection.</em></h2><p>Through Adelante Jornaleros Unidos en Acción (AJUA), CHE members bring health information in Spanish, lunches, and referrals to free or affordable clinics to East Bay day laborers.</p><p>The conversations connect health education with everyday concerns, including safety at work. CHE’s 2025–26 fundraising campaign highlights members distributing lunches and resource pamphlets in El Cerrito.</p><a class="story-source" href="https://www.ocf.berkeley.edu/~calche/ajua-prep-handouts/" target="_blank" rel="noopener noreferrer">More on AJUA ↗</a></div><figure class="work-photo"><img src="../assets/img/photos/che-ajua-outreach-campaign.jpg" alt="CHE volunteers with carts of prepared lunches and supplies during outreach in El Cerrito" width="1600" height="1102" decoding="async"><figcaption>AJUA outreach in El Cerrito. Photo shared in CHE’s 2025–26 campaign.</figcaption></figure></section>
<section class="work-story work-story-reverse wrap" aria-labelledby="education-title"><div class="story-copy"><p class="eyebrow">02 / Education &amp; opportunity</p><h2 id="education-title">Opening doors,<br><em>early.</em></h2><h3>The Minorities in Health Conference</h3><p>Organized with fellow pre-health student groups, MIH brings high-school and undergraduate students together for workshops, mentorship, and panels with health professionals. It helps students explore careers while learning about health disparities.</p><h3>The Community Health Fair</h3><p>CHE interns turn health topics into engaging activities for elementary students. CHE’s campaign features the fair held in partnership with Lockwood STEAM Academy.</p><a class="story-source" href="https://crowdfund.berkeley.edu/project/47425" target="_blank" rel="noopener noreferrer">Explore CHE’s community work ↗</a></div><figure class="work-photo"><img src="../assets/img/photos/che-health-fair-2025.jpg" alt="Four CHE volunteers at the registration table for the Spring 2025 Community Health Fair" width="1600" height="1066" loading="lazy"><figcaption>Spring 2025 Community Health Fair, with Lockwood STEAM Academy.</figcaption></figure></section>
<section class="story-history wrap" aria-labelledby="history-title"><div class="history-intro"><p class="eyebrow">03 / The people who kept CHE going</p><h2 id="history-title">A community<br><em>rebuilt together.</em></h2></div><div class="story-copy"><p>Four Chicanx/Latinx students founded CHE at Berkeley in 1976 to support students entering health professions and address the needs of underserved communities.</p><p>By late 1998, the group had become inactive. Melissa Cruz and Amanda Perez helped revive it with just five active members, according to CHE’s own account of its history.</p><p>That rebuilding is part of CHE’s story: students choosing to create the community they wanted to see, and leaving it for others to carry forward.</p><a class="story-source" href="https://www.ocf.berkeley.edu/~calche/about2/" target="_blank" rel="noopener noreferrer">Read CHE’s history ↗</a></div></section>
<section class="story-invitation wrap" aria-labelledby="invitation-title"><p class="eyebrow">The story continues with you.</p><h2 id="invitation-title">Come get to<br><em>know us.</em></h2><div class="story-actions"><a class="button" href="aire-motion-join.html">Join CHE <span aria-hidden="true"><i>↗</i></span></a><a class="text-link" href="aire-motion-events.html">See what’s coming up <span aria-hidden="true">↗</span></a></div></section>
</div>`
});
console.log('Built Aire homepage and About, Events, and Join subpages.');
