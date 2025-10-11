import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../shared/context/CartContext';
import apiService from '../../../shared/services/api';
import './WishlistPage.css';

const WishlistPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [isAuthenticated, navigate]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await apiService.request('/wishlist/');
      setWishlist(response);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await apiService.request(`/wishlist/${productId}`, { method: 'DELETE' });
      setWishlist(wishlist.filter(item => item.product_id !== productId));
      setToast({ type: 'success', message: 'Removed from wishlist' });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      setToast({ type: 'error', message: 'Failed to remove item' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const success = await addToCart(product, 1);
      if (success) {
        setToast({ type: 'success', message: 'Added to cart successfully!' });
        setTimeout(() => setToast(null), 3000);
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to add to cart' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-container">
          <div className="loading-spinner">Loading your wishlist...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h1>My Wishlist</h1>
          <p>Your saved products ({wishlist.length})</p>
        </div>

        {toast && (
          <div className={`toast-message ${toast.type}`}>
            {toast.message}
          </div>
        )}

        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}

        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-icon">❤️</div>
            <h3>Your Wishlist is Empty</h3>
            <p>Save your favorite products to buy them later!</p>
            <button 
              className="shop-now-btn"
              onClick={() => navigate('/all-products')}
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((item) => {
              const product = item.product || {};
              const productImage = product.image_url || (product.images && product.images.length > 0 ? product.images[0].image_url : '/images/placeholder.jpg');
              
              return (
                <div key={item.product_id} className="wishlist-card">
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveFromWishlist(item.product_id)}
                    title="Remove from wishlist"
                  >
                    ×
                  </button>

                  <div 
                    className="product-image"
                    onClick={() => navigate(`/product/${product.slug || item.product_id}`)}
                  >
                    <img 
                      src={productImage} 
                      alt={product.name || 'Product'}
                      onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                    />
                  </div>

                  <div className="product-info">
                    <h3 
                      onClick={() => navigate(`/product/${product.slug || item.product_id}`)}
                    >
                      {product.name || 'Product Name'}
                    </h3>
                    
                    <div className="product-rating">
                      {product.average_rating ? (
                        <>
                          <span className="stars">
                            {'⭐'.repeat(Math.floor(product.average_rating))}
                          </span>
                          <span className="rating-text">
                            {product.average_rating.toFixed(1)} ({product.review_count || 0})
                          </span>
                        </>
                      ) : (
                        <span className="no-rating">No ratings yet</span>
                      )}
                    </div>

                    <div className="product-price">
                      <span className="current-price">₹{product.price || 0}</span>
                      {product.compare_price && product.compare_price > product.price && (
                        <>
                          <span className="old-price">₹{product.compare_price}</span>
                          <span className="discount">
                            {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF
                          </span>
                        </>
                      )}
                    </div>

                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart({
                        id: item.product_id,
                        name: product.name,
                        price: product.price,
                        slug: product.slug,
                        image_url: productImage,
                        images: product.images || [{ image_url: productImage }]
                      })}
                    >
                      🛒 Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
