# CineBox

CineBox is a React + TypeScript catalog for discovering movies, TV shows, and
anime. It retains the existing dark CineBox design and uses TMDB for real title
metadata, posters, backdrops, ratings, genres, cast, and TV details.

## Features

- Weekly five-title trending hero with manual slide controls.
- TMDB-powered home rows and paginated Movies, TV Shows, Anime, and Search pages.
- Genre filters and popularity, rating, and release-date sorting.
- Title details, TMDB attribution, likes, and My List.
- Anonymous Supabase sessions and user-owned watchlist/likes, protected by RLS.
- Existing SEO metadata, structured website data, sitemap, robots file, Open
  Graph image, favicon, and installable web manifest.

TMDB provides catalog metadata, not video streams. CineBox therefore does not
show Play controls or claim that TMDB titles can be streamed. Existing saved
watch-history records are retained, but Continue Watching cannot resume a title
without a separately licensed video source.

## Routes

- `#/home`
- `#/movies`
- `#/series`
- `#/anime`
- `#/search/<query>`
- `#/mylist`

Old `#/watch/<id>` links redirect to the home page.

## Stack and commands

- React 18, TypeScript, Vite, React Router (hash routing), and Tailwind CSS.
- Route pages are lazy-loaded; the original `css/style.css` design system is
  retained to preserve the existing appearance.
- TMDB credentials stay in Supabase Edge Function secrets; frontend requests go
  through the `tmdb-proxy` function.

```powershell
npm install
npm run dev
```

For production:

```powershell
npm run typecheck
npm run build
npm run preview
npm test
```

`npm test` builds the production app and checks the built shell, key feature
strings, and required static assets.

## Supabase and TMDB

The `supabase/functions/tmdb-proxy` Edge Function uses the v4 bearer token as
the primary TMDB authentication method and the v3 key as a fallback. Store both
as Supabase secrets only. Never put either credential in `.env.local` or
frontend code.

If provisioning a new environment, configure the secrets and deploy the
function:

```powershell
supabase secrets set TMDB_READ_TOKEN="<v4-read-access-token>"
supabase secrets set TMDB_API_KEY="<v3-api-key>"
supabase functions deploy tmdb-proxy --project-ref glngflkkrpbrnoogecpu
```

Set the public Supabase URL and publishable/anon key in `.env.local`:

```dotenv
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable-or-anon-key>
```

Never use a service-role key in the browser. The proxy accepts approved TMDB
actions only and validates pagination, search, IDs, sorting, and genre filters.
TMDB page results are requested as the user browses; the full catalog is not
copied into Supabase. TMDB currently caps discover pagination at 500 pages.

## Project structure

```text
src/
  components/   Header, footer, cards, poster, detail modal, toast
  context/      Application state and Supabase-backed user data
  hooks/        TMDB catalog state and weekly hero refresh
  pages/        Home, catalog, search, and My List routes
  services/     TMDB proxy client, Supabase user data, and storage
  types/        Catalog, TMDB, and database types
  utils/        Media formatting and weekly rotation
supabase/
  functions/    Secure TMDB proxy
css/style.css   Preserved CineBox design system
public/assets/  Branding and PWA assets
```
