import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { attemptId, questionId, selectedOption } = await req.json()
    if (!attemptId) throw new Error('attemptId is required')
    if (!questionId) throw new Error('questionId is required')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Verify attempt is still valid
    const { data: attempt, error: aErr } = await supabase
      .from('exam_attempts').select('status, expires_at').eq('id', attemptId).single()
    if (aErr || !attempt) throw new Error('Attempt not found')
    if (attempt.status === 'submitted') throw new Error('Examination already submitted')
    if (new Date(attempt.expires_at) < new Date()) throw new Error('Examination time has expired')

    // Upsert response
    const { error } = await supabase.from('candidate_responses').upsert(
      { attempt_id: attemptId, question_id: questionId, selected_option: selectedOption || null, updated_at: new Date().toISOString() },
      { onConflict: 'attempt_id,question_id' }
    )
    if (error) throw new Error('Failed to save answer: ' + error.message)

    return new Response(JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
