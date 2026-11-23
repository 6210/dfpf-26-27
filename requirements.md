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

- Use Astro as the website framework and prefer static output by default.
- Target deployment to Cloudflare Pages. Confirm deployment settings and any
  runtime requirements when the project is set up.
- Use Matter.js only when a physics-based interaction is needed. It is not
  required on every page.
- If a feature needs server-side execution or another service, explain why,
  identify its deployment and privacy implications, and agree on the approach
  before adding it.

## Design and content

- Establish the site's purpose, intended audience, primary action, and real
  content before settling on a design.
- Use references to develop an original visual direction rather than copying
  another site.
- Keep interactions purposeful. Limit each page to one resource-intensive visual
  effect, such as a physics scene, 3D effect, shader, or particle system.
- Keep component and motion dependencies minimal; avoid introducing competing
  libraries for the same purpose without a documented reason.

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

The Lighthouse workflow provides automated checks, but blocking deployment
requires GitHub branch protection to require its status check and restrict direct
pushes to `main`. Until that is configured, Cloudflare can deploy a push before
the checks finish.

## Decisions still to make

- Site purpose, audience, primary action, content, and visual direction.
- Confirm Cloudflare Pages settings and the deployed site after connecting the
  repository.
- Whether physics or other motion is needed, and how it should behave.
- Applicable legal notices and any approved external services.