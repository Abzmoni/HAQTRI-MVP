// src/components/Dashboard/BottomNav/BottomNav.jsx
import { NavLink } from "react-router-dom";
import "./BottomNav.css";

export default function BottomNav() {
  return (
    <nav className="dashboard-bottom-nav">
      <NavLink to="/dashboard" className="nav-item">
        <i className="fas fa-home"></i>
        <span>Home</span>
      </NavLink>
      <NavLink to="/dashboard/marketplace" className="nav-item">
        <i className="fas fa-store"></i>
        <span>Market</span>
      </NavLink>
      <NavLink to="/dashboard/live" className="nav-item add-post">
        <i className="fas fa-plus"></i>
      </NavLink>
      <NavLink to="/dashboard/projects" className="nav-item">
        <i className="fas fa-briefcase"></i>
        <span>Projects</span>
      </NavLink>
      <NavLink to="/dashboard/messages" className="nav-item">
        <i className="fas fa-comments"></i>
        <span>Messages</span>
      </NavLink>
    </nav>
  );
}
