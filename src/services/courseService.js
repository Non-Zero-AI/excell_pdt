import { supabase, isSupabaseConfigured } from './supabaseClient'
import { mockCourses } from '../utils/mockData'

/**
 * Course Service
 * Handles all course-related operations
 */

// Fetch all courses
export const fetchCourses = async (category = 'all') => {
  if (!isSupabaseConfigured()) {
    // Return mock data for development
    console.warn('Supabase not configured, using mock courses')
    if (category === 'all') return mockCourses
    return mockCourses.filter(course => course.category === category)
  }

  try {
    let query = supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })

    if (category !== 'all') {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) throw error
    return { courses: data || [], error: null }
  } catch (error) {
    console.error('Fetch courses error:', error)
    return { courses: [], error }
  }
}

// Fetch single course by ID
export const fetchCourseById = async (courseId) => {
  if (!isSupabaseConfigured()) {
    // Return mock data
    const course = mockCourses.find(c => c.id === courseId)
    return { course: course || null, error: course ? null : new Error('Course not found') }
  }

  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*, chapters(*)')
      .eq('id', courseId)
      .single()

    if (error) throw error
    return { course: data, error: null }
  } catch (error) {
    console.error('Fetch course error:', error)
    return { course: null, error }
  }
}

// Fetch user's course progress
export const fetchCourseProgress = async (userId, courseId) => {
  if (!isSupabaseConfigured()) {
    return { progress: null, error: null }
  }

  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
    return { progress: data, error: null }
  } catch (error) {
    console.error('Fetch progress error:', error)
    return { progress: null, error }
  }
}

// Update course progress
export const updateCourseProgress = async (userId, courseId, progressData) => {
  if (!isSupabaseConfigured()) {
    return { progress: null, error: null }
  }

  try {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        course_id: courseId,
        ...progressData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return { progress: data, error: null }
  } catch (error) {
    console.error('Update progress error:', error)
    return { progress: null, error }
  }
}

// Fetch user's purchased courses
export const fetchPurchasedCourses = async (userId) => {
  if (!isSupabaseConfigured()) {
    return { courses: [], error: null }
  }

  try {
    const { data, error } = await supabase
      .from('purchases')
      .select('*, courses(*)')
      .eq('user_id', userId)
      .eq('status', 'completed')

    if (error) throw error
    return { courses: data || [], error: null }
  } catch (error) {
    console.error('Fetch purchased courses error:', error)
    return { courses: [], error }
  }
}

