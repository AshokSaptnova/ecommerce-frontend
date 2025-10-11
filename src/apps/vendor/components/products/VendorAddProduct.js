import React, { useState, useEffect } from 'react';
import '../../styles/VendorAddProduct.css';
import { handleApiError } from '../../../../shared/utils/errorHandler';

const VendorAddProduct = ({ vendorData, editProduct = null, onSaveSuccess = null }) => {
  const isEditMode = !!editProduct;
  
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    price: '',
    compare_price: '', // MRP (old price)
    stock_quantity: '',
    category_id: '',
    image_url: '',
    is_active: true,
    // Saptnova specific fields
    packing: '',
    dosage: '',
    benefits: [''], // Array of benefits
    ingredients: [{ name: '', quantity: '', description: '' }] // Array of ingredients
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token] = useState(localStorage.getItem('vendorToken'));

  useEffect(() => {
    fetchCategories();
  }, []);

  // Load product data when in edit mode
  useEffect(() => {
    if (isEditMode && editProduct) {
      console.log('🔍 Loading product for edit:', editProduct);
      
      // Parse specifications if it's a string, otherwise use as object
      let specs = {};
      if (editProduct.specifications) {
        if (typeof editProduct.specifications === 'string') {
          try {
            specs = JSON.parse(editProduct.specifications);
            console.log('📝 Parsed specifications from string:', specs);
          } catch (e) {
            console.error('❌ Error parsing specifications:', e);
            specs = {};
          }
        } else if (typeof editProduct.specifications === 'object') {
          specs = editProduct.specifications;
          console.log('📝 Using specifications object:', specs);
        }
      }
      
      // Extract benefits - handle both array and non-array cases
      let benefitsArray = [''];
      if (specs.benefits) {
        if (Array.isArray(specs.benefits) && specs.benefits.length > 0) {
          benefitsArray = specs.benefits;
          console.log('✅ Loaded benefits:', benefitsArray);
        } else {
          console.log('⚠️ Benefits exists but is not a valid array:', specs.benefits);
        }
      } else {
        console.log('⚠️ No benefits found in specifications');
      }
      
      // Extract ingredients - handle both array and non-array cases
      let ingredientsArray = [{ name: '', quantity: '', description: '' }];
      if (specs.ingredients) {
        if (Array.isArray(specs.ingredients) && specs.ingredients.length > 0) {
          ingredientsArray = specs.ingredients;
          console.log('✅ Loaded ingredients:', ingredientsArray);
        } else {
          console.log('⚠️ Ingredients exists but is not a valid array:', specs.ingredients);
        }
      } else {
        console.log('⚠️ No ingredients found in specifications');
      }
      
      const formDataToSet = {
        name: editProduct.name || '',
        tagline: specs.tagline || '',
        description: editProduct.description || '',
        price: editProduct.price || '',
        compare_price: editProduct.compare_price || '',
        stock_quantity: editProduct.stock_quantity || '',
        category_id: editProduct.category_id || '',
        image_url: editProduct.images?.[0]?.image_url || editProduct.image_url || '',
        is_active: editProduct.status === 'active',
        packing: specs.packing || '',
        dosage: specs.dosage || '',
        benefits: benefitsArray,
        ingredients: ingredientsArray
      };
      
      console.log('📋 Setting form data:', formDataToSet);
      setFormData(formDataToSet);
    }
  }, [isEditMode, editProduct]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/categories/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBenefitChange = (index, value) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData(prev => ({ ...prev, benefits: newBenefits }));
  };

  const addBenefit = () => {
    setFormData(prev => ({ ...prev, benefits: [...prev.benefits, ''] }));
  };

  const removeBenefit = (index) => {
    const newBenefits = formData.benefits.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, benefits: newBenefits }));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setFormData(prev => ({ 
      ...prev, 
      ingredients: [...prev.ingredients, { name: '', quantity: '', description: '' }] 
    }));
  };

  const removeIngredient = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('📤 Form data before processing:', formData);
      console.log('📦 Stock quantity raw value:', formData.stock_quantity);
      console.log('📦 Stock quantity parsed:', parseInt(formData.stock_quantity));
      
      // Generate slug from product name
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      const productData = {
        name: formData.name,
        slug: isEditMode ? (editProduct.slug || slug) : slug,
        description: formData.description,
        short_description: formData.tagline || formData.description.substring(0, 150),
        price: parseFloat(formData.price),
        compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
        stock_quantity: parseInt(formData.stock_quantity, 10),
        category_id: parseInt(formData.category_id),
        status: formData.is_active ? 'active' : 'inactive',
        specifications: {
          tagline: formData.tagline,
          packing: formData.packing,
          dosage: formData.dosage,
          benefits: formData.benefits.filter(b => b.trim() !== ''),
          ingredients: formData.ingredients.filter(ing => ing.name.trim() !== '')
        }
      };

      // Add image data for both create and edit modes
      if (formData.image_url.trim()) {
        productData.images = [{
          image_url: formData.image_url.trim(),
          alt_text: formData.name,
          is_primary: true,
          sort_order: 0
        }];
      } else if (isEditMode) {
        // If editing and image_url is empty, explicitly set images to empty array
        productData.images = [];
      }

      // Add fields only for create mode
      if (!isEditMode) {
        productData.vendor_id = vendorData.id;
        productData.sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        productData.track_inventory = true;
        productData.low_stock_threshold = 10;
        productData.is_featured = false;
        productData.is_digital = false;
        productData.requires_shipping = true;
      }

      const url = isEditMode 
        ? `http://127.0.0.1:8000/products/${editProduct.id}`
        : 'http://127.0.0.1:8000/products/';
      
      const method = isEditMode ? 'PUT' : 'POST';

      console.log('🚀 Sending to API:', {
        url,
        method,
        productData
      });
      console.log('📊 Stock quantity in payload:', productData.stock_quantity);
      console.log('🖼️ Image data in payload:', productData.images);
      console.log('🔄 Is Edit Mode:', isEditMode);

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ Response from server:', responseData);
        console.log('📊 Stock quantity in response:', responseData.stock_quantity);
        
        const message = isEditMode ? 'Product updated successfully!' : 'Product created successfully!';
        setSuccess(message);
        
        if (!isEditMode) {
          // Reset form only in create mode
          setFormData({
            name: '',
            tagline: '',
            description: '',
            price: '',
            compare_price: '',
            stock_quantity: '',
            category_id: '',
            image_url: '',
            is_active: true,
            packing: '',
            dosage: '',
            benefits: [''],
            ingredients: [{ name: '', quantity: '', description: '' }]
          });
        }
        
        setTimeout(() => {
          setSuccess('');
          if (isEditMode && onSaveSuccess) {
            onSaveSuccess(); // Callback to parent component
          }
        }, 2000);
      } else {
        const errorMessage = await handleApiError(response);
        setError(errorMessage);
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} product:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendor-add-product">
      <div className="page-header">
        <h1>{isEditMode ? '✏️ Edit Product' : '➕ Add New Product'}</h1>
        <p>{isEditMode ? 'Update product information' : 'Create a new product for your store'}</p>
      </div>

      {error && (
        <div className="error-banner">
          {error.split('\n').map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      )}
      {success && <div className="success-banner">{success}</div>}

      <div className="form-container">
        <form onSubmit={handleSubmit} className="product-form">
          
          {/* Basic Information Section */}
          <div className="form-section">
            <h2>📦 Basic Information</h2>
            <div className="form-grid">
              {/* Product Name */}
              <div className="form-group full-width">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., InsuWish – Ayurvedic Diabetes Care Granules"
                  required
                />
              </div>

              {/* Tagline */}
              <div className="form-group full-width">
                <label htmlFor="tagline">Tagline</label>
                <input
                  type="text"
                  id="tagline"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="e.g., Balances Sugar Naturally, Revitalizes Health with Potent Ayurvedic Herbs"
                />
              </div>

              {/* Category */}
              <div className="form-group">
                <label htmlFor="category_id">Category *</label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image URL */}
              <div className="form-group">
                <label htmlFor="image_url">Product Image URL</label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/product-image.jpg"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory Section */}
          <div className="form-section">
            <h2>💰 Pricing & Inventory</h2>
            <div className="form-grid">
              {/* Price */}
              <div className="form-group">
                <label htmlFor="price">Selling Price (₹) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="218"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              {/* Compare Price (MRP) */}
              <div className="form-group">
                <label htmlFor="compare_price">MRP / Old Price (₹)</label>
                <input
                  type="number"
                  id="compare_price"
                  name="compare_price"
                  value={formData.compare_price}
                  onChange={handleChange}
                  placeholder="233"
                  step="0.01"
                  min="0"
                />
                <small>Original price (for showing discount)</small>
              </div>

              {/* Stock Quantity */}
              <div className="form-group">
                <label htmlFor="stock_quantity">Stock Quantity *</label>
                <input
                  type="number"
                  id="stock_quantity"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  placeholder="100"
                  min="0"
                  required
                />
              </div>

              {/* Packing Info */}
              <div className="form-group">
                <label htmlFor="packing">Packing & MRP</label>
                <input
                  type="text"
                  id="packing"
                  name="packing"
                  value={formData.packing}
                  onChange={handleChange}
                  placeholder="e.g., 100 Gm @ ₹ 218/- (Old ₹ 233/-)"
                />
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="form-section">
            <h2>📋 Product Details</h2>
            <div className="form-grid">
              {/* Description */}
              <div className="form-group full-width">
                <label htmlFor="description">Product Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter detailed product description..."
                  rows="4"
                  required
                />
              </div>

              {/* Dosage */}
              <div className="form-group full-width">
                <label htmlFor="dosage">Dosage & Usage Direction</label>
                <textarea
                  id="dosage"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  placeholder="e.g., 5 Gm Granules 1-2 times a day with luke warm water or as directed by the physician."
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="form-section">
            <h2>✨ Benefits</h2>
            <div className="benefits-list">
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="benefit-item">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => handleBenefitChange(index, e.target.value)}
                    placeholder={`Benefit ${index + 1}`}
                    className="benefit-input"
                  />
                  {formData.benefits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBenefit(index)}
                      className="btn-remove"
                      title="Remove benefit"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addBenefit}
                className="btn-add"
              >
                ➕ Add Benefit
              </button>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="form-section">
            <h2>🌿 Ingredients (Per 10 Gm)</h2>
            <div className="ingredients-list">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="ingredient-item">
                  <div className="ingredient-grid">
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      placeholder="Ingredient name (e.g., Gurmar)"
                      className="ingredient-name"
                    />
                    <input
                      type="text"
                      value={ingredient.quantity}
                      onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                      placeholder="Quantity (e.g., 2200Mg)"
                      className="ingredient-quantity"
                    />
                    <textarea
                      value={ingredient.description}
                      onChange={(e) => handleIngredientChange(index, 'description', e.target.value)}
                      placeholder="Description/Benefits"
                      className="ingredient-description"
                      rows="2"
                    />
                    {formData.ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="btn-remove"
                        title="Remove ingredient"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredient}
                className="btn-add"
              >
                ➕ Add Ingredient
              </button>
            </div>
          </div>

          {/* Status Section */}
          <div className="form-section">
            <h2>⚙️ Settings</h2>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                <span>✅ Make product active immediately</span>
              </label>
            </div>
          </div>

          {/* Image Preview */}
          {formData.image_url && (
            <div className="image-preview">
              <p>Image Preview:</p>
              <img src={formData.image_url} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading 
                ? (isEditMode ? '⏳ Updating Product...' : '⏳ Creating Product...') 
                : (isEditMode ? '💾 Update Product' : '✅ Create Product')}
            </button>
            {!isEditMode && (
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setFormData({
                  name: '',
                  tagline: '',
                  description: '',
                  price: '',
                  compare_price: '',
                  stock_quantity: '',
                  category_id: '',
                  image_url: '',
                  is_active: true,
                  packing: '',
                  dosage: '',
                  benefits: [''],
                  ingredients: [{ name: '', quantity: '', description: '' }]
                })}
              >
                🔄 Clear Form
              </button>
            )}
          </div>
        </form>

        {/* Tips */}
        <div className="tips-card">
          <h3>💡 Saptnova Product Tips</h3>
          <ul>
            <li><strong>Product Name:</strong> Include product type and category (e.g., InsuWish – Ayurvedic Diabetes Care)</li>
            <li><strong>Tagline:</strong> Create a compelling one-liner highlighting key benefits</li>
            <li><strong>Benefits:</strong> List 4-6 key health benefits that customers care about</li>
            <li><strong>Ingredients:</strong> Include botanical names, quantities in Mg, and individual benefits</li>
            <li><strong>Dosage:</strong> Provide clear usage instructions with frequency and method</li>
            <li><strong>Pricing:</strong> Show both MRP and selling price to highlight savings</li>
            <li><strong>Packing:</strong> Clearly state weight/quantity and pricing details</li>
            <li><strong>Images:</strong> Use high-quality product photos with clear labeling</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VendorAddProduct;
