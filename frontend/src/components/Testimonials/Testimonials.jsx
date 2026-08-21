import './Testimonials.css';

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Client Experiences</h2>
          <p className="section-subtitle">
            Discover why discerning clients choose Haqtri for their premium real
            estate needs
          </p>
        </div>

        <div className="ornamental-divider">
          <div className="divider-line"></div>
          <div className="divider-icon">
            <i className="fas fa-circle"></i>
          </div>
          <div className="divider-line"></div>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="quote-icon">
              <i className="fas fa-quote-right"></i>
            </div>
            <p className="testimonial-text">
              &quot;Haqtri transformed our property search. The luxury
              properties showcased are exceptional, and the verification process
              gave us complete confidence in our investment.&quot;
            </p>
            <div className="client-info">
              <div
                className="client-avatar"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80')",
                }}
              ></div>
              <div className="client-details">
                <h4>Adetayo Williams</h4>
                <p>Lekki Property Investor</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="quote-icon">
              <i className="fas fa-quote-right"></i>
            </div>
            <p className="testimonial-text">
              &quot;As a real estate professional, Haqtri has elevated my
              business. The premium clientele and seamless transaction process
              have made it my exclusive platform.&quot;
            </p>
            <div className="client-info">
              <div
                className="client-avatar"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80')",
                }}
              ></div>
              <div className="client-details">
                <h4>Chioma Okonkwo</h4>
                <p>Luxury Property Agent</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="quote-icon">
              <i className="fas fa-quote-right"></i>
            </div>
            <p className="testimonial-text">
              &quot;The multi-platform experience is unparalleled. I can
              transition from mobile browsing to desktop negotiations
              effortlessly. This is the future of luxury real estate.&quot;
            </p>
            <div className="client-info">
              <div
                className="client-avatar"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80')",
                }}
              ></div>
              <div className="client-details">
                <h4>Emeka Nwankwo</h4>
                <p>Commercial Developer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}