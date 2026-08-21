import './HowItWorks.css';

export default function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Your Journey to Trust</h2>
          <p className="section-subtitle">
            We&apos;ve refined the entire real estate process into three elegant
            steps, combining sophisticated discovery with secure transactions.
          </p>
        </div>

        <div className="ornamental-divider">
          <div className="divider-line"></div>
          <div className="divider-icon">
            <i className="fas fa-circle"></i>
          </div>
          <div className="divider-line"></div>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-icon">
              <i className="fas fa-compass"></i>
            </div>
            <div className="step-number">1</div>
            <h3>Discover &amp; Explore</h3>
            <p>
              Immerse yourself in Nigeria&apos;s premier properties and top
              artisans. Curate your personalized feed, follow elite creators,
              and discover your perfect property match.
            </p>
          </div>

          <div className="step-card">
            <div className="step-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className="step-number">2</div>
            <h3>Verify &amp; Activate</h3>
            <p>
              Our proprietary verification engine meticulously authenticates
              land titles, premium materials, and professional credentials,
              ensuring absolute peace of mind.
            </p>
          </div>

          <div className="step-card">
            <div className="step-icon">
              <i className="fas fa-handshake"></i>
            </div>
            <div className="step-number">3</div>
            <h3>Transact &amp; Build</h3>
            <p>
              Manage your acquisition or development with secure escrow
              services, transparent communication channels, and AI-powered
              progress tracking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}