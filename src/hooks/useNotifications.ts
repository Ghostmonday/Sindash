import { useEffect } from 'react'
import { useBroadcast } from './useRealtime'

interface NotificationPayload {
  severity: 'warning' | 'harassment' | 'scam' | 'spam' | 'critical'
  reason: string
  user_id: string
  room_id: string
}

export function useNotifications() {
  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  useBroadcast('moderation_events', 'new_report', (payload: NotificationPayload) => {
    if (payload.severity === 'critical' || payload.severity === 'harassment') {
      if (Notification.permission === 'granted') {
        new Notification('🚨 Severe Report', {
          body: `${payload.severity.toUpperCase()}: ${payload.reason}`,
          icon: '/vite.svg',
          tag: `report-${payload.user_id}`,
        })
      }
    }
  })

  useBroadcast('moderation_events', 'new_mute', (payload: { user_id: string; reason?: string }) => {
    if (Notification.permission === 'granted') {
      new Notification('🔇 User Muted', {
        body: `User ${payload.user_id.slice(0, 8)}... has been muted`,
        icon: '/vite.svg',
      })
    }
  })
}

