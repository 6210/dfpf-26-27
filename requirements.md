# Website Requirements

These are the initial requirements for this project, based on [stack.md](stack.md)
and [inspiration.md](inspiration.md). They are a starting point, not evidence that
the site has already met them. Update this document when a requirement is agreed
or changed.

## Highest priorities

Responsiveness, speed, and accessibility come first in design and development.
Do not trade them away for visual effects or other features without raising the
issue and discussing alternatives with the user before the change goes live.

## Stack

The stack in [stack.md](stack.md) is a starting point, not a fixed choice. A
framework, library, or host can be replaced when an alternative better serves
the highest priorities above; explain the trade-offs and agree on the change
before switching.

- Use Astro as the website framework and prefer static output by default.
- Target deployment to Cloudflare Pages. Confirm deployment settings and any
  runtime requirements when the project is set up.
- Use Matter.js only when a physics-based interaction is needed. It is not
  required on every page.
- If a feature needs server-side execution or another service, explain why,
  identify its deployment and privacy implications, and agree on the approach
  before adding it.

## Design and content

- Create an interactive experience for recruiters and other potential hirers,
  with distinct, shareable URLs for relevant work and experience and SPA-style
  navigation between pages.
- Make the site's purpose, evidence of work, and next action easy to find. Use
  approved content and examples; do not invent experience or publish sensitive
  project information.
- Use the existing repository Markdown as a starting reference for professional
  experience, not as automatically published content. Keep the website's content
  source flexible so another format or source can be adopted later.
- Establish the site's purpose, intended audience, primary action, and real
  content before settling on a design.
- Position the owner for SEO, CRM integration, and campaign technology roles in
  a marketing context (currently Lead Technical Website Developer in a
  marketing department), not as a general developer. Lead with the most
  relevant areas and platforms.
- Keep career content structured like a CV in `src/content/`: one entry per
  role with dates, areas of responsibility, and the platforms used in each.
  Use current product names (for example, Salesforce Marketing Cloud Account
  Engagement (Pardot)) so recruiters recognise them.
- Offer the CV as a download from the relevant pages once the owner supplies
  it. It is public: exclude home address, ID numbers, and other personal data
  the owner would not publish. The Downloads page lists every CV version.
- Show the owner's email address and phone number in "Get in touch" on every
  page (approved by the owner on 2026-11-24). Keep them out of the built HTML
  as plain text, with light protection that does not hinder visitors, and keep
  them readable without JavaScript.
- Follow the browser or operating system's light or dark preference by default.
  Both themes must remain readable and accessible, including when the preference
  changes.
- Provide a keyboard-accessible light/dark toggle. A visitor's choice overrides
  their system preference and is remembered on their device with
  `localStorage` (no cookies, no server request). Without JavaScript, the site
  follows the system preference and the toggle is hidden.
- Fade between themes rather than switching colors instantly, except for
  visitors who prefer reduced motion.
- Use a small set of self-hosted fonts with suitable fallback fonts. Check
  licenses and avoid third-party font requests. Do not use a CDN for fonts or
  other assets, at build time or in the visitor's browser; install fonts as
  pinned packages and serve them from this site.
- Keep the initial content and navigation usable without JavaScript; add
  interactive behavior progressively. Use Astro's client router for SPA-style
  navigation without introducing a separate routing or UI framework.
- Use references to develop an original visual direction rather than copying
  another site.
- Keep interactions purposeful. Limit each page to one resource-intensive visual
  effect, such as a physics scene, 3D effect, shader, or particle system.
