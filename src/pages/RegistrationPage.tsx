import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateFullName, validateMobile, validateEmail, normalizeMobile } from '../lib/validation'
import { api } from '../lib/api'
import { examStorage } from '../lib/examStorage'
import { BrandLogo } from '../components/BrandLogo'
import { Icons } from '../components/Icons'
import { WhatsAppCommunityBanner } from '../components/WhatsAppCommunityBanner'

const SYLLABUS_SECTIONS = [
  { name: 'English Language & Literature', range: 'Q 01–20', marks: '20 Marks', Icon: Icons.BookOpen },
  { name: 'বাংলা ভাষা ও সাহিত্য', range: 'Q 21–40', marks: '20 Marks', Icon: Icons.Languages },
  { name: 'Mathematics & Quantitative Aptitude', range: 'Q 41–60', marks: '20 Marks', Icon: Icons.Calculator },
  { name: 'Banking, Finance & Economics', range: 'Q 61–70', marks: '10 Marks', Icon: Icons.Landmark },
  { name: 'Mental Ability & Logical Reasoning', range: 'Q 71–90', marks: '20 Marks', Icon: Icons.Brain },
  { name: 'Information & Communication Tech (ICT)', range: 'Q 91–100', marks: '10 Marks', Icon: Icons.Cpu },
]

