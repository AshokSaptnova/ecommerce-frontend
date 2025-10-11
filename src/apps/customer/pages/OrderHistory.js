import React, { useState, useEffect } from 'react';
import apiService from '../../../shared/services/api';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.request('/orders/');
      setOrders(response);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: '#fbbf24',
      confirmed: '#3b82f6',
      processing: '#8b5cf6',
      shipped: '#06b6d4',
      delivered: '#10b981',
      cancelled: '#ef4444',
      refunded: '#6b7280'
    };
    return statusColors[status.toLowerCase()] || '#6b7280';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `₹${Number(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  if (loading) {
    return (
      <div className="order-history-loading">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-history-error">
        <div className="error-icon">⚠️</div>
        <h3>Failed to Load Orders</h3>
        <p>{error}</p>
        <button onClick={fetchOrders} className="retry-btn">Try Again</button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="order-history-empty">
        <div className="empty-icon">📦</div>
        <h3>No Orders Yet</h3>
        <p>Start shopping to see your orders here</p>
        <a href="/" className="shop-now-btn">Browse Products</a>
      </div>
    );
  }

  return (
    <div className="order-history">
      <div className="order-history-header">
        <h2>Order History</h2>
        <p className="order-count">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <div className="order-info">
                <h3 className="order-number">#{order.order_number}</h3>
                <span className="order-date">{formatDate(order.created_at)}</span>
              </div>
              <div className="order-status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                {order.status.toUpperCase()}
              </div>
            </div>

            <div className="order-card-body">
              <div className="order-items">
                <p className="items-label">Items:</p>
                <ul className="items-list">
                  {order.items && order.items.slice(0, 3).map((item, index) => (
                    <li key={index}>
                      {item.product?.name || 'Product'} x {item.quantity}
                    </li>
                  ))}
                  {order.items && order.items.length > 3 && (
                    <li className="more-items">+{order.items.length - 3} more items</li>
                  )}
                </ul>
              </div>

              <div className="order-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Total Amount</span>
                  <span className="detail-value amount">{formatCurrency(order.total_amount)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Payment</span>
                  <span className="detail-value">
                    {order.payment_method === 'cash_on_delivery' ? 'COD' : 
                     order.payment_method === 'online_payment' ? 'Online' :
                     order.payment_method}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Items</span>
                  <span className="detail-value">{order.items?.length || 0}</span>
                </div>
              </div>
            </div>

            <div className="order-card-footer">
              <button 
                className="view-details-btn"
                onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
              >
                {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
              </button>
              {order.status.toLowerCase() === 'delivered' && (
                <button className="reorder-btn">
                  🔄 Reorder
                </button>
              )}
            </div>

            {selectedOrder?.id === order.id && (
              <div className="order-expanded-details">
                <div className="detail-section">
                  <h4>Shipping Address</h4>
                  <p>{order.shipping_address?.full_name}</p>
                  <p>{order.shipping_address?.address_line_1}</p>
                  {order.shipping_address?.address_line_2 && <p>{order.shipping_address.address_line_2}</p>}
                  <p>{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postal_code}</p>
                  <p>Phone: {order.shipping_address?.phone}</p>
                </div>

                <div className="detail-section">
                  <h4>Order Items</h4>
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items && order.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.product?.name || 'Product'}</td>
                          <td>{formatCurrency(item.unit_price)}</td>
                          <td>{item.quantity}</td>
                          <td>{formatCurrency(item.unit_price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3"><strong>Subtotal</strong></td>
                        <td><strong>{formatCurrency(order.subtotal || order.total_amount)}</strong></td>
                      </tr>
                      {order.tax_amount > 0 && (
                        <tr>
                          <td colSpan="3">Tax (18% GST)</td>
                          <td>{formatCurrency(order.tax_amount)}</td>
                        </tr>
                      )}
                      {order.shipping_amount > 0 && (
                        <tr>
                          <td colSpan="3">Shipping</td>
                          <td>{formatCurrency(order.shipping_amount)}</td>
                        </tr>
                      )}
                      <tr className="total-row">
                        <td colSpan="3"><strong>Total Amount</strong></td>
                        <td><strong>{formatCurrency(order.total_amount)}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {order.notes && (
                  <div className="detail-section">
                    <h4>Order Notes</h4>
                    <p>{order.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
