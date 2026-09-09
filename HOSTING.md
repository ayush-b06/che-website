# Cloudflare Pages hosting

## GitHub-connected website (recommended)

Repository: https://github.com/ayush-b06/che-website

In Cloudflare choose Workers & Pages → Create application → Pages → Import an existing Git repository. Authorize access to this repository, select it, and use:

- Production branch: `main`
- Framework preset: `None`
- Build command: `node package-preview.js --production`
- Build output directory: `public`
- Root directory: leave blank
- Environment variables: none required

Choose Save and Deploy. Pushes to `main` trigger future deployments to the same project-level URL. Local edits alone do not publish anything. The production build includes the entire finished four-page site, does not add the temporary preview's noindex directive, and excludes development files. It needs Node but no npm packages.

Official setup: https://developers.cloudflare.com/pages/get-started/git-integration/

## Optional drag-and-drop copy

Run `node package-preview.js` from this project to create a fresh `che-preview-upload-*` folder. It packages the current rendered Silk homepage and About, Events, and Join pages, with their required assets only. It does not regenerate or edit the working designs. If you edit the template builder, regenerate the pages first; if you edit the rendered pages directly, package them as-is.

The output has `index.html` at its top level, corrected local links, the eight-photo marquee, fonts, and the bundled walking character. Old design galleries, dependencies, and unrelated files are excluded. Each run creates a new folder, preserving earlier packages. Never edit the upload copy as your main source.

## Publish

1. Sign in at https://dash.cloudflare.com/.
2. Open Workers & Pages, then Create application, and choose the Pages drag-and-drop flow.
3. Name the project (for example `che-berkeley-preview`).
4. Upload the generated folder, then select Deploy site / Save and Deploy.
5. Share the project-level `pages.dev` link shown by Cloudflare.

Official steps: https://developers.cloudflare.com/pages/get-started/direct-upload/

## Updates

After local changes, run the packaging command again. In the existing Cloudflare project choose Create a new deployment, select Production, and upload the new folder. The project-level URL stays the same. Existing open browser tabs need refreshing.

## Before sharing

- Confirm permission to publish CHE's photos and use the Box Man model on the web. The model's public API listed a Standard license on September 8, 2026, but that does not verify the user's purchase or grant. Local provenance remains in `assets/models/ATTRIBUTION.md`; do not assume it is Creative Commons.
- The preview requests no search indexing via meta tags and an HTTP header. This is not password protection: anyone with its public URL can access the files.
- Google Calendar and other external links still depend on their original services. The next-meeting card remains the existing local schedule snapshot.

Nothing is published by the packaging script. Cloudflare account setup and deployment happen separately.
