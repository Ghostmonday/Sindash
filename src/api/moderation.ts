import { api } from '@/lib/api'

export interface Report {
  id: string
  user_id: string
  room_id: string
  message_id?: string
  reason: string
  severity: 'warning' | 'harassment' | 'scam' | 'spam' | 'other'
  status: 'pending' | 'resolved' | 'dismissed'
  created_at: string
  resolved_at?: string
}

export interface Mute {
  id: string
  user_id: string
  room_id: string
  muted_until: string
  reason?: string
  created_at: string
}

export interface Ban {
  id: string
  user_id: string
  room_id: string
  banned_until?: string
  reason: string
  created_at: string
}

export interface AILog {
  id: string
  room_id: string
  user_id: string
  message_id: string
  score: number
  is_toxic: boolean
  suggestion: string
  action_taken: 'warning' | 'mute' | 'none'
  created_at: string
}

export interface BulkActionRequest {
  user_ids: string[]
  action: 'mute' | 'unmute' | 'ban' | 'unban'
  room_id?: string
  reason?: string
  duration_hours?: number
}

export const moderationApi = {
  getReports: () => api.get<Report[]>('/api/moderation/reports'),
  getMutes: () => api.get<Mute[]>('/api/moderation/mutes'),
  getBans: () => api.get<Ban[]>('/api/moderation/bans'),
  getAILogs: () => api.get<AILog[]>('/api/moderation/ai-logs'),
  bulkAction: (data: BulkActionRequest) =>
    api.post<{ success: boolean; affected: number }>('/api/moderation/bulk-action', data),
  muteUser: (userId: string, roomId: string, reason?: string, durationHours?: number) =>
    api.post('/api/moderation/mute', { user_id: userId, room_id: roomId, reason, duration_hours: durationHours }),
  banUser: (userId: string, roomId: string, reason: string, durationHours?: number) =>
    api.post('/api/moderation/ban', { user_id: userId, room_id: roomId, reason, duration_hours: durationHours }),
  clearStaleMutes: () => api.post('/api/moderation/clear-stale-mutes'),
  exportLogs: (format: 'csv' | 'json') => api.get(`/api/moderation/export?format=${format}`),
}

