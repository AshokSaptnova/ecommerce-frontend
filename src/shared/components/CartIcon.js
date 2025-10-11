import React from 'react';
import { useCart } from '../context/CartContext';
import './CartIcon.css';

const CartIcon = ({ onClick, className = '' }) => {
  const { cartCount, cartTotal } = useCart();

  return (
    <button 
      className={`cart-icon ${className}`}
      onClick={onClick}
      aria-label={`Shopping cart with ${cartCount} items`}
    >
      <div className="cart-icon-container">
        {/* Cart SVG Icon */}
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-6m-8 6h8M9 17v.01M20 17v.01"/>
        </svg>
        
        {/* Cart Count Badge */}
        {cartCount > 0 && (
          <span className="cart-badge">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </div>
      
      {/* Cart Total (optional, can be hidden on mobile) */}
      {cartTotal > 0 && (
        <span className="cart-total">
          ₹{Number(cartTotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      )}
    </button>
  );
};

export default CartIcon;