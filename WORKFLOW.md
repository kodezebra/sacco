# Development Workflow

This document outlines the operational workflow for setting up, running, and managing the `kzApp` server.

## 1. Initial Setup

Before starting, ensure you have `pnpm` and `node` installed.

### Step 1: Install Dependencies
If you are setting up the project from scratch, use these commands to install the required packages:

**Production Dependencies:**
```bash
pnpm add @hono/zod-validator drizzle-orm hono lucide zod
```

**Development Dependencies:**
```bash
pnpm add -D @tailwindcss/cli daisyui drizzle-kit tailwindcss wrangler@3.105.0
```

If you already have `package.json`, simply run:
```bash
pnpm install
```

### Step 2: Configure Scripts
Ensure your `package.json` contains the following scripts:

```json
"scripts": {
  "dev": "wrangler dev",
  "deploy": "wrangler deploy",
  "login": "wrangler login",
  "db:create": "wrangler d1 create client-db",
  "db:generate": "drizzle-kit generate",
  "db:migrate:local": "wrangler d1 migrations apply client-db --local",
  "db:migrate:remote": "wrangler d1 migrations apply client-db --remote",
  "db:seed": "wrangler d1 execute client-db --local --file=seed.sql",
  "db:studio": "drizzle-kit studio",
  "build": "tailwindcss -i ./src/styles/global.css -o ./public/styles.css --minify",
  "build:css": "tailwindcss -i ./src/styles/global.css -o ./public/styles.css --watch"
}
```

### Step 3: Cloudflare Authentication
Login to your Cloudflare account to allow Wrangler to manage resources.
```bash
pnpm run login
```

## 2. Database Setup (Cloudflare D1)

### Step 4: Create the Database
Create the D1 database.
```bash
pnpm run db:create
```
**IMPORTANT:** After running this command, check the output. If it provides a `database_id`, compare it with the one in your `wrangler.toml`. **If they are different, update `wrangler.toml` with the new ID.**

### Step 5: Generate Migrations
Create SQL migration files based on your Drizzle schema.
```bash
pnpm run db:generate
```

### Step 6: Apply Migrations (Local)
Apply the generated migrations to your local D1 database.
```bash
pnpm run db:migrate:local
```

### Step 7: Seed Database (Optional)
Populate the local database with initial data.
```bash
pnpm run db:seed
```

## 3. Daily Development

### Start the Server
Run the local development server.
```bash
pnpm run dev
```

### CSS Development
In a separate terminal, run the Tailwind CSS watcher to compile styles in real-time.
```bash
pnpm run build:css
```

## 4. Schema Updates
If you modify `src/db/schema.js`, follow these steps:

1.  **Generate new migration:**
    ```bash
    pnpm run db:generate
    ```
2.  **Apply to local DB:**
    ```bash
    pnpm run db:migrate:local
    ```

## 5. Deployment

To deploy your worker and CSS to Cloudflare:

```bash
# 1. Build production CSS
pnpm run build

# 2. Deploy Worker
pnpm run deploy
```

To migrate the **production** database:
```bash
pnpm run db:migrate:remote
```