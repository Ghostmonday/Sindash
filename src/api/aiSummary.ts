import { api } from '@/lib/api'

export interface AISummary {
  summary: string
  last_updated: string
  trends: {
    flagged_users: number
    trending_abuse: string[]
    top_violations: Array<{ type: string; count: number }>
  }
}

export const aiSummaryApi = {
  getSummary: () => api.get<AISummary>('/api/moderation/ai-summary'),
}

