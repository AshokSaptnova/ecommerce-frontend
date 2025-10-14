import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import './CategorySlider.css';

const CategorySlider = () => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Predefined colors for categories
  const colorPalette = [
    "#2d3436", // Black
    "#55efc4", // Mint
    "#ff7675", // Coral
    "#0c8599", // Teal
    "#ffeaa7", // Yellow
    "#74b9ff", // Blue
    "#fd79a8", // Pink
    "#7bed9f", // Green
    "#ff4757", // Red
    "#1abc9c", // Turquoise
    "#6c5ce7", // Purple
    "#00b894"  // Dark Green
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/categories/');
      
      // Add color and image to each category
      const categoriesWithColors = response.map((cat, index) => ({
        ...cat,
        color: colorPalette[index % colorPalette.length],
        // Use category image if available, otherwise use placeholder
        displayImage: cat.image_url || '/images/placeholder.jpg'
      }));
      
      setCategories(categoriesWithColors);
      setLoading(false);
      
      // Check scroll position after categories load
      setTimeout(checkScrollPosition, 100);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const checkScrollPosition = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 5); // Add small threshold
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      checkScrollPosition();
    }, 100); // Small delay to ensure DOM is ready

    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      
      return () => {
        slider.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }

    return () => clearTimeout(timer);
  }, []);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 320; // Slightly more than card width
      const currentScroll = sliderRef.current.scrollLeft;
      const newScrollLeft = direction === 'left' 
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount;
      
      sliderRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      // Update button visibility after scroll
      setTimeout(checkScrollPosition, 300);
    }
  };

  const handleCategoryClick = (category) => {
    // Navigate to all products page with category filter
    navigate('/all-products', { state: { category: category.name } });
  };

  if (loading) {
    return (
      <div className="category-slider-section">
        <div className="category-header">
          <h2 className="category-title">
            <span className="icon">🌿</span>
            Shop What You Love
            <span className="icon">🌿</span>
          </h2>
        </div>
        <div className="category-loading">
          <div className="loading-spinner"></div>
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null; // Don't show section if no categories
  }

  return (
    <div className="category-slider-section">
      <div className="category-header">
        <h2 className="category-title">
          <span className="icon">🌿</span>
          Shop What You Love
          <span className="icon">🌿</span>
        </h2>
      </div>

      <div className="category-slider-wrapper">
        <button 
          className="category-nav-btn left"
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
        >
          ‹
        </button>

        <div className="category-slider" ref={sliderRef}>
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => handleCategoryClick(category)}
              style={{ backgroundColor: category.color }}
            >
              <div className="category-image">
                <img 
                  src={category.displayImage} 
                  alt={category.name}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
              </div>
              <div className="category-name">{category.name}</div>
              <div className="category-dot">●</div>
            </div>
          ))}
        </div>

        <button 
          className="category-nav-btn right"
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default CategorySlider;
