import { useState } from 'react'
import { useCourseData } from '../hooks/useCourseData'
import CourseCard from '../components/CourseCard'
import { COURSE_CATEGORIES, COURSE_STATUS } from '../utils/constants'

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState(COURSE_CATEGORIES.ALL)
  const { courses, loading } = useCourseData(selectedCategory)

  const categories = [
    { value: COURSE_CATEGORIES.ALL, label: 'All Courses' },
    { value: COURSE_CATEGORIES.COMMERCIAL, label: 'Commercial' },
    { value: COURSE_CATEGORIES.PASSENGER, label: 'Passenger' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="section-title">Course Catalog</h1>
        <p className="text-muted text-lg">
          Choose from our comprehensive selection of professional driver training courses
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-muted">Loading courses...</p>
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} status={COURSE_STATUS.LOCKED} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-muted">No courses found in this category.</p>
        </div>
      )}
    </div>
  )
}

export default Courses

