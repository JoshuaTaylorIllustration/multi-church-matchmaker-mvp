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

## 2.1) Email confirmation behavior (important)

If your Supabase project has **Confirm email** enabled, signup creates the account but login will fail with `Email not confirmed` until the user clicks the link in their inbox.

Options for development:

- Keep confirm-email enabled (safer): users must confirm first.
- Turn off confirm-email in **Supabase Dashboard → Authentication → Providers → Email** to allow immediate login after signup.
- Use the admin one-click demo utility (section 7), which creates users with `email_confirm: true`.
- Use dev quick signup fallback on `/signup` when rate-limited (section 9).

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

If you hit `email rate limit exceeded`, that limit is from Supabase Auth settings. In development, create users from the Dashboard flow above, use the `/signup` dev quick-signup fallback, or raise limits in your Supabase Auth Rate Limit settings.

## 4) Role routes

- `platform_admin` → `/admin`
- `area_director` → `/area`
- `reference` → `/reference`
- `user` → `/dashboard`

### Route aliases

To avoid 404 issues from legacy/account-type URLs, these aliases are supported:

- `/user` → `/dashboard`
- `/matchmaker` → `/reference`
- `/area-director` → `/area`
- `/platform-admin` → `/admin`

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

- from a context action menu, create either core users or core + area director
- demo emails include: `demo.user@local.test`, `demo.reference@local.test`, `demo.admin@local.test`, and optional `demo.area@local.test`
- set roles to `user`, `reference`, `platform_admin`, and optional `area_director`
- use shared password: `Passw0rd!`

Notes:

- Requires `SUPABASE_SERVICE_ROLE_KEY` to be set.
- Disabled in production (`NODE_ENV=production`).
- Requester must be signed in as `platform_admin`.
- Area directors are the role intended to handle payments; the billing flow is currently scaffolded and planned for implementation.


## 8) Pricing model (current MVP assumptions)

User billing:

- Free tier: bi-weekly matches
- Premium tier: daily matches, target range `$8–$15/month`

Area director billing:

- Area directors pay only an activation fee when a new area is created

Future option:

- Add event payments later if needed


## 9) Dev quick-signup fallback for rate limits

When Supabase returns `email rate limit exceeded` during signup in development, the `/signup` page now shows **Use dev quick signup**.

What it does:

- calls `POST /api/dev/quick-signup`
- creates the user with `email_confirm: true` (no confirmation email sent)
- sets default profile role to `user`

Safety:

- disabled in production (`NODE_ENV=production`)
- requires `SUPABASE_SERVICE_ROLE_KEY` on the server
