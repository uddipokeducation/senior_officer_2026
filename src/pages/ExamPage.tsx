import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { api } from '../lib/api'
import { examStorage } from '../lib/examStorage'
import { BrandLogo } from '../components/BrandLogo'
import { Icons } from '../components/Icons'
import type { Question } from '../types'

interface Section {
  id: string
  name: string
  shortName: string
  startNum: number
  endNum: number
  Icon: React.ComponentType<{ size?: number }>
}

const SECTIONS: Section[] = [
  { id: 'english', name: 'English Language & Literature', shortName: 'English', startNum: 1, endNum: 20, Icon: Icons.BookOpen },
  { id: 'bangla', name: 'বাংলা ভাষা ও সাহিত্য', shortName: 'বাংলা', startNum: 21, endNum: 40, Icon: Icons.Languages },
  { id: 'math', name: 'Mathematics & Quantitative Aptitude', shortName: 'Mathematics', startNum: 41, endNum: 60, Icon: Icons.Calculator },
  { id: 'banking', name: 'Banking, Finance & Economics', shortName: 'Banking', startNum: 61, endNum: 70, Icon: Icons.Landmark },
  { id: 'reasoning', name: 'Mental Ability & Logical Reasoning', shortName: 'Reasoning', startNum: 71, endNum: 90, Icon: Icons.Brain },
  { id: 'ict', name: 'Information & Communication Tech (ICT)', shortName: 'ICT', startNum: 91, endNum: 100, Icon: Icons.Cpu },
]

