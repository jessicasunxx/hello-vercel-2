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
