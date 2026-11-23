# Current Role Responsibilities

## Role Summary

I own the technical delivery and ongoing operation of Powerfleet's marketing websites and digital demand-generation systems. My work connects the website platform, campaign experiences, marketing automation, analytics, regional content, and lead-conversion workflows. I take projects from requirements and implementation through testing, release, monitoring, and documentation.

This is a working description inferred from the project documentation in this folder, not a formal company-issued job title or job description.

## Core Responsibilities

### Website and Platform Operations

- Build and maintain Joomla and YOOtheme websites, templates, child-theme overrides, modules, scripts, styles, and page-builder experiences.
- Deliver and support the main Powerfleet web estate, regional sites, campaign microsites, careers content, and supporting site utilities.
- Diagnose website, CMS, deployment, performance, and editor-workflow issues using reproducible tests and available logs.
- Maintain clear development-to-production controls: test changes in development, document evidence, preserve backups, and promote only reviewed changes.
- Coordinate hosting, CDN, DNS, and security-provider investigations when the cause lies outside the application; keep infrastructure changes with the responsible provider or administrator.

### Campaign Experiences and Lead Generation

- Build and support regional landing pages, PPC campaign pages, product and industry experiences, and interactive marketing content.
- Implement and maintain lead forms and multi-step workflows for demo requests, partner applications, referrals, customer support, careers, and incident reporting.
- Connect front-end experiences to Pardot forms and handlers, including field mappings, completion behavior, validation, regional routing, and UTM attribution.
- Develop interactive tools such as ROI and savings calculators, translating business requirements and approved assumptions into responsive, testable customer experiences.
- Maintain reusable campaign components and form utilities so new regional or product campaigns can follow established patterns.

### Marketing Automation and Data Capture

- Maintain the browser-side and server-side integrations that carry campaign and session context into form submissions.
- Preserve UTM and campaign parameters across pages and embedded forms, and support source, region, device, and referral attribution.
- Review lead-field requirements against existing CRM/Pardot fields before proposing schema changes; keep payloads and handler mappings aligned.
- Implement validation and submission safeguards, including reCAPTCHA and same-origin submission proxies where required.
- Protect personal and campaign data by limiting collection and persistence to the approved use case and avoiding exposure of credentials or sensitive session data.

### Analytics and Advertising Measurement

- Implement, test, and document Google Tag Manager and GA4 measurement for forms, resource downloads, video engagement, campaign interactions, and calculator submissions.
- Support conversion tracking across Google Ads and other advertising platforms, including event contracts, regional conversion actions, triggers, and tags.
- Validate that conversion events fire on successful outcomes, distinguish primary optimization signals from supporting reporting events, and investigate discrepancies across analytics and ad platforms.
- Maintain GTM maps and exports as auditable references, and coordinate measurement changes with campaign and agency stakeholders.
- Validate Salesforce/CRM conversion exports and prepare correctly structured files for advertising-platform imports.

### Regional Content, SEO, and Brand Transition

- Support market- and language-specific experiences, including country, currency, phone, routing, and translated-content behavior.
- Maintain regional language packs and legal-content inventories, page structures, menu associations, and publication checklists.
- Plan and validate legacy-domain migrations with approved, page-specific redirect mappings rather than speculative catch-all redirects.
- Audit URLs, redirects, tracker domains, crawlability, and related technical SEO behavior; document evidence and unresolved content decisions.
- Help migrate brand and content assets across platforms, including website video libraries and embedded media workflows.

### Privacy, Security, and Reliability

- Build privacy and consent requirements into forms, tracking, cookies, persistence, and campaign workflows, with GDPR and POPIA considered where applicable.
- Use backups, rollback references, environment separation, release notes, and focused regression checks to reduce production risk.
- Investigate security and availability incidents without making speculative production changes; preserve sanitized evidence and coordinate with the relevant security, hosting, or CDN provider.
- Keep secrets, personal information, raw logs, and sensitive exports out of tracked documentation and public repositories.

### Documentation and Operational Ownership

- Maintain repositories as practical sources of truth for implementation details, deployment steps, field mappings, testing, incidents, and open decisions.
- Turn ambiguous requests into scoped technical work, identify required business or legal approvals, and record what is verified versus pending.
- Own implementation and routine validation for the marketing systems represented here; involve agencies and external providers for findings, monitoring, or services they control.

## Representative Project Areas

These repositories illustrate the breadth of the role; they are examples, not a complete list of active services.

