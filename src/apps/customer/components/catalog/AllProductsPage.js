import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProducts } from '../../../../shared/hooks/useProducts';
import { useCart } from '../../../../shared/context/CartContext';
import CartNotification from '../../../../shared/components/CartNotification';
import './SaptnovaProductCatalog.css';

const AllProductsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { products, loading, error, refetch } = useProducts();
  const { addToCart, isInCart, getCartItemCount } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [notification, setNotification] = useState(null);

  // Read category from URL on mount and when it changes
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    const searchFromUrl = searchParams.get('search');
    
    if (categoryFromUrl) {
      // Find the matching category name from the category slug
      const matchingProduct = products?.find(p => {
        const categorySlug = typeof p.category === 'string' 
          ? p.category.toLowerCase().replace(/\s+/g, '-')
          : (p.category?.slug || '');
        return categorySlug === categoryFromUrl;
      });
      
      if (matchingProduct) {
        const categoryName = typeof matchingProduct.category === 'string'
          ? matchingProduct.category
          : (matchingProduct.category?.name || 'all');
        setSelectedCategory(categoryName);
      }
    }
    
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams, products]);

  // Color themes for product cards
  const cardColors = [
    { bg: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 100%)', tag: '#ff6b9d' }, // Pink
    { bg: 'linear-gradient(135deg, #54a0ff 0%, #2e86de 100%)', tag: '#54a0ff' }, // Blue
    { bg: 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)', tag: '#feca57' }, // Orange
    { bg: 'linear-gradient(135deg, #ff7675 0%, #fd79a8 100%)', tag: '#ff7675' }, // Coral
    { bg: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)', tag: '#a29bfe' }, // Purple
    { bg: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)', tag: '#fd79a8' }, // Pink-Orange
  ];

  // Get unique categories from API data
  const categories = useMemo(() => {
    if (!products || products.length === 0) return ['all'];
    const categoryNames = products.map(product => {
      if (typeof product.category === 'string') {
        return product.category;
      } else if (product.category && product.category.name) {
        return product.category.name;
      } else {
        return 'Uncategorized';
      }
    });
    return ['all', ...new Set(categoryNames)];
  }, [products]);

  // Filter and sort products
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

    // Sort products
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        break;
      default:
        // Featured - no sorting needed
        break;
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy]);

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
          <h2>All Products</h2>
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
          <h2>All Products</h2>
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
    <div className="saptnova-catalog all-products-page">
      {/* Header Section */}
      <div className="catalog-header">
        <h2>All Products</h2>
        <p>Explore our complete range of premium Ayurvedic wellness solutions</p>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="category-filter">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        <div className="sort-filter">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="name">Name A-Z</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid all-products-grid">
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

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <div className="empty-state-icon">🔍</div>
          <h3>No products found</h3>
          <p>Try adjusting your search terms or filters</p>
        </div>
      )}

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

// Reuse the same SaptnovaProductCard component
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
              e.target.src = '/images/placeholder.jpg';
            }
          }}
        />
      </div>

      {/* Product Info */}
      <div className="product-info">
        <div className="product-content">
          <div>
            <h3 className="product-title">{product.name}</h3>
            <p className="product-description">
              {product.short_description || product.description || 'Premium Ayurvedic wellness solution'}
            </p>

            {/* Price Section */}
            <div className="price-section">
              <span className="current-price">₹{product.price}</span>
              {product.compare_price && product.compare_price > product.price && (
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

          {/* Add to Cart Button */}
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
  );
};

export default AllProductsPage;