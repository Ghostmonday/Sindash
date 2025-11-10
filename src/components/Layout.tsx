import { Outlet, Link, useLocation } from 'react-router-dom'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'
import { Button } from './ui/Button'
import { FileText, BarChart3, Settings, LogOut } from 'lucide-react'

export function Layout() {
  const location = useLocation()
  const { signOut, user } = useSupabaseAuth()

  const navItems = [
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/mutes', label: 'Mutes', icon: FileText },
    { path: '/ai-logs', label: 'AI Logs', icon: FileText },
    { path: '/telemetry', label: 'Telemetry', icon: BarChart3 },
    { path: '/ops', label: 'Operations', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="w-64 border-r border-border bg-card">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold">Sinapse Dashboard</h2>
            <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
          </div>
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t border-border">
            <Button variant="ghost" className="w-full justify-start" onClick={signOut}>
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </aside>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

