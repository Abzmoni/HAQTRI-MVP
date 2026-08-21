import './MobileMenu.css';

export default function MobileMenu() {
  return (
    <>
      <div className="mobile-menu" id="mobileMenu">
        <button className="close-menu" id="closeMenu">
          <i className="fas fa-times"></i>
        </button>
        <ul>
          <li><a href="./discover.html">Discover</a></li>
          <li><a href="./marketplace.html">Marketplace</a></li>
          <li><a href="./for-professionals.html">For Professionals</a></li>
        </ul>
        <div className="nav-buttons">
          <a href="./signin.html" className="btn btn-outline">Sign In</a>
          <a href="#" className="btn btn-primary"><i className="fas fa-download"></i> Download</a>
        </div>
      </div>
      <div className="menu-overlay" id="menuOverlay"></div>
    </>
  );
}