import { api } from '@/lib/api'

export interface TelemetryTrend {
  timestamp: string
  message_volume: number
  active_users: number
  auto_moderation_triggers: number
  avg_latency_ms: number
  websocket_latency_ms: number
  api_latency_ms: number
}

export interface TelemetrySummary {
  total_messages: number
  total_users: number
  moderation_actions: number
  avg_latency: number
  peak_hour: string
}

export const telemetryApi = {
  getTrends: (timeframe: '1h' | '24h' | '7d' | '30d') =>
    api.get<TelemetryTrend[]>(`/api/telemetry/trends?timeframe=${timeframe}`),
  getSummary: () => api.get<TelemetrySummary>('/api/telemetry/summary'),
}

