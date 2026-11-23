# Website Requirements

These are the initial requirements for this project, based on [stack.md](stack.md)
and [inspiration.md](inspiration.md). They are a starting point, not evidence that
the site has already met them. Update this document when a requirement is agreed
or changed.

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
  and on larger screens.
- Use semantic HTML and accessible names for interactive elements and images
  where applicable.

## Performance and privacy

- Target a Lighthouse mobile performance score of at least 90 on a production
  build. Record the page tested, environment, and result; investigate failures
  rather than treating an unrun test as a pass.
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

## Review before committing

1. Read this file before implementing a change and review it again before
   committing.
2. Check the proposed change against the applicable requirements. Run the
   relevant checks when tooling exists; otherwise state what could not be
   verified.
3. Report any conflict or gap to the user with the affected requirement, the
   problem, and practical suggestions. Do not present an unverified requirement
   as satisfied. Resolve or explicitly agree on exceptions before committing.
4. Update this file when an agreed change affects the requirements.

This is a review process for contributors and coding assistants, not an
automated Git hook. A commit is not technically blocked by this document.

## Decisions still to make

- Site purpose, audience, primary action, content, and visual direction.
- Confirm Cloudflare Pages settings and the deployed site after connecting the
  repository.
- Whether physics or other motion is needed, and how it should behave.
- Applicable legal notices and any approved external services.