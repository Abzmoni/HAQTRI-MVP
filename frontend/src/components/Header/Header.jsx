import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header>
        <div className="container header-container">
          <Link to="/" className="logo">
            <div className="logo-icon">H</div>
            <div className="logo-text">Haqtri</div>
          </Link>
          <nav className="desktop-nav">
            <ul>
              <li><Link to="/reels" className="nav-reels"><i className="fas fa-play-circle"></i> Reels</Link></li>
              <li><Link to="/marketplace"><i className="fas fa-store"></i> Marketplace</Link></li>
              <li><Link to="/for-professionals"><i className="fas fa-user-tie"></i> For Professionals</Link></li>
            </ul>
          </nav>
          <div className="nav-buttons desktop-nav">
            <Link to="/signin" className="btn btn-outline">Sign In</Link>
            <a href="#" className="btn btn-primary"><i className="fas fa-download"></i> Download</a>
          </div>
          <button 
            className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="hamburger"></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`} id="mobileMenu">
        <ul>
          <li><Link to="/reels" className="nav-reels"><i className="fas fa-play-circle"></i> Reels</Link></li>
          <li><Link to="/marketplace"><i className="fas fa-store"></i> Marketplace</Link></li>
          <li><Link to="/for-professionals"><i className="fas fa-user-tie"></i> For Professionals</Link></li>
        </ul>
        <div className="nav-buttons">
          <Link to="/signin" className="btn btn-outline">Sign In</Link>
          <a href="#" className="btn btn-primary"><i className="fas fa-download"></i> Download</a>
        </div>
      </div>
      
      <div 
        className={`menu-overlay ${isMenuOpen ? 'active' : ''}`} 
        onClick={toggleMenu}
      ></div>
    </>
  );
}
