# Admin Area for Supabase Database

A Next.js admin dashboard with Google authentication and superadmin access control.

## Features

- 🔐 Google OAuth authentication via Supabase
- 🛡️ Superadmin-only access (requires `profiles.is_superadmin == true`)
- 📊 Dashboard with statistics (users, images, captions, activity)
- 👥 User/Profile management (read-only)
- 🖼️ Image management (full CRUD)
- 💬 Caption viewing (read-only)

## Setup

### Environment Variables

Set these in Vercel (or `.env.local` for local development):

```
NEXT_PUBLIC_SUPABASE_URL=https://qihsgnfjqmkjmoowyfbn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpaHNnbmZqcW1ram1vb3d5ZmJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1Mjc0MDAsImV4cCI6MjA2NTEwMzQwMH0.c9UQS_o2bRygKOEdnuRx7x7PeSf_OUGDtf9l3fMqMSQ
```


### Your exact values (from this project)

If you want to paste values directly in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://qihsgnfjqmkjmoowyfbn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpaHNnbmZqcW1ram1vb3d5ZmJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1Mjc0MDAsImV4cCI6MjA2NTEwMzQwMH0.c9UQS_o2bRygKOEdnuRx7x7PeSf_OUGDtf9l3fMqMSQ
```

Alternative (if you only have project ID + anon key):

```
SUPABASE_PROJECT_ID=qihsgnfjqmkjmoowyfbn
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpaHNnbmZqcW1ram1vb3d5ZmJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1Mjc0MDAsImV4cCI6MjA2NTEwMzQwMH0.c9UQS_o2bRygKOEdnuRx7x7PeSf_OUGDtf9l3fMqMSQ
```

### How to add Supabase to Vercel (step-by-step)

1. Open **Supabase Dashboard** → your project → **Project Settings** → **API**.
2. Copy:
   - **Project URL**
   - **anon public** key
3. In **Vercel** → your project → **Settings** → **Environment Variables** → **Add Environment Variable**.
4. Add these variables (recommended):
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon public key
5. Select environments for both vars: **Production**, **Preview**, and **Development**.
6. Click **Save** for each variable.
7. Go to **Deployments** and click **Redeploy** on the latest deployment.

Also verify Supabase OAuth settings:

- **Supabase** → **Authentication** → **URL Configuration**
  - **Site URL**: `https://YOUR-PROJECT.vercel.app`
  - **Redirect URLs** (add both):
    - `https://YOUR-PROJECT.vercel.app/auth/callback`
    - `http://localhost:3000/auth/callback`

If your Vercel app still shows `?error=config`, double-check there are no typos/spaces in variable names.

### Setting Up Your First Superadmin

**Important:** Since all routes require `profiles.is_superadmin == true`, you need to set yourself as a superadmin before you can log in.

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Run this query (replace `YOUR_EMAIL@example.com` with your Google account email):

```sql
-- First, find your user ID after logging in once, or insert directly:
UPDATE profiles 
SET is_superadmin = true 
WHERE email = 'YOUR_EMAIL@example.com';

-- Or if you know the user ID:
UPDATE profiles 
SET is_superadmin = true 
WHERE id = 'USER_ID_HERE';
```

Alternatively, you can use the Supabase dashboard's Table Editor to manually set `is_superadmin = true` for your profile.


### If you see `/login?error=config`

This means the deployment cannot read Supabase credentials.

In **Vercel → Project → Settings → Environment Variables**, set one of these pairs:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- or `SUPABASE_URL` and `SUPABASE_ANON_KEY`

Then click **Redeploy** for the latest deployment.

### If clicking “Continue with Google” does nothing

Open `/login?error=oauth_start_failed` handling notes:

- In **Supabase → Authentication → Providers**, ensure **Google** is enabled and client ID/secret are set.
- In **Supabase → Authentication → URL Configuration**, verify:
  - **Site URL** is your deployed Vercel URL.
  - **Redirect URLs** include `https://YOUR-PROJECT.vercel.app/auth/callback`.
- Confirm the deployment has Supabase env vars in the same environment (Preview vs Production) and redeploy.

In this app, failed OAuth initialization now redirects to `/login?error=oauth_start_failed` so it is easier to distinguish provider/config issues from missing env vars.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - it will redirect to `/admin` which requires authentication.

## Routes

- `/` - Redirects to `/admin`
- `/login` - Google OAuth login page
- `/admin` - Dashboard with statistics
- `/admin/users` - View all user profiles
- `/admin/images` - Manage images (CRUD)
- `/admin/captions` - View all captions

All `/admin/*` routes are protected and require superadmin access.

## Deploy on Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel settings
4. Turn off "Deployment Protection" in Vercel project settings to allow incognito access
5. Deploy!

## Troubleshooting `404: NOT_FOUND` on Vercel

If Vercel shows a plain `404: NOT_FOUND` page (instead of this app's styled 404 page), the deployment is usually not serving your Next.js app correctly.

Check these in order:

1. **Framework Preset** is set to **Next.js** in Vercel project settings.
2. **Root Directory** points to the repo root (`.`), not a different folder.
3. **Build Command** is `next build` (or default) and **Output Directory** is empty/default for Next.js.
4. Open **Deployments → latest deployment → Build Logs** and confirm the build completed successfully.
5. Confirm the deployment is from the expected branch/commit and that `app/page.tsx` exists in that commit.
6. This repo now includes a `vercel.json` that explicitly pins the framework to `nextjs` to reduce auto-detection mistakes.
7. After changing settings, click **Redeploy**.

Quick validation commands before pushing:

```bash
npm install
npm run lint
npm run build
```
