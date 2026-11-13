import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { api } from '../lib/api'
import { examStorage } from '../lib/examStorage'
import type { Question } from '../types'

interface Section {
  id: string
  name: string
  shortName: string
  startNum: number
  endNum: number
  icon: string
}

const SECTIONS: Section[] = [
  { id: 'english', name: 'English Language & Literature', shortName: 'English', startNum: 1, endNum: 20, icon: '📖' },
  { id: 'bangla', name: 'বাংলা ভাষা ও সাহিত্য', shortName: 'বাংলা', startNum: 21, endNum: 40, icon: '🇧🇩' },
  { id: 'math', name: 'Mathematics & Quantitative Aptitude', shortName: 'Math', startNum: 41, endNum: 60, icon: '📐' },
  { id: 'banking', name: 'Banking, Finance & Economics', shortName: 'Banking', startNum: 61, endNum: 70, icon: '🏦' },
  { id: 'reasoning', name: 'Mental Ability & Logical Reasoning', shortName: 'Reasoning', startNum: 71, endNum: 90, icon: '🧠' },
  { id: 'ict', name: 'Information & Communication Tech (ICT)', shortName: 'ICT', startNum: 91, endNum: 100, icon: '💻' },
]

export default function ExamPage() {
  const { attemptId } = useParams<{ attemptId: string }>()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [activeSectionIdx, setActiveSectionIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(3600)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [candidateName, setCandidateName] = useState('')
  const autoSubmitted = useRef(false)

  const handleAutoSubmit = useCallback(async () => {
    if (!attemptId || autoSubmitted.current) return
    autoSubmitted.current = true
    try {
      await api.submitExam(attemptId)
    } catch { /* ignore */ }
    examStorage.clearAll()
    navigate(`/result/${attemptId}`)
  }, [attemptId, navigate])

  useEffect(() => {
    if (!attemptId) { navigate('/'); return }
    setAnswers(examStorage.getAnswers())
    setCandidateName(examStorage.getCandidateName())

    const expiresAt = examStorage.getExpiresAt()
    if (expiresAt) {
      const remaining = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000))
      if (remaining <= 0) { handleAutoSubmit(); return }
      setTimeLeft(remaining)
    }

    async function loadQuestions() {
      try {
        const { data: attempt, error: aErr } = await supabase
          .rpc('get_attempt_info_rpc', { p_attempt_id: attemptId })

        if (aErr || !attempt) { navigate('/'); return }
        if (attempt.status === 'submitted') { navigate(`/result/${attemptId}`); return }

        // Server expiry is authoritative (works even if localStorage was cleared)
        setCandidateName(attempt.candidate_name || '')
        examStorage.saveAttempt(attemptId!, attempt.expires_at, attempt.candidate_name || '')
        const skew = new Date(attempt.server_now).getTime() - Date.now()
        const remaining = Math.max(0, Math.floor((new Date(attempt.expires_at).getTime() - Date.now() - skew) / 1000))
        if (remaining <= 0) { handleAutoSubmit(); return }
        setTimeLeft(remaining)

        const { data: qs, error: qErr } = await supabase
          .from('questions')
          .select('id, question_number, question_text, option_a, option_b, option_c, option_d, subject')
          .eq('examination_id', attempt.examination_id)
          .order('question_number')

        if (qErr) throw qErr
        setQuestions(qs || [])
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load questions')
      } finally {
        setLoading(false)
      }
    }
    loadQuestions()
  }, [attemptId, navigate, handleAutoSubmit])

  useEffect(() => {
    if (loading) return
    const interval = setInterval(() => {
      const expiresAt = examStorage.getExpiresAt()
      if (!expiresAt) return
      const remaining = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000))
      setTimeLeft(remaining)
      if (remaining <= 0 && !autoSubmitted.current) handleAutoSubmit()
    }, 1000)
    return () => clearInterval(interval)
  }, [loading, handleAutoSubmit])

  async function selectAnswer(questionId: string, option: string) {
    const isAlreadySelected = answers[questionId] === option
    const newOption = isAlreadySelected ? null : option
    const newAnswers = { ...answers }
    if (newOption === null) {
      delete newAnswers[questionId]
    } else {
      newAnswers[questionId] = newOption
    }
    setAnswers(newAnswers)
    examStorage.saveAnswer(questionId, newOption)
    api.saveAnswer(attemptId!, questionId, newOption).catch(console.error)
  }

  async function handleSubmit() {
    if (!attemptId || submitting) return
    setSubmitting(true)
    setShowConfirm(false)
    try {
      await api.submitExam(attemptId)
      examStorage.clearAll()
      navigate(`/result/${attemptId}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.')
      setSubmitting(false)
    }
  }

  function formatTime(secs: number) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  function scrollToQuestion(qNum: number) {
    const el = document.getElementById(`q-${qNum}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading examination...</p></div>
  if (error) return <div className="loading-screen"><div className="alert alert-error">{error}</div></div>

  const currentSection = SECTIONS[activeSectionIdx]
  const sectionQuestions = questions.filter(
    q => q.question_number >= currentSection.startNum && q.question_number <= currentSection.endNum
  )

  const totalAnswered = questions.filter(q => answers[q.id]).length
  const totalUnanswered = questions.length - totalAnswered
  const timerClass = `timer${timeLeft < 300 ? ' danger' : timeLeft < 600 ? ' warning' : ''}`

  return (
    <div style={{minHeight:'100vh', display:'flex', flexDirection:'column'}}>
      <header className="exam-header">
        <div className="exam-header-inner">
          <div>
            <div className="exam-title">Senior Officer 2026</div>
            <div className="exam-subtitle">👤 Candidate: <strong>{candidateName}</strong></div>
          </div>
          <div className={timerClass}>⏱ {formatTime(timeLeft)}</div>
        </div>
      </header>

      {/* SECTION TABS NAVIGATION */}
      <div className="section-tabs-bar">
        <div className="section-tabs-inner">
          {SECTIONS.map((sec, idx) => {
            const secQs = questions.filter(q => q.question_number >= sec.startNum && q.question_number <= sec.endNum)
            const secAnswered = secQs.filter(q => answers[q.id]).length
            const isActive = idx === activeSectionIdx
            return (
              <button
                key={sec.id}
                className={`section-tab-btn${isActive ? ' active' : ''}`}
                onClick={() => {
                  setActiveSectionIdx(idx)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                <span className="sec-icon">{sec.icon}</span>
                <span className="sec-name">{sec.shortName}</span>
                <span className={`sec-badge ${secAnswered === secQs.length && secQs.length > 0 ? 'complete' : ''}`}>
                  {secAnswered}/{secQs.length}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="exam-layout">
        {/* MAIN SECTION QUESTIONS LIST */}
        <div className="section-content">
          <div className="section-banner">
            <div>
              <h2>{currentSection.icon} {currentSection.name}</h2>
              <p>Questions {currentSection.startNum} to {currentSection.endNum} ({sectionQuestions.length} Questions)</p>
            </div>
            <div className="section-progress">
              {sectionQuestions.filter(q => answers[q.id]).length} of {sectionQuestions.length} Answered
            </div>
          </div>

          <div className="questions-container">
            {sectionQuestions.map((q) => {
              const selectedOpt = answers[q.id]
              return (
                <div key={q.id} id={`q-${q.question_number}`} className="question-item-card">
                  <div className="q-item-header">
                    <span className="q-item-number">Q. {q.question_number}</span>
                    {selectedOpt && <span className="q-answered-tag">✓ Answered ({selectedOpt})</span>}
                  </div>
                  <div className="q-item-text">{q.question_text}</div>

                  <div className="q-options-grid">
                    {(['A','B','C','D'] as const).map(opt => {
                      const key = `option_${opt.toLowerCase()}` as keyof Question
                      const optText = q[key] as string
                      const isSelected = selectedOpt === opt
                      return (
                        <button
                          key={opt}
                          className={`q-opt-btn${isSelected ? ' selected' : ''}`}
                          onClick={() => selectAnswer(q.id, opt)}
                          disabled={submitting}
                        >
                          <span className="opt-circle">{opt}</span>
                          <span className="opt-text">{optText}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* SECTION NAVIGATION BUTTONS */}
          <div className="section-nav-footer">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setActiveSectionIdx(i => Math.max(0, i - 1))
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              disabled={activeSectionIdx === 0}
            >
              ← Previous Section
            </button>

            {activeSectionIdx < SECTIONS.length - 1 ? (
              <button
                className="btn btn-primary"
                style={{width:'auto'}}
                onClick={() => {
                  setActiveSectionIdx(i => Math.min(SECTIONS.length - 1, i + 1))
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                Next Section ({SECTIONS[activeSectionIdx + 1].shortName}) →
              </button>
            ) : (
              <button
                className="btn btn-danger"
                style={{width:'auto'}}
                onClick={() => setShowConfirm(true)}
              >
                🏁 Finish & Submit Exam
              </button>
            )}
          </div>
        </div>

        {/* SIDEBAR PANEL */}
        <aside className="exam-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-title">⚡ Quick Jump ({currentSection.shortName})</div>
            <div className="sidebar-grid">
              {sectionQuestions.map(q => {
                const isAnswered = !!answers[q.id]
                return (
                  <button
                    key={q.id}
                    className={`sidebar-q-btn${isAnswered ? ' answered' : ''}`}
                    onClick={() => scrollToQuestion(q.question_number)}
                  >
                    {q.question_number}
                  </button>
                )
              })}
            </div>

            <div className="overall-summary">
              <div className="summary-title">📊 Overall Progress</div>
              <div className="summary-row">
                <span>Total Answered</span>
                <strong style={{color:'var(--success)'}}>{totalAnswered} / {questions.length}</strong>
              </div>
              <div className="summary-row">
                <span>Total Remaining</span>
                <strong style={{color:'var(--warning)'}}>{totalUnanswered}</strong>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{width: `${questions.length ? (totalAnswered/questions.length)*100 : 0}%`}}
                ></div>
              </div>
            </div>

            <button
              className="submit-exam-btn"
              style={{marginTop:'1.2rem'}}
              onClick={() => setShowConfirm(true)}
              disabled={submitting}
            >
              {submitting ? '⏳ Submitting...' : '🏁 Submit Examination'}
            </button>
          </div>
        </aside>
      </div>

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>⚠️ Submit Examination?</h2>
            <p>Once submitted, your examination will be finalized and evaluated. You will not be able to modify your answers.</p>
            <div className="modal-stats">
              <div className="modal-stat-row"><span>✅ Total Answered</span><strong>{totalAnswered} / {questions.length}</strong></div>
              <div className="modal-stat-row"><span>⬜ Total Unanswered</span><strong>{totalUnanswered}</strong></div>
              <div className="modal-stat-row"><span>⏱ Remaining Time</span><strong>{formatTime(timeLeft)}</strong></div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>
                Continue Exam
              </button>
              <button className="btn btn-danger" onClick={handleSubmit}>
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
