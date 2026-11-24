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
  the owner would not publish.
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
- Do not commit credentials, tokens, or personal data.

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