import { useState } from 'react'
import { Button } from './ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'

interface ActionModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  onSubmit: (data: { userId: string; roomId?: string; reason?: string; durationHours?: number }) => Promise<void>
  actionType: 'mute' | 'ban'
}

export function ActionModal({ isOpen, onClose, title, onSubmit, actionType }: ActionModalProps) {
  const [userId, setUserId] = useState('')
  const [roomId, setRoomId] = useState('')
  const [reason, setReason] = useState('')
  const [durationHours, setDurationHours] = useState(24)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({ userId, roomId: roomId || undefined, reason: reason || undefined, durationHours })
      setUserId('')
      setRoomId('')
      setReason('')
      setDurationHours(24)
      onClose()
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">User ID *</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Room ID (optional)</label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Reason (optional)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duration (hours)</label>
              <input
                type="number"
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-background border border-input rounded-md"
                min={1}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant={actionType === 'ban' ? 'destructive' : 'default'} disabled={loading}>
                {loading ? 'Processing...' : actionType === 'ban' ? 'Ban User' : 'Mute User'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

