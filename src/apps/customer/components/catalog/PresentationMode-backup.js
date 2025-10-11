import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';

const PresentationMode = ({ initialProductId = 0 }) => {
  // All hooks must be called first, before any conditional returns
  const { products, loading, error } = useProducts();
  const [currentIndex, setCurrentIndex] = useState(initialProductId);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const currentProduct = products?.[currentIndex];

  // Ensure currentIndex is within bounds
  useEffect(() => {
    if (products?.length && currentIndex >= products.length) {
      setCurrentIndex(0);
    }
  }, [products?.length, currentIndex]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay || !products?.length) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % products.length);
    }, 10000); // 10 seconds per slide
    
    return () => clearInterval(interval);
  }, [isAutoPlay, products?.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!products?.length) return;
    
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentIndex(prev => (prev + 1) % products.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIndex(prev => (prev - 1 + products.length) % products.length);
      } else if (e.key === 'Escape') {
        // Exit presentation mode
        window.history.back();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [products?.length]);

  // Controls auto-hide
  useEffect(() => {
    let timeoutId;
    const resetTimeout = () => {
      setShowControls(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setShowControls(false), 3000);
    };
    
    window.addEventListener('mousemove', resetTimeout);
    resetTimeout();
    
    return () => {
      window.removeEventListener('mousemove', resetTimeout);
      clearTimeout(timeoutId);
    };
  }, []);

  // Fullscreen functionality
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Now we can do conditional returns after all hooks are called
  if (loading) {
    return (
      <div className="presentation-loading">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: '1.5rem'
        }}>
          <div>
            <div style={{marginBottom: '20px', textAlign: 'center'}}>🔄</div>
            <div>Loading products for presentation...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="presentation-error">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: '1.5rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{marginBottom: '20px', fontSize: '2rem'}}>❌</div>
            <div>Error loading products: {error}</div>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer'
              }}
            >
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!products || !Array.isArray(products) || products.length === 0) {
    return (
      <div className="presentation-loading">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: '1.5rem'
        }}>
          <div>
            <div style={{marginBottom: '20px', textAlign: 'center'}}>📦</div>
            <div>No products available for presentation</div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="presentation-loading">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: '1.5rem'
        }}>
          <div>
            <div style={{marginBottom: '20px', textAlign: 'center'}}>🔄</div>
            <div>Loading presentation...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="presentation-mode">
      <style>{`
        .presentation-mode {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          position: relative;
          overflow: hidden;
        }

        .presentation-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Header Section */
        .presentation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          position: relative;
          z-index: 10;
        }

        .brand-logo {
          background: #ff6b6b;
          color: white;
          padding: 12px 24px;
          border-radius: 25px;
          font-size: 24px;
          font-weight: bold;
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
        }

        .main-tagline {
          text-align: center;
          flex: 1;
          margin: 0 40px;
        }

        .main-tagline h1 {
          font-size: 3.5rem;
          font-weight: 700;
          background: linear-gradient(45deg, #ff6b6b, #ffa726);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          text-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }

        .product-badge {
          background: linear-gradient(135deg, #4ecdc4, #44a08d);
          color: white;
          padding: 20px 30px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(78, 205, 196, 0.3);
          min-width: 250px;
        }

        .product-badge h2 {
          margin: 0 0 8px 0;
          font-size: 1.4rem;
          font-weight: 600;
        }

        .product-badge .type-info {
          font-size: 0.9rem;
          opacity: 0.9;
          margin: 5px 0;
        }

        .product-badge .price-info {
          margin-top: 10px;
        }

        .product-badge .price {
          font-size: 1.3rem;
          font-weight: bold;
          color: #fff200;
        }

        .product-badge .old-price {
          text-decoration: line-through;
          opacity: 0.7;
          margin-left: 10px;
          font-size: 1rem;
        }

        /* Main Content Layout */
        .presentation-content {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 300px 1fr;
          gap: 40px;
          align-items: start;
          margin-bottom: 30px;
        }

        /* Left Column - Ingredients */
        .ingredients-section {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
        }

        .ingredients-section h3 {
          font-size: 1.3rem;
          color: #2c3e50;
          margin-bottom: 25px;
          text-align: center;
          font-weight: 600;
        }

        .ingredients-grid {
          display: grid;
          gap: 20px;
          max-height: 600px;
          overflow-y: auto;
        }

        .ingredient-card {
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border: 2px solid #e3f2fd;
          border-radius: 15px;
          padding: 20px;
          transition: all 0.3s ease;
          position: relative;
        }

        .ingredient-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          border-color: #4ecdc4;
        }

        .ingredient-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .ingredient-name {
          flex: 1;
        }

        .ingredient-name strong {
          font-size: 1.1rem;
          color: #2c3e50;
          display: block;
        }

        .botanical-name {
          font-style: italic;
          color: #6c757d;
          font-size: 0.9rem;
          display: block;
          margin-top: 4px;
        }

        .quantity-badge {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 8px 16px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .ingredient-description {
          color: #495057;
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 0;
        }

        /* Center Column - Product Visual */
        .product-visual {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .product-image-container {
          width: 250px;
          height: 350px;
          position: relative;
          margin-bottom: 20px;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease;
        }

        .product-image:hover {
          transform: scale(1.05);
        }

        .product-info-card {
          background: rgba(255, 255, 255, 0.95);
          padding: 20px;
          border-radius: 15px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
        }

        .product-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 8px;
        }

        .product-category {
          color: #6c757d;
          font-size: 1rem;
          margin-bottom: 15px;
        }

        /* Right Column - Benefits */
        .benefits-section {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
        }

        .benefits-grid {
          display: grid;
          gap: 15px;
        }

        .benefit-card {
          display: flex;
          align-items: flex-start;
          background: linear-gradient(135deg, #ffeaa7, #fab1a0);
          border-radius: 15px;
          padding: 20px;
          transition: all 0.3s ease;
          border-left: 5px solid #e17055;
        }

        .benefit-card:hover {
          transform: translateX(10px);
          box-shadow: 0 8px 25px rgba(225, 112, 85, 0.3);
        }

        .benefit-icon {
          font-size: 1.5rem;
          margin-right: 15px;
          flex-shrink: 0;
        }

        .benefit-text {
          font-size: 1rem;
          font-weight: 500;
          color: #2c3e50;
          margin: 0;
          line-height: 1.4;
        }

        /* Footer Section */
        .presentation-footer {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 25px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
        }

        .footer-info {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
          flex: 1;
        }

        .footer-info > div {
          text-align: center;
        }

        .footer-info strong {
          color: #2c3e50;
          font-size: 0.9rem;
          display: block;
          margin-bottom: 5px;
        }

        .footer-info span {
          color: #6c757d;
          font-size: 1rem;
        }

        .certification-badges {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .cert-badge {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #74b9ff, #0984e3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 0.8rem;
          text-align: center;
          box-shadow: 0 6px 20px rgba(116, 185, 255, 0.3);
        }

        /* Navigation Controls */
        .presentation-controls {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 15px;
          background: rgba(0, 0, 0, 0.8);
          padding: 15px 25px;
          border-radius: 50px;
          backdrop-filter: blur(10px);
          transition: opacity 0.3s ease;
          z-index: 1000;
        }

        .presentation-controls.hidden {
          opacity: 0;
        }

        .control-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          padding: 12px 20px;
          border-radius: 25px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .control-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .control-btn.active {
          background: #4ecdc4;
          box-shadow: 0 6px 20px rgba(78, 205, 196, 0.4);
        }

        .nav-indicator {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .nav-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-dot.active {
          background: #4ecdc4;
          transform: scale(1.3);
        }

        .product-counter {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          padding: 0 15px;
        }

        /* Liver illustration placeholder */
        .liver-illustration {
          position: absolute;
          right: 100px;
          top: 50%;
          transform: translateY(-50%);
          width: 150px;
          height: 120px;
          background: linear-gradient(45deg, #ff6b6b, #ee5a52);
          border-radius: 60% 40% 40% 60%;
          opacity: 0.1;
          z-index: 1;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .presentation-content {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          
          .main-tagline h1 {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 768px) {
          .presentation-header {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
          
          .main-tagline {
            margin: 0;
          }
          
          .main-tagline h1 {
            font-size: 2rem;
          }
          
          .presentation-container {
            padding: 15px;
          }
        }
      `}</style>

      <div className="presentation-container">
        {/* Header Section */}
        <div className="presentation-header">
          <div className="brand-logo">
            SAPTNOVA®
            <div style={{fontSize: '0.7rem', fontWeight: 'normal', marginTop: '2px'}}>Ayurveda</div>
            <div style={{fontSize: '0.5rem', opacity: 0.8}}>Authentic Ayurvedic Products</div>
          </div>
          
          <div className="main-tagline">
            <h1>{currentProduct.tagline}</h1>
          </div>
          
          <div className="product-badge">
            <h2>{currentProduct.name}</h2>
            <div className="type-info">
              {typeof currentProduct.category === 'string' 
                ? currentProduct.category 
                : (currentProduct.category?.name || 'Uncategorized')}
            </div>
            <div className="type-info">{currentProduct.type}</div>
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

        {/* Main Content */}
        <div className="presentation-content">
          {/* Left Column - Ingredients */}
          <div className="ingredients-section">
            <h3>Each {currentProduct.packing} {currentProduct.type} Contents Extracts of:</h3>
            <div className="ingredients-grid">
              {currentProduct.ingredients && currentProduct.ingredients.map((ingredient) => (
                <div key={ingredient.id} className="ingredient-card">
                  <div className="ingredient-header">
                    <div className="ingredient-name">
                      <strong>{ingredient.name}</strong>
                      {ingredient.latin && (
                        <span className="botanical-name">({ingredient.latin})</span>
                      )}
                    </div>
                    <span className="quantity-badge">{ingredient.quantity}</span>
                  </div>
                  <p className="ingredient-description">{ingredient.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Center Column - Product Visual */}
          <div className="product-visual">
            <div className="product-image-container">
              <img 
                src={currentProduct.image_url || '/images/placeholder.jpg'} 
                alt={currentProduct.name}
                className="product-image"
                onError={(e) => {
                  e.target.src = '/images/placeholder.jpg';
                }}
              />
            </div>
            <div className="product-info-card">
              <div className="product-name">{currentProduct.name}</div>
              <div className="product-category">Natural {currentProduct.category}</div>
              <div className="product-category">{currentProduct.type}</div>
            </div>
          </div>

          {/* Right Column - Benefits */}
          <div className="benefits-section">
            <div className="benefits-grid">
              {currentProduct.benefits && currentProduct.benefits.map((benefit) => (
                <div key={benefit.id} className="benefit-card">
                  <div className="benefit-icon">❤️</div>
                  <p className="benefit-text">{benefit.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="presentation-footer">
          <div className="footer-info">
            <div>
              <strong>Type:</strong>
              <span>{currentProduct.type}</span>
            </div>
            <div>
              <strong>Packing:</strong>
              <span>{currentProduct.packing}</span>
            </div>
            <div>
              <strong>Dosage:</strong>
              <span>{currentProduct.dosage}</span>
            </div>
            {currentProduct.mrp && (
              <div>
                <strong>Price:</strong>
                <span>
                  ₹{currentProduct.mrp}
                  {currentProduct.old_mrp && currentProduct.old_mrp > currentProduct.mrp && (
                    <span style={{textDecoration: 'line-through', opacity: 0.6, marginLeft: 8}}>
                      ₹{currentProduct.old_mrp}
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
          
          <div className="certification-badges">
            <div className="cert-badge">PROPER<br/>CERT</div>
            <div className="cert-badge">GMP<br/>CERT</div>
          </div>
        </div>

        {/* Decorative liver illustration */}
        <div className="liver-illustration"></div>
      </div>

      {/* Navigation Controls */}
      <div className={`presentation-controls ${!showControls ? 'hidden' : ''}`}>
        <button 
          className="control-btn"
          onClick={() => setCurrentIndex(prev => (prev - 1 + (products?.length || 1)) % (products?.length || 1))}
        >
          ⬅ Previous
        </button>
        
        <div className="nav-indicator">
          {products?.map((_, index) => (
            <div 
              key={index}
              className={`nav-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          )) || []}
        </div>
        
        <div className="product-counter">
          {currentIndex + 1} / {products?.length || 0}
        </div>
        
        <button 
          className={`control-btn ${isAutoPlay ? 'active' : ''}`}
          onClick={() => setIsAutoPlay(!isAutoPlay)}
        >
          {isAutoPlay ? '⏸️ Pause' : '▶️ Auto'}
        </button>
        
        <button 
          className="control-btn"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? '🗗 Exit' : '🗖 Fullscreen'}
        </button>
        
        <button 
          className="control-btn"
          onClick={() => setCurrentIndex(prev => (prev + 1) % (products?.length || 1))}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default PresentationMode;