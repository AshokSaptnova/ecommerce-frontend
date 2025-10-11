import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../../../shared/hooks/useProducts';
import '../../styles/ModernProductCatalog.css';

const ProductCatalog = () => {
  const navigate = useNavigate();
  const { products, loading, error, refetch } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('featured');

  // Get unique categories from API data
  const categories = useMemo(() => {
    if (!products || products.length === 0) return ['all'];
    const categoryNames = products.map(product => {
      // Handle both string and object categories
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
      // Get category name for searching
      const categoryName = typeof product.category === 'string' 
        ? product.category 
        : (product.category?.name || 'Uncategorized');
      
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.tagline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        filtered.sort((a, b) => (a.mrp || 0) - (b.mrp || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.mrp || 0) - (a.mrp || 0));
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
    // Navigate to the new product details page
    const productSlug = product.product_id || product.name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/product/${productSlug}`);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="product-catalog">
        <div className="catalog-header">
          <div className="hero-content">
            <h1>Premium Ayurvedic Healthcare</h1>
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Discovering amazing products for you...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="product-catalog">
        <div className="catalog-header">
          <div className="hero-content">
            <h1>Premium Ayurvedic Healthcare</h1>
            <div className="error-message">
              <p>❌ Error loading products: {error}</p>
              <button onClick={refetch} className="retry-btn">
                🔄 Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedProduct) {
    return <ProductDetail product={selectedProduct} onClose={closeProductDetail} />;
  }

  return (
    <div className="product-catalog">
      <div className="catalog-header">
        <div className="hero-content">
          <h1>Premium Ayurvedic Healthcare</h1>
          <p>Discover our complete range of authentic Ayurvedic products designed for modern wellness needs</p>
          <Link to="/presentation" className="presentation-launch-btn">
            🎥 Launch Presentation Mode
          </Link>
        </div>
      </div>

      {/* Modern Search and Filters */}
      <div className="catalog-controls">
        <div className="search-section">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            placeholder="Search for products, brands, or ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-section">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>

          <div className="view-toggle">
            <button 
              className={viewMode === 'grid' ? 'active' : ''} 
              onClick={() => setViewMode('grid')}
            >
              ⊞ Grid
            </button>
            <button 
              className={viewMode === 'list' ? 'active' : ''} 
              onClick={() => setViewMode('list')}
            >
              ☰ List
            </button>
          </div>
        </div>
      </div>

      <div className="products-section">
        {/* Product Count & Sort */}
        <div className="catalog-meta">
          <div className="product-count">
            Showing {filteredProducts.length} of {products.length} products
          </div>
          <div className="sort-options">
            <label>Sort by:</label>
            <select 
              className="sort-select"
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

        {/* Modern Products Grid */}
        <div className={`products-grid ${viewMode}`}>
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={() => openProductDetail(product)}
              viewMode={viewMode}
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
      </div>
    </div>
  );
};

const ProductCard = ({ product, onClick, viewMode }) => {
  // Get category name safely
  const categoryName = typeof product.category === 'string' 
    ? product.category 
    : (product.category?.name || 'Uncategorized');

  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const discount = product.old_mrp && product.mrp 
    ? Math.round(((product.old_mrp - product.mrp) / product.old_mrp) * 100)
    : 0;

  return (
    <div className={`product-card ${viewMode}`} onClick={onClick}>
      <div className="product-image">
        <img 
          src={product.images && product.images.length > 0 ? product.images[0].image_url : '/images/placeholder.jpg'} 
          alt={product.name}
          onError={(e) => {
            e.target.src = '/images/placeholder.jpg';
          }}
        />
        <button 
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={handleWishlistClick}
          title="Add to Wishlist"
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>
        {discount > 0 && (
          <div className="product-badge">
            {discount}% OFF
          </div>
        )}
      </div>
      
      <div className="product-info">
        <div className="category">{categoryName}</div>
        <h3>{product.name}</h3>
        <p className="tagline">{product.tagline}</p>
        
        <div className="product-meta">
          <span>📦 {product.packing}</span>
          <span>🏷️ {product.type}</span>
          {product.dosage && <span>💊 {product.dosage}</span>}
        </div>

        {product.mrp && (
          <div className="price">
            <span className="current-price">₹{product.mrp}</span>
            {product.old_mrp && product.old_mrp > product.mrp && (
              <span className="old-price">₹{product.old_mrp}</span>
            )}
            {discount > 0 && (
              <span className="discount-badge">Save {discount}%</span>
            )}
          </div>
        )}
        
        <button className="view-details-btn" onClick={(e) => {e.stopPropagation(); onClick();}}>
          🛒 View Details
        </button>
      </div>
    </div>
  );
};

const ProductDetail = ({ product, onClose }) => {
  // Get category name safely
  const categoryName = typeof product.category === 'string' 
    ? product.category 
    : (product.category?.name || 'Uncategorized');

  const discount = product.old_mrp && product.mrp 
    ? Math.round(((product.old_mrp - product.mrp) / product.old_mrp) * 100)
    : 0;

  return (
    <div className="product-detail-overlay" onClick={onClose}>
      <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="product-detail-content">
          <div className="product-header">
            <div className="product-main-info">
              <h1>{product.name}</h1>
              <div className="category-badge">{categoryName}</div>
              <p className="tagline">{product.tagline}</p>
              
              {product.mrp && (
                <div className="price-section">
                  <span className="current-price">₹{product.mrp}</span>
                  {product.old_mrp && product.old_mrp > product.mrp && (
                    <span className="old-price">₹{product.old_mrp}</span>
                  )}
                  {discount > 0 && (
                    <span className="discount-badge">Save {discount}%</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Product Image */}
          <div className="product-detail-image">
            <img 
              src={product.image_url || '/images/placeholder.jpg'} 
              alt={product.name}
              onError={(e) => {
                e.target.src = '/images/placeholder.jpg';
              }}
            />
          </div>

          {/* Product Details */}
          <div className="product-details">
            <div className="detail-section">
              <h3>📦 Product Information</h3>
              <div className="product-meta">
                <span><strong>Packing:</strong> {product.packing}</span>
                <span><strong>Type:</strong> {product.type}</span>
                {product.dosage && <span><strong>Dosage:</strong> {product.dosage}</span>}
              </div>
            </div>

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="detail-section">
                <h3>✨ Key Benefits</h3>
                <ul>
                  {product.benefits.map((benefit) => (
                    <li key={benefit.id}>{benefit.text}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="detail-section ingredients-section">
                <h3>🌿 Ingredients</h3>
                <div className="ingredients-list">
                  {product.ingredients.map((ingredient) => (
                    <div key={ingredient.id} className="ingredient-item">
                      <div className="ingredient-header">
                        <strong>{ingredient.name}</strong>
                        {ingredient.latin && (
                          <span className="latin-name">({ingredient.latin})</span>
                        )}
                        <span className="amount">{ingredient.quantity}</span>
                      </div>
                      <p className="ingredient-description">{ingredient.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="product-actions">
            <button className="btn-primary">🛒 Add to Cart</button>
            <button className="btn-secondary">📄 Download PDF</button>
            <button className="btn-secondary">📤 Share Product</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;