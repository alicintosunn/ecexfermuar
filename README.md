# ECEX Website — Vercel + Supabase

This is a standard Next.js application prepared for Vercel. It uses:

- Vercel Functions and the standard Next.js Node.js runtime
- Supabase Postgres through `DATABASE_URL` and Drizzle ORM
- Supabase Storage for CMS images and videos
- Nodemailer for SMTP

Cloudflare Workers, D1, R2, Wrangler, Workerd and Vinext are not used.

## Local setup

1. Copy `.env.example` to `.env.local` and fill in the Supabase values.
2. Create a private Supabase Storage bucket named `media`, or set `SUPABASE_STORAGE_BUCKET` to another bucket name.
3. Install dependencies with `pnpm install`.
4. Apply the schema with `pnpm db:migrate`.
5. Start the project with `pnpm dev`.

## Database

The PostgreSQL schema is defined in `db/schema.ts`. Migrations are generated in `drizzle-postgres/`:

```bash
pnpm db:generate
pnpm db:migrate
```

For Vercel serverless, use the Supabase transaction pooler connection string (port 6543) as `DATABASE_URL`. The PostgreSQL client uses `prepare: false`, which is compatible with transaction pooling.

## Storage

The browser first requests a short-lived signed upload URL from the authenticated admin API, then uploads the file directly to Supabase Storage. This avoids Vercel Function request-body limits for CMS media. Public media is proxied through `/api/media/...`; the bucket can remain private.

## Vercel deployment

Import the repository into Vercel, select the Next.js framework preset, and add the variables from `.env.example` to Production, Preview and Development as appropriate.

- Build command: `pnpm build`
- Install command: `pnpm install --frozen-lockfile`
- Output directory: leave empty/default

Apply database migrations before deploying the first production version. Never expose `SUPABASE_SERVICE_ROLE_KEY` through a `NEXT_PUBLIC_` variable.
