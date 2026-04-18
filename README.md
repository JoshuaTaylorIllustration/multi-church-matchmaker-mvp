# Multi-Church Matchmaker MVP

This app now includes Supabase authentication, a `profiles` table, role-based account routing, and protected routes.

## 1) Required Supabase environment variables

Create these variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (required only for the admin dev utility button)

For local development, put them in:

- `.env.local`

Example:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

## 2) Supabase database setup

1. Open Supabase Dashboard → SQL Editor.
2. Run `supabase/setup.sql`.

This creates:

- `public.profiles`
- RLS policies
- auth trigger to create one profile per auth user
- default role = `user`

## 3) Create demo accounts (quick manual flow)

Supabase Auth can reject reserved/non-routable demo domains (like `example.com`) and also enforces signup/email rate limits.

Use real inbox aliases so signup is valid and easy to manage:

1. Go to app `/signup` and create these users with password `Passw0rd!`:
   - `yourname+demo.user@gmail.com`
   - `yourname+demo.reference@gmail.com`
   - `yourname+demo.admin@gmail.com`
2. In Supabase SQL Editor run:

```sql
update public.profiles set role = 'reference' where email = 'yourname+demo.reference@gmail.com';
update public.profiles set role = 'platform_admin' where email = 'yourname+demo.admin@gmail.com';
```

`yourname+demo.user@gmail.com` stays role `user` by default.

Alternative (recommended for speed/rate limits):

- Go to **Authentication → Users → Add user**
- Create the same 3 users with **Auto Confirm User** turned on
- Use the SQL updates above to assign `reference` and `platform_admin` roles

If you hit `email rate limit exceeded`, that limit is from Supabase Auth settings. In development, create users from the Dashboard flow above or raise limits in your Supabase Auth Rate Limit settings.

## 4) Role routes

- `platform_admin` → `/admin`
- `area_director` → `/area`
- `reference` → `/reference`
- `user` → `/dashboard`

## 5) Dev demo helper

In development mode, `/login` shows a helper that:

- reminds you to use real inbox aliases for demo users
- can auto-fill the shared demo password (`Passw0rd!`)


## 6) Role-aware MVP stubs

After login, each role now lands in a role-specific workspace with:

- role-aware side navigation
- role-specific feature cards/stubs for core workflows
- simple status labels (`Ready`, `Stub`, `Planned`)

These are intentionally lightweight scaffolds so we can implement real data flows next.


## 7) One-click demo user utility (admin page)

A dev-only button is available in the **Admin** workspace under **User table tools**. It will:

- create (or sync) these auth users: `demo.user@local.test`, `demo.reference@local.test`, `demo.admin@local.test`
- set roles to `user`, `reference`, and `platform_admin`
- use shared password: `Passw0rd!`

Notes:

- Requires `SUPABASE_SERVICE_ROLE_KEY` to be set.
- Disabled in production (`NODE_ENV=production`).
- Requester must be signed in as `platform_admin`.
