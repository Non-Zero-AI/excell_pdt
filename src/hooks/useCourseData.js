import { useState, useEffect } from 'react'
import { fetchCourses, fetchCourseById, fetchCourseProgress } from '../services/courseService'
import { useAuth } from './useAuth'

/**
 * Hook for managing course data
 */
export const useCourseData = (category = 'all') => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCourses()
  }, [category])

  const loadCourses = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchCourses(category)
      
      // Handle both old format (array) and new format (object)
      if (Array.isArray(result)) {
        setCourses(result)
      } else if (result && result.courses) {
        if (result.error) {
          throw result.error
        }
        setCourses(result.courses || [])
      } else {
        setCourses([])
      }
    } catch (err) {
      console.error('Error loading courses:', err)
      setError(err.message || 'Failed to load courses')
      setCourses([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  return { courses, loading, error, refetch: loadCourses }
}

/**
 * Hook for managing a single course
 */
export const useCourse = (courseId) => {
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    if (courseId) {
      loadCourse()
    }
  }, [courseId])

  const loadCourse = async () => {
    setLoading(true)
    setError(null)
    try {
      const { course: fetchedCourse, error: fetchError } = await fetchCourseById(courseId)
      
      if (fetchError) {
        throw fetchError
      }
      
      setCourse(fetchedCourse)
      
      // Load progress if user is authenticated
      if (user && fetchedCourse) {
        const { progress } = await fetchCourseProgress(user.id, courseId)
        if (progress) {
          setCourse(prev => ({ ...prev, progress }))
        }
      }
    } catch (err) {
      console.error('Error loading course:', err)
      setError(err.message || 'Failed to load course')
    } finally {
      setLoading(false)
    }
  }

  return { course, loading, error, refetch: loadCourse }
}

