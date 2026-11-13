import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { api } from '../lib/api'
import { BrandLogo } from '../components/BrandLogo'
import { Icons } from '../components/Icons'
import type { AdminStats, CandidateResult, LeaderboardEntry, QuestionAnalytic } from '../types'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'candidates' | 'leaderboard' | 'analytics'>('overview')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20

  useEffect(() => {
    api.getAdminStats()
      .then(setStats)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  function exportCSV() {
    if (!stats) return
    const headers = ['Name', 'Mobile', 'Email', 'Score', 'Correct', 'Incorrect', 'Unanswered', 'Status', 'Started', 'Submitted', 'Time(s)']
    const rows = stats.candidates_list.map((c: CandidateResult) => [
      `"${(c.name || '').replace(/"/g, '""')}"`,
      c.mobile,
      c.email,
      c.score?.toFixed(2) ?? '',
      c.correct_count ?? '',
      c.incorrect_count ?? '',
      c.unanswered_count ?? '',
      c.status,
      c.started_at ? new Date(c.started_at).toLocaleString() : '',
      c.submitted_at ? new Date(c.submitted_at).toLocaleString() : '',
      c.time_taken_seconds ?? '',
    ].join(','))
    const bom = '\uFEFF'
    const csv = bom + [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'uddipok_senior_officer_2026_results.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading Uddipok Education Administrative Analytics...</p>
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
        <Link to="/admin" className="btn btn-primary btn-sm">Return to Login</Link>
      </div>
    )
  }

  if (!stats) return null

  const filtered = (stats.candidates_list || []).filter((c: CandidateResult) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile?.includes(search)
  )
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function scoreBadge(score: number | undefined | null) {
    if (score === null || score === undefined) return <span className="score-badge">—</span>
    const cls = score >= 70 ? 'score-high' : score >= 40 ? 'score-mid' : 'score-low'
    return <span className={`score-badge ${cls}`}>{Number(score).toFixed(2)}</span>
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header className="exam-header">
        <div className="exam-header-inner">
          <BrandLogo variant="light" size="sm" subtitle="Executive Administration & Analytics Center" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={exportCSV}>
              <Icons.Download size={15} />
              <span>Export Excel CSV</span>
            </button>
            <button className="portal-nav-link" onClick={handleLogout} style={{ cursor: 'pointer' }}>
              <Icons.LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="admin-wrap">
        {/* 6 KPI CARDS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-top">
              <h3>Registered</h3>
              <Icons.Users size={18} style={{ color: 'var(--brand-600)' }} />
            </div>
            <p>{stats.total_candidates}</p>
          </div>
          <div className="stat-card">
            <div className="stat-card-top">
              <h3>Submitted Scripts</h3>
              <Icons.CheckCircle size={18} style={{ color: 'var(--brand-600)' }} />
            </div>
            <p style={{ color: 'var(--brand-700)' }}>{stats.total_submitted}</p>
          </div>
          <div className="stat-card">
            <div className="stat-card-top">
              <h3>In Progress</h3>
              <Icons.Clock size={18} style={{ color: 'var(--warning)' }} />
            </div>
            <p>{stats.total_in_progress}</p>
          </div>
          <div className="stat-card">
            <div className="stat-card-top">
              <h3>Mean Score</h3>
              <Icons.BarChart size={18} style={{ color: '#2563eb' }} />
            </div>
            <p>{Number(stats.avg_score ?? 0).toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <div className="stat-card-top">
              <h3>Highest Score</h3>
              <Icons.Award size={18} style={{ color: 'var(--brand-600)' }} />
            </div>
            <p style={{ color: 'var(--brand-700)' }}>{Number(stats.max_score ?? 0).toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <div className="stat-card-top">
              <h3>Lowest Score</h3>
              <Icons.MinusCircle size={18} style={{ color: 'var(--danger)' }} />
            </div>
            <p>{Number(stats.min_score ?? 0).toFixed(2)}</p>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="tabs">
          <button className={`tab-btn${activeTab === 'overview' ? ' active' : ''}`} onClick={() => setActiveTab('overview')}>
            <Icons.BarChart size={16} />
            <span>Overview Summary</span>
          </button>
          <button className={`tab-btn${activeTab === 'candidates' ? ' active' : ''}`} onClick={() => setActiveTab('candidates')}>
            <Icons.Users size={16} />
            <span>Candidate Roster ({stats.candidates_list?.length || 0})</span>
          </button>
          <button className={`tab-btn${activeTab === 'leaderboard' ? ' active' : ''}`} onClick={() => setActiveTab('leaderboard')}>
            <Icons.Award size={16} />
            <span>Merit Leaderboard</span>
          </button>
          <button className={`tab-btn${activeTab === 'analytics' ? ' active' : ''}`} onClick={() => setActiveTab('analytics')}>
            <Icons.FileCheck size={16} />
            <span>Item Analysis (100 Questions)</span>
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="table-wrap">
            <h2>
              <span>Examination Executive Summary — Senior Officer 2026</span>
            </h2>
            <table>
              <tbody>
                <tr><td><strong>Examination Title</strong></td><td>Senior Officer (General) Recruitment Test 2026 — Set A</td></tr>
                <tr><td><strong>Total Registered Candidates</strong></td><td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{stats.total_candidates}</td></tr>
                <tr><td><strong>Completed & Evaluated Submissions</strong></td><td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--brand-700)' }}>{stats.total_submitted}</td></tr>
                <tr><td><strong>Active / In-Progress Sessions</strong></td><td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{stats.total_in_progress}</td></tr>
                <tr><td><strong>Average Score</strong></td><td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{Number(stats.avg_score ?? 0).toFixed(2)} / 100.00</td></tr>
                <tr><td><strong>Highest Score Achieved</strong></td><td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--brand-700)' }}>{Number(stats.max_score ?? 0).toFixed(2)} / 100.00</td></tr>
                <tr><td><strong>Lowest Score Recorded</strong></td><td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{Number(stats.min_score ?? 0).toFixed(2)} / 100.00</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="table-wrap">
            <h2>
              <span>Candidate Roster & Score Records</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>{filtered.length} Records</span>
            </h2>
            <div className="search-bar">
              <div className="input-wrapper" style={{ flex: 1 }}>
                <span className="input-icon"><Icons.Search size={16} /></span>
                <input
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1) }}
                  placeholder="Search candidate by name, email address, or mobile number..."
                />
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Candidate Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Net Score</th>
                  <th>Correct</th>
                  <th>Wrong</th>
                  <th>Skipped</th>
                  <th>Status</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((c: CandidateResult, i: number) => (
                  <tr key={i}>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{(page - 1) * PAGE_SIZE + i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{c.mobile}</td>
                    <td>{c.email}</td>
                    <td>{scoreBadge(c.score)}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--brand-700)', fontWeight: 600 }}>{c.correct_count ?? '—'}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--danger)', fontWeight: 600 }}>{c.incorrect_count ?? '—'}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{c.unanswered_count ?? '—'}</td>
                    <td>
                      <span className={`score-badge ${c.status === 'submitted' ? 'score-high' : 'score-mid'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      {c.time_taken_seconds ? `${Math.floor(c.time_taken_seconds / 60)}m ${c.time_taken_seconds % 60}s` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="pagination">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="table-wrap">
            <h2>Official Merit List / Leaderboard</h2>
            <table>
              <thead>
                <tr>
                  <th>Merit Rank</th>
                  <th>Candidate Name</th>
                  <th>Net Score</th>
                  <th>Correct Answers</th>
                </tr>
              </thead>
              <tbody>
                {(stats.leaderboard || []).map((e: LeaderboardEntry, idx: number) => (
                  <tr key={idx}>
                    <td><span className={`rank-badge rank-${e.rank}`}>#{e.rank}</span></td>
                    <td style={{ fontWeight: 700 }}>{e.name}</td>
                    <td>{scoreBadge(e.score)}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{e.correct_count} / 100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="table-wrap">
            <h2>Question-by-Question Item Analysis (100 Questions)</h2>
            <table>
              <thead>
                <tr>
                  <th>Q#</th>
                  <th>Question Stem</th>
                  <th>Correct</th>
                  <th>Wrong</th>
                  <th>Skipped</th>
                  <th>Accuracy Rate</th>
                </tr>
              </thead>
              <tbody>
                {(stats.question_analytics || []).map((q: QuestionAnalytic) => (
                  <tr key={q.question_number}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>Q.{String(q.question_number).padStart(2, '0')}</td>
                    <td style={{ maxWidth: '420px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-bn)' }} title={q.question_text}>
                      {q.question_text}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--brand-700)', fontWeight: 600 }}>{q.correct_count}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--danger)', fontWeight: 600 }}>{q.incorrect_count}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{q.unanswered_count}</td>
                    <td>
                      <span className={`score-badge ${q.correct_pct >= 60 ? 'score-high' : q.correct_pct >= 40 ? 'score-mid' : 'score-low'}`}>
                        {Number(q.correct_pct ?? 0).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
