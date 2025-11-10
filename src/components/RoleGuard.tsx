import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'
import { hasAccess, type UserRole } from '@/security/rbac'
import { Card, CardContent } from './ui/Card'
import { AlertCircle } from 'lucide-react'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  fallback?: React.ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { userRole } = useSupabaseAuth()

  if (!hasAccess(userRole, allowedRoles)) {
    return (
      fallback || (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to access this page. Required roles: {allowedRoles.join(', ')}
            </p>
          </CardContent>
        </Card>
      )
    )
  }

  return <>{children}</>
}