| Area | Representative repositories |
| --- | --- |
| Main website and platform operations | [powerfleet-cons](powerfleet-cons/README.md), [ytp-child-theme](ytp-child-theme/README.MD), [careers-powerfleet](careers-powerfleet/README.md), [mix-joomla](mix-joomla/README.md) |
| Calculators and conversion journeys | [roi-calculator-main-site](roi-calculator-main-site/README.MD), [roi-calculator-cnx](roi-calculator-cnx/README.MD), [sme-calculator](sme-calculator/README.MD) |
| Pardot, forms, and attribution | [pardot-form-scripts](pardot-form-scripts/README.md), [pardot-forms](pardot-forms/README.md), [analytics-storage-data](analytics-storage-data/README.md), [regional-sales-forms](regional-sales-forms/readme.md), [rmd-forms](rmd-forms/README.md) |
| Measurement and advertising | [powerfleet-gtm-map](powerfleet-gtm-map/README.MD), [advanced-conversion-tracking](advanced-conversion-tracking/README.md) |
| Regional campaigns and content | [mix-eu-lp](mix-eu-lp/README.md), [mix-global-gps-lp](mix-global-gps-lp/README.md), [mix-vision-standalone-za](mix-vision-standalone-za/README.md), [content-syndication](content-syndication/README.md) |
| Legal content, localization, and migration | [legal-pages-powerfleet](legal-pages-powerfleet/README.md), [language-region-packs](language-region-packs/README.md), [global-redirects](global-redirects/README.MD) |
| Reliability and media operations | [link-11-reblaze](link-11-reblaze/README.md), [vimeo-videos](vimeo-videos/README.MD) |
| Forms and supporting tools | [campaign-request-forms](campaign-request-forms/README.md), [partner-request-form-us](partner-request-form-us/README.md), [referral-link-generator](referral-link-generator/README.md), [cookie-modals](cookie-modals/README.md) |

## Scope Notes

The folder also contains legacy campaign builds, brief or placeholder READMEs, Joomla distributions, third-party assets, and experiments. Their presence is useful technical context but does not, by itself, establish that each is an actively maintained business responsibility. The core role above is based on recurring ownership patterns and the operational guidance documented across the project READMEs.

## Website project setup

The website is a minimal, static Astro starter. Its content and design are
placeholders; see [requirements.md](requirements.md) for the agreed baseline and
open decisions.

Use Node.js 22.23.4 or newer on a supported even-numbered release, then run:

```sh
npm ci
npm run dev
```

Run `npm run build` to generate the static site in `dist/`, and
`npm run preview` to preview the build locally.

### Deploy to Cloudflare Pages

1. Commit and push the intended project files to the GitHub repository.
2. In the Cloudflare dashboard, select **Workers & Pages**, then
   **Create application** > **Pages** > **Import an existing Git repository**.
3. Connect the repository and configure:
   - Production branch: `main`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable: `NODE_VERSION=22.23.4`
4. Select **Save and Deploy**. Open the resulting `pages.dev` URL to verify the
   deployed page.

The site is static, so no Cloudflare adapter or Matter.js dependency is needed
for this initial page. Connecting a repository and deploying require access to a
Cloudflare account.

The initial `Hello World` page scored 100 for mobile performance in Lighthouse
13.6.0 against a local production preview on 2026-11-23 (Headless Chrome 157 on
macOS). Repeat the audit against the deployed site before launch.

### Website quality checks

With Chrome or Chromium installed, run `npm run build` followed by
`npm run quality`. Lighthouse checks every discovered static page using its
mobile settings. The check fails if performance or accessibility scores are
below 90, the viewport check fails, or the initial script transfer exceeds
100 KiB. Inline scripts are part of the HTML response and are not included in
the script transfer budget. Keyboard, reduced-motion, and responsive-layout
checks still require manual testing.

The GitHub Actions workflow runs the same check on pull requests and pushes to
`main`. To prevent a failing change from reaching Cloudflare Pages, configure
GitHub branch protection for `main`:

1. After the workflow has run at least once, open the repository's **Settings**
   > **Branches** and add a protection rule for `main`.
2. Require a pull request before merging and require the **Lighthouse quality**
   status check to pass. Disable bypasses, including administrator bypass.
3. Make changes on a separate branch and merge only after the check passes and
   the manual checks are complete.

Branch protection availability depends on the repository's GitHub plan and
permissions. Until it is enabled, Cloudflare deploys direct pushes to `main`
without waiting for this workflow.

### Direct dependencies

| Dependency | Purpose | License | Source |
| --- | --- | --- | --- |
| Astro | Static website framework | MIT | https://github.com/withastro/astro |
| Lighthouse CI | Build quality checks | Apache-2.0 | https://github.com/GoogleChrome/lighthouse-ci |

See [dependency-licenses.md](dependency-licenses.md) for the locked dependency
inventory and licensing review notes. Update the inventory and review the built
output when dependencies or assets change.
