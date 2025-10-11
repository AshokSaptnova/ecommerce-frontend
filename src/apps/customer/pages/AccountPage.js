import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import apiService from '../../../shared/services/api';
import OrderHistory from './OrderHistory';
import './AccountPage.css';

const AccountPage = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    orders: 0,
    wishlist: 0,
    addresses: 0,
    member_since: 'N/A'
  });

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const data = await apiService.getUserStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="account-page">
        <div className="account-container">
          <div className="not-logged-in">
            <div className="login-prompt-icon">🔒</div>
            <h2>Please Log In</h2>
            <p>You need to be logged in to view your account</p>
            <Link to="/login" className="btn-primary-account">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', label: 'Account Overview', icon: '👤' },
    { id: 'orders', label: 'My Orders', icon: '📦', count: stats.orders },
    { id: 'wishlist', label: 'Wishlist', icon: '❤️', count: stats.wishlist },
    { id: 'addresses', label: 'Saved Addresses', icon: '📍', count: stats.addresses },
    { id: 'profile', label: 'Profile Settings', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' }
  ];

  return (
    <div className="account-page">
      {/* Breadcrumb / Home Button */}
      <div className="account-breadcrumb">
        <Link to="/" className="breadcrumb-link">
          <span className="breadcrumb-icon">🏠</span>
          <span>Home</span>
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">My Account</span>
      </div>

      <div className="account-container">
        <div className="account-header">
          <div className="user-welcome">
            <div className="user-avatar-large">
              {user.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="welcome-text">
              <h1>Welcome back, {user.full_name || user.username}!</h1>
              <p className="user-email">{user.email}</p>
              <div className="user-badges">
                <span className="badge badge-member">Member Since {stats.member_since}</span>
                {user.role === 'vendor' && <span className="badge badge-vendor">Vendor</span>}
              </div>
            </div>
          </div>
          <div className="header-actions">
            <Link to="/" className="btn-home">
              <span>🏠</span> Home
            </Link>
            <button onClick={handleLogout} className="btn-logout">
              <span>🚪</span> Logout
            </button>
          </div>
        </div>

        <div className="account-content">
          <aside className="account-sidebar">
            <nav className="account-nav">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="nav-badge">{item.count}</span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          <main className="account-main">
            {activeTab === 'overview' && <AccountOverview user={user} stats={stats} />}
            {activeTab === 'orders' && <OrderHistory />}
            {activeTab === 'wishlist' && <WishlistSection refreshStats={fetchUserStats} />}
            {activeTab === 'addresses' && <AddressesSection refreshStats={fetchUserStats} />}
            {activeTab === 'profile' && <ProfileSection user={user} updateProfile={updateProfile} />}
            {activeTab === 'security' && <SecuritySection changePassword={changePassword} />}
          </main>
        </div>
      </div>
    </div>
  );
};

// Account Overview Component
const AccountOverview = ({ user, stats }) => {
  const statCards = [
    { label: 'Total Orders', value: stats.orders || 0, icon: '📦', color: '#3b82f6' },
    { label: 'Wishlist Items', value: stats.wishlist || 0, icon: '❤️', color: '#ef4444' },
    { label: 'Saved Addresses', value: stats.addresses || 0, icon: '📍', color: '#10b981' },
    { label: 'Member Since', value: stats.member_since, icon: '📅', color: '#8b5cf6' }
  ];

  return (
    <div className="section-content">
      <div className="section-header">
        <h2>Account Overview</h2>
        <p className="section-subtitle">Your account summary and quick actions</p>
      </div>
      
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderTopColor: stat.color }}>
            <div className="stat-icon-circle" style={{ backgroundColor: `${stat.color}20` }}>
              <span className="stat-icon" style={{ color: stat.color }}>{stat.icon}</span>
            </div>
            <div className="stat-info">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-grid">
          <Link to="/all-products" className="action-card">
            <span className="action-icon">🛍️</span>
            <span className="action-label">Continue Shopping</span>
          </Link>
          <Link to="/" className="action-card">
            <span className="action-icon">🏠</span>
            <span className="action-label">Go to Homepage</span>
          </Link>
          <button className="action-card">
            <span className="action-icon">💬</span>
            <span className="action-label">Contact Support</span>
          </button>
          <button className="action-card">
            <span className="action-icon">ℹ️</span>
            <span className="action-label">Help Center</span>
          </button>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Account Information</h3>
        <div className="info-list">
          <div className="info-item">
            <span className="info-icon">✉️</span>
            <div className="info-details">
              <p className="info-title">Email Address</p>
              <p className="info-value">{user.email}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📱</span>
            <div className="info-details">
              <p className="info-title">Phone Number</p>
              <p className="info-value">{user.phone || 'Not provided'}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">👤</span>
            <div className="info-details">
              <p className="info-title">Username</p>
              <p className="info-value">{user.username}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Section Component
