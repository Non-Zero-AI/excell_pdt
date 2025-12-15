import { useState } from 'react'
import clsx from 'clsx'

/**
 * QuizQuestion Component
 * Displays a single quiz question with answer options
 */
const QuizQuestion = ({ 
  question, 
  questionNumber, 
  totalQuestions,
  onAnswer,
  selectedAnswer = null,
  showResult = false,
  disabled = false
}) => {
  const [localSelected, setLocalSelected] = useState(selectedAnswer)

  const handleSelect = (answerId) => {
    if (disabled || showResult) return
    
    setLocalSelected(answerId)
    onAnswer(question.id, answerId)
  }

  const isCorrect = (answerId) => {
    return answerId === question.correctAnswer
  }

  const getAnswerClass = (answerId) => {
    if (!showResult) {
      return clsx(
        'p-4 border-2 rounded-lg cursor-pointer transition-all',
        localSelected === answerId
          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
      )
    }

    // Show results
    if (isCorrect(answerId)) {
      return 'p-4 border-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-lg'
    }
    
    if (localSelected === answerId && !isCorrect(answerId)) {
      return 'p-4 border-2 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg'
    }

    return 'p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg opacity-60'
  }

  return (
    <div className="card mb-6">
      {/* Question Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
            Question {questionNumber} of {totalQuestions}
          </span>
          {showResult && (
            <span className={clsx(
              'text-sm font-semibold px-3 py-1 rounded-full',
              isCorrect(localSelected)
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            )}>
              {isCorrect(localSelected) ? 'Correct' : 'Incorrect'}
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {question.question}
        </h3>
        {question.explanation && showResult && (
          <p className="mt-2 text-sm text-muted italic">
            {question.explanation}
          </p>
        )}
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {question.answers.map((answer, index) => (
          <div
            key={answer.id || index}
            onClick={() => handleSelect(answer.id || index)}
            className={getAnswerClass(answer.id || index)}
          >
            <div className="flex items-start">
              <div className={clsx(
                'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 mt-0.5',
                showResult && isCorrect(answer.id || index)
                  ? 'border-green-500 bg-green-500'
                  : localSelected === (answer.id || index) && !showResult
                  ? 'border-primary-600 bg-primary-600'
                  : localSelected === (answer.id || index) && showResult && !isCorrect(answer.id || index)
                  ? 'border-red-500 bg-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              )}>
                {showResult && isCorrect(answer.id || index) && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {localSelected === (answer.id || index) && !showResult && (
                  <div className="w-3 h-3 rounded-full bg-white" />
                )}
                {localSelected === (answer.id || index) && showResult && !isCorrect(answer.id || index) && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className="text-gray-900 dark:text-gray-100">
                  {answer.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuizQuestion

