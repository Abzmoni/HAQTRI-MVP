// src/pages/Marketplace/Marketplace.jsx
import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import ListingGrid from "./ListingGrid/ListingGrid";
import MarketplaceFilters from "./MarketplaceFilters/MarketplaceFilters";
import "./Marketplace.css";

export default function Marketplace() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    type: "all",
    location: "all",
    minPrice: "",
    maxPrice: "",
    search: ""
  });

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, listings]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError("");
      setDebugInfo("Starting API request...");
      
      // Log the API configuration for debugging
      console.log("API baseURL:", API.defaults.baseURL);
      console.log("Requesting endpoint: /listings");
      
      const res = await API.get("/listings");
      console.log("API Response:", res);
      
      if (res.data && (res.data.listings || Array.isArray(res.data))) {
        setListings(res.data.listings || res.data);
        setDebugInfo(`Successfully loaded ${res.data.listings?.length || res.data.length} listings`);
      } else {
        setError("Invalid response format from server");
        setDebugInfo("Response data: " + JSON.stringify(res.data));
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError("Failed to load listings. Please check the server connection.");
      
      // Detailed error information
      let debugMessage = `Error: ${err.message}\n`;
      if (err.response) {
        debugMessage += `Status: ${err.response.status}\n`;
        debugMessage += `Response data: ${JSON.stringify(err.response.data)}\n`;
        debugMessage += `URL: ${err.config?.url}\n`;
      } else if (err.request) {
        debugMessage += `No response received. Request: ${JSON.stringify(err.request)}\n`;
      }
      
      setDebugInfo(debugMessage);
      setLoading(false);
      
      // Try alternative endpoints as fallback
      tryAlternativeEndpoints();
    }
  };

  const tryAlternativeEndpoints = async () => {
    console.log("Trying alternative endpoints...");
    
    // Try with /api prefix
    try {
      console.log("Trying /api/listings...");
      const res = await API.get("/api/listings");
      if (res.data) {
        setListings(res.data.listings || res.data);
        setError("");
        setDebugInfo("Successfully loaded listings from /api/listings");
        return;
      }
    } catch (apiErr) {
      console.log("/api/listings failed:", apiErr.message);
    }
    
    // Try with full URL
    try {
      console.log("Trying full URL...");
      const res = await API.get("http://localhost:4000/api/listings");
      if (res.data) {
        setListings(res.data.listings || res.data);
        setError("");
        setDebugInfo("Successfully loaded listings from http://localhost:4000/api/listings");
        return;
      }
    } catch (fullErr) {
      console.log("Full URL failed:", fullErr.message);
    }
    
    // Try with different endpoint
    try {
      console.log("Trying /api/posts as fallback...");
      const res = await API.get("/api/posts");
      if (res.data) {
        // Transform posts to listings format if needed
        setListings(res.data.posts || res.data);
        setError("");
        setDebugInfo("Loaded posts instead of listings");
        return;
      }
    } catch (postErr) {
      console.log("Posts endpoint failed:", postErr.message);
    }
  };

  const applyFilters = () => {
    let filtered = [...listings];

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(listing => listing.category === filters.category);
    }

    // Type filter
    if (filters.type !== "all") {
      filtered = filtered.filter(listing => listing.type === filters.type);
    }

    // Location filter
    if (filters.location !== "all") {
      filtered = filtered.filter(listing => 
        listing.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter(listing => listing.price >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(listing => listing.price <= Number(filters.maxPrice));
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(listing => 
        listing.title.toLowerCase().includes(searchTerm) ||
        listing.description.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredListings(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleClearFilters = () => {
    setFilters({
      category: "all",
      type: "all",
      location: "all",
      minPrice: "",
      maxPrice: "",
      search: ""
    });
  };

  const retryFetch = () => {
    fetchListings();
  };

  return (
    <div className="marketplace-page">
      {/* Vintage Background Elements */}
      <div className="vintage-bg">
        <div className="vintage-pattern"></div>
        <div className="paper-texture"></div>
        <div className="vintage-elements">
          <div className="vintage-divider"></div>
          <div className="vintage-divider"></div>
          <div className="vintage-divider"></div>
        </div>
      </div>

      <div className="marketplace-content">
        <div className="container">
          {error && (
            <div className="error-banner">
              <div className="error-content">
                <i className="fas fa-exclamation-circle"></i>
                <div>
                  <h3>{error}</h3>
                  <p>Check if the server is running on port 4000 and the listings endpoint exists.</p>
                  <button onClick={retryFetch} className="btn btn-primary">
                    Retry
                  </button>
                </div>
              </div>
              <div className="debug-info">
                <details>
                  <summary>Debug Information</summary>
                  <pre>{debugInfo}</pre>
                </details>
              </div>
            </div>
          )}
          
          <MarketplaceFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
          
          {loading ? (
            <div className="marketplace-loading">
              <div className="loading-spinner"></div>
              <p>Loading listings...</p>
            </div>
          ) : (
            <ListingGrid 
              listings={filteredListings}
              onListingUpdate={fetchListings}
            />
          )}
        </div>
      </div>
    </div>
  );
}