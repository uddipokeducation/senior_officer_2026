import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateFullName, validateMobile, validateEmail, normalizeMobile } from '../lib/validation'
import { api } from '../lib/api'
import { examStorage } from '../lib/examStorage'

export default function RegistrationPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', mobile: '', email: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    // Redirect if there's an active in-progress attempt
    const attemptId = examStorage.getAttemptId()
    const expiresAt = examStorage.getExpiresAt()
    if (attemptId && expiresAt) {
      const remaining = new Date(expiresAt).getTime() - Date.now()
      if (remaining > 0) navigate(`/exam/${attemptId}`)
    }
  }, [navigate])

  function validate() {
    const e: Record<string, string> = {}
    const n = validateFullName(form.fullName)
    const m = validateMobile(form.mobile)
    const em = validateEmail(form.email)
    if (n) e.fullName = n
    if (m) e.mobile = m
    if (em) e.email = em
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setServerError('')
    try {
      const result = await api.startExam({
        fullName: form.fullName.trim(),
        mobile: normalizeMobile(form.mobile),
        email: form.email.trim().toLowerCase(),
      })
      examStorage.saveAttempt(result.attemptId, result.expiresAt, form.fullName.trim())
      navigate(`/exam/${result.attemptId}`)
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <div className="reg-page">
      <div className="reg-card">
        <div className="reg-logo">
          <div className="reg-badge">Uddipok Education</div>
          <h1>Senior Officer 2026</h1>
          <p>Recruitment Examination (MCQ) — Set A</p>
        </div>

        <div className="exam-info-box">
          <h3>📋 Examination Details</h3>
          <ul>
            <li>100 MCQ Questions | Duration: 60 Minutes</li>
            <li>Full Marks: 100</li>
            <li>Correct Answer: +1 Mark</li>
            <li>Incorrect Answer: −0.25 Mark</li>
            <li>Unanswered: 0 Mark</li>
          </ul>
        </div>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Full Name <span>*</span></label>
            <input className={`form-control${errors.fullName ? ' error' : ''}`}
              type="text" value={form.fullName} onChange={set('fullName')}
              placeholder="Enter your full name" disabled={loading} />
            {errors.fullName && <p className="error-msg">{errors.fullName}</p>}
          </div>

          <div className="form-group">
            <label>Mobile Number <span>*</span></label>
            <input className={`form-control${errors.mobile ? ' error' : ''}`}
              type="tel" value={form.mobile} onChange={set('mobile')}
              placeholder="01XXXXXXXXX" disabled={loading} />
            {errors.mobile && <p className="error-msg">{errors.mobile}</p>}
            <p className="hint">Format: 01XXXXXXXXX or +8801XXXXXXXXX</p>
          </div>

          <div className="form-group">
            <label>Email Address <span>*</span></label>
            <input className={`form-control${errors.email ? ' error' : ''}`}
              type="email" value={form.email} onChange={set('email')}
              placeholder="your@email.com" disabled={loading} />
            {errors.email && <p className="error-msg">{errors.email}</p>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '⏳ Registering...' : '🚀 Start Examination'}
          </button>
        </form>
      </div>
    </div>
  )
}
