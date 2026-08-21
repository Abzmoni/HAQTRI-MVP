import React from 'react';
import './Projects.css';

export default function Projects() {
  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>My Projects</h1>
        <p>Manage your construction and property development projects</p>
      </div>

      <div className="coming-soon-container">
        <div className="coming-soon">
          <i className="fas fa-tools"></i>
          <h2>Projects Feature Coming Soon</h2>
          <p>
            We're building a comprehensive project management system to help you 
            track your construction projects, timelines, budgets, and collaborations.
          </p>
          <div className="feature-list">
            <div className="feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Project Timeline Tracking</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Budget Management</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Team Collaboration</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Document Storage</span>
            </div>
          </div>
          <button className="btn btn-primary" disabled>
            Notify Me When Ready
          </button>
        </div>
      </div>
    </div>
  );
}