import React, { useState, useEffect } from 'react';
import '../../styles/VendorDashboard.css';

const VendorDashboard = ({ vendorData, onNavigate }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token] = useState(localStorage.getItem('vendorToken'));

  useEffect(() => {
    if (token && vendorData) {
      fetchDashboardData();
    }
  }, [token, vendorData]);

  const fetchDashboardData = async () => {
    try {
      // Fetch vendor products
      const productsResponse = await fetch(`http://127.0.0.1:8000/vendors/${vendorData.id}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      let products = [];
      if (productsResponse.ok) {
        products = await productsResponse.json();
      }

      // Calculate statistics
      const totalProducts = products.length;
      const activeProducts = products.filter(p => p.status === 'active').length;
      const totalStock = products.reduce((sum, p) => sum + (p.stock_quantity || 0), 0);
      const lowStockProducts = products.filter(p => p.stock_quantity < 10).length;

      console.log('📊 Dashboard Products:', products.slice(0, 2).map(p => ({
        name: p.name,
        status: p.status,
        statusType: typeof p.status
      })));
      console.log('✅ Active Products Count:', activeProducts);

      setDashboardData({
        products,
        stats: {
          totalProducts,
          activeProducts,
          totalStock,
          lowStockProducts
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="vendor-loading">
        <div className="loading-spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="vendor-error">
        <h3>Unable to load dashboard data</h3>
        <p>Please check your connection and try again.</p>
      </div>
    );
  }

  const { stats } = dashboardData;

  return (
    <div className="vendor-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {vendorData.business_name}! 🏪</h1>
        <p>Your Vendor Dashboard Overview</p>
      </div>

      {/* Vendor Info Card */}
      <div className="vendor-info-card">
        <div className="info-header">
          <h2>Store Information</h2>
          <span className={`status-badge ${vendorData.is_active ? 'active' : 'inactive'}`}>
            {vendorData.is_active ? '✓ Active' : '⚠ Inactive'}
          </span>
        </div>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Business Name:</span>
            <span className="info-value">{vendorData.business_name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Contact:</span>
            <span className="info-value">{vendorData.contact_number}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{vendorData.contact_email}</span>
          </div>
          {vendorData.address && (
            <div className="info-item full-width">
              <span className="info-label">Address:</span>
              <span className="info-value">{vendorData.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="dashboard-overview">
        <h2>Quick Stats</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>{stats.totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.activeProducts}</h3>
              <p>Active Products</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{stats.totalStock}</h3>
              <p>Total Stock</p>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <h3>{stats.lowStockProducts}</h3>
              <p>Low Stock Items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div className="dashboard-section">
        <h2>Recent Products</h2>
        {dashboardData.products.length > 0 ? (
          <div className="products-table">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.products.slice(0, 5).map((product) => (
                  <tr key={product.id}>
                    <td className="product-name">{product.name}</td>
                    <td className="product-price">₹{product.price.toFixed(2)}</td>
                    <td className="product-stock">
                      <span className={product.stock_quantity < 10 ? 'low-stock' : ''}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${product.status === 'active' ? 'active' : 'inactive'}`}>
                        {product.status === 'active' ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">
            <p>No products found. Add your first product to get started!</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-card" onClick={() => onNavigate?.('add-product')}>
            <span className="action-icon">➕</span>
            <span>Add Product</span>
          </button>
          <button className="action-card" onClick={() => onNavigate?.('inventory')}>
            <span className="action-icon">📝</span>
            <span>Manage Inventory</span>
          </button>
          <button className="action-card" onClick={() => onNavigate?.('reports')}>
            <span className="action-icon">📊</span>
            <span>View Reports</span>
          </button>
          <button className="action-card" onClick={() => onNavigate?.('settings')}>
            <span className="action-icon">⚙️</span>
            <span>Store Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
