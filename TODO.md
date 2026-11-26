# Product and UI TODO

Use [requirements.md](requirements.md) as the guardrail for all work below.
The site is still in progress; checked items are done.

## Content and direction

- [ ] Agree on the primary action and the information recruiters and other
  potential hirers should find first.
- [ ] Gather approved content and evidence of work. Decide which experience,
  projects, skills, and contact options are appropriate to publish.
- [ ] Review the existing Markdown experience references and select approved
  material for the site, keeping the content source replaceable in the future.
- [ ] Establish an original visual direction and a simple hierarchy across the
  shareable pages.

## CV and career content

- [x] Structure career content as CV entries in `src/content/` (profile and
  one file per role), with platforms per area of responsibility.
- [x] Review the current role against the earlier CV and the LinkedIn profile
  export: start month (Nov 2017), CMS, performance and semantic SEO wording,
  and missing technical platforms (Mailchimp, Campaign Monitor, Search
  Console, structured data, Hotjar, UIkit, PHP). Design tools left out.
- [x] Add the technical roles from the earlier CV under "Earlier roles"
  (Freelance, I3 Zone Development, RPS Media, Urban Lava Advertising); the
  Royal Caribbean photography role is left out.
- [ ] Confirm or correct the earlier job titles; the CV only gives employers,
  so "Freelance Web Developer", "Front-end Developer" and "Web Developer" are
  descriptive placeholders.
- [ ] Replace the placeholder recommendations in
  `src/content/recommendations.json` with real ones (the full LinkedIn data
  export has `Recommendations_Received.csv`; ask each person before
  publishing their name and words), then remove `"placeholder": true`.
- [ ] Compare against the full LinkedIn export (positions and skills) when it
  arrives; the basic export only had the headline and summary.
- [ ] Write the full About page content (a short background paragraph is in
  place).
- [ ] Add the updated CV to `public/cv/` as `dennis-ferreira-cv.pdf` and
  `dennis-ferreira-cv.docx` (or change the `cv` list in the profile) so the
  Downloads page links to them.
- [ ] Replace the Gmail address in the profile's `contact` with an address on
  the site's own domain once it is registered.

## Core UI

- [ ] Build the final responsive pages with semantic landmarks, clear headings,
  and accessible navigation. Keep core content and navigation usable without
  JavaScript.
- [ ] Add purposeful interactions that support the content, work with a
  keyboard, and respect reduced-motion preferences.
- [ ] Build on Astro's static pages and client router; check navigation
  accessibility and the JavaScript budget as interactions are added.
- [ ] Decide how the section rail should work on iPads and phones (they keep
  the header links for now), and give it its final styling.
- [ ] Design the side element for the 150 px space reserved on the right of
  `main` from 1024 px (`--aside-space`).
- [ ] Check the scroll reveal and 80svh sections on a real phone, and decide
  whether short sections (for example Downloads) should stay that tall.
- [x] Add a self-hosted favicon and app icons from the DF logo (see README
  "Header").

## Physics icons (Matter.js)

- [x] Add a Matter.js placeholder to each content page that reacts to clicks
  and scrolling, loads only when needed, and respects reduced motion.
- [ ] Design the animated icons and replace the placeholder shapes, keeping
  them recognizable in both themes.
- [ ] Decide how scrolling and clicking should change the icons on each page,
  and which pages keep a scene.
- [ ] Check touch scrolling and performance on a real phone.
- [ ] On hold (waiting on example SVGs and visual styles): move the interactive
  element beside the hero content and drop "Interactive" from the scroll
  navigation. Test two SVGs built from the same nodes in two arrangements that
  morph between pages and while scrolling. Undecided: replacing or keeping
  Matter.js, which pages use which arrangement, and how it is fixed or sticky on
  mobile and desktop.

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

## Colour and icon design

- [x] Add a faint fixed dot grid behind every page whose dots move away from
  the cursor (see README "Dot grid background").
- [ ] Decide on the grid's final density and strength (18px apart, faint
  away from the cursor and brighter near it).
- [x] Remove the header background on large screens with a mouse, and keep the
  theme toggle and menu button fixed there while the logo hides on scroll.
- [ ] Decide how the header should behave on iPads and phones.

- [x] Add draft accent colours for the Core Responsibilities sections, readable
  in both themes.
- [x] Replace the per-area colours and gradient with one accent based on
  Pantone 13-0647 TCX Illuminating, with a darker shade of the same hue in
  light mode for contrast (see README "Accent colour").
- [x] Replace the yellow with Pantone 16-1546 TCX coral (`#ee7869`) in both
  themes; light-mode link text uses the text colour with a coral underline.
- [ ] Check the coral on real screens in both themes; coral lines and icons on
  white are 2.8:1, so decide whether any need a darker edge or a fill.
- [x] Test icons per area (Phosphor "regular" outlines, replacing "fill") on Experience and Skills, with a
  badge that morphs between them (flubber) on scroll, hover, and page change.
- [ ] Choose the final icons for each area and decide whether to keep the
  floating badge or move the morph into the hero graphic.
- [ ] Redesign how the area icons are shown; the current badge and inline
  icons stay for now as context for later work.
- [ ] Add an elastic effect and more shapes on the page that signify the
  current experience area or skill (follows the theme feedback work).
- [ ] Review small design examples and SVG icons (24 × 24, single colour,
  strokes outlined) to choose the icon style and interaction effects.

## Typography

- [ ] Choose fonts that suit the approved visual direction and are licensed for
  self-hosting. Record their sources and licenses. Headings use Lexend Deca
  (first choice; OFL-1.1); the body font is still to be chosen.
- [x] Self-host only the necessary font files and weights, with readable system
  fallbacks; avoid external font requests.

## Repository maintenance

- [ ] Clean up the local Git repository. On 2026-11-25, `git push` warned about
  too many unreachable loose objects: about 9,100 objects (37 MiB) in `.git`,
  against 243 KiB of packed history. These live only in the local `.git`
  folder. They are never pushed or deployed, so they do not affect the site's
  size or page speed. Run `git prune`, delete `.git/gc.log`, then
  `git gc`, and check with `git count-objects -vH`. Repeat if the warning
  returns.

## Before going live

- [ ] Remove the temporary Cloudflare Access restriction on the production
  site (`dfpf-26-27.pages.dev`, and the custom domain if added) so the public
  can view it. In Zero Trust, open Access controls > Applications >
  "dfpf-26-27 - Cloudflare Pages" and remove the production hostname (keep
  the `*` preview hostname if previews should stay private).
- [ ] Check layouts at 360 px and wider, keyboard access, focus visibility, and
  reduced-motion behavior.
- [ ] Run the Lighthouse checks and address failures: mobile performance and
  accessibility scores of at least 90, plus no more than 100 KiB of initial
  script transfer per page. Review inline scripts separately.
- [ ] Review applicable legal notices and any privacy implications before
  publishing real content or adding external services.
