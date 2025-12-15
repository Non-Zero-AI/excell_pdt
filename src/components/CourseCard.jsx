import { Link } from 'react-router-dom'
import { formatCurrency, formatDuration, truncateText } from '../utils/formatters'
import { COURSE_STATUS } from '../utils/constants'

const CourseCard = ({ course, status = COURSE_STATUS.LOCKED }) => {
  const isLocked = status === COURSE_STATUS.LOCKED
  const isCompleted = status === COURSE_STATUS.COMPLETED
  const isInProgress = status === COURSE_STATUS.IN_PROGRESS

  return (
    <Link to={`/course/${course.id}`} className="block">
      <div className="course-card">
        {/* Thumbnail */}
        <div className="relative w-full h-48 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg mb-4 overflow-hidden">
          {isLocked && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          )}
          {isCompleted && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Completed
            </div>
          )}
          {isInProgress && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              In Progress
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {course.title}
          </h3>
          <p className="text-muted text-sm mb-4 line-clamp-2">
            {truncateText(course.description, 100)}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-muted mb-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDuration(course.duration)}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {course.chapters?.length || 0} Chapters
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {formatCurrency(course.price)}
            </span>
            {!isLocked && (
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                ✓ Purchased
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CourseCard

