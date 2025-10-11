import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiService from '../../../shared/services/api';
import './TrackOrderPage.css';

const TrackOrderPage = () => {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('orderId') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const trackingSteps = [
    { status: 'pending', label: 'Order Placed', icon: '📝' },
    { status: 'processing', label: 'Processing', icon: '📦' },
    { status: 'shipped', label: 'Shipped', icon: '🚚' },
    { status: 'delivered', label: 'Delivered', icon: '✅' }
  ];

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.request(`/orders/${orderId}`);
      setOrder(response);
    } catch (err) {
      console.error('Error tracking order:', err);
      setError(err.message || 'Order not found. Please check your order ID and try again.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status) => {
    return trackingSteps.findIndex(step => step.status === status?.toLowerCase());
  };

  const currentStatusIndex = order ? getStatusIndex(order.status) : -1;

  return (
    <div className="track-order-page">
      <div className="track-order-container">
        <div className="track-order-header">
          <h1>Track Your Order</h1>
          <p>Enter your order ID to get real-time updates</p>
        </div>

        <form className="track-order-form" onSubmit={handleTrackOrder}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter Order ID (e.g., 12345)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="order-input"
            />
            <button type="submit" className="track-btn" disabled={loading}>
              {loading ? 'Tracking...' : '🔍 Track Order'}
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}

        {order && (
          <div className="order-details">
            <div className="order-info-card">
              <h2>Order Details</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Order ID:</span>
                  <span className="value">#{order.id}</span>
                </div>
                <div className="info-item">
                  <span className="label">Order Date:</span>
                  <span className="value">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Total Amount:</span>
                  <span className="value price">₹{order.total_amount?.toFixed(2)}</span>
                </div>
                <div className="info-item">
                  <span className="label">Payment Status:</span>
                  <span className={`value status ${order.payment_status?.toLowerCase()}`}>
                    {order.payment_status || 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            <div className="tracking-timeline">
              <h2>Order Status</h2>
              <div className="timeline">
                {trackingSteps.map((step, index) => {
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  
                  return (
                    <div 
                      key={step.status}
                      className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                    >
                      <div className="step-icon">{step.icon}</div>
                      <div className="step-content">
                        <h3>{step.label}</h3>
                        {isCurrent && (
                          <span className="current-badge">Current Status</span>
                        )}
                      </div>
                      {index < trackingSteps.length - 1 && (
                        <div className={`step-connector ${isCompleted ? 'completed' : ''}`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {order.status?.toLowerCase() === 'cancelled' && (
                <div className="cancelled-notice">
                  <span>❌</span> This order has been cancelled
                </div>
              )}
            </div>

            {order.items && order.items.length > 0 && (
              <div className="order-items-card">
                <h2>Ordered Items</h2>
                <div className="items-list">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <img 
                        src={item.product_image || '/images/placeholder.jpg'} 
                        alt={item.product_name}
                        onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                      />
                      <div className="item-details">
                        <h4>{item.product_name}</h4>
                        <p>Quantity: {item.quantity}</p>
                        <p className="item-price">₹{item.price} × {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {order.shipping_address && (
              <div className="shipping-address-card">
                <h2>Shipping Address</h2>
                <div className="address-content">
                  <p>{order.shipping_address.full_name || order.shipping_address.name}</p>
                  <p>{order.shipping_address.address_line1}</p>
                  {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                  <p>
                    {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postal_code}
                  </p>
                  <p>Phone: {order.shipping_address.phone}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {!order && !loading && !error && (
          <div className="track-order-illustration">
            <div className="illustration-icon">📦🔍</div>
            <p>Enter your order ID above to start tracking</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
