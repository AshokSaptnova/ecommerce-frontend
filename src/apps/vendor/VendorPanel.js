import React, { useState, useEffect } from 'react';
import VendorLogin from './components/VendorLogin';
import VendorSidebar from './components/VendorSidebar';
import VendorDashboard from './components/dashboard/VendorDashboard';
import VendorProductManagement from './components/products/VendorProductManagement';
import VendorAddProduct from './components/products/VendorAddProduct';
import VendorOrders from './components/orders/VendorOrders';
import VendorInventory from './components/products/VendorInventory';
import VendorInventoryAdvanced from './components/products/VendorInventoryAdvanced';
import VendorProfile from './components/settings/VendorProfile';
import VendorReports from './components/finance/VendorReports';
import VendorSettings from './components/settings/VendorSettings';
import VendorFinancials from './components/finance/VendorFinancials';
import VendorShipping from './components/settings/VendorShipping';
import VendorCustomers from './components/customers/VendorCustomers';
import VendorPromotions from './components/marketing/VendorPromotions';
import VendorAnalytics from './components/dashboard/VendorAnalytics';
import './styles/VendorPanel.css';

const VendorPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [vendorUser, setVendorUser] = useState(null);
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if vendor is already logged in
    const token = localStorage.getItem('vendorToken');
    const userData = localStorage.getItem('vendorUser');
    const vendorInfo = localStorage.getItem('vendorData');
    
    if (token && userData && vendorInfo) {
      setIsAuthenticated(true);
      setVendorUser(JSON.parse(userData));
      setVendorData(JSON.parse(vendorInfo));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token, vendorInfo) => {
    localStorage.setItem('vendorToken', token);
    localStorage.setItem('vendorUser', JSON.stringify(userData));
    localStorage.setItem('vendorData', JSON.stringify(vendorInfo));
    setVendorUser(userData);
    setVendorData(vendorInfo);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('vendorToken');
    localStorage.removeItem('vendorUser');
    localStorage.removeItem('vendorData');
    setVendorUser(null);
    setVendorData(null);
    setIsAuthenticated(false);
    setCurrentSection('dashboard');
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return <VendorDashboard vendorData={vendorData} onNavigate={setCurrentSection} />;
      case 'products':
        return <VendorProductManagement vendorData={vendorData} />;
      case 'add-product':
        return <VendorAddProduct vendorData={vendorData} />;
      case 'orders':
        return <VendorOrders vendorData={vendorData} />;
      case 'inventory':
        return <VendorInventory vendorData={vendorData} />;
      case 'inventory-advanced':
        return <VendorInventoryAdvanced vendorData={vendorData} />;
      case 'financials':
        return <VendorFinancials vendorData={vendorData} />;
      case 'shipping':
        return <VendorShipping vendorData={vendorData} />;
      case 'customers':
        return <VendorCustomers vendorData={vendorData} />;
      case 'promotions':
        return <VendorPromotions vendorData={vendorData} />;
      case 'analytics':
        return <VendorAnalytics vendorData={vendorData} />;
      case 'profile':
        return <VendorProfile vendorData={vendorData} />;
      case 'reports':
        return <VendorReports vendorData={vendorData} />;
      case 'settings':
        return <VendorSettings vendorData={vendorData} />;
      default:
        return <VendorDashboard vendorData={vendorData} />;
    }
  };

  if (loading) {
    return (
      <div className="vendor-loading">
        <div className="loading-spinner"></div>
        <p>Loading Vendor Portal...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <VendorLogin onLogin={handleLogin} />;
  }

  return (
    <div className="vendor-panel">
      <VendorSidebar 
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        vendorUser={vendorUser}
        onLogout={handleLogout}
      />
      <div className="vendor-content">
        <div className="vendor-header">
          <h1>Vendor Dashboard</h1>
          <div className="vendor-user-info">
            <span className="store-badge">🏪 {vendorData?.business_name}</span>
            <button onClick={handleLogout} className="logout-btn-header">Logout</button>
          </div>
        </div>
        <div className="vendor-main">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default VendorPanel;
