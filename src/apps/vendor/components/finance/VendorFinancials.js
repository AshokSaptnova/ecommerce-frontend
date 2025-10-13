import React, { useState, useEffect } from 'react';
import { vendorApi } from '../../services/vendorApi';
import '../../styles/VendorFinancials.css';

const VendorFinancials = ({ vendorData }) => {
  const [financialData, setFinancialData] = useState({
    totalRevenue: 0,
    thisMonthRevenue: 0,
    pendingPayouts: 0,
    totalCommission: 0,
    availableBalance: 0,
    payoutHistory: []
  });
  const [payoutRequests, setPayoutRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const token = localStorage.getItem('vendorToken');

  useEffect(() => {
    fetchFinancialData();
    fetchPayoutHistory();
  }, [selectedPeriod]);

  const fetchFinancialData = async () => {
    try {
      const data = await vendorApi.getFinancials(selectedPeriod, token);
      setFinancialData(data);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayoutHistory = async () => {
    try {
      const data = await vendorApi.getPayouts(token);
      setPayoutRequests(data);
    } catch (error) {
      console.error('Error fetching payout history:', error);
    }
  };

  const handlePayoutRequest = async (e) => {
    e.preventDefault();
    if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
      alert('Please enter a valid payout amount');
      return;
    }

    if (parseFloat(payoutAmount) > financialData.availableBalance) {
      alert('Insufficient balance for payout request');
      return;
    }

    try {
      await vendorApi.requestPayout(parseFloat(payoutAmount), token);
      alert('Payout request submitted successfully!');
      setShowPayoutModal(false);
      setPayoutAmount('');
      fetchFinancialData();
      fetchPayoutHistory();
    } catch (error) {
      console.error('Error submitting payout request:', error);
      alert('Failed to submit payout request');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'pending': 'status-pending',
      'processing': 'status-processing',
      'completed': 'status-completed',
      'failed': 'status-failed'
    };
    return `status-badge ${statusClasses[status] || ''}`;
  };

  if (loading) {
    return <div className="loading">Loading financial data...</div>;
  }

  return (
    <div className="vendor-financials">
      <div className="page-header">
        <h2>💰 Financial Management</h2>
        <p>Track your revenue, commissions, and manage payouts</p>
        <div className="header-actions">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-selector"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button 
            className="btn-payout-request"
            onClick={() => setShowPayoutModal(true)}
            disabled={financialData.availableBalance <= 0}
          >
            Request Payout
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="financial-cards">
        <div className="financial-card revenue">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <h3>Total Revenue</h3>
            <div className="amount">{formatCurrency(financialData.totalRevenue)}</div>
            <div className="change positive">+12.5% from last period</div>
          </div>
        </div>

        <div className="financial-card monthly">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>Current Period</h3>
            <div className="amount">{formatCurrency(financialData.thisMonthRevenue)}</div>
            <div className="change positive">+8.3% growth</div>
          </div>
        </div>

        <div className="financial-card commission">
          <div className="card-icon">💸</div>
          <div className="card-content">
            <h3>Total Commission</h3>
            <div className="amount">{formatCurrency(financialData.totalCommission)}</div>
            <div className="change neutral">Platform fees</div>
          </div>
        </div>

        <div className="financial-card balance">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Available Balance</h3>
            <div className="amount">{formatCurrency(financialData.availableBalance)}</div>
            <div className="change">Ready for payout</div>
          </div>
        </div>
      </div>

      {/* Payout History */}
      <div className="payout-section">
        <h3>💳 Payout History</h3>
        {payoutRequests.length > 0 ? (
          <div className="payout-table-container">
            <table className="payout-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Method</th>
                  <th>Transaction ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payoutRequests.map((payout) => (
                  <tr key={payout.id}>
                    <td>{new Date(payout.created_at).toLocaleDateString()}</td>
                    <td>{formatCurrency(payout.amount)}</td>
                    <td>
                      <span className={getStatusBadge(payout.status)}>
                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                      </span>
                    </td>
                    <td>{payout.payment_method || 'Bank Transfer'}</td>
                    <td>{payout.transaction_id || '-'}</td>
                    <td>
                      <button className="btn-view-details">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-payouts">
            <p>No payout requests yet. Request your first payout when you have available balance!</p>
          </div>
        )}
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="revenue-chart-section">
        <h3>📈 Revenue Trends</h3>
        <div className="chart-placeholder">
          <p>Revenue chart will be displayed here</p>
          <div className="mock-chart">
            <div className="chart-bars">
              {[40, 60, 35, 80, 55, 75, 90].map((height, index) => (
                <div 
                  key={index} 
                  className="chart-bar" 
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
            <div className="chart-labels">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payout Request Modal */}
      {showPayoutModal && (
        <div className="modal-overlay" onClick={() => setShowPayoutModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>💳 Request Payout</h3>
              <button className="modal-close" onClick={() => setShowPayoutModal(false)}>×</button>
            </div>
            
            <form onSubmit={handlePayoutRequest} className="payout-form">
              <div className="form-group">
                <label>Available Balance</label>
                <div className="balance-display">{formatCurrency(financialData.availableBalance)}</div>
              </div>
              
              <div className="form-group">
                <label htmlFor="payoutAmount">Payout Amount *</label>
                <input
                  type="number"
                  id="payoutAmount"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  max={financialData.availableBalance}
                  step="0.01"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Payment Method</label>
                <select disabled>
                  <option>Bank Transfer (Default)</option>
                </select>
                <small>You can update payment details in Settings</small>
              </div>
              
              <div className="payout-info">
                <p><strong>Processing Time:</strong> 3-5 business days</p>
                <p><strong>Processing Fee:</strong> ₹25 + 1% (deducted from payout)</p>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowPayoutModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Request Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorFinancials;