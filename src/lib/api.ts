const FUNCTIONS_URL = (import.meta.env.VITE_SUPABASE_URL as string) + '/functions/v1'
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

async function callEdgeFunction(name: string, body: object) {
  const response = await fetch(`${FUNCTIONS_URL}/${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify(body),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Server error')
  return data
}

export const api = {
  startExam: (candidate: { fullName: string; mobile: string; email: string }) =>
    callEdgeFunction('start-exam', candidate),
  saveAnswer: (attemptId: string, questionId: string, selectedOption: string | null) =>
    callEdgeFunction('save-answer', { attemptId, questionId, selectedOption }),
  submitExam: (attemptId: string) =>
    callEdgeFunction('submit-exam', { attemptId }),
  getResult: (attemptId: string) =>
    callEdgeFunction('get-result', { attemptId }),
  getAdminStats: () =>
    callEdgeFunction('admin-stats', {}),
}
