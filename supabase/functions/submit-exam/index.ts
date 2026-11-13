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

    // Get attempt
    const { data: attempt, error: aErr } = await supabase
      .from('exam_attempts')
      .select('id, status, examination_id, started_at, expires_at, candidate_id')
      .eq('id', attemptId).single()
    if (aErr || !attempt) throw new Error('Attempt not found')

    // If already submitted, return existing result
    if (attempt.status === 'submitted') {
      const { data: existing } = await supabase
        .from('exam_attempts')
        .select('score, correct_count, incorrect_count, unanswered_count, submitted_at')
        .eq('id', attemptId).single()
      return new Response(JSON.stringify(existing),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Get all questions for this exam
    const { data: questions, error: qErr } = await supabase
      .from('questions').select('id').eq('examination_id', attempt.examination_id)
    if (qErr) throw new Error('Failed to load questions')

    // Get all answer keys (service role only)
    const { data: answerKeys, error: akErr } = await supabase
      .from('answer_keys').select('question_id, correct_option')
      .in('question_id', questions!.map((q: { id: string }) => q.id))
    if (akErr) throw new Error('Failed to load answer keys')

    // Get candidate responses
    const { data: responses } = await supabase
      .from('candidate_responses').select('question_id, selected_option')
      .eq('attempt_id', attemptId)

    const responseMap: Record<string, string> = {}
    for (const r of responses || []) {
      if (r.selected_option) responseMap[r.question_id] = r.selected_option
    }

    const keyMap: Record<string, string> = {}
    for (const k of answerKeys || []) keyMap[k.question_id] = k.correct_option

    // Calculate scores
    let correct = 0, incorrect = 0, unanswered = 0
    const responseUpdates: Array<{ attempt_id: string; question_id: string; is_correct: boolean; selected_option: string | null; updated_at: string }> = []

    for (const q of questions || []) {
      const selected = responseMap[q.id] || null
      const correctOpt = keyMap[q.id]
      if (!selected) {
        unanswered++
        responseUpdates.push({ attempt_id: attemptId, question_id: q.id, is_correct: false, selected_option: null, updated_at: new Date().toISOString() })
      } else if (selected === correctOpt) {
        correct++
        responseUpdates.push({ attempt_id: attemptId, question_id: q.id, is_correct: true, selected_option: selected, updated_at: new Date().toISOString() })
      } else {
        incorrect++
        responseUpdates.push({ attempt_id: attemptId, question_id: q.id, is_correct: false, selected_option: selected, updated_at: new Date().toISOString() })
      }
    }

    // Score formula: correct*1 + incorrect*(-0.25), no clamp
    const score = correct * 1 + incorrect * (-0.25)
    const submittedAt = new Date().toISOString()
    const timeTaken = Math.floor((new Date(submittedAt).getTime() - new Date(attempt.started_at).getTime()) / 1000)

    // Update all responses with is_correct
    for (const upd of responseUpdates) {
      await supabase.from('candidate_responses').upsert(upd, { onConflict: 'attempt_id,question_id' })
    }

    // Update attempt
    await supabase.from('exam_attempts').update({
      status: 'submitted',
      submitted_at: submittedAt,
      score,
      correct_count: correct,
      incorrect_count: incorrect,
      unanswered_count: unanswered,
      time_taken_seconds: timeTaken,
    }).eq('id', attemptId)

    return new Response(JSON.stringify({ score, correct_count: correct, incorrect_count: incorrect, unanswered_count: unanswered, submitted_at: submittedAt }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
