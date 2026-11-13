import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { api } from '../lib/api'
import type { AdminStats, CandidateResult, LeaderboardEntry, QuestionAnalytic } from '../types'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'overview'|'candidates'|'leaderboard'|'analytics'>('overview')
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
    const headers = ['Name','Mobile','Email','Score','Correct','Incorrect','Unanswered','Status','Started','Submitted','Time(s)']
    const rows = stats.candidates_list.map((c: CandidateResult) => [
      `"${c.name}"`, c.mobile, c.email,
      c.score?.toFixed(2) ?? '',
      c.correct_count ?? '', c.incorrect_count ?? '', c.unanswered_count ?? '',
      c.status,
      c.started_at ? new Date(c.started_at).toLocaleString() : '',
      c.submitted_at ? new Date(c.submitted_at).toLocaleString() : '',
      c.time_taken_seconds ?? ''
    ].join(','))
    const bom = '\uFEFF'
    const csv = bom + [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'senior_officer_2026_results.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading dashboard...</p></div>
  if (error) return <div className="loading-screen"><div className="alert alert-error">{error}</div></div>
  if (!stats) return null

  const filtered = (stats.candidates_list || []).filter((c: CandidateResult) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile?.includes(search)
  )
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function scoreBadge(score: number) {
    const cls = score >= 70 ? 'score-high' : score >= 40 ? 'score-mid' : 'score-low'
    return <span className={`score-badge ${cls}`}>{score?.toFixed(2) ?? '—'}</span>
  }

  return (
    <div>
      <header className="exam-header">
        <div className="exam-header-inner">
          <div>
            <div className="exam-title">Admin Dashboard</div>
            <div className="exam-subtitle">Senior Officer 2026</div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="admin-wrap">
        <div className="stats-grid">
          <div className="stat-card"><h3>Total Candidates</h3><p>{stats.total_candidates}</p></div>
          <div className="stat-card"><h3>Submitted</h3><p>{stats.total_submitted}</p></div>
          <div className="stat-card"><h3>In Progress</h3><p>{stats.total_in_progress}</p></div>
          <div className="stat-card"><h3>Average Score</h3><p>{stats.avg_score?.toFixed(2) ?? '—'}</p></div>
          <div className="stat-card"><h3>Highest Score</h3><p>{stats.max_score?.toFixed(2) ?? '—'}</p></div>
          <div className="stat-card"><h3>Lowest Score</h3><p>{stats.min_score?.toFixed(2) ?? '—'}</p></div>
        </div>

        <div className="tabs">
          {(['overview','candidates','leaderboard','analytics'] as const).map(t => (
            <button key={t} className={`tab-btn${activeTab===t?' active':''}`} onClick={() => setActiveTab(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
          <button className="btn btn-secondary btn-sm" onClick={exportCSV} style={{marginLeft:'auto'}}>
            ⬇️ Export CSV
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="table-wrap">
            <h2>📊 Examination Overview</h2>
            <table>
              <tbody>
                <tr><td><strong>Total Registered Candidates</strong></td><td>{stats.total_candidates}</td></tr>
                <tr><td><strong>Total Submissions</strong></td><td>{stats.total_submitted}</td></tr>
                <tr><td><strong>In Progress</strong></td><td>{stats.total_in_progress}</td></tr>
                <tr><td><strong>Average Score</strong></td><td>{stats.avg_score?.toFixed(2) ?? '—'}</td></tr>
                <tr><td><strong>Highest Score</strong></td><td>{stats.max_score?.toFixed(2) ?? '—'}</td></tr>
                <tr><td><strong>Lowest Score</strong></td><td>{stats.min_score?.toFixed(2) ?? '—'}</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="table-wrap">
            <h2>👥 Candidate Results</h2>
            <div className="search-bar">
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search by name, email, or mobile..." />
            </div>
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Name</th><th>Mobile</th><th>Email</th>
                  <th>Score</th><th>✅</th><th>❌</th><th>⬜</th>
                  <th>Status</th><th>Time Taken</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((c: CandidateResult, i: number) => (
                  <tr key={i}>
                    <td>{(page-1)*PAGE_SIZE+i+1}</td>
                    <td>{c.name}</td><td>{c.mobile}</td><td>{c.email}</td>
                    <td>{scoreBadge(c.score)}</td>
                    <td>{c.correct_count ?? '—'}</td>
                    <td>{c.incorrect_count ?? '—'}</td>
                    <td>{c.unanswered_count ?? '—'}</td>
                    <td><span className={`score-badge ${c.status==='submitted'?'score-high':'score-mid'}`}>{c.status}</span></td>
                    <td>{c.time_taken_seconds ? `${Math.floor(c.time_taken_seconds/60)}m ${c.time_taken_seconds%60}s` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="pagination">
                <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}>‹ Prev</button>
                {Array.from({length:totalPages},(_,i)=>i+1).map(p => (
                  <button key={p} className={page===p?'active':''} onClick={() => setPage(p)}>{p}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}>Next ›</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="table-wrap">
            <h2>🏆 Leaderboard</h2>
            <table>
              <thead><tr><th>Rank</th><th>Name</th><th>Score</th><th>Correct</th></tr></thead>
              <tbody>
                {(stats.leaderboard || []).map((e: LeaderboardEntry) => (
                  <tr key={e.rank}>
                    <td><span className={`rank-badge rank-${e.rank}`}>#{e.rank}</span></td>
                    <td>{e.name}</td>
                    <td>{scoreBadge(e.score)}</td>
                    <td>{e.correct_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="table-wrap">
            <h2>📈 Question-wise Analytics</h2>
            <table>
              <thead>
                <tr><th>Q#</th><th>Question</th><th>✅ Correct</th><th>❌ Wrong</th><th>⬜ Skip</th><th>% Correct</th></tr>
              </thead>
              <tbody>
                {(stats.question_analytics || []).map((q: QuestionAnalytic) => (
                  <tr key={q.question_number}>
                    <td>{q.question_number}</td>
                    <td style={{maxWidth:'300px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={q.question_text}>{q.question_text}</td>
                    <td>{q.correct_count}</td>
                    <td>{q.incorrect_count}</td>
                    <td>{q.unanswered_count}</td>
                    <td><span className={`score-badge ${q.correct_pct>=60?'score-high':q.correct_pct>=40?'score-mid':'score-low'}`}>{q.correct_pct?.toFixed(1)}%</span></td>
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
