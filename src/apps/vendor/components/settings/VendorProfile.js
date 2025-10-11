import React, { useState, useEffect } from 'react';
import '../../styles/VendorProfile.css';
import { handleApiError } from '../../../../shared/utils/errorHandler';

const VendorProfile = ({ vendorData }) => {
  const [formData, setFormData] = useState({
    business_name: vendorData?.business_name || '',
    contact_email: vendorData?.contact_email || '',
    contact_number: vendorData?.contact_number || '',
    address: vendorData?.address || '',
    description: vendorData?.description || '',
    website: vendorData?.website || '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [token] = useState(localStorage.getItem('vendorToken'));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://127.0.0.1:8000/vendors/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedData = await response.json();
        localStorage.setItem('vendorData', JSON.stringify(updatedData));
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorMessage = await handleApiError(response);
        setError(errorMessage);
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendor-profile">
      <div className="page-header">
        <h1>Store Profile</h1>
        <p>Manage your store information and settings</p>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="store-avatar">🏪</div>
            <div className="store-info">
              <h2>{vendorData?.business_name}</h2>
              <span className={`status-badge ${vendorData?.is_active ? 'active' : 'inactive'}`}>
                {vendorData?.is_active ? 'Active Store' : 'Inactive Store'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="business_name">Business Name *</label>
                  <input
                    type="text"
                    id="business_name"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact_email">Contact Email *</label>
                  <input
                    type="email"
                    id="contact_email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact_number">Contact Number *</label>
                  <input
                    type="tel"
                    id="contact_number"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="website">Website</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://www.yourstore.com"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Store Details</h3>
              <div className="form-group">
                <label htmlFor="description">Store Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell customers about your store..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Business Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" className="btn-cancel" onClick={() => window.location.reload()}>
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="info-cards">
          <div className="info-card">
            <h3>📊 Store Statistics</h3>
            <div className="stat-item">
              <span className="label">Vendor ID:</span>
              <span className="value">#{vendorData?.id}</span>
            </div>
            <div className="stat-item">
              <span className="label">Member Since:</span>
              <span className="value">
                {new Date(vendorData?.created_at || Date.now()).toLocaleDateString()}
              </span>
            </div>
            <div className="stat-item">
              <span className="label">Store Status:</span>
              <span className="value">{vendorData?.is_active ? 'Active' : 'Inactive'}</span>
            </div>
          </div>

          <div className="info-card">
            <h3>💡 Profile Tips</h3>
            <ul>
              <li>Keep your contact information up to date</li>
              <li>Add a detailed store description</li>
              <li>Verify your business address</li>
              <li>Add your website if available</li>
              <li>Respond to customer inquiries promptly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
