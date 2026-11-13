import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/api'
import { BrandLogo } from '../components/BrandLogo'
import { Icons } from '../components/Icons'
import { WhatsAppCommunityBanner } from '../components/WhatsAppCommunityBanner'
import type { ExamResult } from '../types'

interface SubjectMeta {
  id: string
  name: string
  shortName: string
  startNum: number
  endNum: number
  Icon: React.ComponentType<{ size?: number }>
}

const SUBJECT_SECTIONS: SubjectMeta[] = [
  { id: 'english', name: 'English Language & Literature', shortName: 'English', startNum: 1, endNum: 20, Icon: Icons.BookOpen },
  { id: 'bangla', name: 'বাংলা ভাষা ও সাহিত্য', shortName: 'বাংলা', startNum: 21, endNum: 40, Icon: Icons.Languages },
  { id: 'math', name: 'Mathematics & Quantitative Aptitude', shortName: 'Mathematics', startNum: 41, endNum: 60, Icon: Icons.Calculator },
  { id: 'banking', name: 'Banking, Finance & Economics', shortName: 'Banking', startNum: 61, endNum: 70, Icon: Icons.Landmark },
  { id: 'reasoning', name: 'Mental Ability & Logical Reasoning', shortName: 'Reasoning', startNum: 71, endNum: 90, Icon: Icons.Brain },
  { id: 'ict', name: 'Information & Communication Tech (ICT)', shortName: 'ICT', startNum: 91, endNum: 100, Icon: Icons.Cpu },
]

