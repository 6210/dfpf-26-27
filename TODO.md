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
- [ ] Review the current role's areas, wording, and platforms; add any missing
  platforms and the start month.
- [ ] Add the roles from the earlier CV, then update them for the current
  market.
- [ ] Write the About page content.
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

- [x] Add draft accent colours for the Core Responsibilities sections, readable
  in both themes (see README "Highlight colours (draft)").
- [ ] Decide the final palette; update the accent properties and recheck
  contrast.
- [x] Test icons per area (Phosphor "fill") on Experience and Skills, with a
  badge that morphs between them (flubber) on scroll, hover, and page change.
- [ ] Choose the final icons for each area and decide whether to keep the
  floating badge or move the morph into the hero graphic.
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
