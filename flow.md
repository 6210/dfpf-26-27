# Site flow

How the pages, components, and content fit together. Update these diagrams
whenever a page, component, or content source is added, removed, or rewired.
The diagrams render on GitHub and in Markdown viewers with Mermaid support.

## Pages and navigation

Every page shares the header (scroll spy and full-screen menu) and the footer,
so any page can reach any other. The scroll spy links jump between sections on
the current page.

```mermaid
flowchart LR
    Home["Home<br/>/"]
    About["About<br/>/about/"]
    Experience["Experience<br/>/experience/"]
    Skills["Skills<br/>/skills/"]
    Downloads["Downloads<br/>/downloads/"]
    NotFound["404<br/>(unknown URLs)"]

    Menu{{"Menu and footer navigation<br/>(SiteNav)"}}

    Menu --- Home & About & Experience & Skills & Downloads
    NotFound --> Menu
    Home -- "Explore experience" --> Experience
    Home -- "More about me" --> About
    Home & About & Experience -- "CV download" --> Downloads
```

## Components and content

`SiteLayout` wraps every page. Pages add their own components and read content
through the helpers in `src/lib/content.ts`.

```mermaid
flowchart TD
    subgraph Pages["src/pages"]
        index["index.astro"]
        about["about.astro"]
        experience["experience.astro"]
        skills["skills.astro"]
        downloads["downloads.astro"]
        notfound["404.astro"]
    end

    subgraph Layout["src/layouts"]
        SiteLayout["SiteLayout.astro<br/>head, theme, fonts,<br/>page transitions"]
    end

    subgraph Components["src/components"]
        SiteHeader["SiteHeader.astro<br/>name, scroll spy,<br/>theme toggle, menu"]
        SiteNav["SiteNav.astro<br/>page links"]
        ThemeToggle["ThemeToggle.astro<br/>sun/moon icon button"]
        SiteFooter["SiteFooter.astro"]
        GetInTouch["GetInTouch.astro<br/>email and phone"]
        CvDownload["CvDownload.astro"]
        AboutSummary["AboutSummary.astro<br/>home About section"]
        Physics["PhysicsPlaceholder.astro<br/>(Matter.js, lazy-loaded)"]
    end

    subgraph Content["Content"]
        lib["src/lib/content.ts<br/>getProfile, getRoles,<br/>getPlatforms, getCvFiles"]
        profile[("src/content/profile.json")]
        roles[("src/content/roles/*.md")]
        cvfiles[("CV files in public/")]
    end

    index & about & experience & skills & downloads & notfound --> SiteLayout
    SiteLayout --> SiteHeader & GetInTouch & SiteFooter
    SiteHeader & SiteFooter --> SiteNav
    SiteHeader --> ThemeToggle

    index & about & experience --> CvDownload
    index --> AboutSummary
    index & about & experience & skills --> Physics

    index & skills & SiteHeader & GetInTouch & AboutSummary -. "getProfile" .-> lib
    skills -. "getPlatforms" .-> lib
    experience -. "getRoles" .-> lib
    downloads & CvDownload -. "getCvFiles" .-> lib

    lib --> profile & roles
    lib -. "checked at build" .-> cvfiles
```

Solid arrows mean "renders"; dotted arrows mean "reads content from".
