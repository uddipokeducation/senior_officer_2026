export interface Question {
  id: string
  question_number: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  subject?: string
}

export interface ExamResult {
  score: number
  correct_count: number
  incorrect_count: number
  unanswered_count: number
  submitted_at: string
  candidate_name: string
  questions_with_answers: Array<{
    question_number: number
    question_text: string
    option_a: string
    option_b: string
    option_c: string
    option_d: string
    selected_option: string | null
    correct_option: string
    is_correct: boolean | null
  }>
}

export interface AdminStats {
  total_candidates: number
  total_submitted: number
  total_in_progress: number
  avg_score: number
  max_score: number
  min_score: number
  candidates_list: CandidateResult[]
  leaderboard: LeaderboardEntry[]
  question_analytics: QuestionAnalytic[]
}

export interface CandidateResult {
  name: string
  mobile: string
  email: string
  score: number
  correct_count: number
  incorrect_count: number
  unanswered_count: number
  started_at: string
  submitted_at: string
  time_taken_seconds: number
  status: string
}

export interface LeaderboardEntry {
  rank: number
  name: string
  score: number
  correct_count: number
}

export interface QuestionAnalytic {
  question_number: number
  question_text: string
  correct_count: number
  incorrect_count: number
  unanswered_count: number
  correct_pct: number
}