export default function ExamPage() {
  const { attemptId } = useParams<{ attemptId: string }>()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [activeSectionIdx, setActiveSectionIdx] = useState(0)
  const [showAllInPalette, setShowAllInPalette] = useState(false)
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
        setError(err instanceof Error ? err.message : 'Failed to load examination questions')
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

  async function selectAnswer(questionId: string, option: string | null) {
    const current = answers[questionId]
    const nextOpt = option === null || current === option ? null : option
    const newAnswers = { ...answers }
    if (nextOpt === null) {
      delete newAnswers[questionId]
    } else {
      newAnswers[questionId] = nextOpt
    }
    setAnswers(newAnswers)
    examStorage.saveAnswer(questionId, nextOpt)
    api.saveAnswer(attemptId!, questionId, nextOpt).catch(console.error)
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

  function jumpToQuestion(qNum: number) {
    const targetSecIdx = SECTIONS.findIndex(s => qNum >= s.startNum && qNum <= s.endNum)
    if (targetSecIdx !== -1 && targetSecIdx !== activeSectionIdx) {
      setActiveSectionIdx(targetSecIdx)
      setTimeout(() => {
        document.getElementById(`q-${qNum}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 80)
    } else {
      document.getElementById(`q-${qNum}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading Senior Officer 2026 Examination Paper...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="loading-screen">
        <div className="alert alert-error">{error}</div>
      </div>
    )
  }

  const currentSection = SECTIONS[activeSectionIdx]
  const SectionIcon = currentSection.Icon
  const sectionQuestions = questions.filter(
    q => q.question_number >= currentSection.startNum && q.question_number <= currentSection.endNum
  )

  const totalAnswered = questions.filter(q => answers[q.id]).length
  const totalUnanswered = questions.length - totalAnswered
  const timerClass = `timer${timeLeft < 300 ? ' danger' : timeLeft < 600 ? ' warning' : ''}`
  const paletteQuestions = showAllInPalette ? questions : sectionQuestions

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <div className="exam-sticky-top">
        <header className="exam-header">
          <div className="exam-header-inner">
            <BrandLogo variant="light" size="sm" subtitle="Senior Officer 2026 • Set A" />

            <div className="exam-header-right">
              <div className="candidate-pill">
                <Icons.User size={14} />
                <span>{candidateName || 'Candidate'}</span>
              </div>
              <div className={timerClass} title="Server-Synchronized Countdown Timer">
                <Icons.Clock size={16} />
                <span>{formatTime(timeLeft)}</span>
              </div>
              <button
                className="btn btn-sm exam-top-submit"
                style={{ background: '#10b981', color: '#022c22', fontWeight: 800 }}
                onClick={() => setShowConfirm(true)}
                disabled={submitting}
              >
                <Icons.CheckCircle size={15} />
                <span>Submit ({totalAnswered}/100)</span>
              </button>
            </div>
          </div>
        </header>

        {/* SUBJECT SECTION TABS BAR */}
        <div className="section-tabs-bar">
          <div className="section-tabs-inner">
            {SECTIONS.map((sec, idx) => {
              const TabIcon = sec.Icon
              const secQs = questions.filter(q => q.question_number >= sec.startNum && q.question_number <= sec.endNum)
              const secAnswered = secQs.filter(q => answers[q.id]).length
              const isActive = idx === activeSectionIdx
              const isComplete = secAnswered === secQs.length && secQs.length > 0
              return (
                <button
                  key={sec.id}
                  className={`section-tab-btn${isActive ? ' active' : ''}`}
                  onClick={() => {
                    setActiveSectionIdx(idx)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  <TabIcon size={16} />
                  <span>{sec.shortName}</span>
                  <span className={`sec-badge${isComplete ? ' complete' : ''}`}>
                    {secAnswered}/{secQs.length}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="exam-layout">
        {/* MAIN SECTION QUESTIONS LIST */}
        <div className="section-content">
          <div className="section-banner">
            <div>
              <div className="section-banner-meta">
                SECTION 0{activeSectionIdx + 1} OF 0{SECTIONS.length} • QUESTIONS {currentSection.startNum}–{currentSection.endNum}
              </div>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontFamily: 'var(--font-bn)' }}>
                <SectionIcon size={21} />
                <span>{currentSection.name}</span>
              </h2>
              <p>Select the single best option for each question. (+1.00 for Correct, −0.25 for Incorrect)</p>
            </div>
            <div className="section-progress">
              {sectionQuestions.filter(q => answers[q.id]).length} / {sectionQuestions.length} Answered
            </div>
          </div>

          <div className="questions-container">
            {sectionQuestions.map((q) => {
              const selectedOpt = answers[q.id]
              return (
                <div
                  key={q.id}
                  id={`q-${q.question_number}`}
                  className={`question-item-card${selectedOpt ? ' answered-card' : ''}`}
                >
                  <div className="q-item-header">
                    <span className="q-item-number">QUESTION {String(q.question_number).padStart(2, '0')}</span>
                    <div className="q-item-actions">
                      {selectedOpt ? (
                        <>
                          <span className="q-answered-tag">
                            <Icons.Check size={13} />
                            <span>Option {selectedOpt} Selected</span>
                          </span>
                          <button
                            type="button"
                            className="q-clear-btn"
                            onClick={() => selectAnswer(q.id, null)}
                            disabled={submitting}
                            title="Clear selected answer"
                          >
                            <Icons.RotateCcw size={12} />
                            <span>Clear</span>
                          </button>
                        </>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 600 }}>
                          Not Answered
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="q-item-text">{q.question_text}</div>

                  <div className="q-options-grid">
                    {(['A', 'B', 'C', 'D'] as const).map(opt => {
                      const key = `option_${opt.toLowerCase()}` as keyof Question
                      const optText = q[key] as string
                      const isSelected = selectedOpt === opt
                      return (
                        <button
                          key={opt}
                          type="button"
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

          {/* SECTION NAVIGATION FOOTER */}
          <div className="section-nav-footer">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setActiveSectionIdx(i => Math.max(0, i - 1))
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              disabled={activeSectionIdx === 0}
            >
              <Icons.ArrowLeft size={17} />
              <span>Previous Section</span>
            </button>

            <span style={{ fontSize: '0.82rem', color: 'var(--slate-500)', fontWeight: 600 }}>
              Section {activeSectionIdx + 1} of {SECTIONS.length}
            </span>

            {activeSectionIdx < SECTIONS.length - 1 ? (
              <button
                className="btn btn-primary"
                onClick={() => {
                  setActiveSectionIdx(i => Math.min(SECTIONS.length - 1, i + 1))
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                <span>Next: {SECTIONS[activeSectionIdx + 1].shortName}</span>
                <Icons.ArrowRight size={17} />
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setShowConfirm(true)}
              >
                <Icons.CheckCircle size={17} />
                <span>Review & Submit Examination</span>
              </button>
            )}
          </div>
        </div>

        {/* STICKY SIDEBAR QUESTION PALETTE */}
        <aside className="exam-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-title">
              <span>Question Palette</span>
              <button
                type="button"
                onClick={() => setShowAllInPalette(v => !v)}
                style={{
                  background: 'var(--slate-100)',
                  border: '1px solid var(--slate-200)',
                  borderRadius: '6px',
                  padding: '0.18rem 0.5rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--brand-800)',
                  cursor: 'pointer',
                }}
              >
                {showAllInPalette ? `Show ${currentSection.shortName}` : 'Show All 100'}
              </button>
            </div>

            <div className="sidebar-grid">
              {paletteQuestions.map(q => {
                const isAnswered = !!answers[q.id]
                return (
                  <button
                    key={q.id}
                    type="button"
                    className={`sidebar-q-btn${isAnswered ? ' answered' : ''}`}
                    onClick={() => jumpToQuestion(q.question_number)}
                    title={`Jump to Question ${q.question_number}`}
                  >
                    {q.question_number}
                  </button>
                )
              })}
            </div>

            <div className="overall-summary">
              <div className="summary-title">Assessment Progress</div>
              <div className="summary-row">
                <span>Answered Questions</span>
                <strong style={{ color: 'var(--brand-700)', fontFamily: 'var(--font-mono)' }}>
                  {totalAnswered} / {questions.length}
                </strong>
              </div>
              <div className="summary-row">
                <span>Remaining / Unanswered</span>
                <strong style={{ color: 'var(--slate-700)', fontFamily: 'var(--font-mono)' }}>
                  {totalUnanswered}
                </strong>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${questions.length ? (totalAnswered / questions.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <button
              className="submit-exam-btn"
              style={{ marginTop: '1.15rem' }}
              onClick={() => setShowConfirm(true)}
              disabled={submitting}
            >
              <Icons.CheckCircle size={18} />
              <span>{submitting ? 'Submitting Script...' : 'Submit Examination'}</span>
            </button>
          </div>
        </aside>
      </div>

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>
              <Icons.AlertTriangle size={22} style={{ color: 'var(--warning)' }} />
              <span>Confirm Final Submission</span>
            </h2>
            <p>
              Once you submit your answer script, your responses will be locked and evaluated immediately. You will not be able to modify any answers afterward.
            </p>
            <div className="modal-stats">
              <div className="modal-stat-row">
                <span style={{ color: 'var(--slate-600)' }}>Answered Questions</span>
                <strong style={{ color: 'var(--brand-700)', fontFamily: 'var(--font-mono)' }}>
                  {totalAnswered} of {questions.length}
                </strong>
              </div>
              <div className="modal-stat-row">
                <span style={{ color: 'var(--slate-600)' }}>Unanswered Questions</span>
                <strong style={{ color: 'var(--slate-800)', fontFamily: 'var(--font-mono)' }}>{totalUnanswered}</strong>
              </div>
              <div className="modal-stat-row">
                <span style={{ color: 'var(--slate-600)' }}>Time Remaining</span>
                <strong style={{ color: 'var(--slate-900)', fontFamily: 'var(--font-mono)' }}>{formatTime(timeLeft)}</strong>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>
                Return to Exam
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                <Icons.CheckCircle size={17} />
                <span>Confirm & Submit</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
