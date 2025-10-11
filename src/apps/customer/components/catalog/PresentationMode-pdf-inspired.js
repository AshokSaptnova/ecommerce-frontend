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
          background: 'linear-gradient(135deg, #4CAF50, #81C784)',
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
          background: 'linear-gradient(135deg, #4CAF50, #81C784)',
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
          background: 'linear-gradient(135deg, #4CAF50, #81C784)',
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
          background: 'linear-gradient(135deg, #4CAF50, #81C784)',
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
          background: linear-gradient(135deg, #E8F5E8, #F1F8E9);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          position: relative;
          overflow-x: hidden;
          padding: 0;
          margin: 0;
        }

        .pdf-layout {
          width: 100%;
          min-height: 100vh;
          background: white;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        /* Header matching PDF */
        .pdf-header {
          background: white;
          padding: 20px 40px;
          display: grid;
          grid-template-columns: 300px 1fr 300px;
          align-items: center;
          gap: 40px;
          border-bottom: 2px solid #E8F5E8;
        }

        .brand-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .saptnova-logo {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #FF6B35, #FF8E53);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 0.9rem;
          text-align: center;
          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
        }

        .brand-text {
          color: #2E7D32;
        }

        .brand-text h1 {
          margin: 0;
          font-size: 1.8rem;
          font-weight: bold;
        }

        .brand-text p {
          margin: 2px 0;
          font-size: 0.9rem;
          color: #666;
        }

        .main-title {
          text-align: center;
          color: #FF6B35;
          font-size: 2.8rem;
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
        }

        .product-title-card {
          background: linear-gradient(135deg, #4CAF50, #66BB6A);
          color: white;
          padding: 25px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
          position: relative;
        }

        .product-title-card h2 {
          margin: 0 0 5px 0;
          font-size: 1.6rem;
          font-weight: 600;
        }

        .product-subtitle {
          font-size: 1rem;
          opacity: 0.9;
          margin-bottom: 0;
        }

        /* Main Content Layout matching PDF */
        .pdf-main-content {
          display: grid;
          grid-template-columns: 1fr 400px 1fr;
          gap: 0;
          flex: 1;
          background: white;
          position: relative;
        }

        /* Left Column - Ingredients (matching PDF layout exactly) */
        .ingredients-section {
          background: #F8F9FA;
          padding: 30px 25px;
          border-right: 1px solid #E0E0E0;
        }

        .ingredients-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2E7D32;
          margin-bottom: 20px;
          text-align: left;
        }

        .ingredients-list {
          display: grid;
          gap: 12px;
        }

        .ingredient-row {
          background: white;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border-left: 3px solid #4CAF50;
          transition: all 0.3s ease;
        }

        .ingredient-row:hover {
          transform: translateX(5px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .ingredient-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .ingredient-name {
          font-weight: 600;
          color: #2E7D32;
          font-size: 1rem;
        }

        .ingredient-latin {
          font-style: italic;
          color: #666;
          font-size: 0.85rem;
          margin-top: 2px;
        }

        .ingredient-quantity {
          background: linear-gradient(135deg, #FF6B35, #FF8E53);
          color: white;
          padding: 4px 10px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.85rem;
          box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
        }

        .ingredient-description {
          color: #555;
          font-size: 0.85rem;
          line-height: 1.4;
          margin: 0;
        }

        /* Center Column - Product Visual */
        .product-center {
          background: linear-gradient(135deg, #E8F5E8, #F1F8E9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          position: relative;
        }

        .center-circles {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 300px;
          height: 300px;
        }

        .circle-large {
          position: absolute;
          width: 250px;
          height: 250px;
          border: 3px solid rgba(76, 175, 80, 0.3);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .circle-small {
          position: absolute;
          width: 180px;
          height: 180px;
          border: 2px solid rgba(255, 107, 53, 0.3);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .product-image-container {
          position: relative;
          z-index: 10;
          width: 280px;
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 15px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s ease;
        }

        .product-image:hover {
          transform: scale(1.05);
        }

        .mechanism-diagram {
          position: absolute;
          bottom: 20px;
          right: 20px;
          width: 120px;
          height: 80px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          color: #2E7D32;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        /* Right Column - Benefits and Info */
        .benefits-info-section {
          background: white;
          padding: 30px 25px;
          border-left: 1px solid #E0E0E0;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .benefits-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .benefit-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          background: #FFF3E0;
          padding: 20px;
          border-radius: 12px;
          border-left: 4px solid #FF6B35;
          transition: all 0.3s ease;
        }

        .benefit-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(255, 107, 53, 0.2);
        }

        .benefit-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #FF6B35, #FF8E53);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
          flex-shrink: 0;
          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
        }

        .benefit-text {
          color: #2E7D32;
          font-weight: 500;
          font-size: 1rem;
          margin: 0;
          line-height: 1.4;
        }

        .dosage-info {
          background: linear-gradient(135deg, #4CAF50, #66BB6A);
          color: white;
          padding: 20px;
          border-radius: 15px;
          text-align: center;
          box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
        }

        .dosage-info h3 {
          margin: 0 0 10px 0;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .dosage-text {
          font-size: 0.9rem;
          line-height: 1.4;
          margin: 0;
        }

        /* Footer matching PDF certification badges */
        .pdf-footer {
          background: #F8F9FA;
          padding: 25px 40px;
          border-top: 2px solid #E8F5E8;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .product-meta {
          display: flex;
          gap: 40px;
          align-items: center;
        }

        .meta-item {
          text-align: center;
        }

        .meta-label {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 5px;
        }

        .meta-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2E7D32;
        }

        .certification-badges {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .cert-badge {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #4CAF50, #66BB6A);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 0.7rem;
          text-align: center;
          box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
          position: relative;
        }

        .cert-badge::after {
          content: '';
          position: absolute;
          inset: 3px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        /* Navigation Controls */
        .presentation-controls {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 15px;
          background: rgba(46, 125, 50, 0.9);
          padding: 15px 25px;
          border-radius: 50px;
          backdrop-filter: blur(10px);
          transition: opacity 0.3s ease;
          z-index: 1000;
          box-shadow: 0 8px 25px rgba(46, 125, 50, 0.3);
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
          background: #FF6B35;
          box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
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
          background: #FF6B35;
          transform: scale(1.3);
        }

        .product-counter {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          padding: 0 15px;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .pdf-main-content {
            grid-template-columns: 1fr;
            gap: 0;
          }
          
          .pdf-header {
            grid-template-columns: 1fr;
            gap: 20px;
            text-align: center;
          }
          
          .main-title {
            font-size: 2rem;
          }
        }

        @media (max-width: 768px) {
          .pdf-header {
            padding: 15px 20px;
          }
          
          .main-title {
            font-size: 1.5rem;
          }
          
          .pdf-main-content {
            padding: 15px;
          }
          
          .presentation-controls {
            bottom: 20px;
            padding: 10px 15px;
            flex-wrap: wrap;
            justify-content: center;
          }
        }

        /* Animation for smooth transitions */
        .pdf-layout * {
          transition: all 0.3s ease;
        }

        /* Decorative elements */
        .decorative-leaf {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 3rem;
          opacity: 0.1;
          color: #4CAF50;
          transform: rotate(15deg);
        }
      `}</style>

      <div className="pdf-layout">
        {/* Header Section */}
        <div className="pdf-header">
          <div className="brand-section">
            <div className="saptnova-logo">
              SAPT<br/>NOVA®
            </div>
            <div className="brand-text">
              <h1>SAPTNOVA®</h1>
              <p>Ayurveda</p>
              <p>Authentic Ayurvedic Products</p>
            </div>
          </div>
          
          <div>
            <h1 className="main-title">{currentProduct.tagline}</h1>
          </div>
          
          <div className="product-title-card">
            <h2>{currentProduct.name}</h2>
            <p className="product-subtitle">
              {typeof currentProduct.category === 'string' 
                ? currentProduct.category 
                : (currentProduct.category?.name || 'Uncategorized')}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="pdf-main-content">
          {/* Left Column - Ingredients */}
          <div className="ingredients-section">
            <h3 className="ingredients-title">
              Each {currentProduct.packing} {currentProduct.type} Contains:-
            </h3>
            <div className="ingredients-list">
              {currentProduct.ingredients && currentProduct.ingredients.map((ingredient) => (
                <div key={ingredient.id} className="ingredient-row">
                  <div className="ingredient-header">
                    <div>
                      <div className="ingredient-name">{ingredient.name}</div>
                      {ingredient.latin && (
                        <div className="ingredient-latin">({ingredient.latin})</div>
                      )}
                    </div>
                    <div className="ingredient-quantity">{ingredient.quantity}</div>
                  </div>
                  <p className="ingredient-description">{ingredient.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Center Column - Product Visual */}
          <div className="product-center">
            <div className="center-circles">
              <div className="circle-large"></div>
              <div className="circle-small"></div>
            </div>
            
            <div className="product-image-container">
              <img 
                src={currentProduct.images && currentProduct.images.length > 0 ? currentProduct.images[0].image_url : '/images/placeholder.jpg'} 
                alt={currentProduct.name}
                className="product-image"
                onError={(e) => {
                  e.target.src = '/images/placeholder.jpg';
                }}
              />
            </div>
            
            <div className="mechanism-diagram">
              Mechanism of Action Control
            </div>
            
            <div className="decorative-leaf">🌿</div>
          </div>

          {/* Right Column - Benefits and Info */}
          <div className="benefits-info-section">
            <div className="benefits-list">
              {currentProduct.benefits && currentProduct.benefits.map((benefit) => (
                <div key={benefit.id} className="benefit-item">
                  <div className="benefit-icon">💊</div>
                  <p className="benefit-text">{benefit.text}</p>
                </div>
              ))}
            </div>
            
            <div className="dosage-info">
              <h3>Dosage</h3>
              <p className="dosage-text">{currentProduct.dosage}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pdf-footer">
          <div className="product-meta">
            <div className="meta-item">
              <div className="meta-label">Packing</div>
              <div className="meta-value">{currentProduct.packing}</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Type</div>
              <div className="meta-value">{currentProduct.type}</div>
            </div>
            {currentProduct.mrp && (
              <div className="meta-item">
                <div className="meta-label">Price</div>
                <div className="meta-value">
                  ₹{currentProduct.mrp}
                  {currentProduct.old_mrp && currentProduct.old_mrp > currentProduct.mrp && (
                    <span style={{textDecoration: 'line-through', opacity: 0.6, marginLeft: 8, fontSize: '0.9rem'}}>
                      ₹{currentProduct.old_mrp}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="certification-badges">
            <div className="cert-badge">
              PROPER<br/>CERTIFIED
            </div>
            <div className="cert-badge">
              GMP<br/>CERTIFIED
            </div>
          </div>
        </div>
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