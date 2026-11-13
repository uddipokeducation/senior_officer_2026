-- ============================================================
-- FIX SUBMIT_EXAM_RPC & GET_EXAM_RESULT_RPC (ACCURATE SCORING)
-- ============================================================

CREATE OR REPLACE FUNCTION submit_exam_rpc(
  p_attempt_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_exam_id UUID;
  v_started_at TIMESTAMPTZ;
  v_status TEXT;
  v_existing_score NUMERIC(6,2);
  v_correct INT := 0;
  v_incorrect INT := 0;
  v_unanswered INT := 0;
  v_score NUMERIC(6,2) := 0.00;
  v_submitted_at TIMESTAMPTZ := NOW();
  v_time_taken INT;
  r RECORD;
BEGIN
  SELECT examination_id, started_at, status, score
  INTO v_exam_id, v_started_at, v_status, v_existing_score
  FROM exam_attempts WHERE id = p_attempt_id;

  IF v_status IS NULL THEN RAISE EXCEPTION 'Attempt not found'; END IF;

  -- If already submitted with a valid score, return it
  IF v_status = 'submitted' AND v_existing_score IS NOT NULL THEN
    SELECT score, correct_count, incorrect_count, unanswered_count, submitted_at
    INTO v_score, v_correct, v_incorrect, v_unanswered, v_submitted_at
    FROM exam_attempts WHERE id = p_attempt_id;
    
    RETURN jsonb_build_object(
      'score', COALESCE(v_score, 0.00),
      'correct_count', COALESCE(v_correct, 0),
      'incorrect_count', COALESCE(v_incorrect, 0),
      'unanswered_count', COALESCE(v_unanswered, 0),
      'submitted_at', v_submitted_at
    );
  END IF;

  v_time_taken := GREATEST(0, EXTRACT(EPOCH FROM (v_submitted_at - v_started_at))::INT);
  v_correct := 0;
  v_incorrect := 0;
  v_unanswered := 0;

  -- Score against private answer_keys table
  FOR r IN (
    SELECT q.id AS question_id, ak.correct_option, cr.selected_option
    FROM questions q
    JOIN answer_keys ak ON ak.question_id = q.id
    LEFT JOIN candidate_responses cr ON cr.question_id = q.id AND cr.attempt_id = p_attempt_id
    WHERE q.examination_id = v_exam_id
  ) LOOP
    IF r.selected_option IS NULL THEN
      v_unanswered := v_unanswered + 1;
      INSERT INTO candidate_responses (attempt_id, question_id, selected_option, is_correct, updated_at)
      VALUES (p_attempt_id, r.question_id, NULL, false, NOW())
      ON CONFLICT (attempt_id, question_id) DO UPDATE SET is_correct = false;
    ELSIF r.selected_option = r.correct_option THEN
      v_correct := v_correct + 1;
      UPDATE candidate_responses SET is_correct = true WHERE attempt_id = p_attempt_id AND question_id = r.question_id;
    ELSE
      v_incorrect := v_incorrect + 1;
      UPDATE candidate_responses SET is_correct = false WHERE attempt_id = p_attempt_id AND question_id = r.question_id;
    END IF;
  END LOOP;

  -- Authoritative Formula: Correct * 1.00 - Incorrect * 0.25
  v_score := (v_correct * 1.00) - (v_incorrect * 0.25);

  -- Finalize attempt
  UPDATE exam_attempts SET
    status = 'submitted',
    submitted_at = v_submitted_at,
    score = v_score,
    correct_count = v_correct,
    incorrect_count = v_incorrect,
    unanswered_count = v_unanswered,
    time_taken_seconds = v_time_taken
  WHERE id = p_attempt_id;

  RETURN jsonb_build_object(
    'score', v_score,
    'correct_count', v_correct,
    'incorrect_count', v_incorrect,
    'unanswered_count', v_unanswered,
    'submitted_at', v_submitted_at
  );
END;
$$;

-- FIX GET_EXAM_RESULT_RPC TO PREVENT NULL SCORES & AUTO-SCORE IF NEEDED
CREATE OR REPLACE FUNCTION get_exam_result_rpc(
  p_attempt_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_status TEXT;
  v_cand_name TEXT;
  v_score NUMERIC(6,2);
  v_correct INT;
  v_incorrect INT;
  v_unanswered INT;
  v_submitted_at TIMESTAMPTZ;
  v_exam_id UUID;
  v_questions JSONB;
BEGIN
  -- First ensure it is scored
  PERFORM submit_exam_rpc(p_attempt_id);

  SELECT ea.status, ea.score, ea.correct_count, ea.incorrect_count, ea.unanswered_count, ea.submitted_at, ea.examination_id, c.full_name
  INTO v_status, v_score, v_correct, v_incorrect, v_unanswered, v_submitted_at, v_exam_id, v_cand_name
  FROM exam_attempts ea
  JOIN candidates c ON c.id = ea.candidate_id
  WHERE ea.id = p_attempt_id;

  IF v_status IS NULL THEN RAISE EXCEPTION 'Attempt not found'; END IF;

  SELECT jsonb_agg(
    jsonb_build_object(
      'question_number', q.question_number,
      'question_text', q.question_text,
      'option_a', q.option_a,
      'option_b', q.option_b,
      'option_c', q.option_c,
      'option_d', q.option_d,
      'selected_option', cr.selected_option,
      'correct_option', ak.correct_option,
      'is_correct', cr.is_correct
    ) ORDER BY q.question_number
  ) INTO v_questions
  FROM questions q
  JOIN answer_keys ak ON ak.question_id = q.id
  LEFT JOIN candidate_responses cr ON cr.question_id = q.id AND cr.attempt_id = p_attempt_id
  WHERE q.examination_id = v_exam_id;

  RETURN jsonb_build_object(
    'score', COALESCE(v_score, 0.00),
    'correct_count', COALESCE(v_correct, 0),
    'incorrect_count', COALESCE(v_incorrect, 0),
    'unanswered_count', COALESCE(v_unanswered, 0),
    'submitted_at', COALESCE(v_submitted_at, NOW()),
    'candidate_name', COALESCE(v_cand_name, 'Candidate'),
    'questions_with_answers', COALESCE(v_questions, '[]'::jsonb)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION submit_exam_rpc(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_exam_result_rpc(UUID) TO anon, authenticated;
