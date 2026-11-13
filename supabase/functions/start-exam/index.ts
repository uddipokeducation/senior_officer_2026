import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { fullName, mobile, email } = await req.json()

    // Validate inputs
    if (!fullName?.trim()) throw new Error('Full name is required')
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Valid email is required')
    if (!mobile?.trim() || !/^01[3-9]\d{8}$/.test(mobile)) throw new Error('Valid Bangladeshi mobile number is required (01XXXXXXXXX)')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Get active examination
    const { data: exam, error: examErr } = await supabase
      .from('examinations').select('id, duration_minutes').eq('is_active', true).single()
    if (examErr || !exam) throw new Error('No active examination found')

    // Find or create candidate (upsert by email)
    const { data: candidate, error: candErr } = await supabase
      .from('candidates')
      .upsert({ full_name: fullName.trim(), mobile_number: mobile, email: email.toLowerCase() },
        { onConflict: 'email', ignoreDuplicates: false })
      .select('id').single()
    if (candErr) throw new Error('Registration failed: ' + candErr.message)

    // Check for existing attempt
    const { data: existing } = await supabase
      .from('exam_attempts')
      .select('id, status, expires_at')
      .eq('candidate_id', candidate.id)
      .eq('examination_id', exam.id)
      .single()

    if (existing) {
      if (existing.status === 'submitted') throw new Error('You have already submitted this examination.')
      // Return existing in-progress attempt
      return new Response(JSON.stringify({
        attemptId: existing.id,
        expiresAt: existing.expires_at,
        candidateId: candidate.id,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Create new attempt
    const expiresAt = new Date(Date.now() + exam.duration_minutes * 60 * 1000).toISOString()
    const { data: attempt, error: attErr } = await supabase
      .from('exam_attempts')
      .insert({ candidate_id: candidate.id, examination_id: exam.id, expires_at: expiresAt, status: 'in_progress' })
      .select('id').single()
    if (attErr) throw new Error('Failed to start exam: ' + attErr.message)

    return new Response(JSON.stringify({
      attemptId: attempt.id,
      expiresAt,
      candidateId: candidate.id,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
