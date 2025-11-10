import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { telemetryApi } from '@/api/telemetry'
import { ChartCard } from '@/components/ChartCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

type Timeframe = '1h' | '24h' | '7d' | '30d'

export function Telemetry() {
  const [timeframe, setTimeframe] = useState<Timeframe>('24h')

  const { data: trends = [], isLoading } = useQuery({
    queryKey: ['telemetry', 'trends', timeframe],
    queryFn: () => telemetryApi.getTrends(timeframe),
  })

  const { data: summary } = useQuery({
    queryKey: ['telemetry', 'summary'],
    queryFn: telemetryApi.getSummary,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Telemetry Dashboard</h1>
        <div className="flex gap-2">
          {(['1h', '24h', '7d', '30d'] as Timeframe[]).map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? 'default' : 'outline'}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total_messages.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total_users.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Moderation Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.moderation_actions.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Latency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.avg_latency.toFixed(0)}ms</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Message Volume"
          data={trends}
          dataKey="message_volume"
          type="bar"
          color="#3b82f6"
        />
        <ChartCard
          title="Active Users"
          data={trends}
          dataKey="active_users"
          type="line"
          color="#10b981"
        />
        <ChartCard
          title="Auto-Moderation Triggers"
          data={trends}
          dataKey="auto_moderation_triggers"
          type="bar"
          color="#f59e0b"
        />
        <ChartCard
          title="Average Latency"
          data={trends}
          dataKey="avg_latency_ms"
          type="line"
          color="#ef4444"
        />
      </div>
    </div>
  )
}

