import { createContext, useContext, useState, useEffect } from 'react'
import { signIn, signUp, signOut, getCurrentUser, getSession } from '../services/authService'
import { STORAGE_KEYS } from '../utils/constants'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  // Initialize auth state
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      const { user: currentUser } = await getCurrentUser()
      const { session: currentSession } = await getSession()
      
      setUser(currentUser)
      setSession(currentSession)
      
      // Store in localStorage for persistence
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(currentUser))
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { user: loggedInUser, session: newSession, error } = await signIn(email, password)
      
      if (error) {
        throw error
      }
      
      setUser(loggedInUser)
      setSession(newSession)
      
      if (loggedInUser) {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(loggedInUser))
      }
      
      return { success: true, error: null }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message || 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  const register = async (email, password, userData = {}) => {
    setLoading(true)
    try {
      const { user: newUser, session: newSession, error } = await signUp(email, password, userData)
      
      if (error) {
        throw error
      }
      
      setUser(newUser)
      setSession(newSession)
      
      if (newUser) {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(newUser))
      }
      
      return { success: true, error: null }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: error.message || 'Registration failed' }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      const { error } = await signOut()
      
      if (error) {
        throw error
      }
      
      setUser(null)
      setSession(null)
      localStorage.removeItem(STORAGE_KEYS.USER_DATA)
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      
      return { success: true, error: null }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: error.message || 'Logout failed' }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    session,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

