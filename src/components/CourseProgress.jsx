import { formatPercentage } from '../utils/formatters'

const CourseProgress = ({ progress, totalChapters = 0 }) => {
  const completedChapters = progress?.completed_chapters || 0
  const percentage = totalChapters > 0 
    ? Math.round((completedChapters / totalChapters) * 100)
    : 0

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Course Progress
        </h3>
        <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
          {percentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
        <div
          className="bg-primary-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted">Completed</span>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {completedChapters} / {totalChapters}
          </p>
        </div>
        <div>
          <span className="text-muted">Remaining</span>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {totalChapters - completedChapters}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CourseProgress

