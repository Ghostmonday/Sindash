import { useQuery, useQueryClient } from '@tanstack/react-query'
import { moderationApi, type AILog } from '@/api/moderation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Card, CardContent } from '@/components/ui/Card'
import { formatRelativeTime } from '@/lib/utils'
import { useRealtime } from '@/hooks/useRealtime'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export function AILogs() {
  const queryClient = useQueryClient()
  
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['ai-logs'],
    queryFn: moderationApi.getAILogs,
  })

  // Real-time updates for AI logs
  useRealtime<AILog>('ai_logs_realtime', 'moderation_flags', (newLog) => {
    queryClient.setQueryData(['ai-logs'], (old: AILog[] = []) => {
      return [newLog, ...(old || [])].slice(0, 100) // Keep latest 100
    })
  })

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case 'mute':
        return <XCircle className="h-4 w-4 text-red-400" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-400" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score > 0.85) return 'text-red-400'
    if (score > 0.65) return 'text-yellow-400'
    return 'text-green-400'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI Moderation Logs</h1>
        <div className="text-sm">
          <span className="text-muted-foreground">Total: </span>
          <span className="font-bold">{logs.length}</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">Loading AI logs...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Room ID</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Toxic</TableHead>
                  <TableHead>Suggestion</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">{log.user_id.slice(0, 8)}...</TableCell>
                    <TableCell className="font-mono text-sm">{log.room_id.slice(0, 8)}...</TableCell>
                    <TableCell>
                      <span className={getScoreColor(log.score)}>{(log.score * 100).toFixed(1)}%</span>
                    </TableCell>
                    <TableCell>
                      <span className={log.is_toxic ? 'text-red-400' : 'text-green-400'}>
                        {log.is_toxic ? 'Yes' : 'No'}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{log.suggestion}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action_taken)}
                        <span className="capitalize">{log.action_taken}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatRelativeTime(log.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

