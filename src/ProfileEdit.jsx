import { useState, useEffect } from 'react';
import './ProfileManagement.css';

function ProfileEdit({ username, onCancel, onSaveSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    diet: '',
    allergies: '',
    preferences: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const fullNameResponse = await fetch('/user/fullName');
      const dietResponse = await fetch('/user/diet');
      const allergiesResponse = await fetch('/user/allergies');
      const preferencesResponse = await fetch('/user/preferences');

      setFormData({
        fullName: await fullNameResponse.text() || '',
        diet: await dietResponse.text() || '',
        allergies: await allergiesResponse.text() || '',
        preferences: await preferencesResponse.text() || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Profile updated successfully!');
        setTimeout(() => {
          onSaveSuccess();
        }, 1500);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Edit Profile</h1>
      </div>

      <div className="profile-card">
        <form onSubmit={handleSubmit} className="profile-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-section">
            <h3>Personal Information</h3>
            
            <div className="form-group">
              <label htmlFor="fullName">
                <span className="icon">👤</span>
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={saving}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Dietary Information</h3>

            <div className="form-group">
              <label htmlFor="diet">
                <span className="icon">🍽️</span>
                Dietary Preferences
              </label>
              <textarea
                id="diet"
                name="diet"
                value={formData.diet}
                onChange={handleChange}
                placeholder="e.g., Vegetarian, Vegan, Pescatarian, No restrictions"
                rows="3"
                disabled={saving}
              />
              <small className="form-hint">
                Describe your dietary preferences or restrictions
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="allergies">
                <span className="icon">⚠️</span>
                Allergies
              </label>
              <textarea
                id="allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="e.g., Peanuts, Shellfish, Dairy, Gluten"
                rows="3"
                disabled={saving}
              />
              <small className="form-hint">
                List any food allergies or intolerances
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="preferences">
                <span className="icon">⭐</span>
                Additional Preferences
              </label>
              <textarea
                id="preferences"
                name="preferences"
                value={formData.preferences}
                onChange={handleChange}
                placeholder="e.g., Budget-conscious, Quick meals, Meal prep friendly"
                rows="3"
                disabled={saving}
              />
              <small className="form-hint">
                Any other preferences for meal planning
              </small>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={onCancel} 
              className="btn-cancel"
              disabled={saving}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-save"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileEdit;
