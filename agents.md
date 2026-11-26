# Project instructions

Before changing the site, read [requirements.md](requirements.md). Prioritize
responsiveness, speed, and accessibility in every design and development
decision. Review the requirements again before committing or deploying, including
before pushing to an automatically deployed branch. Flag conflicts, failures,
and unverified requirements to the user before they go live: identify the
affected page or feature and requirement, explain the problem, and offer
practical suggestions. Resolve or explicitly agree on exceptions before
committing or deploying. Update the requirements when an agreed change affects
them.

Keep [stack.md](stack.md) current: when a tool, library, service, or browser
feature starts being used, add it with a short description of what it does in
this project, and remove entries that are no longer used.

Keep [flow.md](flow.md) current: when a page, component, or content source is
added, removed, or rewired, update its Mermaid diagrams in the same change.

Deploys are paused: do not commit or push until the owner asks to make
changes live. Work and test locally with the dev server (see README "Local
development"), and leave changes uncommitted. When the owner asks to go live,
run `npm run check` and `npm run quality` against a production preview, then
commit and push to `main` and confirm the deployment succeeded. Revisit this
once the site is public or a branching strategy is agreed.
