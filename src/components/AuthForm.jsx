import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const AuthForm = ({ mode = 'login' }) => {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isLogin = mode === 'login'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validation
      if (!formData.email || !formData.password) {
        throw new Error('Please fill in all required fields')
      }

      if (!isLogin && formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match')
      }

      if (!isLogin && formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }

      // Auth action
      let result
      if (isLogin) {
        result = await login(formData.email, formData.password)
      } else {
        result = await register(formData.email, formData.password, {
          first_name: formData.firstName,
          last_name: formData.lastName,
        })
      }

      if (result.success) {
        navigate('/dashboard')
      } else {
        throw new Error(result.error || 'Authentication failed')
      }
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input-field"
                required={!isLogin}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input-field"
                required={!isLogin}
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        {!isLogin && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full btn-primary"
          disabled={loading}
        >
          {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
        </button>

        <div className="text-center">
          <p className="text-sm text-muted">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:underline">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline">
                  Login
                </Link>
              </>
            )}
          </p>
        </div>
      </form>
    </div>
  )
}

export default AuthForm

