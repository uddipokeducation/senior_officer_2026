import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // Verify admin via JWT
    const authHeader = req.headers.get('Authorization') || ''
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user } } = await supabaseUser.auth.getUser()
    if (!user) throw new Error('Authentication required')

    const { data: adminCheck } = await supabase.from('admin_users').select('id').eq('id', user.id).single()
    if (!adminCheck) throw new Error('Admin access required')

    // Get stats
    const [
      { count: total_candidates },
      { data: attempts },
      { data: questions },
    ] = await Promise.all([
      supabase.from('candidates').select('*', { count: 'exact', head: true }),
      supabase.from('exam_attempts').select('id, status, score, correct_count, incorrect_count, unanswered_count, started_at, submitted_at, time_taken_seconds, candidate_id, candidates(full_name, mobile_number, email)'),
      supabase.from('questions').select('id, question_number, question_text').order('question_number'),
    ])

    const submitted = (attempts || []).filter((a: { status: string }) => a.status === 'submitted')
    const inProgress = (attempts || []).filter((a: { status: string }) => a.status === 'in_progress')
    const scores = submitted.map((a: { score: number }) => a.score).filter((s: number | null) => s !== null) as number[]

    const avg_score = scores.length ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0
    const max_score = scores.length ? Math.max(...scores) : 0
    const min_score = scores.length ? Math.min(...scores) : 0

    // Build candidates list
    const candidates_list = (attempts || []).map((a: {
      id: string; status: string; score: number; correct_count: number;
      incorrect_count: number; unanswered_count: number; started_at: string;
      submitted_at: string; time_taken_seconds: number;
      candidates: { full_name: string; mobile_number: string; email: string } | null
    }) => ({
      name: a.candidates?.full_name ?? '',
      mobile: a.candidates?.mobile_number ?? '',
      email: a.candidates?.email ?? '',
      score: a.score,
      correct_count: a.correct_count,
      incorrect_count: a.incorrect_count,
      unanswered_count: a.unanswered_count,
      status: a.status,
      started_at: a.started_at,
      submitted_at: a.submitted_at,
      time_taken_seconds: a.time_taken_seconds,
    }))

    // Leaderboard (submitted only, ranked by score)
    const sorted = [...submitted].sort((a: { score: number }, b: { score: number }) => b.score - a.score)
    let rank = 1
    const leaderboard = sorted.map((a: {
      score: number; correct_count: number;
      candidates: { full_name: string } | null
    }, i: number) => {
      if (i > 0 && a.score < sorted[i-1].score) rank = i + 1
      return { rank, name: a.candidates?.full_name ?? '', score: a.score, correct_count: a.correct_count }
    })

    // Question analytics
    const { data: responses } = await supabase
      .from('candidate_responses').select('question_id, selected_option, is_correct')

    const analytics = (questions || []).map((q: { id: string; question_number: number; question_text: string }) => {
      const qResp = (responses || []).filter((r: { question_id: string }) => r.question_id === q.id)
      const correct_count = qResp.filter((r: { is_correct: boolean }) => r.is_correct).length
      const incorrect_count = qResp.filter((r: { is_correct: boolean; selected_option: string | null }) => !r.is_correct && r.selected_option !== null).length
      const unanswered_count = submitted.length - correct_count - incorrect_count
      const correct_pct = submitted.length ? (correct_count / submitted.length) * 100 : 0
      return { question_number: q.question_number, question_text: q.question_text, correct_count, incorrect_count, unanswered_count, correct_pct }
    })

    return new Response(JSON.stringify({
      total_candidates,
      total_submitted: submitted.length,
      total_in_progress: inProgress.length,
      avg_score,
      max_score,
      min_score,
      candidates_list,
      leaderboard,
      question_analytics: analytics,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
