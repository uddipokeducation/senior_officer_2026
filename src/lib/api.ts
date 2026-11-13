import { supabase } from './supabase'

export const api = {
  startExam: async (candidate: { fullName: string; mobile: string; email: string }) => {
    const { data, error } = await supabase.rpc('start_exam_rpc', {
      p_full_name: candidate.fullName,
      p_mobile: candidate.mobile,
      p_email: candidate.email
    })
    if (error) throw new Error(error.message)
    return data
  },

  saveAnswer: async (attemptId: string, questionId: string, selectedOption: string | null) => {
    const { data, error } = await supabase.rpc('save_answer_rpc', {
      p_attempt_id: attemptId,
      p_question_id: questionId,
      p_selected_option: selectedOption || null
    })
    if (error) throw new Error(error.message)
    return data
  },

  submitExam: async (attemptId: string) => {
    const { data, error } = await supabase.rpc('submit_exam_rpc', {
      p_attempt_id: attemptId
    })
    if (error) throw new Error(error.message)
    return data
  },

  getResult: async (attemptId: string) => {
    const { data, error } = await supabase.rpc('get_exam_result_rpc', {
      p_attempt_id: attemptId
    })
    if (error) throw new Error(error.message)
    return data
  },

  getAdminStats: async () => {
    const { data, error } = await supabase.rpc('get_admin_stats_rpc')
    if (error) throw new Error(error.message)
    return data
  }
}
