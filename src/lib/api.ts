import { supabase } from './supabase'

export const api = {
  startExam: async (candidate: { fullName: string; mobile: string; email: string }) => {
    const { data, error } = await supabase.rpc('start_exam_rpc', {
      p_full_name: candidate.fullName,
      p_mobile: candidate.mobile,
      p_email: candidate.email
    })
    if (error) throw new Error(error.message)
    return data
  },

  saveAnswer: async (attemptId: string, questionId: string, selectedOption: string | null) => {
    const { data, error } = await supabase.rpc('save_answer_rpc', {
      p_attempt_id: attemptId,
      p_question_id: questionId,
      p_selected_option: selectedOption || null
    })
    if (error) throw new Error(error.message)
    return data
  },

  submitExam: async (attemptId: string) => {
    const { data, error } = await supabase.rpc('submit_exam_rpc', {
      p_attempt_id: attemptId
    })
    if (error) throw new Error(error.message)
    return data
  },

  getResult: async (attemptId: string) => {
    const { data, error } = await supabase.rpc('get_exam_result_rpc', {
      p_attempt_id: attemptId
    })
    if (error) throw new Error(error.message)
    return data
  },

  getAdminStats: async () => {
    // Queries database directly using candidate and attempt views
    const [
      { count: totalCandidates },
      { data: attempts },
      { data: questions }
    ] = await Promise.all([
      supabase.from('candidates').select('*', { count: 'exact', head: true }),
      supabase.from('exam_attempts').select('id, status, score, correct_count, incorrect_count, unanswered_count, started_at, submitted_at, time_taken_seconds, candidates(full_name, mobile_number, email)'),
      supabase.from('questions').select('id, question_number, question_text').order('question_number')
    ])

    const submitted = (attempts || []).filter((a: any) => a.status === 'submitted')
    const inProgress = (attempts || []).filter((a: any) => a.status === 'in_progress')
    const scores = submitted.map((a: any) => a.score).filter((s: any) => s !== null && s !== undefined) as number[]

    const avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
    const maxScore = scores.length ? Math.max(...scores) : 0
    const minScore = scores.length ? Math.min(...scores) : 0

    const candidatesList = (attempts || []).map((a: any) => ({
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
      time_taken_seconds: a.time_taken_seconds
    }))

    const sorted = [...submitted].sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
    let rank = 1
    const leaderboard = sorted.map((a: any, i: number) => {
      if (i > 0 && a.score < sorted[i - 1].score) rank = i + 1
      return { rank, name: a.candidates?.full_name ?? '', score: a.score, correct_count: a.correct_count }
    })

    return {
      total_candidates: totalCandidates || 0,
      total_submitted: submitted.length,
      total_in_progress: inProgress.length,
      avg_score: avgScore,
      max_score: maxScore,
      min_score: minScore,
      candidates_list: candidatesList,
      leaderboard,
      question_analytics: (questions || []).map((q: any) => ({
        question_number: q.question_number,
        question_text: q.question_text,
        correct_count: 0,
        incorrect_count: 0,
        unanswered_count: 0,
        correct_pct: 0
      }))
    }
  }
}
