-- ============================================================
-- 006 COHORT RANK, TOTAL EXAMINEES, AVERAGE & HIGHEST SCORE IN RESULT RPC
-- Safe to run in Supabase SQL Editor
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_exam_result_rpc(p_attempt_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_status TEXT;
  v_exam_id UUID;
  v_my_score NUMERIC(6,2);
  v_total_submitted INT := 1;
  v_avg_score NUMERIC(6,2) := 0.00;
  v_max_score NUMERIC(6,2) := 0.00;
  v_rank INT := 1;
  v_base JSONB;
BEGIN
  SELECT status, examination_id, COALESCE(score, 0.00)
  INTO v_status, v_exam_id, v_my_score
  FROM exam_attempts WHERE id = p_attempt_id;

  IF v_status IS NULL THEN RAISE EXCEPTION 'Attempt not found'; END IF;
  IF v_status <> 'submitted' THEN RAISE EXCEPTION 'Examination is not yet submitted'; END IF;

  v_base := public._exam_result_impl(p_attempt_id);
  v_my_score := COALESCE((v_base->>'score')::NUMERIC, v_my_score, 0.00);

  SELECT
    COUNT(*)::INT,
    COALESCE(ROUND(AVG(score), 2), 0.00),
    COALESCE(MAX(score), 0.00),
    (COUNT(*) FILTER (WHERE score > v_my_score) + 1)::INT
  INTO v_total_submitted, v_avg_score, v_max_score, v_rank
  FROM exam_attempts
  WHERE examination_id = v_exam_id AND status = 'submitted';

  RETURN v_base || jsonb_build_object(
    'rank', COALESCE(v_rank, 1),
    'total_candidates', GREATEST(COALESCE(v_total_submitted, 1), 1),
    'average_score', COALESCE(v_avg_score, v_my_score),
    'highest_score', COALESCE(v_max_score, v_my_score)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_exam_result_rpc(UUID) TO anon, authenticated;
