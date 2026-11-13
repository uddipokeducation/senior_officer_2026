-- ============================================================
-- SECURE SERVER-SIDE POSTGRESQL RPC FUNCTIONS FOR EXAM LOGIC
-- ============================================================

-- 1. START EXAMINATION
CREATE OR REPLACE FUNCTION start_exam_rpc(
  p_full_name TEXT,
  p_mobile TEXT,
  p_email TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_cand_id UUID;
  v_exam_id UUID;
  v_duration INT;
  v_attempt_id UUID;
  v_expires_at TIMESTAMPTZ;
  v_existing_status TEXT;
  v_existing_expires TIMESTAMPTZ;
BEGIN
  -- Get active exam
  SELECT id, duration_minutes INTO v_exam_id, v_duration
  FROM examinations WHERE is_active = true LIMIT 1;
  
  IF v_exam_id IS NULL THEN
    RAISE EXCEPTION 'No active examination found';
  END IF;

  -- Upsert candidate
  INSERT INTO candidates (full_name, mobile_number, email)
  VALUES (TRIM(p_full_name), TRIM(p_mobile), LOWER(TRIM(p_email)))
  ON CONFLICT (email) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    mobile_number = EXCLUDED.mobile_number
  RETURNING id INTO v_cand_id;

  -- Check existing attempt
  SELECT id, status, expires_at INTO v_attempt_id, v_existing_status, v_existing_expires
  FROM exam_attempts
  WHERE candidate_id = v_cand_id AND examination_id = v_exam_id;

  IF v_attempt_id IS NOT NULL THEN
    IF v_existing_status = 'submitted' THEN
      RAISE EXCEPTION 'You have already submitted this examination.';
    END IF;
    RETURN jsonb_build_object(
      'attemptId', v_attempt_id,
      'expiresAt', v_existing_expires,
      'candidateId', v_cand_id
    );
  END IF;

  -- Create new attempt with authoritative server-side expiry (60 min)
  v_expires_at := NOW() + (v_duration || ' minutes')::INTERVAL;

  INSERT INTO exam_attempts (candidate_id, examination_id, expires_at, status)
  VALUES (v_cand_id, v_exam_id, v_expires_at, 'in_progress')
  RETURNING id INTO v_attempt_id;

  RETURN jsonb_build_object(
    'attemptId', v_attempt_id,
    'expiresAt', v_expires_at,
    'candidateId', v_cand_id
  );
END;
$$;

-- 2. SAVE CANDIDATE ANSWER
CREATE OR REPLACE FUNCTION save_answer_rpc(
  p_attempt_id UUID,
  p_question_id UUID,
  p_selected_option CHAR(1)
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_status TEXT;
  v_expires_at TIMESTAMPTZ;
BEGIN
  SELECT status, expires_at INTO v_status, v_expires_at
  FROM exam_attempts WHERE id = p_attempt_id;

  IF v_status IS NULL THEN RAISE EXCEPTION 'Attempt not found'; END IF;
  IF v_status = 'submitted' THEN RAISE EXCEPTION 'Examination is already submitted'; END IF;
  IF v_expires_at < NOW() THEN RAISE EXCEPTION 'Examination time has expired'; END IF;

  INSERT INTO candidate_responses (attempt_id, question_id, selected_option, updated_at)
  VALUES (p_attempt_id, p_question_id, p_selected_option, NOW())
  ON CONFLICT (attempt_id, question_id) DO UPDATE SET
    selected_option = EXCLUDED.selected_option,
    updated_at = NOW();

  RETURN jsonb_build_object('success', true);
END;
$$;

-- 3. SUBMIT & SCORE EXAMINATION (AUTHORITATIVE SERVER-SIDE)
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
  v_correct INT := 0;
  v_incorrect INT := 0;
  v_unanswered INT := 0;
  v_score NUMERIC(6,2) := 0.00;
  v_submitted_at TIMESTAMPTZ := NOW();
  v_time_taken INT;
  r RECORD;
BEGIN
  SELECT examination_id, started_at, status, score, correct_count, incorrect_count, unanswered_count, submitted_at
  INTO v_exam_id, v_started_at, v_status, v_score, v_correct, v_incorrect, v_unanswered, v_submitted_at
  FROM exam_attempts WHERE id = p_attempt_id;

  IF v_status IS NULL THEN RAISE EXCEPTION 'Attempt not found'; END IF;

  -- Idempotency: If already submitted, return existing authoritative score
  IF v_status = 'submitted' THEN
    RETURN jsonb_build_object(
      'score', v_score,
      'correct_count', v_correct,
      'incorrect_count', v_incorrect,
      'unanswered_count', v_unanswered,
      'submitted_at', v_submitted_at
    );
  END IF;

  v_time_taken := EXTRACT(EPOCH FROM (v_submitted_at - v_started_at))::INT;

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

  -- Final Score = (Correct * 1.00) - (Incorrect * 0.25)
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

-- 4. GET DETAILED RESULT (ONLY AFTER SUBMISSION)
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
  SELECT ea.status, ea.score, ea.correct_count, ea.incorrect_count, ea.unanswered_count, ea.submitted_at, ea.examination_id, c.full_name
  INTO v_status, v_score, v_correct, v_incorrect, v_unanswered, v_submitted_at, v_exam_id, v_cand_name
  FROM exam_attempts ea
  JOIN candidates c ON c.id = ea.candidate_id
  WHERE ea.id = p_attempt_id;

  IF v_status IS NULL THEN RAISE EXCEPTION 'Attempt not found'; END IF;
  IF v_status != 'submitted' THEN RAISE EXCEPTION 'Examination is not yet submitted'; END IF;

  -- Build questions array with answers revealed
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
    'score', v_score,
    'correct_count', v_correct,
    'incorrect_count', v_incorrect,
    'unanswered_count', v_unanswered,
    'submitted_at', v_submitted_at,
    'candidate_name', v_cand_name,
    'questions_with_answers', v_questions
  );
END;
$$;

-- Grant EXECUTE permissions to anon and authenticated
GRANT EXECUTE ON FUNCTION start_exam_rpc(TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION save_answer_rpc(UUID, UUID, CHAR(1)) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION submit_exam_rpc(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_exam_result_rpc(UUID) TO anon, authenticated;
