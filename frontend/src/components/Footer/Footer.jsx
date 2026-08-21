import './Footer.css';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-column">
            <h3>Haqtri</h3>
            <p
              style={{
                color: "var(--light-taupe)",
                marginBottom: 20,
                maxWidth: 300,
              }}
            >
              Premium real estate experience for Nigeria&apos;s most discerning
              clients and professionals.
            </p>
            <div style={{ display: "flex", gap: 15 }}>
              <a href="#" style={{ color: "var(--muted-gold)", fontSize: "1.3rem" }}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" style={{ color: "var(--muted-gold)", fontSize: "1.3rem" }}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" style={{ color: "var(--muted-gold)", fontSize: "1.3rem" }}>
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Explore</h3>
            <ul className="footer-links">
              <li>
                <a href="#">
                  <i className="fas fa-chevron-right"></i> Luxury Properties
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fas fa-chevron-right"></i> Premium Developers
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fas fa-chevron-right"></i> Verified Agents
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fas fa-chevron-right"></i> Investment Opportunities
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Company</h3>
            <ul className="footer-links">
              <li>
                <a href="#">
                  <i className="fas fa-chevron-right"></i> About Us
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fas fa-chevron-right"></i> Our Process
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fas fa-chevron-right"></i> Careers
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fas fa-chevron-right"></i> Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Resources</h3>
            <ul className="footer-links">
              <li>
                <a href="#">
                  <i className="fas fa-chevron-right"></i> Market Insights
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fas fa-chevron-right"></i> Investment Guide
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fas fa-chevron-right"></i> Legal Resources
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fas fa-chevron-right"></i> Property Valuation
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; 2023 Haqtri Real Estate. All rights reserved. | Luxury real
            estate platform for Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
}