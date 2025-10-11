import React from 'react';
import '../styles/AdminSidebar.css';

const AdminSidebar = ({ currentSection, onSectionChange, adminUser, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'vendors', label: 'Vendor Management', icon: '🏪' },
    { id: 'products', label: 'Product Management', icon: '📦' },
    { id: 'orders', label: 'Order Management', icon: '📋' },
    { id: 'categories', label: 'Categories', icon: '🏷️' },
    { id: 'reports', label: 'Reports & Analytics', icon: '📈' },
    { id: 'settings', label: 'System Settings', icon: '⚙️' }
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <h3>🛒 Admin Panel</h3>
        </div>
        <div className="admin-info">
          <div className="admin-avatar">👤</div>
          <div className="admin-details">
            <strong>Admin</strong>
            <small>{adminUser?.email}</small>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.id} className="nav-item-li">
              <button
                className={`nav-button ${currentSection === item.id ? 'active' : ''}`}
                onClick={() => onSectionChange(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button onClick={onLogout} className="logout-button">
          <span className="logout-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;