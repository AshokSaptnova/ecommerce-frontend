import React, { useState } from 'react';
import '../../styles/VendorSettings.css';

const VendorSettings = ({ vendorData }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    orderAlerts: true,
    lowStockAlerts: true,
    marketingEmails: false,
    twoFactorAuth: false,
    autoRestock: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setSuccess('Password updated successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSaveSettings = () => {
    setSuccess('Settings saved successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="vendor-settings">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account preferences and security</p>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      <div className="settings-container">
        {/* Notifications Settings */}
        <div className="settings-card">
          <div className="card-header">
            <h3>🔔 Notifications</h3>
            <p>Manage how you receive updates</p>
          </div>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Email Notifications</h4>
                <p>Receive email updates about your store</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleSettingChange('emailNotifications')}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Order Alerts</h4>
                <p>Get notified when you receive new orders</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.orderAlerts}
                  onChange={() => handleSettingChange('orderAlerts')}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Low Stock Alerts</h4>
                <p>Alert when product stock runs low</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.lowStockAlerts}
                  onChange={() => handleSettingChange('lowStockAlerts')}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Marketing Emails</h4>
                <p>Receive tips and promotional content</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.marketingEmails}
                  onChange={() => handleSettingChange('marketingEmails')}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="settings-card">
          <div className="card-header">
            <h3>🔒 Security</h3>
            <p>Keep your account secure</p>
          </div>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Two-Factor Authentication</h4>
                <p>Add an extra layer of security</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={() => handleSettingChange('twoFactorAuth')}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="password-section">
            <h4>Change Password</h4>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <button type="submit" className="btn-change-password">
                Update Password
              </button>
            </form>
          </div>
        </div>

        {/* Store Preferences */}
        <div className="settings-card">
          <div className="card-header">
            <h3>⚙️ Store Preferences</h3>
            <p>Customize your store operations</p>
          </div>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Automatic Restock Alerts</h4>
                <p>Auto-generate purchase orders for low stock</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.autoRestock}
                  onChange={() => handleSettingChange('autoRestock')}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="preference-section">
            <h4>Store Display Settings</h4>
            <div className="form-group">
              <label>Currency</label>
              <select defaultValue="INR">
                <option value="INR">₹ INR - Indian Rupee</option>
                <option value="USD">$ USD - US Dollar</option>
                <option value="EUR">€ EUR - Euro</option>
              </select>
            </div>
            <div className="form-group">
              <label>Time Zone</label>
              <select defaultValue="IST">
                <option value="IST">IST - India Standard Time</option>
                <option value="UTC">UTC - Coordinated Universal Time</option>
                <option value="PST">PST - Pacific Standard Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-card danger-zone">
          <div className="card-header">
            <h3>⚠️ Danger Zone</h3>
            <p>Irreversible actions</p>
          </div>
          <div className="danger-actions">
            <button className="btn-danger">Deactivate Store</button>
            <button className="btn-danger">Delete Account</button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="settings-footer">
        <button className="btn-save-settings" onClick={handleSaveSettings}>
          Save All Settings
        </button>
      </div>
    </div>
  );
};

export default VendorSettings;
