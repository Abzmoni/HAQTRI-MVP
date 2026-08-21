// Trending.jsx
import './Trending.css';

export default function Trending() {
  const items = [
    {
      badge: "Trending",
      title: "Victoria Island Penthouse",
      price: "₦680,000,000",
      img: "https://images.unsplash.com/photo-1600566753052-dc33d8c44eac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      badge: "New",
      title: "Lekki Waterfront Mansion",
      price: "₦950,000,000",
      img: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      badge: "Premium",
      title: "Ikoyi Colonial Estate",
      price: "₦1,250,000,000",
      img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      badge: "Luxury",
      title: "Asokoro Executive Home",
      price: "₦820,000,000",
      img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <section className="trending-section">
      <div className="container">
        <div className="trending-header">
          <h2 className="trending-title">Trending Properties</h2>
          <div className="trending-controls">
            <div className="trending-control trending-prev">
              <i className="fas fa-chevron-left"></i>
            </div>
            <div className="trending-control trending-next">
              <i className="fas fa-chevron-right"></i>
            </div>
          </div>
        </div>
        <div className="trending-grid">
          {items.map((it, i) => (
            <div key={it.title} className="trending-item interactive-card">
              <div
                className="trending-image hover-play"
                style={{ backgroundImage: `url('${it.img}')` }}
              >
                <div className="trending-badge">{it.badge}</div>
              </div>
              <div className="trending-content">
                <h3 className="trending-item-title">{it.title}</h3>
                <div className="trending-item-price">{it.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}