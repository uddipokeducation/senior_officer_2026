-- ============================================================
-- 005 SECURITY HARDENING (safe to re-run)
-- 1. Close direct anon access to private tables
-- 2. Server-side input validation for registration
-- 3. Admin-only stats (Supabase Auth + admin_users)
-- 4. Results only for submitted attempts
-- ============================================================

-- Remove broken trigger from 004 (caused "Database error saving new user")
DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_admin_user();

-- ---------- 1. Lock down tables ----------
DROP POLICY IF EXISTS "Anyone can register as candidate" ON candidates;
DROP POLICY IF EXISTS "Anyone can read candidates" ON candidates;
DROP POLICY IF EXISTS "Anyone can insert exam attempt" ON exam_attempts;
DROP POLICY IF EXISTS "Anyone can select exam attempt" ON exam_attempts;
DROP POLICY IF EXISTS "Anyone can update exam attempt" ON exam_attempts;
DROP POLICY IF EXISTS "Anyone can insert candidate responses" ON candidate_responses;
DROP POLICY IF EXISTS "Anyone can update candidate responses" ON candidate_responses;
DROP POLICY IF EXISTS "Anyone can select candidate responses" ON candidate_responses;

REVOKE ALL ON candidates, exam_attempts, candidate_responses, answer_keys, admin_users FROM anon, authenticated;
-- questions (no answers) + examinations stay publicly readable

-- ---------- Admin check ----------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid());
$$;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- ---------- Rename originals to private implementations (first run only) ----------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = '_start_exam_impl') THEN
    ALTER FUNCTION public.start_exam_rpc(TEXT, TEXT, TEXT) RENAME TO _start_exam_impl;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = '_admin_stats_impl') THEN
    ALTER FUNCTION public.get_admin_stats_rpc() RENAME TO _admin_stats_impl;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = '_exam_result_impl') THEN
    ALTER FUNCTION public.get_exam_result_rpc(UUID) RENAME TO _exam_result_impl;
  END IF;
END $$;

REVOKE EXECUTE ON FUNCTION public._start_exam_impl(TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public._admin_stats_impl() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public._exam_result_impl(UUID) FROM PUBLIC, anon, authenticated;

-- ---------- 2. Registration with server-side validation ----------
CREATE OR REPLACE FUNCTION public.start_exam_rpc(p_full_name TEXT, p_mobile TEXT, p_email TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_mobile TEXT := regexp_replace(COALESCE(p_mobile, ''), '[\s-]', '', 'g');
BEGIN
  IF length(trim(COALESCE(p_full_name, ''))) < 2 THEN
    RAISE EXCEPTION 'Full name is required';
  END IF;
  IF v_mobile LIKE '+880%' THEN v_mobile := '0' || substr(v_mobile, 5);
  ELSIF v_mobile LIKE '880%' THEN v_mobile := '0' || substr(v_mobile, 4);
  END IF;
  IF v_mobile !~ '^01[3-9][0-9]{8}$' THEN
    RAISE EXCEPTION 'Invalid Bangladeshi mobile number';
  END IF;
  IF trim(COALESCE(p_email, '')) !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'Invalid email address';
  END IF;
  RETURN public._start_exam_impl(trim(p_full_name), v_mobile, lower(trim(p_email)));
END;
$$;

-- ---------- Attempt info for exam page (replaces direct table read) ----------
CREATE OR REPLACE FUNCTION public.get_attempt_info_rpc(p_attempt_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r RECORD;
BEGIN
  SELECT ea.examination_id, ea.status, ea.expires_at, c.full_name INTO r
  FROM exam_attempts ea JOIN candidates c ON c.id = ea.candidate_id
  WHERE ea.id = p_attempt_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Attempt not found'; END IF;
  RETURN jsonb_build_object(
    'examination_id', r.examination_id, 'status', r.status,
    'expires_at', r.expires_at, 'candidate_name', r.full_name,
    'server_now', NOW()
  );
END;
$$;

-- ---------- 3. Admin-only stats ----------
CREATE OR REPLACE FUNCTION public.get_admin_stats_rpc()
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Admin access required'; END IF;
  RETURN public._admin_stats_impl();
END;
$$;

-- ---------- 4. Results only after submission ----------
CREATE OR REPLACE FUNCTION public.get_exam_result_rpc(p_attempt_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_status TEXT;
BEGIN
  SELECT status INTO v_status FROM exam_attempts WHERE id = p_attempt_id;
  IF v_status IS NULL THEN RAISE EXCEPTION 'Attempt not found'; END IF;
  IF v_status <> 'submitted' THEN RAISE EXCEPTION 'Examination is not yet submitted'; END IF;
  RETURN public._exam_result_impl(p_attempt_id);
END;
$$;

-- ---------- Grants ----------
REVOKE EXECUTE ON FUNCTION public.start_exam_rpc(TEXT, TEXT, TEXT), public.get_attempt_info_rpc(UUID),
  public.get_admin_stats_rpc(), public.get_exam_result_rpc(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.start_exam_rpc(TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_attempt_info_rpc(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_exam_result_rpc(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_stats_rpc() TO authenticated;

-- ---------- Admin account ----------
-- Only this email is admin. Create the user first in
-- Supabase Dashboard -> Authentication -> Users -> Add user (Auto Confirm).
DELETE FROM admin_users WHERE email <> 'khandakerhiron@gmail.com';
INSERT INTO admin_users (id, email)
SELECT id, email FROM auth.users WHERE email = 'khandakerhiron@gmail.com'
ON CONFLICT (id) DO NOTHING;
