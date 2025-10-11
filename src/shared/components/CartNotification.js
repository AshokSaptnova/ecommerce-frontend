import React, { useState, useEffect } from 'react';
import './CartNotification.css';

const CartNotification = ({ 
  show, 
  onClose, 
  type = 'success', 
  product, 
  message,
  duration = 3000 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsExiting(false);
      
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
      onClose();
    }, 300); // Animation duration
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '✅';
    }
  };

  return (
    <div className={`cart-notification ${type} ${isExiting ? 'exiting' : ''}`}>
      <div className="notification-content">
        <div className="notification-icon">
          {getIcon()}
        </div>
        
        <div className="notification-body">
          {product && (
            <div className="product-info">
              <img 
                src={product.image} 
                alt={product.name}
                className="product-thumb"
                onError={(e) => {
                  e.target.src = '/images/placeholder.jpg';
                }}
              />
              <div className="product-details">
                <h4 className="product-name">{product.name}</h4>
                <p className="notification-message">
                  {message || `Added to cart successfully!`}
                </p>
              </div>
            </div>
          )}
          
          {!product && (
            <div className="simple-message">
              <p className="notification-message">{message}</p>
            </div>
          )}
        </div>

        <button 
          className="notification-close"
          onClick={handleClose}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
      
      <div className="notification-progress">
        <div 
          className="progress-bar" 
          style={{ animationDuration: `${duration}ms` }}
        ></div>
      </div>
    </div>
  );
};

export default CartNotification;