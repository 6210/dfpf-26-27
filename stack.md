# Stack

Everything this site uses, and what it is used for here. Add an entry whenever
a new tool, library, service, or browser feature starts being used, and remove
it when it is dropped. Exact package versions live in
[package.json](package.json); licenses are in
[dependency-licenses.md](dependency-licenses.md).

## Hosting and delivery

- **[Cloudflare Pages](https://www.cloudflare.com/products/pages/)**: hosts the
  static build (`dist/`) at https://dfpf-26-27.pages.dev.
- **[GitHub](https://github.com/) and
  [GitHub Actions](https://docs.github.com/actions)**: the repository is the
  source of truth. On every pull request and every push to `main`, the
  *Website quality* workflow
  ([.github/workflows/quality.yml](.github/workflows/quality.yml)) installs,
  builds, tests, and runs Lighthouse, and deploys only if all of those pass.
- **[Wrangler](https://developers.cloudflare.com/workers/wrangler/) via
  `cloudflare/wrangler-action`**: the workflow step that uploads `dist/` to
  Cloudflare Pages after the checks pass.

## Framework and content

- **[Astro](https://astro.build/)**: builds every page to static HTML with no
  server. It is used for:
  - `.astro` components and the shared layout (header, menu, footer, Get in
    touch, CV downloads).
  - Content collections (`astro:content` with the `glob` and `file` loaders)
    and Zod schemas (`astro/zod`). Roles come from Markdown in
    `src/content/roles/` and profile details from `src/content/profile.json`,
    so copy is edited in files rather than in templates.
  - The fonts API (`astro:assets` `Font`), which self-hosts and preloads the
    heading font.
  - View transitions (`ClientRouter` and `navigate` from `astro:transitions`),
    which give the fade up/down page-to-page animation while the header stays
    in place.
- **[TypeScript](https://www.typescriptlang.org/)**: types for component
  scripts, the content config, and helpers in `src/lib/`.
- **[Markdown](https://commonmark.org/) and JSON**: content files for roles and
  profile data.

## Visitor-facing libraries and assets

- **[Matter.js](https://brm.io/matter-js/)**: the 2D physics engine behind the
  interactive shape placeholders (`PhysicsPlaceholder.astro`). It is loaded on
  demand when a placeholder comes into view, so it is not part of the first
  page load, and it is not loaded at all for visitors who prefer reduced
  motion.
- **[Lexend Deca](https://fontsource.org/fonts/lexend-deca) via Fontsource**:
  the bold heading font (h1 and the name in the header), installed from npm and
  served from this site, not a font CDN.

## Browser platform features (no library needed)

- **Popover API**: the full-screen hamburger menu opens and closes, handles
  Escape, and returns focus without JavaScript.
- **View Transitions API**: the browser feature that Astro's view transitions
  use for page-to-page animation.
- **CSS `backdrop-filter`**: blurs the page behind the open menu.
- **CSS `@starting-style` and transitions**: menu entry animations and the
  light/dark colour fade.
- **`prefers-color-scheme`, `prefers-reduced-motion`,
  `prefers-reduced-transparency`**: default theme, turning motion off, and a
  solid menu veil when requested.
- **`localStorage`**: remembers the chosen light or dark theme.
- **Passive `scroll` listener and `getBoundingClientRect`**: the scroll spy
  that highlights the current section in the header, and the header that hides
  on scroll down and returns on scroll up.
- **`requestAnimationFrame`**: the eased smooth scroll for in-page links.
- **`IntersectionObserver`**: loads Matter.js only when a shape placeholder
  scrolls near the screen, and pauses the physics while it is off screen.
- **`matchMedia`**: reads the reduced-motion preference in scripts.
- **`inert`**: keeps focus inside the open menu.

## Quality and testing

- **[Node.js](https://nodejs.org/)** (version pinned in `.node-version`): runs
  the build, tests, and tooling.
- **[npm](https://www.npmjs.com/)**: installs pinned dependencies from
  `package-lock.json`.
- **[Node test runner](https://nodejs.org/api/test.html)** (`node --test`):
  page tests in `tests/` that check the built HTML (metadata, crawlable
  navigation, content).
- **[Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)**
  (`@lhci/cli`, [lighthouserc.json](lighthouserc.json)): scores every built
  page and fails the build below 90 for performance or accessibility, or if a
  page ships more than 100 KiB of script.

## Documentation

- **[Mermaid](https://mermaid.js.org/)**: the build and deploy diagram in the
  README and the page and component map in [flow.md](flow.md), rendered by
  GitHub. It is not shipped to the website.
