import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../../../shared/hooks/useProducts';
import '../../styles/ProductCatalog.css';

const ProductCatalog = () => {
  const { products, loading, error, refetch } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    return products.filter(product => {
      const categoryName = typeof product.category === 'string' 
        ? product.category 
        : (product.category?.name || 'Uncategorized');
      
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.tagline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           categoryName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || categoryName === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  if (loading) {
    return (
      <div className="product-catalog">
        <div className="catalog-header">
          <h1>Product Catalog</h1>
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-catalog">
        <div className="catalog-header">
          <h1>Product Catalog</h1>
          <div className="error-message">
            <p>Error loading products: {error}</p>
            <button onClick={refetch} className="retry-btn">Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-catalog">
      <div className="catalog-header">
        <h1>Product Catalog</h1>
        <div className="search-filters">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
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
        </div>
      </div>

      <div className="products-section">
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img 
                  src={product.images && product.images.length > 0 ? product.images[0].image_url : '/images/placeholder.jpg'} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-tagline">{product.tagline}</p>
                <div className="product-details">
                  <span className="product-price">
                    ${product.unit_price ? parseFloat(product.unit_price).toFixed(2) : '0.00'}
                  </span>
                  <span className="product-category">
                    {typeof product.category === 'string' 
                      ? product.category 
                      : (product.category?.name || 'Uncategorized')}
                  </span>
                </div>
                <div className="product-actions">
                  <button className="btn-primary">Add to Cart</button>
                  <button className="btn-secondary">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
