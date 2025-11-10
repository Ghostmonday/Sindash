export type UserRole = 'admin' | 'mod' | 'viewer'

export function hasAccess(userRole: UserRole | undefined, allowedRoles: UserRole[]): boolean {
  if (!userRole) return false
  return allowedRoles.includes(userRole)
}

export function isAdmin(userRole: UserRole | undefined): boolean {
  return userRole === 'admin'
}

export function isModerator(userRole: UserRole | undefined): boolean {
  return userRole === 'admin' || userRole === 'mod'
}

export function canMute(userRole: UserRole | undefined): boolean {
  return isModerator(userRole)
}

export function canBan(userRole: UserRole | undefined): boolean {
  return isAdmin(userRole)
}

export function canExport(userRole: UserRole | undefined): boolean {
  return isModerator(userRole)
}

