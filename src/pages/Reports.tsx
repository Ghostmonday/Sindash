import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { moderationApi, type Report } from '@/api/moderation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatRelativeTime } from '@/lib/utils'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

export function Reports() {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')
  const [selectedReports, setSelectedReports] = useState<Set<string>>(new Set())
  const queryClient = useQueryClient()

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: moderationApi.getReports,
  })

  const filteredReports = reports.filter(
    (report) => selectedSeverity === 'all' || report.severity === selectedSeverity
  )

  const bulkResolveMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      // This would call a bulk resolve endpoint
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      setSelectedReports(new Set())
    },
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'harassment':
        return 'text-red-400'
      case 'scam':
        return 'text-orange-400'
      case 'spam':
        return 'text-yellow-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle2 className="h-4 w-4 text-green-400" />
      case 'dismissed':
        return <XCircle className="h-4 w-4 text-gray-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports</h1>
        <div className="flex gap-2">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-2 bg-background border border-input rounded-md"
          >
            <option value="all">All Severities</option>
            <option value="warning">Warning</option>
            <option value="harassment">Harassment</option>
            <option value="scam">Scam</option>
            <option value="spam">Spam</option>
            <option value="other">Other</option>
          </select>
          {selectedReports.size > 0 && (
            <Button
              variant="outline"
              onClick={() => bulkResolveMutation.mutate(Array.from(selectedReports))}
            >
              Resolve Selected ({selectedReports.size})
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">Loading reports...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedReports(new Set(filteredReports.map((r) => r.id)))
                        } else {
                          setSelectedReports(new Set())
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Room ID</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedReports.has(report.id)}
                        onChange={(e) => {
                          const newSet = new Set(selectedReports)
                          if (e.target.checked) {
                            newSet.add(report.id)
                          } else {
                            newSet.delete(report.id)
                          }
                          setSelectedReports(newSet)
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">{report.user_id.slice(0, 8)}...</TableCell>
                    <TableCell className="font-mono text-sm">{report.room_id.slice(0, 8)}...</TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell>
                      <span className={getSeverityColor(report.severity)}>{report.severity}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(report.status)}
                        <span className="capitalize">{report.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatRelativeTime(report.created_at)}</TableCell>
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

