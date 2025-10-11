import React, { useState, useEffect } from 'react';
import '../styles/VendorManagement.css';
import '../styles/AdminShared.css';

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    is_verified: '',
    is_active: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [formData, setFormData] = useState({
    business_name: '',
    business_description: '',
    business_email: '',
    business_phone: '',
    gst_number: '',
    pan_number: '',
    business_address: '',
    logo_url: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchVendors();
  }, [filters]);

  const fetchVendors = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.is_verified !== '') params.append('is_verified', filters.is_verified);
      if (filters.is_active !== '') params.append('is_active', filters.is_active);

      const response = await fetch(`http://127.0.0.1:8000/admin/vendors?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setVendors(data);
      } else {
        setError('Failed to fetch vendors');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Fetch vendors error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationToggle = async (vendorId, currentStatus) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/admin/vendors/${vendorId}/verify`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_verified: !currentStatus })
      });

      if (response.ok) {
        fetchVendors(); // Refresh the list
      } else {
        alert('Failed to update vendor verification');
      }
    } catch (error) {
      alert('Error updating vendor verification');
    }
  };

  const handleStatusToggle = async (vendorId, currentStatus) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/admin/vendors/${vendorId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: !currentStatus })
      });

      if (response.ok) {
        fetchVendors(); // Refresh the list
      } else {
        alert('Failed to update vendor status');
      }
    } catch (error) {
      alert('Error updating vendor status');
    }
  };

  const openModal = (mode, vendor = null) => {
    setModalMode(mode);
    setSelectedVendor(vendor);
    if (mode === 'add') {
      setFormData({
        business_name: '',
        business_description: '',
        business_email: '',
        business_phone: '',
        gst_number: '',
        pan_number: '',
        business_address: '',
        logo_url: ''
      });
    } else if (mode === 'edit' && vendor) {
      setFormData({
        business_name: vendor.business_name || '',
        business_description: vendor.business_description || '',
        business_email: vendor.business_email || '',
        business_phone: vendor.business_phone || '',
        gst_number: vendor.gst_number || '',
        pan_number: vendor.pan_number || '',
        business_address: vendor.business_address || '',
        logo_url: vendor.logo_url || ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVendor(null);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    try {
      let url, method;
      if (modalMode === 'add') {
        url = 'http://127.0.0.1:8000/admin/vendors';
        method = 'POST';
      } else if (modalMode === 'edit') {
        url = `http://127.0.0.1:8000/admin/vendors/${selectedVendor.id}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchVendors();
        closeModal();
        alert(`Vendor ${modalMode === 'add' ? 'created' : 'updated'} successfully!`);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || `Failed to ${modalMode} vendor`);
      }
    } catch (error) {
      setError(`Network error occurred while ${modalMode === 'add' ? 'creating' : 'updating'} vendor`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (vendor) => {
    if (!window.confirm(`Are you sure you want to delete vendor "${vendor.business_name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/admin/vendors/${vendor.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchVendors();
        alert('Vendor deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Failed to delete vendor');
      }
    } catch (error) {
      alert('Network error occurred while deleting vendor');
    }
  };

  if (loading) {
    return <div className="loading">Loading vendors...</div>;
  }

  return (
    <div className="vendor-management">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h2>Vendor Management</h2>
            <p>Manage vendor applications, verification, and business profiles</p>
          </div>
          <button 
            className="btn-add-vendor"
            onClick={() => openModal('add')}
          >
            + Add New Vendor
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Filter by Verification:</label>
          <select 
            value={filters.is_verified} 
            onChange={(e) => setFilters({...filters, is_verified: e.target.value})}
          >
            <option value="">All Vendors</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Filter by Status:</label>
          <select 
            value={filters.is_active} 
            onChange={(e) => setFilters({...filters, is_active: e.target.value})}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Vendors Table */}
      <div className="vendors-table-container">
        <table className="vendors-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Business Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>GST Number</th>
              <th>Commission Rate</th>
              <th>Verified</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td>{vendor.id}</td>
                <td className="business-name">
                  <div>
                    <strong>{vendor.business_name}</strong>
                    <p className="business-desc">{vendor.business_description}</p>
                  </div>
                </td>
                <td>{vendor.business_email}</td>
                <td>{vendor.business_phone}</td>
                <td>{vendor.gst_number}</td>
                <td>{vendor.commission_rate}%</td>
                <td>
                  <span className={`verification-badge ${vendor.is_verified ? 'verified' : 'unverified'}`}>
                    {vendor.is_verified ? '✅ Verified' : '⏳ Pending'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${vendor.is_active ? 'active' : 'inactive'}`}>
                    {vendor.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{new Date(vendor.created_at).toLocaleDateString()}</td>
                <td className="actions">
                  <button
                    className="action-btn view"
                    onClick={() => openModal('view', vendor)}
                    title="View Details"
                  >
                    👁️
                  </button>
                  <button
                    className="action-btn edit"
                    onClick={() => openModal('edit', vendor)}
                    title="Edit Vendor"
                  >
                    ✏️
                  </button>
                  <button
                    className={`action-btn ${vendor.is_verified ? 'unverify' : 'verify'}`}
                    onClick={() => handleVerificationToggle(vendor.id, vendor.is_verified)}
                    title={vendor.is_verified ? 'Unverify' : 'Verify'}
                  >
                    {vendor.is_verified ? '❌' : '✅'}
                  </button>
                  <button
                    className={`action-btn ${vendor.is_active ? 'deactivate' : 'activate'}`}
                    onClick={() => handleStatusToggle(vendor.id, vendor.is_active)}
                    title={vendor.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {vendor.is_active ? '🔒' : '🔓'}
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(vendor)}
                    title="Delete Vendor"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {vendors.length === 0 && !loading && (
        <div className="no-data">
          <p>No vendors found matching the current filters.</p>
        </div>
      )}

      {/* Vendor Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modalMode === 'add' ? 'Add New Vendor' : 
                 modalMode === 'edit' ? 'Edit Vendor' : 'Vendor Details'}
              </h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            
            {modalMode === 'view' ? (
              <div className="vendor-details">
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Business Name:</label>
                    <span>{selectedVendor?.business_name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Business Email:</label>
                    <span>{selectedVendor?.business_email || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Business Phone:</label>
                    <span>{selectedVendor?.business_phone || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>GST Number:</label>
                    <span>{selectedVendor?.gst_number || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>PAN Number:</label>
                    <span>{selectedVendor?.pan_number || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Commission Rate:</label>
                    <span>{selectedVendor?.commission_rate}%</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Business Description:</label>
                    <span>{selectedVendor?.business_description || 'No description provided'}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Business Address:</label>
                    <span>{selectedVendor?.business_address || 'No address provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Verification Status:</label>
                    <span className={`status-badge ${selectedVendor?.is_verified ? 'verified' : 'unverified'}`}>
                      {selectedVendor?.is_verified ? '✅ Verified' : '⏳ Pending'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Account Status:</label>
                    <span className={`status-badge ${selectedVendor?.is_active ? 'active' : 'inactive'}`}>
                      {selectedVendor?.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Created Date:</label>
                    <span>{new Date(selectedVendor?.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="vendor-form">
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="business_name">Business Name *</label>
                    <input
                      type="text"
                      id="business_name"
                      name="business_name"
                      value={formData.business_name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter business name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="business_email">Business Email</label>
                    <input
                      type="email"
                      id="business_email"
                      name="business_email"
                      value={formData.business_email}
                      onChange={handleInputChange}
                      placeholder="Enter business email"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="business_phone">Business Phone</label>
                    <input
                      type="tel"
                      id="business_phone"
                      name="business_phone"
                      value={formData.business_phone}
                      onChange={handleInputChange}
                      placeholder="Enter business phone"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="gst_number">GST Number</label>
                    <input
                      type="text"
                      id="gst_number"
                      name="gst_number"
                      value={formData.gst_number}
                      onChange={handleInputChange}
                      placeholder="Enter GST number"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="pan_number">PAN Number</label>
                    <input
                      type="text"
                      id="pan_number"
                      name="pan_number"
                      value={formData.pan_number}
                      onChange={handleInputChange}
                      placeholder="Enter PAN number"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="logo_url">Logo URL</label>
                    <input
                      type="url"
                      id="logo_url"
                      name="logo_url"
                      value={formData.logo_url}
                      onChange={handleInputChange}
                      placeholder="Enter logo URL"
                    />
                  </div>
                  
                  <div className="form-group full-width">
                    <label htmlFor="business_description">Business Description</label>
                    <textarea
                      id="business_description"
                      name="business_description"
                      value={formData.business_description}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Enter business description"
                    />
                  </div>
                  
                  <div className="form-group full-width">
                    <label htmlFor="business_address">Business Address</label>
                    <textarea
                      id="business_address"
                      name="business_address"
                      value={formData.business_address}
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="Enter business address"
                    />
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={closeModal}
                    disabled={submitLoading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-submit"
                    disabled={submitLoading}
                  >
                    {submitLoading ? 'Saving...' : (modalMode === 'add' ? 'Create Vendor' : 'Update Vendor')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorManagement;