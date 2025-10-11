import React, { useState, useEffect } from 'react';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        console.error('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="admin-error">
        <h3>Unable to load dashboard data</h3>
        <p>Please check your connection and try again.</p>
      </div>
    );
  }

  const { overview, recent_performance, top_products, vendor_performance } = dashboardData;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Multi-Vendor eCommerce Platform Management</p>
      </div>

      {/* Overview Cards */}
      <div className="dashboard-overview">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <h3>{overview.total_users}</h3>
              <p>Total Users</p>
            </div>
            <div className="stat-icon users-icon">👥</div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <h3>{overview.total_vendors}</h3>
              <p>Total Vendors</p>
            </div>
            <div className="stat-icon vendors-icon">🏪</div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <h3>{overview.active_vendors}</h3>
              <p>Active Vendors</p>
            </div>
            <div className="stat-icon active-icon">✅</div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <h3>{overview.total_products}</h3>
              <p>Total Products</p>
            </div>
            <div className="stat-icon products-icon">📦</div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <h3>{overview.total_orders}</h3>
              <p>Total Orders</p>
            </div>
            <div className="stat-icon orders-icon">📋</div>
          </div>

          <div className="stat-card revenue">
            <div className="stat-content">
              <h3>${overview.total_revenue.toLocaleString()}</h3>
              <p>Total Revenue</p>
            </div>
            <div className="stat-icon revenue-icon">💰</div>
          </div>
        </div>
      </div>

      {/* Recent Performance */}
      <div className="dashboard-section">
        <h2>Recent Performance (Last 30 Days)</h2>
        <div className="performance-grid">
          <div className="performance-card">
            <h4>{recent_performance.orders_last_30_days}</h4>
            <p>Orders</p>
          </div>
          <div className="performance-card">
            <h4>${recent_performance.revenue_last_30_days.toLocaleString()}</h4>
            <p>Revenue</p>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="dashboard-section">
        <h2>Top Selling Products</h2>
        <div className="top-products">
          {top_products.length > 0 ? (
            <div className="products-list">
              {top_products.map((product, index) => (
                <div key={index} className="product-item">
                  <span className="product-rank">#{index + 1}</span>
                  <span className="product-name">{product.name}</span>
                  <span className="product-sales">{product.total_sold} sold</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <p>No sales data available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Vendor Performance */}
      <div className="dashboard-section">
        <h2>Vendor Performance</h2>
        <div className="vendor-performance">
          <div className="vendors-table">
            <div className="table-header">
              <span>Business Name</span>
              <span>Products</span>
              <span>Revenue</span>
            </div>
            {vendor_performance.map((vendor, index) => (
              <div key={index} className="table-row">
                <span className="vendor-name">{vendor.business_name}</span>
                <span className="vendor-products">{vendor.product_count}</span>
                <span className="vendor-revenue">${vendor.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;