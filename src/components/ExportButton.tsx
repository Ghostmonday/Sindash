import { useState } from 'react'
import { exportApi } from '@/api/export'
import { Button } from './ui/Button'
import { Download } from 'lucide-react'

interface ExportButtonProps {
  type: 'reports' | 'mutes' | 'ai-logs'
  variant?: 'default' | 'outline' | 'ghost'
}

export function ExportButton({ type, variant = 'outline' }: ExportButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleExport = async (format: 'csv' | 'json') => {
    setLoading(true)
    try {
      switch (type) {
        case 'reports':
          await exportApi.exportReports(format)
          break
        case 'mutes':
          await exportApi.exportMutes(format)
          break
        case 'ai-logs':
          await exportApi.exportAILogs(format)
          break
      }
    } catch (error) {
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant={variant}
        size="sm"
        onClick={() => handleExport('csv')}
        disabled={loading}
      >
        <Download className="h-4 w-4 mr-2" />
        {loading ? 'Exporting...' : 'CSV'}
      </Button>
      <Button
        variant={variant}
        size="sm"
        onClick={() => handleExport('json')}
        disabled={loading}
      >
        <Download className="h-4 w-4 mr-2" />
        {loading ? 'Exporting...' : 'JSON'}
      </Button>
    </div>
  )
}

