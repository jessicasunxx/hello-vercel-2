# Assignment Submission Checklist

## ✅ Requirements Completed

### 1. GitHub Repository
- **Repository**: `jessicasunxx/hello-vercel-2`
- **URL**: https://github.com/jessicasunxx/hello-vercel-2
- **Latest Commit**: `10b1e38` - "Add error handling and check env vars early to prevent 404s"

### 2. Vercel Project
- **Project Name**: `hello-vercel-2-n9ko`
- **Production URL**: `https://hello-vercel-2-n9ko.vercel.app`
- **Deployment Protection**: Must be turned OFF (check Vercel Settings → Deployment Protection)

### 3. Admin Area Features

#### ✅ Statistics Dashboard (`/admin`)
- Total Users count with superadmin breakdown
- Total Images count with today's additions
- Total Captions count with today's additions  
- Activity Rate (combined daily activity)
- Beautiful gradient cards with icons

#### ✅ User/Profile Management (`/admin/profiles`)
- **READ** - View all user profiles in a table
- Shows: name, email, avatar, role (superadmin/user), creation date
- Protected with `requireSuperadmin()`

#### ✅ Image Management (`/admin/images`)
- **CREATE** - Add new images via `/admin/images/new`
- **READ** - View all images in a grid layout
- **UPDATE** - Edit images via `/admin/images/[id]/edit`
- **DELETE** - Delete images with confirmation
- All operations protected with `requireSuperadmin()`

#### ✅ Caption Management (`/admin/captions`)
- **READ** - View all captions
- Shows: caption text, associated image ID, user ID, rating, creation date
- Protected with `requireSuperadmin()`

### 4. Authentication & Security

#### ✅ Google OAuth Login
- Login page at `/login`
- OAuth callback handler at `/auth/callback`
- Logout route at `/logout`

#### ✅ Superadmin Protection
- **ALL** admin routes protected with `requireSuperadmin()`
- Checks `profiles.is_superadmin == true`
- Unauthorized users redirected to `/login?error=not_authorized`

**Protected Routes:**
- `/admin` - Dashboard
- `/admin/profiles` - User list
- `/admin/images` - Image management
- `/admin/images/new` - Create image
- `/admin/images/[id]/edit` - Edit image
- `/admin/captions` - Caption list
- `/api/admin/images` - Image API (POST)
- `/api/admin/images/[id]` - Image API (PUT, DELETE)

### 5. Environment Variables
Required in Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=https://qihsgnfjqmkjmoowyfbn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpaHNnbmZqcW1ram1vb3d5ZmJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1Mjc0MDAsImV4cCI6MjA2NTEwMzQwMH0.c9UQS_o2bRygKOEdnuRx7x7PeSf_OUGDtf9l3fMqMSQ
```

## 🔐 Setting Up Your First Superadmin

**Important**: Since all routes require `profiles.is_superadmin == true`, you need to set yourself as superadmin before accessing the admin area.

### Method 1: SQL Editor (Recommended)
1. Log in to Supabase Dashboard: https://supabase.com/dashboard
2. Go to SQL Editor
3. Run this query (replace with your Google email):
```sql
UPDATE profiles 
SET is_superadmin = true 
WHERE email = 'your-email@gmail.com';
```

### Method 2: Table Editor
1. Go to Supabase Dashboard → Table Editor → `profiles` table
2. Find your profile row (after logging in once)
3. Edit the row and set `is_superadmin` to `true`
4. Save

## 📝 Submission URLs

### For Admin Area App:
**Commit-specific URL format:**
```
https://hello-vercel-2-n9ko-[COMMIT_HASH].vercel.app
```

**Latest commit**: `10b1e38`

**To get commit-specific URL:**
1. Go to Vercel Dashboard → Your Project → Deployments
2. Find the deployment for commit `10b1e38`
3. Click on the deployment
4. Copy the "Preview URL" (format: `hello-vercel-2-n9ko-[hash]-jessica-suns-projects-[id].vercel.app`)

**OR use the production URL** (if latest deployment):
```
https://hello-vercel-2-n9ko.vercel.app
```

### For Caption Creation & Rating App:
(Your first assignment - submit that project's commit-specific URL)

## ✅ Final Checklist Before Submission

- [ ] All environment variables set in Vercel
- [ ] Deployment Protection turned OFF in Vercel
- [ ] Test login with Google account
- [ ] Set yourself as superadmin in Supabase
- [ ] Test accessing `/admin` dashboard
- [ ] Test viewing users at `/admin/profiles`
- [ ] Test creating an image at `/admin/images/new`
- [ ] Test editing an image at `/admin/images/[id]/edit`
- [ ] Test deleting an image
- [ ] Test viewing captions at `/admin/captions`
- [ ] Verify all routes redirect to `/login` when not authenticated
- [ ] Verify non-superadmin users see "not_authorized" error
- [ ] Get commit-specific URLs for both apps
- [ ] Submit URLs in course submission section

## 🎯 Answer to Assignment Question

**Q: "But wait, if profiles.is_superadmin==TRUE is required to use your own admin area, won't you be locked out?"**

**A:** You can solve this by:
1. **Logging in once** with Google (this creates your profile in the `profiles` table)
2. **Then** using Supabase's SQL Editor or Table Editor to manually set `is_superadmin = true` for your profile
3. This gives you admin access without needing admin access to set admin access (bootstrap problem solved!)

The key is that Supabase provides direct database access through their dashboard, which bypasses the application-level security checks.
