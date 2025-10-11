import React, { useState, useEffect } from 'react';
import '../../styles/VendorInventory.css';

const VendorInventory = ({ vendorData }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editStock, setEditStock] = useState('');
  const [token] = useState(localStorage.getItem('vendorToken'));

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/vendors/${vendorData.id}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (productId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stock_quantity: parseInt(editStock) })
      });

      if (response.ok) {
        setProducts(products.map(p => 
          p.id === productId ? { ...p, stock_quantity: parseInt(editStock) } : p
        ));
        setEditingId(null);
        setEditStock('');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { label: 'Out of Stock', class: 'out-of-stock' };
    if (quantity < 10) return { label: 'Low Stock', class: 'low-stock' };
    if (quantity < 50) return { label: 'Medium Stock', class: 'medium-stock' };
    return { label: 'In Stock', class: 'in-stock' };
  };

  const totalStock = products.reduce((sum, p) => sum + p.stock_quantity, 0);
  const lowStockCount = products.filter(p => p.stock_quantity < 10).length;
  const outOfStockCount = products.filter(p => p.stock_quantity === 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="vendor-inventory">
      <div className="page-header">
        <h1>Inventory Management</h1>
        <p>Track and manage your product stock levels</p>
      </div>

      {/* Inventory Stats */}
      <div className="inventory-stats">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{totalStock}</h3>
            <p>Total Units</p>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>{lowStockCount}</h3>
            <p>Low Stock Items</p>
          </div>
        </div>
        <div className="stat-card danger">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>{outOfStockCount}</h3>
            <p>Out of Stock</p>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>₹{totalValue.toFixed(2)}</h3>
            <p>Inventory Value</p>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Current Stock</th>
              <th>Status</th>
              <th>Price</th>
              <th>Stock Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const status = getStockStatus(product.stock_quantity);
              return (
                <tr key={product.id}>
                  <td className="product-cell">
                    <div className="product-info">
                      <strong>{product.name}</strong>
                    </div>
                  </td>
                  <td className="stock-cell">
                    {editingId === product.id ? (
                      <input
                        type="number"
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        className="stock-input"
                        min="0"
                        autoFocus
                      />
                    ) : (
                      <span className={status.class}>{product.stock_quantity}</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${status.class}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="price-cell">₹{product.price.toFixed(2)}</td>
                  <td className="value-cell">
                    ₹{(product.price * product.stock_quantity).toFixed(2)}
                  </td>
                  <td className="actions-cell">
                    {editingId === product.id ? (
                      <div className="edit-actions">
                        <button 
                          onClick={() => handleStockUpdate(product.id)}
                          className="btn-save"
                        >
                          ✓
                        </button>
                        <button 
                          onClick={() => {
                            setEditingId(null);
                            setEditStock('');
                          }}
                          className="btn-cancel"
                        >
                          ✗
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(product.id);
                          setEditStock(product.stock_quantity.toString());
                        }}
                        className="btn-edit-stock"
                      >
                        Edit Stock
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="inventory-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-btn">
            <span className="icon">📊</span>
            <span>Export Inventory</span>
          </button>
          <button className="action-btn">
            <span className="icon">📥</span>
            <span>Import Stock</span>
          </button>
          <button className="action-btn">
            <span className="icon">🔔</span>
            <span>Set Alerts</span>
          </button>
          <button className="action-btn">
            <span className="icon">📈</span>
            <span>Stock Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorInventory;
