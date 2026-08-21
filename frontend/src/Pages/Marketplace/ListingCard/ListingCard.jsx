// src/components/Marketplace/ListingCard/ListingCard.jsx
import React, { useState } from "react";
import API from "../../../utils/api";
import "./ListingCard.css";

export default function ListingCard({ listing, onUpdate }) {
  const [loading, setLoading] = useState(false);

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

  const getCategoryIcon = () => {
    switch (listing.category) {
      case "property": return "fas fa-home";
      case "materials": return "fas fa-box";
      case "labour": return "fas fa-tools";
      default: return "fas fa-tag";
    }
  };

  return (
    <div className="listing-card">
      <div className="listing-image">
        {listing.media && listing.media.length > 0 ? (
          <img 
            src={`http://localhost:4000${listing.media[0].url}`} 
            alt={listing.title}
          />
        ) : (
          <div className="placeholder-image">
            <i className={getCategoryIcon()}></i>
          </div>
        )}
        
        {listing.isVerified && (
          <div className="verified-badge">
            <i className="fas fa-check-circle"></i>
            <span>Verified</span>
          </div>
        )}
        
        <button 
          className={`like-btn ${listing.likes?.includes(localStorage.userId) ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={loading}
        >
          <i className="fas fa-heart"></i>
        </button>
      </div>

      <div className="listing-info">
        <div className="listing-category">
          <i className={getCategoryIcon()}></i>
          <span>{listing.category}</span>
        </div>

        <h3 className="listing-title">{listing.title}</h3>
        
        <p className="listing-description">{listing.description}</p>
        
        <div className="listing-meta">
          <div className="meta-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>{listing.location}</span>
          </div>
          
          {listing.specifications && (
            <>
              {listing.specifications.bedrooms && (
                <div className="meta-item">
                  <i className="fas fa-bed"></i>
                  <span>{listing.specifications.bedrooms} beds</span>
                </div>
              )}
              
              {listing.specifications.bathrooms && (
                <div className="meta-item">
                  <i className="fas fa-bath"></i>
                  <span>{listing.specifications.bathrooms} baths</span>
                </div>
              )}
              
              {listing.specifications.area && (
                <div className="meta-item">
                  <i className="fas fa-ruler-combined"></i>
                  <span>{listing.specifications.area} sqm</span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="listing-footer">
          <div className="listing-price">
            {formatPrice(listing.price)}
            {listing.category === "labour" && <span>/service</span>}
          </div>
          
          <button className="view-details-btn">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}