- Prototype the node-and-line hero animation on the homepage only. Generate the
  icon from individual accent-colour dots and connecting lines, reuse those
  same nodes for marketing-chart and web-development shapes, and loop with
  four seconds on each shape before morphing. Keep idle movement subtle and
  let nearby dots respond gently to the mouse. Provide a pause control, a
  still reduced-motion version, and a complete icon without JavaScript.
  Pause when off screen or in a hidden tab. This uses coordinate interpolation,
  not a physics simulation or static icon library.
  Keep the accent icon simple:
  code brackets and a slash without a browser frame, and a growth arrow without
  chart axes or bars. Preserve the icon positions and use restrained depth and
  mouse parallax. Use fewer accent nodes, with the largest marketing node at
  the arrowhead. Match both development bracket corners to the central slash
  midpoint's large node size, tapering adjacent dots smaller. Extend the left
  bracket's upper arm and the right bracket's lower arm towards the centre
  with one extra connected node each; do not add cross-links or literal rings.
  Keep these full extended arms straight, equal in length, and evenly spaced
  from corner to endpoint. Use one depth plane for the code icon and move the
  accent icon together during idle drift so perspective and idle motion do
  not introduce kinks. Retain the individual mouse response and collision gap.
  Reuse these nodes through the morph, giving them distinct positions along
  the arrow's existing lines rather than merging or stacking them. Connect
  the arrow's distinct junctions without adding cross-links to the code shape.
  Retain the extended arrowhead arms, redistributing existing dots rather
  than adding extra dots halfway between others. Keep the
  arrowhead tip fixed and grow the final rising shaft's dots progressively
  larger towards it. Keep the paired-node configuration
  ready for further refinement of both shapes. Do not enlarge the arrow's
  bottom-left starting node.
  Interpolate node sizes as well as coordinates during the morph.
  Use even centre-to-centre spacing across all connected strokes within each
  target, including the arrow's start, bends, rising shaft, and arrowhead arms.
  Treat spacing independently of radius: preserve the established organic
  large/small node pattern rather than imposing a uniform size ramp.
  Keep both accent targets on one depth plane so projection does not create
  artificial bunching. Preserve the recognizable outlines and their anchors.
  On desktop, enlarge the visual to approximately 1.8 times the original
  prototype size; keep it within the available width on smaller screens.
  Match accent connections to the context navigation's one-CSS-pixel lines,
  keeping their screen thickness constant when the SVG scales. Extend the
  neutral background across the homepage intro, including above and beside the
  icon, as an irregular star constellation rather than a circular cloud.
  Concentrate most neutral dots close to the accented shapes, with a smaller,
  sparse set of outliers across the intro rather than an evenly spread field.
  Increase the nearby density and include a slightly larger outlier variant
  distributed broadly across the hero, not just around the icon.
  Fill the lighter areas above, below, and to the right of the main icon
  with additional irregularly scattered neutral dots. Include a third,
  larger outer-dot size in all three areas without adding accent nodes.
  Include every new dot in the same 3 CSS px collision clearance as the
  existing neutral and accent dots, including during mouse interaction.
  Keep these dots behind the content, with depth-dependent sizes and brightness.
  Accent nodes should gently attract towards the mouse without losing the
  outline. Neutral dots should repel from the mouse and keep clear of nearby
  accent nodes, settling back when the mouse leaves. While the mouse is nearby,
  show faint temporary connections between nearby neutral dots, not extra dots.
  Every hero dot must remain distinct: no accent/accent, neutral/neutral, or
  accent/neutral touching or overlap, including across the local and intro-wide
  layers. Resolve their visible radii together before painting, maintaining
  a gap through morphs, mouse movement, resizing, pause, and reduced motion.
  Keep the initial static SVG non-overlapping too. Do not solve collisions by
  shrinking or hiding individual dots. Reveal the intro-wide stars only after
  their first collision layout; without JavaScript retain the static local
  constellation and complete icon.
  Limit these to 32 short lines and two connections per dot; hide them on leave,
  pause, reduced motion, or when the intro or tab is hidden.
  Use the graph's existing clock and pause control; keep the constellation still
  without JavaScript or with reduced motion, and do not intercept content interactions.
  Pair the arrow with "Technical Marketing Implementer" and the code shape
  with "Technical Website Developer" in the large homepage heading. Keep the
  existing typography, roll changing letters from left to right with a
  counter-like effect during the morph, and retain the buttons below the
  graphic without a duplicate small role label. Use the same clock for heading
  and graph so pause, visibility changes, manual changes, and reduced motion
  remain synchronized. Reserve space to avoid layout shifts and provide a
  stable accessible heading rather than repeated screen-reader announcements.
