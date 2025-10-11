import React, { useState, useEffect } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminSidebar from './components/AdminSidebar';
import AdminDashboard from './components/AdminDashboard';
import UserManagement from './components/UserManagement';
import VendorManagement from './components/VendorManagement';
import ProductManagement from './components/ProductManagement';
import OrderManagement from './components/OrderManagement';
import CategoryManagement from './components/CategoryManagement';
import Reports from './components/Reports';
import './styles/AdminPanel.css';
import SystemSettings from './components/SystemSettings';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setAdminUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(userData));
    setAdminUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdminUser(null);
    setIsAuthenticated(false);
    setCurrentSection('dashboard');
  };

const renderContent = () => {
  switch (currentSection) {
    case 'dashboard':
      return <AdminDashboard />;
    case 'users':
      return <UserManagement />;
    case 'vendors':
      return <VendorManagement />;
    case 'products':
      return <ProductManagement />;
    case 'orders':
      return <OrderManagement />;
    case 'categories':
      return <CategoryManagement />;
    case 'reports':
      return <Reports />;
    case 'settings':
      return <SystemSettings />;
    default:
      return <AdminDashboard />;
  }
};

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading Admin Panel...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="admin-panel">
      <AdminSidebar 
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        adminUser={adminUser}
        onLogout={handleLogout}
      />
      <div className="admin-content">
        <div className="admin-header">
          <h1>eCommerce Admin Panel</h1>
          <div className="admin-user-info">
            <span>Welcome, {adminUser?.email}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
        <div className="admin-main">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;