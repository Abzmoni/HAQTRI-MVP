import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Settings.css';

export default function Settings() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('account');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false
  });

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLogout = () => {
    logout();
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Implement account deletion
      console.log('Account deletion requested');
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account preferences and settings</p>
      </div>

      <div className="settings-layout">
        <div className="settings-sidebar">
          <button
            className={`sidebar-item ${activeSection === 'account' ? 'active' : ''}`}
            onClick={() => setActiveSection('account')}
          >
            <i className="fas fa-user-cog"></i>
            Account Settings
          </button>
          <button
            className={`sidebar-item ${activeSection === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveSection('notifications')}
          >
            <i className="fas fa-bell"></i>
            Notifications
          </button>
          <button
            className={`sidebar-item ${activeSection === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveSection('privacy')}
          >
            <i className="fas fa-shield-alt"></i>
            Privacy & Security
          </button>
          <button
            className={`sidebar-item ${activeSection === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveSection('appearance')}
          >
            <i className="fas fa-palette"></i>
            Appearance
          </button>
        </div>

        <div className="settings-content">
          {activeSection === 'account' && (
            <div className="settings-section">
              <h2>Account Settings</h2>
              
              <div className="setting-group">
                <h3>Profile Information</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Email Address</label>
                    <p>{user?.email}</p>
                  </div>
                  <button className="btn btn-outline">Change</button>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Phone Number</label>
                    <p>{user?.phone || 'Not set'}</p>
                  </div>
                  <button className="btn btn-outline">Change</button>
                </div>
              </div>

              <div className="setting-group">
                <h3>Account Actions</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Delete Account</label>
                    <p>Permanently delete your account and all data</p>
                  </div>
                  <button 
                    className="btn btn-danger"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Preferences</h2>
              
              <div className="setting-group">
                <h3>Push Notifications</h3>
                
                <div className="toggle-item">
                  <div className="toggle-info">
                    <label>Email Notifications</label>
                    <p>Receive updates via email</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={() => handleNotificationChange('email')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="toggle-item">
                  <div className="toggle-info">
                    <label>Push Notifications</label>
                    <p>Receive browser push notifications</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.push}
                      onChange={() => handleNotificationChange('push')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="toggle-item">
                  <div className="toggle-info">
                    <label>SMS Notifications</label>
                    <p>Receive text message alerts</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.sms}
                      onChange={() => handleNotificationChange('sms')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="toggle-item">
                  <div className="toggle-info">
                    <label>Marketing Emails</label>
                    <p>Receive promotional content and updates</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.marketing}
                      onChange={() => handleNotificationChange('marketing')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div className="settings-section">
              <h2>Privacy & Security</h2>
              
              <div className="setting-group">
                <h3>Data Privacy</h3>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Profile Visibility</label>
                    <p>Control who can see your profile</p>
                  </div>
                  <select className="privacy-select">
                    <option value="public">Public</option>
                    <option value="connections">Connections Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Data Download</label>
                    <p>Download a copy of your personal data</p>
                  </div>
                  <button className="btn btn-outline">Request Data</button>
                </div>
              </div>

              <div className="setting-group">
                <h3>Security</h3>
                <button className="btn btn-primary">Change Password</button>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="settings-section">
              <h2>Appearance</h2>
              <div className="coming-soon">
                <i className="fas fa-palette"></i>
                <h3>Customization Options</h3>
                <p>Theme and appearance settings will be available soon</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="settings-footer">
        <button className="btn btn-outline" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          Log Out
        </button>
      </div>
    </div>
  );
}