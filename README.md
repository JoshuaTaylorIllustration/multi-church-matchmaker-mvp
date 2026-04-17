# Multi-Church Matchmaker MVP

This app now includes Supabase authentication, a `profiles` table, role-based account routing, and protected routes.

## 1) Required Supabase environment variables

Create these variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

For local development, put them in:

- `.env.local`

Example:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
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

Supabase does not offer a convenient SQL-only path for setting auth passwords, so use this quick method:

1. Go to app `/signup` and create these users with password `Passw0rd!`:
   - `demo.user@example.com`
   - `demo.reference@example.com`
   - `demo.admin@example.com`
2. In Supabase SQL Editor run:

```sql
update public.profiles set role = 'reference' where email = 'demo.reference@example.com';
update public.profiles set role = 'platform_admin' where email = 'demo.admin@example.com';
```

`demo.user@example.com` stays role `user` by default.

## 4) Role routes

- `platform_admin` → `/admin`
- `area_director` → `/area`
- `reference` → `/reference`
- `user` → `/dashboard`

## 5) Dev demo helper

In development mode, `/login` shows buttons that auto-fill demo credentials for:

- user
- reference
- admin


## 6) Role-aware MVP stubs

After login, each role now lands in a role-specific workspace with:

- role-aware side navigation
- role-specific feature cards/stubs for core workflows
- simple status labels (`Ready`, `Stub`, `Planned`)

These are intentionally lightweight scaffolds so we can implement real data flows next.
