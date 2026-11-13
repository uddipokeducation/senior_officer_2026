import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { BrandLogo } from '../components/BrandLogo'
import { Icons } from '../components/Icons'

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
      if (authError) throw new Error('Invalid administrator email or password')
      const { data: isAdmin } = await supabase.rpc('is_admin')
      if (!isAdmin) {
        await supabase.auth.signOut()
        throw new Error('Access denied. This account does not have administrator privileges.')
      }
      navigate('/admin/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="reg-page">
      <div className="reg-card">
        <div style={{ marginBottom: '1.5rem', paddingBottom: '1.15rem', borderBottom: '1px solid var(--slate-100)' }}>
          <BrandLogo variant="dark" size="sm" subtitle="Administrative Analytics & Control Suite" />
        </div>

        <div className="reg-card-header" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-700)', marginBottom: '0.25rem' }}>
            <Icons.Lock size={14} />
            <span>Restricted Access</span>
          </div>
          <h2>Administrator Sign In</h2>
          <p>Authenticate with your authorized Supabase administrator account.</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <Icons.AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Administrator Email</label>
            <div className="input-wrapper">
              <span className="input-icon"><Icons.Mail size={17} /></span>
              <input
                className="form-control with-icon"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Password</label>
            <div className="input-wrapper">
              <span className="input-icon"><Icons.Lock size={17} /></span>
              <input
                className="form-control with-icon"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Admin Dashboard</span>
                <Icons.ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.35rem', paddingTop: '1rem', borderTop: '1px solid var(--slate-100)' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--slate-500)', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>
            <Icons.ArrowLeft size={14} />
            <span>Return to Candidate Examination Portal</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
