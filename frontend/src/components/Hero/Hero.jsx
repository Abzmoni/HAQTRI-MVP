import { useEffect, useRef, useState } from "react";
import './Hero.css';

export default function Hero() {
  const items = [
    {
      title: "Lekki Luxury Villa",
      price: "₦250,000,000",
      details: "5 bedrooms | 6 bathrooms | 4200 sq.ft",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Ikoyi Waterfront",
      price: "₦480,000,000",
      details: "7 bedrooms | 8 bathrooms | 6800 sq.ft",
      img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Banana Island Estate",
      price: "₦750,000,000",
      details: "6 bedrooms | 7 bathrooms | 5500 sq.ft",
      img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ];

  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  const show = (i) => setCurrent((i + items.length) % items.length);
  const next = () => show(current + 1);
  const prev = () => show(current - 1);

  useEffect(() => {
    intervalRef.current = setInterval(next, 5000);
    return () => clearInterval(intervalRef.current);
  }, [current]);

  const pause = () => clearInterval(intervalRef.current);
  const resume = () => (intervalRef.current = setInterval(next, 5000));

  return (
    <section className="hero">
      <div className="vintage-corner corner-tl"></div>
      <div className="vintage-corner corner-tr"></div>

      <div className="container hero-content">
        <div className="hero-text">
          <h1>
            Your Real Estate Feed. <span>On Any Screen.</span>
          </h1>
          <p>
            Experience Nigeria&apos;s finest properties through a seamless
            multi-platform interface. Browse exclusive listings on your phone
            during your commute, or explore detailed project portfolios on your
            desktop at home. Haqtri delivers luxury real estate at your
            fingertips.
          </p>

          <div className="path-buttons">
            <div className="path-btn reels">
              <i className="fas fa-play-circle"></i>
              <span>Watch Reels</span>
            </div>
            <div className="path-btn">
              <i className="fas fa-store"></i>
              <span>Explore Marketplace</span>
            </div>
          </div>

          <div className="hero-buttons">
            <a href="#" className="btn btn-primary">
              <i className="fas fa-download"></i> Download the App
            </a>
            <a href="#" className="btn btn-outline">
              Join as a Professional
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="interactive-feed">
            <div
              className="feed-container"
              onMouseEnter={pause}
              onMouseLeave={resume}
            >
              {items.map((it, i) => (
                <div
                  key={it.title}
                  className={`feed-item ${i === current ? "active" : ""}`}
                  style={{ backgroundImage: `url('${it.img}')` }}
                >
                  <div className="feed-overlay">
                    <h3 className="feed-title">{it.title}</h3>
                    <div className="feed-price">{it.price}</div>
                    <p>{it.details}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="feed-nav feed-prev" onClick={prev} aria-label="Previous">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="feed-nav feed-next" onClick={next} aria-label="Next">
              <i className="fas fa-chevron-right"></i>
            </button>

            <div className="feed-controls">
              {items.map((_, i) => (
                <button
                  key={i}
                  className={`feed-dot ${i === current ? "active" : ""}`}
                  onClick={() => show(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="vintage-corner corner-bl"></div>
      <div className="vintage-corner corner-br"></div>
    </section>
  );
}