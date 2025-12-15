import { supabase, isSupabaseConfigured } from './supabaseClient'

/**
 * Purchase Service
 * Handles course purchase operations
 */

// Create a purchase
export const createPurchase = async (userId, courseId, paymentData = {}) => {
  if (!isSupabaseConfigured()) {
    // Mock implementation
    console.warn('Supabase not configured, using mock purchase')
    return {
      purchase: {
        id: `purchase-${Date.now()}`,
        user_id: userId,
        course_id: courseId,
        status: 'completed',
        amount: paymentData.amount || 0,
        created_at: new Date().toISOString(),
      },
      error: null,
    }
  }

  try {
    const { data, error } = await supabase
      .from('purchases')
      .insert({
        user_id: userId,
        course_id: courseId,
        amount: paymentData.amount || 0,
        payment_method: paymentData.method || 'card',
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error

    // In a real implementation, you would integrate with a payment processor here
    // For now, we'll mark it as completed immediately
    const { data: updatedPurchase, error: updateError } = await supabase
      .from('purchases')
      .update({ status: 'completed' })
      .eq('id', data.id)
      .select()
      .single()

    if (updateError) throw updateError

    return { purchase: updatedPurchase, error: null }
  } catch (error) {
    console.error('Create purchase error:', error)
    return { purchase: null, error }
  }
}

// Check if user has purchased a course
export const hasPurchasedCourse = async (userId, courseId) => {
  if (!isSupabaseConfigured()) {
    // Mock: return false for development
    return { purchased: false, error: null }
  }

  try {
    const { data, error } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .eq('status', 'completed')
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
    return { purchased: !!data, error: null }
  } catch (error) {
    console.error('Check purchase error:', error)
    return { purchased: false, error }
  }
}

// Fetch purchase history
export const fetchPurchaseHistory = async (userId) => {
  if (!isSupabaseConfigured()) {
    return { purchases: [], error: null }
  }

  try {
    const { data, error } = await supabase
      .from('purchases')
      .select('*, courses(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { purchases: data || [], error: null }
  } catch (error) {
    console.error('Fetch purchase history error:', error)
    return { purchases: [], error }
  }
}

