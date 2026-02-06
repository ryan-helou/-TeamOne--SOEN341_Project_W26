import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './ProfileManagement.css'

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Check passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // POST to /register
    const res = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    const data = await res.json()

    if (data.success) {
      navigate('/login', { state: { message: 'Account created successfully!' } })
    } else {
      setError(data.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Create Account</h1>
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
          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {/* Error */}
          {error && <div className="error-message">{error}</div>}
          {/* Submit */}
          <button type="submit" className="btn-save">Register</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
