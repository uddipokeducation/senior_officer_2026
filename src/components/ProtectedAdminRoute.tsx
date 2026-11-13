import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { setChecking(false); return }
      const { data } = await supabase.from('admin_users').select('id').eq('id', session.user.id).single()
      setIsAdmin(!!data)
      setChecking(false)
    })
  }, [])

  if (checking) return <div className="loading-screen"><div className="spinner"></div></div>
  if (!isAdmin) return <Navigate to="/admin" replace />
  return <>{children}</>
}
