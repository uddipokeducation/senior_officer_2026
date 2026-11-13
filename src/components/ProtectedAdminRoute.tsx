import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // 1. Check local admin session
    if (sessionStorage.getItem('admin_session') === 'true') {
      setIsAdmin(true)
      setChecking(false)
      return
    }

    // 2. Check Supabase Auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAdmin(true)
      }
      setChecking(false)
    }).catch(() => {
      setChecking(false)
    })
  }, [])

  if (checking) return <div className="loading-screen"><div className="spinner"></div></div>
  if (!isAdmin) return <Navigate to="/admin" replace />
  return <>{children}</>
}
