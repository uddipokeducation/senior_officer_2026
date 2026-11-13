import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { attemptId } = await req.json()
    if (!attemptId) throw new Error('attemptId is required')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Get attempt (must be submitted)
    const { data: attempt, error: aErr } = await supabase
      .from('exam_attempts')
      .select('id, status, examination_id, score, correct_count, incorrect_count, unanswered_count, submitted_at, candidate_id')
      .eq('id', attemptId).single()
    if (aErr || !attempt) throw new Error('Attempt not found')
    if (attempt.status !== 'submitted') throw new Error('Examination not yet submitted')

    // Get candidate name
    const { data: candidate } = await supabase
      .from('candidates').select('full_name').eq('id', attempt.candidate_id).single()

    // Get all questions
    const { data: questions } = await supabase
      .from('questions')
      .select('id, question_number, question_text, option_a, option_b, option_c, option_d')
      .eq('examination_id', attempt.examination_id)
      .order('question_number')

    // Get answer keys (only after submission)
    const qIds = (questions || []).map((q: { id: string }) => q.id)
    const { data: answerKeys } = await supabase
      .from('answer_keys').select('question_id, correct_option').in('question_id', qIds)

    // Get responses
    const { data: responses } = await supabase
      .from('candidate_responses').select('question_id, selected_option, is_correct').eq('attempt_id', attemptId)

    const keyMap: Record<string, string> = {}
    for (const k of answerKeys || []) keyMap[k.question_id] = k.correct_option
    const respMap: Record<string, { selected_option: string | null; is_correct: boolean }> = {}
    for (const r of responses || []) respMap[r.question_id] = r

    const questionsWithAnswers = (questions || []).map((q: {
      id: string; question_number: number; question_text: string;
      option_a: string; option_b: string; option_c: string; option_d: string
    }) => ({
      question_number: q.question_number,
      question_text: q.question_text,
      option_a: q.option_a, option_b: q.option_b, option_c: q.option_c, option_d: q.option_d,
      selected_option: respMap[q.id]?.selected_option ?? null,
      correct_option: keyMap[q.id],
      is_correct: respMap[q.id]?.is_correct ?? null,
    }))

    return new Response(JSON.stringify({
      score: attempt.score,
      correct_count: attempt.correct_count,
      incorrect_count: attempt.incorrect_count,
      unanswered_count: attempt.unanswered_count,
      submitted_at: attempt.submitted_at,
      candidate_name: candidate?.full_name ?? '',
      questions_with_answers: questionsWithAnswers,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
