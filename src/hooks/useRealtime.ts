import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useRealtime<T>(
  channelName: string,
  table: string,
  onEvent: (payload: T) => void,
  filter?: { event?: string; schema?: string }
) {
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: filter?.event || '*',
          schema: filter?.schema || 'public',
          table,
        },
        (payload) => {
          onEvent(payload.new as T)
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [channelName, table, onEvent, filter?.event, filter?.schema])
}

export function useBroadcast(channelName: string, event: string, onEvent: (payload: unknown) => void) {
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event }, ({ payload }) => {
        onEvent(payload)
      })
      .subscribe()

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [channelName, event, onEvent])
}

