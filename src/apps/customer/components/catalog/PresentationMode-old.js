import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import './PresentationMode.css';

const PresentationMode = () => {
  const { products, loading, error, refetch } = useProducts();
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentProduct = products && products.length > 0 ? products[currentProductIndex] : null;

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlay && products && products.length > 0) {
      const interval = setInterval(() => {
        setCurrentProductIndex((prev) => (prev + 1) % products.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlay, products]);

  // Auto-hide controls after 3 seconds of no mouse movement
  useEffect(() => {
    let timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isFullscreen) setShowControls(false);
      }, 3000);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isFullscreen]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const goToProduct = (index) => {
    if (products && index >= 0 && index < products.length) {
      setCurrentProductIndex(index);
    }
  };

  const nextProduct = () => {
    if (products && products.length > 0) {
      setCurrentProductIndex((prev) => (prev + 1) % products.length);
    }
  };

  const prevProduct = () => {
    if (products && products.length > 0) {
      setCurrentProductIndex((prev) => (prev - 1 + products.length) % products.length);
    }
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    setIsFullscreen(false);
  };

  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
    setIsFullscreen(true);
  };

  const toggleProductNav = () => {
    const nav = document.querySelector('.floating-product-nav');
    nav?.classList.toggle('expanded');
  };

  // Loading state
  if (loading) {
    return (
      <div className="presentation-mode">
        <div className="presentation-loading">
          <div className="loading-spinner-large">
            <div className="spinner-large"></div>
            <h2>Loading Presentation...</h2>
            <p>Fetching product data from server</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="presentation-mode">
        <div className="presentation-error">
          <div className="error-content">
            <h2>❌ Presentation Error</h2>
            <p>Failed to load product data: {error}</p>
            <button onClick={refetch} className="retry-btn-large">
              🔄 Retry Loading
            </button>
            <a href="/" className="back-link">
              ← Back to Catalog
            </a>
          </div>
        </div>
      </div>
    );
  }

  // No products state
  if (!products || products.length === 0) {
    return (
      <div className="presentation-mode">
        <div className="presentation-empty">
          <div className="empty-content">
            <h2>📎 No Products Available</h2>
            <p>No products found for presentation</p>
            <button onClick={refetch} className="retry-btn-large">
              🔄 Refresh
            </button>
            <a href="/" className="back-link">
              ← Back to Catalog
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return null;
  }

  return (
    <div className="presentation-mode" style={{ backgroundImage: `url('/images/pdf-bg.jpg')` }}>
      {/* PDF-Style Product Display */}
      <div className="pdf-slide">
        {/* Background decorative elements */}
        <div className="bg-curve-1"></div>
        <div className="bg-curve-2"></div>
        
        {/* Header with Brand Logo */}
        <div className="pdf-header">
          <div className="brand-section">
            <div className="saptnova-logo">
              <div className="logo-oval">
                <span className="saptnova-text">SAPTNOVA</span>
                <span className="registered">®</span>
              </div>
              <span className="ayurveda-text">Ayurveda</span>
              <span className="tagline-text">Authentic Ayurvedic Products</span>
            </div>
          </div>
          
          <div className="main-title">
            <h1>{currentProduct.tagline}</h1>
          </div>
          
          <div className="product-showcase">
            <div className="product-name-badge">
              <div className="leaf-icon">🍃</div>
              <h2>{currentProduct.name}</h2>
              <p>
                {typeof currentProduct.category === 'string' 
                  ? currentProduct.category 
                  : (currentProduct.category?.name || 'Uncategorized')}
              </p>
              <span>{currentProduct.type}</span>
              {currentProduct.mrp && (
                <div className="price-info">
                  <span className="price">₹{currentProduct.mrp}</span>
                  {currentProduct.old_mrp && currentProduct.old_mrp > currentProduct.mrp && (
                    <span className="old-price">₹{currentProduct.old_mrp}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="pdf-content">
          {/* Left Column - Ingredients */}
          <div className="ingredients-column">
            <h3>Each {currentProduct.packing} {currentProduct.type} Contents Extracts of: -</h3>
            <div className="ingredients-grid">
              {currentProduct.ingredients && currentProduct.ingredients.map((ingredient) => (
                <div key={ingredient.id} className="ingredient-item">
                  <div className="ingredient-name">
                    <strong>{ingredient.name}</strong>
                    {ingredient.latin && (
                      <span className="botanical-name">({ingredient.latin})</span>
                    )}
                    <span className="amount-badge">{ingredient.quantity}</span>
                  </div>
                  <p className="ingredient-desc">{ingredient.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Center - Liver illustration */}
          <div className="center-illustration">
            <div className="liver-diagram">
              {/* Liver illustration placeholder */}
              <div className="liver-visual"></div>
            </div>
          </div>

          {/* Right Column - Benefits & Product */}
          <div className="benefits-column">
            <div className="benefits-section">
              {currentProduct.benefits && currentProduct.benefits.map((benefit) => (
                <div key={benefit.id} className="benefit-item">
                  <div className="benefit-icon">❤️</div>
                  <p>{benefit.text}</p>
                </div>
              ))}
            </div>
            
            <div className="product-bottle-section">
              <div className="product-bottle-container">
                <img 
                  src={currentProduct.images && currentProduct.images.length > 0 ? currentProduct.images[0].image_url : '/images/placeholder.jpg'} 
                  alt={currentProduct.name}
                  className="product-bottle-image"
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
                <div className="product-brand-small">
                  <span>SAPTNOVA</span>
                  <span>{currentProduct.name}</span>
                  <p>Natural {currentProduct.category}<br/>{currentProduct.type}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Packing & Dosage */}
        <div className="pdf-footer">
          <div className="footer-content">
            <div className="packing-dosage-section">
              <p><strong>Type :</strong> {currentProduct.type}</p>
              <p><strong>Packing :</strong> {currentProduct.packing}</p>
              <p><strong>Dosage :</strong> {currentProduct.dosage}</p>
              {currentProduct.mrp && (
                <p><strong>Price :</strong> ₹{currentProduct.mrp} {currentProduct.old_mrp && currentProduct.old_mrp > currentProduct.mrp && <span style={{textDecoration: 'line-through', opacity: 0.6}}>₹{currentProduct.old_mrp}</span>}</p>
              )}
            </div>
            
            <div className="certification-badges">
              <div className="cert-item">
                <div className="cert-icon">💊</div>
                <p>PROPER<br/>MEDICINE</p>
              </div>
              <div className="cert-item">
                <div className="cert-icon">�</div>
                <p>GMP<br/>CERTIFIED</p>
              </div>
              <div className="cert-item">
                <div className="cert-icon">🔬</div>
                <p>SCIENTIFICALLY<br/>PROVEN</p>
              </div>
              <div className="cert-item">
                <div className="cert-icon">✓</div>
                <p>MADE<br/>PERFECT</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transparent Floating Controls */}
      <div className={`floating-controls ${showControls ? 'visible' : 'hidden'}`}>
        {/* Top Control Bar */}
        <div className="top-controls">
          <button onClick={toggleAutoPlay} className={`control-btn ${isAutoPlay ? 'active' : ''}`}>
            {isAutoPlay ? '⏸️' : '▶️'}
          </button>
          <span className="product-counter">{currentProductIndex + 1} / {products?.length || 0}</span>
          <button onClick={isFullscreen ? exitFullscreen : enterFullscreen} className="control-btn">
            {isFullscreen ? '⛶' : '⛶'}
          </button>
        </div>

        {/* Navigation Arrows */}
        <button onClick={prevProduct} className="nav-arrow left-arrow">
          ←
        </button>
        <button onClick={nextProduct} className="nav-arrow right-arrow">
          →
        </button>

        {/* Bottom Product Navigation */}
        <div className="bottom-nav">
          <button onClick={toggleProductNav} className="nav-toggle-btn">
            ☰
          </button>
          <div className="product-dots">
            {products && products.map((_, index) => (
              <button
                key={index}
                onClick={() => goToProduct(index)}
                className={`dot ${index === currentProductIndex ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Product Navigation */}
      <div className="floating-product-nav">
        <div className="product-nav-header">
          <h4>Products</h4>
        </div>
        <div className="product-nav-list">
          {products && products.map((product, index) => (
            <button
              key={product.id}
              onClick={() => goToProduct(index)}
              className={`product-nav-item ${index === currentProductIndex ? 'active' : ''}`}
            >
              <span className="nav-number">{index + 1}</span>
              <span className="nav-name">{product.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PresentationMode;