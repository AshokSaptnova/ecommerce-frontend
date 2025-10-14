import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import CheckoutPage from './CheckoutPage';
import './CartSidebar.css';

const CartSidebar = ({ isOpen, onClose }) => {
  const { items, cartCount, cartTotal, isEmpty, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  if (showCheckout) {
    return <CheckoutPage onClose={() => setShowCheckout(false)} />;
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="cart-backdrop" onClick={onClose}></div>
      
      {/* Sidebar */}
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="cart-header">
          <h2 className="cart-title">
            Shopping Cart
            {cartCount > 0 && <span className="cart-count">({cartCount})</span>}
          </h2>
          <button className="cart-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Cart Content */}
        <div className="cart-content">
          {isEmpty ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Add some products to get started!</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="cart-items">
                {items.map((item) => (
                  <div key={`${item.id}-${item.variantId || 'default'}`} className="cart-item">
                    <div className="item-image">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = '/images/placeholder.jpg';
                        }}
                      />
                    </div>
                    
                    <div className="item-details">
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-category">{item.category}</p>
                      <p className="item-price">₹{item.price}</p>
                    </div>
                    
                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button 
                          className="qty-btn"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          className="qty-btn"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      
                      {/* <button 
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        🗑️
                      </button> */}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Footer */}
              <div className="cart-footer">
                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Total Items:</span>
                    <span>{cartCount}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total Amount:</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="cart-actions">
                  <button 
                    className="clear-cart-btn"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>
                  <button 
                    className="checkout-btn"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;