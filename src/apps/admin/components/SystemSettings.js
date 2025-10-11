import React, { useState, useEffect, useCallback } from 'react';
import '../styles/AdminShared.css';
import '../styles/SystemSettings.css';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    platform_name: 'Multi-Vendor eCommerce',
    platform_email: 'admin@ecommerce.com',
    currency: 'INR',
    tax_rate: 18,
    commission_rate: 5,
    auto_approve_vendors: false,
    auto_approve_products: false,
    maintenance_mode: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem('adminToken');

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings({...settings, ...data});
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/admin/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading settings...</div>;
  }

  return (
    <div className="system-settings">
      <div className="page-header">
        <h2>System Settings</h2>
        <p>Configure your eCommerce platform</p>
      </div>

      <div className="settings-sections">
        {/* General Settings */}
        <div className="settings-section">
          <h3>General Settings</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Platform Name</label>
              <input
                type="text"
                value={settings.platform_name}
                onChange={(e) => setSettings({...settings, platform_name: e.target.value})}
              />
            </div>
            
            <div className="setting-item">
              <label>Platform Email</label>
              <input
                type="email"
                value={settings.platform_email}
                onChange={(e) => setSettings({...settings, platform_email: e.target.value})}
              />
            </div>
            
            <div className="setting-item">
              <label>Default Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({...settings, currency: e.target.value})}
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Business Settings */}
        <div className="settings-section">
          <h3>Business Settings</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Tax Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={settings.tax_rate}
                onChange={(e) => setSettings({...settings, tax_rate: parseFloat(e.target.value)})}
              />
            </div>
            
            <div className="setting-item">
              <label>Commission Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={settings.commission_rate}
                onChange={(e) => setSettings({...settings, commission_rate: parseFloat(e.target.value)})}
              />
            </div>
          </div>
        </div>

        {/* Automation Settings */}
        <div className="settings-section">
          <h3>Automation Settings</h3>
          <div className="settings-toggles">
            <div className="toggle-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.auto_approve_vendors}
                  onChange={(e) => setSettings({...settings, auto_approve_vendors: e.target.checked})}
                />
                <span className="toggle-slider"></span>
                Auto-approve vendor registrations
              </label>
              <p>New vendors will be automatically approved without manual review</p>
            </div>
            
            <div className="toggle-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.auto_approve_products}
                  onChange={(e) => setSettings({...settings, auto_approve_products: e.target.checked})}
                />
                <span className="toggle-slider"></span>
                Auto-approve product listings
              </label>
              <p>New products will be automatically approved without manual review</p>
            </div>
            
            <div className="toggle-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.maintenance_mode}
                  onChange={(e) => setSettings({...settings, maintenance_mode: e.target.checked})}
                />
                <span className="toggle-slider"></span>
                Maintenance Mode
              </label>
              <p>Enable maintenance mode to temporarily disable the platform</p>
            </div>
          </div>
        </div>

        {/* API Settings */}
        <div className="settings-section">
          <h3>API Configuration</h3>
          <div className="api-settings">
            <div className="api-item">
              <h4>Payment Gateway</h4>
              <p>Configure payment processing</p>
              <button className="btn-configure">Configure Razorpay</button>
            </div>
            
            <div className="api-item">
              <h4>Email Service</h4>
              <p>Configure email notifications</p>
              <button className="btn-configure">Configure SMTP</button>
            </div>
            
            <div className="api-item">
              <h4>SMS Service</h4>
              <p>Configure SMS notifications</p>
              <button className="btn-configure">Configure SMS</button>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="btn-save"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;