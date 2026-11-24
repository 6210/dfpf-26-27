# Product and UI TODO

Use [requirements.md](requirements.md) as the guardrail for all work below.
The current site is a placeholder; none of these tasks are complete yet.

## Content and direction

- [ ] Agree on the primary action and the information recruiters and other
  potential hirers should find first.
- [ ] Gather approved content and evidence of work. Decide which experience,
  projects, skills, and contact options are appropriate to publish.
- [ ] Review the existing Markdown experience references and select approved
  material for the site, keeping the content source replaceable in the future.
- [ ] Establish an original visual direction and a simple hierarchy across the
  shareable pages.

## Core UI

- [ ] Build the final responsive pages with semantic landmarks, clear headings,
  and accessible navigation. Keep core content and navigation usable without
  JavaScript.
- [ ] Add purposeful interactions that support the content, work with a
  keyboard, and respect reduced-motion preferences.
- [ ] Build on Astro's static pages and client router; check navigation
  accessibility and the JavaScript budget as interactions are added.
- [ ] Add a self-hosted favicon; browsers currently request `/favicon.ico` and
  receive a 404.

## Physics icons (Matter.js)

- [x] Add a Matter.js placeholder to each content page that reacts to clicks
  and scrolling, loads only when needed, and respects reduced motion.
- [ ] Design the animated icons and replace the placeholder shapes, keeping
  them recognizable in both themes.
- [ ] Decide how scrolling and clicking should change the icons on each page,
  and which pages keep a scene.
- [ ] Check touch scrolling and performance on a real phone.

## Search and shareable pages

- [ ] Replace placeholders with approved, useful content and page-specific
  titles, descriptions, and headings.
- [ ] Confirm the production domain and update `astro.config.mjs` if it changes.
- [ ] Once content is approved, remove the temporary `noindex`, create a sitemap
  containing only approved indexable pages, and review robots guidance.
- [ ] Verify deployed direct URLs, canonical links, and missing-page HTTP
  behavior; review search appearance and social sharing metadata before launch.

## Browser-preferred theme

- [x] Provide light and dark styles using the browser or operating system's
  preferred color scheme, without requiring JavaScript.
- [x] Add a light/dark toggle that starts from the visitor's preference and
  remembers their choice across pages and visits.
- [ ] Check that the theme follows preference changes on real devices and that
  content, controls, and focus indicators remain visible in both themes.
- [ ] Verify text contrast of at least 4.5:1 for normal text and 3:1 for large
  text; verify relevant interface and focus indicators at 3:1 against adjacent
  colors. Recheck when the final palette is chosen.
- [ ] Restyle the toggle as part of the visual design, and decide whether
  visitors need a way to return to the system preference.

## Typography

- [ ] Choose fonts that suit the approved visual direction and are licensed for
  self-hosting. Record their sources and licenses.
- [ ] Self-host only the necessary font files and weights, with readable system
  fallbacks; avoid external font requests.

## Before going live

- [ ] Check layouts at 360 px and wider, keyboard access, focus visibility, and
  reduced-motion behavior.
- [ ] Run the Lighthouse checks and address failures: mobile performance and
  accessibility scores of at least 90, plus no more than 100 KiB of initial
  script transfer per page. Review inline scripts separately.
- [ ] Review applicable legal notices and any privacy implications before
  publishing real content or adding external services.
