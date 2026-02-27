import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileManagement.css';

function ProfileView({ username, onEdit, onChangePassword }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      // Call logout endpoint - this saves user data and destroys session
      await fetch('/logout');
      // Clear local storage
      localStorage.removeItem('user');
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      // Still redirect even if there's an error
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const fullNameResponse = await fetch('/user/fullName');
      const dietResponse = await fetch('/user/diet');
      const allergiesResponse = await fetch('/user/allergies');
      const preferencesResponse = await fetch('/user/preferences');

      const profileData = {
        username: username,
        fullName: await fullNameResponse.text() || 'Not set',
        diet: await dietResponse.text() || 'Not set',
        allergies: await allergiesResponse.text() || 'Not set',
        preferences: await preferencesResponse.text() || 'Not set'
      };

      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <div className="error-message">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <div className="profile-actions">
          <button onClick={() => navigate('/recipes')} className="btn-edit">
            Recipes
          </button>
          <button onClick={onEdit} className="btn-edit">
            Edit Profile
          </button>
          <button onClick={onChangePassword} className="btn-password">
            Change Password
          </button>
          <button onClick={handleLogout} className="btn-cancel">
            Logout
          </button>
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-avatar-section">
          <div className="avatar-circle">
            {username.charAt(0).toUpperCase()}
          </div>
          <h2>{username}</h2>
        </div>

        <div className="profile-info">
          <div className="info-row">
            <div className="info-label">
              <span className="icon">👤</span>
              Full Name
            </div>
            <div className="info-value">{profile.fullName}</div>
          </div>

          <div className="info-row">
            <div className="info-label">
              <span className="icon">🍽️</span>
              Dietary Preferences
            </div>
            <div className="info-value">{profile.diet}</div>
          </div>

          <div className="info-row">
            <div className="info-label">
              <span className="icon">⚠️</span>
              Allergies
            </div>
            <div className="info-value">{profile.allergies}</div>
          </div>

          <div className="info-row">
            <div className="info-label">
              <span className="icon">⭐</span>
              Preferences
            </div>
            <div className="info-value">{profile.preferences}</div>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate('/recipes')}
        style={{
          display: 'block',
          width: '100%',
          maxWidth: '480px',
          margin: '2rem auto 0',
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          fontWeight: '600',
          fontFamily: 'inherit',
          color: 'white',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '0.75rem',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
          transition: 'all 0.3s ease',
          letterSpacing: '0.02em',
        }}
        onMouseEnter={(e) => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)'; }}
        onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'; }}
      >
        🍳 Browse Recipes
      </button>
    </div>
  );
}

export default ProfileView;
