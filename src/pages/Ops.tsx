import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { moderationApi } from '@/api/moderation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ActionModal } from '@/components/ActionModal'
import { Download, Trash2 } from 'lucide-react'

export function Ops() {
  const [muteModalOpen, setMuteModalOpen] = useState(false)
  const [banModalOpen, setBanModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: mutes = [] } = useQuery({
    queryKey: ['mutes'],
    queryFn: moderationApi.getMutes,
  })

  const clearStaleMutation = useMutation({
    mutationFn: moderationApi.clearStaleMutes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mutes'] })
      alert('Stale mutes cleared successfully')
    },
  })

  const muteMutation = useMutation({
    mutationFn: ({ userId, roomId, reason, durationHours }: { userId: string; roomId?: string; reason?: string; durationHours?: number }) =>
      moderationApi.muteUser(userId, roomId || '', reason, durationHours),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mutes'] })
      alert('User muted successfully')
    },
  })

  const banMutation = useMutation({
    mutationFn: ({ userId, roomId, reason, durationHours }: { userId: string; roomId?: string; reason?: string; durationHours?: number }) =>
      moderationApi.banUser(userId, roomId || '', reason, durationHours),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bans'] })
      alert('User banned successfully')
    },
  })

  const exportLogs = async (format: 'csv' | 'json') => {
    try {
      const data = await moderationApi.exportLogs(format)
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `moderation-logs.${format}`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      alert(`Error exporting logs: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const activeMutes = mutes.filter((mute) => new Date(mute.muted_until) > new Date())

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Operations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Manual Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => setMuteModalOpen(true)} className="w-full">
              Mute User
            </Button>
            <Button onClick={() => setBanModalOpen(true)} variant="destructive" className="w-full">
              Ban User
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bulk Operations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => clearStaleMutation.mutate()}
              variant="outline"
              className="w-full"
              disabled={clearStaleMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Stale Mutes ({mutes.length - activeMutes.length})
            </Button>
            <Button onClick={() => exportLogs('csv')} variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Logs (CSV)
            </Button>
            <Button onClick={() => exportLogs('json')} variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Logs (JSON)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Mutes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMutes.length}</div>
            <p className="text-sm text-muted-foreground">Total mutes: {mutes.length}</p>
          </CardContent>
        </Card>
      </div>

      <ActionModal
        isOpen={muteModalOpen}
        onClose={() => setMuteModalOpen(false)}
        title="Mute User"
        actionType="mute"
        onSubmit={async (data) => muteMutation.mutate(data)}
      />

      <ActionModal
        isOpen={banModalOpen}
        onClose={() => setBanModalOpen(false)}
        title="Ban User"
        actionType="ban"
        onSubmit={async (data) => banMutation.mutate(data)}
      />
    </div>
  )
}

