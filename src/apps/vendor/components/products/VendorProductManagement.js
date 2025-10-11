import React, { useState, useEffect } from 'react';
import VendorAddProduct from './VendorAddProduct';
import '../../styles/VendorProductManagement.css';

const VendorProductManagement = ({ vendorData }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [token] = useState(localStorage.getItem('vendorToken'));
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (token && vendorData) {
      fetchProducts();
    }
  }, [token, vendorData]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/vendors/${vendorData.id}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      console.log(`🔄 Toggling product ${productId} status from ${currentStatus} to ${newStatus}`);
      
      const response = await fetch(`http://127.0.0.1:8000/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: newStatus
        })
      });

      if (response.ok) {
        // Update local state
        setProducts(products.map(p => 
          p.id === productId ? { ...p, status: newStatus } : p
        ));
        console.log(`✅ Product status updated successfully`);
        alert(`Product ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
      } else {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        console.error('❌ Failed to update product status:', response.status, errorData);
        alert(`Failed to update product status: ${errorData.detail || response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Error updating product:', error);
      alert('Error updating product status. Please check console for details.');
    }
  };

  const handleEdit = (product) => {
    // Set the product to edit mode
    setEditingProduct(product);
  };

  const handleSaveSuccess = () => {
    // Refresh products and exit edit mode
    fetchProducts();
    setEditingProduct(null);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Remove from local state
        setProducts(products.filter(p => p.id !== productId));
        alert('Product deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete product: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && product.status === 'active') ||
                         (filterStatus === 'inactive' && product.status === 'inactive') ||
                         (filterStatus === 'low-stock' && product.stock_quantity < 10);
    return matchesSearch && matchesFilter;
  });

  // If editing a product, show the edit form
  if (editingProduct) {
    return (
      <div>
        <button 
          onClick={handleCancelEdit}
          style={{
            marginBottom: '1rem',
            padding: '0.75rem 1.5rem',
            background: '#f5f5f7',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          ← Back to Products
        </button>
        <VendorAddProduct 
          vendorData={vendorData} 
          editProduct={editingProduct}
          onSaveSuccess={handleSaveSuccess}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="vendor-product-management">
      <div className="page-header">
        <h1>My Products</h1>
        <p>Manage your product inventory</p>
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {/* Filters and Search */}
      <div className="controls-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-buttons">
          <button 
            className={filterStatus === 'all' ? 'active' : ''}
            onClick={() => setFilterStatus('all')}
          >
            All ({products.length})
          </button>
          <button 
            className={filterStatus === 'active' ? 'active' : ''}
            onClick={() => setFilterStatus('active')}
          >
            Active ({products.filter(p => p.status === 'active').length})
          </button>
          <button 
            className={filterStatus === 'inactive' ? 'active' : ''}
            onClick={() => setFilterStatus('inactive')}
          >
            Inactive ({products.filter(p => p.status === 'inactive').length})
          </button>
          <button 
            className={filterStatus === 'low-stock' ? 'active' : ''}
            onClick={() => setFilterStatus('low-stock')}
          >
            Low Stock ({products.filter(p => p.stock_quantity < 10).length})
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0].image_url} alt={product.name} />
                ) : (
                  <div className="placeholder-image">📦</div>
                )}
              </div>

              <div className="product-details">
                <h3>{product.name}</h3>
                <p className="product-description">
                  {product.description?.substring(0, 100)}
                  {product.description?.length > 100 && '...'}
                </p>

                <div className="product-info-row">
                  <div className="info-item">
                    <span className="label">Price:</span>
                    <span className="value price">₹{product.price.toFixed(2)}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Stock:</span>
                    <span className={`value ${product.stock_quantity < 10 ? 'low-stock' : ''}`}>
                      {product.stock_quantity}
                    </span>
                  </div>
                </div>

                <div className="product-actions">
                  <button 
                    className={`status-toggle ${product.status === 'active' ? 'active' : 'inactive'}`}
                    onClick={() => handleToggleStatus(product.id, product.status)}
                    title={product.status === 'active' ? 'Click to deactivate' : 'Click to activate'}
                  >
                    {product.status === 'active' ? '✓ Active' : '✗ Inactive'}
                  </button>
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(product)}
                    title="Edit product"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(product.id, product.name)}
                    title="Delete product"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-products">
          <div className="no-products-icon">📦</div>
          <h2>No products found</h2>
          <p>
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Add your first product to get started!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default VendorProductManagement;
