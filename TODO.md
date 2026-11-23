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
- [ ] Establish an original visual direction and a simple hierarchy for the
  single-page experience.

## Core UI

- [ ] Build a responsive page with semantic landmarks, clear headings, and
  accessible navigation. Keep the core content and navigation usable without
  JavaScript.
- [ ] Add purposeful interactions that support the content, work with a
  keyboard, and respect reduced-motion preferences.
- [ ] Use Astro's static output and small, focused client-side code by default.
  Decide whether client-side routing is actually needed before adding it or a
  UI framework; assess any impact on accessibility and the JavaScript budget.

## Browser-preferred theme

- [ ] Provide light and dark styles using the browser or operating system's
  preferred color scheme, without requiring JavaScript.
- [ ] Check that the theme follows preference changes and that content,
  controls, and focus indicators remain visible in both themes.
- [ ] Verify text contrast of at least 4.5:1 for normal text and 3:1 for large
  text; verify relevant interface and focus indicators at 3:1 against adjacent
  colors.
- [ ] Decide whether a manual theme override is needed before adding one or
  storing a preference.

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
