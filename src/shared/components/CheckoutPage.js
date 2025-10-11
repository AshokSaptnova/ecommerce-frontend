import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import razorpayService from '../services/razorpay';
import './CheckoutPage.css';

const CheckoutPage = ({ onClose, onOrderComplete }) => {
  const { items, cartTotal, cartCount, clearCart, isLoading: cartLoading, metadata, totals } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderSummary, setOrderSummary] = useState(null);
  
  const [formData, setFormData] = useState({
    // Customer info (for guest checkout)
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    
    // Shipping address
    shipping_address: {
      full_name: '',
      phone: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India'
    },
    
    // Billing address
    use_same_address: true,
    billing_address: {
      full_name: '',
      phone: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India'
    },
    
    // Payment
    payment_method: 'cash_on_delivery',
    
    // Optional
    notes: ''
  });

  // Pre-populate user data if logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        customer_name: user.full_name || '',
        customer_email: user.email || '',
        customer_phone: user.phone || '',
        shipping_address: {
          ...prev.shipping_address,
          full_name: user.full_name || '',
          phone: user.phone || ''
        }
      }));
    }
  }, [isAuthenticated, user]);

  const cartSummary = {
    subtotal: totals?.subtotal || 0,
    tax_amount: totals?.tax_amount || 0,
    shipping_amount: totals?.shipping_amount || 0,
    total_amount: totals?.total_amount || 0,
    items
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        // Copy shipping to billing if same address is checked
        ...(name === 'use_same_address' && checked && {
          billing_address: { ...prev.shipping_address }
        })
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const { shipping_address, customer_email, customer_phone } = formData;
    
    // Check if user is authenticated
    const isAuthenticated = apiService.isAuthenticated();
    
    if (!isAuthenticated) {
      if (!customer_email || !customer_phone) {
        setError('Email and phone are required for guest checkout');
        return false;
      }
    }
    
    if (!shipping_address.full_name || !shipping_address.phone || 
        !shipping_address.address_line_1 || !shipping_address.city || 
        !shipping_address.state || !shipping_address.postal_code) {
      setError('Please fill in all required shipping address fields');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const checkoutData = {
        ...formData,
        billing_address: formData.use_same_address ? formData.shipping_address : formData.billing_address
      };

      // Check if payment method is online payment (Razorpay)
      if (formData.payment_method === 'online_payment' || formData.payment_method === 'razorpay') {
        // Use Razorpay for online payment
        const orderData = {
          amount: cartSummary.total_amount,
          currency: 'INR',
          customer_email: formData.customer_email || user?.email,
          customer_name: formData.customer_name || user?.full_name,
          customer_phone: formData.customer_phone || user?.phone,
          items_count: cartCount,
          shipping_address: formData.shipping_address,
          billing_address: checkoutData.billing_address,
          notes: formData.notes
        };

        const customerInfo = {
          name: formData.customer_name || user?.full_name,
          email: formData.customer_email || user?.email,
          phone: formData.customer_phone || user?.phone
        };

        // Open Razorpay checkout and process payment
        const paymentResult = await razorpayService.processPayment(orderData, customerInfo);
        
        // Payment successful and order created
        setOrderSummary(paymentResult);
        await clearCart();
        
        if (onOrderComplete) {
          onOrderComplete(paymentResult);
        }
      } else {
        // Cash on Delivery - existing flow
        const result = await apiService.checkout(checkoutData);
        
        if (result.success) {
          setOrderSummary(result);
          await clearCart();
          
          if (onOrderComplete) {
            onOrderComplete(result);
          }
        } else {
          setError('Order creation failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setError(error.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSummary) {
    return (
      <div className="checkout-modal-overlay" onClick={onClose}>
        <div className="checkout-success" onClick={(e) => e.stopPropagation()}>
          {/* Close Button */}
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
          
          <div className="success-animation">
            <div className="success-checkmark">
              <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
          </div>
          
          <h2 className="success-title">Order Placed Successfully!</h2>
          <p className="success-subtitle">Thank you for your order. We'll send you a confirmation email shortly.</p>
          
          <div className="order-summary-card">
            <div className="order-header">
              <h3>Order Details</h3>
              {orderSummary.order_number && (
                <span className="order-number">#{orderSummary.order_number}</span>
              )}
            </div>
            
            <div className="order-info-grid">
              <div className="info-item">
                <span className="info-label">Total Amount</span>
                <span className="info-value amount">₹{Number(orderSummary.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Payment Method</span>
                <span className="info-value">
                  {orderSummary.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 
                   orderSummary.payment_method === 'online_payment' ? 'Online Payment' :
                   (orderSummary.payment_method || '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Order Status</span>
                <span className="info-value status-badge pending">
                  {orderSummary.status.toUpperCase()}
                </span>
              </div>
              
              {orderSummary.customer_email && (
                <div className="info-item full-width">
                  <span className="info-label">Confirmation Email</span>
                  <span className="info-value">{orderSummary.customer_email}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="success-message-box">
            <div className="message-icon">📦</div>
          <div className="message-content">
            <h4>What's Next?</h4>
            <ul>
              <li>You'll receive an order confirmation email</li>
              <li>Track your order status anytime</li>
              <li>We'll notify you when your order ships</li>
            </ul>
          </div>
        </div>
        
        <div className="success-actions">
          <button 
            className="btn-primary"
            onClick={() => {
              if (orderSummary.order_number) {
                window.location.href = `/`;
              } else {
                onClose();
              }
            }}
          >
            Continue Shopping
          </button>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-modal">
        <div className="checkout-header">
          <h2>Checkout</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="checkout-content">
        <form onSubmit={handleSubmit} className="checkout-form">
          {/* Guest Customer Info */}
          {!apiService.isAuthenticated() && (
            <div className="form-section">
              <h3>Contact Information</h3>
              <div className="form-row">
                <input
                  type="text"
                  name="customer_name"
                  placeholder="Full Name *"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="email"
                  name="customer_email"
                  placeholder="Email Address *"
                  value={formData.customer_email}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="tel"
                  name="customer_phone"
                  placeholder="Phone Number *"
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}

          {/* Shipping Address */}
          <div className="form-section">
            <h3>Shipping Address</h3>
            <div className="form-row">
              <input
                type="text"
                name="shipping_address.full_name"
                placeholder="Full Name *"
                value={formData.shipping_address.full_name}
                onChange={handleInputChange}
                required
              />
              <input
                type="tel"
                name="shipping_address.phone"
                placeholder="Phone Number *"
                value={formData.shipping_address.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <input
              type="text"
              name="shipping_address.address_line_1"
              placeholder="Address Line 1 *"
              value={formData.shipping_address.address_line_1}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="shipping_address.address_line_2"
              placeholder="Address Line 2 (Optional)"
              value={formData.shipping_address.address_line_2}
              onChange={handleInputChange}
            />
            <div className="form-row">
              <input
                type="text"
                name="shipping_address.city"
                placeholder="City *"
                value={formData.shipping_address.city}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="shipping_address.state"
                placeholder="State *"
                value={formData.shipping_address.state}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="shipping_address.postal_code"
                placeholder="PIN Code *"
                value={formData.shipping_address.postal_code}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Billing Address */}
          <div className="form-section">
            <div className="checkbox-row">
              <label>
                <input
                  type="checkbox"
                  name="use_same_address"
                  checked={formData.use_same_address}
                  onChange={handleInputChange}
                />
                Billing address same as shipping address
              </label>
            </div>

            {!formData.use_same_address && (
              <div className="billing-address">
                <h4>Billing Address</h4>
                <div className="form-row">
                  <input
                    type="text"
                    name="billing_address.full_name"
                    placeholder="Full Name *"
                    value={formData.billing_address.full_name}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="tel"
                    name="billing_address.phone"
                    placeholder="Phone Number *"
                    value={formData.billing_address.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <input
                  type="text"
                  name="billing_address.address_line_1"
                  placeholder="Address Line 1 *"
                  value={formData.billing_address.address_line_1}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="billing_address.address_line_2"
                  placeholder="Address Line 2 (Optional)"
                  value={formData.billing_address.address_line_2}
                  onChange={handleInputChange}
                />
                <div className="form-row">
                  <input
                    type="text"
                    name="billing_address.city"
                    placeholder="City *"
                    value={formData.billing_address.city}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="billing_address.state"
                    placeholder="State *"
                    value={formData.billing_address.state}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="billing_address.postal_code"
                    placeholder="PIN Code *"
                    value={formData.billing_address.postal_code}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="form-section">
            <h3>Payment Method</h3>
            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment_method"
                  value="cash_on_delivery"
                  checked={formData.payment_method === 'cash_on_delivery'}
                  onChange={handleInputChange}
                />
                <span>💵 Cash on Delivery</span>
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment_method"
                  value="online_payment"
                  checked={formData.payment_method === 'online_payment'}
                  onChange={handleInputChange}
                />
                <span>💳 Online Payment (Cards, UPI, Netbanking)</span>
              </label>
            </div>
            {formData.payment_method === 'online_payment' && (
              <div className="payment-info">
                <small>✓ Secure payment powered by Razorpay</small>
              </div>
            )}
          </div>

          {/* Order Notes */}
          <div className="form-section">
            <h3>Order Notes (Optional)</h3>
            <textarea
              name="notes"
              placeholder="Any special instructions for your order..."
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="checkout-btn"
            disabled={loading || cartLoading || cartCount === 0}
          >
            {loading ? 'Processing...' : `Place Order - ₹${cartSummary.total_amount}`}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          
          <div className="summary-items">
            {cartSummary.items?.map((item) => (
              <div key={`${item.id}-${item.variantId || 'default'}`} className="summary-item">
                <img src={item.image || '/images/placeholder.jpg'} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>Qty: {item.quantity}</p>
                  <p>₹{item.subtotal.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>₹{cartSummary.subtotal}</span>
            </div>
            <div className="total-row">
              <span>Tax (GST 18%):</span>
              <span>₹{cartSummary.tax_amount}</span>
            </div>
            <div className="total-row">
              <span>Shipping:</span>
              <span>{cartSummary.shipping_amount === 0 ? 'Free' : `₹${cartSummary.shipping_amount}`}</span>
            </div>
            <div className="total-row total">
              <span>Total:</span>
              <span>₹{cartSummary.total_amount}</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CheckoutPage;