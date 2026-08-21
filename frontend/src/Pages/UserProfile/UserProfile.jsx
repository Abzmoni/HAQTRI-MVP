import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../utils/api';
import './UserProfile.css';

export default function UserProfile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('about');
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      const [userRes, listingsRes, postsRes] = await Promise.all([
        API.get(`/users/${id}`),
        API.get(`/listings/user/${id}`),
        API.get(`/posts/user/${id}`)
      ]);

      setUser(userRes.data);
      setListings(listingsRes.data);
      setPosts(postsRes.data);
      
      // Check if current user is following this user
      if (currentUser && userRes.data.followers) {
        setIsFollowing(userRes.data.followers.includes(currentUser._id));
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      await API.post(`/users/${id}/follow`);
      setIsFollowing(!isFollowing);
      // Refresh user data to get updated follower count
      fetchUserProfile();
    } catch (err) {
      console.error('Error following user:', err);
    }
  };

  if (loading) {
    return (
      <div className="user-profile-page">
        <div className="loading-spinner">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-profile-page">
        <div className="error-message">User not found</div>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser._id === user._id;

  return (
    <div className="user-profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-cover">
          <div className="cover-image"></div>
        </div>
        
        <div className="profile-info">
          <div className="profile-avatar">
            {user.profilePic ? (
              <img src={`http://localhost:4000${user.profilePic}`} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">
                <i className="fas fa-user"></i>
              </div>
            )}
          </div>
          
          <div className="profile-details">
            <div className="profile-main">
              <h1>{user.name}</h1>
              {user.isVerified && (
                <span className="verified-badge">
                  <i className="fas fa-check-circle"></i>
                  Verified
                </span>
              )}
            </div>
            
            <p className="profile-bio">{user.bio || 'No bio yet'}</p>
            
            <div className="profile-location">
              <i className="fas fa-map-marker-alt"></i>
              <span>{user.location || 'Location not specified'}</span>
            </div>
            
            <div className="profile-stats">
              <div className="stat">
                <strong>{listings.length}</strong>
                <span>Listings</span>
              </div>
              <div className="stat">
                <strong>{user.followers?.length || 0}</strong>
                <span>Followers</span>
              </div>
              <div className="stat">
                <strong>{user.following?.length || 0}</strong>
                <span>Following</span>
              </div>
              <div className="stat">
                <strong>{posts.length}</strong>
                <span>Posts</span>
              </div>
            </div>
            
            <div className="profile-actions">
              {!isOwnProfile ? (
                <>
                  <button 
                    className={`btn ${isFollowing ? 'btn-outline' : 'btn-primary'}`}
                    onClick={handleFollow}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button className="btn btn-outline">
                    <i className="fas fa-envelope"></i>
                    Message
                  </button>
                </>
              ) : (
                <button 
                  className="btn btn-outline"
                  onClick={() => window.location.href = '/dashboard/profile'}
                >
                  <i className="fas fa-edit"></i>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <i className="fas fa-user"></i>
            About
          </button>
          <button
            className={`tab ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            <i className="fas fa-store"></i>
            Listings ({listings.length})
          </button>
          <button
            className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            <i className="fas fa-feather"></i>
            Posts ({posts.length})
          </button>
          <button
            className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <i className="fas fa-star"></i>
            Reviews
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'about' && (
            <div className="about-section">
              <div className="about-grid">
                <div className="about-card">
                  <h3>Contact Information</h3>
                  <div className="contact-info">
                    {user.email && (
                      <div className="contact-item">
                        <i className="fas fa-envelope"></i>
                        <span>{user.email}</span>
                      </div>
                    )}
                    {user.phone && (
                      <div className="contact-item">
                        <i className="fas fa-phone"></i>
                        <span>{user.phone}</span>
                      </div>
                    )}
                    {user.website && (
                      <div className="contact-item">
                        <i className="fas fa-globe"></i>
                        <a href={user.website} target="_blank" rel="noopener noreferrer">
                          {user.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="about-card">
                  <h3>Social Links</h3>
                  <div className="social-links">
                    {user.socialLinks?.facebook && (
                      <a href={user.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-facebook"></i>
                        Facebook
                      </a>
                    )}
                    {user.socialLinks?.twitter && (
                      <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-twitter"></i>
                        Twitter
                      </a>
                    )}
                    {user.socialLinks?.instagram && (
                      <a href={user.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-instagram"></i>
                        Instagram
                      </a>
                    )}
                    {user.socialLinks?.linkedin && (
                      <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-linkedin"></i>
                        LinkedIn
                      </a>
                    )}
                    {!user.socialLinks?.facebook && !user.socialLinks?.twitter && 
                     !user.socialLinks?.instagram && !user.socialLinks?.linkedin && (
                      <p>No social links added</p>
                    )}
                  </div>
                </div>

                <div className="about-card">
                  <h3>Member Since</h3>
                  <p>{new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="listings-section">
              {listings.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-store"></i>
                  <h3>No listings yet</h3>
                  <p>{isOwnProfile ? 'Create your first listing to get started!' : 'This user hasn\'t created any listings yet.'}</p>
                  {isOwnProfile && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => window.location.href = '/dashboard/marketplace'}
                    >
                      Create Listing
                    </button>
                  )}
                </div>
              ) : (
                <div className="listings-grid">
                  {listings.map(listing => (
                    <div key={listing._id} className="listing-card">
                      <div className="listing-image">
                        {listing.media && listing.media.length > 0 ? (
                          <img 
                            src={`http://localhost:4000${listing.media[0].url}`} 
                            alt={listing.title}
                          />
                        ) : (
                          <div className="placeholder-image">
                            <i className="fas fa-home"></i>
                          </div>
                        )}
                      </div>
                      <div className="listing-info">
                        <h4>{listing.title}</h4>
                        <p className="listing-price">
                          ₦{listing.price.toLocaleString()}
                        </p>
                        <p className="listing-location">
                          <i className="fas fa-map-marker-alt"></i>
                          {listing.location}
                        </p>
                        <div className="listing-meta">
                          <span className={`status ${listing.isAvailable ? 'available' : 'sold'}`}>
                            {listing.isAvailable ? 'Available' : 'Sold'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="posts-section">
              {posts.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-feather"></i>
                  <h3>No posts yet</h3>
                  <p>{isOwnProfile ? 'Share your first post to connect with others!' : 'This user hasn\'t shared any posts yet.'}</p>
                </div>
              ) : (
                <div className="posts-feed">
                  {posts.map(post => (
                    <div key={post._id} className="post-card">
                      <div className="post-header">
                        <div className="post-user">
                          <div className="user-avatar">
                            {user.profilePic ? (
                              <img src={`http://localhost:4000${user.profilePic}`} alt={user.name} />
                            ) : (
                              <i className="fas fa-user"></i>
                            )}
                          </div>
                          <div className="user-info">
                            <div className="user-name">{user.name}</div>
                            <div className="post-time">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {post.text && (
                        <div className="post-content">
                          <p>{post.text}</p>
                        </div>
                      )}
                      
                      {post.media && post.media.length > 0 && (
                        <div className="post-media">
                          {post.media.map((media, index) => (
                            media.type === "image" ? (
                              <img 
                                key={index}
                                src={`http://localhost:4000${media.url}`} 
                                alt="Post content" 
                              />
                            ) : (
                              <video 
                                key={index}
                                controls 
                                src={`http://localhost:4000${media.url}`}
                              />
                            )
                          ))}
                        </div>
                      )}
                      
                      <div className="post-stats">
                        <span>{post.likes?.length || 0} likes</span>
                        <span>{post.comments?.length || 0} comments</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-section">
              <div className="coming-soon">
                <i className="fas fa-star"></i>
                <h3>Reviews Feature Coming Soon</h3>
                <p>User reviews and ratings will be available in a future update.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}