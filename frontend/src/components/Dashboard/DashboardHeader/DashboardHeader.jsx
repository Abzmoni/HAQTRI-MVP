// src/components/Dashboard/DashboardHeader.jsx
import React from "react";
import "./DashboardHeader.css";

const DashboardHeader = ({ toggleSidebar }) => {
  return (
    <header className="dashboard-header">
      <div className="logo">Haqtri</div>
      <div className="header-actions">
        <button>🔔</button>
        <button className="menu-btn" onClick={toggleSidebar}>☰</button>
      </div>
    </header>
  );
};

export default DashboardHeader;
