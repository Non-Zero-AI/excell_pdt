import { formatPercentage } from '../../utils/formatters'

/**
 * QuizResults Component
 * Displays quiz results and feedback
 */
const QuizResults = ({ result, quiz, onRetake }) => {
  const { score, correctCount, totalQuestions, passed } = result
  const passingScore = quiz.passingScore || 70

  return (
    <div className="quiz-results">
      {/* Results Header */}
      <div className={`
        card mb-6 text-center
        ${passed 
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }
      `}>
        <div className="mb-4">
          {passed ? (
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          {passed ? 'Quiz Passed!' : 'Quiz Not Passed'}
        </h2>
        <p className="text-muted mb-4">
          {passed 
            ? 'Congratulations! You have successfully completed this quiz.'
            : `You need ${passingScore}% to pass. Keep studying and try again!`
          }
        </p>

        {/* Score Display */}
        <div className="mt-6">
          <div className="text-5xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            {formatPercentage(score, 100)}
          </div>
          <p className="text-muted">
            {correctCount} out of {totalQuestions} questions correct
          </p>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Score Breakdown
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted">Correct Answers</span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              {correctCount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Incorrect Answers</span>
            <span className="font-semibold text-red-600 dark:text-red-400">
              {totalQuestions - correctCount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Total Questions</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {totalQuestions}
            </span>
          </div>
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                Final Score
              </span>
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                {score}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {!passed && (
          <button
            onClick={onRetake}
            className="flex-1 btn-primary"
          >
            Retake Quiz
          </button>
        )}
        <button
          onClick={() => window.history.back()}
          className="flex-1 btn-secondary"
        >
          {passed ? 'Continue Learning' : 'Review Material'}
        </button>
      </div>
    </div>
  )
}

export default QuizResults

