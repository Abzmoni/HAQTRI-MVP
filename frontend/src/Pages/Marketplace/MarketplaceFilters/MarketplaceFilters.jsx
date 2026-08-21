// src/components/Marketplace/MarketplaceFilters/MarketplaceFilters.jsx
import React from "react";
import "./MarketplaceFilters.css";

export default function MarketplaceFilters({ filters, onFilterChange, onClearFilters }) {
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "property", label: "Properties" },
    { value: "materials", label: "Materials" },
    { value: "labour", label: "Labour & Services" }
  ];

  const propertyTypes = [
    { value: "all", label: "All Types" },
    { value: "house", label: "Houses" },
    { value: "apartment", label: "Apartments" },
    { value: "land", label: "Land" },
    { value: "commercial", label: "Commercial" }
  ];

  const materialTypes = [
    { value: "all", label: "All Materials" },
    { value: "cement", label: "Cement" },
    { value: "roofing", label: "Roofing" },
    { value: "tiles", label: "Tiles" },
    { value: "doors", label: "Doors" },
    { value: "windows", label: "Windows" },
    { value: "plumbing", label: "Plumbing" },
    { value: "electrical", label: "Electrical" }
  ];

  const labourTypes = [
    { value: "all", label: "All Services" },
    { value: "mason", label: "Mason" },
    { value: "carpenter", label: "Carpenter" },
    { value: "electrician", label: "Electrician" },
    { value: "plumber", label: "Plumber" },
    { value: "painter", label: "Painter" },
    { value: "tiler", label: "Tiler" },
    { value: "welder", label: "Welder" }
  ];

  const locations = [
    { value: "all", label: "All Locations" },
    { value: "lagos", label: "Lagos" },
    { value: "abuja", label: "Abuja" },
    { value: "port-harcourt", label: "Port Harcourt" },
    { value: "onitsha", label: "Onitsha" },
    { value: "awka", label: "Awka" },
    { value: "nnewi", label: "Nnewi" }
  ];

  const getTypeOptions = () => {
    switch (filters.category) {
      case "property": return propertyTypes;
      case "materials": return materialTypes;
      case "labour": return labourTypes;
      default: return [{ value: "all", label: "All Types" }];
    }
  };

  return (
    <div className="marketplace-filters">
      <div className="filters-header">
        <h3>Filter Listings</h3>
        <button className="clear-filters-btn" onClick={onClearFilters}>
          Clear All
        </button>
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label>Category</label>
          <select 
            value={filters.category} 
            onChange={(e) => onFilterChange({ category: e.target.value, type: "all" })}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Type</label>
          <select 
            value={filters.type} 
            onChange={(e) => onFilterChange({ type: e.target.value })}
          >
            {getTypeOptions().map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Location</label>
          <select 
            value={filters.location} 
            onChange={(e) => onFilterChange({ location: e.target.value })}
          >
            {locations.map(loc => (
              <option key={loc.value} value={loc.value}>{loc.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Min Price (₦)</label>
          <input 
            type="number" 
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onFilterChange({ minPrice: e.target.value })}
          />
        </div>

        <div className="filter-group">
          <label>Max Price (₦)</label>
          <input 
            type="number" 
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
          />
        </div>

        <div className="filter-group search-group">
          <label>Search</label>
          <div className="search-input-wrapper">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Search listings..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}