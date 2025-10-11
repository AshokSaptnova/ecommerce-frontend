import React, { useState, useEffect } from 'react';
import { useProducts } from '../../../../shared/hooks/useProducts';
import saptnova_logo from '../../../../assets/images/logos/saptnova_logo.png';

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
          background: linear-gradient(135deg, #ffffff, #f8f9fa);
          padding: 15px 40px;
          display: grid;
          grid-template-columns: 320px 1fr 350px;
          align-items: center;
          gap: 30px;
          border-bottom: 3px solid #E8F5E8;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          position: relative;
        }

        .brand-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .saptnova-logo {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #FF6B35, #FF8E53);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1rem;
          text-align: center;
          box-shadow: 0 6px 25px rgba(255, 107, 53, 0.4);
          overflow: hidden;
          border: 3px solid white;
        }

        .logo-image {
          width: 90%;
          height: 90%;
          object-fit: contain;
          background: white;
          border-radius: 50%;
          padding: 10px;
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
          font-size: 2.2rem;
          font-weight: 700;
          margin: 0;
          line-height: 1.1;
          text-shadow: 0 2px 4px rgba(255, 107, 53, 0.2);
          background: linear-gradient(135deg, #FF6B35, #FF8E53);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .product-title-card {
          background: linear-gradient(135deg, #4CAF50, #66BB6A, #81C784);
          color: white;
          padding: 20px 25px;
          border-radius: 25px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(76, 175, 80, 0.4);
          position: relative;
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }

        .product-title-card h2 {
          margin: 0 0 8px 0;
          font-size: 1.4rem;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .product-subtitle {
          font-size: 1rem;
          opacity: 0.9;
          margin-bottom: 0;
        }

        /* Main Content Layout - 40% Ingredients, 60% Benefits+Image */
        .pdf-main-content {
          display: flex !important;
          width: 100%;
          flex: 1;
          background: white;
          position: relative;
          min-height: 500px;
        }

        /* Left Column - Ingredients (40% width) */
        .ingredients-section {
          background: #F8F9FA;
          padding: 30px 25px;
          border-right: 1px solid #E0E0E0;
          width: 40%;
          flex: 0 0 40%;
          min-height: 500px;
          max-height: 600px;
          overflow-y: auto;
          overflow-x: hidden;
        }

        /* Custom scrollbar for ingredients section */
        .ingredients-section::-webkit-scrollbar {
          width: 8px;
        }

        .ingredients-section::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .ingredients-section::-webkit-scrollbar-thumb {
          background: #4CAF50;
          border-radius: 4px;
        }

        .ingredients-section::-webkit-scrollbar-thumb:hover {
          background: #45a049;
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

        /* Product Image Section (50% of right column) */
        .product-center {
          background: linear-gradient(135deg, #E8F5E8, #F1F8E9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 15px;
          position: relative;
          width: 50%;
          flex: 0 0 50%;
          min-height: 500px;
          max-height: 600px;
          overflow: hidden;
        }

        .center-circles {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 95%;
          height: 95%;
        }

        .circle-large {
          position: absolute;
          width: 85%;
          height: 85%;
          border: 4px solid rgba(76, 175, 80, 0.3);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 4s ease-in-out infinite;
        }

        .circle-small {
          position: absolute;
          width: 70%;
          height: 70%;
          border: 3px solid rgba(255, 107, 53, 0.3);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 4s ease-in-out infinite reverse;
        }

        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
          50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
        }

        .product-image-container {
          position: relative;
          z-index: 10;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          box-sizing: border-box;
          overflow: hidden;
        }

        .product-image {
          max-width: 90%;
          max-height: 90%;
          width: auto;
          height: auto;
          object-fit: contain;
          border-radius: 15px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          background: white;
          padding: 5px;
          box-sizing: border-box;
          min-height: 300px;
        }

        .product-image:hover {
          transform: scale(1.05);
        }

        .mechanism-diagram {
          position: absolute;
          bottom: 15px;
          right: 15px;
          width: 140px;
          height: 50px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 249, 250, 0.95));
          border-radius: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          color: #2E7D32;
          font-weight: 600;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(76, 175, 80, 0.3);
        }

        /* Right Column Container - 60% width */
        .right-column {
          display: flex !important;
          width: 60%;
          flex: 0 0 60%;
          border-left: 1px solid #E0E0E0;
          min-height: 500px;
        }

        /* Benefits Section (50% of right column) */
        .benefits-info-section {
          background: #F8F9FA;
          padding: 30px 25px;
          border-right: 1px solid #E0E0E0;
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 40%;
          flex: 0 0 40%;
          min-height: 500px;
          max-height: 600px;
        }

        .benefits-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .benefit-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          background: white;
          padding: 18px;
          border-radius: 12px;
          border-left: 4px solid #FF6B35;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

        /* Enhanced Footer with Modern Design */
        .pdf-footer {
          background: linear-gradient(135deg, #ffffff, #f8f9fa, #e8f5e8);
          padding: 40px 50px;
          border-top: 4px solid transparent;
          border-image: linear-gradient(90deg, #4CAF50, #FF6B35, #4CAF50) 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 -8px 25px rgba(0, 0, 0, 0.08);
          position: relative;
          overflow: hidden;
        }

        .pdf-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #4CAF50 0%, #FF6B35 50%, #4CAF50 100%);
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }

        .pdf-footer::after {
          content: '';
          position: absolute;
          top: -50px;
          right: -50px;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(76, 175, 80, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .product-meta {
          display: flex;
          flex-direction: row;
          gap: 25px;
          align-items: center;
          flex-wrap: nowrap;
          flex-shrink: 0;
          justify-content: flex-start;
        }

        .meta-item {
          text-align: center;
          background: linear-gradient(135deg, #ffffff, #f8f9fa);
          padding: 18px 22px;
          border-radius: 20px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          border: 2px solid transparent;
          background-clip: padding-box;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          min-width: 110px;
          max-width: 140px;
          flex-shrink: 0;
        }

        .meta-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(255, 107, 53, 0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 18px;
        }

        .meta-item:hover::before {
          opacity: 1;
        }

        .meta-item:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
          border: 2px solid rgba(76, 175, 80, 0.3);
        }

        .meta-label {
          font-size: 0.75rem;
          color: #666;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
          position: relative;
          z-index: 2;
        }

        .meta-value {
          font-size: 1.4rem;
          font-weight: 800;
          color: #2E7D32;
          margin: 0;
          position: relative;
          z-index: 2;
          background: linear-gradient(135deg, #2E7D32, #4CAF50);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .certification-badges {
          display: flex;
          gap: 20px;
          align-items: center;
          position: relative;
        }

        .certification-badges::before {
          content: '🏆';
          position: absolute;
          left: -45px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 2.5rem;
          opacity: 0.4;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(-50%) scale(1); }
          50% { transform: translateY(-60%) scale(1.1); }
        }

        .cert-badge {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #4CAF50, #66BB6A, #81C784, #A5D6A7);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 0.8rem;
          text-align: center;
          box-shadow: 0 10px 35px rgba(76, 175, 80, 0.4);
          position: relative;
          border: 4px solid white;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .cert-badge::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transform: rotate(45deg);
          transition: all 0.6s ease;
          opacity: 0;
        }

        .cert-badge:hover::before {
          animation: shine 0.6s ease-in-out;
          opacity: 1;
        }

        @keyframes shine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }

        .cert-badge:hover {
          transform: scale(1.15) rotate(-8deg);
          box-shadow: 0 15px 45px rgba(76, 175, 80, 0.6);
        }

        .cert-badge:nth-child(even):hover {
          transform: scale(1.15) rotate(8deg);
        }

        .cert-badge::after {
          content: '';
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.5);
          box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.3);
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
            flex-direction: column !important;
          }
          
          .ingredients-section {
            width: 100% !important;
            flex: none !important;
          }
          
          .right-column {
            width: 100% !important;
            flex: none !important;
            flex-direction: column !important;
          }
          
          .benefits-info-section {
            width: 100% !important;
            flex: none !important;
          }
          
          .product-center {
            width: 100% !important;
            flex: none !important;
          }
          
          .pdf-header {
            grid-template-columns: 1fr;
            gap: 20px;
            text-align: center;
          }
          
          .main-title {
            font-size: 2rem;
          }

          /* Footer responsive adjustments */
          .pdf-footer {
            padding: 30px 25px;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
          }

          .product-meta {
            justify-content: center;
            gap: 15px;
            flex-wrap: nowrap;
            flex-direction: row;
          }

          .meta-item {
            min-width: 100px;
            max-width: 120px;
            padding: 15px 18px;
          }

          .certification-badges::before {
            display: none;
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

          /* Enhanced mobile footer design */
          .pdf-footer {
            padding: 25px 15px;
            flex-direction: column;
            gap: 25px;
          }

          .product-meta {
            justify-content: center;
            gap: 10px;
            flex-wrap: nowrap;
            flex-direction: row;
          }

          .meta-item {
            padding: 12px 15px;
            min-width: 85px;
            max-width: 110px;
            font-size: 0.9rem;
          }

          .meta-value {
            font-size: 1.2rem;
          }

          .cert-badge {
            width: 80px;
            height: 80px;
            font-size: 0.7rem;
          }

          .certification-badges {
            gap: 15px;
            justify-content: center;
          }

          .certification-badges::before {
            display: none;
          }
        }

        @media (max-width: 400px) {
          /* Very small screens - keep meta items horizontal but make them smaller */
          .product-meta {
            flex-direction: row;
            gap: 8px;
            width: 100%;
            justify-content: center;
          }

          .meta-item {
            padding: 12px 15px;
            min-width: 80px;
            max-width: 100px;
            margin: 0;
          }

          .meta-label {
            font-size: 0.65rem;
          }

          .meta-value {
            font-size: 1.1rem;
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
              <img 
                src={saptnova_logo} 
                alt="SAPTNOVA Logo"
                className="logo-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = 'SAPT<br/>NOVA®';
                }}
              />
            </div>
            <div className="brand-text">
              <h1>SAPTNOVA®</h1>
              <p>Ayurveda</p>
              <p>Authentic Ayurvedic Products</p>
            </div>
          </div>
          
          <div>
            <h1 className="main-title">{currentProduct.name}</h1>
          </div>
          
          <div className="product-title-card">
            <h2>{currentProduct.tagline}</h2>
            <p className="product-subtitle">
              {typeof currentProduct.category === 'string' 
                ? currentProduct.category 
                : (currentProduct.category?.name || 'Uncategorized')}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="pdf-main-content">
          {/* Left Column - Ingredients (40%) */}
          <div className="ingredients-section">
            <h3 className="ingredients-title">
              Each {currentProduct.specifications?.packing} {currentProduct.specifications?.type || 'Product'} Contains:-
            </h3>
            <div className="ingredients-list">
              {currentProduct.specifications?.ingredients && currentProduct.specifications.ingredients.map((ingredient) => (
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

          {/* Right Column Container (60%) */}
          <div className="right-column">
            {/* Benefits Section (left half of right column) */}
            <div className="benefits-info-section">
              <div className="benefits-list">
                {currentProduct.specifications?.benefits && currentProduct.specifications.benefits.map((benefit, index) => (
                  <div key={index} className="benefit-item">
                    <div className="benefit-icon">💊</div>
                    <p className="benefit-text">{typeof benefit === 'string' ? benefit : benefit.text}</p>
                  </div>
                ))}
              </div>
              
              <div className="dosage-info">
                <h3>Dosage</h3>
                <p className="dosage-text">{currentProduct.specifications?.dosage}</p>
              </div>
            </div>

            {/* Product Image Section (right half of right column) */}
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
          </div>
        </div>

        {/* Footer */}
        <div className="pdf-footer">
          <div className="product-meta">
            <div className="meta-item">
              <div className="meta-label">Packing</div>
              <div className="meta-value">{currentProduct.specifications?.packing}</div>
            </div>
            <div className="meta-item">
              <div className="meta-label">Type</div>
              <div className="meta-value">{currentProduct.specifications?.type || 'Product'}</div>
            </div>
            {currentProduct.price && (
              <div className="meta-item">
                <div className="meta-label">Price</div>
                <div className="meta-value">
                  ₹{currentProduct.price}
                  {currentProduct.compare_price && currentProduct.compare_price > currentProduct.price && (
                    <span style={{textDecoration: 'line-through', opacity: 0.6, marginLeft: 8, fontSize: '0.9rem'}}>
                      ₹{currentProduct.compare_price}
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