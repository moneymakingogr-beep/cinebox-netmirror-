# Project memory

## Product intent & audience

- **CineBox**: a streaming/discovery app for browsing movies, TV shows, and anime.
- Core features: discovery/catalog view, search, saved list ("My List"), title detail dialog, pagination ("Load more").
- Catalog sections use full labels: "Popular Movies," "Popular TV Shows," "Popular Anime."

## Brand personality & voice

- Entertainment/media-focused; user-facing labels are clear and descriptive (full category names, not abbreviations).

## Visual design & UX direction

- Framework: Vite + React (`vite-react`).
- App entry restored under `src/` with standard Vite HTML entry pointing to it.
- Branding assets are required and referenced by the app (logos/icons).
- Responsive styling is part of the base app.
- Pagination control uses a specific expected CSS class name on the "Load more" button.

## Decisions, constraints & rationale

- Vite publishes only files in `public/`; SEO files (robots, sitemap, etc.) must be placed in `public/` to be served, not only at project root.
- Production checks validate: catalog heading labels, presence of published SEO files, and pagination class name.
- Restored missing `src/` folder and entry files to resolve white screen caused by missing startup module.
- Prefer restoring existing expected content/structure over changing check expectations.

## Open questions & assumptions

- Data source for catalog content (API or static) not yet confirmed.
- Full scope of production/smoke checks beyond those encountered is unknown.
- Whether branding assets have specific format/size requirements is unconfirmed.