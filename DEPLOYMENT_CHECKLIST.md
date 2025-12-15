# ✅ Vercel Deployment Checklist

Use this checklist when deploying to Vercel for the first time or after major changes.

## Pre-Deployment

- [ ] Code pushed to GitHub repository
- [ ] All tests passing locally (`npm run build` succeeds)
- [ ] No console errors in development
- [ ] `.env` file is NOT committed (check `.gitignore`)

## Vercel Dashboard Configuration

### Project Settings
- [ ] Framework Preset: **Vite** (auto-detected)
- [ ] Root Directory: **./** (project root)
- [ ] Build Command: **npm run build**
- [ ] Output Directory: **dist**
- [ ] Install Command: **npm install** (or auto-detected)

### Node.js Version
- [ ] Node.js version set to **18.x** or **20.x**
  - Location: Settings → General → Node.js Version
  - Or specified in `package.json` engines (already added)

### Environment Variables
- [ ] `VITE_SUPABASE_URL` added (if using Supabase)
  - Value: Your Supabase project URL
  - Environments: Production, Preview, Development
- [ ] `VITE_SUPABASE_ANON_KEY` added (if using Supabase)
  - Value: Your Supabase anon/public key
  - Environments: Production, Preview, Development

## Deployment

- [ ] Clicked **"Deploy"** button
- [ ] Build completed successfully (check build logs)
- [ ] Deployment URL received

## Post-Deployment Testing

### Basic Pages
- [ ] Home page (`/`) loads
- [ ] Courses page (`/courses`) loads
- [ ] Course detail page (`/course/:id`) loads
- [ ] Chapter viewer (`/course/:courseId/chapter/:chapterId`) loads
- [ ] Login page (`/login`) loads
- [ ] Register page (`/register`) loads

### Functionality
- [ ] Navigation works (all header links)
- [ ] Dark/light theme toggle works
- [ ] Course cards display correctly
- [ ] Course filtering works (Commercial/Passenger)
- [ ] Purchase modal appears (mock mode)
- [ ] Quiz system works (if chapter has quiz)

### Authentication (if Supabase configured)
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Dashboard loads after login
- [ ] Logout works correctly
- [ ] Protected routes redirect when not authenticated

### Routes & Navigation
- [ ] All React Router routes work
- [ ] Direct URL access works (no 404s)
- [ ] Browser back/forward buttons work
- [ ] Page refresh on any route works

### Console & Errors
- [ ] No console errors in browser
- [ ] No network errors (check Network tab)
- [ ] Supabase connection works (if configured)
- [ ] All images/assets load correctly

## Performance

- [ ] Page load time is acceptable (< 3 seconds)
- [ ] Images are optimized
- [ ] No large bundle warnings in build logs

## Mobile Testing

- [ ] Responsive design works on mobile
- [ ] Touch interactions work
- [ ] Quiz system works on mobile
- [ ] Forms are usable on mobile

## Final Verification

- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Analytics enabled (optional)
- [ ] Preview deployments working (test with a PR)

## Rollback Plan

If issues are found:
- [ ] Know which deployment to rollback to
- [ ] Test rollback process in preview environment first
- [ ] Document issues for future reference

---

**Notes:**
- Keep this checklist updated as features are added
- Test in preview deployments before promoting to production
- Monitor Vercel analytics for performance issues

