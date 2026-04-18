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

Supabase may reject reserved domains such as `example.com`, so use realistic emails like below.

Quick method (app signup):

1. Go to app `/signup` and create these users with password `Passw0rd!`:
   - `demo.user@churchmvp.app`
   - `demo.reference@churchmvp.app`
   - `demo.admin@churchmvp.app`
2. In Supabase SQL Editor run:

```sql
update public.profiles set role = 'reference' where email = 'demo.reference@churchmvp.app';
update public.profiles set role = 'platform_admin' where email = 'demo.admin@churchmvp.app';
```

`demo.user@churchmvp.app` stays role `user` by default.

Alternative (Supabase Dashboard):

- Go to **Authentication → Users → Add user**
- Create the same 3 users with **Auto Confirm User** turned on
- Use the SQL updates above to assign `reference` and `platform_admin` roles

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
