import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './ModernNavbar.css';

const ModernNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Products', href: '/', icon: '💊' },
    { name: 'About', href: '/about', icon: 'ℹ️' },
    { name: 'SAPTNOVA', href: '/saptnova', icon: '🌟' },
    { name: 'YakritNova', href: '/yakritnova', icon: '🫀' },
    { name: 'MVNova', href: '/mvnova', icon: '💎' },
    { name: 'MadhuNova', href: '/madhunova', icon: '🍯' },
    { name: 'InsuWish', href: '/insuwish', icon: '🩺' },
    { name: 'Cardiowish', href: '/cardiowish', icon: '❤️' },
  ];

  const cartItems = [
    { id: 1, name: 'SAPTNOVA Capsules', price: 299, quantity: 1, image: '/images/saptnova.jpg' },
    { id: 2, name: 'YakritNova Tablets', price: 450, quantity: 2, image: '/images/yakritnova.jpg' },
  ];

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <>
      <nav className="modern-navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="logo-icon">🌿</div>
            <div className="logo-text">
              <span className="logo-main">AyurVeda</span>
              <span className="logo-sub">Premium Healthcare</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-nav">
            {navigation.slice(0, 5).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${location.pathname === item.href ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            
            {/* Products Dropdown */}
            <div className="nav-dropdown">
              <button className="nav-link dropdown-trigger">
                <span className="nav-icon">🏪</span>
                Our Products
                <span className="dropdown-arrow">▼</span>
              </button>
              <div className="dropdown-menu">
                {navigation.slice(3).map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="dropdown-item"
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="navbar-actions">
            {/* Search */}
            <button className="action-btn search-btn">
              <span className="btn-icon">🔍</span>
              <span className="btn-text">Search</span>
            </button>

            {/* Wishlist */}
            <button className="action-btn wishlist-btn">
              <span className="btn-icon">🤍</span>
              <span className="btn-text">Wishlist</span>
              <span className="badge">3</span>
            </button>

            {/* Cart */}
            <button 
              className="action-btn cart-btn"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <span className="btn-icon">🛒</span>
              <span className="btn-text">Cart</span>
              <span className="badge">{cartItems.length}</span>
            </button>

            {/* Account */}
            <div className="account-dropdown">
              <button className="action-btn account-btn">
                <span className="btn-icon">👤</span>
                <span className="btn-text">Account</span>
              </button>
              <div className="dropdown-menu">
                <Link to="/login" className="dropdown-item">Sign In</Link>
                <Link to="/register" className="dropdown-item">Register</Link>
                <Link to="/profile" className="dropdown-item">My Profile</Link>
                <Link to="/orders" className="dropdown-item">My Orders</Link>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`mobile-nav-link ${location.pathname === item.href ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
          <div className="mobile-actions">
            <button className="mobile-action-btn">🔍 Search</button>
            <button className="mobile-action-btn">🤍 Wishlist (3)</button>
            <button className="mobile-action-btn">👤 Account</button>
          </div>
        </div>
      </nav>

      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>
        <div className="cart-panel">
          <div className="cart-header">
            <h3>Shopping Cart</h3>
            <button 
              className="cart-close"
              onClick={() => setIsCartOpen(false)}
            >
              ×
            </button>
          </div>
          
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>
                <p>Your cart is empty</p>
                <button 
                  className="continue-shopping-btn"
                  onClick={() => setIsCartOpen(false)}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <div className="item-price">₹{item.price}</div>
                      <div className="quantity-controls">
                        <button className="qty-btn">-</button>
                        <span className="quantity">{item.quantity}</span>
                        <button className="qty-btn">+</button>
                      </div>
                    </div>
                    <button className="remove-item">🗑️</button>
                  </div>
                ))}
                
                <div className="cart-footer">
                  <div className="cart-total">
                    <div className="total-row">
                      <span>Subtotal: ₹{cartTotal}</span>
                    </div>
                    <div className="total-row">
                      <span>Shipping: Free</span>
                    </div>
                    <div className="total-row final">
                      <strong>Total: ₹{cartTotal}</strong>
                    </div>
                  </div>
                  <div className="cart-actions">
                    <button className="view-cart-btn">View Cart</button>
                    <button className="checkout-btn">Checkout</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ModernNavbar;