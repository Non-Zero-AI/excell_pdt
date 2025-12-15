import { supabase, isSupabaseConfigured } from './supabaseClient'

/**
 * Quiz Service
 * Handles quiz-related operations
 */

// Submit a quiz attempt
export const submitQuizAttempt = async (userId, quizResult) => {
  if (!isSupabaseConfigured()) {
    // Mock implementation
    console.warn('Supabase not configured, using mock quiz submission')
    return {
      attempt: {
        id: `attempt-${Date.now()}`,
        ...quizResult,
        userId,
        submittedAt: new Date().toISOString(),
      },
      error: null,
    }
  }

  try {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert({
        user_id: userId,
        quiz_id: quizResult.quizId,
        chapter_id: quizResult.chapterId,
        course_id: quizResult.courseId,
        score: quizResult.score,
        correct_count: quizResult.correctCount,
        total_questions: quizResult.totalQuestions,
        passed: quizResult.passed,
        answers: quizResult.answers,
        completed_at: quizResult.completedAt,
      })
      .select()
      .single()

    if (error) throw error
    return { attempt: data, error: null }
  } catch (error) {
    console.error('Submit quiz attempt error:', error)
    return { attempt: null, error }
  }
}

// Fetch user's quiz attempts for a chapter
export const fetchQuizAttempts = async (userId, chapterId) => {
  if (!isSupabaseConfigured()) {
    return { attempts: [], error: null }
  }

  try {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', userId)
      .eq('chapter_id', chapterId)
      .order('completed_at', { ascending: false })

    if (error) throw error
    return { attempts: data || [], error: null }
  } catch (error) {
    console.error('Fetch quiz attempts error:', error)
    return { attempts: [], error }
  }
}

// Fetch best quiz attempt for a chapter
export const fetchBestQuizAttempt = async (userId, chapterId) => {
  if (!isSupabaseConfigured()) {
    return { attempt: null, error: null }
  }

  try {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', userId)
      .eq('chapter_id', chapterId)
      .order('score', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
    return { attempt: data, error: null }
  } catch (error) {
    console.error('Fetch best quiz attempt error:', error)
    return { attempt: null, error }
  }
}

// Check if user has passed a quiz
export const hasPassedQuiz = async (userId, chapterId, passingScore = 70) => {
  if (!isSupabaseConfigured()) {
    return { passed: false, error: null }
  }

  try {
    const { attempt } = await fetchBestQuizAttempt(userId, chapterId)
    return { 
      passed: attempt ? attempt.score >= passingScore && attempt.passed : false,
      error: null 
    }
  } catch (error) {
    console.error('Check quiz passed error:', error)
    return { passed: false, error }
  }
}