- Make the background grid almost invisible at the start of each hero/intro,
  fading back to its existing appearance by the following section. Preserve
  the grid's normal styling and interactions in subsequent sections, including
  a static fade without JavaScript and with reduced motion.
- Use Matter.js for physics-based animated icons that respond to scrolling and
  clicking. Load it only when needed, pause it when off screen, give click
  actions a keyboard equivalent, and keep the scene decorative so no content
  depends on it.
- Keep component and motion dependencies minimal; avoid introducing competing
  libraries for the same purpose without a documented reason.

## Search and discoverability

- Serve meaningful content and ordinary links in each page's initial HTML.
  Give indexable pages descriptive, distinct titles, descriptions, headings, and
  canonical URLs using the agreed production domain.
- Keep placeholder pages marked `noindex` until their content is approved and
  ready for search. Before launch, review indexing, a sitemap of approved pages,
  robots guidance, and the behavior of missing URLs on the deployed host.
- Treat page speed as one part of SEO, alongside useful content, accessibility,
  crawlability, appropriate metadata, and stable shareable URLs.

## Accessibility and responsiveness

- Support keyboard navigation and provide a visible focus indicator.
- Respect the visitor's reduced-motion preference, including for physics-based
  interactions. Essential content and functionality must remain available.
- Ensure layouts and essential interactions work at a viewport width of 360 px
  and on larger screens, without unintended horizontal scrolling or obscured
  content.
- Check affected pages at narrow and wide viewport widths, including keyboard
  operation and readable content.
- Use semantic HTML and accessible names for interactive elements and images
  where applicable.

## Performance and privacy

- Each generated page must score at least 90 for performance and accessibility
  in a Lighthouse mobile audit of the production build.
- Each page's initial load must transfer at most 100 KiB (102,400 bytes) of
  JavaScript, as reported by Lighthouse's script resource summary. Interactions
  are welcome within this budget; defer optional code until it is needed. This
  measurement excludes inline scripts in HTML, so review their size separately.
- The automated Lighthouse check must pass before a change goes live. It does
  not replace manual checks of responsive layouts, keyboard operation, motion,
  or accessibility. Record and report checks that could not be completed.
- Do not load third-party resources from the visitor's browser by default.
  Self-host fonts, scripts, and other assets where permitted by their licenses.
- Before adding an external request, analytics, cookies, or personal-data
  collection, explain the need and privacy implications and obtain approval.
- Do not commit credentials, tokens, or personal data, apart from the contact
  details the owner approved for publication.

## Licenses and legal

- Record the license and source of each added library or asset, and verify that
  its intended use and self-hosting are permitted.
- Determine which legal notices and privacy information apply before launch;
  their content and legal review remain to be agreed.

## Review before committing or going live

1. Read this file before implementing a change and review it again before
   committing or deploying.
2. Check design and development decisions against the applicable requirements,
   especially responsiveness, speed, and accessibility. Run relevant checks and
   state what could not be verified.
3. Flag conflicts, failures, and unverified requirements to the user before they
   go live. Identify the affected page or feature and requirement, explain the
   problem, and suggest practical alternatives. Do not present an unverified
   requirement as satisfied.
4. Resolve issues or explicitly agree on exceptions before committing or
   deploying. Treat a push to an automatically deployed branch as a deployment:
   complete this review before pushing.
5. Update this file when an agreed change affects the requirements.

The GitHub Actions workflow deploys `main` only after the Lighthouse checks pass.
This gate is effective only after Cloudflare's automatic production deployments
are disabled and the GitHub deployment secrets are configured. Until then,
Cloudflare can deploy a push before the checks finish.

## Decisions still to make

- Exact primary action, approved content, and visual direction.
- The start month of the current role, the earlier roles from the previous CV,
  and the review of the listed platforms.
- Whether to provide a way to reset the theme to the system preference.
- The final production domain, approved search snippets, and sitemap contents.
- Which pages keep a physics scene, the icon designs, and exactly how scrolling
  and clicking should change them.
- Applicable legal notices and any approved external services.