import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../../shared/context/CartContext';
import apiService from '../../../shared/services/api';
import CartNotification from '../../../shared/components/CartNotification';
import './CategoryPage.css';

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, getCartItemCount } = useCart();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // Filter states
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('best-selling');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Color themes for product cards
  const cardColors = [
    { bg: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 100%)', tag: '#ff6b9d' },
    { bg: 'linear-gradient(135deg, #54a0ff 0%, #2e86de 100%)', tag: '#54a0ff' },
    { bg: 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)', tag: '#feca57' },
    { bg: 'linear-gradient(135deg, #ff7675 0%, #fd79a8 100%)', tag: '#ff7675' },
    { bg: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)', tag: '#a29bfe' },
    { bg: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)', tag: '#fd79a8' },
  ];

  useEffect(() => {
    fetchCategoryData();
  }, [categorySlug]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [products, availabilityFilter, sortBy]);

  const applyFiltersAndSort = () => {
    let filtered = [...products];

    // Apply availability filter
    if (availabilityFilter === 'in-stock') {
      filtered = filtered.filter(product => product.stock_quantity > 0);
    } else if (availabilityFilter === 'out-of-stock') {
      filtered = filtered.filter(product => product.stock_quantity === 0);
    }

    // Apply sorting
    switch (sortBy) {
      case 'best-selling':
        // Sort by sales or reviews (fallback to name if no sales data)
        filtered.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
        break;
      case 'alphabetically-az':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'alphabetically-za':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-low-high':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high-low':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'date-old-new':
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'date-new-old':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all categories to find the matching one
      const categoriesResponse = await apiService.get('/categories/');
      const matchedCategory = categoriesResponse.find(
        cat => cat.slug === categorySlug || cat.name.toLowerCase().replace(/\s+/g, '-') === categorySlug
      );

      if (!matchedCategory) {
        setError('Category not found');
        setLoading(false);
        return;
      }

      setCategory(matchedCategory);

      // Fetch all products and filter by category
      const productsResponse = await apiService.get('/products/');
      const categoryProducts = productsResponse.filter(product => {
        const productCategory = typeof product.category === 'string' 
          ? product.category 
          : product.category?.name;
        return productCategory === matchedCategory.name;
      });

      setProducts(categoryProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching category data:', error);
      setError('Failed to load category data. Please try again.');
      setLoading(false);
    }
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

  const openProductDetail = (product) => {
    navigate(`/products/${product.slug || product.id}`);
  };

  const closeNotification = () => {
    setNotification(null);
  };

  if (loading) {
    return (
      <div className="category-page">
        <div className="category-loading">
          <div className="spinner"></div>
          <p>Loading category...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="category-page">
        <div className="category-error">
          <h2>❌ {error || 'Category not found'}</h2>
          <button onClick={() => navigate('/')} className="back-home-btn">
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      {/* Category Header */}
      <div className="category-hero">
        <div className="category-hero-content">
          <h1 className="category-title">{category.name}</h1>
          <p className="category-description">
            {category.description || 
             `Get natural support for managing ${category.name.toLowerCase()} with our herbal care products. 
             Made with traditional ingredients and backed by science, our formulas help regulate overall health. 
             Take control of your ${category.name.toLowerCase()} with confidence and ease.`}
          </p>
          
          {/* Filter Section - Similar to Saptnova */}
          <div className="category-filters">
            <div className="filters-left">
              <span className="filter-label">Filter:</span>
              <div className="filter-group">
                <select 
                  className="filter-select"
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                >
                  <option value="all">Availability</option>
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
              <div className="filter-group">
                <select className="filter-select" disabled>
                  <option>Price</option>
                </select>
              </div>
            </div>
            <div className="filters-right">
              <span className="sort-label">Sort by:</span>
              <select 
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="best-selling">Best selling</option>
                <option value="alphabetically-az">Alphabetically, A-Z</option>
                <option value="alphabetically-za">Alphabetically, Z-A</option>
                <option value="price-low-high">Price, low to high</option>
                <option value="price-high-low">Price, high to low</option>
                <option value="date-old-new">Date, old to new</option>
                <option value="date-new-old">Date, new to old</option>
              </select>
              <span className="product-count">{filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="category-products-section">
          <div className="products-grid">
            {filteredProducts.map((product, index) => (
              <CategoryProductCard
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
        </div>
      ) : (
        <div className="no-products">
          <p>No products match your filters.</p>
          <button 
            onClick={() => {
              setAvailabilityFilter('all');
              setSortBy('best-selling');
            }} 
            className="browse-all-btn"
          >
            Clear Filters
          </button>
        </div>
      )}

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

const CategoryProductCard = ({ product, colorTheme, onClick, onAddToCart, isInCart, cartQuantity }) => {
  const categoryName = typeof product.category === 'string' 
    ? product.category 
    : (product.category?.name || 'General Health');

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
      className="category-product-card"
      style={{ background: colorTheme.bg }}
      onClick={onClick}
    >
      {/* Sale Badge */}
      {product.compare_price && product.compare_price > product.price && (
        <div className="sale-badge">Sale</div>
      )}

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
            if (!e.target.src.includes('placeholder')) {
              e.target.src = '/images/placeholder.jpg';
            }
          }}
        />
      </div>

      {/* Product Info */}
      <div className="product-info">
        <div className="product-content">
          <h3 className="product-title">{product.name}</h3>
          <p className="product-description">
            {product.short_description || product.description || `${categoryName} formula for optimal health and wellness`}
          </p>

          {/* Price Section */}
          <div className="price-section">
            <span className="current-price">₹{product.price || '0'}</span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="old-price">₹{product.compare_price}</span>
            )}
          </div>

          {/* Rating Section */}
          <div className="rating-section">
            <div className="stars">{renderStars()}</div>
            <span className="rating-text">
              {reviewCount > 0 ? (
                `(${rating.toFixed(1)} Star Ratings - ${reviewCount} ${reviewCount === 1 ? 'Review' : 'Reviews'})`
              ) : (
                '(No reviews yet)'
              )}
            </span>
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

export default CategoryPage;
