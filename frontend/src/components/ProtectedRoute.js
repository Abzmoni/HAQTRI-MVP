import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireVerified = false }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (requireVerified && !user?.isVerified) {
    return (
      <div className="verification-required">
        <div className="verification-message">
          <i className="fas fa-shield-alt"></i>
          <h2>Verification Required</h2>
          <p>You need to verify your account to access this feature.</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/dashboard/profile'}
          >
            Verify Account
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;