const ProfileSection = ({ user, updateProfile }) => {
  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
    phone: user.phone || ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await updateProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="section-content">
      <div className="section-header">
        <h2>Profile Settings</h2>
        <p className="section-subtitle">Manage your account information</p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            value={user.email} 
            disabled 
            className="disabled-input"
          />
          <small className="form-help">Email cannot be changed</small>
        </div>
        <div className="form-group">
          <label>Username</label>
          <input 
            type="text" 
            value={user.username} 
            disabled 
            className="disabled-input"
          />
          <small className="form-help">Username cannot be changed</small>
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input 
            type="tel" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 9876543210"
          />
        </div>
        <button type="submit" className="btn-primary-account" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

// Addresses Section Component
const AddressesSection = ({ refreshStats }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAddresses();
      setAddresses(data);
      if (refreshStats) refreshStats();
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await apiService.deleteAddress(addressId);
        fetchAddresses();
      } catch (error) {
        alert('Failed to delete address: ' + error.message);
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await apiService.setDefaultAddress(addressId);
      fetchAddresses();
    } catch (error) {
      alert('Failed to set default address: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="section-content">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-content">
      <div className="section-header">
        <div>
          <h2>Saved Addresses</h2>
          <p className="section-subtitle">Manage your delivery addresses</p>
        </div>
        <button 
          className="btn-primary-account"
          onClick={() => {
            setEditingAddress(null);
            setShowForm(true);
          }}
        >
          <span>➕</span> Add New Address
        </button>
      </div>

      {showForm && (
        <AddressForm
          address={editingAddress}
          onClose={() => {
            setShowForm(false);
            setEditingAddress(null);
          }}
          onSave={() => {
            setShowForm(false);
            setEditingAddress(null);
            fetchAddresses();
          }}
        />
      )}

      {addresses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📍</div>
          <h3>No Saved Addresses</h3>
          <p>Add an address for faster checkout</p>
          <button 
            className="btn-primary-account"
            onClick={() => setShowForm(true)}
          >
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="addresses-grid">
          {addresses.map(address => (
            <div key={address.id} className={`address-card ${address.is_default ? 'default' : ''}`}>
              {address.is_default && (
                <div className="default-badge">Default</div>
              )}
              <div className="address-header">
                <h4>{address.title}</h4>
                <div className="address-actions">
                  <button
                    className="btn-icon"
                    onClick={() => {
                      setEditingAddress(address);
                      setShowForm(true);
                    }}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleDelete(address.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="address-body">
                <p className="address-name">{address.full_name}</p>
                <p>{address.address_line_1}</p>
                {address.address_line_2 && <p>{address.address_line_2}</p>}
                <p>{address.city}, {address.state} {address.postal_code}</p>
                <p className="address-phone">📱 {address.phone}</p>
              </div>
              {!address.is_default && (
                <button 
                  className="btn-set-default"
                  onClick={() => handleSetDefault(address.id)}
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Address Form Component
const AddressForm = ({ address, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: address?.title || '',
    full_name: address?.full_name || '',
    phone: address?.phone || '',
    address_line_1: address?.address_line_1 || '',
    address_line_2: address?.address_line_2 || '',
    city: address?.city || '',
    state: address?.state || '',
    postal_code: address?.postal_code || '',
    country: address?.country || 'India',
    is_default: address?.is_default || false
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (address) {
        await apiService.updateAddress(address.id, formData);
      } else {
        await apiService.createAddress(formData);
      }
      onSave();
    } catch (error) {
      alert('Failed to save address: ' + error.message);
      setSaving(false);
    }
  };

  return (
    <div className="address-form-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h3>{address ? 'Edit Address' : 'Add New Address'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Address Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Home, Office"
                required
              />
            </div>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                required
              />
            </div>
            <div className="form-group full-width">
              <label>Address Line 1 *</label>
              <input
                type="text"
                name="address_line_1"
                value={formData.address_line_1}
                onChange={handleChange}
                placeholder="Street address, P.O. box"
                required
              />
            </div>
            <div className="form-group full-width">
              <label>Address Line 2</label>
              <input
                type="text"
                name="address_line_2"
                value={formData.address_line_2}
                onChange={handleChange}
                placeholder="Apartment, suite, unit, building, floor, etc."
              />
            </div>
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Postal Code *</label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="form-group full-width">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={formData.is_default}
                  onChange={handleChange}
                />
                <span>Set as default address</span>
              </label>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-account" disabled={saving}>
              {saving ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Wishlist Section Component
const WishlistSection = ({ refreshStats }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await apiService.getWishlist();
      setWishlist(data);
      if (refreshStats) refreshStats();
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await apiService.removeFromWishlist(productId);
      fetchWishlist();
    } catch (error) {
      alert('Failed to remove from wishlist: ' + error.message);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${Number(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  if (loading) {
    return (
      <div className="section-content">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-content">
      <div className="section-header">
        <div>
          <h2>My Wishlist</h2>
          <p className="section-subtitle">Your favorite products</p>
        </div>
        {wishlist.length > 0 && (
          <span className="item-count">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">❤️</div>
          <h3>Your Wishlist is Empty</h3>
          <p>Save your favorite products here</p>
          <Link to="/all-products" className="btn-primary-account">
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map(item => (
            <div key={item.id} className="wishlist-card">
              <button 
                className="remove-btn"
                onClick={() => handleRemove(item.product_id)}
                title="Remove from wishlist"
              >
                ✕
              </button>
              {item.product?.image_url && (
                <img 
                  src={item.product.image_url} 
                  alt={item.product.name}
                  className="wishlist-image"
                />
              )}
              <div className="wishlist-info">
                <h4>{item.product?.name || 'Product'}</h4>
                <p className="wishlist-price">{formatCurrency(item.product?.price || 0)}</p>
                {item.product?.is_active ? (
                  <Link 
                    to={`/product/${item.product.slug || item.product_id}`}
                    className="btn-view-product"
                  >
                    View Product
                  </Link>
                ) : (
                  <span className="out-of-stock">Out of Stock</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Security Section Component
const SecuritySection = ({ changePassword }) => {
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    if (formData.new_password !== formData.confirm_password) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setSaving(false);
      return;
    }

    if (formData.new_password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setSaving(false);
      return;
    }

    try {
      await changePassword(formData.old_password, formData.new_password);
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setFormData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to change password' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="section-content">
      <div className="section-header">
        <h2>Security Settings</h2>
        <p className="section-subtitle">Manage your password and security</p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            name="old_password"
            value={formData.old_password}
            onChange={handleChange}
            placeholder="Enter current password"
            required
          />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            placeholder="Enter new password"
            required
          />
          <small className="form-help">Must be at least 6 characters</small>
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            placeholder="Confirm new password"
            required
          />
        </div>
        <button type="submit" className="btn-primary-account" disabled={saving}>
          {saving ? 'Changing Password...' : 'Change Password'}
        </button>
      </form>

      <div className="security-tips">
        <h3>Security Tips</h3>
        <ul>
          <li>Use a strong, unique password</li>
          <li>Don't share your password with anyone</li>
          <li>Change your password regularly</li>
          <li>Enable two-factor authentication (coming soon)</li>
        </ul>
      </div>
    </div>
  );
};

export default AccountPage;
