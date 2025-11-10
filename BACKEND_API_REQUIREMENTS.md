# Backend API Requirements for Sinapse Dashboard

## Required Endpoints

### Moderation Endpoints

#### GET /api/moderation/reports
Returns list of moderation reports.

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "room_id": "uuid",
    "message_id": "uuid",
    "reason": "string",
    "severity": "warning" | "harassment" | "scam" | "spam" | "other",
    "status": "pending" | "resolved" | "dismissed",
    "created_at": "2025-01-27T00:00:00Z",
    "resolved_at": "2025-01-27T00:00:00Z"
  }
]
```

#### GET /api/moderation/mutes
Returns list of active and expired mutes.

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "room_id": "uuid",
    "muted_until": "2025-01-27T00:00:00Z",
    "reason": "string",
    "created_at": "2025-01-27T00:00:00Z"
  }
]
```

#### GET /api/moderation/bans
Returns list of bans.

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "room_id": "uuid",
    "banned_until": "2025-01-27T00:00:00Z",
    "reason": "string",
    "created_at": "2025-01-27T00:00:00Z"
  }
]
```

#### GET /api/moderation/ai-logs
Returns AI moderation logs.

**Response:**
```json
[
  {
    "id": "uuid",
    "room_id": "uuid",
    "user_id": "uuid",
    "message_id": "uuid",
    "score": 0.75,
    "is_toxic": true,
    "suggestion": "string",
    "action_taken": "warning" | "mute" | "none",
    "created_at": "2025-01-27T00:00:00Z"
  }
]
```

#### GET /api/moderation/ai-summary
Returns AI-powered daily summary (calls DeepSeek via Supabase Edge Function).

**Response:**
```json
{
  "summary": "Daily moderation summary text...",
  "last_updated": "2025-01-27T00:00:00Z",
  "trends": {
    "flagged_users": 42,
    "trending_abuse": ["pattern1", "pattern2"],
    "top_violations": [
      { "type": "harassment", "count": 15 },
      { "type": "spam", "count": 10 }
    ]
  }
}
```

#### POST /api/moderation/bulk-action
Bulk moderation actions.

**Request:**
```json
{
  "user_ids": ["uuid1", "uuid2"],
  "action": "mute" | "unmute" | "ban" | "unban",
  "room_id": "uuid",
  "reason": "string",
  "duration_hours": 24
}
```

**Response:**
```json
{
  "success": true,
  "affected": 2
}
```

#### POST /api/moderation/mute
Mute a user.

**Request:**
```json
{
  "user_id": "uuid",
  "room_id": "uuid",
  "reason": "string",
  "duration_hours": 24
}
```

#### POST /api/moderation/ban
Ban a user.

**Request:**
```json
{
  "user_id": "uuid",
  "room_id": "uuid",
  "reason": "string",
  "duration_hours": 24
}
```

#### POST /api/moderation/clear-stale-mutes
Clear expired mutes.

**Response:**
```json
{
  "success": true,
  "cleared": 5
}
```

#### GET /api/moderation/reports/export?format=csv|json
Export reports.

**Response:** CSV or JSON file download

#### GET /api/moderation/mutes/export?format=csv|json
Export mutes.

**Response:** CSV or JSON file download

#### GET /api/moderation/ai-logs/export?format=csv|json
Export AI logs.

**Response:** CSV or JSON file download

### Telemetry Endpoints

#### GET /api/telemetry/trends?timeframe=1h|24h|7d|30d
Returns telemetry trends.

**Response:**
```json
[
  {
    "timestamp": "2025-01-27T00:00:00Z",
    "message_volume": 1500,
    "active_users": 250,
    "auto_moderation_triggers": 12,
    "avg_latency_ms": 45,
    "websocket_latency_ms": 30,
    "api_latency_ms": 60
  }
]
```

#### GET /api/telemetry/summary
Returns telemetry summary.

**Response:**
```json
{
  "total_messages": 50000,
  "total_users": 1000,
  "moderation_actions": 150,
  "avg_latency": 45,
  "peak_hour": "2025-01-27T14:00:00Z"
}
```

## CORS Configuration

Add to your Express app:

```typescript
import cors from 'cors'

app.use(cors({
  origin: [
    'https://dashboard.neuraldraft.net',
    'https://sinapse-dashboard.onrender.com',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

## Authentication

All endpoints should validate the JWT token from:
```
Authorization: Bearer <token>
```

Token is stored in `localStorage.getItem('supabase.auth.token')`

## Supabase Realtime Setup

Enable Realtime for these tables:
- `moderation_flags` (for AI logs)
- `user_mutes` (for mutes)
- `telemetry_trends` (for telemetry)

In Supabase Dashboard:
1. Go to Database → Replication
2. Enable replication for these tables
3. Set up RLS policies if needed

## AI Summary Backend Implementation

Create a Supabase Edge Function or Express endpoint that:
1. Fetches moderation logs from last 24 hours
2. Calls DeepSeek API with prompt to summarize trends
3. Returns structured summary

Example Edge Function:
```typescript
// supabase/functions/ai-summary/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { data } = await supabase
    .from('moderation_flags')
    .select('*')
    .gte('created_at', new Date(Date.now() - 86400000).toISOString())
  
  // Call DeepSeek API
  const summary = await analyzeWithDeepSeek(data)
  
  return new Response(JSON.stringify(summary), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