export default function ResultPage() {
  const { attemptId } = useParams<{ attemptId: string }>()
  const navigate = useNavigate()
  const [result, setResult] = useState<ExamResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'correct' | 'wrong' | 'skipped'>('all')
  const [subjectFilter, setSubjectFilter] = useState<string>('all')

  useEffect(() => {
    if (!attemptId) { navigate('/'); return }
    api.getResult(attemptId)
      .then(setResult)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [attemptId, navigate])

  const questionsList = result?.questions_with_answers || []

  const subjectAnalytics = useMemo(() => {
    return SUBJECT_SECTIONS.map(sec => {
      const qs = questionsList.filter(q => q.question_number >= sec.startNum && q.question_number <= sec.endNum)
      const correct = qs.filter(q => q.is_correct === true).length
      const wrong = qs.filter(q => q.is_correct === false && q.selected_option !== null).length
      const skipped = qs.length - correct - wrong
      const netScore = correct * 1 - wrong * 0.25
      const maxMarks = qs.length
      const pct = maxMarks > 0 ? Math.max(0, Math.min(100, (netScore / maxMarks) * 100)) : 0
      return { ...sec, total: qs.length, correct, wrong, skipped, netScore, pct }
    })
  }, [questionsList])

  const filteredQuestions = useMemo(() => {
    return questionsList.filter(q => {
      if (subjectFilter !== 'all') {
        const sec = SUBJECT_SECTIONS.find(s => s.id === subjectFilter)
        if (sec && (q.question_number < sec.startNum || q.question_number > sec.endNum)) {
          return false
        }
      }
      if (statusFilter === 'correct') return q.is_correct === true
      if (statusFilter === 'wrong') return q.is_correct === false && q.selected_option !== null
      if (statusFilter === 'skipped') return q.selected_option === null || q.selected_option === undefined
      return true
    })
  }, [questionsList, statusFilter, subjectFilter])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Compiling Official Score Report & Section Analytics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="loading-screen">
        <div className="alert alert-error" style={{ maxWidth: '480px' }}>
          <Icons.AlertTriangle size={18} />
          <span>{error}</span>
        </div>
        <Link to="/" className="btn btn-primary btn-sm">
          <Icons.ArrowLeft size={15} />
          <span>Return to Portal</span>
        </Link>
      </div>
    )
  }

  if (!result) return null

  const scoreNum = Number(result.score ?? 0)
  const correctCount = Number(result.correct_count ?? 0)
  const incorrectCount = Number(result.incorrect_count ?? 0)
  const unansweredCount = Number(result.unanswered_count ?? 0)
  const attemptedCount = correctCount + incorrectCount
  const accuracyPct = attemptedCount > 0 ? ((correctCount / attemptedCount) * 100).toFixed(1) : '0.0'
  const penaltyDeducted = (incorrectCount * 0.25).toFixed(2)
  const submittedDate = result.submitted_at ? new Date(result.submitted_at) : new Date()

  // Cohort & Merit Ranking stats (live from server RPC, with graceful fallback)
  const candidateRank = Number(result.rank ?? 1)
  const totalExaminees = Math.max(1, Number(result.total_candidates ?? 1))
  const averageScore = Number(result.average_score ?? scoreNum)
  const highestScore = Number(result.highest_score ?? scoreNum)
  const diffFromAvg = scoreNum - averageScore

  // Radial SVG Gauge calculation
  const clampedPct = Math.max(0, Math.min(100, scoreNum))
  const radius = 68
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (clampedPct / 100) * circumference
  const gaugeColor = scoreNum >= 70 ? '#059669' : scoreNum >= 45 ? '#d97706' : '#dc2626'
  const performanceLabel = scoreNum >= 70 ? 'Distinguished' : scoreNum >= 50 ? 'Competitive' : 'Needs Review'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* TOP BRANDED BAR */}
      <header className="portal-topbar no-print">
        <div className="portal-topbar-inner">
          <BrandLogo variant="light" size="sm" subtitle="Official Examination Score Report & Answer Script" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button type="button" onClick={() => window.print()} className="portal-nav-link" style={{ cursor: 'pointer' }}>
              <Icons.Printer size={15} />
              <span>Print / Save PDF</span>
            </button>
            <Link to="/" className="portal-nav-link">
              <Icons.ArrowLeft size={15} />
              <span>Exam Portal</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="result-page" style={{ flex: 1, width: '100%' }}>
        {/* HERO SCORECARD CERTIFICATE */}
        <section className="scorecard-hero">
          <div className="scorecard-banner">
            <div>
              <div className="scorecard-cert-tag" style={{ marginBottom: '0.6rem' }}>
                <Icons.Shield size={13} />
                <span>Verified Server-Side Evaluation</span>
              </div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
                Senior Officer (General) — 2026
              </h1>
              <p style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.82)', marginTop: '0.2rem', fontFamily: 'var(--font-bn)' }}>
                উদ্দীপক (Uddipok Education) • Recruitment Assessment Set A • Job ID 26101
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#a7f3d0', fontWeight: 700 }}>
                Candidate Name
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginTop: '0.1rem' }}>
                {result.candidate_name || 'Candidate'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', marginTop: '0.15rem', fontFamily: 'var(--font-mono)' }}>
                {submittedDate.toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' })}
              </div>
            </div>
          </div>

          <div className="scorecard-meta-strip">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icons.Target size={16} style={{ color: 'var(--brand-700)' }} />
              <span>
                <strong>Scoring Formula:</strong> (Correct × 1.00) − (Incorrect × 0.25)
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
              <span>Attempted: <strong>{attemptedCount}/100</strong></span>
              <span>Accuracy: <strong style={{ color: 'var(--brand-700)' }}>{accuracyPct}%</strong></span>
              <span>Standing: <strong style={{ color: gaugeColor }}>{performanceLabel}</strong></span>
            </div>
          </div>

          <div className="scorecard-body">
            {/* CIRCULAR RADIAL SCORE GAUGE */}
            <div className="radial-gauge-box">
              <div style={{ position: 'relative', width: '164px', height: '164px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="164" height="164" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="82"
                    cy="82"
                    r={radius}
                    fill="transparent"
                    stroke="#e2e8f0"
                    strokeWidth="12"
                  />
                  <circle
                    cx="82"
                    cy="82"
                    r={radius}
                    fill="transparent"
                    stroke={gaugeColor}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--slate-500)' }}>
                    Net Score
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '2.1rem', fontWeight: 800, color: 'var(--slate-900)', lineHeight: 1.1, marginTop: '2px' }}>
                    {scoreNum.toFixed(2)}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                    / 100.00
                  </span>
                </div>
              </div>
              <div style={{ marginTop: '0.6rem', fontSize: '0.78rem', fontWeight: 700, color: gaugeColor, background: '#ffffff', border: '1px solid var(--slate-200)', padding: '0.22rem 0.75rem', borderRadius: '999px' }}>
                {performanceLabel} Tier
              </div>
            </div>

            {/* 4 KPI BREAKDOWN CARDS */}
            <div className="result-kpi-grid">
              <div className="result-kpi-card kpi-correct">
                <div>
                  <div className="kpi-label">Correct Answers</div>
                  <div className="kpi-val" style={{ color: 'var(--brand-700)' }}>{correctCount}</div>
                  <div className="kpi-sub">+{correctCount.toFixed(2)} Marks Earned</div>
                </div>
                <div className="kpi-icon-badge" style={{ background: 'var(--brand-50)', color: 'var(--brand-700)' }}>
                  <Icons.CheckCircle size={22} />
                </div>
              </div>

              <div className="result-kpi-card kpi-wrong">
                <div>
                  <div className="kpi-label">Incorrect Answers</div>
                  <div className="kpi-val" style={{ color: 'var(--danger)' }}>{incorrectCount}</div>
                  <div className="kpi-sub">−{penaltyDeducted} Penalty Deducted</div>
                </div>
                <div className="kpi-icon-badge" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
                  <Icons.XCircle size={22} />
                </div>
              </div>

              <div className="result-kpi-card kpi-skipped">
                <div>
                  <div className="kpi-label">Unanswered / Skipped</div>
                  <div className="kpi-val" style={{ color: 'var(--warning)' }}>{unansweredCount}</div>
                  <div className="kpi-sub">0.00 Marks (No Penalty)</div>
                </div>
                <div className="kpi-icon-badge" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
                  <Icons.MinusCircle size={22} />
                </div>
              </div>

              <div className="result-kpi-card kpi-net">
                <div>
                  <div className="kpi-label">Strike Accuracy</div>
                  <div className="kpi-val" style={{ color: '#1d4ed8' }}>{accuracyPct}%</div>
                  <div className="kpi-sub">{attemptedCount} of 100 Attempted</div>
                </div>
                <div className="kpi-icon-badge" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                  <Icons.Award size={22} />
                </div>
              </div>
            </div>
          </div>

          {/* COHORT STANDING: RANK, TOTAL EXAMINEES, AVERAGE SCORE, TOP SCORE */}
          <div
            style={{
              borderTop: '1px solid var(--slate-200)',
              background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
              padding: '1.25rem 2rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.85rem',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-800)' }}>
                <Icons.Users size={15} style={{ color: 'var(--brand-600)' }} />
                <span>Merit Position & Cohort Standing (মেধাক্রম ও সামগ্রিক পরিসংখ্যান)</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                Live Ranking Across All Submitted Candidates
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                gap: '0.85rem',
              }}
            >
              <div style={{ background: '#ffffff', border: '1px solid var(--brand-200)', borderRadius: '12px', padding: '0.9rem 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-xs)' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--slate-500)' }}>
                    Your Merit Rank
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.55rem', fontWeight: 800, color: 'var(--brand-700)', lineHeight: 1.2, marginTop: '0.15rem' }}>
                    #{candidateRank}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', fontWeight: 600, marginTop: '0.15rem', fontFamily: 'var(--font-bn)' }}>
                    মোট {totalExaminees} জন পরীক্ষার্থীর মধ্যে
                  </div>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--brand-50)', color: 'var(--brand-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.Award size={20} />
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid var(--slate-200)', borderRadius: '12px', padding: '0.9rem 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-xs)' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--slate-500)' }}>
                    Total Examinees
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.55rem', fontWeight: 800, color: 'var(--slate-900)', lineHeight: 1.2, marginTop: '0.15rem' }}>
                    {totalExaminees}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', fontWeight: 600, marginTop: '0.15rem', fontFamily: 'var(--font-bn)' }}>
                    পরীক্ষা সম্পন্ন করেছেন
                  </div>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--slate-100)', color: 'var(--slate-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.Users size={20} />
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid var(--slate-200)', borderRadius: '12px', padding: '0.9rem 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-xs)' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--slate-500)' }}>
                    Average Score (গড় নম্বর)
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.55rem', fontWeight: 800, color: '#0369a1', lineHeight: 1.2, marginTop: '0.15rem' }}>
                    {averageScore.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: diffFromAvg >= 0 ? 'var(--brand-700)' : 'var(--danger)', fontWeight: 700, marginTop: '0.15rem' }}>
                    {diffFromAvg >= 0 ? `+${diffFromAvg.toFixed(2)} Above Average` : `${diffFromAvg.toFixed(2)} Below Average`}
                  </div>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.BarChart size={20} />
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid var(--slate-200)', borderRadius: '12px', padding: '0.9rem 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-xs)' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--slate-500)' }}>
                    Highest Score (সর্বোচ্চ)
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.55rem', fontWeight: 800, color: 'var(--brand-800)', lineHeight: 1.2, marginTop: '0.15rem' }}>
                    {highestScore.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)', fontWeight: 600, marginTop: '0.15rem' }}>
                    Out of 100.00 Marks
                  </div>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--brand-50)', color: 'var(--brand-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.Target size={20} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SUBJECT-WISE PERFORMANCE BREAKDOWN */}
        <section className="subject-breakdown-card">
          <div className="section-card-title">
            <Icons.BarChart size={20} style={{ color: 'var(--brand-600)' }} />
            <span>Section-Wise Performance Breakdown</span>
          </div>
          <div className="subject-rows">
            {subjectAnalytics.map(sec => {
              const SecIcon = sec.Icon
              return (
                <div key={sec.id} className="subject-stat-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.88rem', color: 'var(--slate-800)', fontFamily: 'var(--font-bn)' }}>
                      <span style={{ color: 'var(--brand-700)', display: 'flex' }}><SecIcon size={16} /></span>
                      <span>{sec.name}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 800, color: 'var(--brand-800)' }}>
                      {sec.netScore.toFixed(2)} / {sec.total}
                    </span>
                  </div>

                  <div className="progress-bar-bg" style={{ marginBottom: '0.5rem', height: '6px' }}>
                    <div className="progress-bar-fill" style={{ width: `${sec.pct}%` }}></div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--slate-500)', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: 'var(--brand-700)', fontWeight: 600 }}>Correct: {sec.correct}</span>
                    <span style={{ color: 'var(--danger)', fontWeight: 600 }}>Wrong: {sec.wrong}</span>
                    <span>Skipped: {sec.skipped}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* BRANDED WHATSAPP COMMUNITY INVITATION CARD */}
        <WhatsAppCommunityBanner style={{ marginBottom: '2rem' }} />

        {/* DETAILED ANSWER SCRIPT REVIEW */}
        <section className="review-section">
          <div className="review-filter-bar no-print">
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icons.FileCheck size={20} style={{ color: 'var(--brand-600)' }} />
              <span>Answer Script Review ({filteredQuestions.length})</span>
            </div>

            <div className="filter-pills">
              {(
                [
                  { id: 'all', label: `All (${questionsList.length})` },
                  { id: 'correct', label: `Correct (${correctCount})` },
                  { id: 'wrong', label: `Incorrect (${incorrectCount})` },
                  { id: 'skipped', label: `Unanswered (${unansweredCount})` },
                ] as const
              ).map(f => (
                <button
                  key={f.id}
                  type="button"
                  className={`filter-pill${statusFilter === f.id ? ' active' : ''}`}
                  onClick={() => setStatusFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-pills no-print" style={{ marginBottom: '1.15rem' }}>
            <button
              type="button"
              className={`filter-pill${subjectFilter === 'all' ? ' active' : ''}`}
              onClick={() => setSubjectFilter('all')}
            >
              All Sections
            </button>
            {SUBJECT_SECTIONS.map(sec => (
              <button
                key={sec.id}
                type="button"
                className={`filter-pill${subjectFilter === sec.id ? ' active' : ''}`}
                onClick={() => setSubjectFilter(sec.id)}
              >
                {sec.shortName} ({sec.startNum}–{sec.endNum})
              </button>
            ))}
          </div>

          {filteredQuestions.map((q) => {
            const isCorrect = q.is_correct === true
            const isWrong = q.is_correct === false && q.selected_option !== null
            const noAnswer = q.selected_option === null || q.selected_option === undefined
            const reviewClass = isCorrect ? 'correct-answer' : isWrong ? 'wrong-answer' : 'no-answer'

            const opts = [
              { letter: 'A', text: q.option_a },
              { letter: 'B', text: q.option_b },
              { letter: 'C', text: q.option_c },
              { letter: 'D', text: q.option_d },
            ]

            return (
              <div key={q.question_number} className={`review-item ${reviewClass}`}>
                <div className="review-q-header">
                  <span className="review-q-num">QUESTION {String(q.question_number).padStart(2, '0')}</span>
                  {isCorrect && (
                    <span className="answer-badge badge-correct">
                      <Icons.Check size={13} />
                      <span>Correct (+1.00)</span>
                    </span>
                  )}
                  {isWrong && (
                    <span className="answer-badge badge-wrong">
                      <Icons.XCircle size={13} />
                      <span>Incorrect (−0.25)</span>
                    </span>
                  )}
                  {noAnswer && (
                    <span className="answer-badge" style={{ background: 'var(--warning-bg)', color: '#92400e' }}>
                      <span>Unanswered (0.00)</span>
                    </span>
                  )}
                </div>

                <div className="review-q-text">{q.question_text}</div>

                <div className="review-opts-grid">
                  {opts.map(({ letter, text }) => {
                    const isSelected = q.selected_option === letter
                    const isCorrectOpt = q.correct_option === letter
                    let boxClass = 'review-opt-box'
                    if (isCorrectOpt) boxClass += ' opt-correct'
                    else if (isSelected && !isCorrect) boxClass += ' opt-wrong'

                    return (
                      <div key={letter} className={boxClass}>
                        <span>
                          <strong style={{ fontFamily: 'var(--font-mono)', marginRight: '0.45rem' }}>({letter})</strong>
                          {text}
                        </span>
                        {isSelected && isCorrect && <span className="answer-badge badge-correct">Your Answer</span>}
                        {isSelected && !isCorrect && <span className="answer-badge badge-wrong">Your Choice</span>}
                        {isCorrectOpt && !isSelected && <span className="answer-badge badge-correct">Correct Key</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </section>

        <div className="no-print" style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link to="/" className="btn btn-primary">
            <Icons.ArrowLeft size={17} />
            <span>Return to Examination Portal</span>
          </Link>
        </div>
      </main>

      <footer className="portal-footer">
        © {new Date().getFullYear()}{' '}
        <strong style={{ fontFamily: 'var(--font-bn)', color: 'var(--brand-900)' }}>উদ্দীপক</strong>{' '}
        <strong>(Uddipok Education)</strong> • Online Recruitment & Competitive Assessment Platform
      </footer>
    </div>
  )
}
