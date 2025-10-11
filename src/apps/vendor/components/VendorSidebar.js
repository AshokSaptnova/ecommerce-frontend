import React from 'react';
import '../styles/VendorSidebar.css';

const VendorSidebar = ({ currentSection, onSectionChange, vendorUser, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'products', icon: '📦', label: 'My Products' },
    { id: 'add-product', icon: '➕', label: 'Add Product' },
    { id: 'orders', icon: '📋', label: 'Orders' },
    { id: 'inventory', icon: '📊', label: 'Inventory' },
    { id: 'inventory-advanced', icon: '🔧', label: 'Advanced Inventory' },
    { id: 'financials', icon: '💰', label: 'Financials' },
    { id: 'shipping', icon: '🚚', label: 'Shipping' },
    { id: 'customers', icon: '👥', label: 'Customers' },
    { id: 'promotions', icon: '🎯', label: 'Promotions' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'profile', icon: '🏪', label: 'Store Profile' },
    { id: 'reports', icon: '�', label: 'Reports' },
    { id: 'settings', icon: '⚙️', label: 'Settings' }
  ];

  return (
    <div className="vendor-sidebar">
      <div className="sidebar-header">
        <div className="vendor-logo">🏪</div>
        <h2>Vendor Portal</h2>
        <p className="vendor-name">{vendorUser?.email}</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentSection === item.id ? 'active' : ''}`}
            onClick={() => onSectionChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default VendorSidebar;
