-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLE: examinations
-- =============================================
CREATE TABLE IF NOT EXISTS examinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  total_questions INTEGER NOT NULL DEFAULT 100,
  total_marks INTEGER NOT NULL DEFAULT 100,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  correct_mark NUMERIC(4,2) NOT NULL DEFAULT 1.00,
  incorrect_mark NUMERIC(4,2) NOT NULL DEFAULT -0.25,
  unanswered_mark NUMERIC(4,2) NOT NULL DEFAULT 0.00,
  is_active BOOLEAN NOT NULL DEFAULT true,
  leaderboard_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TABLE: questions
-- =============================================
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  examination_id UUID NOT NULL REFERENCES examinations(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  subject TEXT,
  explanation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(examination_id, question_number)
);

-- =============================================
-- TABLE: answer_keys (PRIVATE - never exposed publicly)
-- =============================================
CREATE TABLE IF NOT EXISTS answer_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A','B','C','D')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(question_id)
);

-- =============================================
-- TABLE: candidates
-- =============================================
CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(email)
);

-- =============================================
-- TABLE: exam_attempts
-- =============================================
CREATE TABLE IF NOT EXISTS exam_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  examination_id UUID NOT NULL REFERENCES examinations(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  submitted_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'expired')),
  score NUMERIC(6,2),
  correct_count INTEGER,
  incorrect_count INTEGER,
  unanswered_count INTEGER,
  time_taken_seconds INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(candidate_id, examination_id)
);

-- =============================================
-- TABLE: candidate_responses
-- =============================================
CREATE TABLE IF NOT EXISTS candidate_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_option CHAR(1) CHECK (selected_option IN ('A','B','C','D')),
  is_correct BOOLEAN,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(attempt_id, question_id)
);

-- =============================================
-- TABLE: admin_users
-- =============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_questions_exam_id ON questions(examination_id);
CREATE INDEX IF NOT EXISTS idx_questions_number ON questions(examination_id, question_number);
CREATE INDEX IF NOT EXISTS idx_answer_keys_question ON answer_keys(question_id);
CREATE INDEX IF NOT EXISTS idx_attempts_candidate ON exam_attempts(candidate_id);
CREATE INDEX IF NOT EXISTS idx_attempts_exam ON exam_attempts(examination_id);
CREATE INDEX IF NOT EXISTS idx_attempts_status ON exam_attempts(status);
CREATE INDEX IF NOT EXISTS idx_responses_attempt ON candidate_responses(attempt_id);
CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidates_mobile ON candidates(mobile_number);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE examinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 1. examinations: Public can read active examinations
CREATE POLICY "Public can read active examinations" ON examinations
  FOR SELECT USING (is_active = true);

-- 2. questions: Public can read questions (answers are NOT stored here)
CREATE POLICY "Public can read questions" ON questions
  FOR SELECT USING (true);

-- 3. answer_keys: STRICTLY PRIVATE. No anon/authenticated select policy.
-- Only accessible via service_role key (Edge Functions).

-- 4. candidates: Allow candidate registration insert
CREATE POLICY "Anyone can register as candidate" ON candidates
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read candidates" ON candidates
  FOR SELECT USING (true);

-- 5. exam_attempts: Public can insert and read their attempts
CREATE POLICY "Anyone can insert exam attempt" ON exam_attempts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can select exam attempt" ON exam_attempts
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update exam attempt" ON exam_attempts
  FOR UPDATE USING (true);

-- 6. candidate_responses: Candidate response management
CREATE POLICY "Anyone can insert candidate responses" ON candidate_responses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update candidate responses" ON candidate_responses
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can select candidate responses" ON candidate_responses
  FOR SELECT USING (true);

-- 7. admin_users: Only authenticated admin matching id
CREATE POLICY "Admins can view admin_users" ON admin_users
  FOR SELECT USING (auth.uid() = id);

-- =============================================
-- TRIGGERS
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_examinations_updated_at
  BEFORE UPDATE ON examinations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
