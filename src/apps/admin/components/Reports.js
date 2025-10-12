import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../services/adminApi';
import '../styles/AdminShared.css';
import '../styles/Reports.css';

const Reports = () => {
  const [reportData, setReportData] = useState({
    salesSummary: null,
    vendorPerformance: [],
    productAnalytics: [],
    revenueChart: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  });
  const [activeTab, setActiveTab] = useState('overview');

  const token = localStorage.getItem('adminToken');

  const fetchReports = useCallback(async () => {
    try {
      const params = new URLSearchParams(dateRange);
      const data = await adminApi.getReports(params.toString(), token);
      setReportData(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange, token]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const exportReport = (type) => {
    // This would trigger a download
    alert(`Exporting ${type} report...`);
  };

  if (loading) {
    return <div className="loading">Loading reports...</div>;
  }

  return (
    <div className="reports-dashboard">
      <div className="page-header">
        <h2>Reports & Analytics</h2>
        <p>Business intelligence and performance metrics</p>
        
        <div className="date-range-selector">
          <input
            type="date"
            value={dateRange.start_date}
            onChange={(e) => setDateRange({...dateRange, start_date: e.target.value})}
          />
          <span>to</span>
          <input
            type="date"
            value={dateRange.end_date}
            onChange={(e) => setDateRange({...dateRange, end_date: e.target.value})}
          />
        </div>
      </div>

      {/* Report Tabs */}
      <div className="report-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'sales' ? 'active' : ''}
          onClick={() => setActiveTab('sales')}
        >
          Sales Report
        </button>
        <button 
          className={activeTab === 'vendors' ? 'active' : ''}
          onClick={() => setActiveTab('vendors')}
        >
          Vendor Performance
        </button>
        <button 
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          Product Analytics
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="report-content">
          <div className="kpi-grid">
            <div className="kpi-card revenue">
              <h3>Total Revenue</h3>
              <div className="kpi-value">₹{reportData.salesSummary?.total_revenue?.toLocaleString() || '0'}</div>
              <div className="kpi-change positive">+12% from last month</div>
            </div>
            <div className="kpi-card orders">
              <h3>Total Orders</h3>
              <div className="kpi-value">{reportData.salesSummary?.total_orders || '0'}</div>
              <div className="kpi-change positive">+8% from last month</div>
            </div>
            <div className="kpi-card customers">
              <h3>Active Customers</h3>
              <div className="kpi-value">{reportData.salesSummary?.active_customers || '0'}</div>
              <div className="kpi-change positive">+15% from last month</div>
            </div>
            <div className="kpi-card avg-order">
              <h3>Avg Order Value</h3>
              <div className="kpi-value">₹{reportData.salesSummary?.avg_order_value?.toLocaleString() || '0'}</div>
              <div className="kpi-change negative">-3% from last month</div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-container">
              <h4>Revenue Trend (30 Days)</h4>
              <div className="revenue-chart">
                <div className="chart-placeholder">
                  📈 Revenue chart would display here
                  <br />
                  <small>Integration with Chart.js or similar library needed</small>
                </div>
              </div>
            </div>
            
            <div className="chart-container">
              <h4>Top Product Categories</h4>
              <div className="category-breakdown">
                <div className="category-item">
                  <span>Health & Wellness</span>
                  <div className="progress-bar">
                    <div className="progress" style={{width: '65%'}}></div>
                  </div>
                  <span>65%</span>
                </div>
                <div className="category-item">
                  <span>Diabetes Care</span>
                  <div className="progress-bar">
                    <div className="progress" style={{width: '25%'}}></div>
                  </div>
                  <span>25%</span>
                </div>
                <div className="category-item">
                  <span>Heart Health</span>
                  <div className="progress-bar">
                    <div className="progress" style={{width: '10%'}}></div>
                  </div>
                  <span>10%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Report Tab */}
      {activeTab === 'sales' && (
        <div className="report-content">
          <div className="report-actions">
            <button onClick={() => exportReport('sales')} className="btn-export">
              📊 Export Sales Report
            </button>
          </div>
          
          <div className="sales-summary">
            <h4>Sales Summary</h4>
            <table className="summary-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Current Period</th>
                  <th>Previous Period</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Total Sales</td>
                  <td>₹{reportData.salesSummary?.total_revenue?.toLocaleString() || '0'}</td>
                  <td>₹0</td>
                  <td className="positive">+100%</td>
                </tr>
                <tr>
                  <td>Orders Count</td>
                  <td>{reportData.salesSummary?.total_orders || '0'}</td>
                  <td>0</td>
                  <td className="positive">+100%</td>
                </tr>
                <tr>
                  <td>Average Order Value</td>
                  <td>₹{reportData.salesSummary?.avg_order_value?.toLocaleString() || '0'}</td>
                  <td>₹0</td>
                  <td className="neutral">N/A</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vendor Performance Tab */}
      {activeTab === 'vendors' && (
        <div className="report-content">
          <div className="report-actions">
            <button onClick={() => exportReport('vendors')} className="btn-export">
              📈 Export Vendor Report
            </button>
          </div>
          
          <div className="vendor-performance">
            <h4>Vendor Performance</h4>
            <table className="performance-table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Products</th>
                  <th>Orders</th>
                  <th>Revenue</th>
                  <th>Rating</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="vendor-info">
                      <strong>SAPTNOVA Healthcare</strong>
                      <small>saptnova@vendor.com</small>
                    </div>
                  </td>
                  <td>4 products</td>
                  <td>0 orders</td>
                  <td>₹0</td>
                  <td>⭐⭐⭐⭐⭐ 5.0</td>
                  <td><span className="status-badge active">Active</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Analytics Tab */}
      {activeTab === 'products' && (
        <div className="report-content">
          <div className="report-actions">
            <button onClick={() => exportReport('products')} className="btn-export">
              📦 Export Product Report
            </button>
          </div>
          
          <div className="product-analytics">
            <h4>Top Performing Products</h4>
            <div className="product-grid">
              <div className="product-card">
                <h5>InsuWish</h5>
                <p>0 orders • ₹0 revenue</p>
                <div className="product-metrics">
                  <span>Views: 0</span>
                  <span>Conversion: 0%</span>
                </div>
              </div>
              <div className="product-card">
                <h5>MadhuNova</h5>
                <p>0 orders • ₹0 revenue</p>
                <div className="product-metrics">
                  <span>Views: 0</span>
                  <span>Conversion: 0%</span>
                </div>
              </div>
              <div className="product-card">
                <h5>DiabetoCare Plus</h5>
                <p>0 orders • ₹0 revenue</p>
                <div className="product-metrics">
                  <span>Views: 0</span>
                  <span>Conversion: 0%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;