export default function RegistrationPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', mobile: '', email: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  useEffect(() => {
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
    <div className="reg-shell">
      <header className="portal-topbar">
        <div className="portal-topbar-inner">
          <BrandLogo variant="light" size="md" />
          <a
            href="https://chat.whatsapp.com/FwULKQJRU93ALasMI6J8g9"
            target="_blank"
            rel="noopener noreferrer"
            className="portal-nav-link"
          >
            <Icons.WhatsApp size={15} />
            <span>Join WhatsApp Community</span>
          </a>
        </div>
      </header>

      <main className="reg-main">
        {/* LEFT COLUMN: EXAMINATION BRIEF & BRANDING */}
        <section className="brief-panel">
          <div>
            <div className="exam-tag-row" style={{ marginBottom: '0.85rem' }}>
              <span className="exam-pill-badge">
                <Icons.Shield size={14} />
                Official Competitive Assessment
              </span>
              <span className="exam-pill-secondary">JOB ID: 26101 • SET A</span>
            </div>
            <h1 className="hero-heading">
              Senior Officer <span>2026</span>
            </h1>
            <p className="hero-sub" style={{ marginTop: '0.5rem' }}>
              9th Grade (General) Recruitment Test (MCQ Part) conducted on the{' '}
              <strong style={{ color: 'var(--brand-800)', fontFamily: 'var(--font-bn)' }}>উদ্দীপক (Uddipok Education)</strong>{' '}
              Computer-Based Examination Platform.
            </p>
          </div>

          <div className="metric-strip">
            <div className="metric-tile">
              <div className="metric-tile-top">
                <span>Questions</span>
                <Icons.FileCheck size={16} />
              </div>
              <div className="metric-tile-val">100</div>
              <div className="metric-tile-sub">Standard MCQs</div>
            </div>
            <div className="metric-tile">
              <div className="metric-tile-top">
                <span>Duration</span>
                <Icons.Clock size={16} />
              </div>
              <div className="metric-tile-val">60m</div>
              <div className="metric-tile-sub">Server-Timed</div>
            </div>
            <div className="metric-tile">
              <div className="metric-tile-top">
                <span>Full Marks</span>
                <Icons.Award size={16} />
              </div>
              <div className="metric-tile-val">100.00</div>
              <div className="metric-tile-sub">+1.00 / Correct</div>
            </div>
            <div className="metric-tile">
              <div className="metric-tile-top" style={{ color: 'var(--danger)' }}>
                <span>Penalty</span>
                <Icons.MinusCircle size={16} />
              </div>
              <div className="metric-tile-val" style={{ color: 'var(--danger)' }}>−0.25</div>
              <div className="metric-tile-sub">Per Wrong Answer</div>
            </div>
          </div>

          <div className="syllabus-card">
            <div className="syllabus-card-header">
              <h3>
                <Icons.BarChart size={18} style={{ color: 'var(--brand-600)' }} />
                <span>Section Breakdown & Marks Distribution</span>
              </h3>
              <span style={{ fontSize: '0.76rem', color: 'var(--slate-500)', fontWeight: 600 }}>6 Sections</span>
            </div>
            <div className="syllabus-grid">
              {SYLLABUS_SECTIONS.map((sec) => {
                const SecIcon = sec.Icon
                return (
                  <div key={sec.range} className="syllabus-item">
                    <div className="syllabus-item-left">
                      <div className="syllabus-icon-box">
                        <SecIcon size={16} />
                      </div>
                      <span className="syllabus-name" title={sec.name}>{sec.name}</span>
                    </div>
                    <span className="syllabus-range">{sec.range}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="syllabus-card" style={{ padding: '1.15rem 1.35rem' }}>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Icons.Shield size={16} style={{ color: 'var(--brand-600)' }} />
              <span>Examination Guidelines & Marking Protocol</span>
            </h3>
            <ul className="rules-list">
              <li>
                <Icons.Check size={15} />
                <span>
                  Authoritative scoring formula: <strong>Final Score = (Correct × 1.00) − (Incorrect × 0.25)</strong>. Unanswered questions carry zero penalty.
                </span>
              </li>
              <li>
                <Icons.Check size={15} />
                <span>
                  Your 60-minute timer is synchronized with the server. Refreshing the browser preserves all selected responses without resetting the clock.
                </span>
              </li>
              <li>
                <Icons.Check size={15} />
                <span>
                  Navigate freely across all 6 subject sections and review your full scorecard and answer key immediately upon submission.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* RIGHT COLUMN: CANDIDATE REGISTRATION CARD */}
        <section style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="reg-card" style={{ maxWidth: '100%' }}>
            <div className="reg-card-header">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-700)', marginBottom: '0.35rem' }}>
                <Icons.User size={14} />
                <span>Candidate Enrollment</span>
              </div>
              <h2>Register to Start Exam</h2>
              <p>Complete your candidate profile below to launch the 60-minute examination session.</p>
            </div>

            {serverError && (
              <div className="alert alert-error">
                <Icons.AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label>Full Name <span>*</span></label>
                <div className="input-wrapper">
                  <span className="input-icon"><Icons.User size={17} /></span>
                  <input
                    className={`form-control with-icon${errors.fullName ? ' error' : ''}`}
                    type="text"
                    value={form.fullName}
                    onChange={set('fullName')}
                    placeholder="e.g. Md. Tariqul Islam"
                    disabled={loading}
                  />
                </div>
                {errors.fullName && <p className="error-msg">{errors.fullName}</p>}
              </div>

              <div className="form-group">
                <label>Mobile Number (Bangladesh) <span>*</span></label>
                <div className="input-wrapper">
                  <span className="input-icon"><Icons.Phone size={17} /></span>
                  <input
                    className={`form-control with-icon${errors.mobile ? ' error' : ''}`}
                    type="tel"
                    value={form.mobile}
                    onChange={set('mobile')}
                    placeholder="017XXXXXXXX"
                    disabled={loading}
                  />
                </div>
                {errors.mobile ? (
                  <p className="error-msg">{errors.mobile}</p>
                ) : (
                  <p className="hint">Accepted format: 01XXXXXXXXX or +8801XXXXXXXXX</p>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Email Address <span>*</span></label>
                <div className="input-wrapper">
                  <span className="input-icon"><Icons.Mail size={17} /></span>
                  <input
                    className={`form-control with-icon${errors.email ? ' error' : ''}`}
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="candidate@example.com"
                    disabled={loading}
                  />
                </div>
                {errors.email && <p className="error-msg">{errors.email}</p>}
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.88rem' }} disabled={loading}>
                {loading ? (
                  <span>Initializing Examination Session...</span>
                ) : (
                  <>
                    <span>Start 60-Minute Examination</span>
                    <Icons.ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div style={{ marginTop: '1.35rem', paddingTop: '1rem', borderTop: '1px solid var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontSize: '0.76rem', color: 'var(--slate-500)' }}>
              <Icons.Shield size={14} style={{ color: 'var(--brand-600)' }} />
              <span>Secured by উদ্দীপক (Uddipok Education) Evaluation Engine</span>
            </div>
          </div>
        </section>
      </main>

      <div style={{ maxWidth: '1240px', width: '100%', margin: '0 auto', padding: '0 1.5rem 2.5rem' }}>
        <WhatsAppCommunityBanner />
      </div>

      <footer className="portal-footer">
        © {new Date().getFullYear()}{' '}
        <strong style={{ fontFamily: 'var(--font-bn)', color: 'var(--brand-900)' }}>উদ্দীপক</strong>{' '}
        <strong>(Uddipok Education)</strong> • Online Recruitment & Competitive Assessment Platform
      </footer>
    </div>
  )
}
