import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../../../shared/hooks/useProducts';
import { useCart } from '../../../../shared/context/CartContext';
import CartNotification from '../../../../shared/components/CartNotification';
import HeroSlider from '../../../../shared/components/HeroSlider';
import CategorySlider from '../../../../shared/components/CategorySlider';
import './SaptnovaProductCatalog.css';

const SaptnovaProductCatalog = () => {
  const navigate = useNavigate();
  const { products, loading, error, refetch } = useProducts();
  const { addToCart, isInCart, getCartItemCount } = useCart();
  const [searchTerm] = useState('');
  const [selectedCategory] = useState('all');
  const [notification, setNotification] = useState(null);

  // Color themes for product cards
  const cardColors = [
    { bg: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 100%)', tag: '#ff6b9d' }, // Pink
    { bg: 'linear-gradient(135deg, #54a0ff 0%, #2e86de 100%)', tag: '#54a0ff' }, // Blue
    { bg: 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)', tag: '#feca57' }, // Orange
    { bg: 'linear-gradient(135deg, #ff7675 0%, #fd79a8 100%)', tag: '#ff7675' }, // Coral
    { bg: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)', tag: '#a29bfe' }, // Purple
    { bg: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)', tag: '#fd79a8' }, // Pink-Orange
  ];



  // Filter products
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let filtered = products.filter(product => {
      const categoryName = typeof product.category === 'string' 
        ? product.category 
        : (product.category?.name || 'Uncategorized');
      
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.short_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           categoryName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || categoryName === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return filtered.slice(0, 8); // Show only 8 products on home page
  }, [products, searchTerm, selectedCategory]);

  const openProductDetail = (product) => {
    navigate(`/products/${product.slug || product.id}`);
  };

  const handleAddToCart = (product, quantity = 1) => {
    const success = addToCart(product, quantity);
    
    if (success) {
      setNotification({
        show: true,
        type: 'success',
        product: {
          id: product.id,
          name: product.name,
          image: product.images?.[0]?.image_url || '/images/placeholder.jpg'
        },
        message: `Added ${quantity} item${quantity > 1 ? 's' : ''} to cart`
      });
    } else {
      setNotification({
        show: true,
        type: 'error',
        message: 'Unable to add item to cart. Please try again.'
      });
    }
  };

  const closeNotification = () => {
    setNotification(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="saptnova-catalog">
        <div className="catalog-header">
          <h2>Featured Products</h2>
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading amazing products...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="saptnova-catalog">
        <div className="catalog-header">
          <h2>Featured Products</h2>
          <div className="error-message">
            <p>❌ Error loading products: {error}</p>
            <button onClick={refetch} className="retry-btn">
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="saptnova-catalog">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Category Slider */}
      <CategorySlider />

      {/* Header Section */}
      <div className="catalog-header">
        <h2>Featured Products</h2>
        <p>Discover our premium range of Ayurvedic wellness solutions</p>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map((product, index) => (
          <SaptnovaProductCard 
            key={product.id} 
            product={product} 
            colorTheme={cardColors[index % cardColors.length]}
            onClick={() => openProductDetail(product)}
            onAddToCart={handleAddToCart}
            isInCart={isInCart(product.id)}
            cartQuantity={getCartItemCount(product.id)}
          />
        ))}
      </div>

      {/* View All Products Button */}
      <div className="view-all-section">
        <Link to="/all-products" className="view-all-btn">
          View All Products
        </Link>
      </div>

      {/* Trust Badges */}
      <div className="trust-badges">
        <div className="badge">
          <span className="badge-icon">🚚</span>
          <span className="badge-text">Pan India Free Shipping</span>
        </div>
        <div className="badge">
          <span className="badge-icon">🌿</span>
          <span className="badge-text">100% Pure & Organic</span>
        </div>
        <div className="badge">
          <span className="badge-icon">✅</span>
          <span className="badge-text">Ayush & GMP Certified</span>
        </div>
        <div className="badge">
          <span className="badge-icon">⚡</span>
          <span className="badge-text">No Side Effects</span>
        </div>
      </div>

      {/* Cart Notification */}
      {notification && (
        <CartNotification
          show={notification.show}
          type={notification.type}
          product={notification.product}
          message={notification.message}
          onClose={closeNotification}
        />
      )}
    </div>
  );
};

const SaptnovaProductCard = ({ product, colorTheme, onClick, onAddToCart, isInCart, cartQuantity }) => {
  // Get category name safely
  const categoryName = typeof product.category === 'string' 
    ? product.category 
    : (product.category?.name || 'General Health');

  // Use dynamic rating from backend, fallback to default if no reviews
  const rating = product.average_rating || 0;
  const reviewCount = product.review_count || 0;
  const starCount = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      if (i < starCount) {
        return <span key={i} className="star filled">⭐</span>;
      } else if (i === starCount && hasHalfStar) {
        return <span key={i} className="star half-filled">⭐</span>;
      } else {
        return <span key={i} className="star">☆</span>;
      }
    });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product, 1);
  };

  return (
    <div 
      className="saptnova-product-card"
      style={{ background: colorTheme.bg }}
      onClick={onClick}
    >
      {/* Category Tag */}
      <div className="product-category" style={{ backgroundColor: colorTheme.tag }}>
        {categoryName}
      </div>

      {/* Product Image */}
      <div className="product-image-container">
        <div className="product-pedestal"></div>
        <img 
          src={product.images && product.images.length > 0 
            ? product.images[0].image_url 
            : '/images/placeholder.jpg'
          } 
          alt={product.name}
          className="product-image"
          onError={(e) => {
            // Prevent infinite loop - only set placeholder once
            if (!e.target.src.includes('placeholder')) {
              console.log('Image failed to load:', e.target.src);
              e.target.src = '/images/placeholder.jpg';
            }
          }}
          onLoad={(e) => {
            console.log('Image loaded successfully:', e.target.src);
          }}
        />
      </div>

      {/* Product Info */}
      <div className="product-info">
        <div className="product-content">
          <div className="product-main-content">
            <h3 className="product-title">{product.name}</h3>
            <p className="product-description">
              {product.short_description || product.description || `${categoryName} formula for optimal health and wellness`}
            </p>

            {/* Price Section */}
            <div className="price-section">
              <span className="current-price">₹{product.price || '0'}</span>
              {product.compare_price && product.compare_price > (product.price || 0) && (
                <span className="old-price">₹{product.compare_price}</span>
              )}
            </div>

            {/* Rating Section */}
            <div className="rating-section">
              <div className="stars">
                {renderStars()}
              </div>
              <span className="rating-text">
                {reviewCount > 0 ? (
                  `(${rating.toFixed(1)} Star Ratings - ${reviewCount} ${reviewCount === 1 ? 'Review' : 'Reviews'})`
                ) : (
                  '(No reviews yet)'
                )}
              </span>
            </div>
          </div>

          {/* Add to Cart Button - Always at bottom */}
          <div className="product-button-container">
            <button 
              className={`add-to-cart-btn ${isInCart ? 'in-cart' : ''}`}
              onClick={handleAddToCart}
            >
              <span className="cart-icon">
                {isInCart ? '✓' : '🛒'}
              </span>
              {isInCart ? `In Cart (${cartQuantity})` : 'Add to cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaptnovaProductCatalog;