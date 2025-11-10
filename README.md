# Sinapse Dashboard

A real-time moderation and telemetry dashboard for the Sinapse platform, built with React 19, Vite, TypeScript, and TailwindCSS.

## Features

- 🧠 **Moderation Panel**: View and manage reports, mutes, bans, and AI moderation logs
- 📊 **Telemetry Dashboard**: Real-time charts for message volume, active users, moderation triggers, and latency
- ⚡ **Real-Time Sync**: Auto-refresh every 5 seconds using TanStack Query
- 🔐 **Authentication**: Supabase JWT-based authentication
- 🎨 **Modern UI**: Dark theme with ShadCN UI components
- 🚀 **Deployment Ready**: Configured for Render static site deployment

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **ShadCN UI** - Component library
- **TanStack Query** - Data fetching and caching
- **Recharts** - Chart library
- **Supabase** - Authentication

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your values:
   ```env
   VITE_API_BASE_URL=https://api.sinapse.app
   VITE_SUPABASE_URL=https://yourproject.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Deployment (Render)

1. Create a new **Static Site** in Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**: Add all `VITE_*` variables from `.env`

## API Endpoints Required

The dashboard expects these endpoints on your Express backend:

- `GET /api/moderation/reports` - Get moderation reports
- `GET /api/moderation/mutes` - Get active mutes
- `GET /api/moderation/bans` - Get active bans
- `GET /api/moderation/ai-logs` - Get AI moderation logs
- `POST /api/moderation/bulk-action` - Bulk moderation actions
- `POST /api/moderation/mute` - Mute a user
- `POST /api/moderation/ban` - Ban a user
- `POST /api/moderation/clear-stale-mutes` - Clear expired mutes
- `GET /api/moderation/export` - Export logs
- `GET /api/telemetry/trends` - Get telemetry trends
- `GET /api/telemetry/summary` - Get telemetry summary

## CORS Configuration

Ensure your Express API allows requests from your dashboard origin:

```typescript
app.use(cors({
  origin: ['https://your-dashboard.onrender.com', 'http://localhost:3000'],
  credentials: true
}))
```

## License

MIT

