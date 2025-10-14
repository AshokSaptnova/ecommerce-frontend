import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSlider.css';

const HeroSlider = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Ayurvedic Wellness Solutions",
      subtitle: "100% Natural & Pure Herbal Products",
      description: "Discover ancient wisdom in modern wellness. Certified Ayurvedic products for your health.",
      image: "https://raw.githubusercontent.com/AshokSaptnova/saptnova-assets/refs/heads/main/ayurveda-root.png",
      buttonText: "Shop Now",
      buttonLink: "/all-products",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      id: 2,
      title: "Liver Care Excellence",
      subtitle: "YakritNova Liver & Enzyme Syrup",
      description: "Detoxify your liver naturally. Improve digestive enzymes with our premium Ayurvedic formula.",
      image: "https://raw.githubusercontent.com/AshokSaptnova/saptnova-assets/refs/heads/main/ayurveda-root.png",
      buttonText: "Learn More",
      buttonLink: "/products/test-product",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      id: 3,
      title: "Heart Health Solutions",
      subtitle: "CardioShield - Protect Your Heart",
      description: "Maintain healthy heart function with our specially formulated Ayurvedic cardiovascular support.",
      image: "https://raw.githubusercontent.com/AshokSaptnova/saptnova-assets/refs/heads/main/ayurveda-root.png",
      buttonText: "View Products",
      buttonLink: "/all-products",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
      id: 4,
      title: "Diabetes Care",
      subtitle: "Natural Blood Sugar Management",
      description: "Manage diabetes naturally with our certified Ayurvedic formulations. Safe and effective.",
      image: "https://raw.githubusercontent.com/AshokSaptnova/saptnova-assets/refs/heads/main/ayurveda-root.png",
      buttonText: "Explore Range",
      buttonLink: "/all-products",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleButtonClick = (link) => {
    navigate(link);
  };

  return (
    <div className="hero-slider" style={{ background: '#667eea', minHeight: '600px' }}>
      <div className="slider-container">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${index === currentSlide ? 'active' : ''} ${
              index === currentSlide - 1 || (currentSlide === 0 && index === slides.length - 1)
                ? 'prev'
                : ''
            }`}
            style={{ background: slide.gradient }}
          >
            <div className="slide-content">
              <div className="slide-text">
                <div className="slide-badge">
                  <span className="badge-icon">🌿</span>
                  <span>100% Ayurvedic</span>
                </div>
                <h1 className="slide-title">{slide.title}</h1>
                <h2 className="slide-subtitle">{slide.subtitle}</h2>
                <p className="slide-description">{slide.description}</p>
                <button
                  className="slide-cta-btn"
                  onClick={() => handleButtonClick(slide.buttonLink)}
                >
                  {slide.buttonText}
                  <span className="btn-arrow">→</span>
                </button>
                
                {/* Features */}
                <div className="slide-features">
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>Certified</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>No Side Effects</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>Free Shipping</span>
                  </div>
                </div>
              </div>

              <div className="slide-image">
                <div className="image-glow"></div>
                <img src={slide.image} alt={slide.title} />
                <div className="floating-badge floating-badge-1">
                  <span className="badge-number">100%</span>
                  <span className="badge-label">Natural</span>
                </div>
                <div className="floating-badge floating-badge-2">
                  <span className="badge-number">✓</span>
                  <span className="badge-label">Certified</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button className="slider-nav prev-btn" onClick={prevSlide}>
        <span>‹</span>
      </button>
      <button className="slider-nav next-btn" onClick={nextSlide}>
        <span>›</span>
      </button>

      {/* Dots Navigation */}
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="slider-progress">
        <div
          className="progress-bar"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`
          }}
        />
      </div>
    </div>
  );
};

export default HeroSlider;
