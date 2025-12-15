import { supabase, isSupabaseConfigured } from './supabaseClient'

/**
 * Authentication Service
 * Handles all authentication operations with Supabase
 */

// Sign up with email and password
export const signUp = async (email, password, userData = {}) => {
  if (!isSupabaseConfigured()) {
    // Mock implementation for development
    console.warn('Supabase not configured, using mock auth')
    return {
      user: { id: 'mock-user-id', email },
      session: { access_token: 'mock-token' },
      error: null,
    }
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    })

    if (error) throw error
    return { user: data.user, session: data.session, error: null }
  } catch (error) {
    console.error('Sign up error:', error)
    return { user: null, session: null, error }
  }
}

// Sign in with email and password
export const signIn = async (email, password) => {
  if (!isSupabaseConfigured()) {
    // Mock implementation
    console.warn('Supabase not configured, using mock auth')
    return {
      user: { id: 'mock-user-id', email },
      session: { access_token: 'mock-token' },
      error: null,
    }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return { user: data.user, session: data.session, error: null }
  } catch (error) {
    console.error('Sign in error:', error)
    return { user: null, session: null, error }
  }
}

// Sign out
export const signOut = async () => {
  if (!isSupabaseConfigured()) {
    return { error: null }
  }

  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Sign out error:', error)
    return { error }
  }
}

// Get current user
export const getCurrentUser = async () => {
  if (!isSupabaseConfigured()) {
    return { user: null, error: null }
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return { user, error: null }
  } catch (error) {
    console.error('Get user error:', error)
    return { user: null, error }
  }
}

// Get current session
export const getSession = async () => {
  if (!isSupabaseConfigured()) {
    return { session: null, error: null }
  }

  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return { session, error: null }
  } catch (error) {
    console.error('Get session error:', error)
    return { session: null, error }
  }
}

// Reset password
export const resetPassword = async (email) => {
  if (!isSupabaseConfigured()) {
    return { error: null }
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Reset password error:', error)
    return { error }
  }
}

