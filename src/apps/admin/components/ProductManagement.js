import React, { useState, useEffect, useCallback } from 'react';
import '../styles/AdminShared.css';
import '../styles/ProductManagement.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    vendor_id: '',
    category_id: ''
  });
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);

  const token = localStorage.getItem('adminToken');

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.vendor_id) params.append('vendor_id', filters.vendor_id);

            const response = await fetch(`http://127.0.0.1:8000/admin/products?${params}`, {
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
      setError('Network error occurred');
      console.error('Fetch products error:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, token]);

  const fetchVendorsAndCategories = useCallback(async () => {
    try {
      const [vendorsRes, categoriesRes] = await Promise.all([
        fetch('${config.api.baseUrl}/admin/vendors', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('${config.api.baseUrl}/categories', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (vendorsRes.ok) {
        const vendorsData = await vendorsRes.json();
        setVendors(vendorsData);
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Error fetching vendors/categories:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchVendorsAndCategories();
  }, [fetchVendorsAndCategories]);

  const handleStatusUpdate = async (productId, newStatus) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/admin/products/${productId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchProducts(); // Refresh the list
        alert(`Product status updated to ${newStatus}`);
      } else {
        alert('Failed to update product status');
      }
    } catch (error) {
      alert('Error updating product status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#34c759';
      case 'inactive': return '#ff9500';
      case 'out_of_stock': return '#ff3b30';
      case 'discontinued': return '#8e8e93';
      default: return '#6e6e73';
    }
  };

  const getStockStatus = (product) => {
    if (!product.track_inventory) return 'Not Tracked';
    if (product.stock_quantity <= 0) return 'Out of Stock';
    if (product.stock_quantity <= product.low_stock_threshold) return 'Low Stock';
    return 'In Stock';
  };

  const getStockColor = (product) => {
    if (!product.track_inventory) return '#6e6e73';
    if (product.stock_quantity <= 0) return '#ff3b30';
    if (product.stock_quantity <= product.low_stock_threshold) return '#ff9500';
    return '#34c759';
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="product-management">
      <div className="page-header">
        <h2>Product Management</h2>
        <p>Manage all vendor products, approvals, and inventory</p>
      </div>

      {/* Quick Stats */}
      <div className="product-stats">
        <div className="stat-item">
          <span>Total Products</span>
          <strong>{products.length}</strong>
        </div>
        <div className="stat-item">
          <span>Active</span>
          <strong>{products.filter(p => p.status === 'active').length}</strong>
        </div>
        <div className="stat-item">
          <span>Pending Approval</span>
          <strong>{products.filter(p => p.status === 'inactive').length}</strong>
        </div>
        <div className="stat-item">
          <span>Low Stock</span>
          <strong>{products.filter(p => p.track_inventory && p.stock_quantity <= p.low_stock_threshold).length}</strong>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Filter by Status:</label>
          <select 
            value={filters.status} 
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="discontinued">Discontinued</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Filter by Vendor:</label>
          <select 
            value={filters.vendor_id} 
            onChange={(e) => setFilters({...filters, vendor_id: e.target.value})}
          >
            <option value="">All Vendors</option>
            {vendors.map(vendor => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.business_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Products Table */}
      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Vendor</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="product-info">
                  <div>
                    <strong className="product-name">{product.name}</strong>
                    <p className="product-desc">{product.short_description}</p>
                  </div>
                </td>
                <td className="sku">{product.sku}</td>
                <td className="vendor">{product.vendor?.business_name || 'N/A'}</td>
                <td className="price">
                  <div>
                    <strong>${product.price}</strong>
                    {product.compare_price && (
                      <span className="compare-price">${product.compare_price}</span>
                    )}
                  </div>
                </td>
                <td className="stock">
                  <div>
                    <span 
                      className="stock-status"
                      style={{ color: getStockColor(product) }}
                    >
                      {getStockStatus(product)}
                    </span>
                    {product.track_inventory && (
                      <span className="stock-qty">({product.stock_quantity})</span>
                    )}
                  </div>
                </td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ 
                      backgroundColor: `${getStatusColor(product.status)}20`,
                      color: getStatusColor(product.status),
                      border: `1px solid ${getStatusColor(product.status)}40`
                    }}
                  >
                    {product.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td>{new Date(product.created_at).toLocaleDateString()}</td>
                <td className="actions">
                  <div className="action-buttons">
                    <select
                      value={product.status}
                      onChange={(e) => handleStatusUpdate(product.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="out_of_stock">Out of Stock</option>
                      <option value="discontinued">Discontinued</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && !loading && (
        <div className="no-data">
          <p>No products found matching the current filters.</p>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;