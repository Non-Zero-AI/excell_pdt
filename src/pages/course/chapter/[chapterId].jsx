import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { fetchCourseById } from '../../../services/courseService'
import { hasPurchasedCourse } from '../../../services/purchaseService'
import QuizContainer from '../../../components/Quiz/QuizContainer'
import { formatDuration } from '../../../utils/formatters'
import ReactMarkdown from 'react-markdown'

/**
 * Chapter Viewer Page
 * Displays chapter content and handles quizzes
 */
const ChapterViewer = () => {
  const { courseId, chapterId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [chapter, setChapter] = useState(null)
  const [isPurchased, setIsPurchased] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showQuiz, setShowQuiz] = useState(false)

  useEffect(() => {
    loadChapter()
  }, [courseId, chapterId])

  const loadChapter = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch course
      const { course: fetchedCourse, error: courseError } = await fetchCourseById(courseId)
      
      if (courseError) throw courseError
      if (!fetchedCourse) throw new Error('Course not found')

      setCourse(fetchedCourse)

      // Find chapter
      const foundChapter = fetchedCourse.chapters?.find(
        ch => ch.id === chapterId || ch.slug === chapterId
      )

      if (!foundChapter) {
        throw new Error('Chapter not found')
      }

      setChapter(foundChapter)

      // Check purchase status
      if (user) {
        const { purchased } = await hasPurchasedCourse(user.id, courseId)
        setIsPurchased(purchased)
      }

      // Check if chapter has quiz and should show it
      if (foundChapter.quiz) {
        // Optionally check if user has already passed
        // For now, always show quiz option
      }
    } catch (err) {
      console.error('Error loading chapter:', err)
      setError(err.message || 'Failed to load chapter')
    } finally {
      setLoading(false)
    }
  }

  const handleQuizComplete = (result) => {
    // Update chapter completion status
    // This could trigger progress updates, unlock next chapter, etc.
    console.log('Quiz completed:', result)
    
    if (result.passed) {
      // Mark chapter as completed
      // Update progress
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-muted">Loading chapter...</p>
        </div>
      </div>
    )
  }

  if (error || !course || !chapter) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="card text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || 'Chapter not found'}
          </p>
          <Link to={`/course/${courseId}`} className="btn-primary">
            Back to Course
          </Link>
        </div>
      </div>
    )
  }

  // Check if user has access
  if (!isPurchased && user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Chapter Locked
          </h2>
          <p className="text-muted mb-6">
            Please purchase this course to access chapter content.
          </p>
          <Link to={`/course/${courseId}`} className="btn-primary">
            Purchase Course
          </Link>
        </div>
      </div>
    )
  }

  // Show quiz if available and requested
  if (showQuiz && chapter.quiz) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link
            to={`/course/${courseId}`}
            className="text-primary-600 dark:text-primary-400 hover:underline mb-4 inline-block"
          >
            ← Back to Course
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {chapter.quiz.title || 'Knowledge Check'}
          </h1>
          {chapter.quiz.description && (
            <p className="text-muted mt-2">{chapter.quiz.description}</p>
          )}
        </div>

        <QuizContainer
          quiz={chapter.quiz}
          chapterId={chapter.id}
          courseId={courseId}
          onComplete={handleQuizComplete}
        />
      </div>
    )
  }

  // Show chapter content
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Navigation */}
      <div className="mb-6">
        <Link
          to={`/course/${courseId}`}
          className="text-primary-600 dark:text-primary-400 hover:underline mb-4 inline-block"
        >
          ← Back to Course
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {chapter.title}
            </h1>
            {chapter.duration && (
              <p className="text-muted mt-1">
                Duration: {formatDuration(chapter.duration)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Chapter Content */}
      <div className="card mb-6">
        {chapter.content ? (
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {typeof chapter.content === 'string' && chapter.content.includes('```') ? (
              <ReactMarkdown>{chapter.content}</ReactMarkdown>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted">Chapter content will be displayed here.</p>
            <p className="text-sm text-muted mt-2">
              Content is being prepared or parsed from course materials.
            </p>
          </div>
        )}
      </div>

      {/* Quiz Section */}
      {chapter.quiz && (
        <div className="card bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {chapter.quiz.title || 'Knowledge Check'}
              </h3>
              <p className="text-muted">
                {chapter.quiz.questions?.length || 0} questions • 
                Passing score: {chapter.quiz.passingScore || 70}%
              </p>
            </div>
            <button
              onClick={() => setShowQuiz(true)}
              className="btn-primary"
            >
              Start Quiz
            </button>
          </div>
        </div>
      )}

      {/* Navigation to Next/Previous Chapter */}
      <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => {
            // Navigate to previous chapter
            const currentIndex = course.chapters?.findIndex(ch => ch.id === chapter.id) || 0
            if (currentIndex > 0) {
              const prevChapter = course.chapters[currentIndex - 1]
              navigate(`/course/${courseId}/chapter/${prevChapter.id}`)
            }
          }}
          disabled={!course.chapters || course.chapters.findIndex(ch => ch.id === chapter.id) === 0}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous Chapter
        </button>

        <button
          onClick={() => {
            // Navigate to next chapter
            const currentIndex = course.chapters?.findIndex(ch => ch.id === chapter.id) || 0
            if (currentIndex < (course.chapters?.length || 0) - 1) {
              const nextChapter = course.chapters[currentIndex + 1]
              navigate(`/course/${courseId}/chapter/${nextChapter.id}`)
            } else {
              // Course complete
              navigate(`/course/${courseId}`)
            }
          }}
          className="btn-primary"
        >
          {course.chapters && course.chapters.findIndex(ch => ch.id === chapter.id) < course.chapters.length - 1
            ? 'Next Chapter →'
            : 'Complete Course'
          }
        </button>
      </div>
    </div>
  )
}

export default ChapterViewer

