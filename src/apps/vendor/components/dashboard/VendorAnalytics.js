import React, { useState, useEffect } from 'react';
import '../../styles/VendorAnalytics.css';

const VendorAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    overview: {},
    salesTrends: [],
    topProducts: [],
    customerInsights: {},
    performance: {}
  });
  const [timeRange, setTimeRange] = useState('7days');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with API calls
  useEffect(() => {
    const mockData = {
      overview: {
        totalRevenue: 156750,
        totalOrders: 342,
        averageOrderValue: 458,
        conversionRate: 3.2,
        customerRetention: 68,
        profitMargin: 24.5,
        revenueGrowth: 12.3,
        orderGrowth: 8.7
      },
      salesTrends: [
        { date: '2024-03-15', revenue: 12500, orders: 28 },
        { date: '2024-03-16', revenue: 15200, orders: 32 },
        { date: '2024-03-17', revenue: 9800, orders: 22 },
        { date: '2024-03-18', revenue: 18600, orders: 41 },
        { date: '2024-03-19', revenue: 22100, orders: 48 },
        { date: '2024-03-20', revenue: 16300, orders: 35 },
        { date: '2024-03-21', revenue: 19200, orders: 42 }
      ],
      topProducts: [
        { id: 1, name: 'Wireless Headphones Pro', sales: 85, revenue: 42500, growth: 15.2 },
        { id: 2, name: 'Smart Fitness Watch', sales: 62, revenue: 31000, growth: 8.9 },
        { id: 3, name: 'Bluetooth Speaker Mini', sales: 47, revenue: 14100, growth: -2.1 },
        { id: 4, name: 'USB-C Hub Adapter', sales: 38, revenue: 11400, growth: 22.5 },
        { id: 5, name: 'Phone Case Premium', sales: 33, revenue: 8250, growth: 5.3 }
      ],
      customerInsights: {
        totalCustomers: 1247,
        newCustomers: 89,
        returningCustomers: 253,
        avgCustomerLifetime: 8.5,
        topLocations: [
          { city: 'Mumbai', customers: 234, revenue: 45600 },
          { city: 'Delhi', customers: 189, revenue: 38200 },
          { city: 'Bangalore', customers: 156, revenue: 31800 },
          { city: 'Chennai', customers: 98, revenue: 19600 },
          { city: 'Pune', customers: 87, revenue: 17400 }
        ]
      },
      performance: {
        inventoryTurnover: 4.2,
        averageDeliveryTime: 2.8,
        returnRate: 3.5,
        customerSatisfaction: 4.6,
        responseTime: 2.1,
        fulfillmentRate: 98.5
      }
    };

    setAnalyticsData(mockData);
    setLoading(false);
  }, [timeRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthIndicator = (growth) => {
    if (growth > 0) {
      return <span className="growth-positive">↗️ +{growth}%</span>;
    } else if (growth < 0) {
      return <span className="growth-negative">↘️ {growth}%</span>;
    }
    return <span className="growth-neutral">➡️ 0%</span>;
  };

  const renderOverviewTab = () => (
    <div className="analytics-overview">
      <div className="metrics-grid">
        <div className="metric-card revenue">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>{formatCurrency(analyticsData.overview.totalRevenue)}</h3>
            <p>Total Revenue</p>
            {getGrowthIndicator(analyticsData.overview.revenueGrowth)}
          </div>
        </div>
        <div className="metric-card orders">
          <div className="metric-icon">📦</div>
          <div className="metric-content">
            <h3>{analyticsData.overview.totalOrders}</h3>
            <p>Total Orders</p>
            {getGrowthIndicator(analyticsData.overview.orderGrowth)}
          </div>
        </div>
        <div className="metric-card aov">
          <div className="metric-icon">🛒</div>
          <div className="metric-content">
            <h3>{formatCurrency(analyticsData.overview.averageOrderValue)}</h3>
            <p>Average Order Value</p>
          </div>
        </div>
        <div className="metric-card conversion">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>{analyticsData.overview.conversionRate}%</h3>
            <p>Conversion Rate</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h4>Sales Trend</h4>
          <div className="sales-chart">
            {analyticsData.salesTrends.map((trend, index) => (
              <div key={index} className="chart-bar">
                <div 
                  className="bar" 
                  style={{ height: `${(trend.revenue / 25000) * 100}%` }}
                  title={`${new Date(trend.date).toLocaleDateString()}: ${formatCurrency(trend.revenue)}`}
                ></div>
                <span className="bar-label">{new Date(trend.date).getDate()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="performance-indicators">
          <h4>Performance Indicators</h4>
          <div className="indicators-grid">
            <div className="indicator">
              <span className="indicator-label">Customer Retention</span>
              <div className="indicator-bar">
                <div 
                  className="indicator-fill" 
                  style={{ width: `${analyticsData.overview.customerRetention}%` }}
                ></div>
              </div>
              <span className="indicator-value">{analyticsData.overview.customerRetention}%</span>
            </div>
            <div className="indicator">
              <span className="indicator-label">Profit Margin</span>
              <div className="indicator-bar">
                <div 
                  className="indicator-fill profit" 
                  style={{ width: `${analyticsData.overview.profitMargin}%` }}
                ></div>
              </div>
              <span className="indicator-value">{analyticsData.overview.profitMargin}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProductsTab = () => (
    <div className="analytics-products">
      <h4>Top Performing Products</h4>
      <div className="products-list">
        {analyticsData.topProducts.map((product, index) => (
          <div key={product.id} className="product-item">
            <div className="product-rank">#{index + 1}</div>
            <div className="product-info">
              <h5>{product.name}</h5>
              <div className="product-stats">
                <span className="stat-item">
                  <span className="stat-label">Sales:</span>
                  <span className="stat-value">{product.sales} units</span>
                </span>
                <span className="stat-item">
                  <span className="stat-label">Revenue:</span>
                  <span className="stat-value">{formatCurrency(product.revenue)}</span>
                </span>
              </div>
            </div>
            <div className="product-growth">
              {getGrowthIndicator(product.growth)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCustomersTab = () => (
    <div className="analytics-customers">
      <div className="customer-metrics">
        <div className="customer-metric">
          <div className="metric-icon">👥</div>
          <div className="metric-info">
            <h4>{analyticsData.customerInsights.totalCustomers}</h4>
            <p>Total Customers</p>
          </div>
        </div>
        <div className="customer-metric">
          <div className="metric-icon">🆕</div>
          <div className="metric-info">
            <h4>{analyticsData.customerInsights.newCustomers}</h4>
            <p>New Customers</p>
          </div>
        </div>
        <div className="customer-metric">
          <div className="metric-icon">🔄</div>
          <div className="metric-info">
            <h4>{analyticsData.customerInsights.returningCustomers}</h4>
            <p>Returning Customers</p>
          </div>
        </div>
        <div className="customer-metric">
          <div className="metric-icon">⏰</div>
          <div className="metric-info">
            <h4>{analyticsData.customerInsights.avgCustomerLifetime} months</h4>
            <p>Avg Customer Lifetime</p>
          </div>
        </div>
      </div>

      <div className="top-locations">
        <h4>Top Customer Locations</h4>
        <div className="locations-list">
          {analyticsData.customerInsights.topLocations.map((location, index) => (
            <div key={index} className="location-item">
              <div className="location-rank">#{index + 1}</div>
              <div className="location-info">
                <h5>{location.city}</h5>
                <div className="location-stats">
                  <span>{location.customers} customers</span>
                  <span>{formatCurrency(location.revenue)} revenue</span>
                </div>
              </div>
              <div className="location-bar">
                <div 
                  className="location-fill" 
                  style={{ width: `${(location.revenue / 50000) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="analytics-performance">
      <h4>Business Performance Metrics</h4>
      <div className="performance-grid">
        <div className="performance-card">
          <div className="performance-icon">📊</div>
          <div className="performance-content">
            <h5>Inventory Turnover</h5>
            <div className="performance-value">{analyticsData.performance.inventoryTurnover}x</div>
            <p>How quickly inventory sells</p>
          </div>
        </div>
        <div className="performance-card">
          <div className="performance-icon">🚚</div>
          <div className="performance-content">
            <h5>Avg Delivery Time</h5>
            <div className="performance-value">{analyticsData.performance.averageDeliveryTime} days</div>
            <p>Average shipping duration</p>
          </div>
        </div>
        <div className="performance-card">
          <div className="performance-icon">↩️</div>
          <div className="performance-content">
            <h5>Return Rate</h5>
            <div className="performance-value">{analyticsData.performance.returnRate}%</div>
            <p>Percentage of returned orders</p>
          </div>
        </div>
        <div className="performance-card">
          <div className="performance-icon">⭐</div>
          <div className="performance-content">
            <h5>Customer Satisfaction</h5>
            <div className="performance-value">{analyticsData.performance.customerSatisfaction}/5</div>
            <p>Average customer rating</p>
          </div>
        </div>
        <div className="performance-card">
          <div className="performance-icon">⚡</div>
          <div className="performance-content">
            <h5>Response Time</h5>
            <div className="performance-value">{analyticsData.performance.responseTime} hrs</div>
            <p>Average support response</p>
          </div>
        </div>
        <div className="performance-card">
          <div className="performance-icon">✅</div>
          <div className="performance-content">
            <h5>Fulfillment Rate</h5>
            <div className="performance-value">{analyticsData.performance.fulfillmentRate}%</div>
            <p>Successfully fulfilled orders</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="loading-spinner">Loading analytics...</div>;
  }

  return (
    <div className="vendor-analytics">
      <div className="analytics-header">
        <h2>Business Analytics</h2>
        <p>Comprehensive insights into your business performance</p>
      </div>

      <div className="analytics-controls">
        <div className="time-range-selector">
          <label>Time Range:</label>
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 3 Months</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
        <div className="export-actions">
          <button className="btn-secondary">Export PDF</button>
          <button className="btn-secondary">Export Excel</button>
        </div>
      </div>

      <div className="analytics-tabs">
        <div className="tab-nav">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            🛍️ Products
          </button>
          <button 
            className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            👥 Customers
          </button>
          <button 
            className={`tab-btn ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            🎯 Performance
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'products' && renderProductsTab()}
          {activeTab === 'customers' && renderCustomersTab()}
          {activeTab === 'performance' && renderPerformanceTab()}
        </div>
      </div>
    </div>
  );
};

export default VendorAnalytics;