# kzApp Server

This is the server-side application for kzApp, built with Cloudflare Workers, Hono, and Drizzle ORM. It serves the API and application pages.

## Tech Stack

- **Runtime:** Cloudflare Workers
- **Framework:** Hono
- **Database:** Cloudflare D1
- **ORM:** Drizzle ORM
- **Styling:** Tailwind CSS + DaisyUI
- **Package Manager:** pnpm

## Prerequisites

- Node.js (Latest LTS recommended)
- pnpm
- Wrangler CLI (v3.105.0)

## Setup

1.  **Install dependencies:**

    ```bash
    pnpm install
    ```

2.  **Database Setup:**

    Create the D1 database (if not already created):
    ```bash
    pnpm run db:create
    ```

    Generate migrations:
    ```bash
    pnpm run db:generate
    ```

    Apply migrations locally:
    ```bash
    pnpm run db:migrate:local
    ```

    Seed the local database:
    ```bash
    pnpm run db:seed
    ```

## Development

To start the development server:

```bash
pnpm run dev
```

To run the Tailwind CSS watcher:

```bash
pnpm run build:css
```

## Scripts

- `dev`: Starts the local development server.
- `deploy`: Deploys the application to Cloudflare Workers.
- `login`: Logs in to Cloudflare via Wrangler.
- `db:create`: Creates the D1 database.
- `db:generate`: Generates SQL migrations from Drizzle schema.
- `db:migrate:local`: Applies migrations to the local D1 database.
- `db:migrate:remote`: Applies migrations to the remote D1 database.
- `db:seed`: Seeds the local database with initial data.
- `db:studio`: Opens Drizzle Studio to manage the database.
- `build:css`: Watches and builds Tailwind CSS.

## Deployment

To deploy to Cloudflare:

```bash
pnpm run deploy
```

**Note:** This project is pinned to `wrangler@3.105.0`.
