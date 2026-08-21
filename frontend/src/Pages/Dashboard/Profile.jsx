import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../utils/api';
import './Profile.css';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    }
  });
  const [profilePic, setProfilePic] = useState(null);
  const [verificationDocuments, setVerificationDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        socialLinks: user.socialLinks || {
          facebook: '',
          twitter: '',
          instagram: '',
          linkedin: ''
        }
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.socialLinks) {
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleProfilePicChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleVerificationDocsChange = (e) => {
    setVerificationDocuments([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const submitData = new FormData();
    
    // Append profile data
    Object.keys(formData).forEach(key => {
      if (key === 'socialLinks') {
        submitData.append(key, JSON.stringify(formData[key]));
      } else {
        submitData.append(key, formData[key]);
      }
    });

    if (profilePic) {
      submitData.append('profilePic', profilePic);
    }

    try {
      const result = await updateProfile(submitData);
      if (result.success) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage(result.message);
      }
    } catch (err) {
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (verificationDocuments.length === 0) {
      setMessage('Please select at least one document');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    verificationDocuments.forEach(file => {
      formData.append('documents', file);
    });
    formData.append('documentType', 'identity');

    try {
      const res = await API.post('/users/verification', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Verification documents submitted successfully!');
      setVerificationDocuments([]);
    } catch (err) {
      setMessage('Error submitting verification documents');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-cover">
          <div className="cover-image"></div>
          <div className="profile-info">
            <div className="profile-avatar">
              {user.profilePic ? (
                <img src={`http://localhost:4000${user.profilePic}`} alt={user.name} />
              ) : (
                <div className="avatar-placeholder">
                  <i className="fas fa-user"></i>
                </div>
              )}
              <label htmlFor="profile-pic-upload" className="avatar-upload">
                <i className="fas fa-camera"></i>
                <input
                  id="profile-pic-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                />
              </label>
            </div>
            <div className="profile-details">
              <h1>{user.name}</h1>
              <p className="profile-bio">{user.bio || 'No bio yet'}</p>
              <div className="profile-stats">
                <div className="stat">
                  <strong>{user.followers?.length || 0}</strong>
                  <span>Followers</span>
                </div>
                <div className="stat">
                  <strong>{user.following?.length || 0}</strong>
                  <span>Following</span>
                </div>
                <div className="stat">
                  <strong>{user.listingsCount || 0}</strong>
                  <span>Listings</span>
                </div>
              </div>
              <div className="verification-status">
                {user.isVerified ? (
                  <span className="verified-badge">
                    <i className="fas fa-check-circle"></i>
                    Verified Account
                  </span>
                ) : (
                  <span className="not-verified-badge">
                    <i className="fas fa-clock"></i>
                    Verification Pending
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fas fa-user"></i>
            Profile
          </button>
          <button
            className={`tab ${activeTab === 'verification' ? 'active' : ''}`}
            onClick={() => setActiveTab('verification')}
          >
            <i className="fas fa-shield-alt"></i>
            Verification
          </button>
          <button
            className={`tab ${activeTab === 'social' ? 'active' : ''}`}
            onClick={() => setActiveTab('social')}
          >
            <i className="fas fa-share-alt"></i>
            Social Links
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'profile' && (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Tell us about yourself..."
                    maxLength="500"
                  />
                  <div className="char-count">{formData.bio.length}/500</div>
                </div>
                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />
                </div>
              </div>

              {message && <div className="form-message">{message}</div>}

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          )}

          {activeTab === 'verification' && (
            <div className="verification-tab">
              <div className="verification-info">
                <h3>Account Verification</h3>
                <p>
                  Verify your account to unlock all features including creating listings, 
                  going live, and accessing premium tools.
                </p>
                
                <div className="verification-status-card">
                  <div className="status-header">
                    <h4>Current Status</h4>
                    <span className={`status-badge ${user.verificationStatus}`}>
                      {user.verificationStatus?.toUpperCase() || 'NOT SUBMITTED'}
                    </span>
                  </div>
                  
                  {user.verificationStatus === 'pending' && (
                    <div className="status-message">
                      <i className="fas fa-clock"></i>
                      Your verification documents are under review. This usually takes 24-48 hours.
                    </div>
                  )}
                  
                  {user.verificationStatus === 'approved' && (
                    <div className="status-message success">
                      <i className="fas fa-check-circle"></i>
                      Your account has been verified! You now have access to all features.
                    </div>
                  )}
                  
                  {user.verificationStatus === 'rejected' && (
                    <div className="status-message error">
                      <i className="fas fa-times-circle"></i>
                      Your verification was rejected. Please submit new documents.
                    </div>
                  )}
                </div>

                {(user.verificationStatus !== 'approved') && (
                  <form onSubmit={handleVerificationSubmit} className="verification-form">
                    <div className="form-group">
                      <label>Upload Verification Documents</label>
                      <p className="form-hint">
                        Please upload clear photos of any government-issued ID (Driver's license, 
                        International passport, National ID card). Maximum 5 files.
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={handleVerificationDocsChange}
                        className="file-input"
                      />
                      <div className="file-list">
                        {verificationDocuments.map((file, index) => (
                          <div key={index} className="file-item">
                            <i className="fas fa-file"></i>
                            <span>{file.name}</span>
                            <button
                              type="button"
                              onClick={() => setVerificationDocuments(
                                verificationDocuments.filter((_, i) => i !== index)
                              )}
                              className="remove-file"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {message && <div className="form-message">{message}</div>}

                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={loading || verificationDocuments.length === 0}
                    >
                      {loading ? 'Submitting...' : 'Submit for Verification'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <form onSubmit={handleSubmit} className="social-form">
              <div className="form-grid">
                <div className="form-group">
                  <label><i className="fab fa-facebook"></i> Facebook</label>
                  <input
                    type="url"
                    name="facebook"
                    value={formData.socialLinks.facebook}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/username"
                  />
                </div>
                <div className="form-group">
                  <label><i className="fab fa-twitter"></i> Twitter</label>
                  <input
                    type="url"
                    name="twitter"
                    value={formData.socialLinks.twitter}
                    onChange={handleInputChange}
                    placeholder="https://twitter.com/username"
                  />
                </div>
                <div className="form-group">
                  <label><i className="fab fa-instagram"></i> Instagram</label>
                  <input
                    type="url"
                    name="instagram"
                    value={formData.socialLinks.instagram}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/username"
                  />
                </div>
                <div className="form-group">
                  <label><i className="fab fa-linkedin"></i> LinkedIn</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.socialLinks.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              {message && <div className="form-message">{message}</div>}

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Social Links'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}