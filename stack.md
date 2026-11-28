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
- **[Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/)
  (Zero Trust Free plan)**: keeps the live site and preview links private while
  the site is in development; only the owner's email can sign in with a
  one-time code. To be removed from the live hostname before launch.

## Framework and content

- **[Astro](https://astro.build/)**: builds every page to static HTML with no
  server. It is used for:
  - `.astro` components and the shared layout (header, menu, footer, Get in
    touch, CV downloads).
  - Content collections (`astro:content` with the `glob` and `file` loaders)
    and Zod schemas (`astro/zod`). Roles come from Markdown in
    `src/content/roles/`, profile details from `src/content/profile.json` and
    recommendations from `src/content/recommendations.json`,
    so copy is edited in files rather than in templates.
  - The fonts API (`astro:assets` `Font`), which self-hosts and preloads the
    heading font.
  - View transitions (`ClientRouter` and `navigate` from `astro:transitions`),
    which give the fade up/down page-to-page animation while the header stays
    in place.
- **[TypeScript](https://www.typescriptlang.org/)**: types for component
  scripts, the content config, and helpers in `src/lib/`.
- **[Markdown](https://commonmark.org/) and JSON**: content files for roles,
  profile data and recommendations.

## Visitor-facing libraries and assets

- **[Matter.js](https://brm.io/matter-js/)**: the 2D physics engine behind the
  interactive shape placeholders (`PhysicsPlaceholder.astro`). It is loaded on
  demand when a placeholder comes into view, so it is not part of the first
  page load, and it is not loaded at all for visitors who prefer reduced
  motion.
- **[flubber](https://github.com/veltman/flubber)** (MIT): smoothly morphs one
  SVG shape into another. Morphs the floating area badge (`AreaBadge.astro`)
  from one area icon to the next as visitors scroll, hover, or change page, so
  Skills and Experience share one visual (for example Google Tag Manager with
  the Analytics icon). Loaded on demand for the first animated morph; visitors
  who prefer reduced motion get an instant swap.
- **[Phosphor Icons](https://phosphoricons.com)** ("regular" outline weight, MIT): one
  icon per area of work (gear, megaphone, flow arrow, chart, magnifying glass,
  document), copied as SVG paths into `src/lib/area-icons.ts` rather than
  installed, and shown beside areas on Experience and platforms on Skills.
- **[Lexend Deca](https://fontsource.org/fonts/lexend-deca) via Fontsource**:
  the bold heading font (h1 and other headings), installed from npm and
  served from this site, not a font CDN.

- **Theme toggle icon adapted from [toggles.dev](https://toggles.dev/toggles/spin)**
  ("Spin" by Alfie Jones, MIT): the sun-to-moon icon on the light/dark
  button (`ThemeToggle.astro`). Copied in as inline SVG and CSS, not installed
  as a package, so it adds no script.

## Browser platform features (no library needed)

- **Popover API**: the full-screen hamburger menu opens and closes, handles
  Escape, and returns focus without JavaScript. Also shows the short "Dark
  mode on" / "Light mode on" message after a theme switch, in the top layer
  above the menu.
- **View Transitions API**: the browser feature that Astro's view transitions
  use for page-to-page animation.
- **SVG `clipPath` and the CSS `d` property**: morph the theme toggle icon
  between an outlined circle and an outlined crescent.
- **SVG lines and circles, `DOMPoint` and `getScreenCTM()`**: the homepage-only
  `HeroGraph.astro` draws procedurally sampled nodes and their connections.
  `hero-graph.ts` defines paired chart/code strokes; coordinate interpolation
  reuses the same nodes between shapes without an icon or animation library.
  Lightweight perspective projection adds depth to the icon and 192 nearby
  neutral dots. These form a dense, irregular cluster sampled around both
  shapes, not a spherical boundary. Accent nodes taper away from the arrowhead
  and the code icon's slash midpoint and bracket corners. The arrow's extended
  arms reuse the same dots, while its rising shaft grows
  progressively towards the tip; radii interpolate
  alongside coordinates. Full path chains distribute the existing nodes with
  one centre spacing per target, independent of their established radii, rather
  than inserting halfway dots. Both icons use a single depth plane so the code's
  equal-length, evenly sampled extended arms remain straight under perspective.
  Accent idle drift moves the icon together instead of bending individual
  strokes. Two extra code-arm endpoints take distinct positions
  along the arrow strokes. Shape-specific edge visibility keeps both outlines
  connected as intended without stacking junctions or introducing code cross-links.
  Bounded offset helpers attract accent nodes towards the cursor without
  overshooting, while repelling neutral dots. A shared, ordered circle layout
  separates all accent and neutral nodes, including intro-wide stars, by their
  rendered radii plus 3 CSS px. Bounded directional escape handles dense groups
  without shrinking or hiding colliding dots. The server separates the static
  SVG too; outer stars are revealed only after their first responsive layout.
  SVG coordinate conversion keeps mouse displacement and parallax accurate at
  any size; no WebGL or 3D library is needed.
- **Pooled SVG overlay and `ResizeObserver`**: a fixed pool of 32 faint lines
  in `PageHero.astro` temporarily connects nearby neutral dots under the mouse,
  with at most two connections per dot. `HeroGraph` converts local SVG dots and
  intro-wide stars to shared CSS-pixel coordinates. The observer refreshes star
  sizes and alignment on resize and disconnects during Astro navigation.
  Links stay hidden without JavaScript, with reduced motion, or while paused.
- **CSS `translate` and deterministic star positions**: `PageHero.astro`
  renders 136 outliers across the homepage intro: the original 64 hero-wide
  dots plus 72 filling the upper, lower, and right-hand gaps around the icon.
  A third 6–7.5 px base size appears throughout these areas, complementing
  the smaller outliers and dense SVG cluster. Outer dots scale by 1.8 on
  desktop, and all share the collision layout.
  Depth changes size, brightness, drift, and repulsion
  response. `HeroGraph` eases both sets using its existing frame clock;
  the decorative layer remains pointer-transparent and works without JavaScript.
- **SVG `vector-effect: non-scaling-stroke`**: keeps hero icon connections at
  the same one-CSS-pixel thickness as the context navigation, through the shared
  `--node-line-width` token, regardless of the graph's responsive size.
- **CSS grid overlays, `lh` units, and clipped letter reels**: `HeroTitle.astro`
  reserves the larger width of each changing word and sizes alphabet reels to
  the inherited heading line height. `HeroGraph` advances the letters from
  left to right with its existing frame clock, keeping the heading and node
  morph synchronized without another animation library or timer.
- **CSS `isolation` and gradient `mask-image`**: keep each `PageHero` backdrop
  behind its content, gently obscuring the fixed dot grid near the top and
  revealing its normal styling at the next section. This needs no scroll
  script and also works without JavaScript or animation.
- **CSS `backdrop-filter`**: blurs the page behind the open menu.
- **CSS `clamp()`, `max()` and `svh` units**: the fluid layout. The page
  gutter, page width and physics stage height grow smoothly with the screen
  between a few breakpoints (see "Layout and breakpoints" in the README).
- **CSS grid `auto-fill` with `minmax()`**: the Experience responsibility
  cards flow into one, two or three columns depending on the available width.
- **CSS scroll-driven animations (`animation-timeline: view()`)**: sections'
  content slides in as it scrolls into view, without JavaScript. Unsupported
  browsers show the content static. The Experience timeline gives each role a
  named view timeline (`view-timeline`) in one pinned (`position: sticky`)
  view, to slide its responsibilities sideways one at a time, show only the
  current role and fill a year axis. The slide and the line follow a
  scroll-animated `--progress` value through a short CSS transition, which
  eases them after the scroll.
- **CSS `@property` and counters**: the Experience timeline's progress, year
  and years of experience are registered custom properties animated by the
  scroll; the year and years are shown with `counter()`.
- **CSS container style queries**: the Experience timeline says "1 Year
  Experience" rather than "Years" by checking the counted value.
- **CSS container query units (`cqi`)**: the Experience timeline works out how
  far the cards slide from the width of the column they cross.
- **CSS `@starting-style` and transitions**: menu entry animations and the
  light/dark colour fade.
- **`prefers-color-scheme`, `prefers-reduced-motion`,
  `prefers-reduced-transparency`**: default theme, turning motion off, and a
  solid menu veil when requested.
- **`localStorage`**: remembers the chosen light or dark theme.
- **Passive `scroll` listener and `getBoundingClientRect`**: the scroll spy
  that highlights the current section in the header, and the header that hides
  on scroll down and returns on scroll up.
- **`requestAnimationFrame`**: the eased smooth scroll for in-page links, the
  interactive dot background, and the homepage graph's timed morph, subtle
  drift, intro constellation, and synchronized rolling role heading. These stop
  together when paused, off screen, in a hidden tab, or when reduced motion
  is preferred.
- **`IntersectionObserver`**: loads Matter.js only when a shape placeholder
  scrolls near the screen, pauses the physics while it is off screen, and
  pauses the homepage graph, stars, and heading when the whole intro is off screen.
- **`matchMedia`**: reads the reduced-motion preference in scripts.
- **Page Visibility API (`visibilitychange`)**: stops the homepage graph in
  background tabs without advancing its animation clock.
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
  page three times and fails the build if the median is below 90 for
  performance or accessibility, or if a page ships more than 100 KiB of script.
  The median smooths out one-off slow runs on the shared CI machines.

## Documentation

- **[Mermaid](https://mermaid.js.org/)**: the build and deploy diagram in the
  README and the page and component map in [flow.md](flow.md), rendered by
  GitHub. It is not shipped to the website.
