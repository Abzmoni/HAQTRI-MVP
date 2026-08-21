// src/components/Marketplace/ListingGrid/ListingGrid.jsx
import React from "react";
import ListingCard from "../ListingCard/ListingCard";
import "./ListingGrid.css";

export default function ListingGrid({ listings, onListingUpdate }) {
  if (listings.length === 0) {
    return (
      <div className="empty-listings">
        <i className="fas fa-search"></i>
        <h3>No listings found</h3>
        <p>Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="listing-grid">
      {listings.map(listing => (
        <ListingCard 
          key={listing._id} 
          listing={listing}
          onUpdate={onListingUpdate}
        />
      ))}
    </div>
  );
}