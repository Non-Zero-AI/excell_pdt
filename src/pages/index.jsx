import { Link } from 'react-router-dom'
import { useCourseData } from '../hooks/useCourseData'
import CourseCard from '../components/CourseCard'
import { COURSE_CATEGORIES } from '../utils/constants'

const HERO_VIDEO_EMBED_URL = import.meta.env.VITE_HERO_VIDEO_URL || 
  'https://player.cloudinary.com/embed/?cloud_name=dlwugvvn0&public_id=vecteezy_cargo-truck-with-cargo-trailer-is-driving-on-the-highway_47880046_yuvgyf&profile=Truck%20on%20Highway&title=false&description=false&autoplay=true&muted=true&loop=true&controls=false&hide_context_menu=true&source_types[0]=hls'

const Home = () => {
  const { courses, loading } = useCourseData(COURSE_CATEGORIES.ALL)

  const featuredCourses = courses && courses.length > 0 ? courses.slice(0, 3) : []

  // Use video embed if available, otherwise fallback to blue gradient
  const useVideoBackground = !!HERO_VIDEO_EMBED_URL

  // Debug logging
  if (useVideoBackground) {
    console.log('Hero video URL:', HERO_VIDEO_EMBED_URL)
  } else {
    console.log('No video URL found, using gradient fallback')
  }

  return (
    <div>
      {/* Hero Section with optional video background */}
      <section
        className={`relative text-white min-h-[500px] ${
          useVideoBackground ? '' : 'bg-gradient-to-br from-primary-600 to-primary-800'
        }`}
      >
        {/* Video background iframe (when provided) */}
        {useVideoBackground && (
          <>
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <iframe
                src={HERO_VIDEO_EMBED_URL}
                className="absolute top-0 left-0 w-full h-full"
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '100%',
                  border: 'none',
                  pointerEvents: 'none'
                }}
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                allowFullScreen={true}
                frameBorder="0"
                title="Hero background video"
                onLoad={() => {
                  console.log('✅ Hero video iframe loaded successfully')
                }}
                onError={(e) => {
                  console.error('❌ Hero video iframe failed to load:', e)
                }}
              />
            </div>
            <div className="absolute inset-0 bg-black/40 -z-[5]" />
          </>
        )}

        {/* Content overlay */}
        <div
          className={`relative py-20 sm:py-24 md:py-28 ${
            useVideoBackground ? 'bg-gradient-to-b from-black/60 via-black/30 to-black/60' : ''
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
                Professional Driver Training
              </h1>
              <p className="text-lg md:text-xl mb-8 text-sky-100 max-w-2xl mx-auto drop-shadow">
                Advance your career with industry-leading certification courses
                for commercial and passenger drivers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/courses"
                  className="btn-primary bg-white/95 text-primary-700 hover:bg-white shadow-lg shadow-black/30"
                >
                  Browse Courses
                </Link>
                <Link
                  to="/register"
                  className="btn-secondary bg-primary-700/95 text-white hover:bg-primary-600 border-primary-400 shadow-lg shadow-black/30"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert-Led Courses</h3>
              <p className="text-muted">
                Learn from industry professionals with years of real-world experience.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Certification</h3>
              <p className="text-muted">
                Earn recognized certificates to advance your career and credentials.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Self-Paced Learning</h3>
              <p className="text-muted">
                Study at your own pace with lifetime access to all course materials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Featured Courses</h2>
            <Link to="/courses" className="text-primary-600 dark:text-primary-400 hover:underline">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home

