import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          const { data } = await supabase.rpc('is_admin')
          setIsAdmin(data === true)
        }
      } finally {
        setChecking(false)
      }
    })()
  }, [])

  if (checking) return <div className="loading-screen"><div className="spinner"></div></div>
  if (!isAdmin) return <Navigate to="/admin" replace />
  return <>{children}</>
}
