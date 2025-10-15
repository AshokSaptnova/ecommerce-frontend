import React, { useState, useEffect, useRef } from 'react';
import { vendorApi } from '../../services/vendorApi';
import '../../styles/VendorInventory.css';
import Toast from '../../../shared/components/Toast';

const VendorInventory = ({ vendorData }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editStock, setEditStock] = useState('');
  const [token] = useState(localStorage.getItem('vendorToken'));
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const fetchProducts = async () => {
    try {
      const data = await vendorApi.getProducts(vendorData.id, token);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  const handleStockUpdate = async (productId) => {
    try {
      await vendorApi.updateProduct(productId, { stock_quantity: parseInt(editStock) }, token);
      setProducts(products.map(p => 
        p.id === productId ? { ...p, stock_quantity: parseInt(editStock) } : p
      ));
      setEditingId(null);
      setEditStock('');
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
  // Export Inventory as CSV
  const handleExportInventory = () => {
    if (!products.length) {
      setToast({ message: 'No inventory to export.', type: 'error' });
      return;
    }
    const headers = ['Product Name', 'SKU', 'Stock', 'Price', 'Status'];
    const rows = products.map(p => [
      p.name,
      p.sku || '',
      p.stock_quantity,
      p.price,
      getStockStatus(p.stock_quantity).label
    ]);
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setToast({ message: 'Inventory exported successfully.', type: 'success' });
  };

  // Import Stock from CSV
  const handleImportStock = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      setToast({ message: 'Please upload a valid CSV file.', type: 'error' });
      return;
    }
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) {
        setToast({ message: 'CSV file is empty or invalid.', type: 'error' });
        return;
      }
      const header = lines[0].split(',');
      const nameIdx = header.indexOf('Product Name');
      const skuIdx = header.indexOf('SKU');
      const stockIdx = header.indexOf('Stock');
      const priceIdx = header.indexOf('Price');
      if (nameIdx === -1 || stockIdx === -1) {
        setToast({ message: 'CSV must have Product Name and Stock columns.', type: 'error' });
        return;
      }
      let updated = 0;
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',');
        const name = cols[nameIdx];
        const sku = skuIdx !== -1 ? cols[skuIdx] : '';
        const stock = parseInt(cols[stockIdx], 10);
        const price = priceIdx !== -1 ? parseFloat(cols[priceIdx]) : undefined;
        if (!name || isNaN(stock)) continue;
        // Find product by SKU or name
        const product = products.find(p => (sku ? p.sku === sku : p.name === name));
        if (product) {
          try {
            await vendorApi.updateProduct(product.id, {
              stock_quantity: stock,
              ...(price !== undefined ? { price } : {})
            }, token);
            updated++;
          } catch (err) {
            // skip errors for individual products
          }
        }
      }
      if (updated > 0) {
        setToast({ message: `Imported stock for ${updated} products.`, type: 'success' });
        fetchProducts();
      } else {
        setToast({ message: 'No matching products found to update.', type: 'info' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

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
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      <div className="page-header">
        <h1>Inventory Management</h1>
        <p>Track and manage your product stock levels</p>
      </div>
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
      <div className="inventory-actions">
        <h3>Quick Actions</h3>
        <div className="actions-row">
          <button className="action-btn" onClick={handleExportInventory}>
            <span className="icon">📊</span>
            <span>Export Inventory</span>
          </button>
          <button className="action-btn" onClick={() => fileInputRef.current.click()}>
            <span className="icon">📥</span>
            <span>Import Stock</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".csv"
            onChange={handleImportStock}
          />
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
  )
}


export default VendorInventory;