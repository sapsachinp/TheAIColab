import { useState } from 'react'
import axios from 'axios'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password
      })

      if (response.data.success) {
        onLogin(response.data.token, response.data.customer)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const demoAccounts = [
    { email: 'ahmed.mansoori@example.com', name: 'Ahmed Al Mansoori' },
    { email: 'fatima.hassan@example.com', name: 'Fatima Hassan' },
    { email: 'mohammed.hashimi@example.com', name: 'Mohammed Al Hashimi' }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dewa-blue to-dewa-dark p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-dewa-green rounded-full flex items-center justify-center">
            <span className="text-white text-4xl font-bold">D</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-dewa-dark mb-2">
          DEWA AI Support
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Humanized Customer Service Platform
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dewa-green focus:border-transparent"
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dewa-green focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-dewa-green hover:bg-green-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Accounts */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3 font-medium">Demo Accounts (password: demo123):</p>
          <div className="space-y-2">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                onClick={() => {
                  setEmail(account.email)
                  setPassword('demo123')
                }}
                className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition"
              >
                <div className="font-medium text-gray-900">{account.name}</div>
                <div className="text-gray-500 text-xs">{account.email}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
