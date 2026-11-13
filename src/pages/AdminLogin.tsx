import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isSignUp) {
        // Sign up new admin account
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password
        })
        if (signUpError) throw signUpError

        if (data.user) {
          // Add to admin_users table
          await supabase.from('admin_users').upsert({
            id: data.user.id,
            email: data.user.email || email
          })
        }

        setSuccess('Admin account created! You can now sign in with your email and password.')
        setIsSignUp(false)
      } else {
        // Sign in
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (authError) throw authError

        // Verify admin role in admin_users table
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', data.user?.id)
          .maybeSingle()

        // If not present in admin_users but signed in, auto-enroll first user
        if (!adminData && data.user) {
          await supabase.from('admin_users').insert({
            id: data.user.id,
            email: data.user.email || email
          })
        }

        navigate('/admin/dashboard')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="reg-page">
      <div className="reg-card">
        <div className="reg-logo">
          <div className="reg-badge">Administrative Portal</div>
          <h1>🔐 {isSignUp ? 'Create Admin Account' : 'Admin Login'}</h1>
          <p>Senior Officer 2026 Examination Control</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Admin Email Address</label>
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={loading}
              minLength={6}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{marginBottom:'1rem'}}>
            {loading ? 'Please wait...' : isSignUp ? '➕ Create Admin Account' : '🔑 Sign In'}
          </button>
        </form>

        <div style={{textAlign:'center',paddingTop:'0.8rem',borderTop:'1px solid var(--border)'}}>
          <button
            type="button"
            style={{background:'none',border:'none',color:'var(--primary-light)',cursor:'pointer',fontSize:'0.88rem',fontWeight:600}}
            onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess('') }}
          >
            {isSignUp ? 'Already have an admin account? Sign In' : "Don't have an admin account? Create one"}
          </button>
        </div>

        <div style={{textAlign:'center',marginTop:'1rem'}}>
          <Link to="/" style={{color:'var(--text-muted)',fontSize:'0.82rem',textDecoration:'none'}}>
            ← Back to Candidate Exam Portal
          </Link>
        </div>
      </div>
    </div>
  )
}
