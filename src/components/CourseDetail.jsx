import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency, formatDuration } from '../utils/formatters'
import CourseProgress from './CourseProgress'
import PurchaseModal from './PurchaseModal'
import { useAuth } from '../hooks/useAuth'
import { hasPurchasedCourse } from '../services/purchaseService'

const CourseDetailContent = ({ course, loading, error }) => {
  const { user } = useAuth()
  const [isPurchased, setIsPurchased] = useState(false)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [checkingPurchase, setCheckingPurchase] = useState(true)

  useEffect(() => {
    if (user && course) {
      checkPurchaseStatus()
    } else {
      setCheckingPurchase(false)
    }
  }, [user, course])

  const checkPurchaseStatus = async () => {
    if (!user || !course) return
    
    setCheckingPurchase(true)
    const { purchased } = await hasPurchasedCourse(user.id, course.id)
    setIsPurchased(purchased)
    setCheckingPurchase(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-muted">Loading course...</p>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">
            {error || 'Course not found'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <h1 className="section-title">{course.title}</h1>
            <p className="text-muted text-lg mb-4">{course.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
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
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {course.instructor || 'Expert Instructor'}
              </span>
            </div>
          </div>

          {/* Chapters */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Course Chapters
            </h2>
            <div className="space-y-3">
              {course.chapters?.map((chapter, index) => (
                <div
                  key={chapter.id || index}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {chapter.title}
                      </h3>
                      <p className="text-sm text-muted">
                        {formatDuration(chapter.duration)}
                      </p>
                    </div>
                    {isPurchased ? (
                      <Link
                        to={`/course/${course.id}/chapter/${chapter.id}`}
                        className="btn-primary text-sm"
                      >
                        Start
                      </Link>
                    ) : (
                      <span className="text-muted text-sm">Locked</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Purchase Card */}
          <div className="card sticky top-24">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {formatCurrency(course.price)}
              </div>
              <p className="text-muted text-sm">One-time payment</p>
            </div>

            {checkingPurchase ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              </div>
            ) : isPurchased ? (
              <div className="space-y-3">
                <button className="w-full btn-primary">
                  Continue Learning
                </button>
                <p className="text-center text-sm text-green-600 dark:text-green-400">
                  ✓ You own this course
                </p>
              </div>
            ) : (
              <button
                onClick={() => setShowPurchaseModal(true)}
                className="w-full btn-primary"
              >
                Purchase Course
              </button>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                What's included:
              </h3>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Lifetime access
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Certificate of completion
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Expert support
                </li>
              </ul>
            </div>
          </div>

          {/* Progress */}
          {isPurchased && course.progress && (
            <CourseProgress
              progress={course.progress}
              totalChapters={course.chapters?.length || 0}
            />
          )}
        </div>
      </div>

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        course={course}
        onPurchaseComplete={() => {
          setIsPurchased(true)
          setShowPurchaseModal(false)
        }}
      />
    </div>
  )
}

export default CourseDetailContent

