-- ============================================================
-- COMPLETE ADMIN STATS & AUTOMATIC ADMIN ONBOARDING
-- ============================================================

-- 1. Automatic Admin Setup Trigger: The first user registered in auth.users becomes Admin
CREATE OR REPLACE FUNCTION handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
  -- If no admin exists yet, automatically promote this user to admin
  IF NOT EXISTS (SELECT 1 FROM admin_users) THEN
    INSERT INTO admin_users (id, email) VALUES (NEW.id, NEW.email)
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_admin_user();

-- Also ensure any existing user in auth.users can be added
INSERT INTO admin_users (id, email)
SELECT id, email FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 2. Complete Server-Side Admin Stats RPC
CREATE OR REPLACE FUNCTION get_admin_stats_rpc()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_candidates INT;
  v_total_submitted INT;
  v_total_in_progress INT;
  v_avg_score NUMERIC(6,2);
  v_max_score NUMERIC(6,2);
  v_min_score NUMERIC(6,2);
  v_candidates_list JSONB;
  v_leaderboard JSONB;
  v_question_analytics JSONB;
BEGIN
  -- Counts
  SELECT COUNT(*) INTO v_total_candidates FROM candidates;
  SELECT COUNT(*) INTO v_total_submitted FROM exam_attempts WHERE status = 'submitted';
  SELECT COUNT(*) INTO v_total_in_progress FROM exam_attempts WHERE status = 'in_progress';

  -- Score aggregates
  SELECT
    COALESCE(ROUND(AVG(score), 2), 0.00),
    COALESCE(MAX(score), 0.00),
    COALESCE(MIN(score), 0.00)
  INTO v_avg_score, v_max_score, v_min_score
  FROM exam_attempts WHERE status = 'submitted';

  -- Candidate roster list
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'name', c.full_name,
      'mobile', c.mobile_number,
      'email', c.email,
      'score', ea.score,
      'correct_count', ea.correct_count,
      'incorrect_count', ea.incorrect_count,
      'unanswered_count', ea.unanswered_count,
      'status', ea.status,
      'started_at', ea.started_at,
      'submitted_at', ea.submitted_at,
      'time_taken_seconds', ea.time_taken_seconds
    ) ORDER BY ea.submitted_at DESC NULLS LAST
  ), '[]'::jsonb) INTO v_candidates_list
  FROM exam_attempts ea
  JOIN candidates c ON c.id = ea.candidate_id;

  -- Leaderboard (ranked by score desc)
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'rank', t.rank,
      'name', t.full_name,
      'score', t.score,
      'correct_count', t.correct_count
    )
  ), '[]'::jsonb) INTO v_leaderboard
  FROM (
    SELECT
      DENSE_RANK() OVER (ORDER BY ea.score DESC) AS rank,
      c.full_name,
      ea.score,
      ea.correct_count
    FROM exam_attempts ea
    JOIN candidates c ON c.id = ea.candidate_id
    WHERE ea.status = 'submitted'
    ORDER BY ea.score DESC
  ) t;

  -- Question-wise analytics (all 100 questions)
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'question_number', q.question_number,
      'question_text', q.question_text,
      'correct_count', COALESCE(stat.correct_count, 0),
      'incorrect_count', COALESCE(stat.incorrect_count, 0),
      'unanswered_count', GREATEST(0, v_total_submitted - COALESCE(stat.correct_count, 0) - COALESCE(stat.incorrect_count, 0)),
      'correct_pct', CASE WHEN v_total_submitted > 0 THEN ROUND((COALESCE(stat.correct_count, 0)::NUMERIC / v_total_submitted) * 100, 1) ELSE 0.0 END
    ) ORDER BY q.question_number
  ), '[]'::jsonb) INTO v_question_analytics
  FROM questions q
  LEFT JOIN (
    SELECT
      cr.question_id,
      COUNT(CASE WHEN cr.is_correct = true THEN 1 END) AS correct_count,
      COUNT(CASE WHEN cr.is_correct = false AND cr.selected_option IS NOT NULL THEN 1 END) AS incorrect_count
    FROM candidate_responses cr
    JOIN exam_attempts ea ON ea.id = cr.attempt_id
    WHERE ea.status = 'submitted'
    GROUP BY cr.question_id
  ) stat ON stat.question_id = q.id
  WHERE q.examination_id = (SELECT id FROM examinations WHERE is_active = true LIMIT 1);

  RETURN jsonb_build_object(
    'total_candidates', v_total_candidates,
    'total_submitted', v_total_submitted,
    'total_in_progress', v_total_in_progress,
    'avg_score', v_avg_score,
    'max_score', v_max_score,
    'min_score', v_min_score,
    'candidates_list', v_candidates_list,
    'leaderboard', v_leaderboard,
    'question_analytics', v_question_analytics
  );
END;
$$;

GRANT EXECUTE ON FUNCTION get_admin_stats_rpc() TO anon, authenticated;
