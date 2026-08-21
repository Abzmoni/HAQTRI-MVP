// src/components/Marketplace/ListingDetail/ListingDetail.jsx
import React, { useState } from "react";
import API from "../../../utils/api";
import "./ListingDetail.css";

export default function ListingDetail({ listing, onClose, onUpdate }) {
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  if (!listing) return null;

  const handleLike = async () => {
    try {
      setLoading(true);
      await API.post(`/listings/${listing._id}/like`);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Error liking listing:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  const getCategoryLabel = () => {
    switch (listing.category) {
      case "property": return "Property";
      case "materials": return "Materials";
      case "labour": return "Labour & Services";
      default: return listing.category;
    }
  };

  return (
    <div className="listing-detail-overlay">
      <div className="listing-detail">
        <button className="close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="detail-content">
          <div className="detail-images">
            <div className="main-image">
              {listing.media && listing.media.length > 0 ? (
                <img 
                  src={`http://localhost:4000${listing.media[activeImage].url}`} 
                  alt={listing.title}
                />
              ) : (
                <div className="placeholder-image">
                  <i className="fas fa-home"></i>
                </div>
              )}
            </div>

            {listing.media && listing.media.length > 1 && (
              <div className="image-thumbnails">
                {listing.media.map((media, index) => (
                  <div 
                    key={index}
                    className={`thumbnail ${index === activeImage ? 'active' : ''}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img 
                      src={`http://localhost:4000${media.url}`} 
                      alt={`${listing.title} ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="detail-info">
            <div className="detail-header">
              <div className="category-badge">
                {getCategoryLabel()}
              </div>
              
              <button 
                className={`like-btn ${listing.likes?.includes(localStorage.userId) ? 'liked' : ''}`}
                onClick={handleLike}
                disabled={loading}
              >
                <i className="fas fa-heart"></i>
                <span>{listing.likes?.length || 0}</span>
              </button>
            </div>

            <h1>{listing.title}</h1>
            
            <div className="price-section">
              <div className="price">{formatPrice(listing.price)}</div>
              {listing.category === "labour" && <span>per service</span>}
            </div>

            <div className="location-section">
              <i className="fas fa-map-marker-alt"></i>
              <span>{listing.location}</span>
            </div>

            <div className="description-section">
              <h3>Description</h3>
              <p>{listing.description}</p>
            </div>

            {listing.specifications && Object.keys(listing.specifications).length > 0 && (
              <div className="specifications-section">
                <h3>Specifications</h3>
                <div className="specs-grid">
                  {Object.entries(listing.specifications).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <span className="spec-label">{key}:</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="seller-section">
              <h3>Seller Information</h3>
              <div className="seller-info">
                <div className="seller-avatar">
                  {listing.user?.profilePic ? (
                    <img 
                      src={`http://localhost:4000${listing.user.profilePic}`} 
                      alt={listing.user.name}
                    />
                  ) : (
                    <i className="fas fa-user"></i>
                  )}
                </div>
                <div className="seller-details">
                  <div className="seller-name">{listing.user?.name || "Unknown Seller"}</div>
                  <div className="seller-joined">
                    Member since {new Date(listing.user?.createdAt).getFullYear()}
                  </div>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              {!contactVisible ? (
                <button 
                  className="btn btn-primary contact-btn"
                  onClick={() => setContactVisible(true)}
                >
                  Contact Seller
                </button>
              ) : (
                <div className="contact-info">
                  <h4>Contact Information</h4>
                  <div className="contact-details">
                    {listing.contactInfo?.phone && (
                      <div className="contact-item">
                        <i className="fas fa-phone"></i>
                        <span>{listing.contactInfo.phone}</span>
                      </div>
                    )}
                    
                    {listing.contactInfo?.email && (
                      <div className="contact-item">
                        <i className="fas fa-envelope"></i>
                        <span>{listing.contactInfo.email}</span>
                      </div>
                    )}
                    
                    {listing.contactInfo?.address && (
                      <div className="contact-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{listing.contactInfo.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <button className="btn btn-outline">
                Save Listing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}