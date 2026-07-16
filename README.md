# WAC Price Watch

WAC Price Watch tracks grocery products across Australian supermarkets, compares prices across stores, and lets users maintain a personal watchlist.

The app is split into:

- `api/` - ASP.NET Core API, Identity auth, EF Core, PostgreSQL, Hangfire jobs, scraping services.
- `web/` - Next.js frontend with generated API client code.
- `api.Tests/` - API test project.

## Current Features

- Email/password registration and sign-in through ASP.NET Core Identity.
- Store switcher for Coles, Aldi, and Woolworths.
- Catalog browsing, search, category filtering, product detail pages, and add-to-watchlist actions.
- Watchlist overview with cross-store comparison rows.
- Add watchlist items by product URL.
- Remove watchlist items.
- User settings for default store, theme preference, notification preferences, and price-check schedule.
- Scheduled background jobs with Hangfire for catalog sync and watchlist price checks.

## Prerequisites

- .NET SDK for `net10.0`
- Node.js
- pnpm
- PostgreSQL database, currently intended to run against Supabase Postgres
- `dotnet-ef` if you need to run migrations

Install EF tooling if needed:

```bash
dotnet tool install --global dotnet-ef
export PATH="$PATH:$HOME/.dotnet/tools"
```

## Configuration

The API reads its database connection from:

```text
ConnectionStrings:DefaultConnection
```

For local development, `api/appsettings.Development.json` can contain a local or Supabase connection string.

For production, prefer an environment variable instead of committing secrets:

```bash
ConnectionStrings__DefaultConnection="Host=...;Port=5432;Database=postgres;Username=postgres;Password=...;SSL Mode=Require;Trust Server Certificate=true"
```

The web app reads the API base URL from:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5204
```

If unset, the frontend defaults to `http://localhost:5204`.

## Database

Run EF migrations from the repo root:

```bash
dotnet ef database update --project api/api.csproj --verbose
```

Or from inside `api/`:

```bash
dotnet ef database update --verbose
```

Supabase note: Supabase provides Postgres only. The ASP.NET Core API still needs to be hosted separately unless the backend is rewritten to use Supabase APIs/functions directly.

## Running Locally

Start the API:

```bash
dotnet run --project api/api.csproj --launch-profile http
```

The API listens on:

```text
http://localhost:5204
```

Development API docs are available at:

```text
http://localhost:5204/scalar
http://localhost:5204/openapi/v1.json
```

Start the web app:

```bash
cd web
pnpm install
pnpm dev
```

The web app listens on:

```text
http://localhost:3000
```

## API Client Generation

The frontend API client is generated with Orval from the API OpenAPI document.

Start the API first, then run:

```bash
cd web
pnpm api:generate
```

Generated client output lives at:

```text
web/lib/api/generated/api.ts
```

Do not edit generated client code manually.

## Useful Commands

API build:

```bash
dotnet build api/api.csproj
```

Frontend lint:

```bash
cd web
CI=true pnpm lint
```

Frontend typecheck:

```bash
cd web
pnpm tsc --noEmit
```

Frontend production build:

```bash
cd web
pnpm build
```

## Deployment Checklist

- Host the ASP.NET Core API somewhere reachable by the frontend.
- Set `ConnectionStrings__DefaultConnection` in the API host.
- Set `NEXT_PUBLIC_API_BASE_URL` in the frontend host.
- Run EF migrations against the production database.
- Confirm CORS allows the deployed frontend origin.
- Smoke test `/register`, `/login`, `/api/catalog`, and `/api/watchlists/{store}/items`.
- Review the current `Microsoft.OpenApi` advisory warning before public deployment.

## Known Gaps

- Match management UI is intentionally disabled because the backend does not yet expose add/remove match endpoints.
- Catalog category filtering is high-level frontend classification, not a fully backend-queryable category API yet.
- The frontend currently loads larger result sets and paginates some views locally.
