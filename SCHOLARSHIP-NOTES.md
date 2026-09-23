# Scholarship and board content handoff

Reviewed September 23, 2026. A CHE board member confirmed through the site owner
that the requested program is the CHE Educational Scholarship.

## Research

- CHE's existing scholarship page: https://www.ocf.berkeley.edu/~calche/che-scholarship-2018/
- CHE's university-hosted fundraising campaign: https://crowdfund.berkeley.edu/project/47425

The first source mixes a Spring 2026 application deadline with older enrollment
requirements. It must not be used as current eligibility or a current application
link. Recent recipient names and award years were not verified online. The two
recipient placeholders reflect the owner's report of two recent awards, not a
verified list. The next cycle is tentative; no amount, deadline or eligibility is
promised. The campaign also discusses conference scholarships, a distinct context.

## Still needed from the board

- Confirm next award cycle, amount, eligibility, application link and dates.
- Confirm the two recent recipients' names, award years, and approved public bios.
- Supply the board roster, exact titles, portraits and short bios. Six cards are
  layout placeholders, not a claim about board size or membership.

## Editing

- Board data: `content/aire-board.json`. Add or remove entries to match the roster.
- Photo paths: `../assets/img/photos/che-person-name.jpg` (also PNG or WebP).
- Scholarship copy and page structure: `designs/build-community-pages.js`.
- Run `node designs/build-community-pages.js` after changes. This updates both new
  pages and shared navigation without regenerating existing page bodies.
- Commit the JSON, generator, generated HTML and assets together.
- Run `node package-preview.js --production` to package all six pages; as before,
  the output `public/` must not already exist.
- The full `build-aire-motion.js` generator also calls the new generator. The
  existing warning about unported direct edits still applies to full regeneration.
