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
  const qrUrl = (import.meta.env.BASE_URL || '/senior_officer_2026/').replace(/\/+$/, '') + '/whatsapp_qr.jpg'

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

      {/* WHATSAPP COMMUNITY JOIN BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #075e54 0%, #128c7e 100%)',
        color: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        margin: '1.5rem 0 2rem',
        boxShadow: '0 8px 24px rgba(7, 94, 84, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{flex: '1 1 300px'}}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.2)',
            padding: '0.2rem 0.7rem',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            letterSpacing: '0.3px'
          }}>
            💬 WhatsApp Community
          </div>
          <h2 style={{fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.3}}>
            পরবর্তী পরীক্ষাগুলোতে অংশ নিতে আমাদের WhatsApp Community-তে যুক্ত হোন!
          </h2>
          <p style={{fontSize: '0.92rem', opacity: 0.9, marginBottom: '1.2rem', lineHeight: 1.5}}>
            উদ্দিপক এডুকেশনের সকল মডেল টেস্ট, জব সলিউশন এবং পরীক্ষার নোটিশ সরাসরি পেতে এখনই যোগ দিন।
          </p>
          <a
            href="https://chat.whatsapp.com/FwULKQJRU93ALasMI6J8g9"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#25d366',
              color: '#075e54',
              padding: '0.8rem 1.6rem',
              borderRadius: '30px',
              fontWeight: 800,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              transition: 'transform 0.15s ease'
            }}
          >
            <span>👉 Join WhatsApp Community</span>
          </a>
        </div>

        <div style={{
          textAlign: 'center',
          background: 'white',
          padding: '0.8rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '0 auto'
        }}>
          <img
            src={qrUrl}
            alt="Uddipok Education WhatsApp QR Code"
            style={{width: '180px', height: 'auto', borderRadius: '8px', display: 'block'}}
          />
          <span style={{color: '#075e54', fontSize: '0.75rem', fontWeight: 700, marginTop: '0.5rem'}}>
            Scan to Join Community
          </span>
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
