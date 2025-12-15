/**
 * Quiz Helper Utilities
 * Functions for working with quiz data structures
 */

/**
 * Normalize quiz data structure
 * Ensures quiz has consistent structure regardless of source
 */
export const normalizeQuiz = (quiz) => {
  if (!quiz) return null

  return {
    id: quiz.id || `quiz-${Date.now()}`,
    title: quiz.title || 'Knowledge Check',
    description: quiz.description || '',
    passingScore: quiz.passingScore || 70,
    timeLimit: quiz.timeLimit || null,
    maxAttempts: quiz.maxAttempts || null,
    questions: normalizeQuestions(quiz.questions || []),
  }
}

/**
 * Normalize questions array
 */
export const normalizeQuestions = (questions) => {
  if (!Array.isArray(questions)) return []

  return questions.map((q, index) => ({
    id: q.id || `q${index + 1}`,
    question: q.question || q.text || '',
    answers: normalizeAnswers(q.answers || [], index),
    correctAnswer: q.correctAnswer || q.correct_answer || null,
    explanation: q.explanation || q.feedback || null,
  }))
}

/**
 * Normalize answers array
 */
export const normalizeAnswers = (answers, questionIndex) => {
  if (!Array.isArray(answers)) return []

  return answers.map((a, index) => ({
    id: a.id || `a${questionIndex}-${index + 1}`,
    text: a.text || a.answer || String(a),
  }))
}

/**
 * Check if a chapter has a quiz
 */
export const hasQuiz = (chapter) => {
  return !!(chapter?.quiz || chapter?.quiz_id)
}

/**
 * Get quiz from chapter
 */
export const getChapterQuiz = (chapter) => {
  if (!chapter) return null
  if (chapter.quiz) {
    return normalizeQuiz(chapter.quiz)
  }
  return null
}

/**
 * Calculate quiz score
 */
export const calculateScore = (questions, answers) => {
  if (!questions || !Array.isArray(questions)) return { score: 0, correctCount: 0, totalQuestions: 0 }

  const totalQuestions = questions.length
  let correctCount = 0

  questions.forEach(question => {
    const userAnswer = answers[question.id]
    if (userAnswer === question.correctAnswer) {
      correctCount++
    }
  })

  const score = totalQuestions > 0 
    ? Math.round((correctCount / totalQuestions) * 100)
    : 0

  return { score, correctCount, totalQuestions }
}

/**
 * Check if quiz is passed
 */
export const isQuizPassed = (score, passingScore = 70) => {
  return score >= passingScore
}

