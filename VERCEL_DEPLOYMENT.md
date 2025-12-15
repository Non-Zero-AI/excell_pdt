# 🚀 Vercel Deployment Guide

Complete guide for deploying Excell PDT to Vercel.

## Pre-Deployment Checklist

Before deploying, ensure you have:
- [x] Pushed code to GitHub repository
- [x] Vercel account connected to GitHub
- [ ] Supabase project created (if using backend features)
- [ ] Environment variables ready (if using Supabase)

## Step 1: Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository: `Non-Zero-AI/excell_pdt`
4. Vercel will auto-detect Vite framework

## Step 2: Configure Project Settings

### Framework Preset
- **Value**: `Vite` (auto-detected, verify it's selected)

### Root Directory
- **Value**: `./` (project root)

### Build and Output Settings

#### Build Command
- **Value**: `npm run build`
- This runs `vite build` to create optimized production build

#### Output Directory
- **Value**: `dist`
- Vite outputs production files to `dist/` directory

#### Install Command
- **Value**: `npm install`
- Standard npm install (Vercel may auto-detect this)

### Node.js Version
- **Recommended**: `18.x` or `20.x` (latest LTS)
- Set in: **Settings → General → Node.js Version**
- Or specified in `package.json` engines field (already added)

## Step 3: Configure Environment Variables

Go to **Settings → Environment Variables** and add:

### Required (if using Supabase)

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `your-anon-key-here` | Production, Preview, Development |

### Optional (for future features)

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `VITE_STRIPE_PUBLIC_KEY` | `pk_live_...` | Production, Preview, Development |

**Important Notes:**
- All environment variables **must** be prefixed with `VITE_` to be accessible in React
- Add variables for **all environments** (Production, Preview, Development)
- Never commit `.env` files to git (already in `.gitignore`)

### How to Get Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings → API**
3. Copy:
   - **Project URL** → Use as `VITE_SUPABASE_URL`
   - **anon/public key** → Use as `VITE_SUPABASE_ANON_KEY`

## Step 4: Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (usually 1-2 minutes)
3. Vercel will provide a deployment URL (e.g., `excell-pdt.vercel.app`)

## Step 5: Verify Deployment

After deployment, test:

### Basic Functionality
- [ ] Home page loads correctly
- [ ] Navigation works (Header links)
- [ ] Dark/light theme toggle works
- [ ] No console errors

### Routes
- [ ] `/` - Home page
- [ ] `/courses` - Course catalog
- [ ] `/course/:id` - Course detail page
- [ ] `/course/:courseId/chapter/:chapterId` - Chapter viewer
- [ ] `/login` - Login page
- [ ] `/register` - Registration page
- [ ] `/dashboard` - User dashboard (requires auth)
- [ ] `/certification` - Certifications page

### Features
- [ ] Course cards display correctly
- [ ] Quiz system works (if chapter has quiz)
- [ ] Purchase modal appears (mock mode)
- [ ] Authentication flow works (if Supabase configured)

## Configuration Files

### vercel.json
Already configured with:
- Build command: `npm run build`
- Output directory: `dist`
- SPA routing (all routes → `/index.html`)

### package.json
Includes:
- Node.js version requirement: `>=18.0.0`
- Build script: `vite build`
- All necessary dependencies

## Routing Configuration

The `vercel.json` includes SPA routing configuration:

```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

This ensures React Router works correctly for all client-side routes.

## Post-Deployment Optimizations

### 1. Custom Domain
- Go to **Settings → Domains**
- Add your custom domain
- Vercel automatically configures SSL

### 2. Preview Deployments
- Enabled by default
- Every PR gets a preview URL
- Perfect for testing before merging

### 3. Analytics (Optional)
- Enable Vercel Analytics in **Settings → Analytics**
- Monitor performance and user behavior

### 4. Environment-Specific Variables
- Set different values for Production vs Preview
- Useful for testing with staging Supabase projects

## Troubleshooting

### Build Fails

**Error: Module not found**
- Check all dependencies are in `package.json`
- Ensure `node_modules` is not committed (should be in `.gitignore`)

**Error: Command failed**
- Verify Node.js version is 18.x or 20.x
- Check build logs in Vercel dashboard

### Routes Not Working

**404 on page refresh**
- Verify `vercel.json` has rewrites configuration
- Check that `dist/index.html` exists after build

### Environment Variables Not Working

**Variables undefined in app**
- Ensure variables are prefixed with `VITE_`
- Check variables are added to correct environment
- Redeploy after adding new variables

### Supabase Connection Issues

**Connection errors**
- Verify `VITE_SUPABASE_URL` is correct (no trailing slash)
- Check `VITE_SUPABASE_ANON_KEY` is the anon/public key (not service role)
- Ensure Supabase project is active
- Check Supabase RLS policies allow public access (for courses)

## Deployment URLs

After deployment, you'll have:

- **Production**: `https://excell-pdt.vercel.app` (or custom domain)
- **Preview**: `https://excell-pdt-git-branch.vercel.app` (for each branch/PR)

## Continuous Deployment

Vercel automatically:
- Deploys on push to `main` branch (production)
- Creates preview deployments for PRs
- Rebuilds on every commit

## Rollback

If something goes wrong:
1. Go to **Deployments** tab
2. Find previous working deployment
3. Click **"..."** → **"Promote to Production"**

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- Project Issues: GitHub repository issues

---

**Last Updated**: 2024-01-XX
**Version**: 1.0.0

