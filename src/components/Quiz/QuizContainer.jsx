import { useState, useEffect } from 'react'
import QuizQuestion from './QuizQuestion'
import QuizResults from './QuizResults'
import { submitQuizAttempt } from '../../services/quizService'
import { useAuth } from '../../hooks/useAuth'
import { normalizeQuiz, calculateScore, isQuizPassed } from '../../utils/quizHelpers'

/**
 * QuizContainer Component
 * Manages quiz state and flow
 */
const QuizContainer = ({ 
  quiz, 
  chapterId, 
  courseId,
  onComplete 
}) => {
  const { user } = useAuth()
  const [normalizedQuiz, setNormalizedQuiz] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [quizResult, setQuizResult] = useState(null)

  useEffect(() => {
    // Normalize quiz data
    const normalized = normalizeQuiz(quiz)
    setNormalizedQuiz(normalized)
    // Reset state when quiz changes
    setCurrentQuestionIndex(0)
    setAnswers({})
    setShowResults(false)
    setQuizResult(null)
  }, [quiz?.id])

  if (!normalizedQuiz) {
    return (
      <div className="text-center py-8">
        <p className="text-muted">Loading quiz...</p>
      </div>
    )
  }

  const currentQuestion = normalizedQuiz.questions[currentQuestionIndex]
  const totalQuestions = normalizedQuiz.questions.length
  const answeredCount = Object.keys(answers).length

  const handleAnswer = (questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (answeredCount < totalQuestions) {
      const unanswered = totalQuestions - answeredCount
      if (!confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) {
        return
      }
    }

    setIsSubmitting(true)

    try {
      // Calculate score using helper
      const { score, correctCount, totalQuestions: total } = calculateScore(
        normalizedQuiz.questions,
        answers
      )
      const passed = isQuizPassed(score, normalizedQuiz.passingScore)

      const result = {
        quizId: normalizedQuiz.id,
        chapterId,
        courseId,
        score,
        correctCount,
        totalQuestions: total,
        passed,
        answers,
        completedAt: new Date().toISOString(),
      }

      // Save to database if user is authenticated
      if (user) {
        try {
          await submitQuizAttempt(user.id, result)
        } catch (error) {
          console.error('Failed to save quiz attempt:', error)
          // Continue even if save fails
        }
      }

      setQuizResult(result)
      setShowResults(true)

      // Call completion callback
      if (onComplete) {
        onComplete(result)
      }
    } catch (error) {
      console.error('Quiz submission error:', error)
      alert('Failed to submit quiz. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetake = () => {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setShowResults(false)
    setQuizResult(null)
  }

  if (showResults && quizResult) {
    return (
      <QuizResults
        result={quizResult}
        quiz={normalizedQuiz}
        onRetake={handleRetake}
      />
    )
  }

  return (
    <div className="quiz-container">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress: {answeredCount} / {totalQuestions} answered
          </span>
          <span className="text-sm text-muted">
            {Math.round((answeredCount / totalQuestions) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Question */}
      <QuizQuestion
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        onAnswer={handleAnswer}
        selectedAnswer={answers[currentQuestion.id]}
        disabled={isSubmitting}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0 || isSubmitting}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex items-center space-x-2">
          {normalizedQuiz.questions.map((question, index) => (
            <button
              key={question.id || index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`
                w-8 h-8 rounded-full text-sm font-medium transition-colors
                ${index === currentQuestionIndex
                  ? 'bg-primary-600 text-white'
                  : answers[question.id]
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }
                hover:opacity-80
              `}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestionIndex < totalQuestions - 1 ? (
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        )}
      </div>
    </div>
  )
}

export default QuizContainer

