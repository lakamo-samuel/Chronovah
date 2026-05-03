# Vercel Deployment Guide - Chronovah Frontend

## Prerequisites

✅ Backend deployed at: `https://api-chronovah-backend.onrender.com`  
✅ Frontend repository on GitHub  
✅ Vercel account (free tier works)

## Step 1: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `chronovah-frontend`
4. Vercel will auto-detect it's a Vite + React project

## Step 2: Configure Build Settings

Vercel should auto-detect these, but verify:

- **Framework Preset**: Vite
- **Root Directory**: `./` (or leave empty)
- **Build Command**: `npm run build` or `pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `npm install` or `pnpm install`

## Step 3: Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

### Required Variables

```bash
# API URL (CRITICAL - must match your backend)
VITE_API_URL=https://api-chronovah-backend.onrender.com/api/v1

# Paystack Public Key
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_test_key_here
```

### Important Notes

- **VITE_API_URL**: Must be your actual backend URL (no trailing slash on `/api/v1`)
- **VITE_PAYSTACK_PUBLIC_KEY**: 
  - Use `pk_test_xxx` for testing
  - Use `pk_live_xxx` for production (when ready to accept real payments)
- Set these for **Production** environment
- Optionally set for **Preview** and **Development** too

## Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. Vercel will provide your URL: `https://chronovah.vercel.app`

## Step 5: Verify Deployment

### Test the Frontend

1. Visit `https://chronovah.vercel.app`
2. Check homepage loads correctly
3. Try signing up/logging in
4. Verify API calls work (check browser console)

### Test API Connection

Open browser console and check for:
```
🚀 POST /user/signup
✅ Response [201]
```

If you see CORS errors or connection issues, check Step 6.

## Step 6: Update Backend CORS (If Needed)

Your backend should already have CORS configured for `chronovah.vercel.app`, but verify:

1. Check backend `.env` has:
   ```
   FRONTEND_URL=https://chronovah.vercel.app
   CORS_ORIGINS=https://chronovah.vercel.app
   ```

2. If you need to update, redeploy backend on Render

## Step 7: Custom Domain (Optional)

To use your own domain:

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions
4. Update backend `FRONTEND_URL` and `CORS_ORIGINS` to include your custom domain

## Troubleshooting

### Build Fails

**Error**: `Module not found` or `Cannot find module`
- **Fix**: Check all imports use correct paths
- **Fix**: Run `npm install` locally to verify dependencies

**Error**: TypeScript errors
- **Fix**: Run `npm run build` locally first to catch errors
- **Fix**: Fix TypeScript errors before deploying

### CORS Errors in Browser

**Error**: `Access to XMLHttpRequest blocked by CORS policy`
- **Fix**: Verify `VITE_API_URL` is set correctly in Vercel
- **Fix**: Check backend `FRONTEND_URL` matches your Vercel URL
- **Fix**: Ensure backend `CORS_ORIGINS` includes your Vercel URL

### API Calls Fail

**Error**: `Network Error` or `Failed to fetch`
- **Fix**: Check `VITE_API_URL` environment variable
- **Fix**: Verify backend is running: `curl https://api-chronovah-backend.onrender.com/api/v1/healthcheck`
- **Fix**: Check browser console for specific error messages

### Environment Variables Not Working

**Error**: `undefined` when accessing `import.meta.env.VITE_API_URL`
- **Fix**: Ensure variables start with `VITE_` prefix
- **Fix**: Redeploy after adding environment variables
- **Fix**: Check variables are set for "Production" environment

### Google OAuth Not Working

**Error**: Redirect URI mismatch
- **Fix**: Update Google OAuth redirect URI to include Vercel URL
- **Fix**: Add `https://chronovah.vercel.app` to authorized origins
- **Fix**: Update backend `GOOGLE_CALLBACK_URL` if needed

## Environment Variables Reference

### Development (.env)
```bash
VITE_API_URL=http://localhost:8000/api/v1
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxx
```

### Production (Vercel Dashboard)
```bash
VITE_API_URL=https://api-chronovah-backend.onrender.com/api/v1
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxx  # or pk_live_xxx for production
```

## Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Push to `main`** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull requests** → Preview deployment with unique URL

## Monitoring

### Check Deployment Status

1. Go to Vercel Dashboard → Your Project
2. Click on "Deployments" tab
3. See build logs, errors, and deployment history

### Check Runtime Logs

1. Go to Vercel Dashboard → Your Project
2. Click on "Logs" tab (if available on your plan)
3. Or use browser console to see client-side errors

## Production Checklist

Before going live with real users:

- [ ] Backend deployed and running
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] Test signup/login flow
- [ ] Test Google OAuth
- [ ] Test Paystack payment (with test keys first)
- [ ] Switch to Paystack live keys when ready
- [ ] Test all major features
- [ ] Check mobile responsiveness
- [ ] Set up custom domain (optional)
- [ ] Enable analytics (optional)

## Useful Commands

```bash
# Build locally to test
npm run build

# Preview production build locally
npm run preview

# Check for TypeScript errors
npx tsc --noEmit

# Check for linting errors
npm run lint
```

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Vite Docs**: https://vite.dev
- **React Router**: https://reactrouter.com

## Current Deployment

✅ **Frontend**: `https://chronovah.vercel.app`  
✅ **Backend**: `https://api-chronovah-backend.onrender.com`  
✅ **Status**: Ready to deploy!
