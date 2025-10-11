import React, { useState, useEffect } from 'react';
import '../../styles/VendorReports.css';

const VendorReports = ({ vendorData }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [token] = useState(localStorage.getItem('vendorToken'));

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      // Fetch vendor products and orders
      const productsResponse = await fetch(`http://127.0.0.1:8000/vendors/${vendorData.id}/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const ordersResponse = await fetch(`http://127.0.0.1:8000/vendors/${vendorData.id}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (productsResponse.ok && ordersResponse.ok) {
        const products = await productsResponse.json();
        const orders = await ordersResponse.json();

        // Calculate metrics
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        const totalOrders = orders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const totalProducts = products.length;
        const activeProducts = products.filter(p => p.is_active).length;
        const totalStock = products.reduce((sum, p) => sum + p.stock_quantity, 0);

        // Top products by stock value
        const topProducts = products
          .map(p => ({
            name: p.name,
            value: p.price * p.stock_quantity,
            stock: p.stock_quantity
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);

        setReportData({
          totalRevenue,
          totalOrders,
          averageOrderValue,
          totalProducts,
          activeProducts,
          totalStock,
          topProducts
        });
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Generating reports...</p>
      </div>
    );
  }

  return (
    <div className="vendor-reports">
      <div className="page-header">
        <h1>Sales Reports & Analytics</h1>
        <p>Track your store's performance and insights</p>
      </div>

      {/* Date Range Selector */}
      <div className="report-controls">
        <div className="date-selector">
          <label>Report Period:</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last Year</option>
          </select>
        </div>
        <button className="btn-export">
          📊 Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card revenue">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>₹{reportData?.totalRevenue?.toFixed(2) || '0.00'}</h3>
            <p>Total Revenue</p>
            <span className="metric-change positive">+12.5%</span>
          </div>
        </div>

        <div className="metric-card orders">
          <div className="metric-icon">📦</div>
          <div className="metric-content">
            <h3>{reportData?.totalOrders || 0}</h3>
            <p>Total Orders</p>
            <span className="metric-change positive">+8.3%</span>
          </div>
        </div>

        <div className="metric-card average">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>₹{reportData?.averageOrderValue?.toFixed(2) || '0.00'}</h3>
            <p>Avg. Order Value</p>
            <span className="metric-change positive">+5.2%</span>
          </div>
        </div>

        <div className="metric-card products">
          <div className="metric-icon">🏪</div>
          <div className="metric-content">
            <h3>{reportData?.activeProducts || 0}/{reportData?.totalProducts || 0}</h3>
            <p>Active Products</p>
            <span className="metric-change neutral">—</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="reports-grid">
        <div className="report-card">
          <h3>📊 Sales Overview</h3>
          <div className="chart-placeholder">
            <div className="bar-chart">
              <div className="bar" style={{height: '60%'}}>
                <span className="bar-label">Week 1</span>
              </div>
              <div className="bar" style={{height: '80%'}}>
                <span className="bar-label">Week 2</span>
              </div>
              <div className="bar" style={{height: '45%'}}>
                <span className="bar-label">Week 3</span>
              </div>
              <div className="bar" style={{height: '90%'}}>
                <span className="bar-label">Week 4</span>
              </div>
            </div>
            <p className="chart-note">Visual chart integration available with charting library</p>
          </div>
        </div>

        <div className="report-card">
          <h3>🏆 Top Products by Value</h3>
          <div className="top-products-list">
            {reportData?.topProducts?.map((product, index) => (
              <div key={index} className="product-row">
                <span className="rank">#{index + 1}</span>
                <div className="product-info">
                  <span className="product-name">{product.name}</span>
                  <span className="product-stock">{product.stock} units</span>
                </div>
                <span className="product-value">₹{product.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="detailed-stats">
        <h3>Detailed Statistics</h3>
        <div className="stats-table">
          <div className="stat-row">
            <span className="stat-label">Total Inventory Value</span>
            <span className="stat-value">₹{reportData?.topProducts?.reduce((sum, p) => sum + p.value, 0).toFixed(2) || '0.00'}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Total Stock Units</span>
            <span className="stat-value">{reportData?.totalStock || 0} units</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Active Products</span>
            <span className="stat-value">{reportData?.activeProducts || 0}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Product Categories</span>
            <span className="stat-value">—</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Conversion Rate</span>
            <span className="stat-value">—</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Customer Satisfaction</span>
            <span className="stat-value">—</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorReports;
