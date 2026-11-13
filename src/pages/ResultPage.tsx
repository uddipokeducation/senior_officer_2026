import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/api'
import type { ExamResult } from '../types'

export default function ResultPage() {
  const { attemptId } = useParams<{ attemptId: string }>()
  const navigate = useNavigate()
  const [result, setResult] = useState<ExamResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!attemptId) { navigate('/'); return }
    api.getResult(attemptId)
      .then(setResult)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [attemptId, navigate])

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Evaluating examination results...</p></div>
  if (error) return (
    <div className="loading-screen">
      <div className="alert alert-error">{error}</div>
      <Link to="/" className="btn btn-primary btn-sm" style={{width:'auto',marginTop:'1rem'}}>← Back to Home</Link>
    </div>
  )
  if (!result) return null

  const scoreNum = Number(result.score ?? 0)
  const scoreClass = scoreNum >= 70 ? 'score-high' : scoreNum >= 40 ? 'score-mid' : 'score-low'
  const submittedDate = result.submitted_at ? new Date(result.submitted_at) : new Date()
  const questionsList = result.questions_with_answers || []

  return (
    <div className="result-page">
      <div className="result-header">
        <h1>🎓 Examination Results</h1>
        <p>Senior Officer 2026 — Set A</p>
        <div className={`result-score ${scoreClass}`}>{scoreNum.toFixed(2)}</div>
        <div className="result-score-label">out of 100.00 marks</div>
        <p style={{marginTop:'0.8rem',opacity:0.9,fontSize:'1.05rem'}}>
          Candidate: <strong>{result.candidate_name || 'Candidate'}</strong>
        </p>
        <p style={{fontSize:'0.85rem',opacity:0.75,marginTop:'0.3rem'}}>
          Submitted: {submittedDate.toLocaleString('en-BD', {timeZone:'Asia/Dhaka'})}
        </p>
      </div>

      <div className="result-grid">
        <div className="result-stat-card">
          <div className={`value ${scoreClass}`}>{scoreNum.toFixed(2)}</div>
          <div className="label">Final Score</div>
        </div>
        <div className="result-stat-card">
          <div className="value correct-val">{result.correct_count ?? 0}</div>
          <div className="label">✅ Correct (+1.00)</div>
        </div>
        <div className="result-stat-card">
          <div className="value incorrect-val">{result.incorrect_count ?? 0}</div>
          <div className="label">❌ Incorrect (−0.25)</div>
        </div>
        <div className="result-stat-card">
          <div className="value unanswered-val">{result.unanswered_count ?? 0}</div>
          <div className="label">⬜ Unanswered (0.00)</div>
        </div>
      </div>

      <div className="review-section">
        <h2>📝 Detailed Question & Answer Review</h2>
        {questionsList.map((q) => {
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
              <div className="review-q-num">Question {q.question_number}</div>
              <div className="review-q-text">{q.question_text}</div>
              <div style={{display:'flex',flexDirection:'column',gap:'0.35rem'}}>
                {opts.map(({ letter, text }) => {
                  const isSelected = q.selected_option === letter
                  const isCorrectOpt = q.correct_option === letter
                  if (!isSelected && !isCorrectOpt) {
                    return (
                      <div key={letter} className="review-answer-row" style={{color:'var(--text-muted)'}}>
                        <span className="answer-label">({letter}) {text}</span>
                      </div>
                    )
                  }
                  return (
                    <div key={letter} className="review-answer-row">
                      <span className="answer-label">({letter}) {text}</span>
                      {isSelected && isCorrect && <span className="answer-badge badge-correct">✓ Your Answer (Correct)</span>}
                      {isSelected && !isCorrect && <span className="answer-badge badge-wrong">✗ Your Answer (Incorrect)</span>}
                      {isCorrectOpt && !isCorrect && <span className="answer-badge badge-correct">✓ Correct Answer</span>}
                    </div>
                  )
                })}
                {noAnswer && (
                  <div style={{color:'var(--warning)',fontSize:'0.85rem',marginTop:'0.3rem',fontWeight:600}}>
                    ⬜ Not answered — Correct answer: ({q.correct_option})
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{textAlign:'center',marginTop:'2.5rem'}}>
        <Link to="/" className="btn btn-primary" style={{width:'auto',display:'inline-flex'}}>
          ← Return to Home Page
        </Link>
      </div>
    </div>
  )
}
