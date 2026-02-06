import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import './ProfileManagement.css'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const successMessage = location.state?.message

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // POST to /login
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    const data = await res.json()

    if (data.success) {
      // Store user info if needed
      localStorage.setItem('user', JSON.stringify({ username }))
      navigate('/profile')
    } else {
      // Show specific error message from server
      setError(data.message || 'Login failed. Please try again.')
    }
  }

  const handleForgotPassword = () => {
    // Does nothing for now
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className="profile-form">
          {/* Username */}
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {/* Success Message */}
          {successMessage && <div className="success-message">{successMessage}</div>}
          {/* Error */}
          {error && <div className="error-message">{error}</div>}
          {/* Submit */}
          <button type="submit" className="btn-save">Login</button>
          {/* Sign Up */}
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <button type="button" className="btn-edit" style={{ width: '100%' }}>Sign Up</button>
          </Link>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            type="button"
            onClick={handleForgotPassword}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.95rem'
            }}
          >
            Forgot Password?
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
