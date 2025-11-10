# Sinapse Dashboard Deployment Guide

## Deployment Options

- **Vercel** (Recommended): See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- **Render**: See Render section below

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in:
- `VITE_API_BASE_URL` - Your Express API URL
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

### 3. Development
```bash
npm run dev
```

### 4. Build
```bash
npm run build
```

## Vercel Deployment (Recommended)

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for complete guide.

**Quick Deploy**:
```bash
npm i -g vercel
vercel login
vercel --prod
```

Or connect GitHub repo in Vercel dashboard for automatic deployments.

## Render Deployment

1. **Create Static Site**:
   - Go to Render Dashboard
   - Click "New +" → "Static Site"
   - Connect GitHub repository: `Ghostmonday/Sindash`

2. **Configure**:
   - **Name**: `sinapse-dashboard`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Environment**: `Production`

3. **Add Environment Variables**:
   - `VITE_API_BASE_URL` = `https://api.sinapse.app`
   - `VITE_SUPABASE_URL` = Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key

4. **Deploy**: Click "Create Static Site"

## Backend API Requirements

Your Express backend needs these endpoints:

### Moderation Endpoints
- `GET /api/moderation/reports` - Returns `Report[]`
- `GET /api/moderation/mutes` - Returns `Mute[]`
- `GET /api/moderation/bans` - Returns `Ban[]`
- `GET /api/moderation/ai-logs` - Returns `AILog[]`
- `POST /api/moderation/bulk-action` - Bulk actions
- `POST /api/moderation/mute` - Mute user
- `POST /api/moderation/ban` - Ban user
- `POST /api/moderation/clear-stale-mutes` - Clear expired mutes
- `GET /api/moderation/export?format=csv|json` - Export logs

### Telemetry Endpoints
- `GET /api/telemetry/trends?timeframe=1h|24h|7d|30d` - Returns `TelemetryTrend[]`
- `GET /api/telemetry/summary` - Returns `TelemetrySummary`

### CORS Setup
Add to your Express app:
```typescript
import cors from 'cors'

app.use(cors({
  origin: [
    'https://sinapse-dashboard.onrender.com',
    'http://localhost:3000'
  ],
  credentials: true
}))
```

## Authentication

The dashboard uses Supabase JWT authentication. Ensure:
1. Users have accounts in Supabase
2. JWT tokens are validated on API requests
3. Token is stored in `localStorage` as `supabase.auth.token`

## Features

✅ **Moderation Panel**
- View reports with severity filters
- Bulk resolve actions
- Mutes and bans management
- AI moderation logs

✅ **Telemetry Dashboard**
- Real-time charts (5s refresh)
- Message volume, active users
- Moderation triggers
- Latency metrics

✅ **Operations Tools**
- Manual mute/ban
- Clear stale mutes
- Export logs (CSV/JSON)

✅ **Real-Time Sync**
- TanStack Query auto-refresh
- 5-second polling interval
- Optimistic updates

## Troubleshooting

**CORS Errors**: Ensure your API allows the dashboard origin

**Auth Errors**: Check Supabase credentials and JWT validation

**API Errors**: Verify endpoints match expected format

**Build Errors**: Check Node.js version (18+ required)

