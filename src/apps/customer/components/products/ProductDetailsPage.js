import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductDetails } from '../../../../shared/hooks/useProductDetails';
import { useCart } from '../../../../shared/context/CartContext';
import { useAuth } from '../../../../shared/context/AuthContext';
import apiService from '../../../../shared/services/api';
import CheckoutPage from '../../../../shared/components/CheckoutPage';
import Toast from '../../../shared/components/Toast';
import './ProductDetailsPage.css';

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProductDetails(productId);
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedPack, setSelectedPack] = useState('single');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [toast, setToast] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  
  // Wishlist state
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setSelectedImage(0);
    }
  }, [product]);
  
  // Fetch reviews when product changes
  useEffect(() => {
    if (product && product.id) {
      fetchReviews();
      checkIfInWishlist();
    }
  }, [product, isAuthenticated]);
  
  const checkIfInWishlist = async () => {
    if (!isAuthenticated || !product?.id) {
      setIsInWishlist(false);
      return;
    }
    
    try {
      const wishlist = await apiService.request('/wishlist/');
      const isInList = wishlist.some(item => item.product_id === product.id);
      setIsInWishlist(isInList);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };
  
  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const response = await apiService.request(`/products/${product.id}/reviews`);
      setReviews(response);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };
  
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setToast({
        type: 'error',
        message: 'Please login to submit a review'
      });
      return;
    }
    
    if (reviewForm.rating < 1 || reviewForm.rating > 5) {
      setToast({
        type: 'error',
        message: 'Please select a rating between 1 and 5 stars'
      });
      return;
    }
    
    try {
      setSubmittingReview(true);
      await apiService.request(`/products/${product.id}/reviews`, {
        method: 'POST',
        body: JSON.stringify({
          product_id: product.id,
          rating: reviewForm.rating,
          title: reviewForm.title,
          comment: reviewForm.comment
        })
      });
      
      setToast({
        type: 'success',
        message: 'Review submitted successfully! It will appear after approval.'
      });
      
      // Reset form
      setReviewForm({ rating: 5, title: '', comment: '' });
      setShowReviewForm(false);
      
      // Refresh reviews
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      setToast({
        type: 'error',
        message: error.message || 'Failed to submit review. You may have already reviewed this product.'
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  // Handle Add to Cart
  const handleAddToCart = async () => {
    if (!product || isAddingToCart) return;

    console.log('Add to Cart clicked - Product:', product);
    setIsAddingToCart(true);
    try {
      const success = await addToCart(product, quantity);
      
      console.log('Add to cart result:', success);
      if (success) {
        setToast({
          type: 'success',
          message: `Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart successfully!`
        });
      } else {
        setToast({
          type: 'error',
          message: 'Unable to add item to cart. Please try again.'
        });
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      setToast({
        type: 'error',
        message: 'Failed to add item to cart. Please try again.'
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle Add to Wishlist
  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      setToast({
        type: 'error',
        message: 'Please login to add items to wishlist'
      });
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (!product || isAddingToWishlist) return;

    setIsAddingToWishlist(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        await apiService.request(`/wishlist/${product.id}`, {
          method: 'DELETE'
        });
        setIsInWishlist(false);
        setToast({
          type: 'success',
          message: 'Removed from wishlist'
        });
      } else {
        // Add to wishlist
        await apiService.request('/wishlist/', {
          method: 'POST',
          body: JSON.stringify({ product_id: product.id })
        });
        setIsInWishlist(true);
        setToast({
          type: 'success',
          message: '❤️ Added to wishlist successfully!'
        });
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      setToast({
        type: 'error',
        message: error.message || 'Failed to update wishlist. Please try again.'
      });
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  // Handle Buy Now
  const handleBuyNow = async () => {
    if (!product || isAddingToCart) return;

    console.log('Buy Now clicked - Product:', product);
    setIsAddingToCart(true);
    try {
      const success = await addToCart(product, quantity);
      
      console.log('Buy now add to cart result:', success);
      if (success) {
        // Open checkout modal instead of navigating
        setShowCheckout(true);
      } else {
        setToast({
          type: 'error',
          message: 'Unable to proceed. Please try again.'
        });
      }
    } catch (error) {
      console.error('Buy now error:', error);
      setToast({
        type: 'error',
        message: 'Failed to proceed with purchase. Please try again.'
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  // If checkout is shown, render checkout page
  if (showCheckout) {
    return (
      <CheckoutPage 
        onClose={() => setShowCheckout(false)}
      />
    );
  }

  if (loading) {
    return (
      <div className="product-loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-error">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  // Dynamic pack options based on product variants or default pricing
  const basePrice = product.price || 0;
  const comparePrice = product.compare_price || product.original_price || basePrice * 1.15;
  
  const packOptions = product.variants && product.variants.length > 0 
    ? product.variants.map(variant => ({
        id: variant.id || variant.name?.toLowerCase(),
        label: variant.name || `Pack of ${variant.quantity || 1}`,
        subtitle: variant.description || 'Base choice',
        price: basePrice + (variant.price_adjustment || 0),
        originalPrice: comparePrice + (variant.price_adjustment || 0),
        discount: variant.discount_percentage || 0,
        stock: variant.stock_quantity || product.stock_quantity
      }))
    : [
        { 
          id: 'single', 
          label: 'Pack of 1', 
          subtitle: 'Base choice', 
          price: basePrice, 
          originalPrice: comparePrice,
          discount: Math.round(((comparePrice - basePrice) / comparePrice) * 100),
          stock: product.stock_quantity || 0
        },
        { 
          id: 'double', 
          label: 'Pack of 2', 
          subtitle: 'Great value', 
          price: basePrice * 1.9, 
          originalPrice: comparePrice * 2,
          discount: 10,
          stock: product.stock_quantity || 0
        },
        { 
          id: 'triple', 
          label: 'Pack of 3', 
          subtitle: 'Deluxe choice', 
          price: basePrice * 2.7, 
          originalPrice: comparePrice * 3,
          discount: 15,
          stock: product.stock_quantity || 0
        }
      ];

  const selectedPackOption = packOptions.find(pack => pack.id === selectedPack) || packOptions[0];

  // Dynamic product benefits from database
  const productBenefits = product.benefits && product.benefits.length > 0 
    ? product.benefits.map(benefit => ({
        icon: benefit.icon || '🌿',
        title: benefit.text || benefit.title || benefit.name,
        description: benefit.description || benefit.text
      }))
    : [
        { icon: '🌿', title: 'Natural & Pure', description: 'Made with 100% natural ingredients' },
        { icon: '✅', title: 'Quality Assured', description: 'Tested for purity and effectiveness' },
        { icon: '🚫', title: 'No Side Effects', description: 'Safe for regular consumption' },
        { icon: '�', title: 'Health Benefits', description: 'Supports overall wellness and vitality' }
      ];

  // Dynamic ingredients from database
  const ingredients = product.ingredients && product.ingredients.length > 0
    ? product.ingredients.map(ingredient => 
        `🌿 ${ingredient.name}${ingredient.latin ? ` (${ingredient.latin})` : ''}${ingredient.quantity ? ` - ${ingredient.quantity}` : ''}`
      )
    : (product.tags && product.tags.length > 0 
        ? product.tags.map(tag => `🌿 ${tag}`)
        : ['🌿 Natural Herbs', '🌿 Organic Extracts', '🌿 Pure Ingredients']
      );

  // Dynamic key statistics from specifications or default values
  const keyStats = product.specifications && product.specifications.stats
    ? Object.entries(product.specifications.stats).map(([key, value]) => ({
        percentage: typeof value === 'object' ? value.percentage : `${value}%`,
        title: typeof value === 'object' ? value.title : key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        subtitle: typeof value === 'object' ? value.description : `Provides ${value}% improvement in ${key}`
      }))
    : [
        { percentage: '95%', title: 'Natural Purity', subtitle: 'Contains 95% pure natural ingredients' },
        { percentage: '88%', title: 'Customer Satisfaction', subtitle: 'Based on verified customer reviews' },
        { percentage: '92%', title: 'Quality Assurance', subtitle: 'Meets highest quality standards' }
      ];

  // Calculate average rating from reviews
  const averageRating = product.average_rating || 0;
  const reviewCount = product.review_count || 0;

  // Calculate stock status
  const stockStatus = selectedPackOption.stock > 20 
    ? { message: 'In Stock', class: 'in-stock', urgency: false }
    : selectedPackOption.stock > 5 
      ? { message: `Only ${selectedPackOption.stock} left!`, class: 'low-stock', urgency: true }
      : selectedPackOption.stock > 0 
        ? { message: `Hurry! Only ${selectedPackOption.stock} left!`, class: 'very-low-stock', urgency: true }
        : { message: 'Out of Stock', class: 'out-of-stock', urgency: false };

  // Get product category name
  const categoryName = typeof product.category === 'object' 
    ? product.category.name 
    : product.category || 'Health & Wellness';

  return (
    <div className="product-details-page">
      {/* Product Header Section */}
      <div className="product-header">
        <div className="container">
          <div className="product-main">
            {/* Product Images */}
            <div className="product-images">
              <div className="main-image">
                {selectedPackOption.discount > 0 && (
                  <div className="sale-badge">Sale {selectedPackOption.discount}% off</div>
                )}
                <img 
                  src={product.images?.[selectedImage]?.image_url || product.image_url || '/images/placeholder.jpg'} 
                  alt={product.images?.[selectedImage]?.alt_text || product.name}
                />
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="thumbnail-images">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.image_url}
                      alt={`${product.name} view ${index + 1}`}
                      className={selectedImage === index ? 'active' : ''}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="product-info">
              <div className="title-wishlist-row">
                <h1 className="product-title">{product.name}</h1>
                <button 
                  className={`wishlist-btn-header ${isInWishlist ? 'active' : ''}`}
                  onClick={handleAddToWishlist}
                  disabled={isAddingToWishlist}
                  title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {isAddingToWishlist ? '⏳' : isInWishlist ? '❤️' : '🤍'}
                </button>
              </div>
              
              <div className="product-rating">
                <div className="stars">
                  {averageRating > 0 ? (
                    <>
                      {'⭐'.repeat(Math.floor(averageRating))}
                      {averageRating % 1 >= 0.5 && '⭐'}
                    </>
                  ) : (
                    <span>No ratings yet</span>
                  )}
                </div>
                <span className="rating-text">
                  {averageRating > 0 ? (
                    <>Rated {averageRating.toFixed(1)} Stars ❤️ by {reviewCount} {reviewCount === 1 ? 'Person' : 'People'}</>
                  ) : (
                    <>Be the first to review!</>
                  )}
                </span>
              </div>

              {stockStatus.urgency && (
                <div className={`stock-alert ${stockStatus.class}`}>
                  <span className="stock-warning">⚡ {stockStatus.message.toUpperCase()}</span>
                </div>
              )}

              <div className="product-description">
                <p>{product.description || product.short_description}</p>
                {product.short_description && product.description && product.short_description !== product.description && (
                  <p className="short-description">{product.short_description}</p>
                )}
              </div>

              {/* Product Benefits Tags */}
              <div className="benefit-tags">
                {productBenefits.map((benefit, index) => (
                  <div key={index} className="benefit-tag">
                    <span className="benefit-icon">{benefit.icon}</span>
                    <span className="benefit-text">{benefit.title}</span>
                  </div>
                ))}
              </div>

              {/* Dynamic Sale Banner */}
              {selectedPackOption.discount > 0 && (
                <div className="sale-banner">
                  <span className="sale-text">
                    ✨ Save Upto {selectedPackOption.discount}% ✨ Special Offer ✨
                  </span>
                  <button className="copy-code-btn" onClick={() => navigator.clipboard?.writeText('SAVE' + selectedPackOption.discount)}>
                    Copy Code
                  </button>
                </div>
              )}

              {/* Pack Selection */}
              <div className="pack-selection">
                <h3>Choose Your Pack:</h3>
                <div className="pack-options">
                  {packOptions.map((pack) => (
                    <div 
                      key={pack.id}
                      className={`pack-option ${selectedPack === pack.id ? 'selected' : ''}`}
                      onClick={() => setSelectedPack(pack.id)}
                    >
                      <div className="pack-header">
                        <span className="pack-label">{pack.label}</span>
                        <span className="pack-subtitle">{pack.subtitle}</span>
                      </div>
                      <div className="pack-pricing">
                        <span className="original-price">₹{pack.originalPrice.toFixed(2)}</span>
                        <span className="sale-price">₹{pack.price.toFixed(2)}</span>
                        {pack.discount > 0 && (
                          <span className="discount-badge">SALE {pack.discount}%</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="delivery-info">
                <div className="delivery-item">
                  <span className="delivery-icon">🚚</span>
                  <span>
                    {product.requires_shipping !== false ? (
                      <>Estimated delivery by {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} - {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}</>
                    ) : (
                      'Digital product - Instant access after purchase'
                    )}
                  </span>
                </div>
                {product.weight && (
                  <div className="delivery-item">
                    <span className="delivery-icon">⚖️</span>
                    <span>Product Weight: {product.weight}g</span>
                  </div>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              <div className="purchase-section">
                <div className="quantity-selector">
                  <button 
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="qty-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>

                <div className="action-buttons">
                  <button 
                    className="add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || (product.track_inventory && product.stock_quantity < quantity)}
                  >
                    {isAddingToCart ? 'Adding...' : '🛒 Add to Cart'}
                  </button>
                  <button 
                    className="buy-now-btn"
                    onClick={handleBuyNow}
                    disabled={isAddingToCart || (product.track_inventory && product.stock_quantity < quantity)}
                  >
                    {isAddingToCart ? 'Processing...' : '💳 Buy Now'}
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="trust-badges">
                {product.requires_shipping !== false && (
                  <div className="trust-badge">
                    <span className="badge-icon">🚚</span>
                    <span>Free Shipping</span>
                  </div>
                )}
                <div className="trust-badge">
                  <span className="badge-icon">🌿</span>
                  <span>
                    {product.specifications?.organic ? '100% Organic' : 'Natural & Pure'}
                  </span>
                </div>
                <div className="trust-badge">
                  <span className="badge-icon">✅</span>
                  <span>
                    {product.specifications?.certifications 
                      ? product.specifications.certifications.join(' & ') + ' Certified'
                      : 'Quality Assured'
                    }
                  </span>
                </div>
                {product.vendor && (
                  <div className="trust-badge">
                    <span className="badge-icon">🏪</span>
                    <span>Sold by {product.vendor.business_name || product.vendor.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Statistics Section */}
      <div className="key-stats-section">
        <div className="container">
          <h2>Revitalize Your Life, Naturally!</h2>
          <p className="section-subtitle">
            Where Ancient Wisdom Meets Modern Wellness—Embrace Balance, Vitality, and Harmony with Products 
            Designed to Nurture Body, Mind, and Spirit.
          </p>
          
          <div className="key-stats">
            {keyStats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-percentage">{stat.percentage}</div>
                <h3 className="stat-title">{stat.title}</h3>
                <p className="stat-subtitle">{stat.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Benefits Section */}
      <div className="product-benefits-section">
        <div className="container">
          <h2>Product Benefits</h2>
          <p className="section-subtitle">
            Crafted with Care to Balance, Energize, and Restore—Our Products Harness the Best of Ayurveda 
            to Support Your Body, Mind, and Spirit for True Wellness
          </p>
          
          <div className="benefits-grid">
            {productBenefits.slice(0, 6).map((benefit, index) => (
              <div key={index} className="benefit-card" title={benefit.description}>
                <div className="benefit-icon-large">{benefit.icon}</div>
                <h3>{benefit.title}</h3>
                {benefit.description && (
                  <p className="benefit-description">{benefit.description}</p>
                )}
              </div>
            ))}
            {productBenefits.length === 0 && (
              <>
                <div className="benefit-card">
                  <div className="benefit-icon-large">🌿</div>
                  <h3>Natural & Pure</h3>
                  <p className="benefit-description">Made with 100% natural ingredients</p>
                </div>
                <div className="benefit-card">
                  <div className="benefit-icon-large">✅</div>
                  <h3>Quality Assured</h3>
                  <p className="benefit-description">Tested for purity and effectiveness</p>
                </div>
                <div className="benefit-card">
                  <div className="benefit-icon-large">💚</div>
                  <h3>Health Benefits</h3>
                  <p className="benefit-description">Supports overall wellness and vitality</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Ingredients Section */}
      <div className="ingredients-section">
        <div className="container">
          <h2>Product Ingredients</h2>
          <p className="section-subtitle">
            Unlock Your Best Self with Saptnova's 100% Natural Ayurvedic Products. Boost Immunity, 
            Energy, and Wellness—Delivered Straight to Your Door.
          </p>
          
          <div className="ingredients-grid">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-card">
                <span className="ingredient-text">{ingredient}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Information Tabs */}
      <div className="product-tabs-section">
        <div className="container">
          <div className="tab-navigation">
            <button 
              className={activeTab === 'description' ? 'active' : ''}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={activeTab === 'ingredients' ? 'active' : ''}
              onClick={() => setActiveTab('ingredients')}
            >
              Ingredients
            </button>
            <button 
              className={activeTab === 'usage' ? 'active' : ''}
              onClick={() => setActiveTab('usage')}
            >
              How to Use
            </button>
            <button 
              className={activeTab === 'reviews' ? 'active' : ''}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="tab-panel">
                <h3>Product Description</h3>
                <div className="description-content">
                  {product.description && <p>{product.description}</p>}
                  {product.short_description && product.short_description !== product.description && (
                    <p><strong>Summary:</strong> {product.short_description}</p>
                  )}
                  
                  {product.specifications && (
                    <div className="specifications">
                      <h4>Product Specifications</h4>
                      <ul>
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <li key={key}>
                            <strong>{key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {
                              typeof value === 'object' ? JSON.stringify(value) : value.toString()
                            }
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="product-meta">
                    <p><strong>Category:</strong> {categoryName}</p>
                    <p><strong>SKU:</strong> {product.sku || product.product_id || 'N/A'}</p>
                    {product.weight && <p><strong>Weight:</strong> {product.weight}g</p>}
                    {product.dimensions && (
                      <p><strong>Dimensions:</strong> {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} cm</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'ingredients' && (
              <div className="tab-panel">
                <h3>
                  {product.ingredients && product.ingredients.length > 0 ? 'Natural Ingredients' : 'Product Tags'}
                </h3>
                <ul className="ingredients-list">
                  {ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
                
                {product.ingredients && product.ingredients.length > 0 && (
                  <div className="ingredients-details">
                    {product.ingredients.map((ingredient, index) => (
                      ingredient.description && (
                        <div key={index} className="ingredient-detail">
                          <h4>{ingredient.name}</h4>
                          <p>{ingredient.description}</p>
                          {ingredient.quantity && <span className="ingredient-quantity">Quantity: {ingredient.quantity}</span>}
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'usage' && (
              <div className="tab-panel">
                <h3>How to Use</h3>
                {product.specifications?.usage_instructions ? (
                  <div className="usage-instructions">
                    {Array.isArray(product.specifications.usage_instructions) ? (
                      <ol className="usage-steps">
                        {product.specifications.usage_instructions.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    ) : (
                      <p>{product.specifications.usage_instructions}</p>
                    )}
                  </div>
                ) : (
                  <div className="default-usage">
                    <ol className="usage-steps">
                      <li>Read all instructions carefully before use</li>
                      <li>Follow recommended dosage as mentioned on packaging</li>
                      <li>Store in a cool, dry place away from direct sunlight</li>
                      <li>Keep out of reach of children</li>
                      <li>Consult healthcare professional if you have any concerns</li>
                    </ol>
                  </div>
                )}
                
                {product.specifications?.dosage && (
                  <div className="dosage-info">
                    <h4>Recommended Dosage</h4>
                    <p>{product.specifications.dosage}</p>
                  </div>
                )}
                
                {product.specifications?.precautions && (
                  <div className="precautions">
                    <h4>Precautions</h4>
                    <p>{product.specifications.precautions}</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="tab-panel">
                <div className="reviews-header">
                  <h3>Customer Reviews</h3>
                  {isAuthenticated && (
                    <button 
                      className="write-review-btn"
                      onClick={() => setShowReviewForm(!showReviewForm)}
                    >
                      {showReviewForm ? '✕ Cancel' : '✍️ Write a Review'}
                    </button>
                  )}
                </div>
                
                {/* Review Form */}
                {showReviewForm && (
                  <div className="review-form-container">
                    <h4>Write Your Review</h4>
                    <form onSubmit={handleSubmitReview} className="review-form">
                      <div className="form-group">
                        <label>Rating *</label>
                        <div className="star-rating-input">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`star-btn ${reviewForm.rating >= star ? 'active' : ''}`}
                              onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            >
                              ⭐
                            </span>
                          ))}
                          <span className="rating-label">({reviewForm.rating} {reviewForm.rating === 1 ? 'star' : 'stars'})</span>
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label>Review Title</label>
                        <input
                          type="text"
                          placeholder="Summary of your review"
                          value={reviewForm.title}
                          onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                          maxLength={100}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Review *</label>
                        <textarea
                          placeholder="Share your experience with this product..."
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          required
                          rows={5}
                          maxLength={500}
                        />
                        <small>{reviewForm.comment.length}/500 characters</small>
                      </div>
                      
                      <button 
                        type="submit" 
                        className="submit-review-btn"
                        disabled={submittingReview || !reviewForm.comment}
                      >
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  </div>
                )}
                
                {/* Rating Overview */}
                <div className="reviews-summary">
                  <div className="rating-overview">
                    <span className="average-rating">
                      {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
                    </span>
                    <div className="stars-large">
                      {averageRating > 0 ? (
                        <>
                          {'⭐'.repeat(Math.floor(averageRating))}
                          {averageRating % 1 >= 0.5 && '⭐'}
                        </>
                      ) : (
                        <span>☆☆☆☆☆</span>
                      )}
                    </div>
                    <span className="total-reviews">
                      ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                </div>
                
                {/* Reviews List */}
                {loadingReviews ? (
                  <div className="loading-reviews">Loading reviews...</div>
                ) : reviews && reviews.length > 0 ? (
                  <div className="reviews-list">
                    {reviews.map((review) => (
                      <div key={review.id} className="review-item">
                        <div className="reviewer-info">
                          <span className="reviewer-name">
                            {review.user?.full_name || review.user?.username || 'Anonymous'}
                          </span>
                          <div className="review-stars">
                            {'⭐'.repeat(review.rating || 5)}
                          </div>
                          <span className="review-date">
                            {review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}
                          </span>
                        </div>
                        {review.title && <h4>{review.title}</h4>}
                        <p>{review.comment || review.text}</p>
                        {review.is_verified_purchase && (
                          <span className="verified-purchase">✅ Verified Purchase</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-reviews">
                    <p>No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ProductDetailsPage;