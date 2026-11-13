const ATTEMPT_KEY = 'exam_attempt_id'
const ANSWERS_KEY = 'exam_answers'
const EXPIRY_KEY = 'exam_expiry_time'
const NAME_KEY = 'exam_candidate_name'

export const examStorage = {
  saveAttempt(attemptId: string, expiresAt: string, candidateName: string) {
    localStorage.setItem(ATTEMPT_KEY, attemptId)
    localStorage.setItem(EXPIRY_KEY, expiresAt)
    localStorage.setItem(NAME_KEY, candidateName)
  },
  getAttemptId(): string | null { return localStorage.getItem(ATTEMPT_KEY) },
  getExpiresAt(): string | null { return localStorage.getItem(EXPIRY_KEY) },
  getCandidateName(): string { return localStorage.getItem(NAME_KEY) || '' },
  saveAnswer(questionId: string, option: string | null) {
    const answers = examStorage.getAnswers()
    if (option === null) delete answers[questionId]
    else answers[questionId] = option
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers))
  },
  getAnswers(): Record<string, string> {
    try { return JSON.parse(localStorage.getItem(ANSWERS_KEY) || '{}') }
    catch { return {} }
  },
  clearAll() {
    [ATTEMPT_KEY, ANSWERS_KEY, EXPIRY_KEY, NAME_KEY].forEach(k => localStorage.removeItem(k))
  }
}
