# Vercel Deployment Guide

## Quick Deploy

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Option 2: GitHub Integration

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import `Ghostmonday/Sindash` repository

2. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

3. **Environment Variables**:
   Add these in Vercel dashboard:
   ```
   VITE_API_BASE_URL=https://api.sinapse.app
   VITE_SUPABASE_URL=https://yourproject.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_SENTRY_DSN=your_sentry_dsn (optional)
   VITE_DEEPSEEK_KEY=your_deepseek_key (optional, for AI summaries)
   ```

4. **Deploy**: Click "Deploy"

## Custom Domain Setup

1. **Add Domain**:
   - Go to Project Settings → Domains
   - Add `dashboard.neuraldraft.net` or `ops.neuraldraft.net`

2. **DNS Configuration**:
   - Add CNAME record pointing to Vercel's domain
   - Vercel will auto-configure SSL

## Environment Variables

### Required
- `VITE_API_BASE_URL` - Your Express API URL
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key

### Optional
- `VITE_SENTRY_DSN` - Sentry error tracking
- `VITE_DEEPSEEK_KEY` - For AI summaries (if using client-side)

## Build Configuration

Vercel automatically detects Vite projects. The `vercel.json` file includes:
- Build command: `npm run build`
- Output directory: `dist`
- SPA routing: All routes redirect to `index.html`
- Security headers: CSP, X-Frame-Options, etc.

## Preview Deployments

Every push to GitHub creates a preview deployment:
- Preview URL: `sinapse-dashboard-{hash}.vercel.app`
- Production URL: `sinapse-dashboard.vercel.app` (or custom domain)

## Troubleshooting

**Build Fails**:
- Check Node.js version (18+ required)
- Verify all environment variables are set
- Check build logs in Vercel dashboard

**Routing Issues**:
- Ensure `vercel.json` has rewrites configured
- Check that `index.html` exists in `dist/`

**CORS Errors**:
- Verify `VITE_API_BASE_URL` is correct
- Ensure backend allows Vercel domain in CORS

## Performance

Vercel automatically:
- CDN caching for static assets
- Edge network distribution
- Automatic HTTPS
- Zero-downtime deployments

## Monitoring

- **Analytics**: Enable in Vercel dashboard
- **Logs**: View in Vercel dashboard → Deployments → Logs
- **Errors**: Sentry integration (if configured)

