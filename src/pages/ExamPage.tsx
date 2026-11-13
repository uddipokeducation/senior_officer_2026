import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { api } from '../lib/api'
import { examStorage } from '../lib/examStorage'
import type { Question } from '../types'

export default function ExamPage() {
  const { attemptId } = useParams<{ attemptId: string }>()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentIdx, setCurrentIdx] = useState(0)
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
          .from('exam_attempts')
          .select('examination_id, status, candidates(full_name)')
          .eq('id', attemptId!)
          .single()

        if (aErr || !attempt) { navigate('/'); return }
        if (attempt.status === 'submitted') { navigate(`/result/${attemptId}`); return }

        const cand = attempt.candidates as unknown as { full_name: string } | null
        if (cand && typeof cand === 'object' && 'full_name' in cand) {
          setCandidateName(cand.full_name || '')
        }

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
    const newAnswers = { ...answers, [questionId]: option }
    setAnswers(newAnswers)
    examStorage.saveAnswer(questionId, option)
    api.saveAnswer(attemptId!, questionId, option).catch(console.error)
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

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading examination...</p></div>
  if (error) return <div className="loading-screen"><div className="alert alert-error">{error}</div></div>

  const currentQ = questions[currentIdx]
  const answeredCount = questions.filter(q => answers[q.id]).length
  const unansweredCount = questions.length - answeredCount
  const timerClass = `timer${timeLeft < 300 ? ' danger' : timeLeft < 600 ? ' warning' : ''}`

  return (
    <div>
      <header className="exam-header">
        <div className="exam-header-inner">
          <div>
            <div className="exam-title">Senior Officer 2026</div>
            <div className="exam-subtitle">👤 {candidateName}</div>
          </div>
          <div className={timerClass}>⏱ {formatTime(timeLeft)}</div>
        </div>
      </header>

      <div className="exam-layout">
        {currentQ && (
          <div className="question-card">
            <div className="question-header">
              <span className="question-num">Question {currentQ.question_number} of {questions.length}</span>
              {currentQ.subject && <span className="question-subject">{currentQ.subject}</span>}
            </div>
            <div className="question-text">{currentQ.question_text}</div>
            <ul className="options-list">
              {(['A','B','C','D'] as const).map(opt => {
                const key = `option_${opt.toLowerCase()}` as keyof Question
                const optText = currentQ[key] as string
                const selected = answers[currentQ.id] === opt
                return (
                  <li key={opt}>
                    <button
                      className={`option-btn${selected ? ' selected' : ''}`}
                      onClick={() => selectAnswer(currentQ.id, opt)}
                      disabled={submitting}
                    >
                      <span className="opt-label">{opt}.</span>
                      <span>{optText}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="nav-buttons">
              <button className="btn btn-secondary"
                onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
                disabled={currentIdx === 0}>
                ← Previous
              </button>
              <span style={{fontSize:'0.85rem',color:'var(--text-muted)'}}>
                {answeredCount} / {questions.length} answered
              </span>
              <button className="btn btn-primary"
                onClick={() => setCurrentIdx(i => Math.min(questions.length - 1, i + 1))}
                disabled={currentIdx === questions.length - 1}>
                Next →
              </button>
            </div>
          </div>
        )}

        <div className="question-nav-panel">
          <div className="nav-panel-title">📋 Question Navigator</div>
          <div className="nav-legend">
            <div className="legend-item"><div className="legend-dot answered"></div>Answered</div>
            <div className="legend-item"><div className="legend-dot current"></div>Current</div>
            <div className="legend-item"><div className="legend-dot unanswered"></div>Unanswered</div>
          </div>
          <div className="nav-grid">
            {questions.map((q, idx) => {
              const isAnswered = !!answers[q.id]
              const isCurrent = idx === currentIdx
              let cls = 'nav-cell'
              if (isCurrent && isAnswered) cls += ' current-answered'
              else if (isCurrent) cls += ' current'
              else if (isAnswered) cls += ' answered'
              return (
                <button key={q.id} className={cls} onClick={() => setCurrentIdx(idx)}>
                  {q.question_number}
                </button>
              )
            })}
          </div>
          <div className="nav-stats">
            <div className="nav-stat-row"><span>✅ Answered</span><strong>{answeredCount}</strong></div>
            <div className="nav-stat-row"><span>⬜ Unanswered</span><strong>{unansweredCount}</strong></div>
            <div className="nav-stat-row"><span>📊 Total</span><strong>{questions.length}</strong></div>
          </div>
          <button className="submit-exam-btn" onClick={() => setShowConfirm(true)} disabled={submitting}>
            {submitting ? '⏳ Submitting...' : '🏁 Submit Examination'}
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>⚠️ Submit Examination?</h2>
            <p>Once submitted, you cannot change your answers.</p>
            <div className="modal-stats">
              <div className="modal-stat-row"><span>✅ Answered</span><strong>{answeredCount}</strong></div>
              <div className="modal-stat-row"><span>⬜ Unanswered</span><strong>{unansweredCount}</strong></div>
              <div className="modal-stat-row"><span>⏱ Time Left</span><strong>{formatTime(timeLeft)}</strong></div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleSubmit}>Submit Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
