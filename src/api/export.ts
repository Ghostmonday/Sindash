import { api } from '@/lib/api'

export const exportApi = {
  exportReports: async (format: 'csv' | 'json') => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/moderation/reports/export?format=${format}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('supabase.auth.token')}`,
      },
    })
    if (!response.ok) throw new Error('Export failed')
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `moderation_reports.${format}`
    a.click()
    URL.revokeObjectURL(url)
  },
  exportMutes: async (format: 'csv' | 'json') => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/moderation/mutes/export?format=${format}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('supabase.auth.token')}`,
      },
    })
    if (!response.ok) throw new Error('Export failed')
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mutes.${format}`
    a.click()
    URL.revokeObjectURL(url)
  },
  exportAILogs: async (format: 'csv' | 'json') => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/moderation/ai-logs/export?format=${format}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('supabase.auth.token')}`,
      },
    })
    if (!response.ok) throw new Error('Export failed')
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai_logs.${format}`
    a.click()
    URL.revokeObjectURL(url)
  },
}

