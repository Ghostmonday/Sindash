import { useQuery, useQueryClient } from '@tanstack/react-query'
import { moderationApi, type Mute } from '@/api/moderation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Card, CardContent } from '@/components/ui/Card'
import { formatRelativeTime, formatDate } from '@/lib/utils'
import { useRealtime } from '@/hooks/useRealtime'
import { Clock } from 'lucide-react'

export function Mutes() {
  const queryClient = useQueryClient()
  
  const { data: mutes = [], isLoading } = useQuery({
    queryKey: ['mutes'],
    queryFn: moderationApi.getMutes,
  })

  // Real-time updates for mutes
  useRealtime<Mute>('mutes_realtime', 'user_mutes', (newMute) => {
    queryClient.setQueryData(['mutes'], (old: Mute[] = []) => {
      const updated = [...old]
      const existingIndex = updated.findIndex((m) => m.id === newMute.id)
      if (existingIndex >= 0) {
        updated[existingIndex] = newMute
      } else {
        updated.push(newMute)
      }
      return updated
    })
  })

  const activeMutes = mutes.filter((mute) => new Date(mute.muted_until) > new Date())
  const expiredMutes = mutes.filter((mute) => new Date(mute.muted_until) <= new Date())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mutes</h1>
        <div className="flex gap-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Active: </span>
            <span className="font-bold text-green-400">{activeMutes.length}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Expired: </span>
            <span className="font-bold text-gray-400">{expiredMutes.length}</span>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">Loading mutes...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Room ID</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Muted Until</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mutes.map((mute) => {
                  const isActive = new Date(mute.muted_until) > new Date()
                  return (
                    <TableRow key={mute.id}>
                      <TableCell className="font-mono text-sm">{mute.user_id.slice(0, 8)}...</TableCell>
                      <TableCell className="font-mono text-sm">{mute.room_id.slice(0, 8)}...</TableCell>
                      <TableCell>{mute.reason || 'No reason provided'}</TableCell>
                      <TableCell>{formatDate(mute.muted_until)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className={`h-4 w-4 ${isActive ? 'text-yellow-400' : 'text-gray-400'}`} />
                          <span className={isActive ? 'text-yellow-400' : 'text-gray-400'}>
                            {isActive ? 'Active' : 'Expired'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{formatRelativeTime(mute.created_at)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

