// src/components/Dashboard/DashboardSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "./DashboardSidebar.css";

const DashboardSidebar = ({ isOpen }) => {
  return (
    <aside className={`dashboard-sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-logo">
        <div className="logo-icon">H</div>
      </div>
      <nav>
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <i className="fas fa-home"></i>
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/dashboard/marketplace"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <i className="fas fa-store"></i>
          <span>Marketplace</span>
        </NavLink>
        <NavLink
          to="/dashboard/live"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <i className="fas fa-video"></i>
          <span>Live Stream</span>
        </NavLink>
        <NavLink
          to="/dashboard/projects"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <i className="fas fa-folder"></i>
          <span>Projects</span>
        </NavLink>
        <NavLink
          to="/dashboard/messages"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <i className="fas fa-comments"></i>
          <span>Messages</span>
        </NavLink>
        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <i className="fas fa-user"></i>
          <span>Profile</span>
        </NavLink>
        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <i className="fas fa-cog"></i>
          <span>Settings</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;