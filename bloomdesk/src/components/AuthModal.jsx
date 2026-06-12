import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function AuthModal({ onClose, initialTab = 'signin' }) {
  const [tab, setTab] = useState(initialTab)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()

  function switchTab(t) {
    setTab(t)
    setError('')
    setSuccess('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      if (tab === 'signin') {
        await signIn(email, password)
        // redirect handled by router via auth state change
      } else {
        await signUp(email, password)
        setSuccess('Check your email to confirm your account, then sign in.')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose} aria-label="Close">×</button>

        <div className="auth-logo">🌿 BloomDesk</div>

        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'signin' ? 'active' : ''}`} onClick={() => switchTab('signin')}>
            Sign In
          </button>
          <button className={`auth-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => switchTab('signup')}>
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="auth-input"
            autoFocus
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            className="auth-input"
          />
          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}
          <button type="submit" className="auth-submit" disabled={loading || !!success}>
            {loading ? '...' : tab === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          {tab === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button className="auth-switch-btn" onClick={() => switchTab(tab === 'signin' ? 'signup' : 'signin')}>
            {tab === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
