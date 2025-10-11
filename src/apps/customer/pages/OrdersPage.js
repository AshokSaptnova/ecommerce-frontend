import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../../../shared/services/api';
import './OrdersPage.css';

const OrdersPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.request('/orders/');
      setOrders(response);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#ff9800',
      'processing': '#2196f3',
      'shipped': '#9c27b0',
      'delivered': '#4caf50',
      'cancelled': '#f44336'
    };
    return colors[status?.toLowerCase()] || '#757575';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': '⏳',
      'processing': '📦',
      'shipped': '🚚',
      'delivered': '✅',
      'cancelled': '❌'
    };
    return icons[status?.toLowerCase()] || '📋';
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="loading-spinner">Loading your orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <p>View and track all your orders</p>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h3>No Orders Yet</h3>
            <p>Looks like you haven't placed any orders yet.</p>
            <button 
              className="shop-now-btn"
              onClick={() => navigate('/all-products')}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header-info">
                  <div className="order-id">
                    <strong>Order #{order.id}</strong>
                    <span className="order-date">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div 
                    className="order-status"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    <span>{getStatusIcon(order.status)}</span>
                    {order.status || 'Pending'}
                  </div>
                </div>

                <div className="order-items">
                  {order.items && order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="order-item">
                      <img 
                        src={item.product_image || '/images/placeholder.jpg'} 
                        alt={item.product_name}
                        onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                      />
                      <div className="item-details">
                        <h4>{item.product_name}</h4>
                        <p>Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                  {order.items && order.items.length > 3 && (
                    <div className="more-items">
                      +{order.items.length - 3} more item(s)
                    </div>
                  )}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>Total Amount:</span>
                    <strong>₹{order.total_amount?.toFixed(2) || '0.00'}</strong>
                  </div>
                  <div className="order-actions">
                    <button 
                      className="btn-secondary"
                      onClick={() => navigate(`/order/${order.id}`)}
                    >
                      View Details
                    </button>
                    <button 
                      className="btn-primary"
                      onClick={() => navigate(`/track-order?orderId=${order.id}`)}
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
