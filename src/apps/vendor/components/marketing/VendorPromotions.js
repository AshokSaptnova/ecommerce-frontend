import React, { useState, useEffect } from 'react';
import '../../styles/VendorPromotions.css';

const VendorPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [promotionStats, setPromotionStats] = useState({
    activePromotions: 0,
    totalRedemptions: 0,
    totalSavings: 0,
    conversionRate: 0
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPromotion, setNewPromotion] = useState({
    name: '',
    type: 'percentage',
    value: '',
    code: '',
    description: '',
    minOrderValue: '',
    maxDiscount: '',
    usageLimit: '',
    startDate: '',
    endDate: '',
    applicableProducts: 'all'
  });

  // Mock data - replace with API calls
  useEffect(() => {
    const mockPromotions = [
      {
        id: 1,
        name: 'Summer Sale 2024',
        type: 'percentage',
        value: 25,
        code: 'SUMMER25',
        description: 'Get 25% off on all summer collection items',
        minOrderValue: 1000,
        maxDiscount: 2000,
        usageLimit: 500,
        usedCount: 156,
        startDate: '2024-03-01',
        endDate: '2024-04-30',
        status: 'active',
        applicableProducts: 'category',
        totalSavings: 45600,
        conversionRate: 12.5
      },
      {
        id: 2,
        name: 'First Time Buyer',
        type: 'fixed',
        value: 200,
        code: 'WELCOME200',
        description: 'Welcome bonus for new customers',
        minOrderValue: 500,
        maxDiscount: 200,
        usageLimit: 1000,
        usedCount: 89,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'active',
        applicableProducts: 'all',
        totalSavings: 17800,
        conversionRate: 8.9
      },
      {
        id: 3,
        name: 'Bulk Order Discount',
        type: 'percentage',
        value: 15,
        code: 'BULK15',
        description: 'Special discount for bulk orders',
        minOrderValue: 5000,
        maxDiscount: 1500,
        usageLimit: 100,
        usedCount: 23,
        startDate: '2024-02-15',
        endDate: '2024-05-15',
        status: 'active',
        applicableProducts: 'selected',
        totalSavings: 12400,
        conversionRate: 23.0
      },
      {
        id: 4,
        name: 'Valentine Special',
        type: 'percentage',
        value: 20,
        code: 'LOVE20',
        description: 'Valentine\'s day special offer',
        minOrderValue: 800,
        maxDiscount: 1000,
        usageLimit: 200,
        usedCount: 200,
        startDate: '2024-02-10',
        endDate: '2024-02-16',
        status: 'expired',
        applicableProducts: 'category',
        totalSavings: 8900,
        conversionRate: 18.5
      }
    ];

    setPromotions(mockPromotions);
    setPromotionStats({
      activePromotions: mockPromotions.filter(p => p.status === 'active').length,
      totalRedemptions: mockPromotions.reduce((sum, p) => sum + p.usedCount, 0),
      totalSavings: mockPromotions.reduce((sum, p) => sum + p.totalSavings, 0),
      conversionRate: mockPromotions.reduce((sum, p) => sum + p.conversionRate, 0) / mockPromotions.length
    });
    setLoading(false);
  }, []);

  const generatePromoCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPromotion(prev => ({ ...prev, code: result }));
  };

  const handleCreatePromotion = (e) => {
    e.preventDefault();
    const promotion = {
      ...newPromotion,
      id: Date.now(),
      usedCount: 0,
      status: 'active',
      totalSavings: 0,
      conversionRate: 0,
      usageLimit: parseInt(newPromotion.usageLimit) || 0,
      value: parseFloat(newPromotion.value) || 0,
      minOrderValue: parseFloat(newPromotion.minOrderValue) || 0,
      maxDiscount: parseFloat(newPromotion.maxDiscount) || 0
    };
    
    setPromotions([...promotions, promotion]);
    setNewPromotion({
      name: '',
      type: 'percentage',
      value: '',
      code: '',
      description: '',
      minOrderValue: '',
      maxDiscount: '',
      usageLimit: '',
      startDate: '',
      endDate: '',
      applicableProducts: 'all'
    });
    setShowCreateModal(false);
    alert('Promotion created successfully!');
  };

  const handleToggleStatus = (id) => {
    setPromotions(promotions.map(promo => 
      promo.id === id 
        ? { ...promo, status: promo.status === 'active' ? 'paused' : 'active' }
        : promo
    ));
  };

  const handleDeletePromotion = (id) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      setPromotions(promotions.filter(promo => promo.id !== id));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: 'status-active', text: 'Active' },
      paused: { class: 'status-paused', text: 'Paused' },
      expired: { class: 'status-expired', text: 'Expired' }
    };
    const config = statusConfig[status] || statusConfig.active;
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const formatDiscount = (type, value) => {
    return type === 'percentage' ? `${value}%` : `₹${value}`;
  };

  if (loading) {
    return <div className="loading-spinner">Loading promotions...</div>;
  }

  return (
    <div className="vendor-promotions">
      <div className="promotions-header">
        <h2>Marketing & Promotions</h2>
        <p>Create and manage promotional campaigns to boost your sales</p>
      </div>

      {/* Promotion Statistics */}
      <div className="promotion-stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{promotionStats.activePromotions}</h3>
            <p>Active Promotions</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎫</div>
          <div className="stat-content">
            <h3>{promotionStats.totalRedemptions}</h3>
            <p>Total Redemptions</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>₹{promotionStats.totalSavings.toLocaleString()}</h3>
            <p>Customer Savings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>{promotionStats.conversionRate.toFixed(1)}%</h3>
            <p>Avg Conversion Rate</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="promotions-actions">
        <button 
          className="btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          Create New Promotion
        </button>
        <div className="action-buttons">
          <button className="btn-secondary">Export Report</button>
          <button className="btn-secondary">Promotion Analytics</button>
        </div>
      </div>

      {/* Promotions Grid */}
      <div className="promotions-grid">
        {promotions.map(promotion => (
          <div key={promotion.id} className="promotion-card">
            <div className="promotion-header">
              <div className="promotion-title">
                <h4>{promotion.name}</h4>
                {getStatusBadge(promotion.status)}
              </div>
              <div className="promotion-actions">
                <button 
                  className="action-btn"
                  onClick={() => handleToggleStatus(promotion.id)}
                  title={promotion.status === 'active' ? 'Pause' : 'Activate'}
                >
                  {promotion.status === 'active' ? '⏸️' : '▶️'}
                </button>
                <button 
                  className="action-btn"
                  onClick={() => setSelectedPromotion(promotion)}
                  title="View Details"
                >
                  👁️
                </button>
                <button 
                  className="action-btn delete"
                  onClick={() => handleDeletePromotion(promotion.id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>

            <div className="promotion-code">
              <span className="code-label">Promo Code:</span>
              <span className="code-value">{promotion.code}</span>
            </div>

            <div className="promotion-details">
              <div className="discount-info">
                <span className="discount-value">
                  {formatDiscount(promotion.type, promotion.value)} OFF
                </span>
                {promotion.type === 'percentage' && promotion.maxDiscount && (
                  <span className="max-discount">Max ₹{promotion.maxDiscount}</span>
                )}
              </div>
              <p className="promotion-description">{promotion.description}</p>
            </div>

            <div className="promotion-conditions">
              <div className="condition-item">
                <span className="condition-label">Min Order:</span>
                <span>₹{promotion.minOrderValue}</span>
              </div>
              <div className="condition-item">
                <span className="condition-label">Valid Until:</span>
                <span>{new Date(promotion.endDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="promotion-usage">
              <div className="usage-bar">
                <div 
                  className="usage-fill" 
                  style={{ width: `${(promotion.usedCount / promotion.usageLimit) * 100}%` }}
                ></div>
              </div>
              <div className="usage-text">
                {promotion.usedCount} / {promotion.usageLimit} used
              </div>
            </div>

            <div className="promotion-stats">
              <div className="stat-item">
                <span className="stat-label">Savings:</span>
                <span className="stat-value">₹{promotion.totalSavings.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Conversion:</span>
                <span className="stat-value">{promotion.conversionRate}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Promotion Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content promotion-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Promotion</h3>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreatePromotion} className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Promotion Name</label>
                  <input
                    type="text"
                    value={newPromotion.name}
                    onChange={(e) => setNewPromotion({...newPromotion, name: e.target.value})}
                    required
                    placeholder="e.g., Summer Sale 2024"
                  />
                </div>
                <div className="form-group">
                  <label>Discount Type</label>
                  <select
                    value={newPromotion.type}
                    onChange={(e) => setNewPromotion({...newPromotion, type: e.target.value})}
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Discount Value</label>
                  <input
                    type="number"
                    value={newPromotion.value}
                    onChange={(e) => setNewPromotion({...newPromotion, value: e.target.value})}
                    required
                    placeholder={newPromotion.type === 'percentage' ? '25' : '200'}
                  />
                </div>
                <div className="form-group">
                  <label>Promo Code</label>
                  <div className="code-input-group">
                    <input
                      type="text"
                      value={newPromotion.code}
                      onChange={(e) => setNewPromotion({...newPromotion, code: e.target.value.toUpperCase()})}
                      required
                      placeholder="SUMMER25"
                    />
                    <button type="button" onClick={generatePromoCode} className="generate-btn">
                      Generate
                    </button>
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    value={newPromotion.description}
                    onChange={(e) => setNewPromotion({...newPromotion, description: e.target.value})}
                    placeholder="Describe your promotion..."
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Minimum Order Value</label>
                  <input
                    type="number"
                    value={newPromotion.minOrderValue}
                    onChange={(e) => setNewPromotion({...newPromotion, minOrderValue: e.target.value})}
                    placeholder="1000"
                  />
                </div>
                <div className="form-group">
                  <label>Maximum Discount</label>
                  <input
                    type="number"
                    value={newPromotion.maxDiscount}
                    onChange={(e) => setNewPromotion({...newPromotion, maxDiscount: e.target.value})}
                    placeholder="2000"
                  />
                </div>
                <div className="form-group">
                  <label>Usage Limit</label>
                  <input
                    type="number"
                    value={newPromotion.usageLimit}
                    onChange={(e) => setNewPromotion({...newPromotion, usageLimit: e.target.value})}
                    placeholder="500"
                  />
                </div>
                <div className="form-group">
                  <label>Applicable Products</label>
                  <select
                    value={newPromotion.applicableProducts}
                    onChange={(e) => setNewPromotion({...newPromotion, applicableProducts: e.target.value})}
                  >
                    <option value="all">All Products</option>
                    <option value="category">Specific Category</option>
                    <option value="selected">Selected Products</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={newPromotion.startDate}
                    onChange={(e) => setNewPromotion({...newPromotion, startDate: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={newPromotion.endDate}
                    onChange={(e) => setNewPromotion({...newPromotion, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Promotion Detail Modal */}
      {selectedPromotion && (
        <div className="modal-overlay" onClick={() => setSelectedPromotion(null)}>
          <div className="modal-content detail-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedPromotion.name}</h3>
              <button className="close-btn" onClick={() => setSelectedPromotion(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="promotion-detail-grid">
                <div className="detail-section">
                  <h4>Promotion Details</h4>
                  <div className="detail-item">
                    <label>Code:</label>
                    <span className="code-highlight">{selectedPromotion.code}</span>
                  </div>
                  <div className="detail-item">
                    <label>Discount:</label>
                    <span>{formatDiscount(selectedPromotion.type, selectedPromotion.value)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    {getStatusBadge(selectedPromotion.status)}
                  </div>
                  <div className="detail-item">
                    <label>Description:</label>
                    <p>{selectedPromotion.description}</p>
                  </div>
                </div>
                <div className="detail-section">
                  <h4>Usage & Performance</h4>
                  <div className="detail-item">
                    <label>Usage:</label>
                    <span>{selectedPromotion.usedCount} / {selectedPromotion.usageLimit}</span>
                  </div>
                  <div className="detail-item">
                    <label>Customer Savings:</label>
                    <span>₹{selectedPromotion.totalSavings.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Conversion Rate:</label>
                    <span>{selectedPromotion.conversionRate}%</span>
                  </div>
                  <div className="detail-item">
                    <label>Valid Period:</label>
                    <span>
                      {new Date(selectedPromotion.startDate).toLocaleDateString()} - 
                      {new Date(selectedPromotion.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorPromotions;