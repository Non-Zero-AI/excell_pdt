import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCourseData } from '../hooks/useCourseData'
import CourseCard from '../components/CourseCard'
import { COURSE_STATUS, COURSE_CATEGORIES } from '../utils/constants'
import { fetchPurchasedCourses } from '../services/courseService'
import { useState } from 'react'

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { courses } = useCourseData(COURSE_CATEGORIES.ALL)
  const [purchasedCourses, setPurchasedCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    loadPurchasedCourses()
  }, [isAuthenticated, user])

  const loadPurchasedCourses = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { courses: purchased } = await fetchPurchasedCourses(user.id)
      setPurchasedCourses(purchased)
    } catch (error) {
      console.error('Error loading purchased courses:', error)
    } finally {
      setLoading(false)
    }
  }

  // Create a map of purchased course IDs
  const purchasedCourseIds = new Set(
    purchasedCourses.map(p => p.course_id || p.courses?.id)
  )

  // Get user's courses with status
  const userCourses = courses.map(course => {
    const isPurchased = purchasedCourseIds.has(course.id)
    let status = COURSE_STATUS.LOCKED
    if (isPurchased) {
      // In a real app, check progress to determine if completed
      status = COURSE_STATUS.IN_PROGRESS
    }
    return { ...course, status }
  })

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="section-title">Dashboard</h1>
        <p className="text-muted">
          Welcome back, {user?.email || 'User'}! Continue your learning journey.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="text-sm text-muted mb-1">Total Courses</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {courses.length}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-muted mb-1">Purchased</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {purchasedCourses.length}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-muted mb-1">In Progress</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {userCourses.filter(c => c.status === COURSE_STATUS.IN_PROGRESS).length}
          </div>
        </div>
      </div>

      {/* My Courses */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            My Courses
          </h2>
          <Link to="/courses" className="text-primary-600 dark:text-primary-400 hover:underline">
            Browse All →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : userCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCourses.map((course) => (
              <CourseCard key={course.id} course={course} status={course.status} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-muted mb-4">You haven't purchased any courses yet.</p>
            <Link to="/courses" className="btn-primary">
              Browse Courses
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/courses"
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Browse Courses
            </h3>
            <p className="text-sm text-muted">
              Explore our catalog of professional driver training courses
            </p>
          </Link>
          <Link
            to="/certification"
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              View Certifications
            </h3>
            <p className="text-sm text-muted">
              See your completed courses and download certificates
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

