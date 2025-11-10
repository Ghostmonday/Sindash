import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<'admin' | 'mod' | 'viewer' | undefined>(undefined)
  const navigate = useNavigate()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      // Extract role from user metadata
      const role = (session?.user?.user_metadata?.role || session?.user?.app_metadata?.role) as 'admin' | 'mod' | 'viewer' | undefined
      setUserRole(role)
      setLoading(false)
      
      if (session?.access_token) {
        localStorage.setItem('supabase.auth.token', session.access_token)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      // Extract role from user metadata
      const role = (session?.user?.user_metadata?.role || session?.user?.app_metadata?.role) as 'admin' | 'mod' | 'viewer' | undefined
      setUserRole(role)
      
      if (session?.access_token) {
        localStorage.setItem('supabase.auth.token', session.access_token)
      } else {
        localStorage.removeItem('supabase.auth.token')
        navigate('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('supabase.auth.token')
    navigate('/login')
  }

  return {
    user,
    session,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
    userRole,
  }
}

