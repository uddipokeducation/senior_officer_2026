import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) throw new Error('Invalid email or password')
      const { data: isAdmin } = await supabase.rpc('is_admin')
      if (!isAdmin) {
        await supabase.auth.signOut()
        throw new Error('Access denied. This account is not an administrator.')
      }
      navigate('/admin/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="reg-page">
      <div className="reg-card">
        <div className="reg-logo">
          <div className="reg-badge">Administrative Control</div>
          <h1>🔐 Admin Login</h1>
          <p>Senior Officer 2026 Examination Dashboard</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Admin Email</label>
            <input className="form-control" type="email" value={email}
              onChange={e => setEmail(e.target.value)} required disabled={loading} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" value={password}
              onChange={e => setPassword(e.target.value)} required disabled={loading} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>
        <div style={{textAlign:'center',marginTop:'1rem'}}>
          <Link to="/" style={{color:'var(--text-muted)',fontSize:'0.82rem',textDecoration:'none'}}>
            ← Back to Candidate Exam Portal
          </Link>
        </div>
      </div>
    </div>
  )
}
