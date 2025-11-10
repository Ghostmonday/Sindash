import { useQuery } from '@tanstack/react-query'
import { aiSummaryApi } from '@/api/aiSummary'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { formatRelativeTime } from '@/lib/utils'
import { Sparkles } from 'lucide-react'

export function AISummaryCard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['aiSummary'],
    queryFn: aiSummaryApi.getSummary,
    refetchInterval: 86400000, // Daily refresh
  })

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">AI Summary unavailable</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Daily Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{data.summary}</p>
        
        {data.trends && (
          <div className="space-y-2 pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Flagged Users: </span>
                <span className="font-semibold text-destructive">{data.trends.flagged_users}</span>
              </div>
              {data.trends.top_violations && data.trends.top_violations.length > 0 && (
                <div>
                  <span className="text-muted-foreground">Top Violation: </span>
                  <span className="font-semibold">{data.trends.top_violations[0].type}</span>
                </div>
              )}
            </div>
            
            {data.trends.trending_abuse && data.trends.trending_abuse.length > 0 && (
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-1">Trending Abuse Patterns:</p>
                <div className="flex flex-wrap gap-2">
                  {data.trends.trending_abuse.map((pattern, idx) => (
                    <span key={idx} className="px-2 py-1 bg-destructive/10 text-destructive text-xs rounded">
                      {pattern}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        <p className="text-xs text-muted-foreground pt-2">
          Updated {formatRelativeTime(data.last_updated)}
        </p>
      </CardContent>
    </Card>
  )
}

