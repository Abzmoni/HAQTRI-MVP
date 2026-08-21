import './FeaturedProperties.css';

export default function FeaturedProperties() {
  return (
    <section className="featured-properties">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Exclusive Properties</h2>
          <p className="section-subtitle">
            Discover our handpicked selection of Nigeria&apos;s most prestigious
            properties
          </p>
        </div>

        <div className="ornamental-divider">
          <div className="divider-line"></div>
          <div className="divider-icon">
            <i className="fas fa-circle"></i>
          </div>
          <div className="divider-line"></div>
        </div>

        <div className="properties-grid">
          <div className="property-featured">
            <div
              className="property-image"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')",
              }}
            >
              <div className="property-badge">Premium</div>
            </div>
            <div className="property-content">
              <div className="property-meta">
                <span>
                  <i className="fas fa-bed"></i> 5 Beds
                </span>
                <span>
                  <i className="fas fa-bath"></i> 6 Baths
                </span>
                <span>
                  <i className="fas fa-ruler-combined"></i> 4200 sq.ft
                </span>
              </div>
              <h3 className="property-title-featured">
                Victoria Island Penthouse
              </h3>
              <div className="property-price-featured">₦680,000,000</div>
              <a href="#" className="property-cta">
                View Details
              </a>
            </div>
          </div>

          <div className="property-featured">
            <div
              className="property-image"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')",
              }}
            >
              <div className="property-badge">Luxury</div>
            </div>
            <div className="property-content">
              <div className="property-meta">
                <span>
                  <i className="fas fa-bed"></i> 7 Beds
                </span>
                <span>
                  <i className="fas fa-bath"></i> 8 Baths
                </span>
                <span>
                  <i className="fas fa-ruler-combined"></i> 6800 sq.ft
                </span>
              </div>
              <h3 className="property-title-featured">
                Lekki Waterfront Mansion
              </h3>
              <div className="property-price-featured">₦950,000,000</div>
              <a href="#" className="property-cta">
                View Details
              </a>
            </div>
          </div>

          <div className="property-featured">
            <div
              className="property-image"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')",
              }}
            >
              <div className="property-badge">Exclusive</div>
            </div>
            <div className="property-content">
              <div className="property-meta">
                <span>
                  <i className="fas fa-bed"></i> 6 Beds
                </span>
                <span>
                  <i className="fas fa-bath"></i> 7 Baths
                </span>
                <span>
                  <i className="fas fa-ruler-combined"></i> 5500 sq.ft
                </span>
              </div>
              <h3 className="property-title-featured">Ikoyi Colonial Estate</h3>
              <div className="property-price-featured">₦1,250,000,000</div>
              <a href="#" className="property-cta">
                View Details
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}