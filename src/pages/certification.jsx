import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { fetchPurchasedCourses } from '../services/courseService'
import { formatDate } from '../utils/formatters'

const Certification = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [certifications, setCertifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    loadCertifications()
  }, [isAuthenticated, user])

  const loadCertifications = async () => {
    if (!user) return

    setLoading(true)
    try {
      // In a real app, fetch completed courses with certificates
      const { courses: purchased } = await fetchPurchasedCourses(user.id)
      
      // Mock: treat all purchased courses as completed for demo
      // In production, check actual completion status
      const completed = purchased.map(p => ({
        id: p.course_id || p.courses?.id,
        title: p.courses?.title || 'Course',
        completedAt: p.created_at || new Date().toISOString(),
        certificateUrl: null, // Will be generated when course is completed
      }))

      setCertifications(completed)
    } catch (error) {
      console.error('Error loading certifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadCertificate = (certId) => {
    // TODO: Implement certificate download
    console.log('Download certificate:', certId)
    alert('Certificate download will be available once course is completed.')
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="section-title">My Certifications</h1>
        <p className="text-muted text-lg">
          View and download your course completion certificates
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-muted">Loading certifications...</p>
        </div>
      ) : certifications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <div key={cert.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-primary-600 dark:text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                  Completed
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {cert.title}
              </h3>
              <p className="text-sm text-muted mb-4">
                Completed on {formatDate(cert.completedAt)}
              </p>

              <button
                onClick={() => handleDownloadCertificate(cert.id)}
                className="w-full btn-primary"
              >
                Download Certificate
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Certifications Yet
          </h3>
          <p className="text-muted mb-6">
            Complete courses to earn certificates and advance your career.
          </p>
          <a href="/courses" className="btn-primary">
            Browse Courses
          </a>
        </div>
      )}
    </div>
  )
}

export default Certification

